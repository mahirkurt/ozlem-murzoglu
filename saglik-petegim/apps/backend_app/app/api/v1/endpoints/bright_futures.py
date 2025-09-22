"""Bright Futures health supervision visit endpoints."""

from typing import List, Optional
from uuid import UUID
from datetime import date, datetime

import structlog
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from sqlalchemy.orm import selectinload

from app.api.deps import (
    get_db,
    get_current_verified_user,
    get_pagination_params,
    PaginationParams,
    get_accessible_patient,
)
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.bright_futures import (
    BrightFuturesVisit, PhysicalExamination, ScreeningAssessment,
    MilestoneTracking, ImmunizationRecord, GuidanceProvided,
    RiskAssessment, VisitType, VisitStatus
)
from app.schemas.base import PaginatedResponse, SuccessResponse
from app.schemas.bright_futures import (
    BrightFuturesVisitResponse, BrightFuturesVisitCreate, BrightFuturesVisitUpdate,
    VisitSummary, PatientBrightFuturesSummary, AgeBasedRecommendations
)
from app.services.bright_futures_service import BrightFuturesService
from app.utils.exceptions import NotFoundError, AuthorizationError, ValidationError

logger = structlog.get_logger()
router = APIRouter()


# Visit Management Endpoints

@router.get(
    "/visits",
    response_model=PaginatedResponse[VisitSummary],
    summary="List Bright Futures visits",
    description="List all Bright Futures visits accessible to current user",
)
async def list_visits(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    patient_id: Optional[UUID] = Query(None, description="Filter by patient ID"),
    visit_type: Optional[VisitType] = Query(None, description="Filter by visit type"),
    visit_status: Optional[VisitStatus] = Query(None, description="Filter by visit status"),
    date_from: Optional[date] = Query(None, description="Filter visits from date"),
    date_to: Optional[date] = Query(None, description="Filter visits to date"),
) -> PaginatedResponse[VisitSummary]:
    """List Bright Futures visits with filtering options."""
    
    service = BrightFuturesService(db)
    
    # Build filters based on user role
    filters = await service.build_visit_filters(
        current_user=current_user,
        patient_id=patient_id,
        visit_type=visit_type,
        visit_status=visit_status,
        date_from=date_from,
        date_to=date_to
    )
    
    # Get paginated results
    visits, total = await service.list_visits_paginated(
        filters=filters,
        pagination=pagination
    )
    
    # Convert to summary format
    visit_summaries = []
    for visit in visits:
        summary = VisitSummary(
            visit_id=visit.id,
            patient_id=visit.patient_id,
            visit_type=visit.visit_type,
            visit_status=visit.visit_status,
            scheduled_date=visit.scheduled_date,
            completed_date=visit.completed_date,
            age_months=visit.age_months,
            alerts_count=len(visit.alerts_flags or {}),
            screenings_completed=len([s for s in visit.screenings if s.screening_status == 'completed']),
            milestones_on_track=len([m for m in visit.milestones if m.milestone_status == 'on_track']),
            milestones_concerning=len([m for m in visit.milestones if m.milestone_status in ['concerning', 'delayed']]),
            immunizations_up_to_date=all(i.is_up_to_date for i in visit.immunizations)
        )
        visit_summaries.append(summary)
    
    return PaginatedResponse(
        items=visit_summaries,
        pagination=pagination.create_meta(total)
    )


@router.post(
    "/visits",
    response_model=BrightFuturesVisitResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Bright Futures visit",
    description="Schedule a new Bright Futures health supervision visit",
)
async def create_visit(
    visit_data: BrightFuturesVisitCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> BrightFuturesVisitResponse:
    """Create a new Bright Futures visit."""
    
    service = BrightFuturesService(db)
    
    # Verify patient access
    patient = await service.get_accessible_patient(visit_data.patient_id, current_user)
    if not patient:
        raise AuthorizationError("Patient not accessible")
    
    # Validate visit type against patient age
    if visit_data.age_months:
        await service.validate_visit_type_for_age(visit_data.visit_type, visit_data.age_months)
    
    # Create the visit
    visit = await service.create_visit(
        visit_data=visit_data,
        created_by_id=current_user.id
    )
    
    logger.info("Bright Futures visit created", 
                visit_id=visit.id, 
                patient_id=visit.patient_id, 
                created_by=current_user.id)
    
    return BrightFuturesVisitResponse.model_validate(visit)


@router.get(
    "/visits/{visit_id}",
    response_model=BrightFuturesVisitResponse,
    summary="Get Bright Futures visit",
    description="Get detailed information about a specific visit",
)
async def get_visit(
    visit_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    include_details: bool = Query(True, description="Include related data (exams, screenings, etc.)")
) -> BrightFuturesVisitResponse:
    """Get a specific Bright Futures visit with optional detailed information."""
    
    service = BrightFuturesService(db)
    
    # Get the visit with authorization check
    visit = await service.get_visit_with_details(visit_id, current_user, include_details)
    
    if not visit:
        raise NotFoundError("Visit not found")
    
    return BrightFuturesVisitResponse.model_validate(visit)


@router.put(
    "/visits/{visit_id}",
    response_model=BrightFuturesVisitResponse,
    summary="Update Bright Futures visit",
    description="Update visit information and status",
)
async def update_visit(
    visit_id: UUID,
    visit_update: BrightFuturesVisitUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> BrightFuturesVisitResponse:
    """Update a Bright Futures visit."""
    
    service = BrightFuturesService(db)
    
    # Get and verify access to the visit
    visit = await service.get_visit_for_update(visit_id, current_user)
    
    if not visit:
        raise NotFoundError("Visit not found")
    
    # Update the visit
    updated_visit = await service.update_visit(
        visit=visit,
        visit_update=visit_update,
        updated_by_id=current_user.id
    )
    
    logger.info("Bright Futures visit updated", 
                visit_id=visit.id, 
                updated_by=current_user.id)
    
    return BrightFuturesVisitResponse.model_validate(updated_visit)


@router.delete(
    "/visits/{visit_id}",
    response_model=SuccessResponse,
    summary="Cancel Bright Futures visit",
    description="Cancel a scheduled visit (soft delete)",
)
async def cancel_visit(
    visit_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    reason: Optional[str] = Query(None, description="Cancellation reason")
) -> SuccessResponse:
    """Cancel a Bright Futures visit."""
    
    service = BrightFuturesService(db)
    
    # Get and verify access to the visit
    visit = await service.get_visit_for_update(visit_id, current_user)
    
    if not visit:
        raise NotFoundError("Visit not found")
    
    # Cancel the visit
    await service.cancel_visit(visit, reason, current_user.id)
    
    logger.info("Bright Futures visit cancelled", 
                visit_id=visit.id, 
                cancelled_by=current_user.id,
                reason=reason)
    
    return SuccessResponse(message="Visit cancelled successfully")


# Patient Summary and Analytics Endpoints

@router.get(
    "/patients/{patient_id}/summary",
    response_model=PatientBrightFuturesSummary,
    summary="Get patient Bright Futures summary",
    description="Get comprehensive Bright Futures summary for a patient",
)
async def get_patient_summary(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> PatientBrightFuturesSummary:
    """Get comprehensive Bright Futures summary for a patient."""
    
    service = BrightFuturesService(db)
    
    summary = await service.generate_patient_summary(patient.id)
    
    return summary


@router.get(
    "/patients/{patient_id}/recommendations",
    response_model=AgeBasedRecommendations,
    summary="Get age-based recommendations",
    description="Get age-appropriate recommendations for next visit and care",
)
async def get_patient_recommendations(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> AgeBasedRecommendations:
    """Get age-based recommendations for a patient."""
    
    service = BrightFuturesService(db)
    
    recommendations = await service.generate_age_based_recommendations(patient)
    
    return recommendations


@router.get(
    "/patients/{patient_id}/visit-schedule",
    response_model=List[dict],
    summary="Get visit schedule",
    description="Get recommended visit schedule based on patient's age",
)
async def get_visit_schedule(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    future_only: bool = Query(True, description="Only show future visits")
) -> List[dict]:
    """Get recommended visit schedule for a patient."""
    
    service = BrightFuturesService(db)
    
    schedule = await service.generate_visit_schedule(patient, future_only)
    
    return schedule


# Quick Actions

@router.post(
    "/visits/{visit_id}/complete",
    response_model=BrightFuturesVisitResponse,
    summary="Mark visit as completed",
    description="Mark a visit as completed with summary information",
)
async def complete_visit(
    visit_id: UUID,
    visit_summary: Optional[str] = Query(None, description="Visit summary"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> BrightFuturesVisitResponse:
    """Mark a visit as completed."""
    
    service = BrightFuturesService(db)
    
    # Get and verify access to the visit
    visit = await service.get_visit_for_update(visit_id, current_user)
    
    if not visit:
        raise NotFoundError("Visit not found")
    
    if visit.visit_status == VisitStatus.COMPLETED:
        raise ValidationError("Visit is already completed")
    
    # Complete the visit
    completed_visit = await service.complete_visit(
        visit=visit,
        summary=visit_summary,
        completed_by_id=current_user.id
    )
    
    logger.info("Bright Futures visit completed", 
                visit_id=visit.id, 
                completed_by=current_user.id)
    
    return BrightFuturesVisitResponse.model_validate(completed_visit)


@router.get(
    "/dashboard/stats",
    response_model=dict,
    summary="Get dashboard statistics",
    description="Get Bright Futures dashboard statistics for current user",
)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    date_range: int = Query(30, description="Date range in days", ge=1, le=365)
) -> dict:
    """Get dashboard statistics for Bright Futures visits."""
    
    service = BrightFuturesService(db)
    
    stats = await service.generate_dashboard_stats(current_user, date_range)
    
    return stats


# Age calculation helper
@router.get(
    "/patients/{patient_id}/age-info",
    response_model=dict,
    summary="Get patient age information",
    description="Get detailed age information including corrected age for premature babies",
)
async def get_patient_age_info(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> dict:
    """Get detailed age information for a patient."""
    
    service = BrightFuturesService(db)
    
    age_info = await service.calculate_patient_age_info(patient)
    
    return age_info
