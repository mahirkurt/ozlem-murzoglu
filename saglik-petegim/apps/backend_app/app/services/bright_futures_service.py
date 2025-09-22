"""Bright Futures service for visit management and recommendations."""

from datetime import date, datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from uuid import UUID

import structlog
from sqlalchemy import select, and_, or_, func, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.bright_futures import (
    BrightFuturesVisit, VisitType, VisitStatus, PhysicalExamination,
    ScreeningAssessment, MilestoneTracking, ImmunizationRecord,
    GuidanceProvided, RiskAssessment, ScreeningStatus, MilestoneStatus,
    RiskLevel
)
from app.schemas.bright_futures import (
    BrightFuturesVisitCreate, BrightFuturesVisitUpdate,
    PatientBrightFuturesSummary, AgeBasedRecommendations
)
from app.api.deps import PaginationParams
from app.utils.exceptions import NotFoundError, ValidationError, AuthorizationError
from app.core.security import PermissionChecker

logger = structlog.get_logger()


class BrightFuturesService:
    """Service for managing Bright Futures visits and recommendations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    # ==================== Visit Management ====================
    
    async def build_visit_filters(
        self,
        current_user: User,
        patient_id: Optional[UUID] = None,
        visit_type: Optional[VisitType] = None,
        visit_status: Optional[VisitStatus] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None
    ) -> List:
        """Build filters for visit queries based on user permissions."""
        
        filters = []
        
        # Base permission filtering
        if current_user.role == UserRole.PARENT:
            # Parents can only see their own patients' visits
            stmt = select(Patient.id).where(Patient.parent_id == current_user.id)
            result = await self.db.execute(stmt)
            accessible_patients = [row[0] for row in result.fetchall()]
            
            if accessible_patients:
                filters.append(BrightFuturesVisit.patient_id.in_(accessible_patients))
            else:
                # No accessible patients - return empty filter that matches nothing
                filters.append(BrightFuturesVisit.id == None)
        
        # Specific filters
        if patient_id:
            filters.append(BrightFuturesVisit.patient_id == patient_id)
        
        if visit_type:
            filters.append(BrightFuturesVisit.visit_type == visit_type)
            
        if visit_status:
            filters.append(BrightFuturesVisit.visit_status == visit_status)
            
        if date_from:
            filters.append(BrightFuturesVisit.scheduled_date >= date_from)
            
        if date_to:
            filters.append(BrightFuturesVisit.scheduled_date <= date_to)
        
        return filters
    
    async def list_visits_paginated(
        self,
        filters: List,
        pagination: PaginationParams
    ) -> Tuple[List[BrightFuturesVisit], int]:
        """List Bright Futures visits with pagination."""
        
        # Build base query with relationships
        stmt = select(BrightFuturesVisit).options(
            selectinload(BrightFuturesVisit.patient),
            selectinload(BrightFuturesVisit.screenings),
            selectinload(BrightFuturesVisit.milestones),
            selectinload(BrightFuturesVisit.immunizations)
        )
        
        # Apply filters
        if filters:
            stmt = stmt.where(and_(*filters))
        
        # Get total count
        count_stmt = select(func.count(BrightFuturesVisit.id))
        if filters:
            count_stmt = count_stmt.where(and_(*filters))
        
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar()
        
        # Apply sorting
        if pagination.sort_by:
            sort_column = getattr(BrightFuturesVisit, pagination.sort_by, None)
            if sort_column:
                if pagination.sort_order == "desc":
                    stmt = stmt.order_by(desc(sort_column))
                else:
                    stmt = stmt.order_by(sort_column)
        else:
            # Default sort by scheduled date descending
            stmt = stmt.order_by(desc(BrightFuturesVisit.scheduled_date))
        
        # Apply pagination
        stmt = stmt.offset(pagination.offset).limit(pagination.limit)
        
        result = await self.db.execute(stmt)
        visits = result.scalars().all()
        
        return visits, total
    
    async def get_accessible_patient(self, patient_id: UUID, user: User) -> Optional[Patient]:
        """Get patient if user has access."""
        
        stmt = select(Patient).where(Patient.id == patient_id)
        result = await self.db.execute(stmt)
        patient = result.scalar_one_or_none()
        
        if not patient:
            return None
        
        # Check access permissions
        can_view = PermissionChecker.can_view_patient_data(
            user.role,
            str(patient.parent_id),
            str(user.id)
        )
        
        return patient if can_view else None
    
    async def validate_visit_type_for_age(self, visit_type: VisitType, age_months: int) -> None:
        """Validate that visit type is appropriate for patient age."""
        
        age_ranges = self.get_visit_type_age_ranges()
        
        if visit_type not in age_ranges:
            raise ValidationError(f"Unknown visit type: {visit_type}")
        
        min_age, max_age = age_ranges[visit_type]
        
        if age_months < min_age or age_months > max_age:
            raise ValidationError(
                f"Visit type {visit_type.value} is not appropriate for age {age_months} months. "
                f"Expected age range: {min_age}-{max_age} months."
            )
    
    def get_visit_type_age_ranges(self) -> Dict[VisitType, Tuple[int, int]]:
        """Get age ranges for visit types (in months)."""
        
        return {
            VisitType.PRENATAL: (-1, 0),  # Before birth
            VisitType.NEWBORN: (0, 0),
            VisitType.FIRST_WEEK: (0, 1),
            VisitType.ONE_MONTH: (1, 2),
            VisitType.TWO_MONTH: (2, 3),
            VisitType.FOUR_MONTH: (4, 5),
            VisitType.SIX_MONTH: (6, 7),
            VisitType.NINE_MONTH: (9, 10),
            VisitType.TWELVE_MONTH: (12, 14),
            VisitType.FIFTEEN_MONTH: (15, 17),
            VisitType.EIGHTEEN_MONTH: (18, 20),
            VisitType.TWO_YEAR: (24, 26),
            VisitType.TWO_HALF_YEAR: (30, 32),
            VisitType.THREE_YEAR: (36, 38),
            VisitType.FOUR_YEAR: (48, 50),
            VisitType.FIVE_YEAR: (60, 62),
            VisitType.SIX_YEAR: (72, 74),
            VisitType.SEVEN_YEAR: (84, 86),
            VisitType.EIGHT_YEAR: (96, 98),
            VisitType.NINE_YEAR: (108, 110),
            VisitType.TEN_YEAR: (120, 122),
            VisitType.ELEVEN_YEAR: (132, 134),
            VisitType.TWELVE_YEAR: (144, 146),
            VisitType.THIRTEEN_YEAR: (156, 158),
            VisitType.FOURTEEN_YEAR: (168, 170),
            VisitType.FIFTEEN_YEAR: (180, 182),
            VisitType.SIXTEEN_YEAR: (192, 194),
            VisitType.SEVENTEEN_YEAR: (204, 206),
            VisitType.EIGHTEEN_YEAR: (216, 218),
            VisitType.NINETEEN_YEAR: (228, 230),
            VisitType.TWENTY_YEAR: (240, 242),
            VisitType.TWENTYONE_YEAR: (252, 254),
        }
    
    async def create_visit(
        self,
        visit_data: BrightFuturesVisitCreate,
        created_by_id: UUID
    ) -> BrightFuturesVisit:
        """Create a new Bright Futures visit."""
        
        visit = BrightFuturesVisit(
            patient_id=visit_data.patient_id,
            visit_type=visit_data.visit_type,
            scheduled_date=visit_data.scheduled_date,
            age_months=visit_data.age_months,
            corrected_age_months=visit_data.corrected_age_months,
            chief_concerns=visit_data.chief_concerns,
            visit_status=VisitStatus.SCHEDULED,
            created_by_id=created_by_id
        )
        
        self.db.add(visit)
        await self.db.flush()
        await self.db.refresh(visit)
        
        return visit
    
    async def get_visit_with_details(
        self,
        visit_id: UUID,
        user: User,
        include_details: bool = True
    ) -> Optional[BrightFuturesVisit]:
        """Get visit with detailed information if user has access."""
        
        # Build query with optional detailed loading
        stmt = select(BrightFuturesVisit).where(BrightFuturesVisit.id == visit_id)
        
        if include_details:
            stmt = stmt.options(
                selectinload(BrightFuturesVisit.patient),
                selectinload(BrightFuturesVisit.physical_exams),
                selectinload(BrightFuturesVisit.screenings),
                selectinload(BrightFuturesVisit.milestones),
                selectinload(BrightFuturesVisit.immunizations),
                selectinload(BrightFuturesVisit.guidance_provided),
                selectinload(BrightFuturesVisit.risk_assessments)
            )
        else:
            stmt = stmt.options(selectinload(BrightFuturesVisit.patient))
        
        result = await self.db.execute(stmt)
        visit = result.scalar_one_or_none()
        
        if not visit:
            return None
        
        # Check access permissions
        if not await self.can_access_visit(visit, user):
            return None
        
        return visit
    
    async def get_visit_for_update(
        self,
        visit_id: UUID,
        user: User
    ) -> Optional[BrightFuturesVisit]:
        """Get visit for update operations."""
        
        visit = await self.get_visit_with_details(visit_id, user, include_details=False)
        
        if not visit:
            return None
        
        # Check edit permissions
        if not await self.can_edit_visit(visit, user):
            return None
        
        return visit
    
    async def update_visit(
        self,
        visit: BrightFuturesVisit,
        visit_update: BrightFuturesVisitUpdate,
        updated_by_id: UUID
    ) -> BrightFuturesVisit:
        """Update Bright Futures visit."""
        
        # Update basic fields
        if visit_update.scheduled_date is not None:
            visit.scheduled_date = visit_update.scheduled_date
        
        if visit_update.visit_status is not None:
            visit.visit_status = visit_update.visit_status
        
        if visit_update.chief_concerns is not None:
            visit.chief_concerns = visit_update.chief_concerns
        
        if visit_update.visit_summary is not None:
            visit.visit_summary = visit_update.visit_summary
        
        if visit_update.follow_up_instructions is not None:
            visit.follow_up_instructions = visit_update.follow_up_instructions
        
        if visit_update.next_visit_due_date is not None:
            visit.next_visit_due_date = visit_update.next_visit_due_date
        
        if visit_update.provider_notes is not None:
            visit.provider_notes = visit_update.provider_notes
        
        if visit_update.recommendations is not None:
            visit.recommendations = visit_update.recommendations
        
        if visit_update.alerts_flags is not None:
            visit.alerts_flags = visit_update.alerts_flags
        
        # Update tracking fields
        visit.updated_by_id = updated_by_id
        visit.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(visit)
        
        return visit
    
    async def cancel_visit(
        self,
        visit: BrightFuturesVisit,
        reason: Optional[str],
        cancelled_by_id: UUID
    ) -> None:
        """Cancel a visit."""
        
        visit.visit_status = VisitStatus.CANCELLED
        visit.updated_by_id = cancelled_by_id
        visit.updated_at = datetime.utcnow()
        
        if reason:
            if not visit.provider_notes:
                visit.provider_notes = f"Cancelled: {reason}"
            else:
                visit.provider_notes += f"\nCancelled: {reason}"
        
        await self.db.flush()
    
    async def complete_visit(
        self,
        visit: BrightFuturesVisit,
        summary: Optional[str],
        completed_by_id: UUID
    ) -> BrightFuturesVisit:
        """Mark visit as completed."""
        
        visit.visit_status = VisitStatus.COMPLETED
        visit.completed_date = date.today()
        visit.updated_by_id = completed_by_id
        visit.updated_at = datetime.utcnow()
        
        if summary:
            visit.visit_summary = summary
        
        await self.db.flush()
        await self.db.refresh(visit)
        
        return visit
    
    # ==================== Patient Summary and Analytics ====================
    
    async def generate_patient_summary(self, patient_id: UUID) -> PatientBrightFuturesSummary:
        """Generate comprehensive Bright Futures summary for patient."""
        
        # Get patient
        patient = await self.get_patient_by_id(patient_id)
        if not patient:
            raise NotFoundError("Patient not found")
        
        # Get all visits
        visits_stmt = select(BrightFuturesVisit).options(
            selectinload(BrightFuturesVisit.screenings),
            selectinload(BrightFuturesVisit.milestones),
            selectinload(BrightFuturesVisit.immunizations)
        ).where(BrightFuturesVisit.patient_id == patient_id).order_by(BrightFuturesVisit.scheduled_date)
        
        visits_result = await self.db.execute(visits_stmt)
        visits = visits_result.scalars().all()
        
        # Calculate summary statistics
        total_visits = len(visits)
        completed_visits = len([v for v in visits if v.visit_status == VisitStatus.COMPLETED])
        
        # Screening summary
        all_screenings = []
        for visit in visits:
            all_screenings.extend(visit.screenings)
        
        completed_screenings = [s for s in all_screenings if s.screening_status == ScreeningStatus.COMPLETED]
        high_risk_screenings = [s for s in completed_screenings if s.risk_level == RiskLevel.HIGH]
        
        # Milestone summary
        all_milestones = []
        for visit in visits:
            all_milestones.extend(visit.milestones)
        
        concerning_milestones = [m for m in all_milestones 
                               if m.milestone_status in [MilestoneStatus.CONCERNING, MilestoneStatus.DELAYED]]
        
        # Immunization summary
        all_immunizations = []
        for visit in visits:
            all_immunizations.extend(visit.immunizations)
        
        up_to_date_immunizations = [i for i in all_immunizations if i.is_up_to_date]
        
        # Recent visit
        recent_visit = visits[-1] if visits else None
        
        # Next recommended visit
        next_visit = await self.get_next_recommended_visit(patient)
        
        summary = PatientBrightFuturesSummary(
            patient_id=patient_id,
            patient_name=patient.full_name,
            patient_age_months=patient.age_in_months,
            total_visits=total_visits,
            completed_visits=completed_visits,
            upcoming_visits=0,  # Would calculate from scheduled visits
            overdue_visits=0,   # Would calculate based on recommendations
            screening_summary={
                "total_completed": len(completed_screenings),
                "high_risk_count": len(high_risk_screenings),
                "tools_used": list(set(s.screening_tool for s in completed_screenings))
            },
            milestone_summary={
                "total_assessed": len(all_milestones),
                "concerning_count": len(concerning_milestones),
                "on_track_count": len([m for m in all_milestones 
                                     if m.milestone_status == MilestoneStatus.ON_TRACK])
            },
            immunization_summary={
                "total_doses": len(all_immunizations),
                "up_to_date_count": len(up_to_date_immunizations),
                "overdue_count": len(all_immunizations) - len(up_to_date_immunizations)
            },
            recent_visit_date=recent_visit.scheduled_date if recent_visit else None,
            next_visit_due=next_visit.get("due_date") if next_visit else None,
            alerts=self.generate_patient_alerts(patient, visits),
            last_updated=datetime.utcnow()
        )
        
        return summary
    
    async def generate_age_based_recommendations(self, patient: Patient) -> AgeBasedRecommendations:
        """Generate age-appropriate recommendations for patient."""
        
        age_months = patient.age_in_months
        
        # Get appropriate screenings
        recommended_screenings = await self.get_recommended_screenings_for_age(age_months)
        
        # Get immunization recommendations
        recommended_immunizations = await self.get_recommended_immunizations_for_age(age_months)
        
        # Get guidance topics
        guidance_topics = self.get_guidance_topics_for_age(age_months)
        
        # Get next visit recommendation
        next_visit = await self.get_next_recommended_visit(patient)
        
        recommendations = AgeBasedRecommendations(
            patient_id=patient.id,
            patient_age_months=age_months,
            recommended_screenings=recommended_screenings,
            recommended_immunizations=recommended_immunizations,
            guidance_topics=guidance_topics,
            next_visit_type=next_visit.get("visit_type") if next_visit else None,
            next_visit_due_date=next_visit.get("due_date") if next_visit else None,
            safety_priorities=self.get_safety_priorities_for_age(age_months),
            developmental_expectations=self.get_developmental_expectations_for_age(age_months),
            generated_at=datetime.utcnow()
        )
        
        return recommendations
    
    async def generate_visit_schedule(
        self, 
        patient: Patient, 
        future_only: bool = True
    ) -> List[Dict[str, Any]]:
        """Generate visit schedule for patient."""
        
        age_months = patient.age_in_months
        birth_date = patient.date_of_birth
        
        # Get standard Bright Futures schedule
        standard_schedule = self.get_standard_visit_schedule()
        
        schedule = []
        
        for visit_type, recommended_age in standard_schedule.items():
            visit_date = birth_date + timedelta(days=recommended_age * 30.44)  # Average days per month
            
            # Skip past visits if future_only is True
            if future_only and visit_date < date.today():
                continue
            
            # Check if visit already exists
            existing_visit = await self.get_existing_visit(patient.id, visit_type)
            
            schedule_item = {
                "visit_type": visit_type.value,
                "recommended_age_months": recommended_age,
                "recommended_date": visit_date,
                "status": "completed" if existing_visit and existing_visit.visit_status == VisitStatus.COMPLETED
                        else "scheduled" if existing_visit 
                        else "due" if visit_date <= date.today() + timedelta(days=30)
                        else "upcoming",
                "existing_visit_id": existing_visit.id if existing_visit else None,
                "priority": "high" if visit_date < date.today() else "normal"
            }
            
            schedule.append(schedule_item)
        
        # Sort by recommended date
        schedule.sort(key=lambda x: x["recommended_date"])
        
        return schedule
    
    # ==================== Dashboard and Statistics ====================
    
    async def generate_dashboard_stats(
        self, 
        current_user: User, 
        date_range: int
    ) -> Dict[str, Any]:
        """Generate dashboard statistics."""
        
        end_date = date.today()
        start_date = end_date - timedelta(days=date_range)
        
        # Build base filters for user's accessible data
        accessible_patients = await self.get_accessible_patient_ids(current_user)
        
        if not accessible_patients:
            return self.get_empty_dashboard_stats()
        
        # Visit statistics
        visit_stats = await self.get_visit_statistics(
            accessible_patients, start_date, end_date
        )
        
        # Screening statistics
        screening_stats = await self.get_screening_statistics(
            accessible_patients, start_date, end_date
        )
        
        # Milestone statistics
        milestone_stats = await self.get_milestone_statistics(
            accessible_patients, start_date, end_date
        )
        
        # Upcoming and overdue visits
        upcoming_overdue = await self.get_upcoming_overdue_visits(accessible_patients)
        
        return {
            "date_range": date_range,
            "period_start": start_date,
            "period_end": end_date,
            "visits": visit_stats,
            "screenings": screening_stats,
            "milestones": milestone_stats,
            "upcoming_visits": upcoming_overdue["upcoming"],
            "overdue_visits": upcoming_overdue["overdue"],
            "total_patients": len(accessible_patients)
        }
    
    async def calculate_patient_age_info(self, patient: Patient) -> Dict[str, Any]:
        """Calculate detailed age information for patient."""
        
        birth_date = patient.date_of_birth
        today = date.today()
        
        # Calculate chronological age
        chronological_months = patient.age_in_months
        
        # Calculate corrected age if premature
        corrected_months = chronological_months
        if patient.gestational_age_weeks and patient.gestational_age_weeks < 37:
            weeks_early = 40 - patient.gestational_age_weeks
            days_early = weeks_early * 7
            corrected_birth_date = birth_date + timedelta(days=days_early)
            
            months_diff = (today.year - corrected_birth_date.year) * 12
            months_diff += today.month - corrected_birth_date.month
            if today.day < corrected_birth_date.day:
                months_diff -= 1
            
            corrected_months = max(0, months_diff)
        
        # Get age category
        age_category = self.get_age_category(chronological_months)
        
        return {
            "chronological_age_months": chronological_months,
            "corrected_age_months": corrected_months,
            "gestational_age_weeks": patient.gestational_age_weeks,
            "age_category": age_category,
            "is_premature": patient.gestational_age_weeks and patient.gestational_age_weeks < 37,
            "use_corrected_age": corrected_months != chronological_months,
            "birth_date": birth_date,
            "age_display_chronological": patient.age_display,
            "age_display_corrected": self.format_age_display(corrected_months)
        }
    
    # ==================== Helper Methods ====================
    
    async def can_access_visit(self, visit: BrightFuturesVisit, user: User) -> bool:
        """Check if user can access visit."""
        
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        if user.role == UserRole.PARENT:
            # Check if this is their child's visit
            if hasattr(visit, 'patient'):
                return visit.patient.parent_id == user.id
            else:
                # Load patient if not already loaded
                patient = await self.get_patient_by_id(visit.patient_id)
                return patient and patient.parent_id == user.id
        
        return False
    
    async def can_edit_visit(self, visit: BrightFuturesVisit, user: User) -> bool:
        """Check if user can edit visit."""
        
        # Healthcare professionals can edit
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        # Parents cannot edit visits (read-only access)
        return False
    
    async def get_patient_by_id(self, patient_id: UUID) -> Optional[Patient]:
        """Get patient by ID."""
        
        stmt = select(Patient).where(Patient.id == patient_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_accessible_patient_ids(self, user: User) -> List[UUID]:
        """Get list of patient IDs accessible to user."""
        
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            # Healthcare professionals can access all patients
            stmt = select(Patient.id)
            result = await self.db.execute(stmt)
            return [row[0] for row in result.fetchall()]
        elif user.role == UserRole.PARENT:
            # Parents can only access their own children
            stmt = select(Patient.id).where(Patient.parent_id == user.id)
            result = await self.db.execute(stmt)
            return [row[0] for row in result.fetchall()]
        else:
            return []
    
    def get_standard_visit_schedule(self) -> Dict[VisitType, int]:
        """Get standard Bright Futures visit schedule (age in months)."""
        
        return {
            VisitType.PRENATAL: -1,
            VisitType.NEWBORN: 0,
            VisitType.FIRST_WEEK: 0.25,
            VisitType.ONE_MONTH: 1,
            VisitType.TWO_MONTH: 2,
            VisitType.FOUR_MONTH: 4,
            VisitType.SIX_MONTH: 6,
            VisitType.NINE_MONTH: 9,
            VisitType.TWELVE_MONTH: 12,
            VisitType.FIFTEEN_MONTH: 15,
            VisitType.EIGHTEEN_MONTH: 18,
            VisitType.TWO_YEAR: 24,
            VisitType.TWO_HALF_YEAR: 30,
            VisitType.THREE_YEAR: 36,
            VisitType.FOUR_YEAR: 48,
            VisitType.FIVE_YEAR: 60,
            VisitType.SIX_YEAR: 72,
            VisitType.SEVEN_YEAR: 84,
            VisitType.EIGHT_YEAR: 96,
            VisitType.NINE_YEAR: 108,
            VisitType.TEN_YEAR: 120,
            VisitType.ELEVEN_YEAR: 132,
            VisitType.TWELVE_YEAR: 144,
            VisitType.THIRTEEN_YEAR: 156,
            VisitType.FOURTEEN_YEAR: 168,
            VisitType.FIFTEEN_YEAR: 180,
            VisitType.SIXTEEN_YEAR: 192,
            VisitType.SEVENTEEN_YEAR: 204,
            VisitType.EIGHTEEN_YEAR: 216,
            VisitType.NINETEEN_YEAR: 228,
            VisitType.TWENTY_YEAR: 240,
            VisitType.TWENTYONE_YEAR: 252,
        }
    
    async def get_existing_visit(
        self, 
        patient_id: UUID, 
        visit_type: VisitType
    ) -> Optional[BrightFuturesVisit]:
        """Check if visit already exists for patient and type."""
        
        stmt = select(BrightFuturesVisit).where(
            and_(
                BrightFuturesVisit.patient_id == patient_id,
                BrightFuturesVisit.visit_type == visit_type
            )
        )
        
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_next_recommended_visit(self, patient: Patient) -> Dict[str, Any]:
        """Get next recommended visit for patient."""
        
        age_months = patient.age_in_months
        schedule = self.get_standard_visit_schedule()
        
        # Find next visit type based on age
        for visit_type, recommended_age in schedule.items():
            if recommended_age > age_months:
                # Check if this visit already exists
                existing_visit = await self.get_existing_visit(patient.id, visit_type)
                
                if not existing_visit:
                    due_date = patient.date_of_birth + timedelta(days=recommended_age * 30.44)
                    return {
                        "visit_type": visit_type,
                        "due_date": due_date,
                        "recommended_age_months": recommended_age
                    }
        
        return {}
    
    def get_age_category(self, age_months: int) -> str:
        """Get age category for patient."""
        
        if age_months < 1:
            return "newborn"
        elif age_months < 12:
            return "infant"
        elif age_months < 36:
            return "toddler"
        elif age_months < 72:
            return "preschool"
        elif age_months < 144:
            return "school_age"
        else:
            return "adolescent"
    
    def format_age_display(self, months: int) -> str:
        """Format age for display."""
        
        if months < 12:
            return f"{months} ay"
        else:
            years = months // 12
            remaining_months = months % 12
            if remaining_months == 0:
                return f"{years} yaş"
            else:
                return f"{years} yaş {remaining_months} ay"
    
    # ==================== Placeholder Methods ====================
    # These would be fully implemented with proper business logic
    
    def generate_patient_alerts(
        self, 
        patient: Patient, 
        visits: List[BrightFuturesVisit]
    ) -> List[str]:
        """Generate alerts for patient."""
        
        alerts = []
        
        # Check for overdue visits
        age_months = patient.age_in_months
        if age_months > 12 and not any(v.visit_type == VisitType.TWELVE_MONTH 
                                      and v.visit_status == VisitStatus.COMPLETED 
                                      for v in visits):
            alerts.append("Overdue for 12-month visit")
        
        return alerts
    
    async def get_recommended_screenings_for_age(self, age_months: int) -> List[str]:
        """Get recommended screenings for age."""
        
        screenings = []
        
        if 16 <= age_months <= 30:
            screenings.append("M-CHAT-R")
        
        if age_months >= 4:
            screenings.append("ASQ-3")
        
        return screenings
    
    async def get_recommended_immunizations_for_age(self, age_months: int) -> List[str]:
        """Get recommended immunizations for age."""
        
        # This would be based on Turkish immunization schedule
        return []
    
    def get_guidance_topics_for_age(self, age_months: int) -> List[str]:
        """Get guidance topics appropriate for age."""
        
        topics = ["Safety", "Nutrition", "Sleep"]
        
        if age_months < 12:
            topics.extend(["Breastfeeding", "SIDS Prevention"])
        elif age_months < 36:
            topics.extend(["Toilet Training", "Language Development"])
        else:
            topics.extend(["School Readiness", "Screen Time"])
        
        return topics
    
    def get_safety_priorities_for_age(self, age_months: int) -> List[str]:
        """Get safety priorities for age."""
        
        if age_months < 12:
            return ["Car seat safety", "Safe sleep", "Water safety"]
        elif age_months < 36:
            return ["Childproofing", "Poison prevention", "Fall prevention"]
        else:
            return ["Street safety", "Stranger danger", "Internet safety"]
    
    def get_developmental_expectations_for_age(self, age_months: int) -> List[str]:
        """Get developmental expectations for age."""
        
        if age_months < 12:
            return ["Social smile", "Rolling over", "Sitting up"]
        elif age_months < 24:
            return ["Walking", "First words", "Following simple commands"]
        else:
            return ["Toilet training", "Playing with others", "Following rules"]
    
    # Statistics helper methods (simplified implementations)
    
    async def get_visit_statistics(
        self, 
        patient_ids: List[UUID], 
        start_date: date, 
        end_date: date
    ) -> Dict[str, int]:
        """Get visit statistics."""
        
        stmt = select(func.count(BrightFuturesVisit.id)).where(
            and_(
                BrightFuturesVisit.patient_id.in_(patient_ids),
                BrightFuturesVisit.scheduled_date.between(start_date, end_date)
            )
        )
        
        result = await self.db.execute(stmt)
        total = result.scalar() or 0
        
        return {
            "total": total,
            "completed": 0,  # Would calculate properly
            "scheduled": 0,
            "cancelled": 0
        }
    
    async def get_screening_statistics(
        self, 
        patient_ids: List[UUID], 
        start_date: date, 
        end_date: date
    ) -> Dict[str, int]:
        """Get screening statistics."""
        
        return {
            "total": 0,
            "completed": 0,
            "high_risk": 0
        }
    
    async def get_milestone_statistics(
        self, 
        patient_ids: List[UUID], 
        start_date: date, 
        end_date: date
    ) -> Dict[str, int]:
        """Get milestone statistics."""
        
        return {
            "total": 0,
            "on_track": 0,
            "concerning": 0
        }
    
    async def get_upcoming_overdue_visits(
        self, 
        patient_ids: List[UUID]
    ) -> Dict[str, int]:
        """Get upcoming and overdue visit counts."""
        
        return {
            "upcoming": 0,
            "overdue": 0
        }
    
    def get_empty_dashboard_stats(self) -> Dict[str, Any]:
        """Get empty dashboard stats when no accessible patients."""
        
        return {
            "visits": {"total": 0, "completed": 0, "scheduled": 0, "cancelled": 0},
            "screenings": {"total": 0, "completed": 0, "high_risk": 0},
            "milestones": {"total": 0, "on_track": 0, "concerning": 0},
            "upcoming_visits": 0,
            "overdue_visits": 0,
            "total_patients": 0
        }