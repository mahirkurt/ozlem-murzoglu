"""Screening tools API endpoints (M-CHAT-R, ASQ-3, etc.)."""

from typing import List, Optional, Dict, Any
from uuid import UUID

import structlog
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.api.deps import (
    get_db,
    get_current_verified_user,
    get_pagination_params,
    PaginationParams,
)
from app.models.user import User
from app.models.bright_futures import (
    BrightFuturesVisit, ScreeningAssessment, ScreeningTool
)
from app.schemas.base import PaginatedResponse, SuccessResponse
from app.schemas.bright_futures import (
    ScreeningAssessmentResponse, ScreeningAssessmentCreate, ScreeningAssessmentUpdate,
    ScreeningToolResponse, MCHATRResponse, ASQ3Response
)
from app.services.screening_service import ScreeningService
from app.utils.exceptions import NotFoundError, ValidationError, AuthorizationError

logger = structlog.get_logger()
router = APIRouter()


# Screening Tool Templates

@router.get(
    "/tools",
    response_model=List[ScreeningToolResponse],
    summary="List available screening tools",
    description="Get list of all available screening tools with their configurations",
)
async def list_screening_tools(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    active_only: bool = Query(True, description="Only return active tools"),
    age_months: Optional[int] = Query(None, description="Filter by age appropriateness")
) -> List[ScreeningToolResponse]:
    """List available screening tools."""
    
    service = ScreeningService(db)
    
    tools = await service.get_available_screening_tools(
        active_only=active_only,
        age_months=age_months
    )
    
    return [ScreeningToolResponse.model_validate(tool) for tool in tools]


@router.get(
    "/tools/{tool_name}",
    response_model=ScreeningToolResponse,
    summary="Get screening tool details",
    description="Get detailed configuration for a specific screening tool",
)
async def get_screening_tool(
    tool_name: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> ScreeningToolResponse:
    """Get screening tool configuration."""
    
    service = ScreeningService(db)
    
    tool = await service.get_screening_tool_by_name(tool_name, language)
    
    if not tool:
        raise NotFoundError(f"Screening tool '{tool_name}' not found")
    
    return ScreeningToolResponse.model_validate(tool)


# Screening Assessments

@router.get(
    "/assessments",
    response_model=PaginatedResponse[ScreeningAssessmentResponse],
    summary="List screening assessments",
    description="List screening assessments with filtering options",
)
async def list_screening_assessments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    visit_id: Optional[UUID] = Query(None, description="Filter by visit ID"),
    screening_tool: Optional[str] = Query(None, description="Filter by screening tool"),
    screening_status: Optional[str] = Query(None, description="Filter by status"),
    patient_id: Optional[UUID] = Query(None, description="Filter by patient ID")
) -> PaginatedResponse[ScreeningAssessmentResponse]:
    """List screening assessments with filtering."""
    
    service = ScreeningService(db)
    
    # Build filters based on user permissions
    filters = await service.build_assessment_filters(
        current_user=current_user,
        visit_id=visit_id,
        screening_tool=screening_tool,
        screening_status=screening_status,
        patient_id=patient_id
    )
    
    assessments, total = await service.list_assessments_paginated(
        filters=filters,
        pagination=pagination
    )
    
    return PaginatedResponse(
        items=[ScreeningAssessmentResponse.model_validate(a) for a in assessments],
        pagination=pagination.create_meta(total)
    )


@router.post(
    "/assessments",
    response_model=ScreeningAssessmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create screening assessment",
    description="Start a new screening assessment for a visit",
)
async def create_screening_assessment(
    assessment_data: ScreeningAssessmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> ScreeningAssessmentResponse:
    """Create a new screening assessment."""
    
    service = ScreeningService(db)
    
    # Verify visit access and validate screening tool
    await service.validate_assessment_creation(
        visit_id=assessment_data.visit_id,
        screening_tool=assessment_data.screening_tool,
        current_user=current_user
    )
    
    # Create the assessment
    assessment = await service.create_assessment(
        assessment_data=assessment_data,
        created_by_id=current_user.id
    )
    
    logger.info("Screening assessment created",
                assessment_id=assessment.id,
                visit_id=assessment.visit_id,
                screening_tool=assessment.screening_tool,
                created_by=current_user.id)
    
    return ScreeningAssessmentResponse.model_validate(assessment)


@router.get(
    "/assessments/{assessment_id}",
    response_model=ScreeningAssessmentResponse,
    summary="Get screening assessment",
    description="Get detailed screening assessment results",
)
async def get_screening_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> ScreeningAssessmentResponse:
    """Get a specific screening assessment."""
    
    service = ScreeningService(db)
    
    assessment = await service.get_assessment_with_access_check(
        assessment_id=assessment_id,
        current_user=current_user
    )
    
    if not assessment:
        raise NotFoundError("Screening assessment not found")
    
    return ScreeningAssessmentResponse.model_validate(assessment)


@router.put(
    "/assessments/{assessment_id}",
    response_model=ScreeningAssessmentResponse,
    summary="Update screening assessment",
    description="Update screening assessment responses and calculate scores",
)
async def update_screening_assessment(
    assessment_id: UUID,
    assessment_update: ScreeningAssessmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> ScreeningAssessmentResponse:
    """Update screening assessment."""
    
    service = ScreeningService(db)
    
    # Get assessment with access check
    assessment = await service.get_assessment_for_update(
        assessment_id=assessment_id,
        current_user=current_user
    )
    
    if not assessment:
        raise NotFoundError("Screening assessment not found")
    
    # Update and calculate scores
    updated_assessment = await service.update_assessment(
        assessment=assessment,
        assessment_update=assessment_update,
        updated_by_id=current_user.id
    )
    
    logger.info("Screening assessment updated",
                assessment_id=assessment.id,
                screening_tool=assessment.screening_tool,
                updated_by=current_user.id)
    
    return ScreeningAssessmentResponse.model_validate(updated_assessment)


@router.post(
    "/assessments/{assessment_id}/calculate",
    response_model=ScreeningAssessmentResponse,
    summary="Calculate assessment scores",
    description="Calculate scores and interpret results for completed assessment",
)
async def calculate_assessment_scores(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> ScreeningAssessmentResponse:
    """Calculate scores for a screening assessment."""
    
    service = ScreeningService(db)
    
    # Get assessment with access check
    assessment = await service.get_assessment_for_update(
        assessment_id=assessment_id,
        current_user=current_user
    )
    
    if not assessment:
        raise NotFoundError("Screening assessment not found")
    
    # Calculate scores and interpretation
    calculated_assessment = await service.calculate_assessment_scores(
        assessment=assessment,
        calculated_by_id=current_user.id
    )
    
    logger.info("Assessment scores calculated",
                assessment_id=assessment.id,
                screening_tool=assessment.screening_tool,
                calculated_by=current_user.id)
    
    return ScreeningAssessmentResponse.model_validate(calculated_assessment)


# M-CHAT-R Specific Endpoints

@router.get(
    "/mchat-r/questionnaire",
    response_model=Dict[str, Any],
    summary="Get M-CHAT-R questionnaire",
    description="Get M-CHAT-R questionnaire with Turkish translations",
)
async def get_mchat_questionnaire(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for questionnaire")
) -> Dict[str, Any]:
    """Get M-CHAT-R questionnaire."""
    
    service = ScreeningService(db)
    
    questionnaire = await service.get_mchat_questionnaire(language)
    
    return questionnaire


@router.post(
    "/mchat-r/score",
    response_model=MCHATRResponse,
    summary="Score M-CHAT-R assessment",
    description="Score M-CHAT-R responses and provide interpretation",
)
async def score_mchat_assessment(
    responses: Dict[int, bool],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> MCHATRResponse:
    """Score M-CHAT-R assessment."""
    
    service = ScreeningService(db)
    
    if len(responses) != 20:
        raise ValidationError("M-CHAT-R requires exactly 20 responses")
    
    scoring_result = await service.score_mchat_responses(responses)
    
    return MCHATRResponse(**scoring_result)


# ASQ-3 Specific Endpoints

@router.get(
    "/asq3/questionnaire/{age_months}",
    response_model=Dict[str, Any],
    summary="Get ASQ-3 questionnaire for age",
    description="Get age-appropriate ASQ-3 questionnaire",
)
async def get_asq3_questionnaire(
    age_months: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for questionnaire")
) -> Dict[str, Any]:
    """Get ASQ-3 questionnaire for specific age."""
    
    service = ScreeningService(db)
    
    if age_months < 2 or age_months > 60:
        raise ValidationError("ASQ-3 is appropriate for ages 2-60 months")
    
    questionnaire = await service.get_asq3_questionnaire(age_months, language)
    
    return questionnaire


@router.post(
    "/asq3/score",
    response_model=ASQ3Response,
    summary="Score ASQ-3 assessment",
    description="Score ASQ-3 responses and provide domain-specific interpretation",
)
async def score_asq3_assessment(
    age_months: int,
    responses: Dict[str, int],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> ASQ3Response:
    """Score ASQ-3 assessment."""
    
    service = ScreeningService(db)
    
    if age_months < 2 or age_months > 60:
        raise ValidationError("ASQ-3 is appropriate for ages 2-60 months")
    
    scoring_result = await service.score_asq3_responses(age_months, responses)
    
    return ASQ3Response(**scoring_result)


# Batch Operations

@router.post(
    "/assessments/batch-create",
    response_model=List[ScreeningAssessmentResponse],
    summary="Create multiple screening assessments",
    description="Create multiple screening assessments for a visit",
)
async def batch_create_assessments(
    visit_id: UUID,
    screening_tools: List[str],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> List[ScreeningAssessmentResponse]:
    """Create multiple screening assessments for a visit."""
    
    service = ScreeningService(db)
    
    # Validate visit access and screening tools
    await service.validate_batch_assessment_creation(
        visit_id=visit_id,
        screening_tools=screening_tools,
        current_user=current_user
    )
    
    # Create assessments
    assessments = await service.batch_create_assessments(
        visit_id=visit_id,
        screening_tools=screening_tools,
        created_by_id=current_user.id
    )
    
    logger.info("Batch screening assessments created",
                visit_id=visit_id,
                count=len(assessments),
                screening_tools=screening_tools,
                created_by=current_user.id)
    
    return [ScreeningAssessmentResponse.model_validate(a) for a in assessments]


# Analytics and Reports

@router.get(
    "/analytics/screening-completion-rate",
    response_model=Dict[str, Any],
    summary="Get screening completion rates",
    description="Get analytics on screening completion rates by tool and age group",
)
async def get_screening_completion_rates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    days: int = Query(30, description="Number of days to analyze", ge=1, le=365)
) -> Dict[str, Any]:
    """Get screening completion rate analytics."""
    
    service = ScreeningService(db)
    
    analytics = await service.get_screening_completion_analytics(
        current_user=current_user,
        days=days
    )
    
    return analytics


@router.get(
    "/analytics/risk-distribution",
    response_model=Dict[str, Any],
    summary="Get risk level distribution",
    description="Get distribution of risk levels across screening assessments",
)
async def get_risk_distribution(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    screening_tool: Optional[str] = Query(None, description="Filter by screening tool"),
    days: int = Query(90, description="Number of days to analyze", ge=1, le=365)
) -> Dict[str, Any]:
    """Get risk level distribution analytics."""
    
    service = ScreeningService(db)
    
    analytics = await service.get_risk_distribution_analytics(
        current_user=current_user,
        screening_tool=screening_tool,
        days=days
    )
    
    return analytics
