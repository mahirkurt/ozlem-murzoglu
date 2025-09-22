"""Milestone tracking API endpoints for developmental assessment."""

from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import date

import structlog
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc

from app.api.deps import (
    get_db,
    get_current_verified_user,
    get_pagination_params,
    PaginationParams,
    get_accessible_patient,
)
from app.models.user import User
from app.models.patient import Patient
from app.models.bright_futures import (
    MilestoneTracking, MilestoneTemplate, BrightFuturesVisit,
    MilestoneStatus
)
from app.schemas.base import PaginatedResponse, SuccessResponse
from app.schemas.bright_futures import (
    MilestoneTrackingResponse, MilestoneTrackingCreate, MilestoneTrackingUpdate,
    MilestoneTemplateResponse, MilestoneSummary
)
from app.services.milestone_service import MilestoneService
from app.utils.exceptions import NotFoundError, ValidationError, AuthorizationError

logger = structlog.get_logger()
router = APIRouter()


# Milestone Templates

@router.get(
    "/templates",
    response_model=List[MilestoneTemplateResponse],
    summary="List milestone templates",
    description="Get list of developmental milestone templates for age",
)
async def list_milestone_templates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    age_months: Optional[int] = Query(None, description="Filter by age appropriateness"),
    domain: Optional[str] = Query(None, description="Filter by developmental domain"),
    language: str = Query("tr", description="Language for localized content")
) -> List[MilestoneTemplateResponse]:
    """List developmental milestone templates."""
    
    service = MilestoneService(db)
    
    templates = await service.get_milestone_templates(
        age_months=age_months,
        domain=domain,
        language=language
    )
    
    return [MilestoneTemplateResponse.model_validate(template) for template in templates]


@router.get(
    "/templates/{template_id}",
    response_model=MilestoneTemplateResponse,
    summary="Get milestone template",
    description="Get detailed milestone template information",
)
async def get_milestone_template(
    template_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> MilestoneTemplateResponse:
    """Get milestone template details."""
    
    service = MilestoneService(db)
    
    template = await service.get_milestone_template_by_id(template_id, language)
    
    if not template:
        raise NotFoundError("Milestone template not found")
    
    return MilestoneTemplateResponse.model_validate(template)


# Milestone Tracking

@router.get(
    "/tracking",
    response_model=PaginatedResponse[MilestoneTrackingResponse],
    summary="List milestone tracking records",
    description="List developmental milestone tracking records with filtering",
)
async def list_milestone_tracking(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    visit_id: Optional[UUID] = Query(None, description="Filter by visit ID"),
    patient_id: Optional[UUID] = Query(None, description="Filter by patient ID"),
    milestone_domain: Optional[str] = Query(None, description="Filter by developmental domain"),
    milestone_status: Optional[MilestoneStatus] = Query(None, description="Filter by milestone status"),
    concerning_only: bool = Query(False, description="Only show concerning milestones")
) -> PaginatedResponse[MilestoneTrackingResponse]:
    """List milestone tracking records with filtering."""
    
    service = MilestoneService(db)
    
    # Build filters based on user permissions
    filters = await service.build_milestone_filters(
        current_user=current_user,
        visit_id=visit_id,
        patient_id=patient_id,
        milestone_domain=milestone_domain,
        milestone_status=milestone_status,
        concerning_only=concerning_only
    )
    
    milestones, total = await service.list_milestones_paginated(
        filters=filters,
        pagination=pagination
    )
    
    return PaginatedResponse(
        items=[MilestoneTrackingResponse.model_validate(m) for m in milestones],
        pagination=pagination.create_meta(total)
    )


@router.post(
    "/tracking",
    response_model=MilestoneTrackingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create milestone tracking record",
    description="Create new developmental milestone tracking record",
)
async def create_milestone_tracking(
    milestone_data: MilestoneTrackingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> MilestoneTrackingResponse:
    """Create a new milestone tracking record."""
    
    service = MilestoneService(db)
    
    # Verify visit access and validate milestone
    await service.validate_milestone_creation(
        visit_id=milestone_data.visit_id,
        milestone_domain=milestone_data.milestone_domain,
        current_user=current_user
    )
    
    # Create the milestone tracking record
    milestone = await service.create_milestone_tracking(
        milestone_data=milestone_data,
        created_by_id=current_user.id
    )
    
    logger.info("Milestone tracking record created",
                milestone_id=milestone.id,
                visit_id=milestone.visit_id,
                domain=milestone.milestone_domain,
                created_by=current_user.id)
    
    return MilestoneTrackingResponse.model_validate(milestone)


@router.get(
    "/tracking/{milestone_id}",
    response_model=MilestoneTrackingResponse,
    summary="Get milestone tracking record",
    description="Get detailed milestone tracking information",
)
async def get_milestone_tracking(
    milestone_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> MilestoneTrackingResponse:
    """Get a specific milestone tracking record."""
    
    service = MilestoneService(db)
    
    milestone = await service.get_milestone_with_access_check(
        milestone_id=milestone_id,
        current_user=current_user
    )
    
    if not milestone:
        raise NotFoundError("Milestone tracking record not found")
    
    return MilestoneTrackingResponse.model_validate(milestone)


@router.put(
    "/tracking/{milestone_id}",
    response_model=MilestoneTrackingResponse,
    summary="Update milestone tracking record",
    description="Update milestone tracking status and notes",
)
async def update_milestone_tracking(
    milestone_id: UUID,
    milestone_update: MilestoneTrackingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> MilestoneTrackingResponse:
    """Update milestone tracking record."""
    
    service = MilestoneService(db)
    
    # Get milestone with access check
    milestone = await service.get_milestone_for_update(
        milestone_id=milestone_id,
        current_user=current_user
    )
    
    if not milestone:
        raise NotFoundError("Milestone tracking record not found")
    
    # Update milestone
    updated_milestone = await service.update_milestone_tracking(
        milestone=milestone,
        milestone_update=milestone_update,
        updated_by_id=current_user.id
    )
    
    logger.info("Milestone tracking record updated",
                milestone_id=milestone.id,
                domain=milestone.milestone_domain,
                status=milestone.milestone_status,
                updated_by=current_user.id)
    
    return MilestoneTrackingResponse.model_validate(updated_milestone)


@router.delete(
    "/tracking/{milestone_id}",
    response_model=SuccessResponse,
    summary="Delete milestone tracking record",
    description="Delete milestone tracking record",
)
async def delete_milestone_tracking(
    milestone_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> SuccessResponse:
    """Delete milestone tracking record."""
    
    service = MilestoneService(db)
    
    # Get milestone with access check
    milestone = await service.get_milestone_for_update(
        milestone_id=milestone_id,
        current_user=current_user
    )
    
    if not milestone:
        raise NotFoundError("Milestone tracking record not found")
    
    # Delete milestone
    await service.delete_milestone_tracking(milestone)
    
    logger.info("Milestone tracking record deleted",
                milestone_id=milestone_id,
                deleted_by=current_user.id)
    
    return SuccessResponse(message="Milestone tracking record deleted successfully")


# Patient Milestone Summary

@router.get(
    "/patients/{patient_id}/summary",
    response_model=MilestoneSummary,
    summary="Get patient milestone summary",
    description="Get comprehensive milestone summary for a patient",
)
async def get_patient_milestone_summary(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> MilestoneSummary:
    """Get comprehensive milestone summary for a patient."""
    
    service = MilestoneService(db)
    
    summary = await service.generate_milestone_summary(patient.id)
    
    return summary


@router.get(
    "/patients/{patient_id}/expected-milestones",
    response_model=List[MilestoneTemplateResponse],
    summary="Get expected milestones for patient",
    description="Get age-appropriate expected milestones for patient",
)
async def get_expected_milestones(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> List[MilestoneTemplateResponse]:
    """Get expected milestones for patient's current age."""
    
    service = MilestoneService(db)
    
    expected_milestones = await service.get_expected_milestones_for_patient(
        patient=patient,
        language=language
    )
    
    return [MilestoneTemplateResponse.model_validate(m) for m in expected_milestones]


# Milestone Assessment Tools

@router.post(
    "/tracking/batch-create",
    response_model=List[MilestoneTrackingResponse],
    summary="Create multiple milestone tracking records",
    description="Create milestone tracking records for a visit using templates",
)
async def batch_create_milestone_tracking(
    visit_id: UUID,
    milestone_template_ids: List[UUID],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> List[MilestoneTrackingResponse]:
    """Create multiple milestone tracking records from templates."""
    
    service = MilestoneService(db)
    
    # Validate visit access and templates
    await service.validate_batch_milestone_creation(
        visit_id=visit_id,
        template_ids=milestone_template_ids,
        current_user=current_user
    )
    
    # Create milestone tracking records
    milestones = await service.batch_create_milestone_tracking(
        visit_id=visit_id,
        template_ids=milestone_template_ids,
        created_by_id=current_user.id
    )
    
    logger.info("Batch milestone tracking records created",
                visit_id=visit_id,
                count=len(milestones),
                created_by=current_user.id)
    
    return [MilestoneTrackingResponse.model_validate(m) for m in milestones]


@router.post(
    "/tracking/{milestone_id}/flag-concern",
    response_model=MilestoneTrackingResponse,
    summary="Flag milestone as concerning",
    description="Flag milestone as concerning and trigger follow-up",
)
async def flag_milestone_concern(
    milestone_id: UUID,
    concern_notes: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> MilestoneTrackingResponse:
    """Flag milestone as concerning."""
    
    service = MilestoneService(db)
    
    # Get milestone with access check
    milestone = await service.get_milestone_for_update(
        milestone_id=milestone_id,
        current_user=current_user
    )
    
    if not milestone:
        raise NotFoundError("Milestone tracking record not found")
    
    # Flag concern
    flagged_milestone = await service.flag_milestone_concern(
        milestone=milestone,
        concern_notes=concern_notes,
        flagged_by_id=current_user.id
    )
    
    logger.info("Milestone flagged as concerning",
                milestone_id=milestone.id,
                domain=milestone.milestone_domain,
                flagged_by=current_user.id)
    
    return MilestoneTrackingResponse.model_validate(flagged_milestone)


# Analytics and Reports

@router.get(
    "/analytics/domain-progress",
    response_model=Dict[str, Any],
    summary="Get milestone domain progress analytics",
    description="Get analytics on milestone progress by developmental domain",
)
async def get_domain_progress_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    patient_id: Optional[UUID] = Query(None, description="Filter by patient"),
    age_from: Optional[int] = Query(None, description="Minimum age in months"),
    age_to: Optional[int] = Query(None, description="Maximum age in months"),
    days: int = Query(90, description="Number of days to analyze", ge=1, le=365)
) -> Dict[str, Any]:
    """Get milestone domain progress analytics."""
    
    service = MilestoneService(db)
    
    analytics = await service.get_domain_progress_analytics(
        current_user=current_user,
        patient_id=patient_id,
        age_from=age_from,
        age_to=age_to,
        days=days
    )
    
    return analytics


@router.get(
    "/analytics/concerning-milestones",
    response_model=Dict[str, Any],
    summary="Get concerning milestones analytics",
    description="Get analytics on concerning or delayed milestones",
)
async def get_concerning_milestones_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    domain: Optional[str] = Query(None, description="Filter by developmental domain"),
    days: int = Query(30, description="Number of days to analyze", ge=1, le=365)
) -> Dict[str, Any]:
    """Get concerning milestones analytics."""
    
    service = MilestoneService(db)
    
    analytics = await service.get_concerning_milestones_analytics(
        current_user=current_user,
        domain=domain,
        days=days
    )
    
    return analytics


# Developmental Domains Reference

@router.get(
    "/domains",
    response_model=List[Dict[str, str]],
    summary="Get developmental domains",
    description="Get list of developmental domains with descriptions",
)
async def get_developmental_domains(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> List[Dict[str, str]]:
    """Get developmental domains reference."""
    
    service = MilestoneService(db)
    
    domains = await service.get_developmental_domains(language)
    
    return domains