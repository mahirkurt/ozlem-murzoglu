"""Audit logging models for compliance and security."""

import enum
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import INET, JSON, UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.user import User


class AuditAction(enum.Enum):
    """Audit action enumeration."""
    
    # User actions
    USER_LOGIN = "user_login"
    USER_LOGOUT = "user_logout"
    USER_LOGIN_FAILED = "user_login_failed"
    USER_PASSWORD_CHANGED = "user_password_changed"
    USER_CREATED = "user_created"
    USER_UPDATED = "user_updated"
    USER_DEACTIVATED = "user_deactivated"
    
    # Patient actions
    PATIENT_CREATED = "patient_created"
    PATIENT_UPDATED = "patient_updated"
    PATIENT_VIEWED = "patient_viewed"
    PATIENT_DELETED = "patient_deleted"
    
    # Medical record actions
    MEDICAL_RECORD_CREATED = "medical_record_created"
    MEDICAL_RECORD_UPDATED = "medical_record_updated"
    MEDICAL_RECORD_VIEWED = "medical_record_viewed"
    MEDICAL_RECORD_DELETED = "medical_record_deleted"
    MEDICAL_DOCUMENT_UPLOADED = "medical_document_uploaded"
    MEDICAL_DOCUMENT_DOWNLOADED = "medical_document_downloaded"
    MEDICAL_DOCUMENT_DELETED = "medical_document_deleted"
    
    # Appointment actions
    APPOINTMENT_CREATED = "appointment_created"
    APPOINTMENT_UPDATED = "appointment_updated"
    APPOINTMENT_CANCELLED = "appointment_cancelled"
    APPOINTMENT_COMPLETED = "appointment_completed"
    APPOINTMENT_NO_SHOW = "appointment_no_show"
    
    # Prescription actions
    PRESCRIPTION_CREATED = "prescription_created"
    PRESCRIPTION_UPDATED = "prescription_updated"
    PRESCRIPTION_VIEWED = "prescription_viewed"
    PRESCRIPTION_CANCELLED = "prescription_cancelled"
    
    # Vaccination actions
    VACCINATION_RECORDED = "vaccination_recorded"
    VACCINATION_UPDATED = "vaccination_updated"
    VACCINATION_DELAYED = "vaccination_delayed"
    VACCINATION_REFUSED = "vaccination_refused"
    
    # Growth tracking actions
    GROWTH_MEASUREMENT_RECORDED = "growth_measurement_recorded"
    GROWTH_MEASUREMENT_UPDATED = "growth_measurement_updated"
    
    # System actions
    DATA_EXPORT = "data_export"
    DATA_IMPORT = "data_import"
    BACKUP_CREATED = "backup_created"
    BACKUP_RESTORED = "backup_restored"
    SYSTEM_MAINTENANCE = "system_maintenance"
    
    # Security actions
    UNAUTHORIZED_ACCESS_ATTEMPT = "unauthorized_access_attempt"
    PERMISSION_DENIED = "permission_denied"
    DATA_BREACH_DETECTED = "data_breach_detected"
    SUSPICIOUS_ACTIVITY = "suspicious_activity"


class AuditSeverity(enum.Enum):
    """Audit severity enumeration."""
    
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class AuditLog(BaseModel):
    """Audit log for tracking all system activities."""
    
    __tablename__ = "audit_logs"
    
    # Action Information
    action = Column(Enum(AuditAction), nullable=False, index=True)
    resource_type = Column(String(100), nullable=False, index=True)
    resource_id = Column(String(100), nullable=True, index=True)
    
    # User Information
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    user_email = Column(String(255), nullable=True, index=True)
    user_role = Column(String(50), nullable=True)
    
    # Request Information
    ip_address = Column(INET, nullable=True, index=True)
    user_agent = Column(Text, nullable=True)
    request_method = Column(String(10), nullable=True)
    request_url = Column(String(2000), nullable=True)
    
    # Response Information
    status_code = Column(String(10), nullable=True)
    response_time_ms = Column(String(20), nullable=True)
    
    # Change Information
    old_values = Column(JSON, nullable=True)  # Previous values before change
    new_values = Column(JSON, nullable=True)  # New values after change
    
    # Context Information
    description = Column(Text, nullable=True)
    metadata = Column(JSON, nullable=True)  # Additional context data
    severity = Column(
        Enum(AuditSeverity),
        default=AuditSeverity.INFO,
        nullable=False,
        index=True,
    )
    
    # Session Information
    session_id = Column(String(255), nullable=True, index=True)
    correlation_id = Column(String(255), nullable=True, index=True)
    
    # Timestamps
    timestamp = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )
    
    # Relationships
    user: Optional["User"] = relationship(
        "User",
        back_populates="audit_logs",
        foreign_keys=[user_id],
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<AuditLog(id={self.id}, action={self.action.value}, "
            f"user={self.user_email}, timestamp={self.timestamp})>"
        )
    
    @property
    def is_security_event(self) -> bool:
        """Check if this is a security-related event."""
        security_actions = [
            AuditAction.USER_LOGIN_FAILED,
            AuditAction.UNAUTHORIZED_ACCESS_ATTEMPT,
            AuditAction.PERMISSION_DENIED,
            AuditAction.DATA_BREACH_DETECTED,
            AuditAction.SUSPICIOUS_ACTIVITY,
        ]
        return self.action in security_actions
    
    @property
    def is_medical_data_access(self) -> bool:
        """Check if this involves medical data access."""
        medical_actions = [
            AuditAction.MEDICAL_RECORD_VIEWED,
            AuditAction.MEDICAL_RECORD_CREATED,
            AuditAction.MEDICAL_RECORD_UPDATED,
            AuditAction.MEDICAL_DOCUMENT_DOWNLOADED,
            AuditAction.PRESCRIPTION_VIEWED,
        ]
        return self.action in medical_actions
    
    @property
    def is_data_modification(self) -> bool:
        """Check if this involves data modification."""
        modification_actions = [
            action for action in AuditAction
            if any(keyword in action.value for keyword in ["created", "updated", "deleted"])
        ]
        return self.action in modification_actions
    
    @property
    def has_sensitive_data(self) -> bool:
        """Check if audit log contains sensitive data that should be protected."""
        # Consider any medical record access as sensitive
        if self.is_medical_data_access:
            return True
        
        # Consider any failed authentication as sensitive
        if self.action == AuditAction.USER_LOGIN_FAILED:
            return True
        
        # Consider any security events as sensitive
        if self.is_security_event:
            return True
        
        return False
    
    def get_summary(self) -> str:
        """Get a human-readable summary of the audit event."""
        action_descriptions = {
            AuditAction.USER_LOGIN: "User logged in",
            AuditAction.USER_LOGOUT: "User logged out",
            AuditAction.USER_LOGIN_FAILED: "Failed login attempt",
            AuditAction.PATIENT_CREATED: "Patient record created",
            AuditAction.PATIENT_UPDATED: "Patient record updated",
            AuditAction.MEDICAL_RECORD_VIEWED: "Medical record accessed",
            AuditAction.APPOINTMENT_CREATED: "Appointment scheduled",
            AuditAction.PRESCRIPTION_CREATED: "Prescription issued",
        }
        
        base_description = action_descriptions.get(
            self.action,
            self.action.value.replace("_", " ").title()
        )
        
        if self.user_email:
            return f"{base_description} by {self.user_email}"
        else:
            return base_description
    
    @classmethod
    def create_log(
        cls,
        action: AuditAction,
        resource_type: str,
        resource_id: str = None,
        user_id: UUID = None,
        user_email: str = None,
        user_role: str = None,
        ip_address: str = None,
        user_agent: str = None,
        description: str = None,
        old_values: dict = None,
        new_values: dict = None,
        metadata: dict = None,
        severity: AuditSeverity = AuditSeverity.INFO,
        **kwargs
    ) -> "AuditLog":
        """Create a new audit log entry."""
        return cls(
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            user_id=user_id,
            user_email=user_email,
            user_role=user_role,
            ip_address=ip_address,
            user_agent=user_agent,
            description=description,
            old_values=old_values,
            new_values=new_values,
            metadata=metadata,
            severity=severity,
            **kwargs
        )