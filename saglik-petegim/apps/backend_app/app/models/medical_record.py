"""Medical record and document models."""

import enum
from typing import TYPE_CHECKING, List
from sqlalchemy import (
    Boolean, Column, DateTime, Enum, ForeignKey, 
    Integer, Numeric, String, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.user import User
    from app.models.appointment import Appointment


class DocumentType(enum.Enum):
    """Medical document type enumeration."""
    
    LAB_RESULT = "lab_result"
    IMAGING = "imaging"
    PRESCRIPTION = "prescription"
    VACCINATION_RECORD = "vaccination_record"
    GROWTH_CHART = "growth_chart"
    MEDICAL_REPORT = "medical_report"
    DISCHARGE_SUMMARY = "discharge_summary"
    REFERRAL = "referral"
    INSURANCE_DOCUMENT = "insurance_document"
    CONSENT_FORM = "consent_form"
    OTHER = "other"


class MedicalRecord(BaseModel):
    """Medical record for patient visits and examinations."""
    
    __tablename__ = "medical_records"
    
    # Visit Information
    visit_date = Column(DateTime(timezone=True), nullable=False, index=True)
    visit_type = Column(String(100), nullable=False)
    chief_complaint = Column(String(1000), nullable=True)
    
    # Vital Signs
    temperature = Column(Numeric(4, 1), nullable=True)  # Celsius
    heart_rate = Column(Integer, nullable=True)  # BPM
    respiratory_rate = Column(Integer, nullable=True)  # per minute
    blood_pressure_systolic = Column(Integer, nullable=True)  # mmHg
    blood_pressure_diastolic = Column(Integer, nullable=True)  # mmHg
    oxygen_saturation = Column(Integer, nullable=True)  # %
    
    # Physical Measurements
    weight = Column(Numeric(5, 2), nullable=True)  # kg
    height = Column(Numeric(5, 1), nullable=True)  # cm
    head_circumference = Column(Numeric(4, 1), nullable=True)  # cm
    bmi = Column(Numeric(4, 1), nullable=True)  # calculated
    
    # Clinical Notes
    history_of_present_illness = Column(Text, nullable=True)
    past_medical_history = Column(Text, nullable=True)
    family_history = Column(Text, nullable=True)
    social_history = Column(Text, nullable=True)
    review_of_systems = Column(Text, nullable=True)
    
    # Physical Examination
    general_appearance = Column(Text, nullable=True)
    physical_examination = Column(Text, nullable=True)
    
    # Assessment and Plan
    assessment = Column(Text, nullable=True)
    diagnosis_primary = Column(String(500), nullable=True)
    diagnosis_secondary = Column(Text, nullable=True)
    treatment_plan = Column(Text, nullable=True)
    medications_prescribed = Column(Text, nullable=True)
    
    # Follow-up
    follow_up_instructions = Column(Text, nullable=True)
    next_appointment_recommended = Column(Boolean, default=False)
    follow_up_period_days = Column(Integer, nullable=True)
    
    # Flags and Status
    is_confidential = Column(Boolean, default=False, nullable=False)
    requires_follow_up = Column(Boolean, default=False, nullable=False)
    is_critical = Column(Boolean, default=False, nullable=False)
    
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
    
    appointment_id = Column(
        UUID(as_uuid=True),
        ForeignKey("appointments.id"),
        nullable=True,
        index=True,
    )
    
    patient: "Patient" = relationship(
        "Patient",
        back_populates="medical_records",
        foreign_keys=[patient_id],
    )
    
    doctor: "User" = relationship(
        "User",
        foreign_keys=[doctor_id],
    )
    
    appointment: "Appointment" = relationship(
        "Appointment",
        foreign_keys=[appointment_id],
    )
    
    documents: List["MedicalDocument"] = relationship(
        "MedicalDocument",
        back_populates="medical_record",
        cascade="all, delete-orphan",
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<MedicalRecord(id={self.id}, patient={self.patient_id}, "
            f"date={self.visit_date})>"
        )
    
    @property
    def bmi_calculated(self) -> float:
        """Calculate BMI if weight and height are available."""
        if self.weight and self.height:
            height_m = float(self.height) / 100  # Convert cm to meters
            return round(float(self.weight) / (height_m ** 2), 1)
        return None
    
    @property
    def has_vital_signs(self) -> bool:
        """Check if record has any vital signs."""
        return any([
            self.temperature,
            self.heart_rate,
            self.respiratory_rate,
            self.blood_pressure_systolic,
            self.oxygen_saturation,
        ])
    
    @property
    def has_measurements(self) -> bool:
        """Check if record has physical measurements."""
        return any([
            self.weight,
            self.height,
            self.head_circumference,
        ])


class MedicalDocument(BaseModel):
    """Medical document attachments for records."""
    
    __tablename__ = "medical_documents"
    
    # File Information
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)  # bytes
    content_type = Column(String(100), nullable=False)
    
    # Document Metadata
    document_type = Column(Enum(DocumentType), nullable=False)
    title = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    
    # Security and Access
    is_encrypted = Column(Boolean, default=False, nullable=False)
    access_level = Column(String(50), default="standard", nullable=False)
    
    # Relationships
    medical_record_id = Column(
        UUID(as_uuid=True),
        ForeignKey("medical_records.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    uploaded_by_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    
    medical_record: "MedicalRecord" = relationship(
        "MedicalRecord",
        back_populates="documents",
    )
    
    uploaded_by: "User" = relationship(
        "User",
        foreign_keys=[uploaded_by_id],
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<MedicalDocument(id={self.id}, filename={self.filename}, "
            f"type={self.document_type.value})>"
        )
    
    @property
    def file_size_mb(self) -> float:
        """Get file size in MB."""
        return round(self.file_size / (1024 * 1024), 2)
    
    @property
    def is_image(self) -> bool:
        """Check if document is an image."""
        image_types = [
            "image/jpeg",
            "image/png", 
            "image/gif",
            "image/webp",
            "image/svg+xml",
        ]
        return self.content_type.lower() in image_types
    
    @property
    def is_pdf(self) -> bool:
        """Check if document is a PDF."""
        return self.content_type.lower() == "application/pdf"