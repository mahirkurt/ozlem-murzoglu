"""Milestone tracking service for developmental assessments."""

from datetime import date, datetime
from typing import Dict, List, Optional, Tuple, Any
from uuid import UUID

import structlog
from sqlalchemy import select, and_, desc, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.bright_futures import (
    MilestoneTracking, MilestoneTemplate, BrightFuturesVisit,
    MilestoneStatus
)
from app.schemas.bright_futures import (
    MilestoneTrackingCreate, MilestoneTrackingUpdate, MilestoneSummary
)
from app.api.deps import PaginationParams
from app.utils.exceptions import NotFoundError, ValidationError, AuthorizationError

logger = structlog.get_logger()


class MilestoneService:
    """Service for managing developmental milestone tracking."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    # ==================== Milestone Templates ====================
    
    async def get_milestone_templates(
        self,
        age_months: Optional[int] = None,
        domain: Optional[str] = None,
        language: str = "tr"
    ) -> List[MilestoneTemplate]:
        """Get milestone templates with optional filtering."""
        
        stmt = select(MilestoneTemplate).where(MilestoneTemplate.is_active == True)
        
        if age_months is not None:
            stmt = stmt.where(
                and_(
                    MilestoneTemplate.age_range_start <= age_months,
                    MilestoneTemplate.age_range_end >= age_months
                )
            )
        
        if domain:
            stmt = stmt.where(MilestoneTemplate.milestone_domain == domain)
        
        stmt = stmt.order_by(
            MilestoneTemplate.expected_age_months,
            MilestoneTemplate.milestone_domain
        )
        
        result = await self.db.execute(stmt)
        return result.scalars().all()
    
    async def get_milestone_template_by_id(
        self, 
        template_id: UUID, 
        language: str = "tr"
    ) -> Optional[MilestoneTemplate]:
        """Get milestone template by ID."""
        
        stmt = select(MilestoneTemplate).where(
            and_(
                MilestoneTemplate.id == template_id,
                MilestoneTemplate.is_active == True
            )
        )
        
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    # ==================== Milestone Tracking ====================
    
    async def build_milestone_filters(
        self,
        current_user: User,
        visit_id: Optional[UUID] = None,
        patient_id: Optional[UUID] = None,
        milestone_domain: Optional[str] = None,
        milestone_status: Optional[MilestoneStatus] = None,
        concerning_only: bool = False
    ) -> List:
        """Build filters for milestone queries based on user permissions."""
        
        filters = []
        
        # Base permission filtering
        if current_user.role == UserRole.PARENT:
            # Parents can only see their own patients' milestones
            stmt = select(Patient.id).where(Patient.parent_id == current_user.id)
            result = await self.db.execute(stmt)
            accessible_patients = [row[0] for row in result.fetchall()]
            
            # Join with visits to get patient access
            filters.append(
                MilestoneTracking.visit_id.in_(
                    select(BrightFuturesVisit.id).where(
                        BrightFuturesVisit.patient_id.in_(accessible_patients)
                    )
                )
            )
        
        # Specific filters
        if visit_id:
            filters.append(MilestoneTracking.visit_id == visit_id)
        
        if patient_id:
            filters.append(
                MilestoneTracking.visit_id.in_(
                    select(BrightFuturesVisit.id).where(
                        BrightFuturesVisit.patient_id == patient_id
                    )
                )
            )
        
        if milestone_domain:
            filters.append(MilestoneTracking.milestone_domain == milestone_domain)
        
        if milestone_status:
            filters.append(MilestoneTracking.milestone_status == milestone_status)
        
        if concerning_only:
            filters.append(
                MilestoneTracking.milestone_status.in_([
                    MilestoneStatus.CONCERNING,
                    MilestoneStatus.DELAYED,
                    MilestoneStatus.REFER_FOR_EVALUATION
                ])
            )
        
        return filters
    
    async def list_milestones_paginated(
        self,
        filters: List,
        pagination: PaginationParams
    ) -> Tuple[List[MilestoneTracking], int]:
        """List milestone tracking records with pagination."""
        
        # Build base query
        stmt = select(MilestoneTracking).options(
            selectinload(MilestoneTracking.visit)
        )
        
        # Apply filters
        if filters:
            stmt = stmt.where(and_(*filters))
        
        # Get total count
        count_stmt = select(func.count(MilestoneTracking.id))
        if filters:
            count_stmt = count_stmt.where(and_(*filters))
        
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar()
        
        # Apply sorting
        if pagination.sort_by:
            sort_column = getattr(MilestoneTracking, pagination.sort_by, None)
            if sort_column:
                if pagination.sort_order == "desc":
                    stmt = stmt.order_by(desc(sort_column))
                else:
                    stmt = stmt.order_by(sort_column)
        else:
            stmt = stmt.order_by(
                MilestoneTracking.expected_age_months,
                MilestoneTracking.milestone_domain
            )
        
        # Apply pagination
        stmt = stmt.offset(pagination.offset).limit(pagination.limit)
        
        result = await self.db.execute(stmt)
        milestones = result.scalars().all()
        
        return milestones, total
    
    async def validate_milestone_creation(
        self,
        visit_id: UUID,
        milestone_domain: str,
        current_user: User
    ) -> None:
        """Validate that milestone can be created."""
        
        # Check if visit exists and user has access
        visit = await self.get_accessible_visit(visit_id, current_user)
        if not visit:
            raise NotFoundError("Visit not found or access denied")
    
    async def create_milestone_tracking(
        self,
        milestone_data: MilestoneTrackingCreate,
        created_by_id: UUID
    ) -> MilestoneTracking:
        """Create a new milestone tracking record."""
        
        milestone = MilestoneTracking(
            visit_id=milestone_data.visit_id,
            milestone_domain=milestone_data.milestone_domain,
            milestone_name=milestone_data.milestone_name,
            expected_age_months=milestone_data.expected_age_months,
            milestone_status=milestone_data.milestone_status or MilestoneStatus.NOT_ASSESSED,
            achieved_date=milestone_data.achieved_date,
            notes=milestone_data.notes,
            concerns_noted=milestone_data.concerns_noted or False,
            created_by_id=created_by_id
        )
        
        self.db.add(milestone)
        await self.db.flush()
        await self.db.refresh(milestone)
        
        return milestone
    
    async def get_milestone_with_access_check(
        self,
        milestone_id: UUID,
        current_user: User
    ) -> Optional[MilestoneTracking]:
        """Get milestone with access control check."""
        
        stmt = select(MilestoneTracking).options(
            selectinload(MilestoneTracking.visit).selectinload(BrightFuturesVisit.patient)
        ).where(MilestoneTracking.id == milestone_id)
        
        result = await self.db.execute(stmt)
        milestone = result.scalar_one_or_none()
        
        if not milestone:
            return None
        
        # Check access permissions
        if not await self.can_access_milestone(milestone, current_user):
            return None
            
        return milestone
    
    async def get_milestone_for_update(
        self,
        milestone_id: UUID,
        current_user: User
    ) -> Optional[MilestoneTracking]:
        """Get milestone for update operations."""
        
        milestone = await self.get_milestone_with_access_check(milestone_id, current_user)
        
        if not milestone:
            return None
        
        # Check edit permissions
        if not await self.can_edit_milestone(milestone, current_user):
            return None
            
        return milestone
    
    async def update_milestone_tracking(
        self,
        milestone: MilestoneTracking,
        milestone_update: MilestoneTrackingUpdate,
        updated_by_id: UUID
    ) -> MilestoneTracking:
        """Update milestone tracking record."""
        
        # Update fields
        if milestone_update.milestone_status is not None:
            milestone.milestone_status = milestone_update.milestone_status
        
        if milestone_update.achieved_date is not None:
            milestone.achieved_date = milestone_update.achieved_date
        
        if milestone_update.notes is not None:
            milestone.notes = milestone_update.notes
        
        if milestone_update.concerns_noted is not None:
            milestone.concerns_noted = milestone_update.concerns_noted
        
        if milestone_update.follow_up_needed is not None:
            milestone.follow_up_needed = milestone_update.follow_up_needed
        
        if milestone_update.early_intervention_referred is not None:
            milestone.early_intervention_referred = milestone_update.early_intervention_referred
        
        # Update tracking fields
        milestone.updated_by_id = updated_by_id
        milestone.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(milestone)
        
        return milestone
    
    async def delete_milestone_tracking(self, milestone: MilestoneTracking) -> None:
        """Delete milestone tracking record."""
        
        await self.db.delete(milestone)
        await self.db.flush()
    
    async def flag_milestone_concern(
        self,
        milestone: MilestoneTracking,
        concern_notes: str,
        flagged_by_id: UUID
    ) -> MilestoneTracking:
        """Flag milestone as concerning."""
        
        milestone.milestone_status = MilestoneStatus.CONCERNING
        milestone.concerns_noted = True
        milestone.follow_up_needed = True
        
        # Add concern notes
        if milestone.notes:
            milestone.notes += f"\n\nConcern flagged: {concern_notes}"
        else:
            milestone.notes = f"Concern flagged: {concern_notes}"
        
        milestone.updated_by_id = flagged_by_id
        milestone.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(milestone)
        
        return milestone
    
    # ==================== Patient Summary ====================
    
    async def generate_milestone_summary(self, patient_id: UUID) -> MilestoneSummary:
        """Generate milestone summary for patient."""
        
        # Get all milestones for patient
        milestones_stmt = select(MilestoneTracking).options(
            selectinload(MilestoneTracking.visit)
        ).join(BrightFuturesVisit).where(
            BrightFuturesVisit.patient_id == patient_id
        ).order_by(MilestoneTracking.expected_age_months)
        
        result = await self.db.execute(milestones_stmt)
        milestones = result.scalars().all()
        
        # Calculate statistics by domain
        domain_stats = {}
        for milestone in milestones:
            domain = milestone.milestone_domain
            if domain not in domain_stats:
                domain_stats[domain] = {
                    "total": 0,
                    "on_track": 0,
                    "concerning": 0,
                    "delayed": 0,
                    "not_assessed": 0
                }
            
            domain_stats[domain]["total"] += 1
            status_key = milestone.milestone_status.value.lower().replace("_", "_")
            if status_key in domain_stats[domain]:
                domain_stats[domain][status_key] += 1
        
        # Recent milestones (last 3 months)
        recent_milestones = [m for m in milestones if m.visit.scheduled_date and 
                           (date.today() - m.visit.scheduled_date).days <= 90]
        
        # Upcoming milestones (next expected based on age)
        patient = await self.get_patient_by_id(patient_id)
        upcoming_milestones = await self.get_expected_milestones_for_patient(patient, "tr") if patient else []
        
        summary = MilestoneSummary(
            patient_id=patient_id,
            total_milestones_tracked=len(milestones),
            milestones_on_track=len([m for m in milestones if m.milestone_status == MilestoneStatus.ON_TRACK]),
            milestones_concerning=len([m for m in milestones if m.milestone_status in 
                                     [MilestoneStatus.CONCERNING, MilestoneStatus.DELAYED]]),
            early_intervention_referrals=len([m for m in milestones if m.early_intervention_referred]),
            domain_breakdown=domain_stats,
            recent_assessments=len(recent_milestones),
            upcoming_milestones_count=len(upcoming_milestones),
            last_assessment_date=max([m.visit.scheduled_date for m in milestones if m.visit.scheduled_date], 
                                   default=None),
            generated_at=datetime.utcnow()
        )
        
        return summary
    
    async def get_expected_milestones_for_patient(
        self,
        patient: Patient,
        language: str = "tr"
    ) -> List[MilestoneTemplate]:
        """Get expected milestones for patient's current age."""
        
        age_months = patient.age_in_months
        
        # Get milestones appropriate for patient's age (within 3 months window)
        templates = await self.get_milestone_templates(
            age_months=age_months,
            language=language
        )
        
        # Filter to milestones within reasonable window
        expected_milestones = [
            t for t in templates 
            if abs(t.expected_age_months - age_months) <= 3
        ]
        
        return expected_milestones
    
    # ==================== Batch Operations ====================
    
    async def validate_batch_milestone_creation(
        self,
        visit_id: UUID,
        template_ids: List[UUID],
        current_user: User
    ) -> None:
        """Validate batch milestone creation."""
        
        # Check visit access
        visit = await self.get_accessible_visit(visit_id, current_user)
        if not visit:
            raise NotFoundError("Visit not found or access denied")
        
        # Validate all templates exist
        for template_id in template_ids:
            template = await self.get_milestone_template_by_id(template_id)
            if not template:
                raise NotFoundError(f"Milestone template {template_id} not found")
    
    async def batch_create_milestone_tracking(
        self,
        visit_id: UUID,
        template_ids: List[UUID],
        created_by_id: UUID
    ) -> List[MilestoneTracking]:
        """Create multiple milestone tracking records from templates."""
        
        milestones = []
        
        for template_id in template_ids:
            template = await self.get_milestone_template_by_id(template_id)
            if template:
                milestone_data = MilestoneTrackingCreate(
                    visit_id=visit_id,
                    milestone_domain=template.milestone_domain,
                    milestone_name=template.milestone_name,
                    expected_age_months=template.expected_age_months
                )
                
                milestone = await self.create_milestone_tracking(milestone_data, created_by_id)
                milestones.append(milestone)
        
        await self.db.commit()
        return milestones
    
    # ==================== Analytics ====================
    
    async def get_domain_progress_analytics(
        self,
        current_user: User,
        patient_id: Optional[UUID] = None,
        age_from: Optional[int] = None,
        age_to: Optional[int] = None,
        days: int = 90
    ) -> Dict[str, Any]:
        """Get domain progress analytics."""
        
        # Placeholder implementation
        return {
            "period_days": days,
            "patient_id": patient_id,
            "age_from": age_from,
            "age_to": age_to,
            "domain_progress": {},
            "trends": {}
        }
    
    async def get_concerning_milestones_analytics(
        self,
        current_user: User,
        domain: Optional[str] = None,
        days: int = 30
    ) -> Dict[str, Any]:
        """Get concerning milestones analytics."""
        
        # Placeholder implementation
        return {
            "period_days": days,
            "domain": domain,
            "concerning_count": 0,
            "delayed_count": 0,
            "referral_count": 0
        }
    
    async def get_developmental_domains(self, language: str = "tr") -> List[Dict[str, str]]:
        """Get developmental domains reference."""
        
        if language == "tr":
            return [
                {"id": "motor", "name": "Motor Gelişim", "description": "Kaba ve ince motor beceriler"},
                {"id": "language", "name": "Dil Gelişimi", "description": "Konuşma ve dil becerileri"},
                {"id": "social", "name": "Sosyal Gelişim", "description": "Sosyal ve duygusal beceriler"},
                {"id": "cognitive", "name": "Bilişsel Gelişim", "description": "Problem çözme ve öğrenme"},
                {"id": "adaptive", "name": "Uyum Becerileri", "description": "Günlük yaşam becerileri"}
            ]
        else:
            return [
                {"id": "motor", "name": "Motor Development", "description": "Gross and fine motor skills"},
                {"id": "language", "name": "Language Development", "description": "Speech and language skills"},
                {"id": "social", "name": "Social Development", "description": "Social and emotional skills"},
                {"id": "cognitive", "name": "Cognitive Development", "description": "Problem solving and learning"},
                {"id": "adaptive", "name": "Adaptive Skills", "description": "Daily living skills"}
            ]
    
    # ==================== Helper Methods ====================
    
    async def can_access_milestone(self, milestone: MilestoneTracking, user: User) -> bool:
        """Check if user can access milestone."""
        
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        if user.role == UserRole.PARENT:
            # Check if this is their child's milestone
            if hasattr(milestone, 'visit') and hasattr(milestone.visit, 'patient'):
                return milestone.visit.patient.parent_id == user.id
        
        return False
    
    async def can_edit_milestone(self, milestone: MilestoneTracking, user: User) -> bool:
        """Check if user can edit milestone."""
        
        # Healthcare professionals can edit
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        # Parents cannot edit milestones (read-only access)
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
    
    async def get_patient_by_id(self, patient_id: UUID) -> Optional[Patient]:
        """Get patient by ID."""
        
        stmt = select(Patient).where(Patient.id == patient_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()