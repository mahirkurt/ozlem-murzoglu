"""Pydantic schemas for API request/response validation."""

from app.schemas.base import BaseResponse, PaginationMeta, PaginatedResponse
from app.schemas.user import (
    UserBase, UserCreate, UserUpdate, UserResponse, UserPublic,
    LoginRequest, LoginResponse, TokenResponse, RefreshTokenRequest,
    ChangePasswordRequest, PasswordResetRequest, EmailVerificationRequest,
)
from app.schemas.patient import (
    PatientBase, PatientCreate, PatientUpdate, PatientResponse,
    EmergencyContactBase, EmergencyContactCreate, EmergencyContactUpdate, EmergencyContactResponse,
)
from app.schemas.appointment import (
    AppointmentBase, AppointmentCreate, AppointmentUpdate, AppointmentResponse,
    AppointmentListResponse, AppointmentStatusUpdate,
)
from app.schemas.medical_record import (
    MedicalRecordBase, MedicalRecordCreate, MedicalRecordUpdate, MedicalRecordResponse,
    MedicalDocumentBase, MedicalDocumentCreate, MedicalDocumentResponse,
    VitalSignsUpdate, PhysicalMeasurementsUpdate,
)
from app.schemas.vaccination import (
    VaccinationBase, VaccinationCreate, VaccinationUpdate, VaccinationResponse,
    VaccinationScheduleResponse, VaccinationStatusUpdate,
)
from app.schemas.growth import (
    GrowthMeasurementBase, GrowthMeasurementCreate, GrowthMeasurementUpdate, GrowthMeasurementResponse,
    GrowthChartResponse, GrowthStatsResponse,
)
from app.schemas.prescription import (
    PrescriptionBase, PrescriptionCreate, PrescriptionUpdate, PrescriptionResponse,
    PrescriptionItemBase, PrescriptionItemCreate, PrescriptionItemUpdate, PrescriptionItemResponse,
    MedicationResponse,
)
from app.schemas.notification import (
    NotificationBase, NotificationCreate, NotificationUpdate, NotificationResponse,
    NotificationPreferencesUpdate,
)

__all__ = [
    # Base schemas
    "BaseResponse",
    "PaginationMeta",
    "PaginatedResponse",
    
    # User schemas
    "UserBase",
    "UserCreate",
    "UserUpdate", 
    "UserResponse",
    "UserPublic",
    "LoginRequest",
    "LoginResponse",
    "TokenResponse",
    "RefreshTokenRequest",
    "ChangePasswordRequest",
    "PasswordResetRequest",
    "EmailVerificationRequest",
    
    # Patient schemas
    "PatientBase",
    "PatientCreate",
    "PatientUpdate",
    "PatientResponse",
    "EmergencyContactBase",
    "EmergencyContactCreate",
    "EmergencyContactUpdate",
    "EmergencyContactResponse",
    
    # Appointment schemas
    "AppointmentBase",
    "AppointmentCreate",
    "AppointmentUpdate",
    "AppointmentResponse",
    "AppointmentListResponse",
    "AppointmentStatusUpdate",
    
    # Medical record schemas
    "MedicalRecordBase",
    "MedicalRecordCreate",
    "MedicalRecordUpdate",
    "MedicalRecordResponse",
    "MedicalDocumentBase",
    "MedicalDocumentCreate",
    "MedicalDocumentResponse",
    "VitalSignsUpdate",
    "PhysicalMeasurementsUpdate",
    
    # Vaccination schemas
    "VaccinationBase",
    "VaccinationCreate",
    "VaccinationUpdate",
    "VaccinationResponse",
    "VaccinationScheduleResponse",
    "VaccinationStatusUpdate",
    
    # Growth tracking schemas
    "GrowthMeasurementBase",
    "GrowthMeasurementCreate",
    "GrowthMeasurementUpdate",
    "GrowthMeasurementResponse",
    "GrowthChartResponse",
    "GrowthStatsResponse",
    
    # Prescription schemas
    "PrescriptionBase",
    "PrescriptionCreate",
    "PrescriptionUpdate",
    "PrescriptionResponse",
    "PrescriptionItemBase",
    "PrescriptionItemCreate",
    "PrescriptionItemUpdate",
    "PrescriptionItemResponse",
    "MedicationResponse",
    
    # Notification schemas
    "NotificationBase",
    "NotificationCreate",
    "NotificationUpdate",
    "NotificationResponse",
    "NotificationPreferencesUpdate",
]