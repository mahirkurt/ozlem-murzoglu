"""Patient management endpoints."""

from typing import List, Optional
from uuid import UUID

import structlog
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_

from app.api.deps import (
    get_db,
    get_current_verified_user,
    get_pagination_params,
    PaginationParams,
    get_accessible_patient,
    get_editable_patient,
)
from app.models.user import User, UserRole
from app.models.patient import Patient, Gender, EmergencyContact
from app.schemas.base import PaginatedResponse, SuccessResponse
from app.schemas.patient import (
    PatientResponse,
    PatientCreate,
    PatientUpdate,
    PatientSummary,
    EmergencyContactResponse,
    EmergencyContactCreate,
    EmergencyContactUpdate,
)
from app.utils.exceptions import NotFoundError, AuthorizationError

logger = structlog.get_logger()
router = APIRouter()


@router.get(
    "/",
    response_model=PaginatedResponse[PatientSummary],
    summary="List patients",
    description="List patients accessible to current user",
)
async def list_patients(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    search: Optional[str] = Query(None, description="Search by name or patient number"),
    gender: Optional[Gender] = Query(None, description="Filter by gender"),
) -> PaginatedResponse[PatientSummary]:
    """List patients accessible to current user."""
    
    # Build base query
    query = select(Patient)
    
    # Apply role-based filtering
    if current_user.role == UserRole.PARENT:
        # Parents can only see their own children
        query = query.where(Patient.parent_id == current_user.id)
    elif current_user.role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST]:
        # Healthcare staff can see all patients
        pass
    else:
        # No access for other roles
        query = query.where(False)
    
    # Apply filters
    filters = [Patient.is_active == True]
    
    if search:
        search_filter = or_(
            func.lower(Patient.first_name).contains(search.lower()),
            func.lower(Patient.last_name).contains(search.lower()),
            func.lower(Patient.patient_number).contains(search.lower()),
        )
        filters.append(search_filter)
    
    if gender:
        filters.append(Patient.gender == gender)
    
    if filters:
        query = query.where(and_(*filters))
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    count_result = await db.execute(count_query)
    total = count_result.scalar()
    
    # Apply pagination and sorting
    query = query.order_by(Patient.first_name, Patient.last_name)
    query = query.offset(pagination.offset).limit(pagination.limit)
    
    # Execute query
    result = await db.execute(query)
    patients = result.scalars().all()
    
    # Convert to response models
    patient_summaries = [PatientSummary.model_validate(patient) for patient in patients]
    
    return PaginatedResponse(
        items=patient_summaries,
        pagination=pagination.create_meta(total),
    )


@router.post(
    "/",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create patient",
    description="Create a new patient",
)
async def create_patient(
    patient_data: PatientCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> PatientResponse:
    """Create a new patient."""
    
    # Check permissions
    if current_user.role == UserRole.PARENT:
        # Parents can only create patients for themselves
        if patient_data.parent_id != current_user.id:
            raise AuthorizationError("Cannot create patient for another parent")
    elif current_user.role not in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST]:
        raise AuthorizationError("Insufficient permissions to create patients")
    
    # Generate unique patient number
    import secrets
    while True:
        patient_number = f"P{secrets.randbelow(999999):06d}"
        existing = await db.execute(
            select(Patient).where(Patient.patient_number == patient_number)
        )
        if not existing.scalar_one_or_none():
            break
    
    # Create patient
    db_patient = Patient(
        **patient_data.model_dump(exclude={"emergency_contacts"}),
        patient_number=patient_number,
    )
    
    db.add(db_patient)
    await db.flush()  # Get patient ID
    
    # Create emergency contacts if provided
    if patient_data.emergency_contacts:
        for contact_data in patient_data.emergency_contacts:
            db_contact = EmergencyContact(
                **contact_data.model_dump(),
                patient_id=db_patient.id,
            )
            db.add(db_contact)
    
    await db.commit()
    await db.refresh(db_patient)
    
    logger.info("Patient created", patient_id=db_patient.id, created_by=current_user.id)
    
    return PatientResponse.model_validate(db_patient)


@router.get(
    "/{patient_id}",
    response_model=PatientResponse,
    summary="Get patient",
    description="Get patient details by ID",
)
async def get_patient(
    patient: Patient = Depends(get_accessible_patient),
) -> PatientResponse:
    """Get patient details."""
    return PatientResponse.model_validate(patient)


@router.put(
    "/{patient_id}",
    response_model=PatientResponse,
    summary="Update patient",
    description="Update patient information",
)
async def update_patient(
    patient_update: PatientUpdate,
    patient: Patient = Depends(get_editable_patient),
    db: AsyncSession = Depends(get_db),
) -> PatientResponse:
    """Update patient information."""
    
    # Update patient fields
    update_data = patient_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(patient, field, value)
    
    await db.commit()
    await db.refresh(patient)
    
    logger.info("Patient updated", patient_id=patient.id)
    
    return PatientResponse.model_validate(patient)


@router.delete(
    "/{patient_id}",
    response_model=SuccessResponse,
    summary="Deactivate patient",
    description="Deactivate patient (soft delete)",
)
async def deactivate_patient(
    patient: Patient = Depends(get_editable_patient),
    db: AsyncSession = Depends(get_db),
) -> SuccessResponse:
    """Deactivate patient."""
    
    patient.is_active = False
    await db.commit()
    
    logger.info("Patient deactivated", patient_id=patient.id)
    
    return SuccessResponse(message="Patient deactivated successfully")


# Emergency Contacts endpoints

@router.get(
    "/{patient_id}/emergency-contacts",
    response_model=List[EmergencyContactResponse],
    summary="Get emergency contacts",
    description="Get patient's emergency contacts",
)
async def get_emergency_contacts(
    patient: Patient = Depends(get_accessible_patient),
) -> List[EmergencyContactResponse]:
    """Get patient's emergency contacts."""
    return [
        EmergencyContactResponse.model_validate(contact) 
        for contact in patient.emergency_contacts
    ]


@router.post(
    "/{patient_id}/emergency-contacts",
    response_model=EmergencyContactResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add emergency contact",
    description="Add emergency contact to patient",
)
async def add_emergency_contact(
    contact_data: EmergencyContactCreate,
    patient: Patient = Depends(get_editable_patient),
    db: AsyncSession = Depends(get_db),
) -> EmergencyContactResponse:
    """Add emergency contact to patient."""
    
    db_contact = EmergencyContact(
        **contact_data.model_dump(),
        patient_id=patient.id,
    )
    
    db.add(db_contact)
    await db.commit()
    await db.refresh(db_contact)
    
    logger.info("Emergency contact added", patient_id=patient.id, contact_id=db_contact.id)
    
    return EmergencyContactResponse.model_validate(db_contact)


@router.put(
    "/{patient_id}/emergency-contacts/{contact_id}",
    response_model=EmergencyContactResponse,
    summary="Update emergency contact",
    description="Update emergency contact information",
)
async def update_emergency_contact(
    contact_id: UUID,
    contact_update: EmergencyContactUpdate,
    patient: Patient = Depends(get_editable_patient),
    db: AsyncSession = Depends(get_db),
) -> EmergencyContactResponse:
    """Update emergency contact."""
    
    # Get emergency contact
    stmt = select(EmergencyContact).where(
        EmergencyContact.id == contact_id,
        EmergencyContact.patient_id == patient.id,
    )
    result = await db.execute(stmt)
    contact = result.scalar_one_or_none()
    
    if not contact:
        raise NotFoundError("Emergency contact not found")
    
    # Update contact fields
    update_data = contact_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(contact, field, value)
    
    await db.commit()
    await db.refresh(contact)
    
    logger.info("Emergency contact updated", contact_id=contact_id)
    
    return EmergencyContactResponse.model_validate(contact)


@router.delete(
    "/{patient_id}/emergency-contacts/{contact_id}",
    response_model=SuccessResponse,
    summary="Delete emergency contact",
    description="Delete emergency contact",
)
async def delete_emergency_contact(
    contact_id: UUID,
    patient: Patient = Depends(get_editable_patient),
    db: AsyncSession = Depends(get_db),
) -> SuccessResponse:
    """Delete emergency contact."""
    
    # Get emergency contact
    stmt = select(EmergencyContact).where(
        EmergencyContact.id == contact_id,
        EmergencyContact.patient_id == patient.id,
    )
    result = await db.execute(stmt)
    contact = result.scalar_one_or_none()
    
    if not contact:
        raise NotFoundError("Emergency contact not found")
    
    await db.delete(contact)
    await db.commit()
    
    logger.info("Emergency contact deleted", contact_id=contact_id)
    
    return SuccessResponse(message="Emergency contact deleted successfully")