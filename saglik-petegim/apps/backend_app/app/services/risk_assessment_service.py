"""Risk assessment service for social determinants and health risks."""

from datetime import date, datetime
from typing import Dict, List, Optional, Tuple, Any
from uuid import UUID

import structlog
from sqlalchemy import select, and_, desc, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.bright_futures import RiskAssessment, RiskLevel, BrightFuturesVisit
from app.schemas.bright_futures import (
    RiskAssessmentCreate, RiskAssessmentUpdate,
    RiskAssessmentTemplate, PatientRiskProfile, RiskScreeningQuestionnaire
)
from app.api.deps import PaginationParams
from app.utils.exceptions import NotFoundError, ValidationError, AuthorizationError

logger = structlog.get_logger()


class RiskAssessmentService:
    """Service for managing risk assessments and social determinants screening."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    # ==================== Risk Assessment Templates ====================
    
    async def get_risk_assessment_templates(
        self,
        assessment_type: Optional[str] = None,
        assessment_domain: Optional[str] = None,
        language: str = "tr"
    ) -> List[RiskAssessmentTemplate]:
        """Get risk assessment templates."""
        
        # Placeholder implementation - would load from database
        templates = self._get_default_risk_templates(language)
        
        if assessment_type:
            templates = [t for t in templates if t.get("assessment_type") == assessment_type]
        
        if assessment_domain:
            templates = [t for t in templates if t.get("assessment_domain") == assessment_domain]
        
        return [RiskAssessmentTemplate(**template) for template in templates]
    
    async def get_template_by_id(
        self, 
        template_id: UUID, 
        language: str = "tr"
    ) -> Optional[RiskAssessmentTemplate]:
        """Get risk assessment template by ID."""
        
        templates = await self.get_risk_assessment_templates(language=language)
        for template in templates:
            if str(template.id) == str(template_id):
                return template
        
        return None
    
    def _get_default_risk_templates(self, language: str) -> List[Dict[str, Any]]:
        """Get default risk assessment templates."""
        
        if language == "tr":
            return [
                {
                    "id": "food-security",
                    "assessment_type": "Social",
                    "assessment_domain": "Food Security", 
                    "name": "Gıda Güvencesi Değerlendirmesi",
                    "description": "Ailenin gıdaya erişim durumunu değerlendirir",
                    "questions": [
                        "Son 30 günde gıda alım güçlüğü yaşadınız mı?",
                        "Çocuğunuz için yeterli besleyici gıdaya erişiminiz var mı?",
                        "Mali sebeplerle öğün atlamak zorunda kaldınız mı?"
                    ],
                    "risk_indicators": ["Evet yanıtı 2 veya daha fazla soru için"],
                    "interventions": [
                        "Gıda yardım programlarına yönlendirme",
                        "WIC programı başvurusu",
                        "Beslenme danışmanlığı"
                    ]
                },
                {
                    "id": "housing-stability",
                    "assessment_type": "Social",
                    "assessment_domain": "Housing",
                    "name": "Konut Güvencesi Değerlendirmesi", 
                    "description": "Konut durumu ve istikrarını değerlendirir",
                    "questions": [
                        "Konut durumunuz güvenli ve istikrarlı mı?",
                        "Son 12 ayda taşınmak zorunda kaldınız mı?",
                        "Konut masrafları gelirinizin %30'undan fazlası mı?"
                    ],
                    "risk_indicators": ["Konut güvencesizliği belirtileri"],
                    "interventions": [
                        "Konut yardım programları",
                        "Yasal danışmanlık",
                        "Sosyal hizmetler desteği"
                    ]
                }
            ]
        else:
            return [
                {
                    "id": "food-security",
                    "assessment_type": "Social",
                    "assessment_domain": "Food Security",
                    "name": "Food Security Assessment",
                    "description": "Assesses family's access to adequate food",
                    "questions": [
                        "Have you had difficulty accessing food in the past 30 days?",
                        "Do you have access to adequate nutritious food for your child?",
                        "Have you had to skip meals due to financial reasons?"
                    ],
                    "risk_indicators": ["Yes answer to 2 or more questions"],
                    "interventions": [
                        "Referral to food assistance programs",
                        "WIC program application",
                        "Nutrition counseling"
                    ]
                }
            ]
    
    async def get_screening_questionnaire(
        self,
        assessment_type: str,
        language: str = "tr"
    ) -> Optional[RiskScreeningQuestionnaire]:
        """Get screening questionnaire for assessment type."""
        
        templates = await self.get_risk_assessment_templates(
            assessment_type=assessment_type, 
            language=language
        )
        
        if not templates:
            return None
        
        # Combine questions from all templates of this type
        all_questions = []
        all_interventions = []
        
        for template in templates:
            all_questions.extend(template.questions)
            all_interventions.extend(template.interventions)
        
        questionnaire = RiskScreeningQuestionnaire(
            assessment_type=assessment_type,
            title=f"{assessment_type} Risk Screening" if language != "tr" 
                  else f"{assessment_type} Risk Değerlendirmesi",
            description=f"Screening for {assessment_type.lower()} risk factors",
            questions=all_questions,
            scoring_guide="Rate each area as Low, Moderate, High, or Critical risk",
            intervention_options=list(set(all_interventions)),
            language=language
        )
        
        return questionnaire
    
    # ==================== Risk Assessment Records ====================
    
    async def build_risk_assessment_filters(
        self,
        current_user: User,
        visit_id: Optional[UUID] = None,
        patient_id: Optional[UUID] = None,
        assessment_type: Optional[str] = None,
        assessment_domain: Optional[str] = None,
        risk_level: Optional[RiskLevel] = None,
        unresolved_only: bool = False
    ) -> List:
        """Build filters for risk assessment queries."""
        
        filters = []
        
        # Base permission filtering
        if current_user.role == UserRole.PARENT:
            # Parents can only see their own patients' risk assessments
            stmt = select(Patient.id).where(Patient.parent_id == current_user.id)
            result = await self.db.execute(stmt)
            accessible_patients = [row[0] for row in result.fetchall()]
            
            filters.append(
                RiskAssessment.visit_id.in_(
                    select(BrightFuturesVisit.id).where(
                        BrightFuturesVisit.patient_id.in_(accessible_patients)
                    )
                )
            )
        
        # Specific filters
        if visit_id:
            filters.append(RiskAssessment.visit_id == visit_id)
        
        if patient_id:
            filters.append(
                RiskAssessment.visit_id.in_(
                    select(BrightFuturesVisit.id).where(
                        BrightFuturesVisit.patient_id == patient_id
                    )
                )
            )
        
        if assessment_type:
            filters.append(RiskAssessment.assessment_type == assessment_type)
        
        if assessment_domain:
            filters.append(RiskAssessment.assessment_domain == assessment_domain)
        
        if risk_level:
            filters.append(RiskAssessment.risk_level == risk_level)
        
        if unresolved_only:
            filters.append(RiskAssessment.resolved == False)
        
        return filters
    
    async def list_risk_assessments_paginated(
        self,
        filters: List,
        pagination: PaginationParams
    ) -> Tuple[List[RiskAssessment], int]:
        """List risk assessments with pagination."""
        
        # Build base query
        stmt = select(RiskAssessment).options(
            selectinload(RiskAssessment.visit)
        )
        
        # Apply filters
        if filters:
            stmt = stmt.where(and_(*filters))
        
        # Get total count
        count_stmt = select(func.count(RiskAssessment.id))
        if filters:
            count_stmt = count_stmt.where(and_(*filters))
        
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar()
        
        # Apply sorting
        stmt = stmt.order_by(
            RiskAssessment.risk_level.desc(),
            desc(RiskAssessment.created_at)
        )
        
        # Apply pagination
        stmt = stmt.offset(pagination.offset).limit(pagination.limit)
        
        result = await self.db.execute(stmt)
        assessments = result.scalars().all()
        
        return assessments, total
    
    async def validate_risk_assessment_creation(
        self,
        visit_id: UUID,
        assessment_type: str,
        current_user: User
    ) -> None:
        """Validate risk assessment creation."""
        
        # Check if visit exists and user has access
        visit = await self.get_accessible_visit(visit_id, current_user)
        if not visit:
            raise NotFoundError("Visit not found or access denied")
    
    async def create_risk_assessment(
        self,
        assessment_data: RiskAssessmentCreate,
        created_by_id: UUID
    ) -> RiskAssessment:
        """Create risk assessment record."""
        
        assessment = RiskAssessment(
            visit_id=assessment_data.visit_id,
            assessment_type=assessment_data.assessment_type,
            assessment_domain=assessment_data.assessment_domain,
            risk_level=assessment_data.risk_level,
            risk_factors=assessment_data.risk_factors,
            protective_factors=assessment_data.protective_factors,
            interventions_recommended=assessment_data.interventions_recommended,
            resources_provided=assessment_data.resources_provided,
            referrals_made=assessment_data.referrals_made,
            follow_up_date=assessment_data.follow_up_date,
            notes=assessment_data.notes,
            resolved=False,
            created_by_id=created_by_id
        )
        
        self.db.add(assessment)
        await self.db.flush()
        await self.db.refresh(assessment)
        
        return assessment
    
    async def get_assessment_with_access_check(
        self,
        assessment_id: UUID,
        current_user: User
    ) -> Optional[RiskAssessment]:
        """Get risk assessment with access check."""
        
        stmt = select(RiskAssessment).options(
            selectinload(RiskAssessment.visit).selectinload(BrightFuturesVisit.patient)
        ).where(RiskAssessment.id == assessment_id)
        
        result = await self.db.execute(stmt)
        assessment = result.scalar_one_or_none()
        
        if not assessment:
            return None
        
        # Check access permissions
        if not await self.can_access_assessment(assessment, current_user):
            return None
            
        return assessment
    
    async def get_assessment_for_update(
        self,
        assessment_id: UUID,
        current_user: User
    ) -> Optional[RiskAssessment]:
        """Get assessment for update operations."""
        
        assessment = await self.get_assessment_with_access_check(assessment_id, current_user)
        
        if not assessment:
            return None
        
        # Check edit permissions
        if not await self.can_edit_assessment(assessment, current_user):
            return None
            
        return assessment
    
    async def update_risk_assessment(
        self,
        assessment: RiskAssessment,
        assessment_update: RiskAssessmentUpdate,
        updated_by_id: UUID
    ) -> RiskAssessment:
        """Update risk assessment."""
        
        # Update fields
        if assessment_update.risk_level is not None:
            assessment.risk_level = assessment_update.risk_level
        
        if assessment_update.risk_factors is not None:
            assessment.risk_factors = assessment_update.risk_factors
        
        if assessment_update.protective_factors is not None:
            assessment.protective_factors = assessment_update.protective_factors
        
        if assessment_update.interventions_recommended is not None:
            assessment.interventions_recommended = assessment_update.interventions_recommended
        
        if assessment_update.resources_provided is not None:
            assessment.resources_provided = assessment_update.resources_provided
        
        if assessment_update.referrals_made is not None:
            assessment.referrals_made = assessment_update.referrals_made
        
        if assessment_update.follow_up_date is not None:
            assessment.follow_up_date = assessment_update.follow_up_date
        
        if assessment_update.notes is not None:
            assessment.notes = assessment_update.notes
        
        if assessment_update.resolved is not None:
            assessment.resolved = assessment_update.resolved
        
        # Update tracking fields
        assessment.updated_by_id = updated_by_id
        assessment.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(assessment)
        
        return assessment
    
    async def delete_risk_assessment(self, assessment: RiskAssessment) -> None:
        """Delete risk assessment."""
        
        await self.db.delete(assessment)
        await self.db.flush()
    
    # ==================== Patient Risk Profile ====================
    
    async def generate_patient_risk_profile(self, patient_id: UUID) -> PatientRiskProfile:
        """Generate comprehensive risk profile for patient."""
        
        # Get all risk assessments for patient
        assessments_stmt = select(RiskAssessment).join(BrightFuturesVisit).where(
            BrightFuturesVisit.patient_id == patient_id
        ).order_by(desc(RiskAssessment.created_at))
        
        result = await self.db.execute(assessments_stmt)
        assessments = result.scalars().all()
        
        # Calculate risk statistics
        active_risks = [a for a in assessments if not a.resolved]
        high_risks = [a for a in active_risks if a.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]]
        
        # Group by domain
        risk_by_domain = {}
        for assessment in active_risks:
            domain = assessment.assessment_domain
            if domain not in risk_by_domain:
                risk_by_domain[domain] = []
            risk_by_domain[domain].append({
                "assessment_id": assessment.id,
                "risk_level": assessment.risk_level.value,
                "risk_factors": assessment.risk_factors or [],
                "last_assessed": assessment.created_at
            })
        
        # Recent interventions
        recent_interventions = []
        for assessment in assessments[:10]:  # Last 10 assessments
            if assessment.interventions_recommended:
                recent_interventions.extend(assessment.interventions_recommended)
        
        profile = PatientRiskProfile(
            patient_id=patient_id,
            total_risk_assessments=len(assessments),
            active_risks_count=len(active_risks),
            high_risk_count=len(high_risks),
            resolved_risks_count=len([a for a in assessments if a.resolved]),
            risk_by_domain=risk_by_domain,
            recent_interventions=list(set(recent_interventions[:10])),  # Unique, top 10
            last_assessment_date=assessments[0].created_at if assessments else None,
            next_assessment_due=self._calculate_next_assessment_due(assessments),
            overall_risk_level=self._calculate_overall_risk_level(active_risks),
            generated_at=datetime.utcnow()
        )
        
        return profile
    
    async def get_active_risks_for_patient(self, patient_id: UUID) -> List[RiskAssessment]:
        """Get active risk assessments for patient."""
        
        stmt = select(RiskAssessment).join(BrightFuturesVisit).where(
            and_(
                BrightFuturesVisit.patient_id == patient_id,
                RiskAssessment.resolved == False
            )
        ).order_by(RiskAssessment.risk_level.desc())
        
        result = await self.db.execute(stmt)
        return result.scalars().all()
    
    # ==================== Comprehensive Screening ====================
    
    async def perform_comprehensive_screening(
        self,
        patient: Patient,
        visit_id: Optional[UUID],
        screening_responses: Dict[str, Any],
        screened_by_id: UUID
    ) -> List[RiskAssessment]:
        """Perform comprehensive risk screening."""
        
        assessments = []
        
        # Social determinants screening
        social_assessment = await self._assess_social_determinants(
            screening_responses, visit_id, screened_by_id
        )
        if social_assessment:
            assessments.append(social_assessment)
        
        # Environmental risk screening
        environmental_assessment = await self._assess_environmental_risks(
            screening_responses, visit_id, screened_by_id
        )
        if environmental_assessment:
            assessments.append(environmental_assessment)
        
        # Developmental risk screening
        developmental_assessment = await self._assess_developmental_risks(
            screening_responses, visit_id, screened_by_id
        )
        if developmental_assessment:
            assessments.append(developmental_assessment)
        
        await self.db.commit()
        return assessments
    
    async def _assess_social_determinants(
        self,
        responses: Dict[str, Any],
        visit_id: Optional[UUID],
        screened_by_id: UUID
    ) -> Optional[RiskAssessment]:
        """Assess social determinants of health."""
        
        # Analyze responses for social risk indicators
        risk_factors = []
        risk_level = RiskLevel.LOW
        
        # Food security
        if responses.get("food_insecurity", False):
            risk_factors.append("Food insecurity")
            risk_level = RiskLevel.MODERATE
        
        # Housing instability
        if responses.get("housing_instability", False):
            risk_factors.append("Housing instability")
            risk_level = RiskLevel.HIGH
        
        # Financial hardship
        if responses.get("financial_hardship", False):
            risk_factors.append("Financial hardship")
        
        if risk_factors:
            assessment_data = RiskAssessmentCreate(
                visit_id=visit_id,
                assessment_type="Social",
                assessment_domain="Social Determinants",
                risk_level=risk_level,
                risk_factors=risk_factors,
                interventions_recommended=self._get_social_interventions(risk_factors),
                notes="Comprehensive social determinants screening"
            )
            
            return await self.create_risk_assessment(assessment_data, screened_by_id)
        
        return None
    
    async def _assess_environmental_risks(
        self,
        responses: Dict[str, Any],
        visit_id: Optional[UUID],
        screened_by_id: UUID
    ) -> Optional[RiskAssessment]:
        """Assess environmental risk factors."""
        
        risk_factors = []
        risk_level = RiskLevel.LOW
        
        # Lead exposure
        if responses.get("lead_exposure_risk", False):
            risk_factors.append("Lead exposure risk")
            risk_level = RiskLevel.HIGH
        
        # Secondhand smoke
        if responses.get("secondhand_smoke", False):
            risk_factors.append("Secondhand smoke exposure")
            risk_level = RiskLevel.MODERATE
        
        if risk_factors:
            assessment_data = RiskAssessmentCreate(
                visit_id=visit_id,
                assessment_type="Environmental",
                assessment_domain="Environmental Hazards",
                risk_level=risk_level,
                risk_factors=risk_factors,
                interventions_recommended=self._get_environmental_interventions(risk_factors),
                notes="Environmental risk screening"
            )
            
            return await self.create_risk_assessment(assessment_data, screened_by_id)
        
        return None
    
    async def _assess_developmental_risks(
        self,
        responses: Dict[str, Any],
        visit_id: Optional[UUID],
        screened_by_id: UUID
    ) -> Optional[RiskAssessment]:
        """Assess developmental risk factors."""
        
        risk_factors = []
        risk_level = RiskLevel.LOW
        
        # Developmental delays
        if responses.get("developmental_concerns", False):
            risk_factors.append("Developmental concerns")
            risk_level = RiskLevel.MODERATE
        
        # Behavioral concerns
        if responses.get("behavioral_concerns", False):
            risk_factors.append("Behavioral concerns")
        
        if risk_factors:
            assessment_data = RiskAssessmentCreate(
                visit_id=visit_id,
                assessment_type="Developmental",
                assessment_domain="Developmental Risk",
                risk_level=risk_level,
                risk_factors=risk_factors,
                interventions_recommended=self._get_developmental_interventions(risk_factors),
                notes="Developmental risk screening"
            )
            
            return await self.create_risk_assessment(assessment_data, screened_by_id)
        
        return None
    
    # ==================== Risk Resolution ====================
    
    async def resolve_risk_assessment(
        self,
        assessment: RiskAssessment,
        resolution_notes: str,
        resolved_by_id: UUID
    ) -> RiskAssessment:
        """Resolve risk assessment."""
        
        assessment.resolved = True
        assessment.notes = assessment.notes + f"\n\nResolved: {resolution_notes}" if assessment.notes else f"Resolved: {resolution_notes}"
        assessment.updated_by_id = resolved_by_id
        assessment.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(assessment)
        
        return assessment
    
    async def add_risk_interventions(
        self,
        assessment: RiskAssessment,
        interventions: List[str],
        resources_provided: List[str],
        referrals_made: List[str],
        added_by_id: UUID
    ) -> RiskAssessment:
        """Add interventions to risk assessment."""
        
        # Merge with existing interventions
        existing_interventions = assessment.interventions_recommended or []
        assessment.interventions_recommended = list(set(existing_interventions + interventions))
        
        existing_resources = assessment.resources_provided or []
        assessment.resources_provided = list(set(existing_resources + resources_provided))
        
        existing_referrals = assessment.referrals_made or []
        assessment.referrals_made = list(set(existing_referrals + referrals_made))
        
        assessment.updated_by_id = added_by_id
        assessment.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(assessment)
        
        return assessment
    
    # ==================== Batch Operations ====================
    
    async def validate_batch_risk_assessment_creation(
        self,
        visit_id: UUID,
        template_ids: List[UUID],
        current_user: User
    ) -> None:
        """Validate batch risk assessment creation."""
        
        # Check visit access
        visit = await self.get_accessible_visit(visit_id, current_user)
        if not visit:
            raise NotFoundError("Visit not found or access denied")
        
        # Validate templates
        for template_id in template_ids:
            template = await self.get_template_by_id(template_id)
            if not template:
                raise NotFoundError(f"Risk assessment template {template_id} not found")
    
    async def batch_create_risk_assessments(
        self,
        visit_id: UUID,
        template_ids: List[UUID],
        screening_responses: Dict[str, Any],
        created_by_id: UUID
    ) -> List[RiskAssessment]:
        """Create multiple risk assessments from templates."""
        
        assessments = []
        
        for template_id in template_ids:
            template = await self.get_template_by_id(template_id)
            if template:
                # Analyze responses for this template's domain
                risk_level = self._analyze_template_responses(template, screening_responses)
                
                assessment_data = RiskAssessmentCreate(
                    visit_id=visit_id,
                    assessment_type=template.assessment_type,
                    assessment_domain=template.assessment_domain,
                    risk_level=risk_level,
                    risk_factors=template.risk_indicators,
                    interventions_recommended=template.interventions,
                    notes=f"Assessment from template: {template.name}"
                )
                
                assessment = await self.create_risk_assessment(assessment_data, created_by_id)
                assessments.append(assessment)
        
        await self.db.commit()
        return assessments
    
    # ==================== Social Determinants ====================
    
    async def get_social_determinants_domains(self, language: str = "tr") -> List[Dict[str, str]]:
        """Get social determinants of health domains."""
        
        if language == "tr":
            return [
                {"id": "food_security", "name": "Gıda Güvencesi", "description": "Beslenme erişimi"},
                {"id": "housing", "name": "Barınma", "description": "Konut durumu ve güvenliği"},
                {"id": "transportation", "name": "Ulaşım", "description": "Sağlık hizmetlerine erişim"},
                {"id": "education", "name": "Eğitim", "description": "Eğitim fırsatları"},
                {"id": "employment", "name": "İstihdam", "description": "İş güvencesi ve gelir"},
                {"id": "social_support", "name": "Sosyal Destek", "description": "Aile ve toplum desteği"}
            ]
        else:
            return [
                {"id": "food_security", "name": "Food Security", "description": "Access to adequate nutrition"},
                {"id": "housing", "name": "Housing", "description": "Housing stability and safety"},
                {"id": "transportation", "name": "Transportation", "description": "Access to healthcare"},
                {"id": "education", "name": "Education", "description": "Educational opportunities"},
                {"id": "employment", "name": "Employment", "description": "Job security and income"},
                {"id": "social_support", "name": "Social Support", "description": "Family and community support"}
            ]
    
    async def get_social_determinants_questionnaire(self, language: str = "tr") -> RiskScreeningQuestionnaire:
        """Get comprehensive social determinants questionnaire."""
        
        if language == "tr":
            questions = [
                "Son 12 ayda gıda temin etmekte güçlük çektiniz mi?",
                "Konut durumunuz güvenli ve istikrarlı mı?",
                "Sağlık randevularına ulaşımda sorun yaşıyor musunuz?",
                "Geliriniz temel ihtiyaçlarınızı karşılıyor mu?",
                "Zor zamanlarda yardım alabileceğiniz insanlar var mı?",
                "Çocuğunuzun eğitimi için endişeleriniz var mı?"
            ]
            title = "Sosyal Belirleyiciler Tarama Anketi"
            description = "Sağlığı etkileyen sosyal faktörlerin değerlendirilmesi"
        else:
            questions = [
                "Have you had difficulty obtaining food in the past 12 months?",
                "Is your housing situation safe and stable?",
                "Do you have problems with transportation to health appointments?",
                "Does your income meet your basic needs?",
                "Do you have people you can turn to for help in difficult times?",
                "Do you have concerns about your child's education?"
            ]
            title = "Social Determinants Screening Questionnaire"
            description = "Assessment of social factors affecting health"
        
        return RiskScreeningQuestionnaire(
            assessment_type="Social Determinants",
            title=title,
            description=description,
            questions=questions,
            scoring_guide="Rate each domain based on risk level",
            intervention_options=self._get_social_intervention_options(language),
            language=language
        )
    
    # ==================== Analytics ====================
    
    async def get_risk_distribution_analytics(
        self,
        current_user: User,
        assessment_type: Optional[str] = None,
        assessment_domain: Optional[str] = None,
        days: int = 90
    ) -> Dict[str, Any]:
        """Get risk distribution analytics."""
        
        # Placeholder implementation
        return {
            "period_days": days,
            "assessment_type": assessment_type,
            "assessment_domain": assessment_domain,
            "risk_distribution": {
                "low": 60,
                "moderate": 25,
                "high": 12,
                "critical": 3
            },
            "total_assessments": 100
        }
    
    async def get_intervention_effectiveness_analytics(
        self,
        current_user: User,
        intervention_type: Optional[str] = None,
        days: int = 180
    ) -> Dict[str, Any]:
        """Get intervention effectiveness analytics."""
        
        # Placeholder implementation
        return {
            "period_days": days,
            "intervention_type": intervention_type,
            "resolution_rate": 0.75,
            "average_resolution_time_days": 30,
            "most_effective_interventions": []
        }
    
    async def get_high_risk_patients_summary(
        self,
        current_user: User,
        assessment_domain: Optional[str] = None,
        unresolved_only: bool = True
    ) -> Dict[str, Any]:
        """Get high-risk patients summary."""
        
        # Placeholder implementation
        return {
            "assessment_domain": assessment_domain,
            "unresolved_only": unresolved_only,
            "high_risk_count": 15,
            "critical_risk_count": 3,
            "needs_immediate_attention": 5
        }
    
    async def get_intervention_resources(
        self,
        resource_type: Optional[str] = None,
        assessment_domain: Optional[str] = None,
        language: str = "tr"
    ) -> List[Dict[str, Any]]:
        """Get intervention resources."""
        
        if language == "tr":
            return [
                {
                    "name": "Sosyal Yardım Programları",
                    "type": "Government Program",
                    "domain": "Social",
                    "contact": "Sosyal Hizmetler Merkezi",
                    "description": "Mali destek ve gıda yardımı"
                },
                {
                    "name": "Aile Danışma Merkezi",
                    "type": "Counseling Service",
                    "domain": "Family Support",
                    "contact": "Yerel sağlık müdürlüğü",
                    "description": "Aile desteği ve danışmanlık hizmetleri"
                }
            ]
        else:
            return [
                {
                    "name": "Social Assistance Programs",
                    "type": "Government Program", 
                    "domain": "Social",
                    "contact": "Social Services Center",
                    "description": "Financial support and food assistance"
                }
            ]
    
    # ==================== Helper Methods ====================
    
    def _analyze_template_responses(
        self, 
        template: RiskAssessmentTemplate, 
        responses: Dict[str, Any]
    ) -> RiskLevel:
        """Analyze responses to determine risk level for template."""
        
        # Simplified risk analysis
        risk_indicators = len([r for r in responses.values() if r])
        
        if risk_indicators == 0:
            return RiskLevel.LOW
        elif risk_indicators <= 2:
            return RiskLevel.MODERATE
        elif risk_indicators <= 4:
            return RiskLevel.HIGH
        else:
            return RiskLevel.CRITICAL
    
    def _calculate_next_assessment_due(self, assessments: List[RiskAssessment]) -> Optional[date]:
        """Calculate when next assessment is due."""
        
        if not assessments:
            return None
        
        # Simple logic: next assessment due 3 months after last one
        last_assessment = assessments[0]
        return date.today() + timedelta(days=90)
    
    def _calculate_overall_risk_level(self, active_risks: List[RiskAssessment]) -> str:
        """Calculate overall risk level from active risks."""
        
        if not active_risks:
            return "low"
        
        # Highest risk level among active risks
        risk_levels = [r.risk_level for r in active_risks]
        
        if RiskLevel.CRITICAL in risk_levels:
            return "critical"
        elif RiskLevel.HIGH in risk_levels:
            return "high"
        elif RiskLevel.MODERATE in risk_levels:
            return "moderate"
        else:
            return "low"
    
    def _get_social_interventions(self, risk_factors: List[str]) -> List[str]:
        """Get interventions for social risk factors."""
        
        interventions = []
        
        if "Food insecurity" in risk_factors:
            interventions.extend(["Food assistance programs", "WIC referral", "Nutrition counseling"])
        
        if "Housing instability" in risk_factors:
            interventions.extend(["Housing assistance", "Social services referral"])
        
        if "Financial hardship" in risk_factors:
            interventions.extend(["Financial counseling", "Government assistance programs"])
        
        return interventions
    
    def _get_environmental_interventions(self, risk_factors: List[str]) -> List[str]:
        """Get interventions for environmental risk factors."""
        
        interventions = []
        
        if "Lead exposure risk" in risk_factors:
            interventions.extend(["Lead testing", "Environmental health assessment"])
        
        if "Secondhand smoke exposure" in risk_factors:
            interventions.extend(["Smoking cessation resources", "Home environment assessment"])
        
        return interventions
    
    def _get_developmental_interventions(self, risk_factors: List[str]) -> List[str]:
        """Get interventions for developmental risk factors."""
        
        interventions = []
        
        if "Developmental concerns" in risk_factors:
            interventions.extend(["Early intervention referral", "Developmental assessment"])
        
        if "Behavioral concerns" in risk_factors:
            interventions.extend(["Behavioral health referral", "Parent training"])
        
        return interventions
    
    def _get_social_intervention_options(self, language: str) -> List[str]:
        """Get social intervention options."""
        
        if language == "tr":
            return [
                "Gıda yardım programları",
                "Konut desteği",
                "Ulaşım yardımı", 
                "Mali danışmanlık",
                "Sosyal hizmetler yönlendirmesi",
                "Aile desteği programları"
            ]
        else:
            return [
                "Food assistance programs",
                "Housing support",
                "Transportation assistance",
                "Financial counseling",
                "Social services referral",
                "Family support programs"
            ]
    
    async def can_access_assessment(self, assessment: RiskAssessment, user: User) -> bool:
        """Check if user can access risk assessment."""
        
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        if user.role == UserRole.PARENT:
            # Check if this is their child's assessment
            if hasattr(assessment, 'visit') and hasattr(assessment.visit, 'patient'):
                return assessment.visit.patient.parent_id == user.id
        
        return False
    
    async def can_edit_assessment(self, assessment: RiskAssessment, user: User) -> bool:
        """Check if user can edit risk assessment."""
        
        # Healthcare professionals can edit
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        return False
    
    async def get_accessible_visit(self, visit_id: UUID, user: User) -> Optional[BrightFuturesVisit]:
        """Get visit if user has access."""
        
        stmt = select(BrightFuturesVisit).options(
            selectinload(BrightFuturesVisit.patient)
        ).where(BrightFuturesVisit.id == visit_id)
        
        result = await self.db.execute(stmt)
        visit = result.scalar_one_or_none()
        
        if not visit:
            return None
        
        # Check access permissions
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return visit
        
        if user.role == UserRole.PARENT and visit.patient.parent_id == user.id:
            return visit
        
        return None