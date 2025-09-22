"""User model and related enums."""

import enum
from typing import TYPE_CHECKING, List
from sqlalchemy import Boolean, Column, Enum, String, Text
from sqlalchemy.orm import relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.appointment import Appointment
    from app.models.audit import AuditLog


class UserRole(enum.Enum):
    """User role enumeration."""
    
    ADMIN = "admin"
    DOCTOR = "doctor" 
    NURSE = "nurse"
    RECEPTIONIST = "receptionist"
    PARENT = "parent"


class User(BaseModel):
    """User model for authentication and authorization."""
    
    __tablename__ = "users"
    
    # Basic Information
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True, index=True)
    
    # Authentication
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String(255), nullable=True)
    
    # Role and Permissions
    role = Column(Enum(UserRole), nullable=False, index=True)
    
    # Profile Information
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Healthcare Professional Information (for doctors/nurses)
    license_number = Column(String(100), nullable=True, unique=True)
    specialization = Column(String(200), nullable=True)
    years_of_experience = Column(String(50), nullable=True)
    
    # Settings and Preferences
    timezone = Column(String(50), default="Europe/Istanbul")
    language = Column(String(10), default="tr")
    
    # Notification Preferences
    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    
    # Relationships
    patients: List["Patient"] = relationship(
        "Patient",
        back_populates="parent",
        cascade="all, delete-orphan",
        foreign_keys="Patient.parent_id",
    )
    
    doctor_appointments: List["Appointment"] = relationship(
        "Appointment",
        back_populates="doctor",
        foreign_keys="Appointment.doctor_id",
    )
    
    created_appointments: List["Appointment"] = relationship(
        "Appointment",
        back_populates="created_by",
        foreign_keys="Appointment.created_by_id",
    )
    
    audit_logs: List["AuditLog"] = relationship(
        "AuditLog",
        back_populates="user",
        foreign_keys="AuditLog.user_id",
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return f"<User(id={self.id}, email={self.email}, role={self.role.value})>"
    
    @property
    def full_name(self) -> str:
        """Get user's full name."""
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_healthcare_professional(self) -> bool:
        """Check if user is a healthcare professional."""
        return self.role in [UserRole.DOCTOR, UserRole.NURSE]
    
    @property
    def is_staff(self) -> bool:
        """Check if user is staff."""
        return self.role in [
            UserRole.ADMIN,
            UserRole.DOCTOR,
            UserRole.NURSE,
            UserRole.RECEPTIONIST,
        ]
    
    @property
    def can_access_medical_records(self) -> bool:
        """Check if user can access medical records."""
        return self.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]
    
    @property
    def can_manage_appointments(self) -> bool:
        """Check if user can manage appointments."""
        return self.role in [
            UserRole.ADMIN,
            UserRole.DOCTOR,
            UserRole.NURSE,
            UserRole.RECEPTIONIST,
        ]
    
    @property
    def can_prescribe_medication(self) -> bool:
        """Check if user can prescribe medication."""
        return self.role == UserRole.DOCTOR