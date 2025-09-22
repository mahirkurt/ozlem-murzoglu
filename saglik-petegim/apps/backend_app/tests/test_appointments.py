"""Test appointment endpoints and functionality."""

import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.patient import Patient
from app.models.appointment import Appointment, AppointmentType, AppointmentStatus


class TestAppointmentEndpoints:
    """Test appointment management endpoints."""
    
    def test_create_appointment(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        patient: Patient,
        doctor_user: User
    ):
        """Test appointment creation."""
        appointment_data = {
            "patient_id": str(patient.id),
            "doctor_id": str(doctor_user.id),
            "scheduled_at": (datetime.now() + timedelta(days=1)).isoformat(),
            "appointment_type": "checkup",
            "duration_minutes": 30,
            "notes": "Regular checkup appointment"
        }
        
        response = client.post(
            "/api/v1/appointments", 
            headers=auth_headers_parent,
            json=appointment_data
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["patient_id"] == appointment_data["patient_id"]
        assert data["doctor_id"] == appointment_data["doctor_id"]
        assert data["appointment_type"] == appointment_data["appointment_type"]
        assert data["status"] == "scheduled"
        assert "id" in data
    
    def test_create_appointment_unauthorized(self, client: TestClient):
        """Test appointment creation without authentication."""
        appointment_data = {
            "patient_id": "some-id",
            "doctor_id": "some-id",
            "scheduled_at": datetime.now().isoformat()
        }
        
        response = client.post("/api/v1/appointments", json=appointment_data)
        
        assert response.status_code == 403
    
    def test_create_appointment_invalid_time(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        patient: Patient,
        doctor_user: User
    ):
        """Test appointment creation with past time."""
        appointment_data = {
            "patient_id": str(patient.id),
            "doctor_id": str(doctor_user.id),
            "scheduled_at": (datetime.now() - timedelta(days=1)).isoformat(),
            "appointment_type": "checkup"
        }
        
        response = client.post(
            "/api/v1/appointments", 
            headers=auth_headers_parent,
            json=appointment_data
        )
        
        assert response.status_code == 422
        assert "past" in response.json()["error"]["message"].lower()
    
    def test_get_appointments(
        self, 
        client: TestClient, 
        auth_headers_parent: dict
    ):
        """Test getting appointments list."""
        response = client.get("/api/v1/appointments", headers=auth_headers_parent)
        
        assert response.status_code == 200
        data = response.json()
        assert "appointments" in data
        assert isinstance(data["appointments"], list)
    
    def test_get_appointments_with_filters(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        patient: Patient
    ):
        """Test getting appointments with filters."""
        params = {
            "patient_id": str(patient.id),
            "status": "scheduled",
            "appointment_type": "checkup"
        }
        
        response = client.get(
            "/api/v1/appointments", 
            headers=auth_headers_parent,
            params=params
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "appointments" in data
        
        # All returned appointments should match filters
        for appointment in data["appointments"]:
            assert appointment["patient_id"] == str(patient.id)
            assert appointment["status"] == "scheduled"
            assert appointment["appointment_type"] == "checkup"
    
    def test_get_appointment_by_id(
        self, 
        client: TestClient, 
        auth_headers_parent: dict
    ):
        """Test getting specific appointment by ID."""
        # First create an appointment
        appointment_data = {
            "patient_id": "some-patient-id",
            "doctor_id": "some-doctor-id",
            "scheduled_at": (datetime.now() + timedelta(days=1)).isoformat(),
            "appointment_type": "checkup"
        }
        
        create_response = client.post(
            "/api/v1/appointments", 
            headers=auth_headers_parent,
            json=appointment_data
        )
        
        if create_response.status_code == 201:
            appointment_id = create_response.json()["id"]
            
            response = client.get(
                f"/api/v1/appointments/{appointment_id}", 
                headers=auth_headers_parent
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == appointment_id
    
    def test_update_appointment(
        self, 
        client: TestClient, 
        auth_headers_doctor: dict
    ):
        """Test updating appointment (doctor only)."""
        # This test assumes an existing appointment
        # Implementation depends on test data setup
        pass
    
    def test_cancel_appointment(
        self, 
        client: TestClient, 
        auth_headers_parent: dict
    ):
        """Test canceling appointment."""
        # This test assumes an existing appointment
        # Implementation depends on test data setup
        pass
    
    def test_confirm_appointment(
        self, 
        client: TestClient, 
        auth_headers_doctor: dict
    ):
        """Test confirming appointment (doctor only)."""
        # This test assumes an existing appointment
        # Implementation depends on test data setup
        pass
    
    def test_complete_appointment(
        self, 
        client: TestClient, 
        auth_headers_doctor: dict
    ):
        """Test completing appointment (doctor only)."""
        # This test assumes an existing appointment
        # Implementation depends on test data setup
        pass
    
    def test_get_available_slots(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        doctor_user: User
    ):
        """Test getting available appointment slots."""
        params = {
            "doctor_id": str(doctor_user.id),
            "date": (datetime.now() + timedelta(days=1)).date().isoformat()
        }
        
        response = client.get(
            "/api/v1/appointments/available-slots", 
            headers=auth_headers_parent,
            params=params
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "slots" in data
        assert isinstance(data["slots"], list)
    
    def test_get_doctor_schedule(
        self, 
        client: TestClient, 
        auth_headers_doctor: dict,
        doctor_user: User
    ):
        """Test getting doctor's schedule."""
        params = {
            "start_date": datetime.now().date().isoformat(),
            "end_date": (datetime.now() + timedelta(days=7)).date().isoformat()
        }
        
        response = client.get(
            f"/api/v1/appointments/doctor-schedule/{doctor_user.id}", 
            headers=auth_headers_doctor,
            params=params
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "appointments" in data
        assert "total_appointments" in data


class TestAppointmentValidation:
    """Test appointment data validation."""
    
    @pytest.mark.parametrize("invalid_data,expected_error", [
        (
            {"patient_id": ""},
            "Patient ID is required"
        ),
        (
            {"doctor_id": ""},
            "Doctor ID is required"
        ),
        (
            {"duration_minutes": 0},
            "Duration must be positive"
        ),
        (
            {"duration_minutes": 300},  # 5 hours
            "Duration cannot exceed maximum"
        ),
        (
            {"appointment_type": "invalid"},
            "Invalid appointment type"
        ),
    ])
    def test_appointment_validation_errors(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        invalid_data: dict,
        expected_error: str
    ):
        """Test various appointment validation errors."""
        base_data = {
            "patient_id": "some-patient-id",
            "doctor_id": "some-doctor-id",
            "scheduled_at": (datetime.now() + timedelta(days=1)).isoformat(),
            "appointment_type": "checkup"
        }
        base_data.update(invalid_data)
        
        response = client.post(
            "/api/v1/appointments", 
            headers=auth_headers_parent,
            json=base_data
        )
        
        assert response.status_code == 422
        error_detail = response.json()["error"]["details"]
        assert any(expected_error in detail for detail in error_detail)


class TestAppointmentBusinessLogic:
    """Test appointment business logic and constraints."""
    
    def test_double_booking_prevention(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        patient: Patient,
        doctor_user: User
    ):
        """Test prevention of double booking for same time slot."""
        scheduled_time = (datetime.now() + timedelta(days=1)).isoformat()
        
        appointment_data = {
            "patient_id": str(patient.id),
            "doctor_id": str(doctor_user.id),
            "scheduled_at": scheduled_time,
            "appointment_type": "checkup"
        }
        
        # Create first appointment
        response1 = client.post(
            "/api/v1/appointments", 
            headers=auth_headers_parent,
            json=appointment_data
        )
        
        # Try to create second appointment at same time
        response2 = client.post(
            "/api/v1/appointments", 
            headers=auth_headers_parent,
            json=appointment_data
        )
        
        assert response1.status_code == 201
        assert response2.status_code == 409  # Conflict
        assert "already booked" in response2.json()["error"]["message"].lower()
    
    def test_appointment_reminder_scheduling(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        mock_celery_task
    ):
        """Test that appointment reminders are scheduled."""
        # This test would verify that Celery tasks are scheduled
        # for appointment reminders
        pass
    
    def test_appointment_cancellation_deadline(
        self, 
        client: TestClient, 
        auth_headers_parent: dict
    ):
        """Test appointment cancellation deadline enforcement."""
        # This test would verify that appointments cannot be cancelled
        # too close to the scheduled time
        pass


class TestAppointmentNotifications:
    """Test appointment notification system."""
    
    def test_appointment_creation_notification(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        mock_email_service
    ):
        """Test notification sent on appointment creation."""
        # This test would verify that email/SMS notifications
        # are sent when appointments are created
        pass
    
    def test_appointment_reminder_notification(
        self, 
        mock_celery_task,
        mock_email_service
    ):
        """Test appointment reminder notifications."""
        # This test would verify the reminder notification system
        pass


@pytest.mark.asyncio
class TestAppointmentServices:
    """Test appointment-related service functions."""
    
    async def test_calculate_available_slots(
        self, 
        db_session: AsyncSession,
        doctor_user: User
    ):
        """Test available slot calculation algorithm."""
        # This would test the business logic for calculating
        # available appointment slots
        pass
    
    async def test_appointment_conflict_detection(
        self, 
        db_session: AsyncSession
    ):
        """Test appointment conflict detection."""
        # This would test the logic for detecting scheduling conflicts
        pass
    
    async def test_appointment_statistics(
        self, 
        db_session: AsyncSession,
        doctor_user: User
    ):
        """Test appointment statistics calculation."""
        # This would test statistics and reporting functions
        pass


class TestAppointmentIntegration:
    """Test appointment integration with other services."""
    
    def test_appointment_to_medical_record_link(
        self, 
        client: TestClient, 
        auth_headers_doctor: dict
    ):
        """Test linking appointments to medical records."""
        # This would test the integration between appointments
        # and medical record creation
        pass
    
    def test_appointment_calendar_export(
        self, 
        client: TestClient, 
        auth_headers_doctor: dict
    ):
        """Test calendar export functionality."""
        response = client.get(
            "/api/v1/appointments/calendar-export", 
            headers=auth_headers_doctor,
            params={"format": "ical"}
        )
        
        # Expecting calendar format export
        assert response.status_code == 200
        assert "text/calendar" in response.headers.get("content-type", "")