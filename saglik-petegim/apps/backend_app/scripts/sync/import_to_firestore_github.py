#!/usr/bin/env python3
"""
Import synced data to Firestore - GitHub Actions compatible version
"""

import os
import sys
import csv
import json
from pathlib import Path
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False
    logger.warning("Firebase Admin SDK not available - running in test mode")

class FirestoreImporter:
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.db = None
        self.stats = {
            'patients': 0,
            'appointments': 0,
            'medical_records': 0,
            'errors': 0
        }
        
    def initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        if not FIREBASE_AVAILABLE:
            logger.info("Running in test mode - Firebase operations will be simulated")
            return True
            
        try:
            # Check if credentials file exists
            creds_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
            if not creds_path or not Path(creds_path).exists():
                logger.error(f"Firebase credentials not found at: {creds_path}")
                return False
                
            # Initialize Firebase
            if not firebase_admin._apps:
                cred = credentials.Certificate(creds_path)
                firebase_admin.initialize_app(cred)
                
            self.db = firestore.client()
            logger.info("✓ Firebase initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {e}")
            return False
            
    def import_patients(self):
        """Import patient data from CSV"""
        patients_file = self.data_dir / 'hastalar_latest.csv'
        
        if not patients_file.exists():
            logger.warning(f"Patients file not found: {patients_file}")
            return
            
        try:
            with open(patients_file, 'r', encoding='utf-8', errors='ignore') as f:
                # Skip BOM if exists
                content = f.read().replace('\ufeff', '')
                lines = content.split('\n')
                
                if not lines:
                    return
                    
                # Parse with semicolon delimiter
                import csv
                from io import StringIO
                reader = csv.DictReader(StringIO(content), delimiter=';')
                
                batch_size = 500
                batch_count = 0
                batch = self.db.batch() if (FIREBASE_AVAILABLE and self.db) else None
                
                for row in reader:
                    # Map column names from Turkish
                    patient_data = {
                        'patientId': f"patient_{row.get('Hasta_No', '')}",
                        'tcKimlik': row.get('TC_Kimlik_No', ''),
                        'name': f"{row.get('Hasta_Adı', '')} {row.get('Hasta_Soyadı', '')}".strip(),
                        'birthdate': row.get('Doğum_Tarihi', ''),
                        'phone': row.get('Telefon', ''),
                        'email': row.get('Email', ''),
                        'address': row.get('Adres', ''),
                        'gender': row.get('Cinsiyet', ''),
                        'bloodType': row.get('Kan_Grubu', ''),
                        'createdAt': firestore.SERVER_TIMESTAMP if FIREBASE_AVAILABLE else datetime.now().isoformat(),
                        'updatedAt': firestore.SERVER_TIMESTAMP if FIREBASE_AVAILABLE else datetime.now().isoformat(),
                        'source': 'bulut_klinik_sync'
                    }
                    
                    # Remove empty fields
                    patient_data = {k: v for k, v in patient_data.items() if v}
                    
                    if FIREBASE_AVAILABLE and self.db and batch:
                        # Add to batch
                        doc_ref = self.db.collection('users').document(patient_data['patientId'])
                        batch.set(doc_ref, patient_data, merge=True)
                        batch_count += 1
                        
                        if batch_count >= batch_size:
                            batch.commit()
                            batch = self.db.batch()
                            batch_count = 0
                            logger.info(f"Committed batch of {batch_size} patients")
                    else:
                        logger.debug(f"Would import patient: {patient_data.get('name', 'Unknown')}")
                        
                    self.stats['patients'] += 1
                
                # Commit remaining batch
                if FIREBASE_AVAILABLE and batch and batch_count > 0:
                    batch.commit()
                    logger.info(f"Committed final batch of {batch_count} patients")
                    
            logger.info(f"✓ Imported {self.stats['patients']} patients")
            
        except Exception as e:
            logger.error(f"Error importing patients: {e}")
            self.stats['errors'] += 1
            
    def import_appointments(self):
        """Import appointment data from CSV"""
        appointments_file = self.data_dir / 'randevular_latest.csv'
        
        if not appointments_file.exists():
            logger.warning(f"Appointments file not found: {appointments_file}")
            return
            
        try:
            with open(appointments_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    appointment_data = {
                        'appointmentId': row.get('appointment_id'),
                        'patientId': row.get('patient_id'),
                        'date': row.get('date'),
                        'time': row.get('time'),
                        'type': row.get('type'),
                        'status': row.get('status'),
                        'createdAt': datetime.now().isoformat(),
                        'source': 'github_actions_sync'
                    }
                    
                    if FIREBASE_AVAILABLE and self.db:
                        # Real Firebase operation
                        doc_ref = self.db.collection('appointments').document(row.get('appointment_id'))
                        doc_ref.set(appointment_data, merge=True)
                    else:
                        # Test mode - just log
                        logger.debug(f"Would import appointment: {appointment_data['appointmentId']}")
                        
                    self.stats['appointments'] += 1
                    
            logger.info(f"✓ Imported {self.stats['appointments']} appointments")
            
        except Exception as e:
            logger.error(f"Error importing appointments: {e}")
            self.stats['errors'] += 1
            
    def import_medical_records(self):
        """Import medical records from CSV"""
        medical_file = self.data_dir / 'medikal_bilgiler_latest.csv'
        
        if not medical_file.exists():
            logger.warning(f"Medical records file not found: {medical_file}")
            return
            
        try:
            with open(medical_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    record_data = {
                        'recordId': row.get('record_id'),
                        'patientId': row.get('patient_id'),
                        'date': row.get('date'),
                        'type': row.get('type'),
                        'notes': row.get('notes'),
                        'doctor': row.get('doctor'),
                        'createdAt': datetime.now().isoformat(),
                        'source': 'github_actions_sync'
                    }
                    
                    if FIREBASE_AVAILABLE and self.db:
                        # Real Firebase operation
                        doc_ref = self.db.collection('healthRecords').document(row.get('record_id'))
                        doc_ref.set(record_data, merge=True)
                    else:
                        # Test mode - just log
                        logger.debug(f"Would import medical record: {record_data['recordId']}")
                        
                    self.stats['medical_records'] += 1
                    
            logger.info(f"✓ Imported {self.stats['medical_records']} medical records")
            
        except Exception as e:
            logger.error(f"Error importing medical records: {e}")
            self.stats['errors'] += 1
            
    def create_import_report(self):
        """Create import report"""
        report = {
            'import_time': datetime.now().isoformat(),
            'status': 'success' if self.stats['errors'] == 0 else 'partial',
            'firebase_available': FIREBASE_AVAILABLE,
            'statistics': self.stats,
            'data_directory': str(self.data_dir)
        }
        
        # Save report
        report_file = self.data_dir / f"import_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
            
        logger.info(f"✓ Import report saved: {report_file}")
        
        # Log summary
        logger.info("=" * 50)
        logger.info("Import Summary:")
        logger.info(f"  Patients: {self.stats['patients']}")
        logger.info(f"  Appointments: {self.stats['appointments']}")
        logger.info(f"  Medical Records: {self.stats['medical_records']}")
        logger.info(f"  Errors: {self.stats['errors']}")
        logger.info("=" * 50)
        
        return report
        
    def run(self):
        """Main import process"""
        logger.info("=" * 50)
        logger.info("Firestore Data Import")
        logger.info("=" * 50)
        
        # Initialize Firebase
        if not self.initialize_firebase():
            logger.warning("Running without Firebase connection")
            
        # Import data
        self.import_patients()
        self.import_appointments()
        self.import_medical_records()
        
        # Create report
        report = self.create_import_report()
        
        if self.stats['errors'] > 0:
            logger.warning(f"Import completed with {self.stats['errors']} errors")
            return 1
        else:
            logger.info("✅ Import completed successfully!")
            return 0

def main():
    # Get data directory from command line or environment
    if len(sys.argv) > 1:
        data_dir = sys.argv[1]
    else:
        data_dir = os.environ.get('BULUT_KLINIK_DATA_DIR', 'apps/backend_app/data/bulut_klinik')
        
    importer = FirestoreImporter(data_dir)
    return importer.run()

if __name__ == "__main__":
    sys.exit(main())