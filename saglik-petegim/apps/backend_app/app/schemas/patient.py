"""Patient-related Pydantic schemas."""

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID
from decimal import Decimal

from pydantic import Field, validator

from app.models.patient import Gender, BloodType
from app.schemas.base import BaseResponse, BaseSchema


class EmergencyContactBase(BaseSchema):
    """Base emergency contact schema."""
    
    name: str = Field(..., description="Contact name", min_length=1, max_length=200)
    relationship: str = Field(..., description="Relationship to patient", min_length=1, max_length=100)
    phone_primary: str = Field(..., description="Primary phone number", min_length=1, max_length=20)
    phone_secondary: Optional[str] = Field(None, description="Secondary phone number", max_length=20)
    email: Optional[str] = Field(None, description="Email address", max_length=255)
    address: Optional[str] = Field(None, description="Address", max_length=1000)
    is_primary: bool = Field(False, description="Is primary contact")
    can_authorize_treatment: bool = Field(False, description="Can authorize medical treatment")


class EmergencyContactCreate(EmergencyContactBase):
    """Schema for creating emergency contact."""
    pass


class EmergencyContactUpdate(BaseSchema):
    """Schema for updating emergency contact."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    relationship: Optional[str] = Field(None, min_length=1, max_length=100)
    phone_primary: Optional[str] = Field(None, min_length=1, max_length=20)
    phone_secondary: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=255)
    address: Optional[str] = Field(None, max_length=1000)
    is_primary: Optional[bool] = Field(None)
    can_authorize_treatment: Optional[bool] = Field(None)


class EmergencyContactResponse(BaseResponse):
    """Emergency contact response schema."""
    
    name: str
    relationship: str
    phone_primary: str
    phone_secondary: Optional[str]
    email: Optional[str] 
    address: Optional[str]
    is_primary: bool
    can_authorize_treatment: bool
    patient_id: UUID


class PatientBase(BaseSchema):
    """Base patient schema."""
    
    first_name: str = Field(..., description="Patient first name", min_length=1, max_length=100)
    last_name: str = Field(..., description="Patient last name", min_length=1, max_length=100)
    date_of_birth: date = Field(..., description="Date of birth")
    gender: Gender = Field(..., description="Patient gender")
    national_id: Optional[str] = Field(None, description="National ID number", max_length=20)
    
    # Contact information
    address: Optional[str] = Field(None, description="Home address", max_length=1000)
    city: Optional[str] = Field(None, description="City", max_length=100)
    postal_code: Optional[str] = Field(None, description="Postal code", max_length=20)
    
    # Medical information
    blood_type: Optional[BloodType] = Field(BloodType.UNKNOWN, description="Blood type")
    allergies: Optional[str] = Field(None, description="Known allergies", max_length=2000)
    chronic_conditions: Optional[str] = Field(None, description="Chronic conditions", max_length=2000)
    current_medications: Optional[str] = Field(None, description="Current medications", max_length=2000)
    
    # Birth information
    birth_weight: Optional[Decimal] = Field(None, description="Birth weight in kg", ge=0, le=10)
    birth_length: Optional[Decimal] = Field(None, description="Birth length in cm", ge=0, le=100)
    gestational_age_weeks: Optional[Decimal] = Field(None, description="Gestational age in weeks", ge=20, le=45)
    
    # Insurance information
    insurance_provider: Optional[str] = Field(None, description="Insurance provider", max_length=200)
    insurance_number: Optional[str] = Field(None, description="Insurance number", max_length=100)
    
    @validator("date_of_birth")
    def validate_birth_date(cls, v):
        """Validate that birth date is not in the future."""
        if v > date.today():
            raise ValueError("Birth date cannot be in the future")
        return v
    
    @validator("national_id")
    def validate_national_id(cls, v):
        """Validate national ID format (basic check)."""
        if v and not v.isdigit():
            raise ValueError("National ID must contain only digits")
        return v


class PatientCreate(PatientBase):
    """Schema for creating a new patient."""
    
    parent_id: UUID = Field(..., description="Parent/guardian user ID")
    
    # Emergency contacts can be added separately
    emergency_contacts: Optional[List[EmergencyContactCreate]] = Field(
        None, 
        description="Emergency contacts"
    )


class PatientUpdate(BaseSchema):
    """Schema for updating a patient."""
    
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    address: Optional[str] = Field(None, max_length=1000)
    city: Optional[str] = Field(None, max_length=100)
    postal_code: Optional[str] = Field(None, max_length=20)
    
    # Medical information updates
    blood_type: Optional[BloodType] = Field(None)
    allergies: Optional[str] = Field(None, max_length=2000)
    chronic_conditions: Optional[str] = Field(None, max_length=2000)
    current_medications: Optional[str] = Field(None, max_length=2000)
    
    # Insurance updates
    insurance_provider: Optional[str] = Field(None, max_length=200)
    insurance_number: Optional[str] = Field(None, max_length=100)


class PatientResponse(BaseResponse):
    """Patient response schema."""
    
    first_name: str
    last_name: str
    date_of_birth: date
    gender: Gender
    national_id: Optional[str]
    patient_number: str
    
    # Contact information
    address: Optional[str]
    city: Optional[str]
    postal_code: Optional[str]
    
    # Medical information
    blood_type: BloodType
    allergies: Optional[str]
    chronic_conditions: Optional[str]
    current_medications: Optional[str]
    
    # Birth information
    birth_weight: Optional[Decimal]
    birth_length: Optional[Decimal]
    gestational_age_weeks: Optional[Decimal]
    
    # Insurance information
    insurance_provider: Optional[str]
    insurance_number: Optional[str]
    
    # Status
    is_active: bool
    
    # Relationships
    parent_id: UUID
    emergency_contacts: List[EmergencyContactResponse] = Field(default_factory=list)
    
    # Computed properties
    @property
    def full_name(self) -> str:
        """Get patient's full name."""
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age_in_months(self) -> int:
        """Calculate age in months."""
        today = date.today()
        months = (today.year - self.date_of_birth.year) * 12
        months += today.month - self.date_of_birth.month
        if today.day < self.date_of_birth.day:
            months -= 1
        return max(0, months)
    
    @property
    def age_display(self) -> str:
        """Get human-readable age."""
        months = self.age_in_months
        if months < 12:
            return f"{months} ay"
        else:
            years = months // 12
            remaining_months = months % 12
            if remaining_months == 0:
                return f"{years} yaş"
            else:
                return f"{years} yaş {remaining_months} ay"


class PatientSummary(BaseSchema):
    """Patient summary for lists."""
    
    id: UUID
    first_name: str
    last_name: str
    date_of_birth: date
    gender: Gender
    patient_number: str
    is_active: bool
    parent_id: UUID
    
    @property
    def full_name(self) -> str:
        """Get patient's full name."""
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age_display(self) -> str:
        """Get human-readable age."""
        today = date.today()
        months = (today.year - self.date_of_birth.year) * 12
        months += today.month - self.date_of_birth.month
        if today.day < self.date_of_birth.day:
            months -= 1
        months = max(0, months)
        
        if months < 12:
            return f"{months} ay"
        else:
            years = months // 12
            remaining_months = months % 12
            if remaining_months == 0:
                return f"{years} yaş"
            else:
                return f"{years} yaş {remaining_months} ay"


class PatientSearchRequest(BaseSchema):
    """Patient search request schema."""
    
    query: Optional[str] = Field(None, description="Search query (name, patient number)")
    parent_id: Optional[UUID] = Field(None, description="Filter by parent ID")
    gender: Optional[Gender] = Field(None, description="Filter by gender")
    age_min_months: Optional[int] = Field(None, description="Minimum age in months", ge=0)
    age_max_months: Optional[int] = Field(None, description="Maximum age in months", ge=0)
    has_allergies: Optional[bool] = Field(None, description="Filter patients with allergies")
    has_chronic_conditions: Optional[bool] = Field(None, description="Filter patients with chronic conditions")
    is_active: Optional[bool] = Field(True, description="Filter by active status")
    
    @validator("age_max_months")
    def validate_age_range(cls, v, values):
        """Validate age range."""
        if v is not None and "age_min_months" in values and values["age_min_months"] is not None:
            if v < values["age_min_months"]:
                raise ValueError("Maximum age must be greater than minimum age")
        return v


class PatientStatsResponse(BaseSchema):
    """Patient statistics response."""
    
    total_patients: int = Field(..., ge=0)
    active_patients: int = Field(..., ge=0)
    patients_by_gender: dict = Field(...)
    patients_by_age_group: dict = Field(...)
    patients_with_allergies: int = Field(..., ge=0)
    patients_with_chronic_conditions: int = Field(..., ge=0)
    new_patients_this_month: int = Field(..., ge=0)
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class PatientMedicalSummary(BaseSchema):
    """Patient medical summary."""
    
    patient_id: UUID
    last_visit_date: Optional[date]
    next_appointment_date: Optional[date]
    upcoming_vaccinations: int = Field(..., ge=0)
    overdue_vaccinations: int = Field(..., ge=0)
    growth_tracking_status: str
    active_prescriptions: int = Field(..., ge=0)
    alerts: List[str] = Field(default_factory=list)


class BulkPatientImport(BaseSchema):
    """Bulk patient import schema."""
    
    patients: List[PatientCreate] = Field(..., min_items=1, max_items=100)
    options: Optional[dict] = Field(None)
    validate_only: bool = Field(False, description="Only validate without creating")