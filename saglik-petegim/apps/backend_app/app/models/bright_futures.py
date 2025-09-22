"""Bright Futures pediatric health supervision models."""

import enum
from datetime import date, datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import (
    Boolean, Column, Date, DateTime, Enum, ForeignKey, 
    Integer, JSON, Numeric, String, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel, AuditableMixin

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.user import User


class VisitType(enum.Enum):
    """Bright Futures visit types based on age."""
    
    PRENATAL = "prenatal"
    NEWBORN = "newborn"  # 3-5 days
    FIRST_WEEK = "first_week"  # 3-5 days
    ONE_MONTH = "one_month"
    TWO_MONTH = "two_month"
    FOUR_MONTH = "four_month"
    SIX_MONTH = "six_month"
    NINE_MONTH = "nine_month"
    TWELVE_MONTH = "twelve_month"
    FIFTEEN_MONTH = "fifteen_month"
    EIGHTEEN_MONTH = "eighteen_month"
    TWO_YEAR = "two_year"
    TWO_HALF_YEAR = "two_half_year"
    THREE_YEAR = "three_year"
    FOUR_YEAR = "four_year"
    FIVE_YEAR = "five_year"
    SIX_YEAR = "six_year"
    SEVEN_YEAR = "seven_year"
    EIGHT_YEAR = "eight_year"
    NINE_YEAR = "nine_year"
    TEN_YEAR = "ten_year"
    ELEVEN_YEAR = "eleven_year"
    TWELVE_YEAR = "twelve_year"
    THIRTEEN_YEAR = "thirteen_year"
    FOURTEEN_YEAR = "fourteen_year"
    FIFTEEN_YEAR = "fifteen_year"
    SIXTEEN_YEAR = "sixteen_year"
    SEVENTEEN_YEAR = "seventeen_year"
    EIGHTEEN_YEAR = "eighteen_year"
    NINETEEN_YEAR = "nineteen_year"
    TWENTY_YEAR = "twenty_year"
    TWENTYONE_YEAR = "twentyone_year"


class VisitStatus(enum.Enum):
    """Visit completion status."""
    
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class ScreeningStatus(enum.Enum):
    """Screening tool completion status."""
    
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REVIEWED = "reviewed"
    FLAG_RAISED = "flag_raised"


class RiskLevel(enum.Enum):
    """Risk assessment levels."""
    
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"


class MilestoneStatus(enum.Enum):
    """Developmental milestone status."""
    
    NOT_ASSESSED = "not_assessed"
    ON_TRACK = "on_track"
    CONCERNING = "concerning"
    DELAYED = "delayed"
    REFER_FOR_EVALUATION = "refer_for_evaluation"


class BrightFuturesVisit(BaseModel, AuditableMixin):
    """Bright Futures health supervision visit record."""
    
    __tablename__ = "bright_futures_visits"
    
    # Basic visit information
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False, index=True)
    visit_type = Column(Enum(VisitType), nullable=False)
    visit_status = Column(Enum(VisitStatus), default=VisitStatus.SCHEDULED, nullable=False)
    scheduled_date = Column(Date, nullable=False)
    completed_date = Column(Date, nullable=True)
    
    # Age at visit
    age_months = Column(Integer, nullable=True)  # Age in months at time of visit
    corrected_age_months = Column(Integer, nullable=True)  # For premature babies
    
    # Visit summary
    chief_concerns = Column(Text, nullable=True)
    visit_summary = Column(Text, nullable=True)
    follow_up_instructions = Column(Text, nullable=True)
    next_visit_due_date = Column(Date, nullable=True)
    
    # Provider notes
    provider_notes = Column(Text, nullable=True)
    recommendations = Column(JSON, nullable=True)  # Structured recommendations
    alerts_flags = Column(JSON, nullable=True)  # Any alerts or flags raised
    
    # Relationships
    patient = relationship("Patient", back_populates="bright_futures_visits")
    physical_exams = relationship("PhysicalExamination", back_populates="visit", cascade="all, delete-orphan")
    screenings = relationship("ScreeningAssessment", back_populates="visit", cascade="all, delete-orphan")
    milestones = relationship("MilestoneTracking", back_populates="visit", cascade="all, delete-orphan")
    immunizations = relationship("ImmunizationRecord", back_populates="visit", cascade="all, delete-orphan")
    guidance_provided = relationship("GuidanceProvided", back_populates="visit", cascade="all, delete-orphan")
    risk_assessments = relationship("RiskAssessment", back_populates="visit", cascade="all, delete-orphan")


class PhysicalExamination(BaseModel, AuditableMixin):
    """Physical examination findings for Bright Futures visit."""
    
    __tablename__ = "physical_examinations"
    
    visit_id = Column(UUID(as_uuid=True), ForeignKey("bright_futures_visits.id"), nullable=False)
    
    # Measurements
    weight_kg = Column(Numeric(5, 2), nullable=True)
    height_cm = Column(Numeric(5, 1), nullable=True)
    head_circumference_cm = Column(Numeric(4, 1), nullable=True)
    bmi = Column(Numeric(4, 1), nullable=True)
    
    # Vital signs
    heart_rate_bpm = Column(Integer, nullable=True)
    respiratory_rate_rpm = Column(Integer, nullable=True)
    blood_pressure_systolic = Column(Integer, nullable=True)
    blood_pressure_diastolic = Column(Integer, nullable=True)
    temperature_celsius = Column(Numeric(3, 1), nullable=True)
    
    # Growth percentiles
    weight_percentile = Column(Numeric(5, 2), nullable=True)
    height_percentile = Column(Numeric(5, 2), nullable=True)
    head_circumference_percentile = Column(Numeric(5, 2), nullable=True)
    bmi_percentile = Column(Numeric(5, 2), nullable=True)
    
    # Physical exam findings
    general_appearance = Column(Text, nullable=True)
    skin_findings = Column(Text, nullable=True)
    head_neck_findings = Column(Text, nullable=True)
    eyes_findings = Column(Text, nullable=True)
    ears_findings = Column(Text, nullable=True)
    nose_throat_findings = Column(Text, nullable=True)
    cardiovascular_findings = Column(Text, nullable=True)
    respiratory_findings = Column(Text, nullable=True)
    abdominal_findings = Column(Text, nullable=True)
    genitourinary_findings = Column(Text, nullable=True)
    musculoskeletal_findings = Column(Text, nullable=True)
    neurological_findings = Column(Text, nullable=True)
    
    # Overall assessment
    normal_exam = Column(Boolean, default=True)
    abnormal_findings = Column(Text, nullable=True)
    
    # Relationship
    visit = relationship("BrightFuturesVisit", back_populates="physical_exams")


class ScreeningAssessment(BaseModel, AuditableMixin):
    """Screening tool assessments (M-CHAT-R, ASQ-3, etc.)."""
    
    __tablename__ = "screening_assessments"
    
    visit_id = Column(UUID(as_uuid=True), ForeignKey("bright_futures_visits.id"), nullable=False)
    
    # Screening tool information
    screening_tool = Column(String(100), nullable=False)  # M-CHAT-R, ASQ-3, etc.
    screening_date = Column(Date, nullable=False)
    screening_status = Column(Enum(ScreeningStatus), default=ScreeningStatus.NOT_STARTED)
    
    # Results
    raw_score = Column(Integer, nullable=True)
    interpretation = Column(String(200), nullable=True)  # Normal, Concerning, etc.
    risk_level = Column(Enum(RiskLevel), nullable=True)
    
    # Detailed responses (JSON format)
    responses = Column(JSON, nullable=True)  # Individual question responses
    calculated_scores = Column(JSON, nullable=True)  # Domain scores, percentiles
    
    # Follow-up
    follow_up_needed = Column(Boolean, default=False)
    follow_up_recommendations = Column(Text, nullable=True)
    referral_needed = Column(Boolean, default=False)
    referral_type = Column(String(200), nullable=True)
    
    # Turkish language support
    language_administered = Column(String(10), default="tr", nullable=False)
    
    # Relationship
    visit = relationship("BrightFuturesVisit", back_populates="screenings")


class MilestoneTracking(BaseModel, AuditableMixin):
    """Developmental milestone tracking."""
    
    __tablename__ = "milestone_tracking"
    
    visit_id = Column(UUID(as_uuid=True), ForeignKey("bright_futures_visits.id"), nullable=False)
    
    # Milestone information
    milestone_domain = Column(String(100), nullable=False)  # Motor, Language, Social, etc.
    milestone_name = Column(String(200), nullable=False)
    expected_age_months = Column(Integer, nullable=False)
    
    # Assessment
    milestone_status = Column(Enum(MilestoneStatus), default=MilestoneStatus.NOT_ASSESSED)
    achieved_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Follow-up
    concerns_noted = Column(Boolean, default=False)
    follow_up_needed = Column(Boolean, default=False)
    early_intervention_referred = Column(Boolean, default=False)
    
    # Relationship
    visit = relationship("BrightFuturesVisit", back_populates="milestones")


class ImmunizationRecord(BaseModel, AuditableMixin):
    """Immunization records and schedule tracking."""
    
    __tablename__ = "immunization_records"
    
    visit_id = Column(UUID(as_uuid=True), ForeignKey("bright_futures_visits.id"), nullable=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False, index=True)
    
    # Vaccine information
    vaccine_name = Column(String(200), nullable=False)
    vaccine_code = Column(String(50), nullable=True)  # CVX code or similar
    manufacturer = Column(String(200), nullable=True)
    lot_number = Column(String(100), nullable=True)
    expiration_date = Column(Date, nullable=True)
    
    # Administration details
    administered_date = Column(Date, nullable=False)
    dose_number = Column(Integer, nullable=True)  # Which dose in series
    route = Column(String(50), nullable=True)  # IM, oral, etc.
    site = Column(String(100), nullable=True)  # Left arm, right thigh, etc.
    
    # Provider information
    administered_by = Column(String(200), nullable=True)
    clinic_name = Column(String(200), nullable=True)
    
    # Status and notes
    is_up_to_date = Column(Boolean, default=True)
    delayed_reason = Column(Text, nullable=True)
    adverse_reactions = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    visit = relationship("BrightFuturesVisit", back_populates="immunizations")
    patient = relationship("Patient", back_populates="immunization_records")


class GuidanceProvided(BaseModel, AuditableMixin):
    """Guidance and anticipatory guidance provided during visit."""
    
    __tablename__ = "guidance_provided"
    
    visit_id = Column(UUID(as_uuid=True), ForeignKey("bright_futures_visits.id"), nullable=False)
    
    # Guidance categories
    category = Column(String(100), nullable=False)  # Safety, Nutrition, Development, etc.
    topic = Column(String(200), nullable=False)  # Car seats, Sleep safety, etc.
    
    # Content
    guidance_text = Column(Text, nullable=True)
    materials_provided = Column(JSON, nullable=True)  # List of handouts, resources
    
    # Language and localization
    language = Column(String(10), default="tr", nullable=False)
    culturally_adapted = Column(Boolean, default=False)
    
    # Follow-up
    parent_understanding_confirmed = Column(Boolean, default=False)
    follow_up_discussion_needed = Column(Boolean, default=False)
    
    # Relationship
    visit = relationship("BrightFuturesVisit", back_populates="guidance_provided")


class RiskAssessment(BaseModel, AuditableMixin):
    """Risk assessment and social determinants screening."""
    
    __tablename__ = "risk_assessments"
    
    visit_id = Column(UUID(as_uuid=True), ForeignKey("bright_futures_visits.id"), nullable=False)
    
    # Assessment type
    assessment_type = Column(String(100), nullable=False)  # Social, Environmental, Developmental
    assessment_domain = Column(String(100), nullable=False)  # Food security, Housing, etc.
    
    # Results
    risk_level = Column(Enum(RiskLevel), nullable=False)
    risk_factors = Column(JSON, nullable=True)  # List of identified risk factors
    protective_factors = Column(JSON, nullable=True)  # List of protective factors
    
    # Interventions
    interventions_recommended = Column(JSON, nullable=True)
    resources_provided = Column(JSON, nullable=True)
    referrals_made = Column(JSON, nullable=True)
    
    # Follow-up
    follow_up_date = Column(Date, nullable=True)
    resolved = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    
    # Relationship
    visit = relationship("BrightFuturesVisit", back_populates="risk_assessments")


class ScreeningTool(BaseModel):
    """Template definitions for screening tools."""
    
    __tablename__ = "screening_tools"
    
    # Tool identification
    tool_name = Column(String(100), nullable=False, unique=True)
    tool_version = Column(String(20), nullable=True)
    description = Column(Text, nullable=True)
    
    # Age range
    min_age_months = Column(Integer, nullable=False)
    max_age_months = Column(Integer, nullable=False)
    
    # Tool configuration
    questions = Column(JSON, nullable=False)  # List of questions and answer options
    scoring_rules = Column(JSON, nullable=False)  # How to calculate scores
    interpretation_rules = Column(JSON, nullable=False)  # How to interpret scores
    
    # Localization
    available_languages = Column(JSON, default=["tr", "en"], nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True)


class MilestoneTemplate(BaseModel):
    """Template definitions for developmental milestones."""
    
    __tablename__ = "milestone_templates"
    
    # Milestone identification
    milestone_name = Column(String(200), nullable=False)
    milestone_domain = Column(String(100), nullable=False)  # Motor, Language, Social, Cognitive
    
    # Age expectations
    expected_age_months = Column(Integer, nullable=False)
    age_range_start = Column(Integer, nullable=False)  # Earliest expected age
    age_range_end = Column(Integer, nullable=False)    # Latest normal age
    
    # Description and criteria
    description = Column(Text, nullable=False)
    assessment_criteria = Column(Text, nullable=True)
    
    # Localization
    description_tr = Column(Text, nullable=True)  # Turkish translation
    assessment_criteria_tr = Column(Text, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)


class ImmunizationSchedule(BaseModel):
    """Turkish immunization schedule template."""
    
    __tablename__ = "immunization_schedule"
    
    # Vaccine information
    vaccine_name = Column(String(200), nullable=False)
    vaccine_name_tr = Column(String(200), nullable=True)  # Turkish name
    vaccine_code = Column(String(50), nullable=True)
    
    # Schedule information
    dose_number = Column(Integer, nullable=False)
    recommended_age_months = Column(Integer, nullable=False)
    minimum_age_months = Column(Integer, nullable=True)
    maximum_age_months = Column(Integer, nullable=True)
    
    # Administration details
    route = Column(String(50), nullable=False)
    site = Column(String(100), nullable=True)
    dose_volume = Column(String(20), nullable=True)
    
    # Requirements
    is_required = Column(Boolean, default=True)
    contraindications = Column(JSON, nullable=True)
    precautions = Column(JSON, nullable=True)
    
    # Notes
    notes = Column(Text, nullable=True)
    notes_tr = Column(Text, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
