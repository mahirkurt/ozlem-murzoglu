"""
Real-time Firestore Listener
Monitors Firestore changes and triggers appropriate actions
"""

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import logging
import json
from pathlib import Path
from typing import Dict, Any, Callable
import threading
import time

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class RealtimeListener:
    """Manages real-time Firestore listeners and callbacks"""
    
    def __init__(self):
        self.base_path = Path(__file__).parent.parent.parent
        self.listeners = {}
        self.callbacks = {}
        
        # Initialize Firebase
        self._initialize_firebase()
        
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            firebase_admin.get_app()
        except:
            cred_path = self.base_path.parent / 'flutter_app' / 'saglikpetegim-firebase-adminsdk-fbsvc-c6a289df06.json'
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
        
        self.db = firestore.client()
    
    def on_patient_change(self, doc_snapshot, changes, read_time):
        """Handle patient document changes"""
        for change in changes:
            logger.info(f"Patient change detected: {change.type.name}")
            
            if change.type.name == 'ADDED':
                logger.info(f"New patient added: {change.document.id}")
                self._handle_new_patient(change.document)
            elif change.type.name == 'MODIFIED':
                logger.info(f"Patient modified: {change.document.id}")
                self._handle_patient_update(change.document)
            elif change.type.name == 'REMOVED':
                logger.info(f"Patient removed: {change.document.id}")
                self._handle_patient_deletion(change.document.id)
    
    def on_appointment_change(self, doc_snapshot, changes, read_time):
        """Handle appointment document changes"""
        for change in changes:
            logger.info(f"Appointment change detected: {change.type.name}")
            
            if change.type.name == 'ADDED':
                logger.info(f"New appointment added: {change.document.id}")
                self._handle_new_appointment(change.document)
            elif change.type.name == 'MODIFIED':
                logger.info(f"Appointment modified: {change.document.id}")
                self._handle_appointment_update(change.document)
    
    def on_health_record_change(self, doc_snapshot, changes, read_time):
        """Handle health record document changes"""
        for change in changes:
            logger.info(f"Health record change detected: {change.type.name}")
            
            if change.type.name == 'ADDED':
                logger.info(f"New health record added: {change.document.id}")
                self._handle_new_health_record(change.document)
            elif change.type.name == 'MODIFIED':
                logger.info(f"Health record modified: {change.document.id}")
                self._handle_health_record_update(change.document)
    
    def _handle_new_patient(self, document):
        """Process new patient addition"""
        patient_data = document.to_dict()
        patient_id = document.id
        
        # Update user relationships if email exists
        if patient_data.get('email'):
            self._update_user_children(patient_data['email'], patient_id, patient_data)
        
        # Trigger callbacks
        if 'new_patient' in self.callbacks:
            self.callbacks['new_patient'](patient_id, patient_data)
    
    def _handle_patient_update(self, document):
        """Process patient update"""
        patient_data = document.to_dict()
        patient_id = document.id
        
        # Check if email changed and update relationships
        if patient_data.get('email'):
            self._update_user_children(patient_data['email'], patient_id, patient_data)
        
        # Trigger callbacks
        if 'patient_update' in self.callbacks:
            self.callbacks['patient_update'](patient_id, patient_data)
    
    def _handle_patient_deletion(self, patient_id: str):
        """Process patient deletion"""
        # Remove from user children lists
        users = self.db.collection('users').get()
        for user_doc in users:
            user_data = user_doc.to_dict()
            children = user_data.get('children', [])
            
            # Filter out deleted patient
            updated_children = [c for c in children if c.get('patientId') != patient_id]
            
            if len(updated_children) != len(children):
                # Update user document
                self.db.collection('users').document(user_doc.id).update({
                    'children': updated_children,
                    'childCount': len(updated_children),
                    'isMultiChild': len(updated_children) > 1
                })
                logger.info(f"Removed patient {patient_id} from user {user_doc.id}")
        
        # Trigger callbacks
        if 'patient_deletion' in self.callbacks:
            self.callbacks['patient_deletion'](patient_id)
    
    def _handle_new_appointment(self, document):
        """Process new appointment addition"""
        appointment_data = document.to_dict()
        appointment_id = document.id
        
        # Send notification to caregiver
        self._notify_appointment(appointment_data, 'new')
        
        # Trigger callbacks
        if 'new_appointment' in self.callbacks:
            self.callbacks['new_appointment'](appointment_id, appointment_data)
    
    def _handle_appointment_update(self, document):
        """Process appointment update"""
        appointment_data = document.to_dict()
        appointment_id = document.id
        
        # Send notification if status changed
        self._notify_appointment(appointment_data, 'update')
        
        # Trigger callbacks
        if 'appointment_update' in self.callbacks:
            self.callbacks['appointment_update'](appointment_id, appointment_data)
    
    def _handle_new_health_record(self, document):
        """Process new health record addition"""
        record_data = document.to_dict()
        record_id = document.id
        
        # Update patient's latest measurements
        if record_data.get('patientId'):
            self._update_patient_measurements(record_data['patientId'], record_data)
        
        # Trigger callbacks
        if 'new_health_record' in self.callbacks:
            self.callbacks['new_health_record'](record_id, record_data)
    
    def _handle_health_record_update(self, document):
        """Process health record update"""
        record_data = document.to_dict()
        record_id = document.id
        
        # Update patient's latest measurements
        if record_data.get('patientId'):
            self._update_patient_measurements(record_data['patientId'], record_data)
        
        # Trigger callbacks
        if 'health_record_update' in self.callbacks:
            self.callbacks['health_record_update'](record_id, record_data)
    
    def _update_user_children(self, email: str, patient_id: str, patient_data: Dict):
        """Update user's children list"""
        users = self.db.collection('users').where('email', '==', email).limit(1).get()
        
        if users:
            user_doc = users[0]
            user_data = user_doc.to_dict()
            children = user_data.get('children', [])
            
            # Check if patient already in children
            existing_child = next((c for c in children if c['patientId'] == patient_id), None)
            
            child_info = {
                'patientId': patient_id,
                'name': f"{patient_data.get('firstName', '')} {patient_data.get('lastName', '')}".strip(),
                'birthDate': patient_data.get('dateOfBirth', ''),
                'tcKimlik': patient_data.get('tcKimlik', '')
            }
            
            if existing_child:
                # Update existing child info
                idx = children.index(existing_child)
                children[idx] = child_info
            else:
                # Add new child
                children.append(child_info)
            
            # Update user document
            self.db.collection('users').document(user_doc.id).update({
                'children': children,
                'childCount': len(children),
                'isMultiChild': len(children) > 1
            })
            
            logger.info(f"Updated user {email} children list with patient {patient_id}")
    
    def _update_patient_measurements(self, patient_id: str, record_data: Dict):
        """Update patient's latest measurements"""
        measurements = record_data.get('measurements', {})
        if not measurements:
            return
        
        # Update patient document with latest measurements
        update_data = {
            'latestMeasurements': {
                'height': measurements.get('height'),
                'weight': measurements.get('weight'),
                'headCircumference': measurements.get('headCircumference'),
                'temperature': measurements.get('temperature'),
                'bloodPressure': measurements.get('bloodPressure'),
                'measuredAt': record_data.get('date'),
                'updatedAt': firestore.SERVER_TIMESTAMP
            }
        }
        
        self.db.collection('patients').document(patient_id).update(update_data)
        logger.info(f"Updated patient {patient_id} with latest measurements")
    
    def _notify_appointment(self, appointment_data: Dict, event_type: str):
        """Send notification for appointment events"""
        # This would integrate with a notification service
        # For now, just log the notification
        patient_id = appointment_data.get('patientId')
        date = appointment_data.get('date')
        status = appointment_data.get('status')
        
        logger.info(f"Notification: {event_type} appointment for patient {patient_id} on {date} (status: {status})")
    
    def register_callback(self, event: str, callback: Callable):
        """Register a callback for specific events"""
        self.callbacks[event] = callback
        logger.info(f"Registered callback for event: {event}")
    
    def start_listeners(self):
        """Start all Firestore listeners"""
        logger.info("Starting Firestore listeners...")
        
        # Listen to patients collection
        patients_ref = self.db.collection('patients')
        self.listeners['patients'] = patients_ref.on_snapshot(self.on_patient_change)
        
        # Listen to appointments collection
        appointments_ref = self.db.collection('appointments')
        self.listeners['appointments'] = appointments_ref.on_snapshot(self.on_appointment_change)
        
        # Listen to health_records collection
        health_records_ref = self.db.collection('health_records')
        self.listeners['health_records'] = health_records_ref.on_snapshot(self.on_health_record_change)
        
        logger.info("All listeners started successfully")
    
    def stop_listeners(self):
        """Stop all Firestore listeners"""
        logger.info("Stopping Firestore listeners...")
        
        for name, listener in self.listeners.items():
            if listener:
                listener.unsubscribe()
                logger.info(f"Stopped listener: {name}")
        
        self.listeners.clear()
        logger.info("All listeners stopped")
    
    def run_forever(self):
        """Run listeners in a continuous loop"""
        self.start_listeners()
        
        try:
            logger.info("Real-time listener running... Press Ctrl+C to stop")
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            logger.info("Shutting down...")
            self.stop_listeners()


def main():
    """Main entry point"""
    listener = RealtimeListener()
    
    # Register example callbacks
    def on_new_patient(patient_id, data):
        print(f"New patient registered: {patient_id}")
        print(f"  Name: {data.get('firstName')} {data.get('lastName')}")
    
    def on_appointment_update(appointment_id, data):
        print(f"Appointment updated: {appointment_id}")
        print(f"  Status: {data.get('status')}")
    
    listener.register_callback('new_patient', on_new_patient)
    listener.register_callback('appointment_update', on_appointment_update)
    
    # Run forever
    listener.run_forever()


if __name__ == '__main__':
    main()