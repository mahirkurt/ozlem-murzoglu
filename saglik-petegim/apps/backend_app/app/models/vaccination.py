"""Vaccination and vaccination schedule models."""

import enum
from datetime import date
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import (
    Boolean, Column, Date, Enum, ForeignKey, 
    Integer, String, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.user import User


class VaccineType(enum.Enum):
    """Vaccine type enumeration."""
    
    # Birth vaccines
    HEPATITIS_B = "hepatitis_b"
    BCG = "bcg"
    
    # 2-4-6 months
    DIPHTHERIA_TETANUS_PERTUSSIS = "dtp"  # DTP/DTaP
    INACTIVATED_POLIO = "ipv"
    PNEUMOCOCCAL = "pcv"
    HAEMOPHILUS_INFLUENZAE_B = "hib"
    ROTAVIRUS = "rotavirus"
    
    # 12-15 months
    MEASLES_MUMPS_RUBELLA = "mmr"
    VARICELLA = "varicella"  # Chickenpox
    HEPATITIS_A = "hepatitis_a"
    
    # 15-18 months
    DIPHTHERIA_TETANUS_PERTUSSIS_BOOSTER = "dtp_booster"
    HAEMOPHILUS_INFLUENZAE_B_BOOSTER = "hib_booster"
    
    # 4-6 years
    DIPHTHERIA_TETANUS_PERTUSSIS_SECOND_BOOSTER = "dtp_second_booster"
    INACTIVATED_POLIO_BOOSTER = "ipv_booster"
    MEASLES_MUMPS_RUBELLA_BOOSTER = "mmr_booster"
    
    # Seasonal/Optional
    INFLUENZA = "influenza"
    MENINGOCOCCAL = "meningococcal"
    HPV = "hpv"  # For older children
    
    # Other
    OTHER = "other"


class VaccinationStatus(enum.Enum):
    """Vaccination status enumeration."""
    
    SCHEDULED = "scheduled"
    OVERDUE = "overdue" 
    COMPLETED = "completed"
    DELAYED = "delayed"
    CONTRAINDICATED = "contraindicated"
    REFUSED = "refused"
    NOT_APPLICABLE = "not_applicable"


class VaccinationSchedule(BaseModel):
    """Recommended vaccination schedule template."""
    
    __tablename__ = "vaccination_schedules"
    
    # Vaccine Information
    vaccine_type = Column(Enum(VaccineType), nullable=False, index=True)
    vaccine_name = Column(String(200), nullable=False)
    manufacturer = Column(String(200), nullable=True)
    
    # Schedule Information
    recommended_age_months = Column(Integer, nullable=False)
    dose_number = Column(Integer, nullable=False)
    is_booster = Column(Boolean, default=False, nullable=False)
    
    # Administration Details
    route = Column(String(50), nullable=True)  # IM, oral, etc.
    site = Column(String(100), nullable=True)  # injection site
    dosage = Column(String(50), nullable=True)
    
    # Schedule Rules
    minimum_age_months = Column(Integer, nullable=True)
    maximum_age_months = Column(Integer, nullable=True)
    interval_from_previous_days = Column(Integer, nullable=True)
    
    # Information
    description = Column(Text, nullable=True)
    side_effects = Column(Text, nullable=True)
    contraindications = Column(Text, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_required = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<VaccinationSchedule(id={self.id}, vaccine={self.vaccine_type.value}, "
            f"age={self.recommended_age_months}mo, dose={self.dose_number})>"
        )


class Vaccination(BaseModel):
    """Individual vaccination record for a patient."""
    
    __tablename__ = "vaccinations"
    
    # Vaccine Information
    vaccine_type = Column(Enum(VaccineType), nullable=False, index=True)
    vaccine_name = Column(String(200), nullable=False)
    manufacturer = Column(String(200), nullable=True)
    lot_number = Column(String(100), nullable=True)
    expiration_date = Column(Date, nullable=True)
    
    # Administration Details
    administration_date = Column(Date, nullable=True, index=True)
    scheduled_date = Column(Date, nullable=True, index=True)
    dose_number = Column(Integer, nullable=False)
    route = Column(String(50), nullable=True)
    site = Column(String(100), nullable=True)
    dosage = Column(String(50), nullable=True)
    
    # Status and Notes
    status = Column(
        Enum(VaccinationStatus), 
        default=VaccinationStatus.SCHEDULED,
        nullable=False,
        index=True,
    )
    notes = Column(Text, nullable=True)
    adverse_reactions = Column(Text, nullable=True)
    
    # Delay/Refusal Information
    delay_reason = Column(String(500), nullable=True)
    refusal_reason = Column(String(500), nullable=True)
    contraindication_reason = Column(String(500), nullable=True)
    
    # Follow-up
    next_dose_due_date = Column(Date, nullable=True, index=True)
    reminder_sent = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    patient_id = Column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    administered_by_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )
    
    schedule_id = Column(
        UUID(as_uuid=True),
        ForeignKey("vaccination_schedules.id"),
        nullable=True,
        index=True,
    )
    
    patient: "Patient" = relationship(
        "Patient",
        back_populates="vaccinations",
        foreign_keys=[patient_id],
    )
    
    administered_by: Optional["User"] = relationship(
        "User",
        foreign_keys=[administered_by_id],
    )
    
    schedule: Optional["VaccinationSchedule"] = relationship(
        "VaccinationSchedule",
        foreign_keys=[schedule_id],
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<Vaccination(id={self.id}, patient={self.patient_id}, "
            f"vaccine={self.vaccine_type.value}, status={self.status.value})>"
        )
    
    @property
    def is_administered(self) -> bool:
        """Check if vaccination has been administered."""
        return self.status == VaccinationStatus.COMPLETED
    
    @property
    def is_overdue(self) -> bool:
        """Check if vaccination is overdue."""
        if not self.scheduled_date:
            return False
        return (
            self.status in [VaccinationStatus.SCHEDULED, VaccinationStatus.OVERDUE]
            and self.scheduled_date < date.today()
        )
    
    @property
    def is_upcoming(self) -> bool:
        """Check if vaccination is upcoming (within next 30 days)."""
        if not self.scheduled_date or self.is_administered:
            return False
        from datetime import timedelta
        upcoming_threshold = date.today() + timedelta(days=30)
        return self.scheduled_date <= upcoming_threshold
    
    @property
    def days_until_due(self) -> Optional[int]:
        """Calculate days until vaccination is due."""
        if not self.scheduled_date:
            return None
        delta = self.scheduled_date - date.today()
        return delta.days
    
    @property
    def days_overdue(self) -> Optional[int]:
        """Calculate days overdue for vaccination."""
        if not self.is_overdue:
            return None
        delta = date.today() - self.scheduled_date
        return delta.days
    
    def administer(
        self, 
        administered_by_id: UUID, 
        administration_date: date = None,
        notes: str = None,
        adverse_reactions: str = None,
    ) -> None:
        """Mark vaccination as administered."""
        self.status = VaccinationStatus.COMPLETED
        self.administration_date = administration_date or date.today()
        self.administered_by_id = administered_by_id
        if notes:
            self.notes = notes
        if adverse_reactions:
            self.adverse_reactions = adverse_reactions
    
    def delay(self, reason: str, new_date: date = None) -> None:
        """Delay the vaccination."""
        self.status = VaccinationStatus.DELAYED
        self.delay_reason = reason
        if new_date:
            self.scheduled_date = new_date
    
    def refuse(self, reason: str) -> None:
        """Mark vaccination as refused."""
        self.status = VaccinationStatus.REFUSED
        self.refusal_reason = reason
    
    def contraindicate(self, reason: str) -> None:
        """Mark vaccination as contraindicated."""
        self.status = VaccinationStatus.CONTRAINDICATED
        self.contraindication_reason = reason