"""Immunization service for Turkish vaccination schedule management."""

from datetime import date, datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from uuid import UUID

import structlog
from sqlalchemy import select, and_, desc, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.bright_futures import ImmunizationRecord, ImmunizationSchedule
from app.schemas.bright_futures import (
    ImmunizationRecordCreate, ImmunizationRecordUpdate,
    PatientImmunizationStatus, VaccinationPlan
)
from app.api.deps import PaginationParams
from app.utils.exceptions import NotFoundError, ValidationError, AuthorizationError

logger = structlog.get_logger()


class ImmunizationService:
    """Service for managing immunization records and Turkish vaccination schedule."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    # ==================== Turkish Immunization Schedule ====================
    
    async def get_immunization_schedule(
        self,
        age_months: Optional[int] = None,
        vaccine_name: Optional[str] = None,
        language: str = "tr"
    ) -> List[ImmunizationSchedule]:
        """Get Turkish immunization schedule."""
        
        stmt = select(ImmunizationSchedule).where(ImmunizationSchedule.is_active == True)
        
        if age_months is not None:
            stmt = stmt.where(
                and_(
                    ImmunizationSchedule.minimum_age_months <= age_months,
                    ImmunizationSchedule.maximum_age_months >= age_months
                )
            )
        
        if vaccine_name:
            stmt = stmt.where(ImmunizationSchedule.vaccine_name.ilike(f"%{vaccine_name}%"))
        
        stmt = stmt.order_by(
            ImmunizationSchedule.recommended_age_months,
            ImmunizationSchedule.vaccine_name
        )
        
        result = await self.db.execute(stmt)
        return result.scalars().all()
    
    async def get_schedule_item_by_id(
        self, 
        schedule_id: UUID, 
        language: str = "tr"
    ) -> Optional[ImmunizationSchedule]:
        """Get immunization schedule item by ID."""
        
        stmt = select(ImmunizationSchedule).where(
            and_(
                ImmunizationSchedule.id == schedule_id,
                ImmunizationSchedule.is_active == True
            )
        )
        
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    # ==================== Immunization Records ====================
    
    async def build_immunization_filters(
        self,
        current_user: User,
        patient_id: Optional[UUID] = None,
        visit_id: Optional[UUID] = None,
        vaccine_name: Optional[str] = None,
        up_to_date_only: bool = False,
        overdue_only: bool = False
    ) -> List:
        """Build filters for immunization queries."""
        
        filters = []
        
        # Base permission filtering
        if current_user.role == UserRole.PARENT:
            # Parents can only see their own patients' immunizations
            stmt = select(Patient.id).where(Patient.parent_id == current_user.id)
            result = await self.db.execute(stmt)
            accessible_patients = [row[0] for row in result.fetchall()]
            
            filters.append(ImmunizationRecord.patient_id.in_(accessible_patients))
        
        # Specific filters
        if patient_id:
            filters.append(ImmunizationRecord.patient_id == patient_id)
        
        if visit_id:
            filters.append(ImmunizationRecord.visit_id == visit_id)
        
        if vaccine_name:
            filters.append(ImmunizationRecord.vaccine_name.ilike(f"%{vaccine_name}%"))
        
        if up_to_date_only:
            filters.append(ImmunizationRecord.is_up_to_date == True)
        
        if overdue_only:
            filters.append(ImmunizationRecord.is_up_to_date == False)
        
        return filters
    
    async def list_immunization_records_paginated(
        self,
        filters: List,
        pagination: PaginationParams
    ) -> Tuple[List[ImmunizationRecord], int]:
        """List immunization records with pagination."""
        
        # Build base query
        stmt = select(ImmunizationRecord).options(
            selectinload(ImmunizationRecord.patient),
            selectinload(ImmunizationRecord.visit)
        )
        
        # Apply filters
        if filters:
            stmt = stmt.where(and_(*filters))
        
        # Get total count
        count_stmt = select(func.count(ImmunizationRecord.id))
        if filters:
            count_stmt = count_stmt.where(and_(*filters))
        
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar()
        
        # Apply sorting
        stmt = stmt.order_by(desc(ImmunizationRecord.administered_date))
        
        # Apply pagination
        stmt = stmt.offset(pagination.offset).limit(pagination.limit)
        
        result = await self.db.execute(stmt)
        records = result.scalars().all()
        
        return records, total
    
    async def validate_immunization_creation(
        self,
        patient_id: UUID,
        vaccine_name: str,
        current_user: User
    ) -> None:
        """Validate immunization creation."""
        
        # Check if patient exists and user has access
        patient = await self.get_accessible_patient(patient_id, current_user)
        if not patient:
            raise NotFoundError("Patient not found or access denied")
    
    async def create_immunization_record(
        self,
        immunization_data: ImmunizationRecordCreate,
        created_by_id: UUID
    ) -> ImmunizationRecord:
        """Create immunization record."""
        
        immunization = ImmunizationRecord(
            patient_id=immunization_data.patient_id,
            visit_id=immunization_data.visit_id,
            vaccine_name=immunization_data.vaccine_name,
            vaccine_code=immunization_data.vaccine_code,
            manufacturer=immunization_data.manufacturer,
            lot_number=immunization_data.lot_number,
            expiration_date=immunization_data.expiration_date,
            administered_date=immunization_data.administered_date,
            dose_number=immunization_data.dose_number,
            route=immunization_data.route,
            site=immunization_data.site,
            administered_by=immunization_data.administered_by,
            clinic_name=immunization_data.clinic_name,
            is_up_to_date=True,  # Default to up to date
            notes=immunization_data.notes,
            created_by_id=created_by_id
        )
        
        self.db.add(immunization)
        await self.db.flush()
        await self.db.refresh(immunization)
        
        return immunization
    
    async def get_immunization_with_access_check(
        self,
        immunization_id: UUID,
        current_user: User
    ) -> Optional[ImmunizationRecord]:
        """Get immunization with access check."""
        
        stmt = select(ImmunizationRecord).options(
            selectinload(ImmunizationRecord.patient)
        ).where(ImmunizationRecord.id == immunization_id)
        
        result = await self.db.execute(stmt)
        immunization = result.scalar_one_or_none()
        
        if not immunization:
            return None
        
        # Check access permissions
        if not await self.can_access_immunization(immunization, current_user):
            return None
            
        return immunization
    
    async def get_immunization_for_update(
        self,
        immunization_id: UUID,
        current_user: User
    ) -> Optional[ImmunizationRecord]:
        """Get immunization for update operations."""
        
        immunization = await self.get_immunization_with_access_check(immunization_id, current_user)
        
        if not immunization:
            return None
        
        # Check edit permissions
        if not await self.can_edit_immunization(immunization, current_user):
            return None
            
        return immunization
    
    async def update_immunization_record(
        self,
        immunization: ImmunizationRecord,
        immunization_update: ImmunizationRecordUpdate,
        updated_by_id: UUID
    ) -> ImmunizationRecord:
        """Update immunization record."""
        
        # Update fields
        if immunization_update.vaccine_name is not None:
            immunization.vaccine_name = immunization_update.vaccine_name
        
        if immunization_update.administered_date is not None:
            immunization.administered_date = immunization_update.administered_date
        
        if immunization_update.lot_number is not None:
            immunization.lot_number = immunization_update.lot_number
        
        if immunization_update.notes is not None:
            immunization.notes = immunization_update.notes
        
        if immunization_update.adverse_reactions is not None:
            immunization.adverse_reactions = immunization_update.adverse_reactions
        
        # Update tracking fields
        immunization.updated_by_id = updated_by_id
        immunization.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(immunization)
        
        return immunization
    
    async def delete_immunization_record(self, immunization: ImmunizationRecord) -> None:
        """Delete immunization record."""
        
        await self.db.delete(immunization)
        await self.db.flush()
    
    # ==================== Patient Status and Planning ====================
    
    async def generate_immunization_status(
        self,
        patient: Patient,
        language: str = "tr"
    ) -> PatientImmunizationStatus:
        """Generate immunization status for patient."""
        
        # Get all immunizations for patient
        immunizations = await self.get_patient_immunizations(patient.id)
        
        # Get recommended schedule for patient's age
        age_months = patient.age_in_months
        recommended_schedule = await self.get_immunization_schedule(age_months=age_months, language=language)
        
        # Calculate status
        total_doses = len(immunizations)
        up_to_date_count = len([i for i in immunizations if i.is_up_to_date])
        overdue_vaccines = await self.get_overdue_vaccinations(patient, language)
        
        status = PatientImmunizationStatus(
            patient_id=patient.id,
            patient_age_months=age_months,
            total_doses_received=total_doses,
            up_to_date_count=up_to_date_count,
            overdue_count=len(overdue_vaccines),
            completion_percentage=self.calculate_completion_percentage(patient, immunizations),
            overdue_vaccines=[v.vaccine_name for v in overdue_vaccines[:5]],  # Top 5 overdue
            next_due_vaccines=await self.get_next_due_vaccines(patient, language),
            last_vaccination_date=max([i.administered_date for i in immunizations]) if immunizations else None,
            status_summary=self.get_status_summary(up_to_date_count, len(overdue_vaccines), language),
            generated_at=datetime.utcnow()
        )
        
        return status
    
    async def generate_vaccination_plan(
        self,
        patient: Patient,
        months_ahead: int = 12,
        language: str = "tr"
    ) -> VaccinationPlan:
        """Generate vaccination plan for patient."""
        
        age_months = patient.age_in_months
        plan_end_age = age_months + months_ahead
        
        # Get schedule for age range
        schedule_items = []
        for month in range(age_months, plan_end_age + 1):
            month_schedule = await self.get_immunization_schedule(age_months=month, language=language)
            schedule_items.extend(month_schedule)
        
        # Remove duplicates and sort by date
        unique_vaccines = {}
        for item in schedule_items:
            key = f"{item.vaccine_name}_{item.dose_number}"
            if key not in unique_vaccines:
                unique_vaccines[key] = item
        
        # Calculate due dates
        plan_items = []
        birth_date = patient.date_of_birth
        
        for vaccine in unique_vaccines.values():
            due_date = birth_date + timedelta(days=vaccine.recommended_age_months * 30.44)
            
            # Check if already received
            existing_record = await self.check_existing_immunization(
                patient.id, vaccine.vaccine_name, vaccine.dose_number
            )
            
            plan_items.append({
                "vaccine_name": vaccine.vaccine_name,
                "dose_number": vaccine.dose_number,
                "due_date": due_date,
                "age_due_months": vaccine.recommended_age_months,
                "status": "completed" if existing_record else "due",
                "is_overdue": due_date < date.today(),
                "priority": "high" if due_date < date.today() else "normal"
            })
        
        plan = VaccinationPlan(
            patient_id=patient.id,
            plan_start_date=date.today(),
            plan_end_date=date.today() + timedelta(days=months_ahead * 30.44),
            planned_vaccines=plan_items,
            overdue_count=len([p for p in plan_items if p["is_overdue"]]),
            upcoming_count=len([p for p in plan_items if not p["is_overdue"] and p["status"] == "due"]),
            total_planned=len(plan_items),
            generated_at=datetime.utcnow()
        )
        
        return plan
    
    async def get_overdue_vaccinations(
        self,
        patient: Patient,
        language: str = "tr"
    ) -> List[ImmunizationSchedule]:
        """Get overdue vaccinations for patient."""
        
        age_months = patient.age_in_months
        
        # Get all vaccines that should have been given by now
        overdue_schedule = await self.get_immunization_schedule(language=language)
        overdue_vaccines = []
        
        for vaccine in overdue_schedule:
            if vaccine.recommended_age_months < age_months:
                # Check if patient received this vaccine
                existing = await self.check_existing_immunization(
                    patient.id, vaccine.vaccine_name, vaccine.dose_number
                )
                
                if not existing:
                    overdue_vaccines.append(vaccine)
        
        return overdue_vaccines
    
    async def get_vaccinations_due_soon(
        self,
        patient: Patient,
        weeks_ahead: int = 4,
        language: str = "tr"
    ) -> List[ImmunizationSchedule]:
        """Get vaccinations due soon."""
        
        age_months = patient.age_in_months
        future_age_months = age_months + (weeks_ahead * 0.25)  # Convert weeks to months
        
        due_soon = []
        schedule = await self.get_immunization_schedule(language=language)
        
        for vaccine in schedule:
            if age_months <= vaccine.recommended_age_months <= future_age_months:
                # Check if not already received
                existing = await self.check_existing_immunization(
                    patient.id, vaccine.vaccine_name, vaccine.dose_number
                )
                
                if not existing:
                    due_soon.append(vaccine)
        
        return due_soon
    
    # ==================== Batch Operations ====================
    
    async def validate_batch_immunization_creation(
        self,
        immunization_data_list: List[ImmunizationRecordCreate],
        visit_id: Optional[UUID],
        current_user: User
    ) -> None:
        """Validate batch immunization creation."""
        
        # Validate each immunization
        for immunization_data in immunization_data_list:
            await self.validate_immunization_creation(
                immunization_data.patient_id,
                immunization_data.vaccine_name,
                current_user
            )
    
    async def batch_create_immunization_records(
        self,
        immunization_data_list: List[ImmunizationRecordCreate],
        visit_id: Optional[UUID],
        created_by_id: UUID
    ) -> List[ImmunizationRecord]:
        """Create multiple immunization records."""
        
        immunizations = []
        
        for immunization_data in immunization_data_list:
            if visit_id:
                immunization_data.visit_id = visit_id
            
            immunization = await self.create_immunization_record(immunization_data, created_by_id)
            immunizations.append(immunization)
        
        await self.db.commit()
        return immunizations
    
    # ==================== Vaccine Information ====================
    
    async def get_vaccine_information(self, language: str = "tr") -> List[Dict[str, Any]]:
        """Get vaccine information reference."""
        
        # Placeholder - would load from database
        if language == "tr":
            return [
                {
                    "name": "BCG",
                    "name_tr": "Verem Aşısı",
                    "description": "Tüberküloza karşı koruma sağlar",
                    "route": "İntradermal",
                    "age": "Doğumda"
                },
                {
                    "name": "Hepatit B",
                    "name_tr": "Hepatit B Aşısı", 
                    "description": "Hepatit B enfeksiyonuna karşı koruma",
                    "route": "İntramusküler",
                    "age": "Doğumda, 2., 4., 6. ay"
                }
            ]
        else:
            return [
                {
                    "name": "BCG",
                    "description": "Protects against tuberculosis",
                    "route": "Intradermal",
                    "age": "At birth"
                }
            ]
    
    async def get_vaccine_details(self, vaccine_name: str, language: str = "tr") -> Optional[Dict[str, Any]]:
        """Get detailed vaccine information."""
        
        vaccines = await self.get_vaccine_information(language)
        for vaccine in vaccines:
            if vaccine["name"].lower() == vaccine_name.lower():
                return vaccine
        
        return None
    
    # ==================== Analytics ====================
    
    async def get_coverage_rate_analytics(
        self,
        current_user: User,
        vaccine_name: Optional[str] = None,
        age_group: Optional[str] = None,
        days: int = 90
    ) -> Dict[str, Any]:
        """Get vaccination coverage analytics."""
        
        # Placeholder implementation
        return {
            "period_days": days,
            "vaccine_name": vaccine_name,
            "age_group": age_group,
            "coverage_rate": 0.85,
            "total_eligible": 0,
            "vaccinated": 0
        }
    
    async def get_overdue_vaccination_summary(
        self,
        current_user: User,
        vaccine_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get overdue vaccination summary."""
        
        # Placeholder implementation
        return {
            "vaccine_name": vaccine_name,
            "total_overdue": 0,
            "by_age_group": {},
            "by_vaccine": {}
        }
    
    async def report_adverse_event(
        self,
        immunization: ImmunizationRecord,
        adverse_event_details: str,
        severity: str,
        reported_by_id: UUID
    ) -> ImmunizationRecord:
        """Report adverse event."""
        
        # Add adverse event details
        if immunization.adverse_reactions:
            immunization.adverse_reactions += f"\n\n{severity.upper()}: {adverse_event_details}"
        else:
            immunization.adverse_reactions = f"{severity.upper()}: {adverse_event_details}"
        
        immunization.updated_by_id = reported_by_id
        immunization.updated_at = datetime.utcnow()
        
        await self.db.flush()
        await self.db.refresh(immunization)
        
        return immunization
    
    async def get_patient_contraindications(
        self,
        patient: Patient,
        language: str = "tr"
    ) -> Dict[str, List[str]]:
        """Get vaccination contraindications for patient."""
        
        # Check patient's medical conditions and allergies
        contraindications = {"absolute": [], "relative": []}
        
        if patient.allergies:
            contraindications["absolute"].append("Egg allergy - avoid influenza vaccines")
        
        if patient.chronic_conditions:
            if "immunodeficiency" in patient.chronic_conditions.lower():
                contraindications["absolute"].append("Live vaccines contraindicated")
        
        return contraindications
    
    # ==================== Helper Methods ====================
    
    async def can_access_immunization(self, immunization: ImmunizationRecord, user: User) -> bool:
        """Check if user can access immunization."""
        
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        if user.role == UserRole.PARENT:
            return immunization.patient.parent_id == user.id
        
        return False
    
    async def can_edit_immunization(self, immunization: ImmunizationRecord, user: User) -> bool:
        """Check if user can edit immunization."""
        
        # Healthcare professionals can edit
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        return False
    
    async def get_accessible_patient(self, patient_id: UUID, user: User) -> Optional[Patient]:
        """Get patient if user has access."""
        
        stmt = select(Patient).where(Patient.id == patient_id)
        result = await self.db.execute(stmt)
        patient = result.scalar_one_or_none()
        
        if not patient:
            return None
        
        # Check access permissions
        if user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return patient
        
        if user.role == UserRole.PARENT and patient.parent_id == user.id:
            return patient
        
        return None
    
    async def get_patient_immunizations(self, patient_id: UUID) -> List[ImmunizationRecord]:
        """Get all immunizations for patient."""
        
        stmt = select(ImmunizationRecord).where(
            ImmunizationRecord.patient_id == patient_id
        ).order_by(ImmunizationRecord.administered_date)
        
        result = await self.db.execute(stmt)
        return result.scalars().all()
    
    async def check_existing_immunization(
        self,
        patient_id: UUID,
        vaccine_name: str,
        dose_number: Optional[int] = None
    ) -> Optional[ImmunizationRecord]:
        """Check if patient has existing immunization."""
        
        stmt = select(ImmunizationRecord).where(
            and_(
                ImmunizationRecord.patient_id == patient_id,
                ImmunizationRecord.vaccine_name == vaccine_name
            )
        )
        
        if dose_number:
            stmt = stmt.where(ImmunizationRecord.dose_number == dose_number)
        
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    def calculate_completion_percentage(
        self,
        patient: Patient,
        immunizations: List[ImmunizationRecord]
    ) -> float:
        """Calculate vaccination completion percentage."""
        
        # Simplified calculation - would use actual schedule
        age_months = patient.age_in_months
        
        if age_months < 2:
            expected_count = 2  # BCG, Hepatitis B
        elif age_months < 6:
            expected_count = 6
        elif age_months < 12:
            expected_count = 12
        else:
            expected_count = 15
        
        actual_count = len(immunizations)
        return min(100.0, (actual_count / expected_count) * 100)
    
    def get_status_summary(self, up_to_date: int, overdue: int, language: str) -> str:
        """Get status summary text."""
        
        if language == "tr":
            if overdue == 0:
                return "Aşılar güncel"
            elif overdue <= 2:
                return f"{overdue} aşı gecikmiş"
            else:
                return f"Ciddi gecikme - {overdue} aşı"
        else:
            if overdue == 0:
                return "Up to date"
            elif overdue <= 2:
                return f"{overdue} vaccines overdue"
            else:
                return f"Seriously behind - {overdue} vaccines"
    
    async def get_next_due_vaccines(
        self,
        patient: Patient,
        language: str = "tr"
    ) -> List[str]:
        """Get next vaccines due for patient."""
        
        due_soon = await self.get_vaccinations_due_soon(patient, weeks_ahead=8, language=language)
        return [v.vaccine_name for v in due_soon[:3]]  # Next 3 vaccines