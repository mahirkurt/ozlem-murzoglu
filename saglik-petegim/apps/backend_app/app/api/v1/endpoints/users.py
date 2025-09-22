"""User management endpoints."""

from typing import List, Optional
from uuid import UUID

import structlog
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload

from app.api.deps import (
    get_db, 
    get_current_verified_user, 
    get_pagination_params,
    PaginationParams,
    require_admin,
    require_user_management,
)
from app.models.user import User, UserRole
from app.schemas.base import PaginatedResponse, SuccessResponse
from app.schemas.user import (
    UserResponse, 
    UserUpdate, 
    UserProfileUpdate,
    UserNotificationPreferencesUpdate,
    UserStatsResponse,
    AdminUserUpdate,
    UserPublic,
)
from app.utils.exceptions import NotFoundError, AuthorizationError

logger = structlog.get_logger()
router = APIRouter()


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
    description="Get current authenticated user's full profile",
)
async def get_my_profile(
    current_user: User = Depends(get_current_verified_user),
) -> UserResponse:
    """Get current user's profile."""
    return UserResponse.model_validate(current_user)


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update current user profile",
    description="Update current authenticated user's profile",
)
async def update_my_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Update current user's profile."""
    # Update user fields
    update_data = profile_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    logger.info("User profile updated", user_id=current_user.id)
    
    return UserResponse.model_validate(current_user)


@router.put(
    "/me/notifications",
    response_model=SuccessResponse,
    summary="Update notification preferences",
    description="Update current user's notification preferences",
)
async def update_notification_preferences(
    preferences: UserNotificationPreferencesUpdate,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> SuccessResponse:
    """Update notification preferences."""
    # Update notification preferences
    current_user.email_notifications = preferences.email
    current_user.sms_notifications = preferences.sms
    current_user.push_notifications = preferences.push
    
    await db.commit()
    
    logger.info("Notification preferences updated", user_id=current_user.id)
    
    return SuccessResponse(message="Notification preferences updated successfully")


@router.get(
    "/",
    response_model=PaginatedResponse[UserResponse],
    summary="List users",
    description="List users with filtering and pagination (admin only)",
)
async def list_users(
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user: User = Depends(require_user_management),
    role: Optional[UserRole] = Query(None, description="Filter by role"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    is_verified: Optional[bool] = Query(None, description="Filter by verification status"),
    search: Optional[str] = Query(None, description="Search by name or email"),
) -> PaginatedResponse[UserResponse]:
    """List users with filters and pagination."""
    # Build query
    query = select(User)
    
    # Apply filters
    filters = []
    
    if role is not None:
        filters.append(User.role == role)
    
    if is_active is not None:
        filters.append(User.is_active == is_active)
    
    if is_verified is not None:
        filters.append(User.is_verified == is_verified)
    
    if search:
        search_filter = or_(
            func.lower(User.first_name).contains(search.lower()),
            func.lower(User.last_name).contains(search.lower()),
            func.lower(User.email).contains(search.lower()),
        )
        filters.append(search_filter)
    
    if filters:
        query = query.where(and_(*filters))
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    count_result = await db.execute(count_query)
    total = count_result.scalar()
    
    # Apply pagination and sorting
    if pagination.sort_by:
        sort_column = getattr(User, pagination.sort_by, None)
        if sort_column:
            if pagination.sort_order == "desc":
                query = query.order_by(sort_column.desc())
            else:
                query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(User.created_at.desc())
    
    query = query.offset(pagination.offset).limit(pagination.limit)
    
    # Execute query
    result = await db.execute(query)
    users = result.scalars().all()
    
    # Convert to response models
    user_responses = [UserResponse.model_validate(user) for user in users]
    
    return PaginatedResponse(
        items=user_responses,
        pagination=pagination.create_meta(total),
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get user by ID",
    description="Get user information by ID (admin only)",
)
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_user_management),
) -> UserResponse:
    """Get user by ID."""
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise NotFoundError(f"User with ID {user_id} not found")
    
    return UserResponse.model_validate(user)


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update user by ID",
    description="Update user information by ID (admin only)",
)
async def update_user(
    user_id: UUID,
    user_update: AdminUserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> UserResponse:
    """Update user by ID (admin only)."""
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise NotFoundError(f"User with ID {user_id} not found")
    
    # Prevent admin from deactivating themselves
    if user.id == current_user.id and user_update.is_active is False:
        raise AuthorizationError("Cannot deactivate your own account")
    
    # Update user fields
    update_data = user_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    
    logger.info("User updated by admin", user_id=user_id, admin_id=current_user.id)
    
    return UserResponse.model_validate(user)


@router.delete(
    "/{user_id}",
    response_model=SuccessResponse,
    summary="Deactivate user",
    description="Deactivate user account (admin only)",
)
async def deactivate_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> SuccessResponse:
    """Deactivate user account."""
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise NotFoundError(f"User with ID {user_id} not found")
    
    # Prevent admin from deactivating themselves
    if user.id == current_user.id:
        raise AuthorizationError("Cannot deactivate your own account")
    
    # Deactivate user
    user.is_active = False
    await db.commit()
    
    logger.info("User deactivated by admin", user_id=user_id, admin_id=current_user.id)
    
    return SuccessResponse(message="User deactivated successfully")


@router.post(
    "/{user_id}/activate",
    response_model=SuccessResponse,
    summary="Activate user",
    description="Activate user account (admin only)",
)
async def activate_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> SuccessResponse:
    """Activate user account."""
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise NotFoundError(f"User with ID {user_id} not found")
    
    # Activate user
    user.is_active = True
    await db.commit()
    
    logger.info("User activated by admin", user_id=user_id, admin_id=current_user.id)
    
    return SuccessResponse(message="User activated successfully")


@router.get(
    "/stats/overview",
    response_model=UserStatsResponse,
    summary="Get user statistics",
    description="Get user statistics overview (admin only)",
)
async def get_user_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> UserStatsResponse:
    """Get user statistics."""
    from datetime import datetime, timedelta
    
    # Total users
    total_users_result = await db.execute(select(func.count(User.id)))
    total_users = total_users_result.scalar()
    
    # Active users
    active_users_result = await db.execute(
        select(func.count(User.id)).where(User.is_active == True)
    )
    active_users = active_users_result.scalar()
    
    # Verified users
    verified_users_result = await db.execute(
        select(func.count(User.id)).where(User.is_verified == True)
    )
    verified_users = verified_users_result.scalar()
    
    # Users by role
    users_by_role_result = await db.execute(
        select(User.role, func.count(User.id))
        .group_by(User.role)
    )
    users_by_role = {
        role.value: count for role, count in users_by_role_result.all()
    }
    
    # Recent signups (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_signups_result = await db.execute(
        select(func.count(User.id))
        .where(User.created_at >= thirty_days_ago)
    )
    recent_signups = recent_signups_result.scalar()
    
    return UserStatsResponse(
        total_users=total_users,
        active_users=active_users,
        verified_users=verified_users,
        users_by_role=users_by_role,
        recent_signups=recent_signups,
    )


@router.get(
    "/public/healthcare-staff",
    response_model=List[UserPublic],
    summary="Get healthcare staff",
    description="Get list of healthcare staff for public display",
)
async def get_healthcare_staff(
    db: AsyncSession = Depends(get_db),
    role: Optional[UserRole] = Query(None, description="Filter by role"),
) -> List[UserPublic]:
    """Get public information about healthcare staff."""
    # Build query for healthcare professionals
    healthcare_roles = [UserRole.DOCTOR, UserRole.NURSE]
    
    query = select(User).where(
        User.role.in_(healthcare_roles),
        User.is_active == True,
        User.is_verified == True,
    )
    
    if role and role in healthcare_roles:
        query = query.where(User.role == role)
    
    query = query.order_by(User.role, User.first_name)
    
    result = await db.execute(query)
    staff = result.scalars().all()
    
    return [UserPublic.model_validate(user) for user in staff]