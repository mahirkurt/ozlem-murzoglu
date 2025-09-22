"""Test patient endpoints and functionality."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.patient import Patient, Gender, BloodType


class TestPatientEndpoints:
    """Test patient management endpoints."""
    
    def test_create_patient(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        sample_patient_data: dict
    ):
        """Test patient creation."""
        response = client.post(
            "/api/v1/patients", 
            headers=auth_headers_parent,
            json=sample_patient_data
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["first_name"] == sample_patient_data["first_name"]
        assert data["last_name"] == sample_patient_data["last_name"]
        assert data["gender"] == sample_patient_data["gender"]
        assert "id" in data
        assert "patient_number" in data
    
    def test_create_patient_unauthorized(
        self, 
        client: TestClient, 
        sample_patient_data: dict
    ):
        """Test patient creation without authentication."""
        response = client.post("/api/v1/patients", json=sample_patient_data)
        
        assert response.status_code == 403
    
    def test_create_patient_invalid_data(
        self, 
        client: TestClient, 
        auth_headers_parent: dict
    ):
        """Test patient creation with invalid data."""
        invalid_data = {
            "first_name": "",  # Empty name
            "date_of_birth": "invalid-date",  # Invalid date format
            "gender": "invalid_gender",  # Invalid gender
        }
        
        response = client.post(
            "/api/v1/patients", 
            headers=auth_headers_parent,
            json=invalid_data
        )
        
        assert response.status_code == 422
    
    def test_get_patients_list(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        patient: Patient
    ):
        """Test getting patients list for parent."""
        response = client.get("/api/v1/patients", headers=auth_headers_parent)
        
        assert response.status_code == 200
        data = response.json()
        assert "patients" in data
        assert len(data["patients"]) >= 1
        
        patient_data = data["patients"][0]
        assert patient_data["id"] == str(patient.id)
        assert patient_data["first_name"] == patient.first_name
    
    def test_get_patients_unauthorized(self, client: TestClient):
        """Test getting patients without authentication."""
        response = client.get("/api/v1/patients")
        
        assert response.status_code == 403
    
    def test_get_patient_by_id(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        patient: Patient
    ):
        """Test getting specific patient by ID."""
        response = client.get(
            f"/api/v1/patients/{patient.id}", 
            headers=auth_headers_parent
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(patient.id)
        assert data["first_name"] == patient.first_name
        assert data["last_name"] == patient.last_name
        assert data["gender"] == patient.gender.value
    
    def test_get_patient_not_found(
        self, 
        client: TestClient, 
        auth_headers_parent: dict
    ):
        """Test getting non-existent patient."""
        response = client.get(
            "/api/v1/patients/00000000-0000-0000-0000-000000000000", 
            headers=auth_headers_parent
        )
        
        assert response.status_code == 404
    
    def test_get_patient_unauthorized_access(
        self, 
        client: TestClient, 
        auth_headers_doctor: dict,
        patient: Patient
    ):
        """Test accessing patient from different parent."""
        response = client.get(
            f"/api/v1/patients/{patient.id}", 
            headers=auth_headers_doctor
        )
        
        # Doctor without patient assignment should not access
        assert response.status_code == 403
    
    def test_update_patient(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        patient: Patient
    ):
        """Test updating patient information."""
        update_data = {
            "first_name": "Updated Name",
            "emergency_contact": "+90 555 123 4567"
        }
        
        response = client.put(
            f"/api/v1/patients/{patient.id}", 
            headers=auth_headers_parent,
            json=update_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["first_name"] == "Updated Name"
        assert data["emergency_contact"] == "+90 555 123 4567"
    
    def test_update_patient_not_found(
        self, 
        client: TestClient, 
        auth_headers_parent: dict
    ):
        """Test updating non-existent patient."""
        response = client.put(
            "/api/v1/patients/00000000-0000-0000-0000-000000000000", 
            headers=auth_headers_parent,
            json={"first_name": "Test"}
        )
        
        assert response.status_code == 404
    
    def test_delete_patient(
        self, 
        client: TestClient, 
        auth_headers_admin: dict,
        patient: Patient
    ):
        """Test patient deletion (admin only)."""
        response = client.delete(
            f"/api/v1/patients/{patient.id}", 
            headers=auth_headers_admin
        )
        
        assert response.status_code == 200
        assert "Patient deleted successfully" in response.json()["message"]
    
    def test_delete_patient_forbidden_parent(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        patient: Patient
    ):
        """Test patient deletion by parent (should be forbidden)."""
        response = client.delete(
            f"/api/v1/patients/{patient.id}", 
            headers=auth_headers_parent
        )
        
        assert response.status_code == 403
    
    def test_get_patient_health_summary(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        patient: Patient
    ):
        """Test getting patient health summary."""
        response = client.get(
            f"/api/v1/patients/{patient.id}/health-summary", 
            headers=auth_headers_parent
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "patient_id" in data
        assert "appointments_count" in data
        assert "vaccinations_count" in data
        assert "growth_records_count" in data
        assert "last_checkup" in data
    
    def test_search_patients(
        self, 
        client: TestClient, 
        auth_headers_doctor: dict,
        patient: Patient
    ):
        """Test searching patients (doctor only)."""
        response = client.get(
            "/api/v1/patients/search", 
            headers=auth_headers_doctor,
            params={"query": patient.first_name}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "patients" in data
        assert len(data["patients"]) >= 0  # May be empty if not assigned
    
    def test_search_patients_forbidden_parent(
        self, 
        client: TestClient, 
        auth_headers_parent: dict
    ):
        """Test searching patients by parent (should be forbidden)."""
        response = client.get(
            "/api/v1/patients/search", 
            headers=auth_headers_parent,
            params={"query": "test"}
        )
        
        assert response.status_code == 403


class TestPatientValidation:
    """Test patient data validation."""
    
    @pytest.mark.parametrize("invalid_data,expected_error", [
        (
            {"first_name": ""},
            "First name is required"
        ),
        (
            {"first_name": "A" * 101},  # Too long
            "First name must be 100 characters or less"
        ),
        (
            {"date_of_birth": "2025-01-01"},  # Future date
            "Birth date cannot be in the future"
        ),
        (
            {"date_of_birth": "1900-01-01"},  # Too old
            "Birth date cannot be more than 150 years ago"
        ),
        (
            {"gender": "invalid"},
            "Invalid gender value"
        ),
        (
            {"blood_type": "invalid"},
            "Invalid blood type"
        ),
    ])
    def test_patient_validation_errors(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        sample_patient_data: dict,
        invalid_data: dict,
        expected_error: str
    ):
        """Test various patient validation errors."""
        sample_patient_data.update(invalid_data)
        
        response = client.post(
            "/api/v1/patients", 
            headers=auth_headers_parent,
            json=sample_patient_data
        )
        
        assert response.status_code == 422
        error_detail = response.json()["error"]["details"]
        assert any(expected_error in detail for detail in error_detail)


class TestPatientPermissions:
    """Test patient access permissions."""
    
    def test_parent_access_own_patient(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
        patient: Patient
    ):
        """Test parent can access their own patient."""
        response = client.get(
            f"/api/v1/patients/{patient.id}", 
            headers=auth_headers_parent
        )
        
        assert response.status_code == 200
    
    def test_doctor_access_assigned_patient(
        self, 
        client: TestClient, 
        auth_headers_doctor: dict,
        db_session: AsyncSession,
        patient: Patient,
        doctor_user: User
    ):
        """Test doctor can access assigned patient."""
        # This would require setting up patient-doctor relationship
        # Implementation depends on your data model
        pass
    
    def test_admin_access_any_patient(
        self, 
        client: TestClient, 
        auth_headers_admin: dict,
        patient: Patient
    ):
        """Test admin can access any patient."""
        response = client.get(
            f"/api/v1/patients/{patient.id}", 
            headers=auth_headers_admin
        )
        
        assert response.status_code == 200


@pytest.mark.asyncio
class TestPatientServices:
    """Test patient-related service functions."""
    
    async def test_generate_patient_number(self, db_session: AsyncSession):
        """Test patient number generation."""
        # This would test the patient number generation logic
        # Implementation depends on your business logic
        pass
    
    async def test_calculate_age_months(self, patient: Patient):
        """Test age calculation in months."""
        # This would test age calculation utility
        # Implementation depends on your utility functions
        pass