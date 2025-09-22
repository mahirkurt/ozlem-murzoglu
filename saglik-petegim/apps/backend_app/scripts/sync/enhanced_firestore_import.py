#!/usr/bin/env python3
"""
Enhanced Firestore Import Script for GitHub Actions
Imports all BulutKlinik data with proper mapping and relationships
"""

import os
import sys
import csv
import json
import base64
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
    from firebase_admin import credentials, firestore, auth
except ImportError:
    logger.error("Firebase Admin SDK not installed. Run: pip install firebase-admin")
    sys.exit(1)

class EnhancedFirestoreImporter:
    def __init__(self):
        self.data_dir = Path('apps/backend_app/data/raw/bulut_klinik')
        self.db = None
        self.stats = {
            'users': 0,
            'appointments': 0,
            'health_records': 0,
            'financial_records': 0,
            'vaccinations': 0,
            'services': 0,
            'growth_tracking': 0,
            'bf_patient_visits': 0,
            'bf_patient_vaccinations': 0,
            'bf_screening_assessments': 0,
            'bf_milestone_tracking': 0,
            'duplicates_removed': 0,
            'errors': []
        }
        
    def initialize_firebase(self):
        """Initialize Firebase from base64 encoded credentials"""
        try:
            # Get base64 encoded credentials from environment
            creds_base64 = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS_BASE64')
            
            if creds_base64:
                # Decode and write to temp file
                creds_json = base64.b64decode(creds_base64).decode('utf-8')
                creds_data = json.loads(creds_json)
                
                # Initialize with dict
                cred = credentials.Certificate(creds_data)
            else:
                # Fall back to file path
                creds_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS', 'service-account.json')
                if not Path(creds_path).exists():
                    logger.error(f"Credentials file not found: {creds_path}")
                    return False
                cred = credentials.Certificate(creds_path)
            
            # Initialize app if not already initialized
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred, {
                    'projectId': 'saglikpetegim'
                })
            
            self.db = firestore.client()
            logger.info("✓ Firebase initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {e}")
            return False
    
    def import_patients_as_users(self):
        """Import patients as user accounts with proper structure"""
        patients_file = self.data_dir / 'hastalar_latest.csv'
        
        if not patients_file.exists():
            logger.warning(f"Patients file not found: {patients_file}")
            return
        
        logger.info("📥 Importing patient data...")
        
        try:
            with open(patients_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read().replace('\ufeff', '')
                
                import csv
                from io import StringIO
                reader = csv.DictReader(StringIO(content), delimiter=';')
                
                batch = self.db.batch()
                batch_count = 0
                
                for row in reader:
                    try:
                        tc_kimlik = row.get('TC_Kimlik_No', '').strip()
                        if not tc_kimlik:
                            continue
                        
                        # Create email from name if not exists
                        first_name = row.get('Hasta_Adı', '').strip()
                        last_name = row.get('Hasta_Soyadı', '').strip()
                        email = row.get('Email', '').strip()
                        
                        if not email and first_name and last_name:
                            email = f"{first_name.lower()}.{last_name.lower()}@saglikpetegim.com"
                        
                        # Create user document ID from email
                        doc_id = email.replace('@', '_').replace('.', '_') if email else f"user_{tc_kimlik}"
                        
                        user_data = {
                            'id': doc_id,
                            'email': email,
                            'displayName': f"{first_name} {last_name}".strip(),
                            'phone': row.get('Telefon', ''),
                            'address': row.get('Adres', ''),
                            'personalInfo': {
                                'firstName': first_name,
                                'lastName': last_name,
                                'tcKimlik': tc_kimlik,
                                'birthDate': row.get('Doğum_Tarihi', ''),
                                'gender': row.get('Cinsiyet', ''),
                                'bloodType': row.get('Kan_Grubu', '')
                            },
                            'linkedPatients': [{
                                'patientId': f"patient_{row.get('Hasta_No', '')}",
                                'name': f"{first_name} {last_name}".strip(),
                                'tcKimlik': tc_kimlik,
                                'relationship': 'self'
                            }],
                            'accountSetup': {
                                'isCompleted': False,
                                'currentStep': 0,
                                'completedSteps': []
                            },
                            'authProvider': 'email',
                            'emailVerified': False,
                            'notifications': {
                                'email': True,
                                'sms': True,
                                'push': True,
                                'whatsapp': True
                            },
                            'preferences': {
                                'language': 'tr',
                                'theme': 'light'
                            },
                            'createdAt': firestore.SERVER_TIMESTAMP,
                            'updatedAt': firestore.SERVER_TIMESTAMP,
                            'lastSync': firestore.SERVER_TIMESTAMP
                        }
                        
                        # Remove empty fields
                        user_data = {k: v for k, v in user_data.items() if v}
                        
                        doc_ref = self.db.collection('users').document(doc_id)
                        batch.set(doc_ref, user_data, merge=True)
                        batch_count += 1
                        
                        if batch_count >= 500:
                            batch.commit()
                            batch = self.db.batch()
                            batch_count = 0
                            logger.info(f"Committed batch of 500 users")
                        
                        self.stats['users'] += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing patient row: {e}")
                        self.stats['errors'].append(str(e))
                
                # Commit remaining batch
                if batch_count > 0:
                    batch.commit()
                    
            logger.info(f"✓ Imported {self.stats['users']} users")
            
        except Exception as e:
            logger.error(f"Failed to import patients: {e}")
            self.stats['errors'].append(str(e))
    
    def import_medical_records(self):
        """Import medical records with proper categorization"""
        medical_file = self.data_dir / 'medikal_bilgiler_latest.csv'
        
        if not medical_file.exists():
            logger.warning(f"Medical records file not found: {medical_file}")
            return
        
        logger.info("📥 Importing medical records...")
        
        try:
            with open(medical_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read().replace('\ufeff', '')
                
                import csv
                from io import StringIO
                reader = csv.DictReader(StringIO(content), delimiter=';')
                
                batch = self.db.batch()
                batch_count = 0
                
                for row in reader:
                    try:
                        protocol_no = row.get('Protokol No', '').strip()
                        if not protocol_no:
                            continue
                        
                        # Determine category based on content
                        category = self.determine_medical_category(row)
                        
                        record_data = {
                            'protocolNo': protocol_no,
                            'patientTcNo': row.get('Hasta Kimlik Numarası', ''),
                            'patientName': f"{row.get('Hasta Adı', '')} {row.get('Hasta Soyadı', '')}".strip(),
                            'date': self.parse_date(row.get('Protokol Tarihi', '')),
                            'medicalHistory': row.get('Hikayesi', ''),
                            'complaint': row.get('Şikayeti', ''),
                            'personalHistory': row.get('Özgeçmiş', ''),
                            'familyHistory': row.get('Soygeçmiş', ''),
                            'findings': row.get('Bulgular', ''),
                            'treatments': row.get('Uygulamalar', ''),
                            'recommendations': row.get('Öneriler', ''),
                            'notes': row.get('Notlar', ''),
                            'diagnosisCodes': row.get('Tanı Kodları', ''),
                            'recordType': 'medical_examination',
                            'category': category,
                            'source': 'bulut_klinik',
                            'createdAt': firestore.SERVER_TIMESTAMP,
                            'updatedAt': firestore.SERVER_TIMESTAMP
                        }
                        
                        # Link to user
                        tc_no = row.get('Hasta Kimlik Numarası', '')
                        if tc_no:
                            user_query = self.db.collection('users').where('personalInfo.tcKimlik', '==', tc_no).limit(1).get()
                            if user_query:
                                record_data['userId'] = user_query[0].id
                        
                        doc_ref = self.db.collection('health_records').document()
                        batch.set(doc_ref, record_data)
                        batch_count += 1
                        
                        if batch_count >= 500:
                            batch.commit()
                            batch = self.db.batch()
                            batch_count = 0
                        
                        self.stats['health_records'] += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing medical record: {e}")
                        self.stats['errors'].append(str(e))
                
                if batch_count > 0:
                    batch.commit()
                    
            logger.info(f"✓ Imported {self.stats['health_records']} health records")
            
        except Exception as e:
            logger.error(f"Failed to import medical records: {e}")
            self.stats['errors'].append(str(e))
    
    def import_financial_records(self):
        """Import financial records"""
        financial_file = self.data_dir / 'tahsilatlar_latest.csv'
        
        if not financial_file.exists():
            logger.warning(f"Financial records file not found: {financial_file}")
            return
        
        logger.info("📥 Importing financial records...")
        
        try:
            with open(financial_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read().replace('\ufeff', '')
                
                import csv
                from io import StringIO
                reader = csv.DictReader(StringIO(content), delimiter=';')
                
                batch = self.db.batch()
                batch_count = 0
                
                for row in reader:
                    try:
                        protocol_no = row.get('Protokol_No', '').strip()
                        if not protocol_no:
                            continue
                        
                        amount_str = row.get('Ödenen_Miktar', '0').replace(',', '.')
                        try:
                            amount = float(amount_str)
                        except:
                            amount = 0
                        
                        record_data = {
                            'protocolNo': protocol_no,
                            'patientNo': row.get('Hasta_No', ''),
                            'patientName': f"{row.get('Hasta_Adı', '')} {row.get('Hasta_Soyadı', '')}".strip(),
                            'amount': amount,
                            'currency': row.get('Cinsi', 'TL'),
                            'date': self.parse_date(row.get('Tarihi', '')),
                            'transactionType': 'payment',
                            'paymentMethod': 'cash',
                            'description': f"Protokol {protocol_no} ödemesi",
                            'source': 'bulut_klinik',
                            'createdAt': firestore.SERVER_TIMESTAMP,
                            'updatedAt': firestore.SERVER_TIMESTAMP
                        }
                        
                        doc_ref = self.db.collection('financial_records').document()
                        batch.set(doc_ref, record_data)
                        batch_count += 1
                        
                        if batch_count >= 500:
                            batch.commit()
                            batch = self.db.batch()
                            batch_count = 0
                        
                        self.stats['financial_records'] += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing financial record: {e}")
                        self.stats['errors'].append(str(e))
                
                if batch_count > 0:
                    batch.commit()
                    
            logger.info(f"✓ Imported {self.stats['financial_records']} financial records")
            
        except Exception as e:
            logger.error(f"Failed to import financial records: {e}")
            self.stats['errors'].append(str(e))
    
    def import_appointments(self):
        """Import appointments from protokoller"""
        protocols_file = self.data_dir / 'protokoller_latest.csv'
        
        if not protocols_file.exists():
            logger.warning(f"Protocols file not found: {protocols_file}")
            return
        
        logger.info("📥 Importing appointments...")
        
        try:
            with open(protocols_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read().replace('\ufeff', '')
                
                import csv
                from io import StringIO
                reader = csv.DictReader(StringIO(content), delimiter=';')
                
                batch = self.db.batch()
                batch_count = 0
                
                for row in reader:
                    try:
                        # Parse appointment data from protocol
                        appointment_data = {
                            'protocolNo': row.get('Protokol_No', ''),
                            'patientId': f"patient_{row.get('Hasta_No', '')}",
                            'patientName': row.get('Hasta_Adı', ''),
                            'date': self.parse_date(row.get('Tarih', '')),
                            'status': 'completed',
                            'appointmentType': row.get('Hizmet_Tipi', 'muayene'),
                            'doctorName': 'Dr. Özlem Mürzeoğlu',
                            'notes': row.get('Notlar', ''),
                            'source': 'bulut_klinik',
                            'createdAt': firestore.SERVER_TIMESTAMP,
                            'updatedAt': firestore.SERVER_TIMESTAMP
                        }
                        
                        doc_ref = self.db.collection('appointments').document()
                        batch.set(doc_ref, appointment_data)
                        batch_count += 1
                        
                        if batch_count >= 500:
                            batch.commit()
                            batch = self.db.batch()
                            batch_count = 0
                        
                        self.stats['appointments'] += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing appointment: {e}")
                        self.stats['errors'].append(str(e))
                
                if batch_count > 0:
                    batch.commit()
                    
            logger.info(f"✓ Imported {self.stats['appointments']} appointments")
            
        except Exception as e:
            logger.error(f"Failed to import appointments: {e}")
            self.stats['errors'].append(str(e))
    
    def determine_medical_category(self, record):
        """Determine medical record category based on content"""
        complaint = (record.get('Şikayeti', '') or '').lower()
        diagnosis = (record.get('Tanı Kodları', '') or '').lower()
        treatments = (record.get('Uygulamalar', '') or '').lower()
        
        if 'aşı' in complaint or 'aşı' in treatments:
            return 'vaccination'
        elif 'kontrol' in complaint or 'rutin' in complaint:
            return 'routine_checkup'
        elif 'j0' in diagnosis or 'öksür' in complaint or 'ateş' in complaint:
            return 'respiratory'
        elif 'k' in diagnosis or 'ishal' in complaint or 'kusma' in complaint:
            return 'gastrointestinal'
        elif 'alerji' in complaint or 'l' in diagnosis:
            return 'allergy'
        elif 'büyüme' in complaint or 'kilo' in complaint:
            return 'growth_development'
        else:
            return 'general_examination'
    
    def parse_date(self, date_str):
        """Parse date string to Firestore timestamp"""
        if not date_str:
            return firestore.SERVER_TIMESTAMP
        
        try:
            # Try different date formats
            for fmt in ['%Y-%m-%d %H:%M:%S', '%Y-%m-%d', '%d.%m.%Y', '%d/%m/%Y']:
                try:
                    dt = datetime.strptime(date_str, fmt)
                    return dt
                except:
                    continue
            return firestore.SERVER_TIMESTAMP
        except:
            return firestore.SERVER_TIMESTAMP
    
    def generate_report(self):
        """Generate import report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'statistics': self.stats,
            'status': 'success' if not self.stats['errors'] else 'completed_with_errors'
        }
        
        # Write report
        report_file = Path('import_report.json')
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        # Write markdown report for GitHub Actions
        md_report = f"""## 📊 Firestore Import Report with Bright Futures Integration

**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

### Basic Data Statistics:
- Users: {self.stats['users']}
- Health Records: {self.stats['health_records']}
- Financial Records: {self.stats['financial_records']}
- Appointments: {self.stats['appointments']}
- Growth Tracking: {self.stats['growth_tracking']}

### Bright Futures Data Statistics:
- BF Patient Visits: {self.stats['bf_patient_visits']}
- BF Patient Vaccinations: {self.stats['bf_patient_vaccinations']}
- BF Screening Assessments: {self.stats['bf_screening_assessments']}
- BF Milestone Tracking: {self.stats['bf_milestone_tracking']}

### Status: {'✅ Success' if not self.stats['errors'] else '⚠️ Completed with errors'}

{f"### Errors: {len(self.stats['errors'])}" if self.stats['errors'] else ""}
"""
        
        with open('sync_report.md', 'w', encoding='utf-8') as f:
            f.write(md_report)
        
        logger.info("\n" + "="*70)
        logger.info("IMPORT SUMMARY WITH BRIGHT FUTURES INTEGRATION")
        logger.info("="*70)
        logger.info("BASIC DATA:")
        logger.info(f"  Users: {self.stats['users']}")
        logger.info(f"  Health Records: {self.stats['health_records']}")
        logger.info(f"  Financial Records: {self.stats['financial_records']}")
        logger.info(f"  Appointments: {self.stats['appointments']}")
        logger.info(f"  Growth Tracking: {self.stats['growth_tracking']}")
        logger.info("BRIGHT FUTURES DATA:")
        logger.info(f"  BF Patient Visits: {self.stats['bf_patient_visits']}")
        logger.info(f"  BF Patient Vaccinations: {self.stats['bf_patient_vaccinations']}")
        logger.info(f"  BF Screening Assessments: {self.stats['bf_screening_assessments']}")
        logger.info(f"  BF Milestone Tracking: {self.stats['bf_milestone_tracking']}")
        logger.info(f"Duplicates Removed: {self.stats['duplicates_removed']}")
        if self.stats['errors']:
            logger.warning(f"Errors: {len(self.stats['errors'])}")
        logger.info("="*70)
    
    def import_growth_tracking(self):
        """Extract and import growth tracking data from medical records"""
        medical_file = self.data_dir / 'medikal_bilgiler_latest.csv'
        
        if not medical_file.exists():
            logger.warning(f"Medical records file not found: {medical_file}")
            return
        
        logger.info("📥 Extracting growth tracking data...")
        
        try:
            with open(medical_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read().replace('\ufeff', '')
                
                import csv
                from io import StringIO
                reader = csv.DictReader(StringIO(content), delimiter=';')
                
                batch = self.db.batch()
                batch_count = 0
                
                for row in reader:
                    try:
                        findings = row.get('Bulgular', '')
                        if not findings:
                            continue
                        
                        # Extract growth measurements
                        growth_data = self.extract_growth_measurements(findings)
                        
                        if growth_data['weight'] or growth_data['height'] or growth_data['head_circumference']:
                            record_data = {
                                'patientTcNo': row.get('Hasta Kimlik Numarası', ''),
                                'patientName': f"{row.get('Hasta Adı', '')} {row.get('Hasta Soyadı', '')}".strip(),
                                'protocolNo': row.get('Protokol No', ''),
                                'measurementDate': self.parse_date(row.get('Protokol Tarihi', '')),
                                'weight': growth_data['weight'],
                                'weightUnit': 'kg' if growth_data['weight'] else None,
                                'height': growth_data['height'],
                                'heightUnit': 'cm' if growth_data['height'] else None,
                                'headCircumference': growth_data['head_circumference'],
                                'headCircumferenceUnit': 'cm' if growth_data['head_circumference'] else None,
                                'bmi': growth_data['bmi'],
                                'originalFindings': findings[:500],
                                'source': 'medikal_bilgiler',
                                'createdAt': firestore.SERVER_TIMESTAMP,
                                'updatedAt': firestore.SERVER_TIMESTAMP
                            }
                            
                            # Remove null values
                            record_data = {k: v for k, v in record_data.items() if v is not None}
                            
                            doc_id = f"{row.get('Hasta Kimlik Numarası', '')}_{row.get('Protokol No', '')}"
                            doc_ref = self.db.collection('growth_tracking').document(doc_id)
                            batch.set(doc_ref, record_data, merge=True)
                            batch_count += 1
                            
                            if batch_count >= 500:
                                batch.commit()
                                batch = self.db.batch()
                                batch_count = 0
                            
                            self.stats['growth_tracking'] += 1
                    
                    except Exception as e:
                        logger.error(f"Error processing growth record: {e}")
                        self.stats['errors'].append(str(e))
                
                if batch_count > 0:
                    batch.commit()
                    
            logger.info(f"✓ Imported {self.stats['growth_tracking']} growth tracking records")
            
        except Exception as e:
            logger.error(f"Failed to import growth tracking: {e}")
            self.stats['errors'].append(str(e))
    
    def extract_growth_measurements(self, findings):
        """Extract weight, height, head circumference from findings text"""
        import re
        
        data = {
            'weight': None,
            'height': None,
            'head_circumference': None,
            'bmi': None
        }
        
        if not findings:
            return data
        
        # Extract weight (kg or g)
        weight_match = re.search(r'(\d+(?:[.,]\d+)?)\s*(kg|g)(?:\s|$)', findings, re.IGNORECASE)
        if weight_match:
            weight = float(weight_match.group(1).replace(',', '.'))
            if weight_match.group(2).lower() == 'g':
                weight = weight / 1000
            data['weight'] = weight
        
        # Extract height (cm)
        height_match = re.search(r'(\d+(?:[.,]\d+)?)\s*cm', findings, re.IGNORECASE)
        if height_match:
            data['height'] = float(height_match.group(1).replace(',', '.'))
        
        # Extract head circumference (usually 3rd cm value)
        cm_matches = re.findall(r'(\d+(?:[.,]\d+)?)\s*cm', findings, re.IGNORECASE)
        if len(cm_matches) >= 3:
            data['head_circumference'] = float(cm_matches[2].replace(',', '.'))
        
        # Calculate BMI
        if data['weight'] and data['height']:
            height_m = data['height'] / 100
            data['bmi'] = round(data['weight'] / (height_m * height_m), 1)
        
        return data
    
    def import_bright_futures_data(self):
        """Import Bright Futures data from medical records"""
        logger.info("📥 Importing Bright Futures data...")
        
        # Import BF patient visits
        self.import_bf_patient_visits()
        
        # Import BF vaccinations
        self.import_bf_patient_vaccinations()
        
        # Import BF screening assessments
        self.import_bf_screening_assessments()
        
        # Import BF milestone tracking
        self.import_bf_milestone_tracking()
    
    def import_bf_patient_visits(self):
        """Map appointments to BF patient visits"""
        logger.info("📥 Mapping appointments to BF patient visits...")
        
        try:
            # Get existing appointments
            appointments = self.db.collection('appointments').get()
            
            batch = self.db.batch()
            batch_count = 0
            
            for appointment in appointments:
                appointment_data = appointment.data()
                
                # Create BF visit based on appointment data
                bf_visit_data = {
                    'patientId': appointment_data.get('patientId', ''),
                    'patientName': appointment_data.get('patientName', ''),
                    'visitDate': appointment_data.get('date'),
                    'visitType': self.determine_bf_visit_type(appointment_data),
                    'status': 'completed' if appointment_data.get('status') == 'completed' else 'scheduled',
                    'doctorName': appointment_data.get('doctorName', 'Dr. Özlem Mürzeoğlu'),
                    'notes': appointment_data.get('notes', ''),
                    'source': 'bulut_klinik_appointment',
                    'originalAppointmentId': appointment.id,
                    'createdAt': firestore.SERVER_TIMESTAMP,
                    'updatedAt': firestore.SERVER_TIMESTAMP
                }
                
                # Determine age-based visit category
                bf_visit_data['ageCategory'] = self.determine_age_category_from_visit(appointment_data)
                
                doc_ref = self.db.collection('bf_patient_visits').document()
                batch.set(doc_ref, bf_visit_data)
                batch_count += 1
                
                if batch_count >= 500:
                    batch.commit()
                    batch = self.db.batch()
                    batch_count = 0
                
                self.stats['bf_patient_visits'] += 1
            
            if batch_count > 0:
                batch.commit()
                
            logger.info(f"✓ Imported {self.stats['bf_patient_visits']} BF patient visits")
            
        except Exception as e:
            logger.error(f"Failed to import BF patient visits: {e}")
            self.stats['errors'].append(str(e))
    
    def import_bf_patient_vaccinations(self):
        """Map vaccination records to BF patient vaccinations"""
        logger.info("📥 Mapping vaccination records to BF patient vaccinations...")
        
        try:
            # Get medical records that contain vaccination info
            medical_records = self.db.collection('health_records').where('category', '==', 'vaccination').get()
            
            batch = self.db.batch()
            batch_count = 0
            
            for record in medical_records:
                record_data = record.data()
                
                # Extract vaccination information
                vaccination_info = self.extract_vaccination_info(record_data)
                
                if vaccination_info:
                    bf_vaccination_data = {
                        'patientId': record_data.get('userId', ''),
                        'patientName': record_data.get('patientName', ''),
                        'vaccineName': vaccination_info.get('vaccine_name', ''),
                        'vaccinationDate': record_data.get('date'),
                        'ageAtVaccination': vaccination_info.get('age_at_vaccination', ''),
                        'doseNumber': vaccination_info.get('dose_number', 1),
                        'administeredBy': record_data.get('doctorName', 'Dr. Özlem Mürzeoğlu'),
                        'notes': record_data.get('notes', ''),
                        'source': 'bulut_klinik_medical_record',
                        'originalRecordId': record.id,
                        'createdAt': firestore.SERVER_TIMESTAMP,
                        'updatedAt': firestore.SERVER_TIMESTAMP
                    }
                    
                    doc_ref = self.db.collection('bf_patient_vaccinations').document()
                    batch.set(doc_ref, bf_vaccination_data)
                    batch_count += 1
                    
                    if batch_count >= 500:
                        batch.commit()
                        batch = self.db.batch()
                        batch_count = 0
                    
                    self.stats['bf_patient_vaccinations'] += 1
            
            if batch_count > 0:
                batch.commit()
                
            logger.info(f"✓ Imported {self.stats['bf_patient_vaccinations']} BF vaccinations")
            
        except Exception as e:
            logger.error(f"Failed to import BF vaccinations: {e}")
            self.stats['errors'].append(str(e))
    
    def import_bf_screening_assessments(self):
        """Extract screening assessments from medical records"""
        logger.info("📥 Extracting screening assessments from medical records...")
        
        try:
            # Get all medical records
            medical_records = self.db.collection('health_records').get()
            
            batch = self.db.batch()
            batch_count = 0
            
            for record in medical_records:
                record_data = record.data()
                
                # Look for screening indicators in medical notes
                screening_data = self.extract_screening_data(record_data)
                
                if screening_data:
                    bf_screening_data = {
                        'patientId': record_data.get('userId', ''),
                        'patientName': record_data.get('patientName', ''),
                        'screeningType': screening_data.get('type', ''),
                        'screeningDate': record_data.get('date'),
                        'ageAtScreening': screening_data.get('age_at_screening', ''),
                        'results': screening_data.get('results', ''),
                        'recommendations': screening_data.get('recommendations', ''),
                        'followUpRequired': screening_data.get('follow_up_required', False),
                        'administeredBy': 'Dr. Özlem Mürzeoğlu',
                        'notes': screening_data.get('notes', ''),
                        'source': 'bulut_klinik_medical_record',
                        'originalRecordId': record.id,
                        'createdAt': firestore.SERVER_TIMESTAMP,
                        'updatedAt': firestore.SERVER_TIMESTAMP
                    }
                    
                    doc_ref = self.db.collection('bf_screening_assessments').document()
                    batch.set(doc_ref, bf_screening_data)
                    batch_count += 1
                    
                    if batch_count >= 500:
                        batch.commit()
                        batch = self.db.batch()
                        batch_count = 0
                    
                    self.stats['bf_screening_assessments'] += 1
            
            if batch_count > 0:
                batch.commit()
                
            logger.info(f"✓ Imported {self.stats['bf_screening_assessments']} BF screening assessments")
            
        except Exception as e:
            logger.error(f"Failed to import BF screening assessments: {e}")
            self.stats['errors'].append(str(e))
    
    def import_bf_milestone_tracking(self):
        """Map growth tracking to milestone tracking"""
        logger.info("📥 Mapping growth data to milestone tracking...")
        
        try:
            # Get existing growth tracking records
            growth_records = self.db.collection('growth_tracking').get()
            
            batch = self.db.batch()
            batch_count = 0
            
            for record in growth_records:
                record_data = record.data()
                
                # Create milestone tracking entry
                milestone_data = {
                    'patientId': record_data.get('patientTcNo', ''),
                    'patientName': record_data.get('patientName', ''),
                    'measurementDate': record_data.get('measurementDate'),
                    'ageAtMeasurement': self.calculate_age_from_measurement(record_data),
                    'weight': record_data.get('weight'),
                    'weightUnit': record_data.get('weightUnit', 'kg'),
                    'height': record_data.get('height'),
                    'heightUnit': record_data.get('heightUnit', 'cm'),
                    'headCircumference': record_data.get('headCircumference'),
                    'headCircumferenceUnit': record_data.get('headCircumferenceUnit', 'cm'),
                    'bmi': record_data.get('bmi'),
                    'percentiles': self.calculate_percentiles(record_data),
                    'developmentalMilestones': self.extract_developmental_milestones(record_data),
                    'source': 'bulut_klinik_growth_tracking',
                    'originalRecordId': record.id,
                    'createdAt': firestore.SERVER_TIMESTAMP,
                    'updatedAt': firestore.SERVER_TIMESTAMP
                }
                
                doc_ref = self.db.collection('bf_milestone_tracking').document()
                batch.set(doc_ref, milestone_data)
                batch_count += 1
                
                if batch_count >= 500:
                    batch.commit()
                    batch = self.db.batch()
                    batch_count = 0
                
                self.stats['bf_milestone_tracking'] += 1
            
            if batch_count > 0:
                batch.commit()
                
            logger.info(f"✓ Imported {self.stats['bf_milestone_tracking']} BF milestone tracking records")
            
        except Exception as e:
            logger.error(f"Failed to import BF milestone tracking: {e}")
            self.stats['errors'].append(str(e))
    
    def determine_bf_visit_type(self, appointment_data):
        """Determine Bright Futures visit type based on appointment data"""
        appointment_type = (appointment_data.get('appointmentType', '') or '').lower()
        notes = (appointment_data.get('notes', '') or '').lower()
        
        if 'aşı' in notes or 'vaccination' in appointment_type:
            return 'vaccination'
        elif 'kontrol' in notes or 'checkup' in appointment_type:
            return 'well_child_visit'
        elif 'büyüme' in notes or 'growth' in notes:
            return 'growth_development'
        else:
            return 'routine_examination'
    
    def determine_age_category_from_visit(self, appointment_data):
        """Determine age category for BF visit"""
        # This would need actual patient birth date calculation
        # For now, return a default category
        return 'unknown'
    
    def extract_vaccination_info(self, record_data):
        """Extract vaccination information from medical record"""
        findings = (record_data.get('findings', '') or '').lower()
        treatments = (record_data.get('treatments', '') or '').lower()
        
        if 'aşı' in findings or 'aşı' in treatments or 'vaccination' in findings:
            return {
                'vaccine_name': self.extract_vaccine_name(findings + ' ' + treatments),
                'dose_number': 1,
                'age_at_vaccination': 'unknown'
            }
        return None
    
    def extract_vaccine_name(self, text):
        """Extract vaccine name from text"""
        common_vaccines = ['hepatit', 'bcg', 'dtp', 'kızamık', 'suçiçeği', 'grip']
        for vaccine in common_vaccines:
            if vaccine in text.lower():
                return vaccine
        return 'unknown_vaccine'
    
    def extract_screening_data(self, record_data):
        """Extract screening data from medical record"""
        findings = (record_data.get('findings', '') or '').lower()
        history = (record_data.get('medicalHistory', '') or '').lower()
        notes = (record_data.get('notes', '') or '').lower()
        
        full_text = f"{findings} {history} {notes}"
        
        # Look for M-CHAT-R or ASQ-3 mentions
        if 'm-chat' in full_text or 'mchat' in full_text:
            return {
                'type': 'M-CHAT-R',
                'age_at_screening': 'unknown',
                'results': 'mentioned in notes',
                'notes': full_text[:500],
                'follow_up_required': 'takip' in full_text or 'follow' in full_text
            }
        elif 'asq' in full_text or 'ages and stages' in full_text:
            return {
                'type': 'ASQ-3',
                'age_at_screening': 'unknown', 
                'results': 'mentioned in notes',
                'notes': full_text[:500],
                'follow_up_required': 'takip' in full_text or 'follow' in full_text
            }
        elif 'gelişim' in full_text or 'development' in full_text:
            return {
                'type': 'developmental_screening',
                'age_at_screening': 'unknown',
                'results': 'developmental assessment noted',
                'notes': full_text[:500],
                'follow_up_required': False
            }
        
        return None
    
    def calculate_age_from_measurement(self, record_data):
        """Calculate age from measurement data"""
        # This would require birth date - returning placeholder for now
        return 'unknown'
    
    def calculate_percentiles(self, record_data):
        """Calculate growth percentiles"""
        # This would require proper percentile calculation
        return {
            'weight_percentile': None,
            'height_percentile': None,
            'head_circumference_percentile': None,
            'bmi_percentile': None
        }
    
    def extract_developmental_milestones(self, record_data):
        """Extract developmental milestones from growth tracking"""
        findings = (record_data.get('originalFindings', '') or '').lower()
        
        milestones = []
        
        # Look for common developmental indicators
        if 'yürüme' in findings or 'walking' in findings:
            milestones.append('walking')
        if 'konuşma' in findings or 'talking' in findings:
            milestones.append('talking')
        if 'oturma' in findings or 'sitting' in findings:
            milestones.append('sitting')
            
        return milestones

    def remove_duplicates(self):
        """Check and remove duplicate records from collections"""
        logger.info("🔍 Checking for duplicates...")
        
        collections_to_check = ['appointments', 'health_records', 'financial_records', 
                               'bf_patient_visits', 'bf_patient_vaccinations', 
                               'bf_screening_assessments', 'bf_milestone_tracking']
        
        for collection_name in collections_to_check:
            try:
                docs = self.db.collection(collection_name).get()
                seen = {}
                duplicates = []
                
                for doc in docs:
                    data = doc.data()
                    
                    # Create unique key based on collection type
                    if collection_name == 'appointments':
                        key = f"{data.get('patientId', '')}_{data.get('date', {}).get('_seconds', '')}"
                    elif collection_name == 'health_records':
                        key = data.get('protocolNo', '')
                    elif collection_name == 'financial_records':
                        key = data.get('protocolNo', '')
                    else:
                        continue
                    
                    if key and key in seen:
                        duplicates.append(doc.id)
                    elif key:
                        seen[key] = doc.id
                
                # Remove duplicates
                if duplicates:
                    batch = self.db.batch()
                    for doc_id in duplicates[:500]:  # Batch limit
                        batch.delete(self.db.collection(collection_name).document(doc_id))
                    batch.commit()
                    
                    self.stats['duplicates_removed'] += len(duplicates)
                    logger.info(f"  Removed {len(duplicates)} duplicates from {collection_name}")
                    
            except Exception as e:
                logger.error(f"Error checking duplicates in {collection_name}: {e}")
                self.stats['errors'].append(str(e))
        
        logger.info(f"✓ Removed {self.stats['duplicates_removed']} total duplicates")
    
    def run(self):
        """Run the complete import process"""
        logger.info("🚀 Starting Enhanced Firestore Import with Bright Futures Integration")
        
        if not self.initialize_firebase():
            logger.error("Failed to initialize Firebase. Exiting.")
            return False
        
        # Import all data types
        self.import_patients_as_users()
        self.import_medical_records()
        self.import_financial_records()
        self.import_appointments()
        self.import_growth_tracking()  # Import growth data
        
        # Import Bright Futures data
        self.import_bright_futures_data()  # NEW: Import BF data
        
        # Remove duplicates
        self.remove_duplicates()
        
        # Generate report
        self.generate_report()
        
        logger.info("✅ Import process completed")
        return True

def main():
    """Main entry point"""
    importer = EnhancedFirestoreImporter()
    success = importer.run()
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()