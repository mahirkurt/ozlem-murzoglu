"""
Supabase Service for Healthcare Management System
Provides integration with Supabase for database, auth, and storage operations
"""

from typing import Optional, Dict, Any, List
from datetime import datetime
import logging
from supabase import create_client, Client
from gotrue.errors import AuthError
from postgrest.exceptions import APIError
from storage3.utils import StorageException
from app.core.config import settings
import asyncio
from functools import wraps

logger = logging.getLogger(__name__)


class SupabaseService:
    """Service class for Supabase operations"""
    
    def __init__(self):
        """Initialize Supabase client with project credentials"""
        self.client: Client = create_client(
            supabase_url=settings.SUPABASE_URL,
            supabase_key=settings.SUPABASE_ANON_KEY
        )
        self.service_key_client: Optional[Client] = None
        
        # Initialize service role client if service key is available
        if hasattr(settings, 'SUPABASE_SERVICE_KEY'):
            self.service_key_client = create_client(
                supabase_url=settings.SUPABASE_URL,
                supabase_key=settings.SUPABASE_SERVICE_KEY
            )
    
    # ==================== Authentication Methods ====================
    
    async def sign_up(self, email: str, password: str, user_metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Sign up a new user with email and password
        
        Args:
            email: User's email address
            password: User's password
            user_metadata: Additional user metadata (name, role, etc.)
        
        Returns:
            User data and session information
        """
        try:
            response = self.client.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": user_metadata or {}
                }
            })
            
            if response.user:
                logger.info(f"User signed up successfully: {email}")
                return {
                    "user": response.user,
                    "session": response.session
                }
            else:
                raise AuthError("Sign up failed")
                
        except AuthError as e:
            logger.error(f"Sign up error for {email}: {str(e)}")
            raise
    
    async def sign_in(self, email: str, password: str) -> Dict[str, Any]:
        """
        Sign in user with email and password
        
        Args:
            email: User's email address
            password: User's password
        
        Returns:
            User data and session information
        """
        try:
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if response.user and response.session:
                logger.info(f"User signed in successfully: {email}")
                return {
                    "user": response.user,
                    "session": response.session,
                    "access_token": response.session.access_token,
                    "refresh_token": response.session.refresh_token
                }
            else:
                raise AuthError("Sign in failed")
                
        except AuthError as e:
            logger.error(f"Sign in error for {email}: {str(e)}")
            raise
    
    async def sign_out(self, access_token: str) -> bool:
        """
        Sign out user
        
        Args:
            access_token: User's access token
        
        Returns:
            Success status
        """
        try:
            self.client.auth.sign_out(access_token)
            logger.info("User signed out successfully")
            return True
        except AuthError as e:
            logger.error(f"Sign out error: {str(e)}")
            raise
    
    async def verify_token(self, access_token: str) -> Optional[Dict[str, Any]]:
        """
        Verify JWT token and get user data
        
        Args:
            access_token: JWT access token
        
        Returns:
            User data if token is valid, None otherwise
        """
        try:
            user = self.client.auth.get_user(access_token)
            if user:
                return user.dict()
            return None
        except AuthError as e:
            logger.error(f"Token verification error: {str(e)}")
            return None
    
    async def reset_password(self, email: str) -> bool:
        """
        Send password reset email
        
        Args:
            email: User's email address
        
        Returns:
            Success status
        """
        try:
            self.client.auth.reset_password_email(email)
            logger.info(f"Password reset email sent to: {email}")
            return True
        except AuthError as e:
            logger.error(f"Password reset error for {email}: {str(e)}")
            raise
    
    # ==================== Database Methods ====================
    
    async def get_patient(self, patient_id: str) -> Optional[Dict[str, Any]]:
        """
        Get patient data by ID
        
        Args:
            patient_id: Patient UUID
        
        Returns:
            Patient data if found
        """
        try:
            response = self.client.table('patients').select("*").eq('id', patient_id).single().execute()
            return response.data
        except APIError as e:
            logger.error(f"Error fetching patient {patient_id}: {str(e)}")
            return None
    
    async def create_patient(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create new patient record
        
        Args:
            patient_data: Patient information
        
        Returns:
            Created patient data
        """
        try:
            response = self.client.table('patients').insert(patient_data).execute()
            logger.info(f"Patient created successfully: {response.data[0]['id']}")
            return response.data[0]
        except APIError as e:
            logger.error(f"Error creating patient: {str(e)}")
            raise
    
    async def update_patient(self, patient_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update patient record
        
        Args:
            patient_id: Patient UUID
            updates: Fields to update
        
        Returns:
            Updated patient data
        """
        try:
            response = self.client.table('patients').update(updates).eq('id', patient_id).execute()
            logger.info(f"Patient {patient_id} updated successfully")
            return response.data[0]
        except APIError as e:
            logger.error(f"Error updating patient {patient_id}: {str(e)}")
            raise
    
    async def get_appointments(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Get appointments with optional filters
        
        Args:
            filters: Query filters (patient_id, doctor_id, date_range, etc.)
        
        Returns:
            List of appointments
        """
        try:
            query = self.client.table('appointments').select("*")
            
            if filters:
                if 'patient_id' in filters:
                    query = query.eq('patient_id', filters['patient_id'])
                if 'doctor_id' in filters:
                    query = query.eq('doctor_id', filters['doctor_id'])
                if 'status' in filters:
                    query = query.eq('status', filters['status'])
                if 'date_from' in filters:
                    query = query.gte('appointment_date', filters['date_from'])
                if 'date_to' in filters:
                    query = query.lte('appointment_date', filters['date_to'])
            
            response = query.order('appointment_date', desc=False).execute()
            return response.data
            
        except APIError as e:
            logger.error(f"Error fetching appointments: {str(e)}")
            return []
    
    async def create_appointment(self, appointment_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create new appointment
        
        Args:
            appointment_data: Appointment information
        
        Returns:
            Created appointment data
        """
        try:
            response = self.client.table('appointments').insert(appointment_data).execute()
            logger.info(f"Appointment created successfully: {response.data[0]['id']}")
            return response.data[0]
        except APIError as e:
            logger.error(f"Error creating appointment: {str(e)}")
            raise
    
    async def update_appointment(self, appointment_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update appointment
        
        Args:
            appointment_id: Appointment UUID
            updates: Fields to update
        
        Returns:
            Updated appointment data
        """
        try:
            response = self.client.table('appointments').update(updates).eq('id', appointment_id).execute()
            logger.info(f"Appointment {appointment_id} updated successfully")
            return response.data[0]
        except APIError as e:
            logger.error(f"Error updating appointment {appointment_id}: {str(e)}")
            raise
    
    # ==================== Medical Records Methods ====================
    
    async def get_medical_records(self, patient_id: str) -> List[Dict[str, Any]]:
        """
        Get medical records for a patient
        
        Args:
            patient_id: Patient UUID
        
        Returns:
            List of medical records
        """
        try:
            response = self.client.table('medical_records').select("*").eq('patient_id', patient_id).order('created_at', desc=True).execute()
            return response.data
        except APIError as e:
            logger.error(f"Error fetching medical records for patient {patient_id}: {str(e)}")
            return []
    
    async def create_medical_record(self, record_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create new medical record
        
        Args:
            record_data: Medical record information
        
        Returns:
            Created medical record data
        """
        try:
            response = self.client.table('medical_records').insert(record_data).execute()
            logger.info(f"Medical record created successfully: {response.data[0]['id']}")
            return response.data[0]
        except APIError as e:
            logger.error(f"Error creating medical record: {str(e)}")
            raise
    
    # ==================== Storage Methods ====================
    
    async def upload_medical_document(self, file_path: str, file_data: bytes, patient_id: str) -> str:
        """
        Upload medical document to Supabase Storage
        
        Args:
            file_path: Path/name for the file in storage
            file_data: File content as bytes
            patient_id: Patient UUID for organization
        
        Returns:
            Public URL of uploaded file
        """
        try:
            bucket_name = "medical-documents"
            storage_path = f"{patient_id}/{file_path}"
            
            # Upload file
            response = self.client.storage.from_(bucket_name).upload(
                path=storage_path,
                file=file_data,
                file_options={"content-type": "application/octet-stream"}
            )
            
            # Get public URL
            public_url = self.client.storage.from_(bucket_name).get_public_url(storage_path)
            
            logger.info(f"Document uploaded successfully: {storage_path}")
            return public_url
            
        except StorageException as e:
            logger.error(f"Error uploading document: {str(e)}")
            raise
    
    async def download_medical_document(self, file_path: str) -> bytes:
        """
        Download medical document from Supabase Storage
        
        Args:
            file_path: Path of the file in storage
        
        Returns:
            File content as bytes
        """
        try:
            bucket_name = "medical-documents"
            response = self.client.storage.from_(bucket_name).download(file_path)
            return response
        except StorageException as e:
            logger.error(f"Error downloading document {file_path}: {str(e)}")
            raise
    
    async def delete_medical_document(self, file_path: str) -> bool:
        """
        Delete medical document from Supabase Storage
        
        Args:
            file_path: Path of the file in storage
        
        Returns:
            Success status
        """
        try:
            bucket_name = "medical-documents"
            self.client.storage.from_(bucket_name).remove([file_path])
            logger.info(f"Document deleted successfully: {file_path}")
            return True
        except StorageException as e:
            logger.error(f"Error deleting document {file_path}: {str(e)}")
            raise
    
    # ==================== Realtime Subscriptions ====================
    
    def subscribe_to_appointments(self, callback, filters: Dict[str, Any] = None):
        """
        Subscribe to realtime appointment updates
        
        Args:
            callback: Function to call when updates occur
            filters: Optional filters for subscription
        """
        channel = self.client.channel('appointments-channel')
        
        if filters and 'patient_id' in filters:
            channel = channel.on(
                'postgres_changes',
                callback=callback,
                event='*',
                schema='public',
                table='appointments',
                filter=f"patient_id=eq.{filters['patient_id']}"
            )
        else:
            channel = channel.on(
                'postgres_changes',
                callback=callback,
                event='*',
                schema='public',
                table='appointments'
            )
        
        channel.subscribe()
        logger.info("Subscribed to appointment updates")
        return channel
    
    def unsubscribe(self, channel):
        """
        Unsubscribe from realtime channel
        
        Args:
            channel: Channel to unsubscribe from
        """
        self.client.remove_channel(channel)
        logger.info("Unsubscribed from channel")


# Singleton instance
supabase_service = SupabaseService()