"""API dependencies for authentication, authorization, and common functionality."""

from typing import AsyncGenerator, Optional
from uuid import UUID

import structlog
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import verify_token, PermissionChecker
from app.models.user import User, UserRole
from app.utils.exceptions import AuthenticationError, AuthorizationError, NotFoundError

logger = structlog.get_logger()

# Security dependencies
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Get current authenticated user from JWT token.
    
    Args:
        credentials: Bearer token credentials
        db: Database session
        
    Returns:
        Current user object
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    try:
        # Verify token and get user ID
        user_id = verify_token(credentials.credentials, "access")
        
        # Get user from database
        stmt = select(User).where(
            User.id == UUID(user_id),
            User.is_active == True,
        )
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            logger.warning("User not found for valid token", user_id=user_id)
            raise AuthenticationError("User not found")
        
        logger.debug("User authenticated successfully", user_id=user.id, email=user.email)
        return user
        
    except ValueError as e:
        logger.warning("Invalid user ID in token", error=str(e))
        raise AuthenticationError("Invalid token format")
    
    except Exception as e:
        logger.error("Authentication failed", error=str(e))
        raise AuthenticationError("Authentication failed")


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current active user (additional check for active status).
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current active user
        
    Raises:
        HTTPException: If user is inactive
    """
    if not current_user.is_active:
        raise AuthenticationError("Inactive user")
    
    return current_user


async def get_current_verified_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    Get current verified user.
    
    Args:
        current_user: Current active user
        
    Returns:
        Current verified user
        
    Raises:
        HTTPException: If user is not verified
    """
    if not current_user.is_verified:
        raise AuthenticationError("User email not verified")
    
    return current_user


# Role-based access control dependencies

def require_role(*allowed_roles: UserRole):
    """
    Create dependency to require specific user roles.
    
    Args:
        allowed_roles: Allowed user roles
        
    Returns:
        Dependency function
    """
    async def role_checker(
        current_user: User = Depends(get_current_verified_user),
    ) -> User:
        if current_user.role not in allowed_roles:
            logger.warning(
                "Access denied - insufficient role",
                user_id=current_user.id,
                user_role=current_user.role.value,
                required_roles=[role.value for role in allowed_roles],
            )
            raise AuthorizationError(
                f"Access denied. Required roles: {', '.join(role.value for role in allowed_roles)}"
            )
        
        return current_user
    
    return role_checker


# Specific role dependencies
require_admin = require_role(UserRole.ADMIN)
require_doctor = require_role(UserRole.DOCTOR)
require_healthcare_professional = require_role(UserRole.DOCTOR, UserRole.NURSE)
require_staff = require_role(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)


def require_permission(permission_check):
    """
    Create dependency to require specific permissions.
    
    Args:
        permission_check: Function that takes (user_role) and returns bool
        
    Returns:
        Dependency function
    """
    async def permission_checker(
        current_user: User = Depends(get_current_verified_user),
    ) -> User:
        if not permission_check(current_user.role):
            logger.warning(
                "Access denied - insufficient permissions",
                user_id=current_user.id,
                user_role=current_user.role.value,
            )
            raise AuthorizationError("Insufficient permissions")
        
        return current_user
    
    return permission_checker


# Permission-specific dependencies
require_medical_access = require_permission(PermissionChecker.can_access_medical_records)
require_user_management = require_permission(PermissionChecker.can_manage_users)
require_appointment_management = require_permission(PermissionChecker.can_manage_appointments)
require_prescription_access = require_permission(PermissionChecker.can_prescribe_medication)
require_vaccination_access = require_permission(PermissionChecker.can_administer_vaccines)


# Patient access control

async def get_accessible_patient(
    patient_id: UUID,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get patient if current user has access to it.
    
    Args:
        patient_id: Patient ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Patient object if accessible
        
    Raises:
        HTTPException: If patient not found or access denied
    """
    from app.models.patient import Patient
    
    # Get patient
    stmt = select(Patient).where(Patient.id == patient_id)
    result = await db.execute(stmt)
    patient = result.scalar_one_or_none()
    
    if not patient:
        raise NotFoundError(f"Patient with ID {patient_id} not found")
    
    # Check access permissions
    can_view = PermissionChecker.can_view_patient_data(
        current_user.role,
        str(patient.parent_id),
        str(current_user.id)
    )
    
    if not can_view:
        logger.warning(
            "Patient access denied",
            user_id=current_user.id,
            user_role=current_user.role.value,
            patient_id=patient_id,
        )
        raise AuthorizationError("Access denied to this patient")
    
    return patient


async def get_editable_patient(
    patient_id: UUID,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get patient if current user can edit it.
    
    Args:
        patient_id: Patient ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Patient object if editable
        
    Raises:
        HTTPException: If patient not found or edit access denied
    """
    from app.models.patient import Patient
    
    # Get patient
    stmt = select(Patient).where(Patient.id == patient_id)
    result = await db.execute(stmt)
    patient = result.scalar_one_or_none()
    
    if not patient:
        raise NotFoundError(f"Patient with ID {patient_id} not found")
    
    # Check edit permissions
    can_edit = PermissionChecker.can_edit_patient_data(
        current_user.role,
        str(patient.parent_id),
        str(current_user.id)
    )
    
    if not can_edit:
        logger.warning(
            "Patient edit access denied",
            user_id=current_user.id,
            user_role=current_user.role.value,
            patient_id=patient_id,
        )
        raise AuthorizationError("Edit access denied for this patient")
    
    return patient


# Pagination dependencies

class PaginationParams:
    """Pagination parameters."""
    
    def __init__(
        self,
        page: int = 1,
        size: int = 20,
        sort_by: Optional[str] = None,
        sort_order: str = "asc",
    ):
        from app.core.config import settings
        
        # Validate and constrain parameters
        self.page = max(1, page)
        self.size = min(max(1, size), settings.MAX_PAGE_SIZE)
        self.sort_by = sort_by
        self.sort_order = sort_order.lower() if sort_order.lower() in ["asc", "desc"] else "asc"
        
        # Calculate offset
        self.offset = (self.page - 1) * self.size
    
    @property
    def limit(self) -> int:
        """Get limit for database query."""
        return self.size
    
    def create_meta(self, total: int) -> dict:
        """
        Create pagination metadata.
        
        Args:
            total: Total number of items
            
        Returns:
            Pagination metadata
        """
        total_pages = (total + self.size - 1) // self.size
        
        return {
            "page": self.page,
            "size": self.size,
            "total": total,
            "total_pages": total_pages,
            "has_next": self.page < total_pages,
            "has_prev": self.page > 1,
        }


def get_pagination_params(
    page: int = 1,
    size: int = 20,
    sort_by: Optional[str] = None,
    sort_order: str = "asc",
) -> PaginationParams:
    """
    Get pagination parameters.
    
    Args:
        page: Page number (1-based)
        size: Page size
        sort_by: Field to sort by
        sort_order: Sort order (asc/desc)
        
    Returns:
        Pagination parameters
    """
    return PaginationParams(page, size, sort_by, sort_order)


# Search and filter dependencies

class SearchParams:
    """Search parameters."""
    
    def __init__(
        self,
        q: Optional[str] = None,
        status: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        **filters,
    ):
        self.query = q.strip() if q else None
        self.status = status
        self.date_from = date_from
        self.date_to = date_to
        self.filters = filters


def get_search_params(
    q: Optional[str] = None,
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
) -> SearchParams:
    """
    Get search parameters.
    
    Args:
        q: Search query
        status: Status filter
        date_from: Date range start
        date_to: Date range end
        
    Returns:
        Search parameters
    """
    return SearchParams(q, status, date_from, date_to)


# Optional authentication dependency

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    ),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """
    Get current user if authenticated, otherwise return None.
    
    Args:
        credentials: Optional bearer token credentials
        db: Database session
        
    Returns:
        Current user object or None
    """
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials, db)
    except (AuthenticationError, AuthorizationError):
        return None