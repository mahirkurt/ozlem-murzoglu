"""Guidance content API endpoints for anticipatory guidance."""

from typing import List, Optional, Dict, Any
from uuid import UUID

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
from app.models.bright_futures import GuidanceProvided
from app.schemas.base import PaginatedResponse, SuccessResponse
from app.schemas.bright_futures import (
    GuidanceProvidedResponse, GuidanceProvidedCreate, GuidanceProvidedUpdate,
    GuidanceTemplate, AgeBasedGuidanceRecommendations
)
from app.services.guidance_service import GuidanceService
from app.utils.exceptions import NotFoundError, ValidationError

logger = structlog.get_logger()
router = APIRouter()


# Guidance Templates and Content

@router.get(
    "/templates",
    response_model=List[GuidanceTemplate],
    summary="List guidance templates",
    description="Get list of anticipatory guidance templates by category and age",
)
async def list_guidance_templates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    category: Optional[str] = Query(None, description="Filter by guidance category"),
    age_months: Optional[int] = Query(None, description="Filter by age appropriateness"),
    language: str = Query("tr", description="Language for localized content")
) -> List[GuidanceTemplate]:
    """List anticipatory guidance templates."""
    
    service = GuidanceService(db)
    
    templates = await service.get_guidance_templates(
        category=category,
        age_months=age_months,
        language=language
    )
    
    return templates


@router.get(
    "/templates/{template_id}",
    response_model=GuidanceTemplate,
    summary="Get guidance template",
    description="Get detailed guidance template with content",
)
async def get_guidance_template(
    template_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> GuidanceTemplate:
    """Get guidance template details."""
    
    service = GuidanceService(db)
    
    template = await service.get_guidance_template_by_id(template_id, language)
    
    if not template:
        raise NotFoundError("Guidance template not found")
    
    return template


@router.get(
    "/categories",
    response_model=List[Dict[str, str]],
    summary="Get guidance categories",
    description="Get list of available guidance categories",
)
async def get_guidance_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> List[Dict[str, str]]:
    """Get guidance categories reference."""
    
    service = GuidanceService(db)
    
    categories = await service.get_guidance_categories(language)
    
    return categories


# Patient-Specific Guidance

@router.get(
    "/patients/{patient_id}/recommendations",
    response_model=AgeBasedGuidanceRecommendations,
    summary="Get age-based guidance recommendations",
    description="Get age-appropriate guidance recommendations for patient",
)
async def get_patient_guidance_recommendations(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> AgeBasedGuidanceRecommendations:
    """Get age-appropriate guidance recommendations for patient."""
    
    service = GuidanceService(db)
    
    recommendations = await service.generate_age_based_recommendations(
        patient=patient,
        language=language
    )
    
    return recommendations


@router.get(
    "/patients/{patient_id}/safety-priorities",
    response_model=List[GuidanceTemplate],
    summary="Get safety priorities for patient",
    description="Get age-appropriate safety guidance priorities",
)
async def get_patient_safety_priorities(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> List[GuidanceTemplate]:
    """Get safety priorities for patient's age."""
    
    service = GuidanceService(db)
    
    safety_priorities = await service.get_safety_priorities_for_age(
        age_months=patient.age_in_months,
        language=language
    )
    
    return safety_priorities


# Provided Guidance Tracking

@router.get(
    "/provided",
    response_model=PaginatedResponse[GuidanceProvidedResponse],
    summary="List provided guidance records",
    description="List guidance that has been provided to patients",
)
async def list_provided_guidance(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    visit_id: Optional[UUID] = Query(None, description="Filter by visit ID"),
    patient_id: Optional[UUID] = Query(None, description="Filter by patient ID"),
    category: Optional[str] = Query(None, description="Filter by guidance category"),
    topic: Optional[str] = Query(None, description="Filter by guidance topic"),
) -> PaginatedResponse[GuidanceProvidedResponse]:
    """List provided guidance records with filtering."""
    
    service = GuidanceService(db)
    
    # Build filters based on user permissions
    filters = await service.build_guidance_filters(
        current_user=current_user,
        visit_id=visit_id,
        patient_id=patient_id,
        category=category,
        topic=topic
    )
    
    guidance_records, total = await service.list_provided_guidance_paginated(
        filters=filters,
        pagination=pagination
    )
    
    return PaginatedResponse(
        items=[GuidanceProvidedResponse.model_validate(g) for g in guidance_records],
        pagination=pagination.create_meta(total)
    )


@router.post(
    "/provided",
    response_model=GuidanceProvidedResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record provided guidance",
    description="Record guidance that was provided during a visit",
)
async def create_provided_guidance(
    guidance_data: GuidanceProvidedCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> GuidanceProvidedResponse:
    """Record guidance that was provided."""
    
    service = GuidanceService(db)
    
    # Verify visit access
    await service.validate_guidance_creation(
        visit_id=guidance_data.visit_id,
        current_user=current_user
    )
    
    # Create the guidance record
    guidance = await service.create_provided_guidance(
        guidance_data=guidance_data,
        created_by_id=current_user.id
    )
    
    logger.info("Guidance provided record created",
                guidance_id=guidance.id,
                visit_id=guidance.visit_id,
                category=guidance.category,
                topic=guidance.topic,
                created_by=current_user.id)
    
    return GuidanceProvidedResponse.model_validate(guidance)


@router.get(
    "/provided/{guidance_id}",
    response_model=GuidanceProvidedResponse,
    summary="Get provided guidance record",
    description="Get detailed information about provided guidance",
)
async def get_provided_guidance(
    guidance_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> GuidanceProvidedResponse:
    """Get a specific provided guidance record."""
    
    service = GuidanceService(db)
    
    guidance = await service.get_guidance_with_access_check(
        guidance_id=guidance_id,
        current_user=current_user
    )
    
    if not guidance:
        raise NotFoundError("Provided guidance record not found")
    
    return GuidanceProvidedResponse.model_validate(guidance)


@router.put(
    "/provided/{guidance_id}",
    response_model=GuidanceProvidedResponse,
    summary="Update provided guidance record",
    description="Update guidance record with additional notes or materials",
)
async def update_provided_guidance(
    guidance_id: UUID,
    guidance_update: GuidanceProvidedUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> GuidanceProvidedResponse:
    """Update provided guidance record."""
    
    service = GuidanceService(db)
    
    # Get guidance with access check
    guidance = await service.get_guidance_for_update(
        guidance_id=guidance_id,
        current_user=current_user
    )
    
    if not guidance:
        raise NotFoundError("Provided guidance record not found")
    
    # Update guidance
    updated_guidance = await service.update_provided_guidance(
        guidance=guidance,
        guidance_update=guidance_update,
        updated_by_id=current_user.id
    )
    
    logger.info("Provided guidance record updated",
                guidance_id=guidance.id,
                category=guidance.category,
                topic=guidance.topic,
                updated_by=current_user.id)
    
    return GuidanceProvidedResponse.model_validate(updated_guidance)


@router.delete(
    "/provided/{guidance_id}",
    response_model=SuccessResponse,
    summary="Delete provided guidance record",
    description="Delete provided guidance record",
)
async def delete_provided_guidance(
    guidance_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> SuccessResponse:
    """Delete provided guidance record."""
    
    service = GuidanceService(db)
    
    # Get guidance with access check
    guidance = await service.get_guidance_for_update(
        guidance_id=guidance_id,
        current_user=current_user
    )
    
    if not guidance:
        raise NotFoundError("Provided guidance record not found")
    
    # Delete guidance
    await service.delete_provided_guidance(guidance)
    
    logger.info("Provided guidance record deleted",
                guidance_id=guidance_id,
                deleted_by=current_user.id)
    
    return SuccessResponse(message="Provided guidance record deleted successfully")


# Batch Operations

@router.post(
    "/provided/batch-create",
    response_model=List[GuidanceProvidedResponse],
    summary="Record multiple guidance items",
    description="Record multiple guidance items provided during a visit",
)
async def batch_create_provided_guidance(
    visit_id: UUID,
    template_ids: List[UUID],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> List[GuidanceProvidedResponse]:
    """Record multiple guidance items from templates."""
    
    service = GuidanceService(db)
    
    # Validate visit access and templates
    await service.validate_batch_guidance_creation(
        visit_id=visit_id,
        template_ids=template_ids,
        current_user=current_user
    )
    
    # Create guidance records
    guidance_records = await service.batch_create_provided_guidance(
        visit_id=visit_id,
        template_ids=template_ids,
        created_by_id=current_user.id
    )
    
    logger.info("Batch guidance records created",
                visit_id=visit_id,
                count=len(guidance_records),
                created_by=current_user.id)
    
    return [GuidanceProvidedResponse.model_validate(g) for g in guidance_records]


# Content Management (Admin only)

@router.post(
    "/templates",
    response_model=GuidanceTemplate,
    status_code=status.HTTP_201_CREATED,
    summary="Create guidance template",
    description="Create new guidance template (admin only)",
)
async def create_guidance_template(
    template_data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> GuidanceTemplate:
    """Create new guidance template."""
    
    # Check admin permissions
    if current_user.role.value not in ["admin", "doctor"]:
        raise ValidationError("Insufficient permissions to create guidance templates")
    
    service = GuidanceService(db)
    
    template = await service.create_guidance_template(
        template_data=template_data,
        created_by_id=current_user.id
    )
    
    logger.info("Guidance template created",
                template_id=template.get("id"),
                category=template.get("category"),
                created_by=current_user.id)
    
    return template


# Analytics and Reports

@router.get(
    "/analytics/guidance-usage",
    response_model=Dict[str, Any],
    summary="Get guidance usage analytics",
    description="Get analytics on guidance provision by category and topic",
)
async def get_guidance_usage_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    days: int = Query(30, description="Number of days to analyze", ge=1, le=365),
    category: Optional[str] = Query(None, description="Filter by category")
) -> Dict[str, Any]:
    """Get guidance usage analytics."""
    
    service = GuidanceService(db)
    
    analytics = await service.get_guidance_usage_analytics(
        current_user=current_user,
        days=days,
        category=category
    )
    
    return analytics


@router.get(
    "/analytics/parent-understanding",
    response_model=Dict[str, Any],
    summary="Get parent understanding analytics",
    description="Get analytics on parent understanding confirmation rates",
)
async def get_parent_understanding_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    days: int = Query(90, description="Number of days to analyze", ge=1, le=365),
    topic: Optional[str] = Query(None, description="Filter by topic")
) -> Dict[str, Any]:
    """Get parent understanding analytics."""
    
    service = GuidanceService(db)
    
    analytics = await service.get_parent_understanding_analytics(
        current_user=current_user,
        days=days,
        topic=topic
    )
    
    return analytics


# Cultural Adaptation

@router.get(
    "/cultural-adaptations",
    response_model=List[Dict[str, str]],
    summary="Get cultural adaptations",
    description="Get available cultural adaptations for guidance content",
)
async def get_cultural_adaptations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> List[Dict[str, str]]:
    """Get available cultural adaptations."""
    
    service = GuidanceService(db)
    
    adaptations = await service.get_cultural_adaptations(language)
    
    return adaptations


@router.post(
    "/provided/{guidance_id}/confirm-understanding",
    response_model=GuidanceProvidedResponse,
    summary="Confirm parent understanding",
    description="Mark that parent understanding has been confirmed",
)
async def confirm_parent_understanding(
    guidance_id: UUID,
    understanding_notes: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> GuidanceProvidedResponse:
    """Confirm that parent understanding has been verified."""
    
    service = GuidanceService(db)
    
    # Get guidance with access check
    guidance = await service.get_guidance_for_update(
        guidance_id=guidance_id,
        current_user=current_user
    )
    
    if not guidance:
        raise NotFoundError("Provided guidance record not found")
    
    # Confirm understanding
    updated_guidance = await service.confirm_parent_understanding(
        guidance=guidance,
        understanding_notes=understanding_notes,
        confirmed_by_id=current_user.id
    )
    
    logger.info("Parent understanding confirmed",
                guidance_id=guidance.id,
                topic=guidance.topic,
                confirmed_by=current_user.id)
    
    return GuidanceProvidedResponse.model_validate(updated_guidance)