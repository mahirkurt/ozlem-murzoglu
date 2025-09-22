"""Bright Futures Pydantic schemas for request/response models."""

from datetime import date, datetime
from typing import Dict, List, Optional, Any
from uuid import UUID

from pydantic import BaseModel, Field, validator

from app.schemas.base import BaseSchema, BaseResponse
from app.models.bright_futures import (
    VisitType, VisitStatus, ScreeningStatus, RiskLevel, MilestoneStatus
)


# Base schemas
class BrightFuturesBase(BaseSchema):
    """Base schema for Bright Futures models."""
    pass


# Visit schemas
class BrightFuturesVisitBase(BrightFuturesBase):
    """Base schema for Bright Futures visits."""
    visit_type: VisitType = Field(..., description="Type of visit based on age")
    scheduled_date: date = Field(..., description="Scheduled visit date")
    age_months: Optional[int] = Field(None, description="Child's age in months at visit", ge=0)
    corrected_age_months: Optional[int] = Field(None, description="Corrected age for premature babies", ge=0)
    chief_concerns: Optional[str] = Field(None, description="Parent/caregiver concerns", max_length=2000)
    

class BrightFuturesVisitCreate(BrightFuturesVisitBase):
    """Schema for creating a new Bright Futures visit."""
    patient_id: UUID = Field(..., description="Patient ID")


class BrightFuturesVisitUpdate(BrightFuturesBase):
    """Schema for updating a Bright Futures visit."""
    visit_status: Optional[VisitStatus] = Field(None, description="Visit status")
    completed_date: Optional[date] = Field(None, description="Visit completion date")
    visit_summary: Optional[str] = Field(None, description="Visit summary", max_length=5000)
    follow_up_instructions: Optional[str] = Field(None, description="Follow-up instructions", max_length=2000)
    next_visit_due_date: Optional[date] = Field(None, description="Next visit due date")
    provider_notes: Optional[str] = Field(None, description="Provider notes", max_length=5000)
    recommendations: Optional[Dict[str, Any]] = Field(None, description="Structured recommendations")
    alerts_flags: Optional[Dict[str, Any]] = Field(None, description="Alerts or flags")


class BrightFuturesVisitResponse(BrightFuturesVisitBase, BaseResponse):
    """Schema for Bright Futures visit response."""
    patient_id: UUID
    visit_status: VisitStatus
    completed_date: Optional[date]
    visit_summary: Optional[str]
    follow_up_instructions: Optional[str]
    next_visit_due_date: Optional[date]
    provider_notes: Optional[str]
    recommendations: Optional[Dict[str, Any]]
    alerts_flags: Optional[Dict[str, Any]]
    
    # Nested relationships (optional, loaded separately)
    physical_exams: Optional[List["PhysicalExaminationResponse"]] = Field(None)
    screenings: Optional[List["ScreeningAssessmentResponse"]] = Field(None)
    milestones: Optional[List["MilestoneTrackingResponse"]] = Field(None)
    immunizations: Optional[List["ImmunizationRecordResponse"]] = Field(None)
    guidance_provided: Optional[List["GuidanceProvidedResponse"]] = Field(None)
    risk_assessments: Optional[List["RiskAssessmentResponse"]] = Field(None)


# Physical Examination schemas
class PhysicalExaminationBase(BrightFuturesBase):
    """Base schema for physical examinations."""
    weight_kg: Optional[float] = Field(None, description="Weight in kg", ge=0)
    height_cm: Optional[float] = Field(None, description="Height in cm", ge=0)
    head_circumference_cm: Optional[float] = Field(None, description="Head circumference in cm", ge=0)
    bmi: Optional[float] = Field(None, description="BMI", ge=0)
    heart_rate_bpm: Optional[int] = Field(None, description="Heart rate BPM", ge=0)
    respiratory_rate_rpm: Optional[int] = Field(None, description="Respiratory rate RPM", ge=0)
    blood_pressure_systolic: Optional[int] = Field(None, description="Systolic BP", ge=0)
    blood_pressure_diastolic: Optional[int] = Field(None, description="Diastolic BP", ge=0)
    temperature_celsius: Optional[float] = Field(None, description="Temperature in Celsius")


class PhysicalExaminationCreate(PhysicalExaminationBase):
    """Schema for creating physical examination."""
    visit_id: UUID = Field(..., description="Visit ID")
    general_appearance: Optional[str] = Field(None, description="General appearance findings", max_length=1000)
    normal_exam: bool = Field(True, description="Whether exam is normal")
    abnormal_findings: Optional[str] = Field(None, description="Abnormal findings", max_length=2000)


class PhysicalExaminationUpdate(PhysicalExaminationBase):
    """Schema for updating physical examination."""
    weight_percentile: Optional[float] = Field(None, description="Weight percentile", ge=0, le=100)
    height_percentile: Optional[float] = Field(None, description="Height percentile", ge=0, le=100)
    head_circumference_percentile: Optional[float] = Field(None, description="Head circumference percentile", ge=0, le=100)
    bmi_percentile: Optional[float] = Field(None, description="BMI percentile", ge=0, le=100)
    general_appearance: Optional[str] = Field(None, description="General appearance findings", max_length=1000)
    abnormal_findings: Optional[str] = Field(None, description="Abnormal findings", max_length=2000)
    normal_exam: Optional[bool] = Field(None, description="Whether exam is normal")


class PhysicalExaminationResponse(PhysicalExaminationBase, BaseResponse):
    """Schema for physical examination response."""
    visit_id: UUID
    weight_percentile: Optional[float]
    height_percentile: Optional[float]
    head_circumference_percentile: Optional[float]
    bmi_percentile: Optional[float]
    general_appearance: Optional[str]
    skin_findings: Optional[str]
    head_neck_findings: Optional[str]
    eyes_findings: Optional[str]
    ears_findings: Optional[str]
    nose_throat_findings: Optional[str]
    cardiovascular_findings: Optional[str]
    respiratory_findings: Optional[str]
    abdominal_findings: Optional[str]
    genitourinary_findings: Optional[str]
    musculoskeletal_findings: Optional[str]
    neurological_findings: Optional[str]
    normal_exam: bool
    abnormal_findings: Optional[str]


# Screening Assessment schemas
class ScreeningAssessmentBase(BrightFuturesBase):
    """Base schema for screening assessments."""
    screening_tool: str = Field(..., description="Screening tool name", max_length=100)
    screening_date: date = Field(..., description="Date of screening")
    language_administered: str = Field("tr", description="Language used for screening", max_length=10)


class ScreeningAssessmentCreate(ScreeningAssessmentBase):
    """Schema for creating screening assessment."""
    visit_id: UUID = Field(..., description="Visit ID")
    responses: Optional[Dict[str, Any]] = Field(None, description="Individual question responses")


class ScreeningAssessmentUpdate(BrightFuturesBase):
    """Schema for updating screening assessment."""
    screening_status: Optional[ScreeningStatus] = Field(None, description="Screening status")
    raw_score: Optional[int] = Field(None, description="Raw score")
    interpretation: Optional[str] = Field(None, description="Score interpretation", max_length=200)
    risk_level: Optional[RiskLevel] = Field(None, description="Risk level")
    responses: Optional[Dict[str, Any]] = Field(None, description="Individual responses")
    calculated_scores: Optional[Dict[str, Any]] = Field(None, description="Calculated scores")
    follow_up_needed: Optional[bool] = Field(None, description="Follow-up needed")
    follow_up_recommendations: Optional[str] = Field(None, description="Follow-up recommendations", max_length=1000)
    referral_needed: Optional[bool] = Field(None, description="Referral needed")
    referral_type: Optional[str] = Field(None, description="Referral type", max_length=200)


class ScreeningAssessmentResponse(ScreeningAssessmentBase, BaseResponse):
    """Schema for screening assessment response."""
    visit_id: UUID
    screening_status: ScreeningStatus
    raw_score: Optional[int]
    interpretation: Optional[str]
    risk_level: Optional[RiskLevel]
    responses: Optional[Dict[str, Any]]
    calculated_scores: Optional[Dict[str, Any]]
    follow_up_needed: bool
    follow_up_recommendations: Optional[str]
    referral_needed: bool
    referral_type: Optional[str]


# Milestone Tracking schemas
class MilestoneTrackingBase(BrightFuturesBase):
    """Base schema for milestone tracking."""
    milestone_domain: str = Field(..., description="Milestone domain", max_length=100)
    milestone_name: str = Field(..., description="Milestone name", max_length=200)
    expected_age_months: int = Field(..., description="Expected age in months", ge=0)


class MilestoneTrackingCreate(MilestoneTrackingBase):
    """Schema for creating milestone tracking."""
    visit_id: UUID = Field(..., description="Visit ID")
    milestone_status: MilestoneStatus = Field(MilestoneStatus.NOT_ASSESSED, description="Milestone status")


class MilestoneTrackingUpdate(BrightFuturesBase):
    """Schema for updating milestone tracking."""
    milestone_status: Optional[MilestoneStatus] = Field(None, description="Milestone status")
    achieved_date: Optional[date] = Field(None, description="Date achieved")
    notes: Optional[str] = Field(None, description="Assessment notes", max_length=1000)
    concerns_noted: Optional[bool] = Field(None, description="Concerns noted")
    follow_up_needed: Optional[bool] = Field(None, description="Follow-up needed")
    early_intervention_referred: Optional[bool] = Field(None, description="Early intervention referral")


class MilestoneTrackingResponse(MilestoneTrackingBase, BaseResponse):
    """Schema for milestone tracking response."""
    visit_id: UUID
    milestone_status: MilestoneStatus
    achieved_date: Optional[date]
    notes: Optional[str]
    concerns_noted: bool
    follow_up_needed: bool
    early_intervention_referred: bool


# Immunization Record schemas
class ImmunizationRecordBase(BrightFuturesBase):
    """Base schema for immunization records."""
    vaccine_name: str = Field(..., description="Vaccine name", max_length=200)
    administered_date: date = Field(..., description="Administration date")
    dose_number: Optional[int] = Field(None, description="Dose number in series", ge=1)
    route: Optional[str] = Field(None, description="Administration route", max_length=50)
    site: Optional[str] = Field(None, description="Administration site", max_length=100)


class ImmunizationRecordCreate(ImmunizationRecordBase):
    """Schema for creating immunization record."""
    patient_id: UUID = Field(..., description="Patient ID")
    visit_id: Optional[UUID] = Field(None, description="Visit ID if part of visit")
    vaccine_code: Optional[str] = Field(None, description="Vaccine code", max_length=50)
    manufacturer: Optional[str] = Field(None, description="Manufacturer", max_length=200)
    lot_number: Optional[str] = Field(None, description="Lot number", max_length=100)
    expiration_date: Optional[date] = Field(None, description="Expiration date")
    administered_by: Optional[str] = Field(None, description="Administered by", max_length=200)
    clinic_name: Optional[str] = Field(None, description="Clinic name", max_length=200)


class ImmunizationRecordUpdate(BrightFuturesBase):
    """Schema for updating immunization record."""
    is_up_to_date: Optional[bool] = Field(None, description="Up to date status")
    delayed_reason: Optional[str] = Field(None, description="Delay reason", max_length=1000)
    adverse_reactions: Optional[str] = Field(None, description="Adverse reactions", max_length=1000)
    notes: Optional[str] = Field(None, description="Additional notes", max_length=1000)


class ImmunizationRecordResponse(ImmunizationRecordBase, BaseResponse):
    """Schema for immunization record response."""
    patient_id: UUID
    visit_id: Optional[UUID]
    vaccine_code: Optional[str]
    manufacturer: Optional[str]
    lot_number: Optional[str]
    expiration_date: Optional[date]
    administered_by: Optional[str]
    clinic_name: Optional[str]
    is_up_to_date: bool
    delayed_reason: Optional[str]
    adverse_reactions: Optional[str]
    notes: Optional[str]


# Guidance Provided schemas
class GuidanceProvidedBase(BrightFuturesBase):
    """Base schema for guidance provided."""
    category: str = Field(..., description="Guidance category", max_length=100)
    topic: str = Field(..., description="Guidance topic", max_length=200)
    language: str = Field("tr", description="Language", max_length=10)


class GuidanceProvidedCreate(GuidanceProvidedBase):
    """Schema for creating guidance record."""
    visit_id: UUID = Field(..., description="Visit ID")
    guidance_text: Optional[str] = Field(None, description="Guidance text", max_length=5000)
    materials_provided: Optional[List[str]] = Field(None, description="Materials provided")


class GuidanceProvidedUpdate(BrightFuturesBase):
    """Schema for updating guidance record."""
    guidance_text: Optional[str] = Field(None, description="Guidance text", max_length=5000)
    materials_provided: Optional[List[str]] = Field(None, description="Materials provided")
    culturally_adapted: Optional[bool] = Field(None, description="Culturally adapted")
    parent_understanding_confirmed: Optional[bool] = Field(None, description="Parent understanding confirmed")
    follow_up_discussion_needed: Optional[bool] = Field(None, description="Follow-up discussion needed")


class GuidanceProvidedResponse(GuidanceProvidedBase, BaseResponse):
    """Schema for guidance provided response."""
    visit_id: UUID
    guidance_text: Optional[str]
    materials_provided: Optional[List[str]]
    culturally_adapted: bool
    parent_understanding_confirmed: bool
    follow_up_discussion_needed: bool


# Risk Assessment schemas
class RiskAssessmentBase(BrightFuturesBase):
    """Base schema for risk assessments."""
    assessment_type: str = Field(..., description="Assessment type", max_length=100)
    assessment_domain: str = Field(..., description="Assessment domain", max_length=100)
    risk_level: RiskLevel = Field(..., description="Risk level")


class RiskAssessmentCreate(RiskAssessmentBase):
    """Schema for creating risk assessment."""
    visit_id: UUID = Field(..., description="Visit ID")
    risk_factors: Optional[List[str]] = Field(None, description="Risk factors")
    protective_factors: Optional[List[str]] = Field(None, description="Protective factors")


class RiskAssessmentUpdate(BrightFuturesBase):
    """Schema for updating risk assessment."""
    risk_level: Optional[RiskLevel] = Field(None, description="Risk level")
    risk_factors: Optional[List[str]] = Field(None, description="Risk factors")
    protective_factors: Optional[List[str]] = Field(None, description="Protective factors")
    interventions_recommended: Optional[List[str]] = Field(None, description="Recommended interventions")
    resources_provided: Optional[List[str]] = Field(None, description="Resources provided")
    referrals_made: Optional[List[str]] = Field(None, description="Referrals made")
    follow_up_date: Optional[date] = Field(None, description="Follow-up date")
    resolved: Optional[bool] = Field(None, description="Risk resolved")
    notes: Optional[str] = Field(None, description="Notes", max_length=2000)


class RiskAssessmentResponse(RiskAssessmentBase, BaseResponse):
    """Schema for risk assessment response."""
    visit_id: UUID
    risk_factors: Optional[List[str]]
    protective_factors: Optional[List[str]]
    interventions_recommended: Optional[List[str]]
    resources_provided: Optional[List[str]]
    referrals_made: Optional[List[str]]
    follow_up_date: Optional[date]
    resolved: bool
    notes: Optional[str]


# Template schemas
class ScreeningToolResponse(BaseResponse):
    """Schema for screening tool template."""
    tool_name: str
    tool_version: Optional[str]
    description: Optional[str]
    min_age_months: int
    max_age_months: int
    questions: Dict[str, Any]
    scoring_rules: Dict[str, Any]
    interpretation_rules: Dict[str, Any]
    available_languages: List[str]
    is_active: bool


class MilestoneTemplateResponse(BaseResponse):
    """Schema for milestone template."""
    milestone_name: str
    milestone_domain: str
    expected_age_months: int
    age_range_start: int
    age_range_end: int
    description: str
    description_tr: Optional[str]
    assessment_criteria: Optional[str]
    assessment_criteria_tr: Optional[str]
    is_active: bool


class ImmunizationScheduleResponse(BaseResponse):
    """Schema for immunization schedule."""
    vaccine_name: str
    vaccine_name_tr: Optional[str]
    vaccine_code: Optional[str]
    dose_number: int
    recommended_age_months: int
    minimum_age_months: Optional[int]
    maximum_age_months: Optional[int]
    route: str
    site: Optional[str]
    dose_volume: Optional[str]
    is_required: bool
    contraindications: Optional[List[str]]
    precautions: Optional[List[str]]
    notes: Optional[str]
    notes_tr: Optional[str]
    is_active: bool


# Summary and analytics schemas
class VisitSummary(BaseSchema):
    """Visit summary for dashboard."""
    visit_id: UUID
    patient_id: UUID
    visit_type: VisitType
    visit_status: VisitStatus
    scheduled_date: date
    completed_date: Optional[date]
    age_months: Optional[int]
    alerts_count: int = Field(0, description="Number of alerts/flags")
    screenings_completed: int = Field(0, description="Number of completed screenings")
    milestones_on_track: int = Field(0, description="Number of milestones on track")
    milestones_concerning: int = Field(0, description="Number of concerning milestones")
    immunizations_up_to_date: bool = Field(True, description="Immunizations up to date")


class PatientBrightFuturesSummary(BaseSchema):
    """Patient's Bright Futures summary."""
    patient_id: UUID
    total_visits: int = Field(0, description="Total number of visits")
    completed_visits: int = Field(0, description="Number of completed visits")
    missed_visits: int = Field(0, description="Number of missed visits")
    next_visit_due: Optional[date] = Field(None, description="Next visit due date")
    immunizations_up_to_date: bool = Field(True, description="Immunizations up to date")
    active_concerns: int = Field(0, description="Number of active concerns")
    last_visit_date: Optional[date] = Field(None, description="Last visit date")
    developmental_alerts: int = Field(0, description="Number of developmental alerts")


class AgeBasedRecommendations(BaseSchema):
    """Age-based recommendations for a patient."""
    patient_id: UUID
    current_age_months: int
    next_visit_type: Optional[VisitType] = Field(None, description="Next recommended visit type")
    due_screenings: List[str] = Field([], description="Screenings due")
    due_immunizations: List[str] = Field([], description="Immunizations due")
    milestones_to_assess: List[str] = Field([], description="Milestones to assess")
    guidance_topics: List[str] = Field([], description="Guidance topics to discuss")
    priority_level: str = Field("normal", description="Priority level for next visit")


# M-CHAT-R specific schemas
class MCHATRResponse(BaseSchema):
    """M-CHAT-R screening response."""
    total_score: int = Field(..., description="Total M-CHAT-R score", ge=0, le=20)
    critical_items_failed: int = Field(..., description="Number of critical items failed")
    risk_level: str = Field(..., description="Low, Medium, or High risk")
    follow_up_interview_needed: bool = Field(..., description="Follow-up interview needed")
    referral_recommended: bool = Field(..., description="Referral for evaluation recommended")
    individual_responses: Dict[int, bool] = Field(..., description="Individual question responses")


# ASQ-3 specific schemas
class ASQ3DomainScore(BaseSchema):
    """ASQ-3 domain score."""
    domain: str = Field(..., description="Domain name")
    raw_score: int = Field(..., description="Raw domain score")
    cutoff_score: int = Field(..., description="Cutoff score for this domain")
    status: str = Field(..., description="Above cutoff, Close to cutoff, or Below cutoff")


class ASQ3Response(BaseSchema):
    """ASQ-3 screening response."""
    age_interval: str = Field(..., description="Age interval (e.g., 24 month)")
    domain_scores: List[ASQ3DomainScore] = Field(..., description="Domain scores")
    overall_status: str = Field(..., description="Overall screening result")
    referral_recommended: bool = Field(..., description="Referral recommended")
    follow_up_needed: bool = Field(..., description="Follow-up monitoring needed")
    individual_responses: Dict[str, int] = Field(..., description="Individual question responses")


# Missing schema classes for endpoints

class GuidanceTemplate(BaseSchema):
    """Guidance template schema."""
    id: UUID
    category: str = Field(..., description="Guidance category")
    topic: str = Field(..., description="Guidance topic") 
    min_age_months: int = Field(0, description="Minimum age in months")
    max_age_months: int = Field(999, description="Maximum age in months")
    guidance_text: str = Field(..., description="Guidance content")
    key_points: List[str] = Field([], description="Key points")
    materials: List[str] = Field([], description="Educational materials")
    language: str = Field("tr", description="Content language")


class AgeBasedGuidanceRecommendations(BaseSchema):
    """Age-based guidance recommendations."""
    patient_id: UUID
    patient_age_months: int
    priority_guidance: List[GuidanceTemplate] = Field([], description="Priority guidance items")
    safety_priorities: List[str] = Field([], description="Safety priorities for age")
    developmental_guidance: List[str] = Field([], description="Developmental guidance")
    cultural_considerations: List[str] = Field([], description="Cultural considerations")
    next_discussion_topics: List[str] = Field([], description="Topics for next visit")
    generated_at: datetime


class MilestoneSummary(BaseSchema):
    """Milestone summary for patient."""
    patient_id: UUID
    total_milestones_tracked: int = Field(0, description="Total milestones tracked")
    milestones_on_track: int = Field(0, description="Milestones on track")
    milestones_concerning: int = Field(0, description="Concerning milestones")
    early_intervention_referrals: int = Field(0, description="Early intervention referrals")
    domain_breakdown: Dict[str, Dict[str, int]] = Field({}, description="Breakdown by domain")
    recent_assessments: int = Field(0, description="Recent assessments count")
    upcoming_milestones_count: int = Field(0, description="Upcoming milestones count")
    last_assessment_date: Optional[date] = Field(None, description="Last assessment date")
    generated_at: datetime


class PatientImmunizationStatus(BaseSchema):
    """Patient immunization status."""
    patient_id: UUID
    patient_age_months: int
    total_doses_received: int = Field(0, description="Total doses received")
    up_to_date_count: int = Field(0, description="Up to date vaccinations")
    overdue_count: int = Field(0, description="Overdue vaccinations")
    completion_percentage: float = Field(0.0, description="Completion percentage")
    overdue_vaccines: List[str] = Field([], description="Overdue vaccine names")
    next_due_vaccines: List[str] = Field([], description="Next due vaccines")
    last_vaccination_date: Optional[date] = Field(None, description="Last vaccination date")
    status_summary: str = Field("Unknown", description="Status summary text")
    generated_at: datetime


class VaccinationPlan(BaseSchema):
    """Vaccination plan for patient."""
    patient_id: UUID
    plan_start_date: date
    plan_end_date: date
    planned_vaccines: List[Dict[str, Any]] = Field([], description="Planned vaccines")
    overdue_count: int = Field(0, description="Overdue vaccines count")
    upcoming_count: int = Field(0, description="Upcoming vaccines count")
    total_planned: int = Field(0, description="Total planned vaccines")
    generated_at: datetime


class RiskAssessmentTemplate(BaseSchema):
    """Risk assessment template."""
    id: UUID
    assessment_type: str = Field(..., description="Assessment type")
    assessment_domain: str = Field(..., description="Assessment domain")
    name: str = Field(..., description="Template name")
    description: str = Field(..., description="Template description")
    questions: List[str] = Field([], description="Assessment questions")
    risk_indicators: List[str] = Field([], description="Risk indicators")
    interventions: List[str] = Field([], description="Recommended interventions")


class RiskScreeningQuestionnaire(BaseSchema):
    """Risk screening questionnaire."""
    assessment_type: str = Field(..., description="Assessment type")
    title: str = Field(..., description="Questionnaire title")
    description: str = Field(..., description="Questionnaire description")
    questions: List[str] = Field(..., description="Questions")
    scoring_guide: str = Field(..., description="Scoring guide")
    intervention_options: List[str] = Field([], description="Intervention options")
    language: str = Field("tr", description="Language")


class PatientRiskProfile(BaseSchema):
    """Patient risk profile."""
    patient_id: UUID
    total_risk_assessments: int = Field(0, description="Total risk assessments")
    active_risks_count: int = Field(0, description="Active risks count")
    high_risk_count: int = Field(0, description="High risk assessments")
    resolved_risks_count: int = Field(0, description="Resolved risks count")
    risk_by_domain: Dict[str, List[Dict[str, Any]]] = Field({}, description="Risks by domain")
    recent_interventions: List[str] = Field([], description="Recent interventions")
    last_assessment_date: Optional[datetime] = Field(None, description="Last assessment date")
    next_assessment_due: Optional[date] = Field(None, description="Next assessment due")
    overall_risk_level: str = Field("low", description="Overall risk level")
    generated_at: datetime


# Updated summary schemas to match service implementations

class PatientBrightFuturesSummary(BaseSchema):
    """Patient's comprehensive Bright Futures summary."""
    patient_id: UUID
    patient_name: str = Field(..., description="Patient name")
    patient_age_months: int = Field(..., description="Patient age in months")
    total_visits: int = Field(0, description="Total number of visits")
    completed_visits: int = Field(0, description="Number of completed visits")
    upcoming_visits: int = Field(0, description="Number of upcoming visits")
    overdue_visits: int = Field(0, description="Number of overdue visits")
    screening_summary: Dict[str, Any] = Field({}, description="Screening summary")
    milestone_summary: Dict[str, Any] = Field({}, description="Milestone summary")
    immunization_summary: Dict[str, Any] = Field({}, description="Immunization summary")
    recent_visit_date: Optional[date] = Field(None, description="Most recent visit date")
    next_visit_due: Optional[date] = Field(None, description="Next visit due date")
    alerts: List[str] = Field([], description="Active alerts")
    last_updated: datetime


class AgeBasedRecommendations(BaseSchema):
    """Comprehensive age-based recommendations."""
    patient_id: UUID
    patient_age_months: int = Field(..., description="Patient age in months")
    recommended_screenings: List[str] = Field([], description="Recommended screenings")
    recommended_immunizations: List[str] = Field([], description="Recommended immunizations")
    guidance_topics: List[str] = Field([], description="Guidance topics")
    next_visit_type: Optional[str] = Field(None, description="Next visit type")
    next_visit_due_date: Optional[date] = Field(None, description="Next visit due date")
    safety_priorities: List[str] = Field([], description="Safety priorities")
    developmental_expectations: List[str] = Field([], description="Developmental expectations")
    generated_at: datetime


# Update forward references
BrightFuturesVisitResponse.model_rebuild()
