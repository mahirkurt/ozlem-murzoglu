"""Notification and notification template models."""

import enum
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import (
    Boolean, Column, DateTime, Enum, ForeignKey, 
    Integer, String, Text
)
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.user import User


class NotificationType(enum.Enum):
    """Notification type enumeration."""
    
    # Appointment related
    APPOINTMENT_REMINDER = "appointment_reminder"
    APPOINTMENT_CONFIRMATION = "appointment_confirmation"
    APPOINTMENT_CANCELLED = "appointment_cancelled"
    APPOINTMENT_RESCHEDULED = "appointment_rescheduled"
    
    # Vaccination related
    VACCINATION_DUE = "vaccination_due"
    VACCINATION_OVERDUE = "vaccination_overdue"
    VACCINATION_COMPLETED = "vaccination_completed"
    
    # Medical related
    MEDICAL_REPORT_READY = "medical_report_ready"
    PRESCRIPTION_READY = "prescription_ready"
    LAB_RESULTS_READY = "lab_results_ready"
    
    # Growth tracking
    GROWTH_TRACKING_DUE = "growth_tracking_due"
    GROWTH_MILESTONE_REACHED = "growth_milestone_reached"
    
    # System notifications
    PASSWORD_RESET = "password_reset"
    ACCOUNT_VERIFICATION = "account_verification"
    SECURITY_ALERT = "security_alert"
    SYSTEM_MAINTENANCE = "system_maintenance"
    
    # General
    GENERAL_ANNOUNCEMENT = "general_announcement"
    HEALTH_TIP = "health_tip"
    BIRTHDAY_REMINDER = "birthday_reminder"


class NotificationChannel(enum.Enum):
    """Notification delivery channel enumeration."""
    
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    IN_APP = "in_app"


class NotificationPriority(enum.Enum):
    """Notification priority enumeration."""
    
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class NotificationStatus(enum.Enum):
    """Notification status enumeration."""
    
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"
    READ = "read"
    CANCELLED = "cancelled"


class NotificationTemplate(BaseModel):
    """Template for notifications."""
    
    __tablename__ = "notification_templates"
    
    # Template Information
    name = Column(String(200), nullable=False, index=True)
    code = Column(String(100), unique=True, nullable=False, index=True)
    notification_type = Column(Enum(NotificationType), nullable=False, index=True)
    
    # Content Templates
    subject_template = Column(String(500), nullable=False)
    body_template = Column(Text, nullable=False)
    sms_template = Column(String(1000), nullable=True)
    push_title_template = Column(String(200), nullable=True)
    push_body_template = Column(String(500), nullable=True)
    
    # Template Settings
    supported_channels = Column(JSON, nullable=False)  # List of NotificationChannel values
    default_priority = Column(
        Enum(NotificationPriority),
        default=NotificationPriority.NORMAL,
        nullable=False,
    )
    
    # Localization
    language = Column(String(10), default="tr", nullable=False)
    
    # Template Variables
    required_variables = Column(JSON, nullable=True)  # List of required template variables
    optional_variables = Column(JSON, nullable=True)  # List of optional template variables
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    notifications = relationship(
        "Notification",
        back_populates="template",
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<NotificationTemplate(id={self.id}, code={self.code}, "
            f"type={self.notification_type.value})>"
        )
    
    def render_subject(self, variables: dict) -> str:
        """Render subject template with variables."""
        try:
            return self.subject_template.format(**variables)
        except KeyError as e:
            raise ValueError(f"Missing required variable: {e}")
    
    def render_body(self, variables: dict) -> str:
        """Render body template with variables."""
        try:
            return self.body_template.format(**variables)
        except KeyError as e:
            raise ValueError(f"Missing required variable: {e}")
    
    def render_sms(self, variables: dict) -> Optional[str]:
        """Render SMS template with variables."""
        if not self.sms_template:
            return None
        try:
            return self.sms_template.format(**variables)
        except KeyError as e:
            raise ValueError(f"Missing required variable: {e}")
    
    def supports_channel(self, channel: NotificationChannel) -> bool:
        """Check if template supports given channel."""
        return channel.value in self.supported_channels


class Notification(BaseModel):
    """Individual notification record."""
    
    __tablename__ = "notifications"
    
    # Notification Content
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    sms_content = Column(String(1000), nullable=True)
    push_title = Column(String(200), nullable=True)
    push_body = Column(String(500), nullable=True)
    
    # Notification Settings
    notification_type = Column(Enum(NotificationType), nullable=False, index=True)
    channel = Column(Enum(NotificationChannel), nullable=False, index=True)
    priority = Column(
        Enum(NotificationPriority),
        default=NotificationPriority.NORMAL,
        nullable=False,
    )
    
    # Scheduling
    scheduled_at = Column(DateTime(timezone=True), nullable=True, index=True)
    sent_at = Column(DateTime(timezone=True), nullable=True, index=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    # Status
    status = Column(
        Enum(NotificationStatus),
        default=NotificationStatus.PENDING,
        nullable=False,
        index=True,
    )
    
    # Delivery Information
    recipient_email = Column(String(255), nullable=True)
    recipient_phone = Column(String(20), nullable=True)
    recipient_device_token = Column(String(500), nullable=True)
    
    # Error Handling
    error_message = Column(String(1000), nullable=True)
    retry_count = Column(Integer, default=0, nullable=False)
    max_retries = Column(Integer, default=3, nullable=False)
    
    # Metadata
    metadata = Column(JSON, nullable=True)  # Additional data for the notification
    external_id = Column(String(200), nullable=True)  # External service notification ID
    
    # Relationships
    recipient_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    template_id = Column(
        UUID(as_uuid=True),
        ForeignKey("notification_templates.id"),
        nullable=True,
        index=True,
    )
    
    recipient: "User" = relationship(
        "User",
        foreign_keys=[recipient_id],
    )
    
    template: Optional["NotificationTemplate"] = relationship(
        "NotificationTemplate",
        back_populates="notifications",
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<Notification(id={self.id}, recipient={self.recipient_id}, "
            f"type={self.notification_type.value}, status={self.status.value})>"
        )
    
    @property
    def is_pending(self) -> bool:
        """Check if notification is pending."""
        return self.status == NotificationStatus.PENDING
    
    @property
    def is_sent(self) -> bool:
        """Check if notification has been sent."""
        return self.status in [
            NotificationStatus.SENT,
            NotificationStatus.DELIVERED,
            NotificationStatus.READ,
        ]
    
    @property
    def is_read(self) -> bool:
        """Check if notification has been read."""
        return self.status == NotificationStatus.READ
    
    @property
    def can_retry(self) -> bool:
        """Check if notification can be retried."""
        return (
            self.status == NotificationStatus.FAILED
            and self.retry_count < self.max_retries
        )
    
    @property
    def is_scheduled(self) -> bool:
        """Check if notification is scheduled for later."""
        if not self.scheduled_at:
            return False
        return self.scheduled_at > datetime.utcnow()
    
    @property
    def is_due(self) -> bool:
        """Check if scheduled notification is due."""
        if not self.scheduled_at:
            return True  # No schedule means send immediately
        return self.scheduled_at <= datetime.utcnow()
    
    def mark_sent(self, external_id: str = None) -> None:
        """Mark notification as sent."""
        self.status = NotificationStatus.SENT
        self.sent_at = datetime.utcnow()
        if external_id:
            self.external_id = external_id
    
    def mark_delivered(self) -> None:
        """Mark notification as delivered."""
        self.status = NotificationStatus.DELIVERED
        self.delivered_at = datetime.utcnow()
    
    def mark_read(self) -> None:
        """Mark notification as read."""
        self.status = NotificationStatus.READ
        self.read_at = datetime.utcnow()
    
    def mark_failed(self, error_message: str) -> None:
        """Mark notification as failed."""
        self.status = NotificationStatus.FAILED
        self.error_message = error_message
        self.retry_count += 1
    
    def cancel(self) -> None:
        """Cancel the notification."""
        self.status = NotificationStatus.CANCELLED