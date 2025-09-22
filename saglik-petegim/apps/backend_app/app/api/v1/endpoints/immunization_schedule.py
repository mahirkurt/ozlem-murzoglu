"""Immunization schedule API endpoints for Turkish vaccination program."""

from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import date

import structlog
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import (
    get_db,
    get_current_verified_user,
    get_pagination_params,
    PaginationParams,
    get_accessible_patient,
)
from app.models.user import User
from app.models.patient import Patient
from app.models.bright_futures import ImmunizationRecord, ImmunizationSchedule
from app.schemas.base import PaginatedResponse, SuccessResponse
from app.schemas.bright_futures import (
    ImmunizationRecordResponse, ImmunizationRecordCreate, ImmunizationRecordUpdate,
    ImmunizationScheduleResponse, PatientImmunizationStatus, VaccinationPlan
)
from app.services.immunization_service import ImmunizationService
from app.utils.exceptions import NotFoundError, ValidationError

logger = structlog.get_logger()
router = APIRouter()


# Turkish Immunization Schedule

@router.get(
    "/schedule",
    response_model=List[ImmunizationScheduleResponse],
    summary="Get Turkish immunization schedule",
    description="Get Turkish Ministry of Health immunization schedule",
)
async def get_immunization_schedule(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    age_months: Optional[int] = Query(None, description="Filter by age appropriateness"),
    vaccine_name: Optional[str] = Query(None, description="Filter by vaccine name"),
    language: str = Query("tr", description="Language for localized content")
) -> List[ImmunizationScheduleResponse]:
    """Get Turkish immunization schedule."""
    
    service = ImmunizationService(db)
    
    schedule = await service.get_immunization_schedule(
        age_months=age_months,
        vaccine_name=vaccine_name,
        language=language
    )
    
    return [ImmunizationScheduleResponse.model_validate(item) for item in schedule]


@router.get(
    "/schedule/{schedule_id}",
    response_model=ImmunizationScheduleResponse,
    summary="Get immunization schedule item",
    description="Get detailed immunization schedule item",
)
async def get_schedule_item(
    schedule_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> ImmunizationScheduleResponse:
    """Get immunization schedule item details."""
    
    service = ImmunizationService(db)
    
    schedule_item = await service.get_schedule_item_by_id(schedule_id, language)
    
    if not schedule_item:
        raise NotFoundError("Immunization schedule item not found")
    
    return ImmunizationScheduleResponse.model_validate(schedule_item)


# Patient Immunization Records

@router.get(
    "/records",
    response_model=PaginatedResponse[ImmunizationRecordResponse],
    summary="List immunization records",
    description="List patient immunization records with filtering",
)
async def list_immunization_records(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    patient_id: Optional[UUID] = Query(None, description="Filter by patient ID"),
    visit_id: Optional[UUID] = Query(None, description="Filter by visit ID"),
    vaccine_name: Optional[str] = Query(None, description="Filter by vaccine name"),
    up_to_date_only: bool = Query(False, description="Only show up-to-date vaccinations"),
    overdue_only: bool = Query(False, description="Only show overdue vaccinations")
) -> PaginatedResponse[ImmunizationRecordResponse]:
    """List immunization records with filtering."""
    
    service = ImmunizationService(db)
    
    # Build filters based on user permissions
    filters = await service.build_immunization_filters(
        current_user=current_user,
        patient_id=patient_id,
        visit_id=visit_id,
        vaccine_name=vaccine_name,
        up_to_date_only=up_to_date_only,
        overdue_only=overdue_only
    )
    
    records, total = await service.list_immunization_records_paginated(
        filters=filters,
        pagination=pagination
    )
    
    return PaginatedResponse(
        items=[ImmunizationRecordResponse.model_validate(r) for r in records],
        pagination=pagination.create_meta(total)
    )


@router.post(
    "/records",
    response_model=ImmunizationRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create immunization record",
    description="Record administration of a vaccine",
)
async def create_immunization_record(
    immunization_data: ImmunizationRecordCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> ImmunizationRecordResponse:
    """Create a new immunization record."""
    
    service = ImmunizationService(db)
    
    # Verify patient access and validate vaccine
    await service.validate_immunization_creation(
        patient_id=immunization_data.patient_id,
        vaccine_name=immunization_data.vaccine_name,
        current_user=current_user
    )
    
    # Create the immunization record
    immunization = await service.create_immunization_record(
        immunization_data=immunization_data,
        created_by_id=current_user.id
    )
    
    logger.info("Immunization record created",
                immunization_id=immunization.id,
                patient_id=immunization.patient_id,
                vaccine=immunization.vaccine_name,
                created_by=current_user.id)
    
    return ImmunizationRecordResponse.model_validate(immunization)


@router.get(
    "/records/{immunization_id}",
    response_model=ImmunizationRecordResponse,
    summary="Get immunization record",
    description="Get detailed immunization record information",
)
async def get_immunization_record(
    immunization_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> ImmunizationRecordResponse:
    """Get a specific immunization record."""
    
    service = ImmunizationService(db)
    
    immunization = await service.get_immunization_with_access_check(
        immunization_id=immunization_id,
        current_user=current_user
    )
    
    if not immunization:
        raise NotFoundError("Immunization record not found")
    
    return ImmunizationRecordResponse.model_validate(immunization)


@router.put(
    "/records/{immunization_id}",
    response_model=ImmunizationRecordResponse,
    summary="Update immunization record",
    description="Update immunization record details",
)
async def update_immunization_record(
    immunization_id: UUID,
    immunization_update: ImmunizationRecordUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> ImmunizationRecordResponse:
    """Update immunization record."""
    
    service = ImmunizationService(db)
    
    # Get immunization with access check
    immunization = await service.get_immunization_for_update(
        immunization_id=immunization_id,
        current_user=current_user
    )
    
    if not immunization:
        raise NotFoundError("Immunization record not found")
    
    # Update immunization
    updated_immunization = await service.update_immunization_record(
        immunization=immunization,
        immunization_update=immunization_update,
        updated_by_id=current_user.id
    )
    
    logger.info("Immunization record updated",
                immunization_id=immunization.id,
                vaccine=immunization.vaccine_name,
                updated_by=current_user.id)
    
    return ImmunizationRecordResponse.model_validate(updated_immunization)


@router.delete(
    "/records/{immunization_id}",
    response_model=SuccessResponse,
    summary="Delete immunization record",
    description="Delete immunization record",
)
async def delete_immunization_record(
    immunization_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> SuccessResponse:
    """Delete immunization record."""
    
    service = ImmunizationService(db)
    
    # Get immunization with access check
    immunization = await service.get_immunization_for_update(
        immunization_id=immunization_id,
        current_user=current_user
    )
    
    if not immunization:
        raise NotFoundError("Immunization record not found")
    
    # Delete immunization
    await service.delete_immunization_record(immunization)
    
    logger.info("Immunization record deleted",
                immunization_id=immunization_id,
                deleted_by=current_user.id)
    
    return SuccessResponse(message="Immunization record deleted successfully")


# Patient Immunization Status

@router.get(
    "/patients/{patient_id}/status",
    response_model=PatientImmunizationStatus,
    summary="Get patient immunization status",
    description="Get comprehensive immunization status for patient",
)
async def get_patient_immunization_status(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> PatientImmunizationStatus:
    """Get comprehensive immunization status for a patient."""
    
    service = ImmunizationService(db)
    
    status = await service.generate_immunization_status(
        patient=patient,
        language=language
    )
    
    return status


@router.get(
    "/patients/{patient_id}/plan",
    response_model=VaccinationPlan,
    summary="Get vaccination plan for patient",
    description="Get personalized vaccination plan based on age and history",
)
async def get_vaccination_plan(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    months_ahead: int = Query(12, description="Plan months ahead", ge=1, le=60),
    language: str = Query("tr", description="Language for localized content")
) -> VaccinationPlan:
    """Get vaccination plan for patient."""
    
    service = ImmunizationService(db)
    
    plan = await service.generate_vaccination_plan(
        patient=patient,
        months_ahead=months_ahead,
        language=language
    )
    
    return plan


@router.get(
    "/patients/{patient_id}/overdue",
    response_model=List[ImmunizationScheduleResponse],
    summary="Get overdue vaccinations",
    description="Get list of overdue vaccinations for patient",
)
async def get_overdue_vaccinations(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> List[ImmunizationScheduleResponse]:
    """Get overdue vaccinations for patient."""
    
    service = ImmunizationService(db)
    
    overdue_vaccines = await service.get_overdue_vaccinations(
        patient=patient,
        language=language
    )
    
    return [ImmunizationScheduleResponse.model_validate(v) for v in overdue_vaccines]


@router.get(
    "/patients/{patient_id}/due-soon",
    response_model=List[ImmunizationScheduleResponse],
    summary="Get vaccinations due soon",
    description="Get vaccinations due in the next specified period",
)
async def get_vaccinations_due_soon(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    weeks_ahead: int = Query(4, description="Weeks to look ahead", ge=1, le=26),
    language: str = Query("tr", description="Language for localized content")
) -> List[ImmunizationScheduleResponse]:
    """Get vaccinations due soon for patient."""
    
    service = ImmunizationService(db)
    
    due_soon = await service.get_vaccinations_due_soon(
        patient=patient,
        weeks_ahead=weeks_ahead,
        language=language
    )
    
    return [ImmunizationScheduleResponse.model_validate(v) for v in due_soon]


# Batch Operations

@router.post(
    "/records/batch-create",
    response_model=List[ImmunizationRecordResponse],
    summary="Record multiple vaccinations",
    description="Record multiple vaccinations administered during a visit",
)
async def batch_create_immunization_records(
    visit_id: Optional[UUID],
    immunization_data_list: List[ImmunizationRecordCreate],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> List[ImmunizationRecordResponse]:
    """Record multiple vaccinations."""
    
    service = ImmunizationService(db)
    
    # Validate batch creation
    await service.validate_batch_immunization_creation(
        immunization_data_list=immunization_data_list,
        visit_id=visit_id,
        current_user=current_user
    )
    
    # Create immunization records
    immunizations = await service.batch_create_immunization_records(
        immunization_data_list=immunization_data_list,
        visit_id=visit_id,
        created_by_id=current_user.id
    )
    
    logger.info("Batch immunization records created",
                visit_id=visit_id,
                count=len(immunizations),
                created_by=current_user.id)
    
    return [ImmunizationRecordResponse.model_validate(i) for i in immunizations]


# Vaccine Information

@router.get(
    "/vaccines",
    response_model=List[Dict[str, Any]],
    summary="Get vaccine information",
    description="Get list of available vaccines with information",
)
async def get_vaccine_information(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> List[Dict[str, Any]]:
    """Get vaccine information reference."""
    
    service = ImmunizationService(db)
    
    vaccines = await service.get_vaccine_information(language)
    
    return vaccines


@router.get(
    "/vaccines/{vaccine_name}",
    response_model=Dict[str, Any],
    summary="Get specific vaccine information",
    description="Get detailed information about a specific vaccine",
)
async def get_vaccine_details(
    vaccine_name: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> Dict[str, Any]:
    """Get detailed vaccine information."""
    
    service = ImmunizationService(db)
    
    vaccine_info = await service.get_vaccine_details(vaccine_name, language)
    
    if not vaccine_info:
        raise NotFoundError(f"Vaccine '{vaccine_name}' not found")
    
    return vaccine_info


# Analytics and Reports

@router.get(
    "/analytics/coverage-rates",
    response_model=Dict[str, Any],
    summary="Get vaccination coverage rates",
    description="Get vaccination coverage analytics by age group and vaccine",
)
async def get_vaccination_coverage_rates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    vaccine_name: Optional[str] = Query(None, description="Filter by vaccine"),
    age_group: Optional[str] = Query(None, description="Filter by age group"),
    days: int = Query(90, description="Number of days to analyze", ge=1, le=365)
) -> Dict[str, Any]:
    """Get vaccination coverage rate analytics."""
    
    service = ImmunizationService(db)
    
    analytics = await service.get_coverage_rate_analytics(
        current_user=current_user,
        vaccine_name=vaccine_name,
        age_group=age_group,
        days=days
    )
    
    return analytics


@router.get(
    "/analytics/overdue-summary",
    response_model=Dict[str, Any],
    summary="Get overdue vaccination summary",
    description="Get summary of overdue vaccinations by vaccine and age group",
)
async def get_overdue_vaccination_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    vaccine_name: Optional[str] = Query(None, description="Filter by vaccine")
) -> Dict[str, Any]:
    """Get overdue vaccination summary."""
    
    service = ImmunizationService(db)
    
    summary = await service.get_overdue_vaccination_summary(
        current_user=current_user,
        vaccine_name=vaccine_name
    )
    
    return summary


# Adverse Events Reporting

@router.post(
    "/records/{immunization_id}/adverse-event",
    response_model=ImmunizationRecordResponse,
    summary="Report adverse event",
    description="Report adverse event following vaccination",
)
async def report_adverse_event(
    immunization_id: UUID,
    adverse_event_details: str,
    severity: str = Query(..., regex="^(mild|moderate|severe)$"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> ImmunizationRecordResponse:
    """Report adverse event following vaccination."""
    
    service = ImmunizationService(db)
    
    # Get immunization with access check
    immunization = await service.get_immunization_for_update(
        immunization_id=immunization_id,
        current_user=current_user
    )
    
    if not immunization:
        raise NotFoundError("Immunization record not found")
    
    # Report adverse event
    updated_immunization = await service.report_adverse_event(
        immunization=immunization,
        adverse_event_details=adverse_event_details,
        severity=severity,
        reported_by_id=current_user.id
    )
    
    logger.warning("Adverse event reported",
                   immunization_id=immunization.id,
                   vaccine=immunization.vaccine_name,
                   severity=severity,
                   reported_by=current_user.id)
    
    return ImmunizationRecordResponse.model_validate(updated_immunization)


# Contraindications and Precautions

@router.get(
    "/patients/{patient_id}/contraindications",
    response_model=Dict[str, List[str]],
    summary="Get vaccination contraindications",
    description="Get vaccination contraindications and precautions for patient",
)
async def get_patient_contraindications(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> Dict[str, List[str]]:
    """Get vaccination contraindications for patient."""
    
    service = ImmunizationService(db)
    
    contraindications = await service.get_patient_contraindications(
        patient=patient,
        language=language
    )
    
    return contraindications