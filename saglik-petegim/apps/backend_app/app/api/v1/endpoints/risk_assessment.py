"""Risk assessment API endpoints for social determinants and health risks."""

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
from app.models.bright_futures import RiskAssessment, RiskLevel
from app.schemas.base import PaginatedResponse, SuccessResponse
from app.schemas.bright_futures import (
    RiskAssessmentResponse, RiskAssessmentCreate, RiskAssessmentUpdate,
    RiskAssessmentTemplate, PatientRiskProfile, RiskScreeningQuestionnaire
)
from app.services.risk_assessment_service import RiskAssessmentService
from app.utils.exceptions import NotFoundError, ValidationError

logger = structlog.get_logger()
router = APIRouter()


# Risk Assessment Templates and Questionnaires

@router.get(
    "/templates",
    response_model=List[RiskAssessmentTemplate],
    summary="List risk assessment templates",
    description="Get list of risk assessment templates by type and domain",
)
async def list_risk_assessment_templates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    assessment_type: Optional[str] = Query(None, description="Filter by assessment type"),
    assessment_domain: Optional[str] = Query(None, description="Filter by assessment domain"),
    language: str = Query("tr", description="Language for localized content")
) -> List[RiskAssessmentTemplate]:
    """List risk assessment templates."""
    
    service = RiskAssessmentService(db)
    
    templates = await service.get_risk_assessment_templates(
        assessment_type=assessment_type,
        assessment_domain=assessment_domain,
        language=language
    )
    
    return templates


@router.get(
    "/templates/{template_id}",
    response_model=RiskAssessmentTemplate,
    summary="Get risk assessment template",
    description="Get detailed risk assessment template",
)
async def get_risk_assessment_template(
    template_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> RiskAssessmentTemplate:
    """Get risk assessment template details."""
    
    service = RiskAssessmentService(db)
    
    template = await service.get_template_by_id(template_id, language)
    
    if not template:
        raise NotFoundError("Risk assessment template not found")
    
    return template


@router.get(
    "/questionnaire/{assessment_type}",
    response_model=RiskScreeningQuestionnaire,
    summary="Get risk screening questionnaire",
    description="Get risk screening questionnaire for specific assessment type",
)
async def get_risk_screening_questionnaire(
    assessment_type: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> RiskScreeningQuestionnaire:
    """Get risk screening questionnaire."""
    
    service = RiskAssessmentService(db)
    
    questionnaire = await service.get_screening_questionnaire(
        assessment_type=assessment_type,
        language=language
    )
    
    if not questionnaire:
        raise NotFoundError(f"Questionnaire for assessment type '{assessment_type}' not found")
    
    return questionnaire


# Risk Assessment Records

@router.get(
    "/assessments",
    response_model=PaginatedResponse[RiskAssessmentResponse],
    summary="List risk assessments",
    description="List risk assessment records with filtering",
)
async def list_risk_assessments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    visit_id: Optional[UUID] = Query(None, description="Filter by visit ID"),
    patient_id: Optional[UUID] = Query(None, description="Filter by patient ID"),
    assessment_type: Optional[str] = Query(None, description="Filter by assessment type"),
    assessment_domain: Optional[str] = Query(None, description="Filter by assessment domain"),
    risk_level: Optional[RiskLevel] = Query(None, description="Filter by risk level"),
    unresolved_only: bool = Query(False, description="Only show unresolved risks")
) -> PaginatedResponse[RiskAssessmentResponse]:
    """List risk assessment records with filtering."""
    
    service = RiskAssessmentService(db)
    
    # Build filters based on user permissions
    filters = await service.build_risk_assessment_filters(
        current_user=current_user,
        visit_id=visit_id,
        patient_id=patient_id,
        assessment_type=assessment_type,
        assessment_domain=assessment_domain,
        risk_level=risk_level,
        unresolved_only=unresolved_only
    )
    
    assessments, total = await service.list_risk_assessments_paginated(
        filters=filters,
        pagination=pagination
    )
    
    return PaginatedResponse(
        items=[RiskAssessmentResponse.model_validate(a) for a in assessments],
        pagination=pagination.create_meta(total)
    )


@router.post(
    "/assessments",
    response_model=RiskAssessmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create risk assessment",
    description="Create new risk assessment record",
)
async def create_risk_assessment(
    assessment_data: RiskAssessmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> RiskAssessmentResponse:
    """Create a new risk assessment record."""
    
    service = RiskAssessmentService(db)
    
    # Verify visit access and validate assessment
    await service.validate_risk_assessment_creation(
        visit_id=assessment_data.visit_id,
        assessment_type=assessment_data.assessment_type,
        current_user=current_user
    )
    
    # Create the risk assessment
    assessment = await service.create_risk_assessment(
        assessment_data=assessment_data,
        created_by_id=current_user.id
    )
    
    logger.info("Risk assessment created",
                assessment_id=assessment.id,
                visit_id=assessment.visit_id,
                assessment_type=assessment.assessment_type,
                risk_level=assessment.risk_level,
                created_by=current_user.id)
    
    return RiskAssessmentResponse.model_validate(assessment)


@router.get(
    "/assessments/{assessment_id}",
    response_model=RiskAssessmentResponse,
    summary="Get risk assessment",
    description="Get detailed risk assessment information",
)
async def get_risk_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> RiskAssessmentResponse:
    """Get a specific risk assessment record."""
    
    service = RiskAssessmentService(db)
    
    assessment = await service.get_assessment_with_access_check(
        assessment_id=assessment_id,
        current_user=current_user
    )
    
    if not assessment:
        raise NotFoundError("Risk assessment record not found")
    
    return RiskAssessmentResponse.model_validate(assessment)


@router.put(
    "/assessments/{assessment_id}",
    response_model=RiskAssessmentResponse,
    summary="Update risk assessment",
    description="Update risk assessment record and interventions",
)
async def update_risk_assessment(
    assessment_id: UUID,
    assessment_update: RiskAssessmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> RiskAssessmentResponse:
    """Update risk assessment record."""
    
    service = RiskAssessmentService(db)
    
    # Get assessment with access check
    assessment = await service.get_assessment_for_update(
        assessment_id=assessment_id,
        current_user=current_user
    )
    
    if not assessment:
        raise NotFoundError("Risk assessment record not found")
    
    # Update assessment
    updated_assessment = await service.update_risk_assessment(
        assessment=assessment,
        assessment_update=assessment_update,
        updated_by_id=current_user.id
    )
    
    logger.info("Risk assessment updated",
                assessment_id=assessment.id,
                assessment_type=assessment.assessment_type,
                risk_level=assessment.risk_level,
                updated_by=current_user.id)
    
    return RiskAssessmentResponse.model_validate(updated_assessment)


@router.delete(
    "/assessments/{assessment_id}",
    response_model=SuccessResponse,
    summary="Delete risk assessment",
    description="Delete risk assessment record",
)
async def delete_risk_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> SuccessResponse:
    """Delete risk assessment record."""
    
    service = RiskAssessmentService(db)
    
    # Get assessment with access check
    assessment = await service.get_assessment_for_update(
        assessment_id=assessment_id,
        current_user=current_user
    )
    
    if not assessment:
        raise NotFoundError("Risk assessment record not found")
    
    # Delete assessment
    await service.delete_risk_assessment(assessment)
    
    logger.info("Risk assessment deleted",
                assessment_id=assessment_id,
                deleted_by=current_user.id)
    
    return SuccessResponse(message="Risk assessment record deleted successfully")


# Patient Risk Profile

@router.get(
    "/patients/{patient_id}/profile",
    response_model=PatientRiskProfile,
    summary="Get patient risk profile",
    description="Get comprehensive risk profile for patient",
)
async def get_patient_risk_profile(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> PatientRiskProfile:
    """Get comprehensive risk profile for a patient."""
    
    service = RiskAssessmentService(db)
    
    profile = await service.generate_patient_risk_profile(patient.id)
    
    return profile


@router.get(
    "/patients/{patient_id}/active-risks",
    response_model=List[RiskAssessmentResponse],
    summary="Get active risks for patient",
    description="Get all active/unresolved risk assessments for patient",
)
async def get_patient_active_risks(
    patient: Patient = Depends(get_accessible_patient),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> List[RiskAssessmentResponse]:
    """Get active risk assessments for patient."""
    
    service = RiskAssessmentService(db)
    
    active_risks = await service.get_active_risks_for_patient(patient.id)
    
    return [RiskAssessmentResponse.model_validate(r) for r in active_risks]


@router.post(
    "/patients/{patient_id}/screen",
    response_model=List[RiskAssessmentResponse],
    summary="Screen patient for risks",
    description="Perform comprehensive risk screening for patient",
)
async def screen_patient_for_risks(
    patient: Patient = Depends(get_accessible_patient),
    visit_id: Optional[UUID] = None,
    screening_responses: Dict[str, Any] = {},
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> List[RiskAssessmentResponse]:
    """Screen patient for various risk factors."""
    
    service = RiskAssessmentService(db)
    
    # Perform comprehensive screening
    assessments = await service.perform_comprehensive_screening(
        patient=patient,
        visit_id=visit_id,
        screening_responses=screening_responses,
        screened_by_id=current_user.id
    )
    
    logger.info("Patient risk screening completed",
                patient_id=patient.id,
                assessments_created=len(assessments),
                screened_by=current_user.id)
    
    return [RiskAssessmentResponse.model_validate(a) for a in assessments]


# Risk Resolution and Follow-up

@router.post(
    "/assessments/{assessment_id}/resolve",
    response_model=RiskAssessmentResponse,
    summary="Resolve risk assessment",
    description="Mark risk assessment as resolved with outcome notes",
)
async def resolve_risk_assessment(
    assessment_id: UUID,
    resolution_notes: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> RiskAssessmentResponse:
    """Resolve a risk assessment."""
    
    service = RiskAssessmentService(db)
    
    # Get assessment with access check
    assessment = await service.get_assessment_for_update(
        assessment_id=assessment_id,
        current_user=current_user
    )
    
    if not assessment:
        raise NotFoundError("Risk assessment record not found")
    
    # Resolve assessment
    resolved_assessment = await service.resolve_risk_assessment(
        assessment=assessment,
        resolution_notes=resolution_notes,
        resolved_by_id=current_user.id
    )
    
    logger.info("Risk assessment resolved",
                assessment_id=assessment.id,
                assessment_type=assessment.assessment_type,
                resolved_by=current_user.id)
    
    return RiskAssessmentResponse.model_validate(resolved_assessment)


@router.post(
    "/assessments/{assessment_id}/interventions",
    response_model=RiskAssessmentResponse,
    summary="Add interventions to risk assessment",
    description="Add interventions and resources to address identified risks",
)
async def add_risk_interventions(
    assessment_id: UUID,
    interventions: List[str],
    resources_provided: Optional[List[str]] = None,
    referrals_made: Optional[List[str]] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> RiskAssessmentResponse:
    """Add interventions to risk assessment."""
    
    service = RiskAssessmentService(db)
    
    # Get assessment with access check
    assessment = await service.get_assessment_for_update(
        assessment_id=assessment_id,
        current_user=current_user
    )
    
    if not assessment:
        raise NotFoundError("Risk assessment record not found")
    
    # Add interventions
    updated_assessment = await service.add_risk_interventions(
        assessment=assessment,
        interventions=interventions,
        resources_provided=resources_provided or [],
        referrals_made=referrals_made or [],
        added_by_id=current_user.id
    )
    
    logger.info("Risk interventions added",
                assessment_id=assessment.id,
                interventions_count=len(interventions),
                added_by=current_user.id)
    
    return RiskAssessmentResponse.model_validate(updated_assessment)


# Batch Operations

@router.post(
    "/assessments/batch-create",
    response_model=List[RiskAssessmentResponse],
    summary="Create multiple risk assessments",
    description="Create multiple risk assessments for a visit",
)
async def batch_create_risk_assessments(
    visit_id: UUID,
    template_ids: List[UUID],
    screening_responses: Optional[Dict[str, Any]] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> List[RiskAssessmentResponse]:
    """Create multiple risk assessments from templates."""
    
    service = RiskAssessmentService(db)
    
    # Validate batch creation
    await service.validate_batch_risk_assessment_creation(
        visit_id=visit_id,
        template_ids=template_ids,
        current_user=current_user
    )
    
    # Create assessments
    assessments = await service.batch_create_risk_assessments(
        visit_id=visit_id,
        template_ids=template_ids,
        screening_responses=screening_responses or {},
        created_by_id=current_user.id
    )
    
    logger.info("Batch risk assessments created",
                visit_id=visit_id,
                count=len(assessments),
                created_by=current_user.id)
    
    return [RiskAssessmentResponse.model_validate(a) for a in assessments]


# Social Determinants of Health

@router.get(
    "/social-determinants/domains",
    response_model=List[Dict[str, str]],
    summary="Get social determinants domains",
    description="Get list of social determinants of health domains",
)
async def get_social_determinants_domains(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> List[Dict[str, str]]:
    """Get social determinants of health domains."""
    
    service = RiskAssessmentService(db)
    
    domains = await service.get_social_determinants_domains(language)
    
    return domains


@router.get(
    "/social-determinants/questionnaire",
    response_model=RiskScreeningQuestionnaire,
    summary="Get social determinants questionnaire",
    description="Get comprehensive social determinants screening questionnaire",
)
async def get_social_determinants_questionnaire(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    language: str = Query("tr", description="Language for localized content")
) -> RiskScreeningQuestionnaire:
    """Get social determinants screening questionnaire."""
    
    service = RiskAssessmentService(db)
    
    questionnaire = await service.get_social_determinants_questionnaire(language)
    
    return questionnaire


# Analytics and Reports

@router.get(
    "/analytics/risk-distribution",
    response_model=Dict[str, Any],
    summary="Get risk level distribution analytics",
    description="Get analytics on risk level distribution by domain and type",
)
async def get_risk_distribution_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    assessment_type: Optional[str] = Query(None, description="Filter by assessment type"),
    assessment_domain: Optional[str] = Query(None, description="Filter by domain"),
    days: int = Query(90, description="Number of days to analyze", ge=1, le=365)
) -> Dict[str, Any]:
    """Get risk distribution analytics."""
    
    service = RiskAssessmentService(db)
    
    analytics = await service.get_risk_distribution_analytics(
        current_user=current_user,
        assessment_type=assessment_type,
        assessment_domain=assessment_domain,
        days=days
    )
    
    return analytics


@router.get(
    "/analytics/intervention-effectiveness",
    response_model=Dict[str, Any],
    summary="Get intervention effectiveness analytics",
    description="Get analytics on effectiveness of risk interventions",
)
async def get_intervention_effectiveness_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    intervention_type: Optional[str] = Query(None, description="Filter by intervention type"),
    days: int = Query(180, description="Number of days to analyze", ge=30, le=365)
) -> Dict[str, Any]:
    """Get intervention effectiveness analytics."""
    
    service = RiskAssessmentService(db)
    
    analytics = await service.get_intervention_effectiveness_analytics(
        current_user=current_user,
        intervention_type=intervention_type,
        days=days
    )
    
    return analytics


@router.get(
    "/analytics/high-risk-patients",
    response_model=Dict[str, Any],
    summary="Get high-risk patients summary",
    description="Get summary of patients with high-risk assessments",
)
async def get_high_risk_patients_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    assessment_domain: Optional[str] = Query(None, description="Filter by domain"),
    unresolved_only: bool = Query(True, description="Only unresolved risks")
) -> Dict[str, Any]:
    """Get high-risk patients summary."""
    
    service = RiskAssessmentService(db)
    
    summary = await service.get_high_risk_patients_summary(
        current_user=current_user,
        assessment_domain=assessment_domain,
        unresolved_only=unresolved_only
    )
    
    return summary


# Resource Management

@router.get(
    "/resources",
    response_model=List[Dict[str, Any]],
    summary="Get risk intervention resources",
    description="Get list of available intervention resources and referrals",
)
async def get_intervention_resources(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    resource_type: Optional[str] = Query(None, description="Filter by resource type"),
    assessment_domain: Optional[str] = Query(None, description="Filter by domain"),
    language: str = Query("tr", description="Language for localized content")
) -> List[Dict[str, Any]]:
    """Get intervention resources."""
    
    service = RiskAssessmentService(db)
    
    resources = await service.get_intervention_resources(
        resource_type=resource_type,
        assessment_domain=assessment_domain,
        language=language
    )
    
    return resources