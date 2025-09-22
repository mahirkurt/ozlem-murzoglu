"""Main API router for version 1."""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    patients,
    appointments,
    medical_records,
    vaccinations,
    growth,
    prescriptions,
    notifications,
    admin,
    rag,
    bright_futures,
    screening_tools,
    milestone_tracking,
    guidance_content,
    immunization_schedule,
    risk_assessment,
)

# Create main API router
api_router = APIRouter()

# Include endpoint routers
api_router.include_router(
    auth.router, 
    prefix="/auth", 
    tags=["Authentication"],
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
)

api_router.include_router(
    patients.router,
    prefix="/patients",
    tags=["Patients"],
)

api_router.include_router(
    appointments.router,
    prefix="/appointments",
    tags=["Appointments"],
)

api_router.include_router(
    medical_records.router,
    prefix="/medical-records",
    tags=["Medical Records"],
)

api_router.include_router(
    vaccinations.router,
    prefix="/vaccinations",
    tags=["Vaccinations"],
)

api_router.include_router(
    growth.router,
    prefix="/growth",
    tags=["Growth Tracking"],
)

api_router.include_router(
    prescriptions.router,
    prefix="/prescriptions",
    tags=["Prescriptions"],
)

api_router.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["Notifications"],
)

api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["Administration"],
)

api_router.include_router(
    rag.router,
    prefix="/rag",
    tags=["Health Assistant"],
)

# Bright Futures module endpoints
api_router.include_router(
    bright_futures.router,
    prefix="/bright-futures",
    tags=["Bright Futures Visits"],
)

api_router.include_router(
    screening_tools.router,
    prefix="/screening-tools",
    tags=["Screening Tools"],
)

api_router.include_router(
    milestone_tracking.router,
    prefix="/milestones",
    tags=["Milestone Tracking"],
)

api_router.include_router(
    guidance_content.router,
    prefix="/guidance",
    tags=["Guidance Content"],
)

api_router.include_router(
    immunization_schedule.router,
    prefix="/immunizations",
    tags=["Immunization Schedule"],
)

api_router.include_router(
    risk_assessment.router,
    prefix="/risk-assessment",
    tags=["Risk Assessment"],
)