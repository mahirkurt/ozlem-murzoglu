"""Rate limiting middleware using Redis."""

import time
from typing import Callable

import structlog
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import redis

from app.core.config import settings

logger = structlog.get_logger()

# Initialize Redis connection for rate limiting
try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    # Test connection
    redis_client.ping()
    logger.info("Redis connection established for rate limiting")
except Exception as e:
    logger.warning("Redis connection failed, rate limiting disabled", error=str(e))
    redis_client = None

# Initialize limiter
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=settings.REDIS_URL if redis_client else None,
    default_limits=[f"{settings.RATE_LIMIT_CALLS}/minute"]
)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Custom rate limiting middleware with enhanced features.
    """
    
    def __init__(
        self,
        app,
        default_limit: str = None,
        skip_paths: list[str] = None,
        rate_limit_by_user: bool = True,
    ):
        """
        Initialize rate limit middleware.
        
        Args:
            app: FastAPI application
            default_limit: Default rate limit (e.g., "100/minute")
            skip_paths: Paths to skip rate limiting
            rate_limit_by_user: Whether to rate limit by user ID when authenticated
        """
        super().__init__(app)
        self.default_limit = default_limit or f"{settings.RATE_LIMIT_CALLS}/minute"
        self.skip_paths = skip_paths or ["/health", "/metrics"]
        self.rate_limit_by_user = rate_limit_by_user
        self.redis_client = redis_client
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process request with rate limiting."""
        # Skip rate limiting for certain paths
        if request.url.path in self.skip_paths:
            return await call_next(request)
        
        # Skip if Redis is not available
        if not self.redis_client:
            return await call_next(request)
        
        try:
            # Get client identifier
            client_id = self._get_client_identifier(request)
            
            # Check rate limit
            is_allowed, reset_time, remaining = await self._check_rate_limit(
                client_id, 
                request.url.path
            )
            
            if not is_allowed:
                # Rate limit exceeded
                logger.warning(
                    "Rate limit exceeded",
                    client_id=client_id,
                    path=request.url.path,
                    method=request.method,
                )
                
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "error": {
                            "code": status.HTTP_429_TOO_MANY_REQUESTS,
                            "message": "Rate limit exceeded",
                            "details": {
                                "retry_after": reset_time,
                                "remaining": remaining,
                            }
                        }
                    },
                    headers={
                        "Retry-After": str(reset_time),
                        "X-RateLimit-Remaining": str(remaining),
                        "X-RateLimit-Reset": str(reset_time),
                    }
                )
            
            # Process request
            response = await call_next(request)
            
            # Add rate limit headers
            response.headers["X-RateLimit-Remaining"] = str(remaining)
            response.headers["X-RateLimit-Reset"] = str(reset_time)
            
            return response
            
        except Exception as e:
            logger.error("Rate limiting error", error=str(e))
            # Continue without rate limiting if there's an error
            return await call_next(request)
    
    def _get_client_identifier(self, request: Request) -> str:
        """
        Get client identifier for rate limiting.
        
        Args:
            request: FastAPI request object
            
        Returns:
            Client identifier string
        """
        # Use user ID if authenticated and configured to do so
        if self.rate_limit_by_user and hasattr(request.state, "user_id"):
            return f"user:{request.state.user_id}"
        
        # Use IP address
        client_ip = self._get_client_ip(request)
        return f"ip:{client_ip}"
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address."""
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"
    
    async def _check_rate_limit(
        self, 
        client_id: str, 
        path: str
    ) -> tuple[bool, int, int]:
        """
        Check if client has exceeded rate limit.
        
        Args:
            client_id: Client identifier
            path: Request path
            
        Returns:
            Tuple of (is_allowed, reset_time, remaining_requests)
        """
        try:
            # Parse rate limit (e.g., "100/minute")
            limit_parts = self.default_limit.split("/")
            if len(limit_parts) != 2:
                return True, 0, 999  # Allow if invalid format
            
            max_requests = int(limit_parts[0])
            period = limit_parts[1].lower()
            
            # Convert period to seconds
            period_seconds = self._period_to_seconds(period)
            if period_seconds is None:
                return True, 0, 999
            
            # Redis key
            key = f"rate_limit:{client_id}:{path}"
            
            # Get current time
            now = int(time.time())
            
            # Use Redis pipeline for atomic operations
            pipe = self.redis_client.pipeline()
            
            # Remove expired entries
            pipe.zremrangebyscore(key, 0, now - period_seconds)
            
            # Count current requests
            pipe.zcard(key)
            
            # Add current request
            pipe.zadd(key, {str(now): now})
            
            # Set expiration
            pipe.expire(key, period_seconds)
            
            # Execute pipeline
            results = pipe.execute()
            
            current_count = results[1]  # Count after cleanup
            
            # Check if limit exceeded
            if current_count >= max_requests:
                # Calculate reset time
                oldest_entry = self.redis_client.zrange(key, 0, 0, withscores=True)
                if oldest_entry:
                    reset_time = int(oldest_entry[0][1]) + period_seconds - now
                else:
                    reset_time = period_seconds
                
                return False, max(reset_time, 0), 0
            
            # Calculate remaining requests and reset time
            remaining = max_requests - current_count - 1  # -1 for current request
            reset_time = period_seconds
            
            return True, reset_time, remaining
            
        except Exception as e:
            logger.error("Rate limit check failed", error=str(e))
            return True, 0, 999  # Allow on error
    
    def _period_to_seconds(self, period: str) -> int:
        """Convert period string to seconds."""
        period_map = {
            "second": 1,
            "minute": 60,
            "hour": 3600,
            "day": 86400,
        }
        
        # Handle plural forms
        if period.endswith("s"):
            period = period[:-1]
        
        return period_map.get(period)


# Rate limit decorators for specific endpoints
def rate_limit(limit: str):
    """
    Decorator for rate limiting specific endpoints.
    
    Args:
        limit: Rate limit string (e.g., "10/minute")
    """
    return limiter.limit(limit)


# Custom rate limit exceeded handler
def custom_rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """Custom handler for rate limit exceeded errors."""
    logger.warning(
        "Rate limit exceeded",
        path=request.url.path,
        method=request.method,
        client_ip=get_remote_address(request),
    )
    
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={
            "error": {
                "code": status.HTTP_429_TOO_MANY_REQUESTS,
                "message": "Rate limit exceeded",
                "details": {
                    "limit": str(exc.detail),
                    "retry_after": "60",  # Default retry after 1 minute
                }
            }
        },
        headers={"Retry-After": "60"}
    )