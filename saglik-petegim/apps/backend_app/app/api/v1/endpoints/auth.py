"""Authentication endpoints."""

from datetime import datetime, timedelta
from typing import Any

import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api.deps import get_db, get_current_user
from app.core.config import settings
from app.core.security import (
    verify_password, 
    get_password_hash,
    create_access_token, 
    create_refresh_token,
    verify_token,
    generate_verification_token,
    generate_reset_token,
    PasswordValidator,
)
from app.models.user import User, UserRole
from app.schemas.user import (
    LoginRequest, 
    LoginResponse, 
    TokenResponse, 
    RefreshTokenRequest,
    UserCreate, 
    UserResponse,
    ChangePasswordRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
    EmailVerificationRequest,
    EmailVerificationConfirm,
)
from app.utils.exceptions import (
    AuthenticationError, 
    ValidationError, 
    ConflictError,
    NotFoundError,
)

logger = structlog.get_logger()
router = APIRouter()
security = HTTPBearer()


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="User login",
    description="Authenticate user and return JWT tokens",
)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> LoginResponse:
    """
    Login endpoint to authenticate users.
    
    Args:
        login_data: Login credentials
        db: Database session
        
    Returns:
        Login response with user info and tokens
        
    Raises:
        HTTPException: If authentication fails
    """
    # Get user by email
    stmt = select(User).where(User.email == login_data.email.lower())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        logger.warning("Login failed - user not found", email=login_data.email)
        raise AuthenticationError("Invalid email or password")
    
    # Check if user is active
    if not user.is_active:
        logger.warning("Login failed - user inactive", user_id=user.id)
        raise AuthenticationError("Account is deactivated")
    
    # Verify password
    if not verify_password(login_data.password, user.hashed_password):
        logger.warning("Login failed - invalid password", user_id=user.id)
        raise AuthenticationError("Invalid email or password")
    
    # Create tokens
    token_expiry = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES * (7 if login_data.remember_me else 1)
    )
    
    access_token = create_access_token(
        subject=str(user.id),
        expires_delta=token_expiry,
    )
    refresh_token = create_refresh_token(subject=str(user.id))
    
    logger.info("User logged in successfully", user_id=user.id, email=user.email)
    
    return LoginResponse(
        user=UserResponse.model_validate(user),
        tokens={
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": int(token_expiry.total_seconds()),
        },
        message="Login successful",
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="User registration",
    description="Register a new user account",
)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """
    Register a new user.
    
    Args:
        user_data: User registration data
        db: Database session
        
    Returns:
        Created user information
        
    Raises:
        HTTPException: If registration fails
    """
    # Check if email already exists
    stmt = select(User).where(User.email == user_data.email.lower())
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        logger.warning("Registration failed - email exists", email=user_data.email)
        raise ConflictError("Email address already registered")
    
    # Check if username already exists (if provided)
    if user_data.username:
        stmt = select(User).where(User.username == user_data.username.lower())
        result = await db.execute(stmt)
        existing_username = result.scalar_one_or_none()
        
        if existing_username:
            logger.warning("Registration failed - username exists", username=user_data.username)
            raise ConflictError("Username already taken")
    
    # Validate password strength
    is_valid, errors = PasswordValidator.validate_password(user_data.password)
    if not is_valid:
        raise ValidationError("Password validation failed", details={"errors": errors})
    
    # Generate patient number for new patients
    import secrets
    patient_number = None
    if user_data.role == UserRole.PARENT:
        # Generate unique patient number
        while True:
            patient_number = f"P{secrets.randbelow(999999):06d}"
            stmt = select(User).where(User.username == patient_number)
            result = await db.execute(stmt)
            if not result.scalar_one_or_none():
                break
    
    # Create new user
    db_user = User(
        email=user_data.email.lower(),
        username=user_data.username.lower() if user_data.username else patient_number,
        hashed_password=get_password_hash(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        phone=user_data.phone,
        role=user_data.role,
        license_number=user_data.license_number,
        specialization=user_data.specialization,
        years_of_experience=user_data.years_of_experience,
        bio=user_data.bio,
        timezone=user_data.timezone,
        language=user_data.language,
        verification_token=generate_verification_token(),
        is_active=True,
        is_verified=False,  # Require email verification
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    logger.info("User registered successfully", user_id=db_user.id, email=db_user.email)
    
    # TODO: Send verification email
    
    return UserResponse.model_validate(db_user)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh access token",
    description="Get new access token using refresh token",
)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """
    Refresh access token.
    
    Args:
        refresh_data: Refresh token data
        db: Database session
        
    Returns:
        New access token
        
    Raises:
        HTTPException: If refresh token is invalid
    """
    try:
        # Verify refresh token
        user_id = verify_token(refresh_data.refresh_token, "refresh")
        
        # Get user
        stmt = select(User).where(
            User.id == user_id,
            User.is_active == True,
        )
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            raise AuthenticationError("User not found")
        
        # Create new access token
        access_token = create_access_token(subject=str(user.id))
        
        logger.info("Token refreshed successfully", user_id=user.id)
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
        
    except Exception as e:
        logger.warning("Token refresh failed", error=str(e))
        raise AuthenticationError("Invalid refresh token")


@router.post(
    "/logout",
    summary="User logout",
    description="Logout user (client should discard tokens)",
)
async def logout(
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """
    Logout current user.
    
    Note: This is primarily a client-side operation since JWTs are stateless.
    The client should discard the tokens after calling this endpoint.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Success message
    """
    logger.info("User logged out", user_id=current_user.id)
    
    # TODO: Add token blacklisting if needed
    
    return {"message": "Logout successful"}


@router.post(
    "/change-password",
    summary="Change password",
    description="Change user password",
)
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Change user password.
    
    Args:
        password_data: Password change data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If password change fails
    """
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise AuthenticationError("Current password is incorrect")
    
    # Validate new password strength
    is_valid, errors = PasswordValidator.validate_password(password_data.new_password)
    if not is_valid:
        raise ValidationError("New password validation failed", details={"errors": errors})
    
    # Update password
    current_user.hashed_password = get_password_hash(password_data.new_password)
    await db.commit()
    
    logger.info("Password changed successfully", user_id=current_user.id)
    
    return {"message": "Password changed successfully"}


@router.post(
    "/forgot-password",
    summary="Request password reset",
    description="Send password reset email",
)
async def forgot_password(
    reset_data: PasswordResetRequest,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Request password reset.
    
    Args:
        reset_data: Password reset request data
        db: Database session
        
    Returns:
        Success message (always returns success for security)
    """
    # Get user by email
    stmt = select(User).where(User.email == reset_data.email.lower())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if user and user.is_active:
        # Generate reset token
        reset_token = generate_reset_token()
        user.verification_token = reset_token  # Reuse verification_token field
        await db.commit()
        
        logger.info("Password reset requested", user_id=user.id, email=user.email)
        
        # TODO: Send password reset email
    
    # Always return success message for security (don't reveal if email exists)
    return {"message": "If the email exists, a password reset link has been sent"}


@router.post(
    "/reset-password",
    summary="Reset password",
    description="Reset password using reset token",
)
async def reset_password(
    reset_data: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Reset password using token.
    
    Args:
        reset_data: Password reset confirmation data
        db: Database session
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If reset fails
    """
    # Find user by reset token
    stmt = select(User).where(User.verification_token == reset_data.token)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise AuthenticationError("Invalid or expired reset token")
    
    # Validate new password strength
    is_valid, errors = PasswordValidator.validate_password(reset_data.new_password)
    if not is_valid:
        raise ValidationError("Password validation failed", details={"errors": errors})
    
    # Update password and clear reset token
    user.hashed_password = get_password_hash(reset_data.new_password)
    user.verification_token = None
    await db.commit()
    
    logger.info("Password reset successfully", user_id=user.id)
    
    return {"message": "Password reset successfully"}


@router.post(
    "/verify-email",
    summary="Verify email address",
    description="Verify user email using verification token",
)
async def verify_email(
    verification_data: EmailVerificationConfirm,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Verify user email address.
    
    Args:
        verification_data: Email verification data
        db: Database session
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If verification fails
    """
    # Find user by verification token
    stmt = select(User).where(User.verification_token == verification_data.token)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise AuthenticationError("Invalid or expired verification token")
    
    # Update verification status
    user.is_verified = True
    user.verification_token = None
    await db.commit()
    
    logger.info("Email verified successfully", user_id=user.id, email=user.email)
    
    return {"message": "Email verified successfully"}


@router.post(
    "/resend-verification",
    summary="Resend verification email",
    description="Resend email verification link",
)
async def resend_verification(
    verification_request: EmailVerificationRequest,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Resend email verification.
    
    Args:
        verification_request: Email verification request
        db: Database session
        
    Returns:
        Success message
    """
    # Get user by email
    stmt = select(User).where(User.email == verification_request.email.lower())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if user and not user.is_verified:
        # Generate new verification token
        verification_token = generate_verification_token()
        user.verification_token = verification_token
        await db.commit()
        
        logger.info("Verification email resent", user_id=user.id, email=user.email)
        
        # TODO: Send verification email
    
    # Always return success for security
    return {"message": "If the email exists and is unverified, a verification link has been sent"}


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
    description="Get current authenticated user information",
)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """
    Get current user information.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current user information
    """
    return UserResponse.model_validate(current_user)


@router.get(
    "/verify-token",
    summary="Verify token validity",
    description="Check if current token is valid",
)
async def verify_current_token(
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """
    Verify that the current token is valid.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Token validity information
    """
    return {
        "valid": True,
        "user_id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role.value,
        "is_verified": current_user.is_verified,
    }