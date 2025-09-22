"""Test configuration and fixtures."""

import asyncio
from typing import AsyncGenerator, Generator
import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool

from app.main import app
from app.core.database import get_db, Base
from app.core.config import settings
from app.models.user import User, UserRole
from app.core.security import get_password_hash


# Test database URL (use SQLite for testing)
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def test_engine():
    """Create test database engine."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        poolclass=NullPool,
        echo=False,
    )
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    
    # Drop tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create test database session."""
    async_session = async_sessionmaker(
        test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.rollback()
            await session.close()


@pytest.fixture
def client(db_session: AsyncSession) -> Generator[TestClient, None, None]:
    """Create test client with dependency overrides."""
    
    def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Clean up
    app.dependency_overrides.clear()


# User fixtures

@pytest_asyncio.fixture
async def admin_user(db_session: AsyncSession) -> User:
    """Create admin user for testing."""
    user = User(
        email="admin@test.com",
        username="admin",
        hashed_password=get_password_hash("testpassword123"),
        first_name="Admin",
        last_name="User",
        role=UserRole.ADMIN,
        is_active=True,
        is_verified=True,
    )
    
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    return user


@pytest_asyncio.fixture
async def doctor_user(db_session: AsyncSession) -> User:
    """Create doctor user for testing."""
    user = User(
        email="doctor@test.com",
        username="doctor",
        hashed_password=get_password_hash("testpassword123"),
        first_name="Dr. John",
        last_name="Smith",
        role=UserRole.DOCTOR,
        license_number="DOC123456",
        specialization="Pediatrics",
        is_active=True,
        is_verified=True,
    )
    
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    return user


@pytest_asyncio.fixture
async def parent_user(db_session: AsyncSession) -> User:
    """Create parent user for testing."""
    user = User(
        email="parent@test.com",
        username="parent",
        hashed_password=get_password_hash("testpassword123"),
        first_name="Jane",
        last_name="Doe",
        role=UserRole.PARENT,
        is_active=True,
        is_verified=True,
    )
    
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    return user


@pytest_asyncio.fixture
async def patient(db_session: AsyncSession, parent_user: User):
    """Create patient for testing."""
    from app.models.patient import Patient, Gender, BloodType
    from datetime import date
    
    patient = Patient(
        first_name="Test",
        last_name="Patient",
        date_of_birth=date(2020, 1, 1),
        gender=Gender.MALE,
        patient_number="P123456",
        blood_type=BloodType.A_POSITIVE,
        parent_id=parent_user.id,
    )
    
    db_session.add(patient)
    await db_session.commit()
    await db_session.refresh(patient)
    
    return patient


# Authentication fixtures

@pytest.fixture
def auth_headers_admin(client: TestClient, admin_user: User) -> dict:
    """Get authentication headers for admin user."""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": admin_user.email,
            "password": "testpassword123",
        }
    )
    assert response.status_code == 200
    token = response.json()["tokens"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_doctor(client: TestClient, doctor_user: User) -> dict:
    """Get authentication headers for doctor user."""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": doctor_user.email,
            "password": "testpassword123",
        }
    )
    assert response.status_code == 200
    token = response.json()["tokens"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_parent(client: TestClient, parent_user: User) -> dict:
    """Get authentication headers for parent user."""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": parent_user.email,
            "password": "testpassword123",
        }
    )
    assert response.status_code == 200
    token = response.json()["tokens"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


# Utility fixtures

@pytest.fixture
def sample_user_data() -> dict:
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "password": "testpassword123",
        "confirm_password": "testpassword123",
        "role": "parent",
    }


@pytest.fixture
def sample_patient_data(parent_user: User) -> dict:
    """Sample patient data for testing."""
    return {
        "first_name": "Test",
        "last_name": "Child",
        "date_of_birth": "2020-01-01",
        "gender": "male",
        "parent_id": str(parent_user.id),
        "blood_type": "A+",
    }


# Mock fixtures

@pytest.fixture
def mock_celery_task():
    """Mock Celery task for testing."""
    from unittest.mock import Mock
    
    mock_task = Mock()
    mock_task.delay.return_value = Mock(get=Mock(return_value={"success": True}))
    
    return mock_task


@pytest.fixture
def mock_email_service(monkeypatch):
    """Mock email service for testing."""
    from unittest.mock import Mock
    
    mock_send = Mock(return_value={"success": True})
    
    monkeypatch.setattr("app.tasks.email.send_email_task.delay", mock_send)
    
    return mock_send


# Test data cleanup

@pytest_asyncio.fixture(autouse=True)
async def cleanup_database(db_session: AsyncSession):
    """Clean up database after each test."""
    yield
    
    # Clean up any test data
    await db_session.rollback()


# Disable Celery for testing

@pytest.fixture(autouse=True)
def disable_celery(monkeypatch):
    """Disable Celery task execution during testing."""
    monkeypatch.setenv("CELERY_TASK_ALWAYS_EAGER", "true")
    
    
# Test configuration

@pytest.fixture(scope="session", autouse=True)
def test_settings():
    """Override settings for testing."""
    import os
    
    # Set test environment variables
    os.environ["ENVIRONMENT"] = "testing"
    os.environ["DATABASE_URL"] = TEST_DATABASE_URL
    os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"
    os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"
    os.environ["CELERY_TASK_ALWAYS_EAGER"] = "true"
    
    yield
    
    # Clean up environment variables
    for key in ["ENVIRONMENT", "DATABASE_URL", "SECRET_KEY", 
                "ACCESS_TOKEN_EXPIRE_MINUTES", "CELERY_TASK_ALWAYS_EAGER"]:
        os.environ.pop(key, None)