"""Guidance content service for anticipatory guidance."""

from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any
from uuid import UUID

import structlog
from sqlalchemy import select, and_, desc, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.bright_futures import GuidanceProvided, BrightFuturesVisit
from app.schemas.bright_futures import (
    GuidanceProvidedCreate, GuidanceProvidedUpdate,
    GuidanceTemplate, AgeBasedGuidanceRecommendations
)
from app.api.deps import PaginationParams
from app.utils.exceptions import NotFoundError, ValidationError, AuthorizationError

logger = structlog.get_logger()


class GuidanceService:
    """Service for managing anticipatory guidance content."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    # ==================== Guidance Templates ====================
    
    async def get_guidance_templates(
        self,
        category: Optional[str] = None,
        age_months: Optional[int] = None,
        language: str = "tr"
    ) -> List[GuidanceTemplate]:
        """Get guidance templates with filtering."""
        
        # Placeholder implementation - would load from database
        templates = self._get_default_guidance_templates(language)
        
        if category:
            templates = [t for t in templates if t.get("category") == category]
        
        if age_months is not None:
            templates = [t for t in templates 
                        if t.get("min_age_months", 0) <= age_months <= t.get("max_age_months", 999)]
        
        return [GuidanceTemplate(**template) for template in templates]
    
    async def get_guidance_template_by_id(
        self, 
        template_id: UUID, 
        language: str = "tr"
    ) -> Optional[GuidanceTemplate]:
        """Get guidance template by ID."""
        
        # Placeholder - would query database
        templates = await self.get_guidance_templates(language=language)
        for template in templates:
            if str(template.id) == str(template_id):
                return template
        
        return None
    
    def _get_default_guidance_templates(self, language: str) -> List[Dict[str, Any]]:
        """Get default guidance templates."""
        
        if language == "tr":
            return [
                {
                    "id": "safety-car-seat",
                    "category": "Safety",
                    "topic": "Araç Koltuğu Güvenliği",
                    "min_age_months": 0,
                    "max_age_months": 48,
                    "guidance_text": "Çocuğunuz her araç yolculuğunda yaşına uygun araç koltuğunda olmalıdır.",
                    "key_points": [
                        "Bebekler 2 yaşına kadar arkaya dönük koltukta oturmalı",
                        "Araç koltuğu her kullanımda kontrol edilmeli",
                        "Montaj talimatları dikkatle okunmalı"
                    ],
                    "materials": ["Araç koltuğu güvenlik broşürü", "Montaj video linki"]
                },
                {
                    "id": "nutrition-breastfeeding",
                    "category": "Nutrition",
                    "topic": "Emzirme",
                    "min_age_months": 0,
                    "max_age_months": 24,
                    "guidance_text": "Anne sütü bebeğiniz için en ideal besindir.",
                    "key_points": [
                        "İlk 6 ay sadece anne sütü",
                        "2 yaşına kadar emzirmeye devam",
                        "İhtiyaç durumunda destek alın"
                    ],
                    "materials": ["Emzirme rehberi", "Laktasyon uzmanı iletişim"]
                }
            ]
        else:
            return [
                {
                    "id": "safety-car-seat",
                    "category": "Safety",
                    "topic": "Car Seat Safety",
                    "min_age_months": 0,
                    "max_age_months": 48,
                    "guidance_text": "Your child should be in an age-appropriate car seat for every car ride.",
                    "key_points": [
                        "Keep children rear-facing until age 2",
                        "Check car seat installation each time",
                        "Read installation manual carefully"
                    ],
                    "materials": ["Car seat safety brochure", "Installation video link"]
                }
            ]
    
    async def get_guidance_categories(self, language: str = "tr") -> List[Dict[str, str]]:
        """Get guidance categories."""
        
        if language == "tr":
            return [
                {"id": "safety", "name": "Güvenlik", "description": "Kaza ve yaralanma önleme"},
                {"id": "nutrition", "name": "Beslenme", "description": "Sağlıklı beslenme alışkanlıkları"},
                {"id": "development", "name": "Gelişim", "description": "Çocuk gelişimini destekleme"},
                {"id": "sleep", "name": "Uyku", "description": "Sağlıklı uyku alışkanlıkları"},
                {"id": "behavior", "name": "Davranış", "description": "Olumlu davranış geliştirme"},
                {"id": "health", "name": "Sağlık", "description": "Genel sağlık bakımı"}
            ]
        else:
            return [
                {"id": "safety", "name": "Safety", "description": "Injury and accident prevention"},
                {"id": "nutrition", "name": "Nutrition", "description": "Healthy eating habits"},
                {"id": "development", "name": "Development", "description": "Supporting child development"},
                {"id": "sleep", "name": "Sleep", "description": "Healthy sleep habits"},
                {"id": "behavior", "name": "Behavior", "description": "Positive behavior development"},
                {"id": "health", "name": "Health", "description": "General health care"}
            ]
    
    # ==================== Age-Based Recommendations ====================
    
    async def generate_age_based_recommendations(
        self,
        patient: Patient,
        language: str = "tr"
    ) -> AgeBasedGuidanceRecommendations:
        """Generate age-appropriate guidance recommendations."""
        
        age_months = patient.age_in_months
        
        # Get appropriate guidance templates
        templates = await self.get_guidance_templates(age_months=age_months, language=language)
        
        # Prioritize by age relevance and importance
        priority_guidance = self._prioritize_guidance_for_age(templates, age_months)
        safety_priorities = self._get_safety_priorities_for_age(age_months, language)
        developmental_guidance = self._get_developmental_guidance_for_age(age_months, language)
        
        recommendations = AgeBasedGuidanceRecommendations(
            patient_id=patient.id,
            patient_age_months=age_months,
            priority_guidance=priority_guidance[:5],  # Top 5
            safety_priorities=safety_priorities,
            developmental_guidance=developmental_guidance,
            cultural_considerations=self._get_cultural_considerations(language),
            next_discussion_topics=self._get_next_discussion_topics(age_months, language),
            generated_at=datetime.utcnow()
        )
        
        return recommendations
    
    async def get_safety_priorities_for_age(
        self, 
        age_months: int, 
        language: str = "tr"
    ) -> List[GuidanceTemplate]:
        """Get safety priorities for specific age."""
        
        safety_templates = await self.get_guidance_templates(
            category="Safety", 
            age_months=age_months, 
            language=language
        )
        
        return safety_templates
    
    def _prioritize_guidance_for_age(
        self, 
        templates: List[GuidanceTemplate], 
        age_months: int
    ) -> List[GuidanceTemplate]:
        """Prioritize guidance templates by age relevance."""
        
        # Sort by relevance to age (templates with narrower age ranges get higher priority)
        def age_relevance(template):
            age_range = template.max_age_months - template.min_age_months
            return age_range  # Smaller range = higher priority
        
        return sorted(templates, key=age_relevance)
    
    def _get_safety_priorities_for_age(self, age_months: int, language: str) -> List[str]:
        """Get safety priorities for age."""
        
        if language == "tr":
            if age_months < 6:
                return ["Güvenli uyku", "Araç koltuğu", "Su güvenliği"]
            elif age_months < 12:
                return ["Düşme önleme", "Zehirlenme önleme", "Boğulma önleme"]
            elif age_months < 24:
                return ["Ev güvenliği", "Oyun alanı güvenliği", "Trafik güvenliği"]
            else:
                return ["Trafik kuralları", "Yabancı kişiler", "İnternet güvenliği"]
        else:
            if age_months < 6:
                return ["Safe sleep", "Car seat safety", "Water safety"]
            elif age_months < 12:
                return ["Fall prevention", "Poisoning prevention", "Choking prevention"]
            elif age_months < 24:
                return ["Home safety", "Playground safety", "Traffic safety"]
            else:
                return ["Traffic rules", "Stranger danger", "Internet safety"]
    
    def _get_developmental_guidance_for_age(self, age_months: int, language: str) -> List[str]:
        """Get developmental guidance for age."""
        
        if language == "tr":
            if age_months < 12:
                return ["Okuma alışkanlığı", "Oyun önerileri", "Dil gelişimi"]
            elif age_months < 36:
                return ["Tuvalet eğitimi", "Sosyal beceriler", "Duygusal gelişim"]
            else:
                return ["Okul hazırlığı", "Arkadaşlık becerileri", "Öz bakım"]
        else:
            return ["Reading habits", "Play recommendations", "Language development"]
    
    def _get_cultural_considerations(self, language: str) -> List[str]:
        """Get cultural considerations for guidance."""
        
        if language == "tr":
            return [
                "Aile değerlerini koruma",
                "Geleneksel beslenme alışkanlıkları",
                "Büyükanne/büyükbaba desteği"
            ]
        else:
            return ["Family values", "Traditional nutrition", "Grandparent support"]
    
    def _get_next_discussion_topics(self, age_months: int, language: str) -> List[str]:
        """Get topics for next visit discussion."""
        
        next_age = age_months + 3  # Next visit likely in 3 months
        return self._get_developmental_guidance_for_age(next_age, language)[:3]
    
    # ==================== Provided Guidance Tracking ====================
    
    async def build_guidance_filters(
        self,
        current_user: User,
        visit_id: Optional[UUID] = None,
        patient_id: Optional[UUID] = None,
        category: Optional[str] = None,
        topic: Optional[str] = None
    ) -> List:
        """Build filters for guidance queries."""
        
        filters = []
        
        # Base permission filtering
        if current_user.role == UserRole.PARENT:
            # Parents can only see their own patients' guidance
            stmt = select(Patient.id).where(Patient.parent_id == current_user.id)
            result = await self.db.execute(stmt)
            accessible_patients = [row[0] for row in result.fetchall()]
            
            filters.append(
                GuidanceProvided.visit_id.in_(
                    select(BrightFuturesVisit.id).where(
                        BrightFuturesVisit.patient_id.in_(accessible_patients)
                    )
                )
            )
        
        # Specific filters
        if visit_id:
            filters.append(GuidanceProvided.visit_id == visit_id)
        
        if patient_id:
            filters.append(
                GuidanceProvided.visit_id.in_(
                    select(BrightFuturesVisit.id).where(
                        BrightFuturesVisit.patient_id == patient_id
                    )
                )
            )
        
        if category:
            filters.append(GuidanceProvided.category == category)
        
        if topic:
            filters.append(GuidanceProvided.topic == topic)
        
        return filters
    
    async def list_provided_guidance_paginated(
        self,
        filters: List,
        pagination: PaginationParams
    ) -> Tuple[List[GuidanceProvided], int]:
        """List provided guidance records with pagination."""
        
        # Build base query
        stmt = select(GuidanceProvided).options(
            selectinload(GuidanceProvided.visit)
        )
        
        # Apply filters
        if filters:
            stmt = stmt.where(and_(*filters))
        
        # Get total count
        count_stmt = select(func.count(GuidanceProvided.id))
        if filters:
            count_stmt = count_stmt.where(and_(*filters))
        
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar()
        
        # Apply sorting
        stmt = stmt.order_by(desc(GuidanceProvided.created_at))
        
        # Apply pagination
        stmt = stmt.offset(pagination.offset).limit(pagination.limit)
        
        result = await self.db.execute(stmt)
        guidance_records = result.scalars().all()
        
        return guidance_records, total
    
    async def validate_guidance_creation(
        self,
        visit_id: UUID,
        current_user: User
    ) -> None:
        """Validate guidance creation."""
        
        # Check if visit exists and user has access
        visit = await self.get_accessible_visit(visit_id, current_user)
        if not visit:
            raise NotFoundError("Visit not found or access denied")
    
    async def create_provided_guidance(
        self,
        guidance_data: GuidanceProvidedCreate,
        created_by_id: UUID
    ) -> GuidanceProvided:
        """Create provided guidance record."""
        
        guidance = GuidanceProvided(
            visit_id=guidance_data.visit_id,
            category=guidance_data.category,
            topic=guidance_data.topic,
            guidance_text=guidance_data.guidance_text,
            materials_provided=guidance_data.materials_provided,
            language=guidance_data.language or "tr",
            culturally_adapted=guidance_data.culturally_adapted or False,
            parent_understanding_confirmed=guidance_data.parent_understanding_confirmed or False,
            created_by_id=created_by_id
        )
        
        self.db.add(guidance)
        await self.db.flush()
        await self.db.refresh(guidance)
        
        return guidance
    
    async def get_guidance_with_access_check(
        self,
        guidance_id: UUID,
        current_user: User
    ) -> Optional[GuidanceProvided]:
        """Get guidance with access check."""
        
        stmt = select(GuidanceProvided).options(
            selectinload(GuidanceProvided.visit).selectinload(BrightFuturesVisit.patient)
        ).where(GuidanceProvided.id == guidance_id)
        
        result = await self.db.execute(stmt)
        guidance = result.scalar_one_or_none()
        
        if not guidance:
            return None
        
        # Check access permissions
        if not await self.can_access_guidance(guidance, current_user):
            return None
            
        return guidance
    
    async def get_guidance_for_update(
        self,
        guidance_id: UUID,
        current_user: User
    ) -> Optional[GuidanceProvided]:
        """Get guidance for update operations."""
        
        guidance = await self.get_guidance_with_access_check(guidance_id, current_user)
        
        if not guidance:
            return None
        
        # Check edit permissions
        if not await self.can_edit_guidance(guidance, current_user):
            return None
            
        return guidance
    
    async def update_provided_guidance(
        self,
        guidance: GuidanceProvided,
        guidance_update: GuidanceProvidedUpdate,
        updated_by_id: UUID
    ) -> GuidanceProvided:
        """Update provided guidance record."""
        
        # Update fields
        if guidance_update.guidance_text is not None:
            guidance.guidance_text = guidance_update.guidance_text
        
        if guidance_update.materials_provided is not None:
            guidance.materials_provided = guidance_update.materials_provided
        
        if guidance_update.parent_understanding_confirmed is not None:
            guidance.parent_understanding_confirmed = guidance_update.parent_understanding_confirmed
        
        if guidance_update.follow_up_discussion_needed is not None:
            guidance.follow_up_discussion_needed = guidance_update.follow_up_discussion_needed
        
        # Update tracking fields
        guidance.updated_by_id = updated_by_id
        guidance.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(guidance)
        
        return guidance
    
    async def delete_provided_guidance(self, guidance: GuidanceProvided) -> None:
        """Delete provided guidance record."""
        
        await self.db.delete(guidance)
        await self.db.flush()
    
    async def confirm_parent_understanding(
        self,
        guidance: GuidanceProvided,
        understanding_notes: Optional[str],
        confirmed_by_id: UUID
    ) -> GuidanceProvided:
        """Confirm parent understanding."""
        
        guidance.parent_understanding_confirmed = True
        
        if understanding_notes:
            if guidance.guidance_text:
                guidance.guidance_text += f"\n\nAnne/baba anlayışı onaylandı: {understanding_notes}"
            else:
                guidance.guidance_text = f"Anne/baba anlayışı onaylandı: {understanding_notes}"
        
        guidance.updated_by_id = confirmed_by_id
        guidance.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(guidance)
        
        return guidance
    
    # ==================== Batch Operations ====================
    
    async def validate_batch_guidance_creation(
        self,
        visit_id: UUID,
        template_ids: List[UUID],
        current_user: User
    ) -> None:
        """Validate batch guidance creation."""
        
        await self.validate_guidance_creation(visit_id, current_user)
        
        # Validate all templates
        for template_id in template_ids:
            template = await self.get_guidance_template_by_id(template_id)
            if not template:
                raise NotFoundError(f"Guidance template {template_id} not found")
    
    async def batch_create_provided_guidance(
        self,
        visit_id: UUID,
        template_ids: List[UUID],
        created_by_id: UUID
    ) -> List[GuidanceProvided]:
        """Create multiple guidance records from templates."""
        
        guidance_records = []
        
        for template_id in template_ids:
            template = await self.get_guidance_template_by_id(template_id)
            if template:
                guidance_data = GuidanceProvidedCreate(
                    visit_id=visit_id,
                    category=template.category,
                    topic=template.topic,
                    guidance_text=template.guidance_text,
                    materials_provided=template.materials
                )
                
                guidance = await self.create_provided_guidance(guidance_data, created_by_id)
                guidance_records.append(guidance)
        
        await self.db.commit()
        return guidance_records
    
    # ==================== Analytics and Templates ====================
    
    async def create_guidance_template(
        self,
        template_data: Dict[str, Any],
        created_by_id: UUID
    ) -> GuidanceTemplate:
        """Create guidance template."""
        
        # Placeholder - would save to database
        template_data["id"] = "new-template-id"
        return GuidanceTemplate(**template_data)
    
    async def get_guidance_usage_analytics(
        self,
        current_user: User,
        days: int = 30,
        category: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get guidance usage analytics."""
        
        # Placeholder implementation
        return {
            "period_days": days,
            "category": category,
            "total_guidance_provided": 0,
            "by_category": {},
            "by_topic": {}
        }
    
    async def get_parent_understanding_analytics(
        self,
        current_user: User,
        days: int = 90,
        topic: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get parent understanding analytics."""
        
        # Placeholder implementation
        return {
            "period_days": days,
            "topic": topic,
            "understanding_confirmed_rate": 0.0,
            "follow_up_needed_count": 0
        }
    
    async def get_cultural_adaptations(self, language: str = "tr") -> List[Dict[str, str]]:
        """Get cultural adaptations."""
        
        if language == "tr":
            return [
                {"id": "family_centered", "name": "Aile Merkezli", "description": "Geniş aile katılımını vurgular"},
                {"id": "religious_considerations", "name": "Dini Değerler", "description": "Dini değerleri dikkate alır"},
                {"id": "traditional_practices", "name": "Geleneksel Uygulamalar", "description": "Geleneksel sağlık uygulamaları"}
            ]
        else:
            return [
                {"id": "family_centered", "name": "Family Centered", "description": "Emphasizes extended family involvement"},
                {"id": "religious_considerations", "name": "Religious Values", "description": "Considers religious values"},
                {"id": "traditional_practices", "name": "Traditional Practices", "description": "Traditional health practices"}
            ]
    
    # ==================== Helper Methods ====================
    
    async def can_access_guidance(self, guidance: GuidanceProvided, user: User) -> bool:
        """Check if user can access guidance."""
        
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        if user.role == UserRole.PARENT:
            # Check if this is their child's guidance
            if hasattr(guidance, 'visit') and hasattr(guidance.visit, 'patient'):
                return guidance.visit.patient.parent_id == user.id
        
        return False
    
    async def can_edit_guidance(self, guidance: GuidanceProvided, user: User) -> bool:
        """Check if user can edit guidance."""
        
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