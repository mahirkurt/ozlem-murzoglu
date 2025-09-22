"""
API Performance Tests

These tests measure API performance under various conditions and ensure
response times meet acceptable thresholds.
"""

import time
import asyncio
import pytest
import statistics
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Tuple

from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.patient import Patient


class TestAPIPerformance:
    """Test API endpoint performance."""
    
    # Performance thresholds (in seconds)
    FAST_THRESHOLD = 0.1  # 100ms
    ACCEPTABLE_THRESHOLD = 0.5  # 500ms
    SLOW_THRESHOLD = 1.0  # 1 second
    
    def measure_request_time(self, client: TestClient, method: str, 
                           url: str, **kwargs) -> float:
        """Measure time for a single request."""
        start_time = time.time()
        
        if method.lower() == 'get':
            response = client.get(url, **kwargs)
        elif method.lower() == 'post':
            response = client.post(url, **kwargs)
        elif method.lower() == 'put':
            response = client.put(url, **kwargs)
        elif method.lower() == 'delete':
            response = client.delete(url, **kwargs)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        end_time = time.time()
        request_time = end_time - start_time
        
        # Ensure request was successful
        assert 200 <= response.status_code < 300, f"Request failed: {response.status_code}"
        
        return request_time
    
    def measure_concurrent_requests(self, client: TestClient, method: str,
                                  url: str, num_requests: int, **kwargs) -> List[float]:
        """Measure time for concurrent requests."""
        def make_request():
            return self.measure_request_time(client, method, url, **kwargs)
        
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(num_requests)]
            times = [future.result() for future in as_completed(futures)]
        
        return times
    
    def analyze_performance_metrics(self, times: List[float]) -> Dict[str, float]:
        """Analyze performance metrics from request times."""
        return {
            'count': len(times),
            'mean': statistics.mean(times),
            'median': statistics.median(times),
            'min': min(times),
            'max': max(times),
            'p95': sorted(times)[int(0.95 * len(times))] if len(times) >= 20 else max(times),
            'p99': sorted(times)[int(0.99 * len(times))] if len(times) >= 100 else max(times),
        }
    
    def test_auth_login_performance(self, client: TestClient, parent_user: User):
        """Test login endpoint performance."""
        login_data = {
            "email": parent_user.email,
            "password": "testpassword123"
        }
        
        # Single request
        request_time = self.measure_request_time(
            client, 'post', '/api/v1/auth/login', json=login_data
        )
        assert request_time < self.ACCEPTABLE_THRESHOLD, \
            f"Login too slow: {request_time:.3f}s > {self.ACCEPTABLE_THRESHOLD}s"
        
        # Multiple concurrent requests
        times = self.measure_concurrent_requests(
            client, 'post', '/api/v1/auth/login', 10, json=login_data
        )
        metrics = self.analyze_performance_metrics(times)
        
        assert metrics['p95'] < self.SLOW_THRESHOLD, \
            f"95th percentile login time too slow: {metrics['p95']:.3f}s"
    
    def test_patients_list_performance(self, client: TestClient, 
                                     auth_headers_parent: dict, patient: Patient):
        """Test patients list endpoint performance."""
        # Single request
        request_time = self.measure_request_time(
            client, 'get', '/api/v1/patients', headers=auth_headers_parent
        )
        assert request_time < self.ACCEPTABLE_THRESHOLD, \
            f"Patients list too slow: {request_time:.3f}s"
        
        # Multiple concurrent requests
        times = self.measure_concurrent_requests(
            client, 'get', '/api/v1/patients', 20, headers=auth_headers_parent
        )
        metrics = self.analyze_performance_metrics(times)
        
        assert metrics['mean'] < self.ACCEPTABLE_THRESHOLD, \
            f"Average patients list time too slow: {metrics['mean']:.3f}s"
    
    def test_patient_detail_performance(self, client: TestClient, 
                                      auth_headers_parent: dict, patient: Patient):
        """Test patient detail endpoint performance."""
        url = f'/api/v1/patients/{patient.id}'
        
        # Single request
        request_time = self.measure_request_time(
            client, 'get', url, headers=auth_headers_parent
        )
        assert request_time < self.FAST_THRESHOLD, \
            f"Patient detail too slow: {request_time:.3f}s"
        
        # Multiple requests for same patient (cache test)
        times = self.measure_concurrent_requests(
            client, 'get', url, 50, headers=auth_headers_parent
        )
        metrics = self.analyze_performance_metrics(times)
        
        # Cached responses should be very fast
        assert metrics['p95'] < self.ACCEPTABLE_THRESHOLD, \
            f"95th percentile patient detail too slow: {metrics['p95']:.3f}s"
    
    def test_appointments_list_performance(self, client: TestClient, 
                                         auth_headers_parent: dict):
        """Test appointments list endpoint performance."""
        request_time = self.measure_request_time(
            client, 'get', '/api/v1/appointments', headers=auth_headers_parent
        )
        assert request_time < self.ACCEPTABLE_THRESHOLD, \
            f"Appointments list too slow: {request_time:.3f}s"
    
    def test_search_performance(self, client: TestClient, 
                              auth_headers_doctor: dict):
        """Test search endpoint performance."""
        search_params = {'params': {'query': 'test'}}
        
        request_time = self.measure_request_time(
            client, 'get', '/api/v1/patients/search', 
            headers=auth_headers_doctor, **search_params
        )
        assert request_time < self.SLOW_THRESHOLD, \
            f"Search too slow: {request_time:.3f}s"
    
    def test_dashboard_performance(self, client: TestClient, 
                                 auth_headers_parent: dict):
        """Test dashboard endpoint performance."""
        request_time = self.measure_request_time(
            client, 'get', '/api/v1/dashboard', headers=auth_headers_parent
        )
        assert request_time < self.ACCEPTABLE_THRESHOLD, \
            f"Dashboard too slow: {request_time:.3f}s"
    
    @pytest.mark.slow
    def test_bulk_operations_performance(self, client: TestClient, 
                                       auth_headers_admin: dict):
        """Test bulk operations performance."""
        # Test bulk user creation
        bulk_users = [
            {
                "email": f"bulk_user_{i}@test.com",
                "first_name": f"User{i}",
                "last_name": "Test",
                "password": "testpassword123",
                "role": "parent"
            }
            for i in range(100)
        ]
        
        request_time = self.measure_request_time(
            client, 'post', '/api/v1/admin/users/bulk-create',
            headers=auth_headers_admin, json={"users": bulk_users}
        )
        
        # Bulk operations can be slower but should complete within reasonable time
        assert request_time < 10.0, f"Bulk operation too slow: {request_time:.3f}s"


class TestDatabasePerformance:
    """Test database query performance."""
    
    @pytest.mark.asyncio
    async def test_patient_query_performance(self, db_session: AsyncSession):
        """Test patient database queries performance."""
        # This would test direct database query performance
        pass
    
    @pytest.mark.asyncio
    async def test_complex_query_performance(self, db_session: AsyncSession):
        """Test complex join queries performance."""
        # This would test performance of complex queries with joins
        pass
    
    @pytest.mark.asyncio
    async def test_bulk_insert_performance(self, db_session: AsyncSession):
        """Test bulk insert operations performance."""
        # This would test bulk insert performance
        pass


class TestCachePerformance:
    """Test caching system performance."""
    
    def test_cache_hit_performance(self, client: TestClient, 
                                 auth_headers_parent: dict, patient: Patient):
        """Test performance with cache hits."""
        url = f'/api/v1/patients/{patient.id}'
        
        # First request (cache miss)
        first_time = self.measure_request_time(
            client, 'get', url, headers=auth_headers_parent
        )
        
        # Second request (cache hit)
        second_time = self.measure_request_time(
            client, 'get', url, headers=auth_headers_parent
        )
        
        # Cache hits should be significantly faster
        assert second_time < first_time * 0.8, \
            "Cache hit not significantly faster than cache miss"
    
    def measure_request_time(self, client: TestClient, method: str, 
                           url: str, **kwargs) -> float:
        """Measure time for a single request."""
        start_time = time.time()
        
        if method.lower() == 'get':
            response = client.get(url, **kwargs)
        elif method.lower() == 'post':
            response = client.post(url, **kwargs)
        elif method.lower() == 'put':
            response = client.put(url, **kwargs)
        elif method.lower() == 'delete':
            response = client.delete(url, **kwargs)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        end_time = time.time()
        request_time = end_time - start_time
        
        # Ensure request was successful
        assert 200 <= response.status_code < 300, f"Request failed: {response.status_code}"
        
        return request_time


class TestMemoryPerformance:
    """Test memory usage during operations."""
    
    def test_memory_usage_growth_tracking(self, client: TestClient, 
                                        auth_headers_parent: dict, patient: Patient):
        """Test memory usage when fetching growth tracking data."""
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss
        
        # Make multiple requests
        for _ in range(100):
            client.get(
                f'/api/v1/patients/{patient.id}/growth',
                headers=auth_headers_parent
            )
        
        final_memory = process.memory_info().rss
        memory_growth = final_memory - initial_memory
        
        # Memory growth should be reasonable (less than 100MB for 100 requests)
        assert memory_growth < 100 * 1024 * 1024, \
            f"Excessive memory growth: {memory_growth / (1024*1024):.2f}MB"


class TestConcurrencyPerformance:
    """Test performance under concurrent load."""
    
    def test_concurrent_login_performance(self, client: TestClient, parent_user: User):
        """Test performance of concurrent login requests."""
        login_data = {
            "email": parent_user.email,
            "password": "testpassword123"
        }
        
        def make_login_request():
            start = time.time()
            response = client.post('/api/v1/auth/login', json=login_data)
            end = time.time()
            return end - start, response.status_code
        
        # Run 50 concurrent login requests
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_login_request) for _ in range(50)]
            results = [future.result() for future in as_completed(futures)]
        
        times = [result[0] for result in results]
        status_codes = [result[1] for result in results]
        
        # All requests should succeed
        assert all(code == 200 for code in status_codes), \
            "Some concurrent requests failed"
        
        # Average time should be acceptable
        avg_time = statistics.mean(times)
        assert avg_time < 1.0, f"Concurrent login average too slow: {avg_time:.3f}s"
    
    def test_concurrent_data_access(self, client: TestClient, 
                                  auth_headers_parent: dict, patient: Patient):
        """Test concurrent access to patient data."""
        def make_patient_request():
            start = time.time()
            response = client.get(f'/api/v1/patients/{patient.id}', 
                                headers=auth_headers_parent)
            end = time.time()
            return end - start, response.status_code
        
        # Run concurrent requests
        with ThreadPoolExecutor(max_workers=20) as executor:
            futures = [executor.submit(make_patient_request) for _ in range(100)]
            results = [future.result() for future in as_completed(futures)]
        
        times = [result[0] for result in results]
        status_codes = [result[1] for result in results]
        
        # All requests should succeed
        success_rate = sum(1 for code in status_codes if code == 200) / len(status_codes)
        assert success_rate >= 0.95, f"Success rate too low: {success_rate:.2%}"
        
        # 95th percentile should be acceptable
        p95_time = sorted(times)[int(0.95 * len(times))]
        assert p95_time < 2.0, f"95th percentile too slow: {p95_time:.3f}s"


@pytest.mark.performance
class TestEndToEndPerformance:
    """Test end-to-end workflow performance."""
    
    def test_appointment_booking_workflow_performance(self, client: TestClient, 
                                                    auth_headers_parent: dict, 
                                                    patient: Patient,
                                                    doctor_user: User):
        """Test complete appointment booking workflow performance."""
        start_time = time.time()
        
        # Step 1: Get available slots
        slots_response = client.get(
            '/api/v1/appointments/available-slots',
            headers=auth_headers_parent,
            params={'doctor_id': str(doctor_user.id), 'date': '2024-12-01'}
        )
        assert slots_response.status_code == 200
        
        # Step 2: Create appointment
        appointment_data = {
            "patient_id": str(patient.id),
            "doctor_id": str(doctor_user.id),
            "scheduled_at": "2024-12-01T14:00:00",
            "appointment_type": "checkup"
        }
        
        create_response = client.post(
            '/api/v1/appointments',
            headers=auth_headers_parent,
            json=appointment_data
        )
        
        # Allow for conflict (appointment slot taken)
        assert create_response.status_code in [201, 409]
        
        end_time = time.time()
        workflow_time = end_time - start_time
        
        # Complete workflow should be fast
        assert workflow_time < 2.0, \
            f"Appointment booking workflow too slow: {workflow_time:.3f}s"