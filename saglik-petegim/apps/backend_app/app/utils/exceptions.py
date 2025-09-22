"""Custom exceptions and exception handlers."""

import structlog
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import IntegrityError, DataError
from pydantic import ValidationError

logger = structlog.get_logger()


class BaseAppException(Exception):
    """Base exception for application-specific errors."""
    
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: dict = None,
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class AuthenticationError(BaseAppException):
    """Authentication related errors."""
    
    def __init__(self, message: str = "Authentication failed", details: dict = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            details=details,
        )


class AuthorizationError(BaseAppException):
    """Authorization related errors."""
    
    def __init__(self, message: str = "Access denied", details: dict = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
            details=details,
        )


class ValidationError(BaseAppException):
    """Data validation errors."""
    
    def __init__(self, message: str = "Validation failed", details: dict = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details,
        )


class NotFoundError(BaseAppException):
    """Resource not found errors."""
    
    def __init__(self, message: str = "Resource not found", details: dict = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND,
            details=details,
        )


class ConflictError(BaseAppException):
    """Resource conflict errors."""
    
    def __init__(self, message: str = "Resource conflict", details: dict = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_409_CONFLICT,
            details=details,
        )


class BusinessLogicError(BaseAppException):
    """Business logic violation errors."""
    
    def __init__(self, message: str = "Business logic error", details: dict = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details,
        )


class ExternalServiceError(BaseAppException):
    """External service integration errors."""
    
    def __init__(self, message: str = "External service error", details: dict = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_502_BAD_GATEWAY,
            details=details,
        )


class RateLimitError(BaseAppException):
    """Rate limiting errors."""
    
    def __init__(self, message: str = "Rate limit exceeded", details: dict = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            details=details,
        )


# Healthcare-specific exceptions

class PatientNotFoundError(NotFoundError):
    """Patient not found error."""
    
    def __init__(self, patient_id: str = None):
        message = "Patient not found"
        if patient_id:
            message = f"Patient with ID {patient_id} not found"
        super().__init__(message=message)


class AppointmentNotFoundError(NotFoundError):
    """Appointment not found error."""
    
    def __init__(self, appointment_id: str = None):
        message = "Appointment not found"
        if appointment_id:
            message = f"Appointment with ID {appointment_id} not found"
        super().__init__(message=message)


class AppointmentConflictError(ConflictError):
    """Appointment scheduling conflict error."""
    
    def __init__(self, message: str = "Appointment time conflict"):
        super().__init__(message=message)


class MedicalRecordNotFoundError(NotFoundError):
    """Medical record not found error."""
    
    def __init__(self, record_id: str = None):
        message = "Medical record not found"
        if record_id:
            message = f"Medical record with ID {record_id} not found"
        super().__init__(message=message)


class VaccinationScheduleError(BusinessLogicError):
    """Vaccination schedule related error."""
    
    def __init__(self, message: str = "Vaccination schedule error"):
        super().__init__(message=message)


class PrescriptionError(BusinessLogicError):
    """Prescription related error."""
    
    def __init__(self, message: str = "Prescription error"):
        super().__init__(message=message)


class FileUploadError(BaseAppException):
    """File upload related error."""
    
    def __init__(self, message: str = "File upload error", details: dict = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details,
        )


class EncryptionError(BaseAppException):
    """Data encryption/decryption error."""
    
    def __init__(self, message: str = "Encryption error"):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


def create_error_response(
    status_code: int,
    message: str,
    details: dict = None,
    request_id: str = None,
) -> dict:
    """Create standardized error response."""
    response = {
        "error": {
            "code": status_code,
            "message": message,
            "timestamp": structlog.testing.LogCapture().entries[-1]["timestamp"] if structlog.testing else None,
        }
    }
    
    if details:
        response["error"]["details"] = details
    
    if request_id:
        response["error"]["request_id"] = request_id
    
    return response


def setup_exception_handlers(app: FastAPI) -> None:
    """Setup exception handlers for the FastAPI application."""
    
    @app.exception_handler(BaseAppException)
    async def app_exception_handler(request: Request, exc: BaseAppException):
        """Handle application-specific exceptions."""
        logger.error(
            "Application exception occurred",
            error=exc.message,
            status_code=exc.status_code,
            details=exc.details,
            path=request.url.path,
            method=request.method,
        )
        
        return JSONResponse(
            status_code=exc.status_code,
            content=create_error_response(
                status_code=exc.status_code,
                message=exc.message,
                details=exc.details,
            ),
        )
    
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        """Handle HTTP exceptions."""
        logger.warning(
            "HTTP exception occurred",
            error=str(exc.detail),
            status_code=exc.status_code,
            path=request.url.path,
            method=request.method,
        )
        
        return JSONResponse(
            status_code=exc.status_code,
            content=create_error_response(
                status_code=exc.status_code,
                message=str(exc.detail),
            ),
        )
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """Handle request validation errors."""
        logger.warning(
            "Validation exception occurred",
            errors=exc.errors(),
            path=request.url.path,
            method=request.method,
        )
        
        # Format validation errors for better readability
        validation_errors = []
        for error in exc.errors():
            field = " -> ".join(str(loc) for loc in error["loc"])
            validation_errors.append({
                "field": field,
                "message": error["msg"],
                "type": error["type"],
            })
        
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=create_error_response(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message="Validation failed",
                details={"validation_errors": validation_errors},
            ),
        )
    
    @app.exception_handler(IntegrityError)
    async def database_integrity_exception_handler(request: Request, exc: IntegrityError):
        """Handle database integrity constraint errors."""
        logger.error(
            "Database integrity error occurred",
            error=str(exc.orig),
            path=request.url.path,
            method=request.method,
        )
        
        # Try to provide a user-friendly message
        error_message = "Database constraint violation"
        if "duplicate key" in str(exc.orig).lower():
            error_message = "A record with this information already exists"
        elif "foreign key" in str(exc.orig).lower():
            error_message = "Referenced record does not exist"
        elif "not null" in str(exc.orig).lower():
            error_message = "Required field is missing"
        
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content=create_error_response(
                status_code=status.HTTP_409_CONFLICT,
                message=error_message,
            ),
        )
    
    @app.exception_handler(DataError)
    async def database_data_exception_handler(request: Request, exc: DataError):
        """Handle database data errors."""
        logger.error(
            "Database data error occurred",
            error=str(exc.orig),
            path=request.url.path,
            method=request.method,
        )
        
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=create_error_response(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Invalid data format",
            ),
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """Handle unexpected exceptions."""
        logger.error(
            "Unexpected exception occurred",
            error=str(exc),
            error_type=type(exc).__name__,
            path=request.url.path,
            method=request.method,
            exc_info=True,
        )
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=create_error_response(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="An unexpected error occurred",
            ),
        )