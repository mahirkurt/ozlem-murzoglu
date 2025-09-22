"""Base Pydantic schemas for common functionality."""

from datetime import datetime
from typing import Any, Generic, List, Optional, TypeVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

# Generic type for paginated responses
T = TypeVar("T")


class BaseSchema(BaseModel):
    """Base schema with common configuration."""
    
    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True,
        arbitrary_types_allowed=True,
        str_strip_whitespace=True,
    )


class TimestampMixin(BaseSchema):
    """Mixin for timestamp fields."""
    
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")


class UUIDMixin(BaseSchema):
    """Mixin for UUID identifier."""
    
    id: UUID = Field(..., description="Unique identifier")


class BaseResponse(UUIDMixin, TimestampMixin):
    """Base response schema with ID and timestamps."""
    pass


class SuccessResponse(BaseSchema):
    """Generic success response."""
    
    success: bool = Field(True, description="Operation success status")
    message: str = Field(..., description="Success message")
    data: Optional[dict] = Field(None, description="Additional data")


class ErrorDetail(BaseSchema):
    """Error detail schema."""
    
    code: int = Field(..., description="Error code")
    message: str = Field(..., description="Error message")
    field: Optional[str] = Field(None, description="Field that caused the error")


class ErrorResponse(BaseSchema):
    """Error response schema."""
    
    success: bool = Field(False, description="Operation success status")
    error: ErrorDetail = Field(..., description="Error details")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")


class PaginationMeta(BaseSchema):
    """Pagination metadata."""
    
    page: int = Field(..., description="Current page number", ge=1)
    size: int = Field(..., description="Page size", ge=1, le=100)
    total: int = Field(..., description="Total number of items", ge=0)
    total_pages: int = Field(..., description="Total number of pages", ge=0)
    has_next: bool = Field(..., description="Whether there is a next page")
    has_prev: bool = Field(..., description="Whether there is a previous page")
    
    @classmethod
    def create(cls, page: int, size: int, total: int) -> "PaginationMeta":
        """Create pagination metadata."""
        total_pages = (total + size - 1) // size if total > 0 else 0
        
        return cls(
            page=page,
            size=size,
            total=total,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1,
        )


class PaginatedResponse(BaseSchema, Generic[T]):
    """Generic paginated response."""
    
    items: List[T] = Field(..., description="List of items")
    pagination: PaginationMeta = Field(..., description="Pagination metadata")


class HealthCheckResponse(BaseSchema):
    """Health check response schema."""
    
    status: str = Field(..., description="Health status")
    service: str = Field(..., description="Service name") 
    version: str = Field(..., description="Service version")
    environment: str = Field(..., description="Environment")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Health check timestamp")
    database: str = Field(..., description="Database connection status")
    dependencies: Optional[dict] = Field(None, description="Dependency statuses")


class FileUploadResponse(BaseSchema):
    """File upload response schema."""
    
    file_id: UUID = Field(..., description="Uploaded file ID")
    filename: str = Field(..., description="Original filename")
    content_type: str = Field(..., description="File content type")
    size: int = Field(..., description="File size in bytes")
    url: Optional[str] = Field(None, description="File access URL")


class BulkOperationResponse(BaseSchema):
    """Bulk operation response schema."""
    
    total: int = Field(..., description="Total items processed", ge=0)
    successful: int = Field(..., description="Successfully processed items", ge=0)
    failed: int = Field(..., description="Failed items", ge=0)
    errors: List[dict] = Field(default_factory=list, description="List of errors")
    
    @property
    def success_rate(self) -> float:
        """Calculate success rate."""
        return (self.successful / self.total * 100) if self.total > 0 else 0.0


class StatisticsResponse(BaseSchema):
    """Statistics response schema."""
    
    period: str = Field(..., description="Statistics period")
    total_count: int = Field(..., description="Total count", ge=0)
    data: dict = Field(..., description="Statistics data")
    generated_at: datetime = Field(default_factory=datetime.utcnow, description="Generation timestamp")


class SearchRequest(BaseSchema):
    """Search request schema."""
    
    query: Optional[str] = Field(None, description="Search query", max_length=500)
    filters: Optional[dict] = Field(None, description="Search filters")
    sort_by: Optional[str] = Field(None, description="Sort field", max_length=100)
    sort_order: Optional[str] = Field("asc", description="Sort order", regex="^(asc|desc)$")
    
    
class DateRangeFilter(BaseSchema):
    """Date range filter schema."""
    
    start_date: Optional[datetime] = Field(None, description="Start date")
    end_date: Optional[datetime] = Field(None, description="End date")
    
    def validate_date_range(self) -> "DateRangeFilter":
        """Validate that start_date is before end_date."""
        if (
            self.start_date 
            and self.end_date 
            and self.start_date > self.end_date
        ):
            raise ValueError("start_date must be before end_date")
        return self


class ContactInfo(BaseSchema):
    """Contact information schema."""
    
    phone: Optional[str] = Field(None, description="Phone number", max_length=20)
    email: Optional[str] = Field(None, description="Email address", max_length=255)
    address: Optional[str] = Field(None, description="Physical address", max_length=500)
    city: Optional[str] = Field(None, description="City", max_length=100)
    postal_code: Optional[str] = Field(None, description="Postal code", max_length=20)


class AuditInfo(BaseSchema):
    """Audit information schema."""
    
    created_by: Optional[UUID] = Field(None, description="Created by user ID")
    updated_by: Optional[UUID] = Field(None, description="Updated by user ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")


class ValidationError(BaseSchema):
    """Validation error schema."""
    
    field: str = Field(..., description="Field name")
    message: str = Field(..., description="Validation error message")
    value: Any = Field(None, description="Invalid value")


class BatchRequest(BaseSchema, Generic[T]):
    """Generic batch request schema."""
    
    items: List[T] = Field(..., description="Items to process", min_items=1, max_items=100)
    options: Optional[dict] = Field(None, description="Batch processing options")


class ExportRequest(BaseSchema):
    """Data export request schema."""
    
    format: str = Field(..., description="Export format", regex="^(csv|xlsx|pdf|json)$")
    filters: Optional[dict] = Field(None, description="Export filters")
    fields: Optional[List[str]] = Field(None, description="Fields to include")
    date_range: Optional[DateRangeFilter] = Field(None, description="Date range filter")


class ImportRequest(BaseSchema):
    """Data import request schema."""
    
    file_id: UUID = Field(..., description="Uploaded file ID")
    format: str = Field(..., description="File format", regex="^(csv|xlsx|json)$")
    options: Optional[dict] = Field(None, description="Import options")
    validate_only: bool = Field(False, description="Only validate without importing")


class NotificationPreferences(BaseSchema):
    """Notification preferences schema."""
    
    email: bool = Field(True, description="Email notifications enabled")
    sms: bool = Field(True, description="SMS notifications enabled") 
    push: bool = Field(True, description="Push notifications enabled")
    in_app: bool = Field(True, description="In-app notifications enabled")