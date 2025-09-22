"""User-related Pydantic schemas."""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, validator

from app.models.user import UserRole
from app.schemas.base import BaseResponse, BaseSchema, ContactInfo, NotificationPreferences


class UserBase(BaseSchema):
    """Base user schema with common fields."""
    
    email: EmailStr = Field(..., description="User email address")
    first_name: str = Field(..., description="First name", min_length=1, max_length=100)
    last_name: str = Field(..., description="Last name", min_length=1, max_length=100)
    phone: Optional[str] = Field(None, description="Phone number", max_length=20)
    role: UserRole = Field(..., description="User role")
    
    # Professional information (for healthcare staff)
    license_number: Optional[str] = Field(None, description="Professional license number", max_length=100)
    specialization: Optional[str] = Field(None, description="Medical specialization", max_length=200)
    years_of_experience: Optional[str] = Field(None, description="Years of experience", max_length=50)
    
    # Profile information
    bio: Optional[str] = Field(None, description="Biography/description", max_length=1000)
    timezone: str = Field("Europe/Istanbul", description="User timezone")
    language: str = Field("tr", description="Preferred language", regex="^(tr|en)$")


class UserCreate(UserBase):
    """Schema for creating a new user."""
    
    username: Optional[str] = Field(None, description="Username", min_length=3, max_length=100)
    password: str = Field(..., description="Password", min_length=8, max_length=128)
    confirm_password: str = Field(..., description="Password confirmation")
    
    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        """Validate that passwords match."""
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v
    
    @validator("username")
    def username_alphanumeric(cls, v):
        """Validate username format."""
        if v and not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Username must be alphanumeric (underscore and hyphen allowed)")
        return v


class UserUpdate(BaseSchema):
    """Schema for updating a user."""
    
    first_name: Optional[str] = Field(None, description="First name", min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, description="Last name", min_length=1, max_length=100)
    phone: Optional[str] = Field(None, description="Phone number", max_length=20)
    bio: Optional[str] = Field(None, description="Biography/description", max_length=1000)
    avatar_url: Optional[str] = Field(None, description="Avatar image URL", max_length=500)
    
    # Professional information
    license_number: Optional[str] = Field(None, description="Professional license number", max_length=100)
    specialization: Optional[str] = Field(None, description="Medical specialization", max_length=200)
    years_of_experience: Optional[str] = Field(None, description="Years of experience", max_length=50)
    
    # Settings
    timezone: Optional[str] = Field(None, description="User timezone", max_length=50)
    language: Optional[str] = Field(None, description="Preferred language", regex="^(tr|en)$")
    
    # Notification preferences
    email_notifications: Optional[bool] = Field(None, description="Email notifications enabled")
    sms_notifications: Optional[bool] = Field(None, description="SMS notifications enabled")
    push_notifications: Optional[bool] = Field(None, description="Push notifications enabled")


class UserResponse(BaseResponse):
    """Schema for user responses."""
    
    email: EmailStr
    username: Optional[str]
    first_name: str
    last_name: str
    phone: Optional[str]
    role: UserRole
    is_active: bool
    is_verified: bool
    
    # Professional information
    license_number: Optional[str]
    specialization: Optional[str]
    years_of_experience: Optional[str]
    
    # Profile information
    bio: Optional[str]
    avatar_url: Optional[str]
    timezone: str
    language: str
    
    # Notification preferences
    email_notifications: bool
    sms_notifications: bool
    push_notifications: bool
    
    @property
    def full_name(self) -> str:
        """Get user's full name."""
        return f"{self.first_name} {self.last_name}"
    
    @property
    def display_name(self) -> str:
        """Get user's display name."""
        if self.role in [UserRole.DOCTOR, UserRole.NURSE]:
            title = "Dr." if self.role == UserRole.DOCTOR else ""
            return f"{title} {self.full_name}".strip()
        return self.full_name


class UserPublic(BaseSchema):
    """Public user information (limited fields)."""
    
    id: UUID
    first_name: str
    last_name: str
    role: UserRole
    specialization: Optional[str]
    avatar_url: Optional[str]
    
    @property
    def display_name(self) -> str:
        """Get user's display name."""
        if self.role in [UserRole.DOCTOR, UserRole.NURSE]:
            title = "Dr." if self.role == UserRole.DOCTOR else ""
            return f"{title} {self.first_name} {self.last_name}".strip()
        return f"{self.first_name} {self.last_name}"


class LoginRequest(BaseSchema):
    """Login request schema."""
    
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., description="User password", min_length=1)
    remember_me: bool = Field(False, description="Remember login session")


class TokenData(BaseSchema):
    """Token data schema."""
    
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field("bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")


class LoginResponse(BaseSchema):
    """Login response schema."""
    
    user: UserResponse = Field(..., description="User information")
    tokens: TokenData = Field(..., description="Authentication tokens")
    message: str = Field("Login successful", description="Success message")


class RefreshTokenRequest(BaseSchema):
    """Refresh token request schema."""
    
    refresh_token: str = Field(..., description="Refresh token")


class TokenResponse(BaseSchema):
    """Token response schema."""
    
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field("bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")


class ChangePasswordRequest(BaseSchema):
    """Change password request schema."""
    
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., description="New password", min_length=8, max_length=128)
    confirm_password: str = Field(..., description="New password confirmation")
    
    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        """Validate that new passwords match."""
        if "new_password" in values and v != values["new_password"]:
            raise ValueError("New passwords do not match")
        return v


class PasswordResetRequest(BaseSchema):
    """Password reset request schema."""
    
    email: EmailStr = Field(..., description="User email address")


class PasswordResetConfirm(BaseSchema):
    """Password reset confirmation schema."""
    
    token: str = Field(..., description="Password reset token")
    new_password: str = Field(..., description="New password", min_length=8, max_length=128)
    confirm_password: str = Field(..., description="New password confirmation")
    
    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        """Validate that passwords match."""
        if "new_password" in values and v != values["new_password"]:
            raise ValueError("Passwords do not match")
        return v


class EmailVerificationRequest(BaseSchema):
    """Email verification request schema."""
    
    email: EmailStr = Field(..., description="User email address")


class EmailVerificationConfirm(BaseSchema):
    """Email verification confirmation schema."""
    
    token: str = Field(..., description="Email verification token")


class UserProfileUpdate(BaseSchema):
    """User profile update schema."""
    
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    bio: Optional[str] = Field(None, max_length=1000)
    timezone: Optional[str] = Field(None, max_length=50)
    language: Optional[str] = Field(None, regex="^(tr|en)$")


class UserNotificationPreferencesUpdate(NotificationPreferences):
    """User notification preferences update schema."""
    pass


class UserStatsResponse(BaseSchema):
    """User statistics response."""
    
    total_users: int = Field(..., description="Total number of users", ge=0)
    active_users: int = Field(..., description="Number of active users", ge=0)
    verified_users: int = Field(..., description="Number of verified users", ge=0)
    users_by_role: dict = Field(..., description="User count by role")
    recent_signups: int = Field(..., description="Recent signups (last 30 days)", ge=0)
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class UserActivityResponse(BaseSchema):
    """User activity response."""
    
    user_id: UUID = Field(..., description="User ID")
    last_login: Optional[datetime] = Field(None, description="Last login timestamp")
    total_logins: int = Field(..., description="Total login count", ge=0)
    last_activity: Optional[datetime] = Field(None, description="Last activity timestamp")
    is_online: bool = Field(..., description="Current online status")


class UserListResponse(BaseSchema):
    """User list response with filtering."""
    
    users: List[UserResponse] = Field(..., description="List of users")
    total: int = Field(..., description="Total number of users", ge=0)
    filters_applied: dict = Field(..., description="Applied filters")


class AdminUserUpdate(BaseSchema):
    """Admin user update schema (more privileges)."""
    
    email: Optional[EmailStr] = Field(None, description="Email address")
    role: Optional[UserRole] = Field(None, description="User role")
    is_active: Optional[bool] = Field(None, description="Active status")
    is_verified: Optional[bool] = Field(None, description="Verification status")
    
    # Professional information
    license_number: Optional[str] = Field(None, max_length=100)
    specialization: Optional[str] = Field(None, max_length=200)
    years_of_experience: Optional[str] = Field(None, max_length=50)