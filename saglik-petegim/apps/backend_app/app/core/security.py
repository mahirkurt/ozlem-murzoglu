"""Security utilities for authentication and authorization."""

import secrets
from datetime import datetime, timedelta
from typing import Any, Optional, Union

import bcrypt
import structlog
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import ValidationError

from app.core.config import settings, jwt_settings
from app.models.user import UserRole

logger = structlog.get_logger()

# Password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Bearer token security
security = HTTPBearer()


class PasswordValidator:
    """Password validation utility."""
    
    @staticmethod
    def validate_password(password: str) -> tuple[bool, list[str]]:
        """
        Validate password strength.
        
        Args:
            password: Password to validate
            
        Returns:
            Tuple of (is_valid, list_of_errors)
        """
        errors = []
        
        # Check length
        if len(password) < settings.MIN_PASSWORD_LENGTH:
            errors.append(f"Password must be at least {settings.MIN_PASSWORD_LENGTH} characters long")
        
        # Check for uppercase
        if settings.REQUIRE_UPPERCASE and not any(c.isupper() for c in password):
            errors.append("Password must contain at least one uppercase letter")
        
        # Check for numeric
        if settings.REQUIRE_NUMERIC and not any(c.isdigit() for c in password):
            errors.append("Password must contain at least one digit")
        
        # Check for special characters
        if settings.REQUIRE_SPECIAL_CHAR:
            special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
            if not any(c in special_chars for c in password):
                errors.append("Password must contain at least one special character")
        
        # Check for common patterns
        common_patterns = ["password", "123456", "qwerty", "abc123"]
        if password.lower() in common_patterns:
            errors.append("Password is too common")
        
        return len(errors) == 0, errors


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password from database
        
    Returns:
        True if password is correct
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.warning("Password verification failed", error=str(e))
        return False


def get_password_hash(password: str) -> str:
    """
    Hash a password.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password
    """
    return pwd_context.hash(password)


def create_access_token(
    subject: Union[str, Any], 
    expires_delta: Optional[timedelta] = None,
    scopes: Optional[list[str]] = None,
) -> str:
    """
    Create a JWT access token.
    
    Args:
        subject: Subject (usually user ID)
        expires_delta: Token expiration time
        scopes: Token scopes/permissions
        
    Returns:
        JWT token string
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=jwt_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "access",
        "scopes": scopes or [],
    }
    
    encoded_jwt = jwt.encode(
        to_encode, 
        jwt_settings.SECRET_KEY, 
        algorithm=jwt_settings.ALGORITHM
    )
    
    logger.info("Access token created", subject=subject, expires_at=expire)
    return encoded_jwt


def create_refresh_token(subject: Union[str, Any]) -> str:
    """
    Create a JWT refresh token.
    
    Args:
        subject: Subject (usually user ID)
        
    Returns:
        JWT refresh token string
    """
    expire = datetime.utcnow() + timedelta(days=jwt_settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh",
    }
    
    encoded_jwt = jwt.encode(
        to_encode,
        jwt_settings.SECRET_KEY,
        algorithm=jwt_settings.ALGORITHM
    )
    
    logger.info("Refresh token created", subject=subject, expires_at=expire)
    return encoded_jwt


def verify_token(token: str, token_type: str = "access") -> Optional[str]:
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token string
        token_type: Expected token type ('access' or 'refresh')
        
    Returns:
        Subject (user ID) if token is valid, None otherwise
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token, 
            jwt_settings.SECRET_KEY, 
            algorithms=[jwt_settings.ALGORITHM]
        )
        
        # Check token type
        if payload.get("type") != token_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )
        
        # Get subject
        subject = payload.get("sub")
        if subject is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing subject",
            )
        
        logger.debug("Token verified successfully", subject=subject, type=token_type)
        return subject
        
    except JWTError as e:
        logger.warning("JWT verification failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_token_scopes(token: str) -> list[str]:
    """
    Get scopes from a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        List of token scopes
    """
    try:
        payload = jwt.decode(
            token,
            jwt_settings.SECRET_KEY,
            algorithms=[jwt_settings.ALGORITHM]
        )
        return payload.get("scopes", [])
    except JWTError:
        return []


def generate_verification_token() -> str:
    """Generate a secure verification token."""
    return secrets.token_urlsafe(32)


def generate_reset_token() -> str:
    """Generate a secure password reset token."""
    return secrets.token_urlsafe(32)


class RoleChecker:
    """Role-based access control utility."""
    
    def __init__(self, allowed_roles: list[UserRole]):
        """
        Initialize role checker.
        
        Args:
            allowed_roles: List of roles that are allowed access
        """
        self.allowed_roles = allowed_roles
    
    def __call__(self, user_role: UserRole) -> bool:
        """
        Check if user role is allowed.
        
        Args:
            user_role: User's role
            
        Returns:
            True if role is allowed
        """
        return user_role in self.allowed_roles


class PermissionChecker:
    """Permission-based access control utility."""
    
    # Role hierarchy (higher roles include lower role permissions)
    ROLE_HIERARCHY = {
        UserRole.ADMIN: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST, UserRole.PARENT],
        UserRole.DOCTOR: [UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST, UserRole.PARENT],
        UserRole.NURSE: [UserRole.NURSE, UserRole.RECEPTIONIST, UserRole.PARENT],
        UserRole.RECEPTIONIST: [UserRole.RECEPTIONIST, UserRole.PARENT],
        UserRole.PARENT: [UserRole.PARENT],
    }
    
    @classmethod
    def can_access_medical_records(cls, user_role: UserRole) -> bool:
        """Check if user can access medical records."""
        return user_role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]
    
    @classmethod
    def can_manage_users(cls, user_role: UserRole) -> bool:
        """Check if user can manage other users."""
        return user_role == UserRole.ADMIN
    
    @classmethod
    def can_manage_appointments(cls, user_role: UserRole) -> bool:
        """Check if user can manage appointments."""
        return user_role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST]
    
    @classmethod
    def can_prescribe_medication(cls, user_role: UserRole) -> bool:
        """Check if user can prescribe medication."""
        return user_role == UserRole.DOCTOR
    
    @classmethod
    def can_administer_vaccines(cls, user_role: UserRole) -> bool:
        """Check if user can administer vaccines."""
        return user_role in [UserRole.DOCTOR, UserRole.NURSE]
    
    @classmethod
    def can_view_patient_data(cls, user_role: UserRole, patient_parent_id: str, user_id: str) -> bool:
        """Check if user can view patient data."""
        # Healthcare professionals can view any patient
        if user_role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        # Receptionists can view basic patient info
        if user_role == UserRole.RECEPTIONIST:
            return True
        
        # Parents can only view their own children
        if user_role == UserRole.PARENT:
            return patient_parent_id == user_id
        
        return False
    
    @classmethod
    def can_edit_patient_data(cls, user_role: UserRole, patient_parent_id: str, user_id: str) -> bool:
        """Check if user can edit patient data."""
        # Healthcare professionals can edit any patient
        if user_role in [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE]:
            return True
        
        # Parents can edit their own children
        if user_role == UserRole.PARENT:
            return patient_parent_id == user_id
        
        return False
    
    @classmethod
    def has_role_hierarchy_access(cls, user_role: UserRole, required_role: UserRole) -> bool:
        """Check if user role has hierarchical access to required role."""
        allowed_roles = cls.ROLE_HIERARCHY.get(user_role, [])
        return required_role in allowed_roles


class SecurityHeaders:
    """Security headers for HTTP responses."""
    
    @staticmethod
    def get_security_headers() -> dict[str, str]:
        """Get recommended security headers."""
        return {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Content-Security-Policy": "default-src 'self'",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
        }


def generate_api_key() -> str:
    """Generate a secure API key."""
    return f"sk_{secrets.token_urlsafe(32)}"


def hash_api_key(api_key: str) -> str:
    """Hash an API key for storage."""
    return get_password_hash(api_key)


def verify_api_key(plain_key: str, hashed_key: str) -> bool:
    """Verify an API key against its hash."""
    return verify_password(plain_key, hashed_key)