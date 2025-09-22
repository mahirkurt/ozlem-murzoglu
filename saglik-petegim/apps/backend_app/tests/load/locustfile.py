"""
Locust load testing configuration for Sağlık Peteğim API.

This file contains various load testing scenarios to test API performance
under different user loads and usage patterns.

Run with:
    locust -f locustfile.py --host=http://localhost:8000
    
For web UI:
    locust -f locustfile.py --host=http://localhost:8000 --web-host=0.0.0.0 --web-port=8089

For headless mode:
    locust -f locustfile.py --host=http://localhost:8000 --users=10 --spawn-rate=2 --run-time=60s --headless
"""

import random
import uuid
from datetime import datetime, timedelta
from typing import Dict, List

from locust import HttpUser, task, between, events
from locust.exception import RescheduleTask


class BaseHealthcareUser(HttpUser):
    """Base class for healthcare application users."""
    
    wait_time = between(1, 3)  # Wait 1-3 seconds between requests
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.auth_token = None
        self.user_data = None
        self.patients = []
        
    def on_start(self):
        """Called when user starts - performs login."""
        self.login()
        
    def on_stop(self):
        """Called when user stops - performs cleanup."""
        if self.auth_token:
            self.logout()
    
    def login(self):
        """Override in subclasses to implement specific login logic."""
        pass
    
    def logout(self):
        """Logout and clear auth token."""
        if self.auth_token:
            with self.client.post(
                "/api/v1/auth/logout",
                headers=self.get_auth_headers(),
                catch_response=True
            ) as response:
                if response.status_code == 200:
                    response.success()
                else:
                    response.failure(f"Logout failed: {response.status_code}")
            
            self.auth_token = None
    
    def get_auth_headers(self) -> Dict[str, str]:
        """Get authentication headers."""
        if self.auth_token:
            return {"Authorization": f"Bearer {self.auth_token}"}
        return {}


class ParentUser(BaseHealthcareUser):
    """Simulates a parent user interacting with the application."""
    
    weight = 3  # Higher weight = more common user type
    
    def login(self):
        """Login as a parent user."""
        # Try to login with test credentials
        login_data = {
            "email": f"parent{random.randint(1, 1000)}@test.com",
            "password": "testpassword123"
        }
        
        with self.client.post(
            "/api/v1/auth/login",
            json=login_data,
            catch_response=True
        ) as response:
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data["tokens"]["access_token"]
                self.user_data = data["user"]
                response.success()
                self.load_patients()
            elif response.status_code == 401:
                # User doesn't exist, try to register
                self.register_and_login()
            else:
                response.failure(f"Login failed: {response.status_code}")
                raise RescheduleTask()
    
    def register_and_login(self):
        """Register new user and login."""
        user_id = random.randint(1, 10000)
        register_data = {
            "email": f"parent{user_id}@test.com",
            "first_name": f"Parent{user_id}",
            "last_name": "TestUser",
            "password": "testpassword123",
            "confirm_password": "testpassword123",
            "role": "parent"
        }
        
        with self.client.post(
            "/api/v1/auth/register",
            json=register_data,
            catch_response=True
        ) as response:
            if response.status_code == 201:
                response.success()
                # Now login
                self.login()
            else:
                response.failure(f"Registration failed: {response.status_code}")
                raise RescheduleTask()
    
    def load_patients(self):
        """Load user's patients."""
        with self.client.get(
            "/api/v1/patients",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                self.patients = response.json().get("patients", [])
                response.success()
            else:
                response.failure(f"Failed to load patients: {response.status_code}")
    
    @task(5)
    def view_dashboard(self):
        """View main dashboard/home page."""
        with self.client.get(
            "/api/v1/dashboard",
            headers=self.get_auth_headers(),
            name="/api/v1/dashboard",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Dashboard failed: {response.status_code}")
    
    @task(3)
    def view_patients(self):
        """View patients list."""
        with self.client.get(
            "/api/v1/patients",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Patients list failed: {response.status_code}")
    
    @task(2)
    def view_appointments(self):
        """View appointments."""
        with self.client.get(
            "/api/v1/appointments",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Appointments failed: {response.status_code}")
    
    @task(2)
    def view_patient_detail(self):
        """View specific patient details."""
        if self.patients:
            patient = random.choice(self.patients)
            with self.client.get(
                f"/api/v1/patients/{patient['id']}",
                headers=self.get_auth_headers(),
                name="/api/v1/patients/[id]",
                catch_response=True
            ) as response:
                if response.status_code == 200:
                    response.success()
                else:
                    response.failure(f"Patient detail failed: {response.status_code}")
    
    @task(1)
    def create_appointment(self):
        """Create new appointment."""
        if self.patients:
            patient = random.choice(self.patients)
            appointment_data = {
                "patient_id": patient["id"],
                "doctor_id": str(uuid.uuid4()),  # Mock doctor ID
                "scheduled_at": (datetime.now() + timedelta(days=random.randint(1, 30))).isoformat(),
                "appointment_type": random.choice(["checkup", "vaccination", "consultation"]),
                "duration_minutes": random.choice([30, 45, 60]),
                "notes": "Load test appointment"
            }
            
            with self.client.post(
                "/api/v1/appointments",
                headers=self.get_auth_headers(),
                json=appointment_data,
                catch_response=True
            ) as response:
                if response.status_code == 201:
                    response.success()
                elif response.status_code == 409:
                    # Conflict is acceptable (slot already booked)
                    response.success()
                else:
                    response.failure(f"Create appointment failed: {response.status_code}")
    
    @task(1)
    def view_growth_tracking(self):
        """View growth tracking data."""
        if self.patients:
            patient = random.choice(self.patients)
            with self.client.get(
                f"/api/v1/patients/{patient['id']}/growth",
                headers=self.get_auth_headers(),
                name="/api/v1/patients/[id]/growth",
                catch_response=True
            ) as response:
                if response.status_code == 200:
                    response.success()
                else:
                    response.failure(f"Growth tracking failed: {response.status_code}")


class DoctorUser(BaseHealthcareUser):
    """Simulates a doctor user interacting with the application."""
    
    weight = 1  # Less common than parents
    
    def login(self):
        """Login as a doctor user."""
        login_data = {
            "email": f"doctor{random.randint(1, 100)}@test.com",
            "password": "testpassword123"
        }
        
        with self.client.post(
            "/api/v1/auth/login",
            json=login_data,
            catch_response=True
        ) as response:
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data["tokens"]["access_token"]
                self.user_data = data["user"]
                response.success()
            elif response.status_code == 401:
                # Doctor doesn't exist, create one
                self.register_doctor()
            else:
                response.failure(f"Doctor login failed: {response.status_code}")
                raise RescheduleTask()
    
    def register_doctor(self):
        """Register new doctor and login."""
        doctor_id = random.randint(1, 1000)
        register_data = {
            "email": f"doctor{doctor_id}@test.com",
            "first_name": f"Dr. {doctor_id}",
            "last_name": "TestDoctor",
            "password": "testpassword123",
            "confirm_password": "testpassword123",
            "role": "doctor",
            "specialization": random.choice(["Pediatrics", "Family Medicine", "Internal Medicine"]),
            "license_number": f"DOC{doctor_id:06d}"
        }
        
        with self.client.post(
            "/api/v1/auth/register",
            json=register_data,
            catch_response=True
        ) as response:
            if response.status_code == 201:
                response.success()
                self.login()
            else:
                response.failure(f"Doctor registration failed: {response.status_code}")
                raise RescheduleTask()
    
    @task(5)
    def view_schedule(self):
        """View doctor schedule."""
        with self.client.get(
            "/api/v1/appointments/schedule",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Schedule view failed: {response.status_code}")
    
    @task(3)
    def search_patients(self):
        """Search for patients."""
        search_terms = ["Test", "Patient", "Child", "John", "Jane"]
        with self.client.get(
            "/api/v1/patients/search",
            headers=self.get_auth_headers(),
            params={"query": random.choice(search_terms)},
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Patient search failed: {response.status_code}")
    
    @task(2)
    def view_medical_records(self):
        """View medical records."""
        with self.client.get(
            "/api/v1/medical-records",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Medical records failed: {response.status_code}")
    
    @task(1)
    def create_prescription(self):
        """Create prescription."""
        prescription_data = {
            "patient_id": str(uuid.uuid4()),  # Mock patient ID
            "medications": [
                {
                    "name": "Amoxicillin",
                    "dosage": "250mg",
                    "frequency": "3 times daily",
                    "duration": "7 days"
                }
            ],
            "instructions": "Take with food",
            "notes": "Load test prescription"
        }
        
        with self.client.post(
            "/api/v1/prescriptions",
            headers=self.get_auth_headers(),
            json=prescription_data,
            catch_response=True
        ) as response:
            if response.status_code in [201, 404]:  # 404 for mock patient
                response.success()
            else:
                response.failure(f"Create prescription failed: {response.status_code}")


class AdminUser(BaseHealthcareUser):
    """Simulates an admin user performing system operations."""
    
    weight = 1  # Least common user type
    
    def login(self):
        """Login as admin user."""
        login_data = {
            "email": "admin@test.com",
            "password": "adminpassword123"
        }
        
        with self.client.post(
            "/api/v1/auth/login",
            json=login_data,
            catch_response=True
        ) as response:
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data["tokens"]["access_token"]
                self.user_data = data["user"]
                response.success()
            else:
                response.failure(f"Admin login failed: {response.status_code}")
                raise RescheduleTask()
    
    @task(3)
    def view_system_stats(self):
        """View system statistics."""
        with self.client.get(
            "/api/v1/admin/stats",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"System stats failed: {response.status_code}")
    
    @task(2)
    def view_users(self):
        """View users list."""
        with self.client.get(
            "/api/v1/admin/users",
            headers=self.get_auth_headers(),
            params={"limit": 50},
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Users list failed: {response.status_code}")
    
    @task(1)
    def view_audit_logs(self):
        """View audit logs."""
        with self.client.get(
            "/api/v1/admin/audit-logs",
            headers=self.get_auth_headers(),
            params={"limit": 100},
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Audit logs failed: {response.status_code}")


# Event listeners for custom metrics
@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Called when the test starts."""
    print("Load test starting...")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Called when the test stops."""
    print("Load test completed!")
    
    # Print custom statistics
    if environment.stats.total.num_requests > 0:
        print(f"Total requests: {environment.stats.total.num_requests}")
        print(f"Total failures: {environment.stats.total.num_failures}")
        print(f"Average response time: {environment.stats.total.avg_response_time:.2f}ms")
        print(f"Max response time: {environment.stats.total.max_response_time:.2f}ms")


# Custom user classes for specific scenarios
class HighTrafficScenario(ParentUser):
    """Scenario simulating high traffic periods."""
    
    wait_time = between(0.5, 1.5)  # Faster requests
    
    @task(10)
    def rapid_dashboard_access(self):
        """Rapid dashboard access pattern."""
        self.view_dashboard()


class PeakHoursScenario(DoctorUser):
    """Scenario simulating peak clinic hours."""
    
    wait_time = between(0.1, 0.5)  # Very fast requests
    
    @task(10)
    def busy_schedule_checking(self):
        """Frequent schedule checking during busy hours."""
        self.view_schedule()


# Load testing profiles for different scenarios
class LightLoadTest(ParentUser):
    """Light load testing for development."""
    weight = 1
    wait_time = between(2, 5)


class MediumLoadTest(ParentUser):
    """Medium load testing for staging."""
    weight = 2
    wait_time = between(1, 3)


class HeavyLoadTest(ParentUser):
    """Heavy load testing for production readiness."""
    weight = 3
    wait_time = between(0.5, 2)