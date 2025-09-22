"""Prescription and medication models."""

import enum
from datetime import date, datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import (
    Boolean, Column, Date, DateTime, Enum, ForeignKey, 
    Integer, Numeric, String, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.user import User
    from app.models.appointment import Appointment


class PrescriptionStatus(enum.Enum):
    """Prescription status enumeration."""
    
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    PARTIALLY_FILLED = "partially_filled"


class MedicationForm(enum.Enum):
    """Medication form enumeration."""
    
    TABLET = "tablet"
    CAPSULE = "capsule"
    SYRUP = "syrup"
    DROPS = "drops"
    SUSPENSION = "suspension"
    OINTMENT = "ointment"
    CREAM = "cream"
    INJECTION = "injection"
    INHALER = "inhaler"
    SUPPOSITORY = "suppository"
    PATCH = "patch"
    OTHER = "other"


class DosageUnit(enum.Enum):
    """Dosage unit enumeration."""
    
    MG = "mg"  # milligrams
    ML = "ml"  # milliliters
    TABLETS = "tablets"
    CAPSULES = "capsules"
    DROPS = "drops"
    PUFFS = "puffs"
    IU = "iu"  # international units
    MCG = "mcg"  # micrograms
    PERCENT = "percent"
    OTHER = "other"


class FrequencyUnit(enum.Enum):
    """Frequency unit enumeration."""
    
    DAILY = "daily"
    TWICE_DAILY = "twice_daily"
    THREE_TIMES_DAILY = "three_times_daily"
    FOUR_TIMES_DAILY = "four_times_daily"
    EVERY_6_HOURS = "every_6_hours"
    EVERY_8_HOURS = "every_8_hours"
    EVERY_12_HOURS = "every_12_hours"
    WEEKLY = "weekly"
    AS_NEEDED = "as_needed"
    OTHER = "other"


class Medication(BaseModel):
    """Medication master data."""
    
    __tablename__ = "medications"
    
    # Basic Information
    name = Column(String(200), nullable=False, index=True)
    generic_name = Column(String(200), nullable=True, index=True)
    brand_names = Column(Text, nullable=True)  # JSON array of brand names
    
    # Classification
    drug_class = Column(String(200), nullable=True)
    therapeutic_class = Column(String(200), nullable=True)
    atc_code = Column(String(20), nullable=True)  # Anatomical Therapeutic Chemical code
    
    # Physical Properties
    strength = Column(String(100), nullable=True)
    form = Column(Enum(MedicationForm), nullable=False)
    route_of_administration = Column(String(100), nullable=True)
    
    # Safety Information
    contraindications = Column(Text, nullable=True)
    side_effects = Column(Text, nullable=True)
    drug_interactions = Column(Text, nullable=True)
    warnings = Column(Text, nullable=True)
    
    # Pediatric Information
    is_pediatric_approved = Column(Boolean, default=False, nullable=False)
    min_age_months = Column(Integer, nullable=True)
    max_age_months = Column(Integer, nullable=True)
    weight_based_dosing = Column(Boolean, default=False, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    requires_prescription = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self) -> str:
        """String representation."""
        return f"<Medication(id={self.id}, name={self.name}, form={self.form.value})>"


class Prescription(BaseModel):
    """Prescription for patients."""
    
    __tablename__ = "prescriptions"
    
    # Basic Information
    prescription_number = Column(String(100), unique=True, nullable=False, index=True)
    prescription_date = Column(Date, nullable=False, index=True)
    
    # Status
    status = Column(
        Enum(PrescriptionStatus),
        default=PrescriptionStatus.ACTIVE,
        nullable=False,
        index=True,
    )
    
    # Instructions
    general_instructions = Column(Text, nullable=True)
    dietary_instructions = Column(Text, nullable=True)
    follow_up_instructions = Column(Text, nullable=True)
    
    # Validity
    valid_until = Column(Date, nullable=True)
    refills_allowed = Column(Integer, default=0, nullable=False)
    refills_used = Column(Integer, default=0, nullable=False)
    
    # Notes
    diagnosis = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    patient_id = Column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    prescribed_by_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    
    appointment_id = Column(
        UUID(as_uuid=True),
        ForeignKey("appointments.id"),
        nullable=True,
        index=True,
    )
    
    patient: "Patient" = relationship(
        "Patient",
        foreign_keys=[patient_id],
    )
    
    prescribed_by: "User" = relationship(
        "User",
        foreign_keys=[prescribed_by_id],
    )
    
    appointment: Optional["Appointment"] = relationship(
        "Appointment",
        foreign_keys=[appointment_id],
    )
    
    items: List["PrescriptionItem"] = relationship(
        "PrescriptionItem",
        back_populates="prescription",
        cascade="all, delete-orphan",
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<Prescription(id={self.id}, number={self.prescription_number}, "
            f"patient={self.patient_id}, status={self.status.value})>"
        )
    
    @property
    def is_expired(self) -> bool:
        """Check if prescription is expired."""
        if not self.valid_until:
            return False
        return self.valid_until < date.today()
    
    @property
    def has_refills_available(self) -> bool:
        """Check if prescription has refills available."""
        return self.refills_used < self.refills_allowed
    
    @property
    def total_medications(self) -> int:
        """Get total number of medications in prescription."""
        return len(self.items)
    
    def can_be_refilled(self) -> bool:
        """Check if prescription can be refilled."""
        return (
            self.status == PrescriptionStatus.ACTIVE
            and not self.is_expired
            and self.has_refills_available
        )


class PrescriptionItem(BaseModel):
    """Individual medication item in a prescription."""
    
    __tablename__ = "prescription_items"
    
    # Dosage Information
    dosage_amount = Column(Numeric(8, 3), nullable=False)
    dosage_unit = Column(Enum(DosageUnit), nullable=False)
    frequency = Column(Enum(FrequencyUnit), nullable=False)
    frequency_detail = Column(String(200), nullable=True)  # "every 8 hours with food"
    
    # Duration and Quantity
    duration_days = Column(Integer, nullable=True)
    quantity_prescribed = Column(Integer, nullable=False)
    quantity_dispensed = Column(Integer, default=0, nullable=False)
    
    # Administration Instructions
    route = Column(String(100), nullable=True)  # oral, topical, etc.
    timing = Column(String(200), nullable=True)  # "with food", "on empty stomach"
    special_instructions = Column(Text, nullable=True)
    
    # Status
    is_substitutable = Column(Boolean, default=True, nullable=False)
    is_priority = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    prescription_id = Column(
        UUID(as_uuid=True),
        ForeignKey("prescriptions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    medication_id = Column(
        UUID(as_uuid=True),
        ForeignKey("medications.id"),
        nullable=False,
        index=True,
    )
    
    prescription: "Prescription" = relationship(
        "Prescription",
        back_populates="items",
    )
    
    medication: "Medication" = relationship(
        "Medication",
        foreign_keys=[medication_id],
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<PrescriptionItem(id={self.id}, medication={self.medication_id}, "
            f"dosage={self.dosage_amount}{self.dosage_unit.value})>"
        )
    
    @property
    def dosage_display(self) -> str:
        """Get formatted dosage display."""
        return f"{self.dosage_amount} {self.dosage_unit.value}"
    
    @property
    def frequency_display(self) -> str:
        """Get formatted frequency display."""
        frequency_map = {
            FrequencyUnit.DAILY: "günde 1 kez",
            FrequencyUnit.TWICE_DAILY: "günde 2 kez", 
            FrequencyUnit.THREE_TIMES_DAILY: "günde 3 kez",
            FrequencyUnit.FOUR_TIMES_DAILY: "günde 4 kez",
            FrequencyUnit.EVERY_6_HOURS: "6 saatte bir",
            FrequencyUnit.EVERY_8_HOURS: "8 saatte bir",
            FrequencyUnit.EVERY_12_HOURS: "12 saatte bir",
            FrequencyUnit.WEEKLY: "haftada 1 kez",
            FrequencyUnit.AS_NEEDED: "gerektiğinde",
        }
        
        base_frequency = frequency_map.get(self.frequency, self.frequency.value)
        if self.frequency_detail:
            return f"{base_frequency} ({self.frequency_detail})"
        return base_frequency
    
    @property
    def is_fully_dispensed(self) -> bool:
        """Check if item is fully dispensed."""
        return self.quantity_dispensed >= self.quantity_prescribed
    
    @property
    def remaining_quantity(self) -> int:
        """Get remaining quantity to be dispensed."""
        return max(0, self.quantity_prescribed - self.quantity_dispensed)
    
    @property
    def daily_dose_total(self) -> float:
        """Calculate total daily dose."""
        frequency_multipliers = {
            FrequencyUnit.DAILY: 1,
            FrequencyUnit.TWICE_DAILY: 2,
            FrequencyUnit.THREE_TIMES_DAILY: 3,
            FrequencyUnit.FOUR_TIMES_DAILY: 4,
            FrequencyUnit.EVERY_6_HOURS: 4,
            FrequencyUnit.EVERY_8_HOURS: 3,
            FrequencyUnit.EVERY_12_HOURS: 2,
            FrequencyUnit.WEEKLY: 1/7,
        }
        
        multiplier = frequency_multipliers.get(self.frequency, 1)
        return float(self.dosage_amount) * multiplier