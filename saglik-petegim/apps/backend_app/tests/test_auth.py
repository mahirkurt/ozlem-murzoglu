"""Test authentication endpoints."""

import pytest
from fastapi.testclient import TestClient

from app.models.user import User


class TestAuthEndpoints:
    """Test authentication endpoint functionality."""
    
    def test_register_user(self, client: TestClient, sample_user_data: dict):
        """Test user registration."""
        response = client.post("/api/v1/auth/register", json=sample_user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == sample_user_data["email"]
        assert data["first_name"] == sample_user_data["first_name"]
        assert data["role"] == sample_user_data["role"]
        assert "id" in data
        assert "hashed_password" not in data
    
    def test_register_duplicate_email(
        self, 
        client: TestClient, 
        sample_user_data: dict,
        parent_user: User
    ):
        """Test registration with duplicate email."""
        sample_user_data["email"] = parent_user.email
        
        response = client.post("/api/v1/auth/register", json=sample_user_data)
        
        assert response.status_code == 409
        assert "already registered" in response.json()["error"]["message"]
    
    def test_register_password_mismatch(
        self, 
        client: TestClient, 
        sample_user_data: dict
    ):
        """Test registration with password mismatch."""
        sample_user_data["confirm_password"] = "different_password"
        
        response = client.post("/api/v1/auth/register", json=sample_user_data)
        
        assert response.status_code == 422
    
    def test_login_success(self, client: TestClient, parent_user: User):
        """Test successful login."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": parent_user.email,
                "password": "testpassword123",
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert "tokens" in data
        assert data["user"]["email"] == parent_user.email
        assert "access_token" in data["tokens"]
        assert "refresh_token" in data["tokens"]
    
    def test_login_invalid_email(self, client: TestClient):
        """Test login with invalid email."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "nonexistent@test.com",
                "password": "testpassword123",
            }
        )
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["error"]["message"]
    
    def test_login_invalid_password(self, client: TestClient, parent_user: User):
        """Test login with invalid password."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": parent_user.email,
                "password": "wrongpassword",
            }
        )
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["error"]["message"]
    
    def test_refresh_token(self, client: TestClient, parent_user: User):
        """Test token refresh."""
        # Login first
        login_response = client.post(
            "/api/v1/auth/login",
            json={
                "email": parent_user.email,
                "password": "testpassword123",
            }
        )
        refresh_token = login_response.json()["tokens"]["refresh_token"]
        
        # Refresh token
        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert "expires_in" in data
    
    def test_get_current_user(
        self, 
        client: TestClient, 
        parent_user: User,
        auth_headers_parent: dict,
    ):
        """Test getting current user information."""
        response = client.get("/api/v1/auth/me", headers=auth_headers_parent)
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == parent_user.email
        assert data["id"] == str(parent_user.id)
    
    def test_get_current_user_unauthorized(self, client: TestClient):
        """Test getting current user without authentication."""
        response = client.get("/api/v1/auth/me")
        
        assert response.status_code == 403
    
    def test_logout(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
    ):
        """Test user logout."""
        response = client.post("/api/v1/auth/logout", headers=auth_headers_parent)
        
        assert response.status_code == 200
        assert "Logout successful" in response.json()["message"]
    
    def test_change_password(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
    ):
        """Test password change."""
        response = client.post(
            "/api/v1/auth/change-password",
            headers=auth_headers_parent,
            json={
                "current_password": "testpassword123",
                "new_password": "newpassword123",
                "confirm_password": "newpassword123",
            }
        )
        
        assert response.status_code == 200
        assert "Password changed successfully" in response.json()["message"]
    
    def test_change_password_wrong_current(
        self, 
        client: TestClient, 
        auth_headers_parent: dict,
    ):
        """Test password change with wrong current password."""
        response = client.post(
            "/api/v1/auth/change-password",
            headers=auth_headers_parent,
            json={
                "current_password": "wrongpassword",
                "new_password": "newpassword123",
                "confirm_password": "newpassword123",
            }
        )
        
        assert response.status_code == 401
        assert "Current password is incorrect" in response.json()["error"]["message"]