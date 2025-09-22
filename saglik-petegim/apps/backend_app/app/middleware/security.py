"""Security middleware for headers and protection."""

import structlog
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.security import SecurityHeaders

logger = structlog.get_logger()


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers to responses."""
    
    def __init__(self, app, custom_headers: dict = None):
        """
        Initialize security headers middleware.
        
        Args:
            app: FastAPI application
            custom_headers: Additional custom headers to add
        """
        super().__init__(app)
        self.security_headers = SecurityHeaders.get_security_headers()
        if custom_headers:
            self.security_headers.update(custom_headers)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Add security headers to response."""
        response = await call_next(request)
        
        # Add security headers
        for header_name, header_value in self.security_headers.items():
            response.headers[header_name] = header_value
        
        # Add HSTS header only for HTTPS
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )
        
        return response


class IPWhitelistMiddleware(BaseHTTPMiddleware):
    """Middleware to restrict access by IP address."""
    
    def __init__(self, app, allowed_ips: list[str] = None):
        """
        Initialize IP whitelist middleware.
        
        Args:
            app: FastAPI application
            allowed_ips: List of allowed IP addresses
        """
        super().__init__(app)
        self.allowed_ips = set(allowed_ips or [])
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Check if client IP is allowed."""
        if not self.allowed_ips:
            # No restrictions if no IPs specified
            return await call_next(request)
        
        client_ip = self._get_client_ip(request)
        
        if client_ip not in self.allowed_ips:
            logger.warning(
                "IP access denied",
                client_ip=client_ip,
                path=request.url.path,
                method=request.method,
            )
            
            from fastapi.responses import JSONResponse
            from fastapi import status
            
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={
                    "error": {
                        "code": status.HTTP_403_FORBIDDEN,
                        "message": "Access denied from this IP address",
                    }
                }
            )
        
        return await call_next(request)
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address."""
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"


class RequestSizeMiddleware(BaseHTTPMiddleware):
    """Middleware to limit request body size."""
    
    def __init__(self, app, max_size_mb: int = 10):
        """
        Initialize request size middleware.
        
        Args:
            app: FastAPI application
            max_size_mb: Maximum request size in MB
        """
        super().__init__(app)
        self.max_size_bytes = max_size_mb * 1024 * 1024
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Check request body size."""
        content_length = request.headers.get("content-length")
        
        if content_length:
            try:
                size = int(content_length)
                if size > self.max_size_bytes:
                    logger.warning(
                        "Request size exceeded",
                        size_bytes=size,
                        max_size_bytes=self.max_size_bytes,
                        path=request.url.path,
                    )
                    
                    from fastapi.responses import JSONResponse
                    from fastapi import status
                    
                    return JSONResponse(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        content={
                            "error": {
                                "code": status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                                "message": f"Request size exceeds maximum allowed size of {self.max_size_bytes // (1024*1024)}MB",
                            }
                        }
                    )
            except ValueError:
                # Invalid content-length header
                pass
        
        return await call_next(request)


class AntiCSRFMiddleware(BaseHTTPMiddleware):
    """Middleware for CSRF protection."""
    
    def __init__(self, app, exempt_paths: list[str] = None):
        """
        Initialize anti-CSRF middleware.
        
        Args:
            app: FastAPI application
            exempt_paths: Paths exempt from CSRF protection
        """
        super().__init__(app)
        self.exempt_paths = exempt_paths or [
            "/docs", "/redoc", "/openapi.json", "/health", "/metrics"
        ]
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Check CSRF token for state-changing requests."""
        # Skip for exempt paths
        if request.url.path in self.exempt_paths:
            return await call_next(request)
        
        # Skip for safe methods
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return await call_next(request)
        
        # Skip for API requests with Bearer token
        auth_header = request.headers.get("authorization", "")
        if auth_header.startswith("Bearer "):
            return await call_next(request)
        
        # Check for CSRF token in headers
        csrf_token = request.headers.get("x-csrf-token")
        if not csrf_token:
            logger.warning(
                "CSRF token missing",
                path=request.url.path,
                method=request.method,
            )
            
            from fastapi.responses import JSONResponse
            from fastapi import status
            
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={
                    "error": {
                        "code": status.HTTP_403_FORBIDDEN,
                        "message": "CSRF token required",
                    }
                }
            )
        
        # TODO: Validate CSRF token against session
        # For now, just check if token exists
        
        return await call_next(request)


class SQLInjectionProtectionMiddleware(BaseHTTPMiddleware):
    """Middleware to detect potential SQL injection attempts."""
    
    def __init__(self, app):
        """Initialize SQL injection protection middleware."""
        super().__init__(app)
        
        # Common SQL injection patterns
        self.sql_patterns = [
            r"(\bunion\b.*\bselect\b)",
            r"(\bdrop\b.*\btable\b)",
            r"(\bdelete\b.*\bfrom\b)",
            r"(\binsert\b.*\binto\b)",
            r"(\bupdate\b.*\bset\b)",
            r"(\bselect\b.*\bfrom\b)",
            r"(\bor\b.*1\s*=\s*1)",
            r"(\band\b.*1\s*=\s*1)",
            r"(\bor\b.*\btrue\b)",
            r"(\bunion\b.*\ball\b)",
            r"(--\s*[^\r\n]*)",
            r"(/\*.*?\*/)",
            r"(\bexec\b|\bexecute\b)",
            r"(\bsp_\w+)",
            r"(\bxp_\w+)",
        ]
        
        import re
        self.compiled_patterns = [
            re.compile(pattern, re.IGNORECASE | re.DOTALL) 
            for pattern in self.sql_patterns
        ]
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Check for SQL injection patterns in request."""
        try:
            # Check query parameters
            for key, value in request.query_params.items():
                if self._contains_sql_injection(value):
                    logger.warning(
                        "Potential SQL injection in query params",
                        path=request.url.path,
                        parameter=key,
                        value=value[:100],  # Log first 100 chars
                    )
                    return self._create_blocked_response()
            
            # Check path parameters
            if self._contains_sql_injection(str(request.url.path)):
                logger.warning(
                    "Potential SQL injection in path",
                    path=request.url.path,
                )
                return self._create_blocked_response()
            
            return await call_next(request)
            
        except Exception as e:
            logger.error("SQL injection protection error", error=str(e))
            return await call_next(request)
    
    def _contains_sql_injection(self, text: str) -> bool:
        """Check if text contains SQL injection patterns."""
        if not text or not isinstance(text, str):
            return False
        
        for pattern in self.compiled_patterns:
            if pattern.search(text):
                return True
        
        return False
    
    def _create_blocked_response(self):
        """Create response for blocked request."""
        from fastapi.responses import JSONResponse
        from fastapi import status
        
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": {
                    "code": status.HTTP_400_BAD_REQUEST,
                    "message": "Request blocked due to security policy",
                }
            }
        )