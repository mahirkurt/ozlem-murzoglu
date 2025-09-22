"""
Dynamic Sync Manager for Bulut Klinik to Firestore
Handles real-time data synchronization and updates
"""

import os
import json
import csv
import hashlib
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import pandas as pd
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DynamicSyncManager:
    """Manages dynamic synchronization between Bulut Klinik and Firestore"""
    
    def __init__(self):
        self.base_path = Path(__file__).parent.parent.parent
        self.data_path = self.base_path / 'data'
        self.raw_path = self.data_path / 'raw' / 'bulut_klinik'
        self.processed_path = self.data_path / 'processed' / 'current'
        self.history_path = self.data_path / 'processed' / 'history'
        self.sync_log_path = self.data_path / 'sync' / 'logs'
        self.sync_status_path = self.data_path / 'sync' / 'status'
        
        # Initialize Firebase
        self._initialize_firebase()
        
        # Load sync status
        self.sync_status = self._load_sync_status()
        
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            firebase_admin.get_app()
        except:
            cred_path = self.base_path.parent / 'flutter_app' / 'saglikpetegim-firebase-adminsdk-fbsvc-c6a289df06.json'
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
        
        self.db = firestore.client()
        
    def _load_sync_status(self) -> Dict:
        """Load last sync status"""
        status_file = self.sync_status_path / 'last_sync.json'
        if status_file.exists():
            with open(status_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {
            'last_sync': None,
            'last_checksums': {},
            'sync_history': []
        }
    
    def _save_sync_status(self):
        """Save current sync status"""
        self.sync_status_path.mkdir(parents=True, exist_ok=True)
        status_file = self.sync_status_path / 'last_sync.json'
        with open(status_file, 'w', encoding='utf-8') as f:
            json.dump(self.sync_status, f, ensure_ascii=False, indent=2, default=str)
    
    def _calculate_checksum(self, file_path: Path) -> str:
        """Calculate MD5 checksum of a file"""
        hash_md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    
    def _has_file_changed(self, file_path: Path) -> bool:
        """Check if file has changed since last sync"""
        current_checksum = self._calculate_checksum(file_path)
        last_checksum = self.sync_status['last_checksums'].get(str(file_path))
        
        if last_checksum != current_checksum:
            self.sync_status['last_checksums'][str(file_path)] = current_checksum
            return True
        return False
    
    def sync_patients(self, force: bool = False) -> Dict[str, Any]:
        """Sync patient data from CSV to Firestore"""
        patients_file = self.raw_path / 'hastalar_latest.csv'
        
        if not patients_file.exists():
            logger.error(f"Patients file not found: {patients_file}")
            return {'success': False, 'error': 'File not found'}
        
        # Check if file has changed
        if not force and not self._has_file_changed(patients_file):
            logger.info("Patients file hasn't changed, skipping sync")
            return {'success': True, 'message': 'No changes detected'}
        
        logger.info("Starting patient sync...")
        
        try:
            # Read CSV with proper encoding
            patients_df = pd.read_csv(patients_file, sep=';', encoding='utf-8-sig')
            
            added = 0
            updated = 0
            errors = []
            
            for _, row in patients_df.iterrows():
                patient_id = str(row.get('Hasta No', ''))
                if not patient_id:
                    continue
                
                # Prepare patient data
                patient_data = {
                    'patientId': patient_id,
                    'firstName': row.get('Adı', ''),
                    'lastName': row.get('Soyadı', ''),
                    'tcKimlik': row.get('Kimlik Numarası', ''),
                    'gender': self._map_gender(row.get('Cinsiyeti', '')),
                    'dateOfBirth': self._parse_date(row.get('Doğum Tarihi')),
                    'placeOfBirth': row.get('Doğum Yeri', ''),
                    'bloodType': row.get('Kan Grubu', ''),
                    'nationality': row.get('Uyruğu', ''),
                    'passportNo': row.get('Pasaport Numarası', ''),
                    'phone': row.get('Telefon No', ''),
                    'email': row.get('Eposta', ''),
                    'address': row.get('Adres', ''),
                    'motherName': row.get('Anne Adı', ''),
                    'fatherName': row.get('Baba Adı', ''),
                    'maritalStatus': row.get('Medeni Hali', ''),
                    'insurance': row.get('Anlaşmalı Kurum', ''),
                    'notes': row.get('Not', ''),
                    'medicalHistory': {
                        'personal': row.get('Özgeçmiş', ''),
                        'family': row.get('Soygeçmiş', ''),
                        'allergies': self._parse_list(row.get('Alerjiler', '')),
                        'registrationReason': row.get('Geliş Nedeni', '')
                    },
                    'updatedAt': firestore.SERVER_TIMESTAMP,
                    'dataSource': 'bulut_klinik',
                    'syncedAt': datetime.now().isoformat()
                }
                
                # Check if patient exists
                patient_ref = self.db.collection('patients').document(patient_id)
                patient_doc = patient_ref.get()
                
                if patient_doc.exists:
                    # Update existing patient
                    patient_ref.update(patient_data)
                    updated += 1
                else:
                    # Add new patient
                    patient_ref.set(patient_data)
                    added += 1
                    
                # Update caregiver relationships if email exists
                if patient_data['email']:
                    self._update_caregiver_relationship(patient_id, patient_data)
                    
            logger.info(f"Patient sync completed: {added} added, {updated} updated")
            
            return {
                'success': True,
                'added': added,
                'updated': updated,
                'errors': errors,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error syncing patients: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def sync_appointments(self, force: bool = False) -> Dict[str, Any]:
        """Sync appointment data from CSV to Firestore"""
        appointments_file = self.raw_path / 'protokoller_latest.csv'
        
        if not appointments_file.exists():
            logger.error(f"Appointments file not found: {appointments_file}")
            return {'success': False, 'error': 'File not found'}
        
        # Check if file has changed
        if not force and not self._has_file_changed(appointments_file):
            logger.info("Appointments file hasn't changed, skipping sync")
            return {'success': True, 'message': 'No changes detected'}
        
        logger.info("Starting appointment sync...")
        
        try:
            # Read CSV with proper encoding
            appointments_df = pd.read_csv(appointments_file, sep=';', encoding='utf-8-sig')
            
            added = 0
            updated = 0
            
            for _, row in appointments_df.iterrows():
                protocol_no = str(row.get('Protokol No', ''))
                patient_id = str(row.get('Hasta No', ''))
                
                if not protocol_no or not patient_id:
                    continue
                
                # Prepare appointment data
                appointment_data = {
                    'appointmentId': protocol_no,
                    'patientId': patient_id,
                    'date': self._parse_datetime(row.get('Tarih')),
                    'service': row.get('Hizmet', ''),
                    'diagnosis': row.get('Tanı', ''),
                    'notes': row.get('Notlar', ''),
                    'fee': self._parse_float(row.get('Ücret')),
                    'discount': self._parse_float(row.get('İndirim')),
                    'totalAmount': self._parse_float(row.get('Tutar')),
                    'status': 'completed',  # Historical data
                    'updatedAt': firestore.SERVER_TIMESTAMP,
                    'dataSource': 'bulut_klinik',
                    'syncedAt': datetime.now().isoformat()
                }
                
                # Store in Firestore
                appointment_ref = self.db.collection('appointments').document(protocol_no)
                appointment_doc = appointment_ref.get()
                
                if appointment_doc.exists:
                    appointment_ref.update(appointment_data)
                    updated += 1
                else:
                    appointment_ref.set(appointment_data)
                    added += 1
                    
            logger.info(f"Appointment sync completed: {added} added, {updated} updated")
            
            return {
                'success': True,
                'added': added,
                'updated': updated,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error syncing appointments: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def sync_medical_records(self, force: bool = False) -> Dict[str, Any]:
        """Sync medical records from CSV to Firestore"""
        medical_file = self.raw_path / 'medikal_bilgiler_latest.csv'
        
        if not medical_file.exists():
            logger.error(f"Medical records file not found: {medical_file}")
            return {'success': False, 'error': 'File not found'}
        
        # Check if file has changed
        if not force and not self._has_file_changed(medical_file):
            logger.info("Medical records file hasn't changed, skipping sync")
            return {'success': True, 'message': 'No changes detected'}
        
        logger.info("Starting medical records sync...")
        
        try:
            # Read CSV with proper encoding
            medical_df = pd.read_csv(medical_file, sep=';', encoding='utf-8-sig')
            
            added = 0
            updated = 0
            
            for _, row in medical_df.iterrows():
                record_id = str(row.get('ID', ''))
                patient_id = str(row.get('Hasta No', ''))
                
                if not record_id or not patient_id:
                    continue
                
                # Prepare medical record data
                record_data = {
                    'recordId': record_id,
                    'patientId': patient_id,
                    'date': self._parse_datetime(row.get('Tarih')),
                    'type': row.get('Tip', ''),
                    'category': row.get('Kategori', ''),
                    'description': row.get('Açıklama', ''),
                    'measurements': {
                        'height': self._parse_float(row.get('Boy')),
                        'weight': self._parse_float(row.get('Kilo')),
                        'headCircumference': self._parse_float(row.get('Baş Çevresi')),
                        'temperature': self._parse_float(row.get('Ateş')),
                        'bloodPressure': row.get('Tansiyon', '')
                    },
                    'medications': self._parse_list(row.get('İlaçlar', '')),
                    'vaccinations': self._parse_list(row.get('Aşılar', '')),
                    'attachments': self._parse_list(row.get('Ekler', '')),
                    'updatedAt': firestore.SERVER_TIMESTAMP,
                    'dataSource': 'bulut_klinik',
                    'syncedAt': datetime.now().isoformat()
                }
                
                # Store in Firestore
                record_ref = self.db.collection('health_records').document(record_id)
                record_doc = record_ref.get()
                
                if record_doc.exists:
                    record_ref.update(record_data)
                    updated += 1
                else:
                    record_ref.set(record_data)
                    added += 1
                    
            logger.info(f"Medical records sync completed: {added} added, {updated} updated")
            
            return {
                'success': True,
                'added': added,
                'updated': updated,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error syncing medical records: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def _update_caregiver_relationship(self, patient_id: str, patient_data: Dict):
        """Update caregiver relationship for a patient"""
        email = patient_data.get('email')
        if not email:
            return
        
        # Find user by email
        users = self.db.collection('users').where('email', '==', email).limit(1).get()
        
        if users:
            user_doc = users[0]
            user_ref = self.db.collection('users').document(user_doc.id)
            user_data = user_doc.to_dict()
            
            # Get existing children
            children = user_data.get('children', [])
            
            # Check if this patient is already in children list
            patient_exists = any(child.get('patientId') == patient_id for child in children)
            
            if not patient_exists:
                # Add new child
                child_info = {
                    'patientId': patient_id,
                    'name': f"{patient_data['firstName']} {patient_data['lastName']}",
                    'birthDate': patient_data.get('dateOfBirth', ''),
                    'tcKimlik': patient_data.get('tcKimlik', '')
                }
                children.append(child_info)
                
                # Update user document
                user_ref.update({
                    'children': children,
                    'isMultiChild': len(children) > 1,
                    'childCount': len(children)
                })
                
                logger.info(f"Updated caregiver relationship for {email} with patient {patient_id}")
    
    def _map_gender(self, gender: str) -> str:
        """Map gender to standard format"""
        if not gender:
            return 'unknown'
        gender = gender.lower()
        if 'kadın' in gender or 'kız' in gender:
            return 'female'
        elif 'erkek' in gender:
            return 'male'
        return 'unknown'
    
    def _parse_date(self, date_str: Any) -> Optional[str]:
        """Parse date string to ISO format"""
        if pd.isna(date_str) or not date_str:
            return None
        try:
            # Try different date formats
            for fmt in ['%Y-%m-%d', '%d.%m.%Y', '%d/%m/%Y']:
                try:
                    dt = datetime.strptime(str(date_str), fmt)
                    return dt.date().isoformat()
                except:
                    continue
            return str(date_str)
        except:
            return None
    
    def _parse_datetime(self, datetime_str: Any) -> Optional[str]:
        """Parse datetime string to ISO format"""
        if pd.isna(datetime_str) or not datetime_str:
            return None
        try:
            # Try different datetime formats
            for fmt in ['%Y-%m-%d %H:%M:%S', '%d.%m.%Y %H:%M', '%d/%m/%Y %H:%M']:
                try:
                    dt = datetime.strptime(str(datetime_str), fmt)
                    return dt.isoformat()
                except:
                    continue
            return str(datetime_str)
        except:
            return None
    
    def _parse_float(self, value: Any) -> Optional[float]:
        """Parse float value"""
        if pd.isna(value) or value == '':
            return None
        try:
            # Handle Turkish decimal separator
            if isinstance(value, str):
                value = value.replace(',', '.')
            return float(value)
        except:
            return None
    
    def _parse_list(self, value: Any) -> List[str]:
        """Parse comma-separated list"""
        if pd.isna(value) or not value:
            return []
        if isinstance(value, str):
            return [item.strip() for item in value.split(',') if item.strip()]
        return []
    
    def full_sync(self, force: bool = False) -> Dict[str, Any]:
        """Perform full synchronization of all data"""
        logger.info("Starting full synchronization...")
        
        results = {
            'timestamp': datetime.now().isoformat(),
            'patients': self.sync_patients(force),
            'appointments': self.sync_appointments(force),
            'medical_records': self.sync_medical_records(force)
        }
        
        # Update sync status
        self.sync_status['last_sync'] = datetime.now().isoformat()
        self.sync_status['sync_history'].append(results)
        
        # Keep only last 10 sync records
        if len(self.sync_status['sync_history']) > 10:
            self.sync_status['sync_history'] = self.sync_status['sync_history'][-10:]
        
        self._save_sync_status()
        
        # Save sync log
        self._save_sync_log(results)
        
        logger.info("Full synchronization completed")
        return results
    
    def _save_sync_log(self, results: Dict):
        """Save sync results to log file"""
        self.sync_log_path.mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        log_file = self.sync_log_path / f'sync_{timestamp}.json'
        
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2, default=str)
        
        logger.info(f"Sync log saved to {log_file}")
    
    def get_sync_status(self) -> Dict:
        """Get current sync status"""
        return self.sync_status
    
    def clear_cache(self):
        """Clear processed cache and force resync"""
        logger.info("Clearing sync cache...")
        self.sync_status['last_checksums'] = {}
        self._save_sync_status()
        logger.info("Sync cache cleared")


def main():
    """Main entry point for manual sync"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Dynamic Sync Manager for Bulut Klinik')
    parser.add_argument('--force', action='store_true', help='Force sync even if files haven\'t changed')
    parser.add_argument('--patients', action='store_true', help='Sync only patients')
    parser.add_argument('--appointments', action='store_true', help='Sync only appointments')
    parser.add_argument('--medical', action='store_true', help='Sync only medical records')
    parser.add_argument('--status', action='store_true', help='Show sync status')
    parser.add_argument('--clear-cache', action='store_true', help='Clear sync cache')
    
    args = parser.parse_args()
    
    manager = DynamicSyncManager()
    
    if args.status:
        status = manager.get_sync_status()
        print(json.dumps(status, indent=2, default=str))
    elif args.clear_cache:
        manager.clear_cache()
        print("Cache cleared successfully")
    elif args.patients:
        result = manager.sync_patients(force=args.force)
        print(json.dumps(result, indent=2, default=str))
    elif args.appointments:
        result = manager.sync_appointments(force=args.force)
        print(json.dumps(result, indent=2, default=str))
    elif args.medical:
        result = manager.sync_medical_records(force=args.force)
        print(json.dumps(result, indent=2, default=str))
    else:
        # Full sync
        result = manager.full_sync(force=args.force)
        print(json.dumps(result, indent=2, default=str))


if __name__ == '__main__':
    main()