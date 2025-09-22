"""Screening tools service for Bright Futures assessments."""

import json
from datetime import date, datetime
from typing import Dict, List, Optional, Tuple, Any
from uuid import UUID

import structlog
from sqlalchemy import select, and_, or_, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.bright_futures import (
    ScreeningAssessment, ScreeningTool, BrightFuturesVisit,
    ScreeningStatus, RiskLevel
)
from app.schemas.bright_futures import (
    ScreeningAssessmentCreate, ScreeningAssessmentUpdate
)
from app.api.deps import PaginationParams
from app.utils.exceptions import NotFoundError, ValidationError, AuthorizationError
from app.core.security import PermissionChecker

logger = structlog.get_logger()


class ScreeningService:
    """Service for managing screening assessments and tools."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    # ==================== Screening Tools ====================
    
    async def get_available_screening_tools(
        self, 
        active_only: bool = True,
        age_months: Optional[int] = None
    ) -> List[ScreeningTool]:
        """Get available screening tools with optional filtering."""
        
        stmt = select(ScreeningTool)
        
        if active_only:
            stmt = stmt.where(ScreeningTool.is_active == True)
            
        if age_months is not None:
            stmt = stmt.where(
                and_(
                    ScreeningTool.min_age_months <= age_months,
                    ScreeningTool.max_age_months >= age_months
                )
            )
        
        stmt = stmt.order_by(ScreeningTool.tool_name)
        
        result = await self.db.execute(stmt)
        return result.scalars().all()
    
    async def get_screening_tool_by_name(
        self, 
        tool_name: str, 
        language: str = "tr"
    ) -> Optional[ScreeningTool]:
        """Get screening tool configuration by name."""
        
        stmt = select(ScreeningTool).where(
            and_(
                ScreeningTool.tool_name == tool_name,
                ScreeningTool.is_active == True
            )
        )
        
        result = await self.db.execute(stmt)
        tool = result.scalar_one_or_none()
        
        if tool and language in tool.available_languages:
            # Add language-specific content if needed
            pass
            
        return tool
    
    # ==================== Assessment Management ====================
    
    async def build_assessment_filters(
        self,
        current_user: User,
        visit_id: Optional[UUID] = None,
        screening_tool: Optional[str] = None,
        screening_status: Optional[str] = None,
        patient_id: Optional[UUID] = None
    ) -> List:
        """Build filters for assessment queries based on user permissions."""
        
        filters = []
        
        # Base permission filtering
        if current_user.role == UserRole.PARENT:
            # Parents can only see their own patients' assessments
            stmt = select(Patient.id).where(Patient.parent_id == current_user.id)
            result = await self.db.execute(stmt)
            accessible_patients = [row[0] for row in result.fetchall()]
            
            # Join with visits to get patient access
            filters.append(
                ScreeningAssessment.visit_id.in_(
                    select(BrightFuturesVisit.id).where(
                        BrightFuturesVisit.patient_id.in_(accessible_patients)
                    )
                )
            )
        
        # Specific filters
        if visit_id:
            filters.append(ScreeningAssessment.visit_id == visit_id)
        
        if screening_tool:
            filters.append(ScreeningAssessment.screening_tool == screening_tool)
            
        if screening_status:
            filters.append(ScreeningAssessment.screening_status == screening_status)
            
        if patient_id:
            filters.append(
                ScreeningAssessment.visit_id.in_(
                    select(BrightFuturesVisit.id).where(
                        BrightFuturesVisit.patient_id == patient_id
                    )
                )
            )
        
        return filters
    
    async def list_assessments_paginated(
        self,
        filters: List,
        pagination: PaginationParams
    ) -> Tuple[List[ScreeningAssessment], int]:
        """List screening assessments with pagination."""
        
        # Build base query
        stmt = select(ScreeningAssessment).options(
            selectinload(ScreeningAssessment.visit)
        )
        
        # Apply filters
        if filters:
            stmt = stmt.where(and_(*filters))
        
        # Get total count
        count_stmt = select(func.count(ScreeningAssessment.id))
        if filters:
            count_stmt = count_stmt.where(and_(*filters))
        
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar()
        
        # Apply sorting
        if pagination.sort_by:
            sort_column = getattr(ScreeningAssessment, pagination.sort_by, None)
            if sort_column:
                if pagination.sort_order == "desc":
                    stmt = stmt.order_by(desc(sort_column))
                else:
                    stmt = stmt.order_by(sort_column)
        else:
            stmt = stmt.order_by(desc(ScreeningAssessment.screening_date))
        
        # Apply pagination
        stmt = stmt.offset(pagination.offset).limit(pagination.limit)
        
        result = await self.db.execute(stmt)
        assessments = result.scalars().all()
        
        return assessments, total
    
    async def validate_assessment_creation(
        self,
        visit_id: UUID,
        screening_tool: str,
        current_user: User
    ) -> None:
        """Validate that assessment can be created."""
        
        # Check if visit exists and user has access
        visit = await self.get_accessible_visit(visit_id, current_user)
        if not visit:
            raise NotFoundError("Visit not found or access denied")
        
        # Check if screening tool exists and is active
        tool = await self.get_screening_tool_by_name(screening_tool)
        if not tool:
            raise ValidationError(f"Screening tool '{screening_tool}' not found")
        
        # Check if tool is appropriate for patient's age
        if visit.age_months:
            if not (tool.min_age_months <= visit.age_months <= tool.max_age_months):
                raise ValidationError(
                    f"Screening tool '{screening_tool}' is not appropriate for age {visit.age_months} months"
                )
        
        # Check if assessment already exists for this visit and tool
        existing_stmt = select(ScreeningAssessment).where(
            and_(
                ScreeningAssessment.visit_id == visit_id,
                ScreeningAssessment.screening_tool == screening_tool
            )
        )
        existing_result = await self.db.execute(existing_stmt)
        existing_assessment = existing_result.scalar_one_or_none()
        
        if existing_assessment:
            raise ValidationError(
                f"Assessment for '{screening_tool}' already exists for this visit"
            )
    
    async def create_assessment(
        self,
        assessment_data: ScreeningAssessmentCreate,
        created_by_id: UUID
    ) -> ScreeningAssessment:
        """Create a new screening assessment."""
        
        assessment = ScreeningAssessment(
            visit_id=assessment_data.visit_id,
            screening_tool=assessment_data.screening_tool,
            screening_date=assessment_data.screening_date or date.today(),
            screening_status=ScreeningStatus.NOT_STARTED,
            language_administered=assessment_data.language_administered or "tr",
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
    ) -> Optional[ScreeningAssessment]:
        """Get assessment with access control check."""
        
        stmt = select(ScreeningAssessment).options(
            selectinload(ScreeningAssessment.visit).selectinload(BrightFuturesVisit.patient)
        ).where(ScreeningAssessment.id == assessment_id)
        
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
    ) -> Optional[ScreeningAssessment]:
        """Get assessment for update operations."""
        
        assessment = await self.get_assessment_with_access_check(assessment_id, current_user)
        
        if not assessment:
            return None
        
        # Check edit permissions
        if not await self.can_edit_assessment(assessment, current_user):
            return None
            
        return assessment
    
    async def update_assessment(
        self,
        assessment: ScreeningAssessment,
        assessment_update: ScreeningAssessmentUpdate,
        updated_by_id: UUID
    ) -> ScreeningAssessment:
        """Update screening assessment."""
        
        # Update basic fields
        if assessment_update.responses is not None:
            assessment.responses = assessment_update.responses
        
        if assessment_update.screening_status is not None:
            assessment.screening_status = assessment_update.screening_status
        
        if assessment_update.raw_score is not None:
            assessment.raw_score = assessment_update.raw_score
        
        if assessment_update.interpretation is not None:
            assessment.interpretation = assessment_update.interpretation
        
        if assessment_update.risk_level is not None:
            assessment.risk_level = assessment_update.risk_level
        
        if assessment_update.follow_up_needed is not None:
            assessment.follow_up_needed = assessment_update.follow_up_needed
        
        if assessment_update.follow_up_recommendations is not None:
            assessment.follow_up_recommendations = assessment_update.follow_up_recommendations
        
        if assessment_update.referral_needed is not None:
            assessment.referral_needed = assessment_update.referral_needed
        
        if assessment_update.referral_type is not None:
            assessment.referral_type = assessment_update.referral_type
        
        # Update tracking fields
        assessment.updated_by_id = updated_by_id
        assessment.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(assessment)
        
        return assessment
    
    async def calculate_assessment_scores(
        self,
        assessment: ScreeningAssessment,
        calculated_by_id: UUID
    ) -> ScreeningAssessment:
        """Calculate scores and interpretation for assessment."""
        
        if not assessment.responses:
            raise ValidationError("Cannot calculate scores without responses")
        
        # Get scoring rules for the tool
        tool = await self.get_screening_tool_by_name(assessment.screening_tool)
        if not tool:
            raise ValidationError(f"Screening tool '{assessment.screening_tool}' not found")
        
        # Calculate scores based on tool type
        if assessment.screening_tool.upper() == "M-CHAT-R":
            scoring_result = await self.calculate_mchat_scores(assessment.responses)
        elif assessment.screening_tool.upper() == "ASQ-3":
            # Need age for ASQ-3 scoring
            visit = await self.get_visit(assessment.visit_id)
            if not visit or not visit.age_months:
                raise ValidationError("Age information required for ASQ-3 scoring")
            scoring_result = await self.calculate_asq3_scores(assessment.responses, visit.age_months)
        else:
            # Generic scoring logic
            scoring_result = await self.calculate_generic_scores(
                assessment.responses, 
                tool.scoring_rules, 
                tool.interpretation_rules
            )
        
        # Update assessment with calculated scores
        assessment.raw_score = scoring_result.get("raw_score")
        assessment.calculated_scores = scoring_result.get("calculated_scores")
        assessment.interpretation = scoring_result.get("interpretation")
        assessment.risk_level = RiskLevel(scoring_result.get("risk_level", "low"))
        assessment.follow_up_needed = scoring_result.get("follow_up_needed", False)
        assessment.follow_up_recommendations = scoring_result.get("follow_up_recommendations")
        assessment.referral_needed = scoring_result.get("referral_needed", False)
        assessment.referral_type = scoring_result.get("referral_type")
        
        # Update status and tracking
        assessment.screening_status = ScreeningStatus.COMPLETED
        assessment.updated_by_id = calculated_by_id
        assessment.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(assessment)
        
        return assessment
    
    # ==================== M-CHAT-R Specific Methods ====================
    
    async def get_mchat_questionnaire(self, language: str = "tr") -> Dict[str, Any]:
        """Get M-CHAT-R questionnaire."""
        
        # This would typically be stored in database or loaded from file
        # For now, returning a basic structure
        questionnaire = {
            "tool_name": "M-CHAT-R",
            "description": "Modified Checklist for Autism in Toddlers - Revised",
            "description_tr": "Otizm İçin Geliştirilmiş Tarama Listesi - Gözden Geçirilmiş",
            "age_range": "16-30 months",
            "age_range_tr": "16-30 ay",
            "questions": self.get_mchat_questions(language),
            "instructions": self.get_mchat_instructions(language)
        }
        
        return questionnaire
    
    def get_mchat_questions(self, language: str = "tr") -> List[Dict[str, Any]]:
        """Get M-CHAT-R questions in specified language."""
        
        if language == "tr":
            return [
                {
                    "id": 1,
                    "text": "Çocuğunuz salıncakta sallanmaktan, dizinizde zıplamaktan hoşlanır mı?",
                    "critical": False
                },
                {
                    "id": 2,
                    "text": "Çocuğunuz diğer çocuklarla ilgilenir mi?",
                    "critical": True
                },
                {
                    "id": 3,
                    "text": "Çocuğunuz bir şeyin üzerine çıkmayı sever mi ve merdiven tırmanır mı?",
                    "critical": False
                },
                # ... (continue with all 20 questions)
            ]
        else:
            # English version
            return [
                {
                    "id": 1,
                    "text": "If you point at something across the room, does your child look at it?",
                    "critical": True
                },
                # ... (English questions)
            ]
    
    def get_mchat_instructions(self, language: str = "tr") -> str:
        """Get M-CHAT-R instructions in specified language."""
        
        if language == "tr":
            return (
                "Lütfen aşağıdaki soruları çocuğunuzun GENELLIKLE nasıl davrandığını "
                "düşünerek cevaplayınız. Bir davranışı sadece bir veya iki kez gördüyseniz, "
                "çocuğunuzun o davranışı YAPMAZ şeklinde cevaplayınız."
            )
        else:
            return (
                "Please answer these questions about how your child usually is. "
                "If you have seen your child do the behavior a few times, but he or she "
                "does not usually do it, then please answer no."
            )
    
    async def score_mchat_responses(self, responses: Dict[int, bool]) -> Dict[str, Any]:
        """Score M-CHAT-R responses."""
        
        if len(responses) != 20:
            raise ValidationError("M-CHAT-R requires exactly 20 responses")
        
        # Critical questions (high risk indicators)
        critical_questions = [2, 5, 8, 10, 14, 15, 18, 20]
        
        # Calculate scores
        total_score = sum(1 for answer in responses.values() if not answer)  # Failed items
        critical_score = sum(1 for q in critical_questions if not responses.get(q, True))
        
        # Determine risk level
        if total_score >= 8:
            risk_level = "high"
            interpretation = "High risk for autism spectrum disorder"
            interpretation_tr = "Otizm spektrum bozukluğu için yüksek risk"
            follow_up_needed = True
            referral_needed = True
            referral_type = "Developmental pediatrician or child psychologist"
        elif total_score >= 3 or critical_score >= 2:
            risk_level = "moderate"
            interpretation = "Moderate risk - follow-up interview recommended"
            interpretation_tr = "Orta risk - takip görüşmesi öneriliyor"
            follow_up_needed = True
            referral_needed = False
        else:
            risk_level = "low"
            interpretation = "Low risk for autism spectrum disorder"
            interpretation_tr = "Otizm spektrum bozukluğu için düşük risk"
            follow_up_needed = False
            referral_needed = False
        
        return {
            "raw_score": total_score,
            "calculated_scores": {
                "total_failed": total_score,
                "critical_failed": critical_score,
                "passed_questions": 20 - total_score,
                "critical_passed": len(critical_questions) - critical_score
            },
            "interpretation": interpretation,
            "interpretation_tr": interpretation_tr,
            "risk_level": risk_level,
            "follow_up_needed": follow_up_needed,
            "referral_needed": referral_needed,
            "referral_type": referral_type if referral_needed else None,
            "follow_up_recommendations": self.get_mchat_followup_recommendations(risk_level)
        }
    
    def get_mchat_followup_recommendations(self, risk_level: str) -> str:
        """Get follow-up recommendations based on M-CHAT-R risk level."""
        
        if risk_level == "high":
            return (
                "Immediate referral to developmental pediatrician recommended. "
                "Early intervention services should be considered."
            )
        elif risk_level == "moderate":
            return (
                "Follow-up M-CHAT-R interview should be conducted. "
                "Monitor development closely and reassess in 1-2 months."
            )
        else:
            return "Continue routine developmental surveillance."
    
    # ==================== ASQ-3 Specific Methods ====================
    
    async def get_asq3_questionnaire(self, age_months: int, language: str = "tr") -> Dict[str, Any]:
        """Get ASQ-3 questionnaire for specific age."""
        
        # Determine appropriate ASQ-3 interval
        interval = self.get_asq3_interval(age_months)
        
        questionnaire = {
            "tool_name": "ASQ-3",
            "description": "Ages and Stages Questionnaire - 3rd Edition",
            "description_tr": "Gelişim Tarama Anketi - 3. Baskı",
            "age_months": age_months,
            "interval": interval,
            "domains": self.get_asq3_domains(language),
            "questions": self.get_asq3_questions(interval, language),
            "instructions": self.get_asq3_instructions(language)
        }
        
        return questionnaire
    
    def get_asq3_interval(self, age_months: int) -> str:
        """Get appropriate ASQ-3 interval for age."""
        
        intervals = [
            (2, "2-month"), (4, "4-month"), (6, "6-month"), (8, "8-month"),
            (9, "9-month"), (10, "10-month"), (12, "12-month"), (14, "14-month"),
            (16, "16-month"), (18, "18-month"), (20, "20-month"), (22, "22-month"),
            (24, "24-month"), (27, "27-month"), (30, "30-month"), (33, "33-month"),
            (36, "36-month"), (42, "42-month"), (48, "48-month"), (54, "54-month"),
            (60, "60-month")
        ]
        
        for max_age, interval in intervals:
            if age_months <= max_age:
                return interval
        
        return "60-month"  # Default for older children
    
    def get_asq3_domains(self, language: str = "tr") -> List[Dict[str, str]]:
        """Get ASQ-3 developmental domains."""
        
        if language == "tr":
            return [
                {"id": "communication", "name": "İletişim"},
                {"id": "gross_motor", "name": "Kaba Motor"},
                {"id": "fine_motor", "name": "İnce Motor"},
                {"id": "problem_solving", "name": "Problem Çözme"},
                {"id": "personal_social", "name": "Kişisel-Sosyal"}
            ]
        else:
            return [
                {"id": "communication", "name": "Communication"},
                {"id": "gross_motor", "name": "Gross Motor"},
                {"id": "fine_motor", "name": "Fine Motor"},
                {"id": "problem_solving", "name": "Problem Solving"},
                {"id": "personal_social", "name": "Personal-Social"}
            ]
    
    def get_asq3_instructions(self, language: str = "tr") -> str:
        """Get ASQ-3 instructions."""
        
        if language == "tr":
            return (
                "Her soru için çocuğunuzun şu anda yapabildiği davranışları işaretleyiniz. "
                "EVET = çocuk davranışı yapıyor, BAZEN = bazen yapıyor, HENÜZ = henüz yapmıyor."
            )
        else:
            return (
                "Check the box that best describes your child's current abilities. "
                "YES = child does it, SOMETIMES = child sometimes does it, NOT YET = child doesn't do it yet."
            )
    
    def get_asq3_questions(self, interval: str, language: str = "tr") -> List[Dict[str, Any]]:
        """Get ASQ-3 questions for specific interval."""
        
        # This would typically be loaded from database
        # Return placeholder structure for now
        return [
            {
                "domain": "communication",
                "questions": [
                    {
                        "id": 1,
                        "text": "Sample communication question",
                        "text_tr": "Örnek iletişim sorusu"
                    }
                    # ... more questions
                ]
            }
            # ... other domains
        ]
    
    async def score_asq3_responses(self, age_months: int, responses: Dict[str, int]) -> Dict[str, Any]:
        """Score ASQ-3 responses."""
        
        interval = self.get_asq3_interval(age_months)
        cutoff_scores = self.get_asq3_cutoff_scores(interval)
        
        # Calculate domain scores
        domain_scores = {}
        domain_results = {}
        
        for domain in ["communication", "gross_motor", "fine_motor", "problem_solving", "personal_social"]:
            domain_questions = [k for k in responses.keys() if k.startswith(domain)]
            domain_score = sum(responses[q] for q in domain_questions)
            domain_scores[domain] = domain_score
            
            cutoff = cutoff_scores.get(domain, 0)
            if domain_score < cutoff:
                domain_results[domain] = "concerning"
            elif domain_score < cutoff + 5:  # Close to cutoff
                domain_results[domain] = "monitor"
            else:
                domain_results[domain] = "on_track"
        
        # Overall interpretation
        concerning_domains = [d for d, result in domain_results.items() if result == "concerning"]
        monitoring_domains = [d for d, result in domain_results.items() if result == "monitor"]
        
        if len(concerning_domains) >= 2:
            risk_level = "high"
            interpretation = "Multiple domains concerning - referral recommended"
            referral_needed = True
        elif len(concerning_domains) == 1:
            risk_level = "moderate"
            interpretation = "One domain concerning - monitor closely"
            referral_needed = len(monitoring_domains) > 0
        else:
            risk_level = "low"
            interpretation = "Development on track"
            referral_needed = False
        
        return {
            "raw_score": sum(domain_scores.values()),
            "calculated_scores": {
                "domain_scores": domain_scores,
                "domain_results": domain_results,
                "cutoff_scores": cutoff_scores
            },
            "interpretation": interpretation,
            "risk_level": risk_level,
            "follow_up_needed": len(concerning_domains) > 0 or len(monitoring_domains) > 1,
            "referral_needed": referral_needed,
            "referral_type": "Early intervention services" if referral_needed else None,
            "follow_up_recommendations": self.get_asq3_followup_recommendations(concerning_domains, monitoring_domains)
        }
    
    def get_asq3_cutoff_scores(self, interval: str) -> Dict[str, int]:
        """Get ASQ-3 cutoff scores for interval."""
        
        # Simplified cutoff scores (would be loaded from database in real implementation)
        cutoffs = {
            "communication": 25,
            "gross_motor": 20,
            "fine_motor": 20,
            "problem_solving": 25,
            "personal_social": 20
        }
        
        return cutoffs
    
    def get_asq3_followup_recommendations(self, concerning_domains: List[str], monitoring_domains: List[str]) -> str:
        """Get ASQ-3 follow-up recommendations."""
        
        if len(concerning_domains) >= 2:
            return "Refer for comprehensive developmental evaluation and early intervention services."
        elif len(concerning_domains) == 1:
            domain = concerning_domains[0]
            return f"Monitor {domain} development closely and consider referral if concerns persist."
        elif len(monitoring_domains) > 1:
            return "Continue monitoring development and provide learning activities."
        else:
            return "Continue routine developmental surveillance."
    
    # ==================== Batch Operations ====================
    
    async def validate_batch_assessment_creation(
        self,
        visit_id: UUID,
        screening_tools: List[str],
        current_user: User
    ) -> None:
        """Validate batch assessment creation."""
        
        # Check visit access
        visit = await self.get_accessible_visit(visit_id, current_user)
        if not visit:
            raise NotFoundError("Visit not found or access denied")
        
        # Validate all screening tools
        for tool_name in screening_tools:
            await self.validate_assessment_creation(visit_id, tool_name, current_user)
    
    async def batch_create_assessments(
        self,
        visit_id: UUID,
        screening_tools: List[str],
        created_by_id: UUID
    ) -> List[ScreeningAssessment]:
        """Create multiple assessments for a visit."""
        
        assessments = []
        
        for tool_name in screening_tools:
            assessment_data = ScreeningAssessmentCreate(
                visit_id=visit_id,
                screening_tool=tool_name
            )
            
            assessment = await self.create_assessment(assessment_data, created_by_id)
            assessments.append(assessment)
        
        await self.db.commit()
        return assessments
    
    # ==================== Analytics ====================
    
    async def get_screening_completion_analytics(
        self,
        current_user: User,
        days: int = 30
    ) -> Dict[str, Any]:
        """Get screening completion rate analytics."""
        
        # This would involve complex queries to analyze completion rates
        # Returning placeholder data for now
        
        return {
            "period_days": days,
            "total_visits": 0,
            "screenings_completed": 0,
            "completion_rate": 0.0,
            "by_tool": {},
            "by_age_group": {}
        }
    
    async def get_risk_distribution_analytics(
        self,
        current_user: User,
        screening_tool: Optional[str] = None,
        days: int = 90
    ) -> Dict[str, Any]:
        """Get risk level distribution analytics."""
        
        # Placeholder implementation
        return {
            "period_days": days,
            "screening_tool": screening_tool,
            "risk_distribution": {
                "low": 0,
                "moderate": 0,
                "high": 0,
                "critical": 0
            }
        }
    
    # ==================== Helper Methods ====================
    
    async def can_access_assessment(self, assessment: ScreeningAssessment, user: User) -> bool:
        """Check if user can access assessment."""
        
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        if user.role == UserRole.PARENT:
            # Check if this is their child's assessment
            if hasattr(assessment, 'visit') and hasattr(assessment.visit, 'patient'):
                return assessment.visit.patient.parent_id == user.id
        
        return False
    
    async def can_edit_assessment(self, assessment: ScreeningAssessment, user: User) -> bool:
        """Check if user can edit assessment."""
        
        # Healthcare professionals can edit
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        # Parents can edit their own child's assessments if not completed
        if user.role == UserRole.PARENT:
            if (hasattr(assessment, 'visit') and 
                hasattr(assessment.visit, 'patient') and
                assessment.visit.patient.parent_id == user.id and
                assessment.screening_status in [ScreeningStatus.NOT_STARTED, ScreeningStatus.IN_PROGRESS]):
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
    
    async def get_visit(self, visit_id: UUID) -> Optional[BrightFuturesVisit]:
        """Get visit by ID."""
        
        stmt = select(BrightFuturesVisit).where(BrightFuturesVisit.id == visit_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def calculate_generic_scores(
        self,
        responses: Dict[str, Any],
        scoring_rules: Dict[str, Any],
        interpretation_rules: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Calculate scores using generic scoring rules."""
        
        # Placeholder for generic scoring logic
        # Would implement based on scoring_rules configuration
        
        return {
            "raw_score": 0,
            "calculated_scores": {},
            "interpretation": "Not implemented",
            "risk_level": "low",
            "follow_up_needed": False,
            "referral_needed": False
        }