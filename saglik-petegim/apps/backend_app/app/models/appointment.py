"""Appointment model and related enums."""

import enum
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import (
    Boolean, Column, DateTime, Enum, ForeignKey, 
    Integer, String, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.patient import Patient


class AppointmentStatus(enum.Enum):
    """Appointment status enumeration."""
    
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"
    RESCHEDULED = "rescheduled"


class AppointmentType(enum.Enum):
    """Appointment type enumeration."""
    
    ROUTINE_CHECKUP = "routine_checkup"
    VACCINATION = "vaccination"
    SICK_VISIT = "sick_visit"
    FOLLOW_UP = "follow_up"
    CONSULTATION = "consultation"
    EMERGENCY = "emergency"
    GROWTH_MONITORING = "growth_monitoring"
    DEVELOPMENT_SCREENING = "development_screening"


class Appointment(BaseModel):
    """Appointment model for scheduling patient visits."""
    
    __tablename__ = "appointments"
    
    # Appointment Details
    appointment_date = Column(DateTime(timezone=True), nullable=False, index=True)
    duration_minutes = Column(Integer, default=30, nullable=False)
    appointment_type = Column(Enum(AppointmentType), nullable=False)
    status = Column(
        Enum(AppointmentStatus), 
        default=AppointmentStatus.SCHEDULED, 
        nullable=False,
        index=True,
    )
    
    # Appointment Information
    chief_complaint = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    preparation_instructions = Column(Text, nullable=True)
    
    # Follow-up Information
    is_follow_up = Column(Boolean, default=False, nullable=False)
    follow_up_reason = Column(String(500), nullable=True)
    original_appointment_id = Column(
        UUID(as_uuid=True),
        ForeignKey("appointments.id"),
        nullable=True,
        index=True,
    )
    
    # Reminder Settings
    reminder_sent = Column(Boolean, default=False, nullable=False)
    reminder_sent_at = Column(DateTime(timezone=True), nullable=True)
    confirmation_sent = Column(Boolean, default=False, nullable=False)
    confirmation_sent_at = Column(DateTime(timezone=True), nullable=True)
    
    # Cancellation Information
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    cancellation_reason = Column(String(500), nullable=True)
    cancelled_by_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )
    
    # Relationships
    patient_id = Column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    doctor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    
    created_by_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    
    patient: "Patient" = relationship(
        "Patient",
        back_populates="appointments",
        foreign_keys=[patient_id],
    )
    
    doctor: "User" = relationship(
        "User",
        back_populates="doctor_appointments",
        foreign_keys=[doctor_id],
    )
    
    created_by: "User" = relationship(
        "User",
        back_populates="created_appointments",
        foreign_keys=[created_by_id],
    )
    
    cancelled_by: Optional["User"] = relationship(
        "User",
        foreign_keys=[cancelled_by_id],
        post_update=True,
    )
    
    # Self-referential relationship for follow-ups
    original_appointment: Optional["Appointment"] = relationship(
        "Appointment",
        remote_side="Appointment.id",
        back_populates="follow_up_appointments",
    )
    
    follow_up_appointments = relationship(
        "Appointment",
        back_populates="original_appointment",
        cascade="all, delete-orphan",
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<Appointment(id={self.id}, patient={self.patient_id}, "
            f"date={self.appointment_date}, status={self.status.value})>"
        )
    
    @property
    def is_past(self) -> bool:
        """Check if appointment is in the past."""
        return self.appointment_date < datetime.utcnow().replace(tzinfo=self.appointment_date.tzinfo)
    
    @property
    def is_today(self) -> bool:
        """Check if appointment is today."""
        today = datetime.utcnow().date()
        return self.appointment_date.date() == today
    
    @property
    def is_upcoming(self) -> bool:
        """Check if appointment is upcoming."""
        now = datetime.utcnow().replace(tzinfo=self.appointment_date.tzinfo)
        return self.appointment_date > now
    
    @property
    def can_be_cancelled(self) -> bool:
        """Check if appointment can be cancelled."""
        return self.status in [
            AppointmentStatus.SCHEDULED,
            AppointmentStatus.CONFIRMED,
        ] and self.is_upcoming
    
    @property
    def can_be_rescheduled(self) -> bool:
        """Check if appointment can be rescheduled."""
        return self.can_be_cancelled
    
    @property
    def can_be_completed(self) -> bool:
        """Check if appointment can be marked as completed."""
        return self.status in [
            AppointmentStatus.CONFIRMED,
            AppointmentStatus.IN_PROGRESS,
        ]
    
    @property
    def is_active(self) -> bool:
        """Check if appointment is active (not cancelled or completed)."""
        return self.status not in [
            AppointmentStatus.CANCELLED,
            AppointmentStatus.COMPLETED,
            AppointmentStatus.NO_SHOW,
        ]
    
    @property
    def end_time(self) -> datetime:
        """Get appointment end time."""
        from datetime import timedelta
        return self.appointment_date + timedelta(minutes=self.duration_minutes)
    
    def cancel(self, reason: str = None, cancelled_by_id: UUID = None) -> None:
        """Cancel the appointment."""
        self.status = AppointmentStatus.CANCELLED
        self.cancelled_at = datetime.utcnow()
        self.cancellation_reason = reason
        self.cancelled_by_id = cancelled_by_id
    
    def complete(self) -> None:
        """Mark appointment as completed."""
        self.status = AppointmentStatus.COMPLETED
    
    def mark_no_show(self) -> None:
        """Mark appointment as no show."""
        self.status = AppointmentStatus.NO_SHOW