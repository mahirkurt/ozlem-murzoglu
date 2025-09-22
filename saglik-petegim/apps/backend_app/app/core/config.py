"""Application configuration using Pydantic Settings."""

from typing import Any, Dict, List, Optional, Union
from pydantic import AnyHttpUrl, BaseSettings, EmailStr, Field, validator
import secrets


class Settings(BaseSettings):
    """Application settings with validation."""
    
    # Application Settings
    APP_NAME: str = "Sağlık Peteğim API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 1
    RELOAD: bool = True

    # Database Configuration
    DATABASE_URL: str = "postgresql+asyncpg://username:password@localhost:5432/saglik_petegim"
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10
    DATABASE_ECHO: bool = False
    
    # Supabase Configuration
    SUPABASE_URL: str = Field(default="", env="SUPABASE_URL")
    SUPABASE_ANON_KEY: str = Field(default="", env="SUPABASE_ANON_KEY")
    SUPABASE_SERVICE_KEY: Optional[str] = Field(default=None, env="SUPABASE_SERVICE_KEY")
    SUPABASE_JWT_SECRET: Optional[str] = Field(default=None, env="SUPABASE_JWT_SECRET")
    USE_SUPABASE: bool = Field(default=False, env="USE_SUPABASE")

    @validator("DATABASE_URL", pre=True)
    def validate_database_url(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        """Validate database URL or use Supabase URL if configured."""
        if values.get("USE_SUPABASE") and values.get("SUPABASE_URL"):
            # Extract database URL from Supabase URL
            supabase_url = values.get("SUPABASE_URL")
            if supabase_url:
                # Convert Supabase URL to PostgreSQL connection string
                # Format: https://xxxx.supabase.co -> postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres
                project_ref = supabase_url.replace("https://", "").replace(".supabase.co", "")
                return f"postgresql+asyncpg://postgres:{{SUPABASE_DB_PASSWORD}}@db.{project_ref}.supabase.co:5432/postgres"
        if not v:
            raise ValueError("DATABASE_URL is required")
        return v

    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # Email Configuration
    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[EmailStr] = None
    EMAILS_FROM_NAME: Optional[str] = None
    EMAIL_TEMPLATES_DIR: str = "app/templates/email"

    @validator("EMAILS_FROM_NAME")
    def get_emails_from_name(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        if not v:
            return values.get("APP_NAME", "Sağlık Peteğim")
        return v

    # File Storage Configuration
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: Optional[str] = None
    S3_ENDPOINT_URL: Optional[str] = None
    USE_S3: bool = False
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 10

    # Security Configuration
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "0.0.0.0"]
    CORS_ORIGINS: List[AnyHttpUrl] = []
    CORS_CREDENTIALS: bool = True
    CORS_METHODS: List[str] = ["*"]
    CORS_HEADERS: List[str] = ["*"]

    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Rate Limiting
    RATE_LIMIT_CALLS: int = 100
    RATE_LIMIT_PERIOD: int = 60

    # Logging Configuration
    LOG_LEVEL: str = "INFO"
    STRUCTURED_LOGGING: bool = True

    # Monitoring and Observability
    SENTRY_DSN: Optional[str] = None
    PROMETHEUS_METRICS: bool = True

    # Healthcare Specific Settings
    CLINIC_NAME: str = "Sağlık Peteğim"
    CLINIC_ADDRESS: str = "İstanbul, Türkiye"
    CLINIC_PHONE: str = "+90 XXX XXX XX XX"
    CLINIC_EMAIL: EmailStr = "info@saglikpetegim.com"
    WORKING_HOURS_START: str = "09:00"
    WORKING_HOURS_END: str = "18:00"
    APPOINTMENT_DURATION_MINUTES: int = 30
    MAX_APPOINTMENTS_PER_DAY: int = 20

    # Vaccination Schedule Settings
    VACCINATION_REMINDER_DAYS: int = 7
    GROWTH_CHART_UPDATE_INTERVAL_DAYS: int = 30

    # SMS Configuration
    SMS_PROVIDER: str = "twilio"
    SMS_FROM_NUMBER: Optional[str] = None
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None

    # Encryption Settings
    ENCRYPTION_KEY: Optional[str] = None

    @validator("ENCRYPTION_KEY")
    def validate_encryption_key(cls, v: Optional[str]) -> Optional[str]:
        if v and len(v) < 32:
            raise ValueError("Encryption key must be at least 32 characters")
        return v

    # Background Task Settings
    CELERY_TIMEZONE: str = "Europe/Istanbul"
    CELERY_TASK_ALWAYS_EAGER: bool = False
    BEAT_SCHEDULE_FILE: str = "celerybeat-schedule"

    # Pagination defaults
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    # Password validation
    MIN_PASSWORD_LENGTH: int = 8
    REQUIRE_SPECIAL_CHAR: bool = True
    REQUIRE_NUMERIC: bool = True
    REQUIRE_UPPERCASE: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()


# JWT Configuration
class JWTSettings:
    """JWT token configuration."""
    
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS
    SECRET_KEY = settings.SECRET_KEY


jwt_settings = JWTSettings()