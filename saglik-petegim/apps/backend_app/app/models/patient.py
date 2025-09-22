"""Patient and emergency contact models."""

import enum
from datetime import date
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import (
    Boolean, Column, Date, Enum, ForeignKey, 
    Numeric, String, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.appointment import Appointment
    from app.models.medical_record import MedicalRecord
    from app.models.vaccination import Vaccination
    from app.models.growth import GrowthMeasurement


class Gender(enum.Enum):
    """Gender enumeration."""
    
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class BloodType(enum.Enum):
    """Blood type enumeration."""
    
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"
    UNKNOWN = "unknown"


class Patient(BaseModel):
    """Patient model for children in the healthcare system."""
    
    __tablename__ = "patients"
    
    # Basic Information
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False, index=True)
    gender = Column(Enum(Gender), nullable=False)
    
    # Identification
    national_id = Column(String(20), nullable=True, unique=True, index=True)
    patient_number = Column(String(50), nullable=False, unique=True, index=True)
    
    # Contact Information
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    
    # Medical Information
    blood_type = Column(Enum(BloodType), default=BloodType.UNKNOWN)
    allergies = Column(Text, nullable=True)
    chronic_conditions = Column(Text, nullable=True)
    current_medications = Column(Text, nullable=True)
    
    # Birth Information
    birth_weight = Column(Numeric(5, 2), nullable=True)  # kg
    birth_length = Column(Numeric(4, 1), nullable=True)  # cm
    gestational_age_weeks = Column(Numeric(4, 1), nullable=True)
    
    # Insurance Information
    insurance_provider = Column(String(200), nullable=True)
    insurance_number = Column(String(100), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    parent_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    
    parent: "User" = relationship(
        "User",
        back_populates="patients",
        foreign_keys=[parent_id],
    )
    
    emergency_contacts: List["EmergencyContact"] = relationship(
        "EmergencyContact",
        back_populates="patient",
        cascade="all, delete-orphan",
    )
    
    appointments: List["Appointment"] = relationship(
        "Appointment",
        back_populates="patient",
        cascade="all, delete-orphan",
    )
    
    medical_records: List["MedicalRecord"] = relationship(
        "MedicalRecord",
        back_populates="patient",
        cascade="all, delete-orphan",
    )
    
    vaccinations: List["Vaccination"] = relationship(
        "Vaccination",
        back_populates="patient",
        cascade="all, delete-orphan",
    )
    
    growth_measurements: List["GrowthMeasurement"] = relationship(
        "GrowthMeasurement",
        back_populates="patient",
        cascade="all, delete-orphan",
    )
    
    bright_futures_visits = relationship(
        "BrightFuturesVisit",
        back_populates="patient",
        cascade="all, delete-orphan",
    )
    
    immunization_records = relationship(
        "ImmunizationRecord",
        back_populates="patient",
        cascade="all, delete-orphan",
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return f"<Patient(id={self.id}, name={self.full_name}, patient_number={self.patient_number})>"
    
    @property
    def full_name(self) -> str:
        """Get patient's full name."""
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age_in_months(self) -> int:
        """Calculate age in months."""
        from datetime import date
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
    
    @property
    def is_newborn(self) -> bool:
        """Check if patient is a newborn (< 1 month)."""
        return self.age_in_months < 1
    
    @property
    def is_infant(self) -> bool:
        """Check if patient is an infant (< 12 months)."""
        return self.age_in_months < 12
    
    @property
    def is_toddler(self) -> bool:
        """Check if patient is a toddler (1-3 years)."""
        months = self.age_in_months
        return 12 <= months < 36
    
    @property
    def has_allergies(self) -> bool:
        """Check if patient has known allergies."""
        return bool(self.allergies and self.allergies.strip())
    
    @property
    def has_chronic_conditions(self) -> bool:
        """Check if patient has chronic conditions."""
        return bool(self.chronic_conditions and self.chronic_conditions.strip())


class EmergencyContact(BaseModel):
    """Emergency contact information for patients."""
    
    __tablename__ = "emergency_contacts"
    
    # Contact Information
    name = Column(String(200), nullable=False)
    relationship = Column(String(100), nullable=False)
    phone_primary = Column(String(20), nullable=False)
    phone_secondary = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    
    # Priority
    is_primary = Column(Boolean, default=False, nullable=False)
    can_authorize_treatment = Column(Boolean, default=False, nullable=False)
    
    # Relationship
    patient_id = Column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    patient: "Patient" = relationship(
        "Patient",
        back_populates="emergency_contacts",
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return f"<EmergencyContact(id={self.id}, name={self.name}, patient={self.patient_id})>"