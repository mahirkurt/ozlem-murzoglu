#!/usr/bin/env python3
"""
Import BulutKlinik CSV data to Firestore
Complete data migration with relationship mapping
"""

import csv
import json
import os
import re
import hashlib
from datetime import datetime, date
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging

import firebase_admin
from firebase_admin import credentials, firestore, auth
import pandas as pd

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Firebase
def init_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        cred_path = Path("D:/GitHub Repos/Saglik-Petegim/apps/flutter_app/saglikpetegim-firebase-adminsdk-fbsvc-c6a289df06.json")
        if cred_path.exists():
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
            logger.info("Firebase initialized with service account")
        else:
            logger.error(f"Firebase service account not found at {cred_path}")
            raise FileNotFoundError(f"Service account file not found: {cred_path}")
    
    return firestore.client()

class BulutKlinikImporter:
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.db = init_firebase()
        self.stats = {
            "patients_imported": 0,
            "protocols_imported": 0,
            "services_imported": 0,
            "payments_imported": 0,
            "medical_records_imported": 0,
            "users_created": 0,
            "errors": []
        }
        
    def parse_date(self, date_str: str) -> Optional[datetime]:
        """Parse date from various formats"""
        if not date_str or date_str == "":
            return None
        
        # Clean the date string
        date_str = date_str.strip()
        
        formats = [
            "%d.%m.%Y",
            "%Y-%m-%d",
            "%d/%m/%Y",
            "%Y/%m/%d",
            "%d.%m.%Y %H:%M:%S",
            "%Y-%m-%d %H:%M:%S"
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        
        logger.warning(f"Could not parse date: {date_str}")
        return None
    
    def clean_phone(self, phone: str) -> str:
        """Clean and format phone number"""
        if not phone:
            return ""
        
        # Remove non-numeric characters
        phone = re.sub(r'[^0-9+]', '', str(phone).strip())
        
        # Turkish phone format
        if phone.startswith('0'):
            phone = '+9' + phone
        elif phone.startswith('5'):
            phone = '+90' + phone
        elif not phone.startswith('+'):
            phone = '+90' + phone
        
        return phone
    
    def generate_email(self, first_name: str, last_name: str, patient_id: str) -> str:
        """Generate unique email for users without email"""
        first = re.sub(r'[^a-zA-Z]', '', (first_name or "").lower())[:10]
        last = re.sub(r'[^a-zA-Z]', '', (last_name or "").lower())[:10]
        hash_id = hashlib.md5(str(patient_id).encode()).hexdigest()[:6]
        return f"{first}.{last}.{hash_id}@saglikpetegim.com"
    
    def import_patients(self) -> int:
        """Import patients from CSV to Firestore"""
        csv_file = self.data_dir / "hastalar_latest.csv"
        if not csv_file.exists():
            logger.error(f"Patients file not found: {csv_file}")
            return 0
        
        count = 0
        batch = self.db.batch()
        batch_size = 0
        
        try:
            # Read CSV with proper encoding
            with open(csv_file, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f, delimiter=';')
                
                for row in reader:
                    try:
                        # Parse patient data
                        patient_id = row.get('Hasta No', '').strip()
                        if not patient_id:
                            continue
                        
                        tc_kimlik = row.get('Kimlik Numarası', '').strip()
                        first_name = row.get('Adı', '').strip()
                        last_name = row.get('Soyadı', '').strip()
                        gender = row.get('Cinsiyeti', '').strip()
                        
                        # Create patient document
                        patient_data = {
                            'patientId': patient_id,
                            'tcKimlik': tc_kimlik,
                            'firstName': first_name,
                            'lastName': last_name,
                            'gender': 'male' if gender == 'Erkek' else 'female' if gender == 'Kadın' else 'other',
                            'nationality': row.get('Uyruğu', 'TÜRKİYE CUMHURİYETİ').strip() or 'TÜRKİYE CUMHURİYETİ',
                            'passportNo': row.get('Pasaport Numarası', '').strip(),
                            'dateOfBirth': self.parse_date(row.get('Doğum Tarihi', '')),
                            'placeOfBirth': row.get('Doğum Yeri', '').strip(),
                            'address': row.get('Adres', '').strip(),
                            'phone': self.clean_phone(row.get('Telefon No', '')),
                            'email': row.get('Eposta', '').strip(),
                            'bloodType': row.get('Kan Grubu', '').strip(),
                            'motherName': row.get('Anne Adı', '').strip(),
                            'fatherName': row.get('Baba Adı', '').strip(),
                            'maritalStatus': row.get('Medeni Hali', '').strip(),
                            'notes': row.get('Not', '').strip(),
                            'insurance': row.get('Anlaşmalı Kurum', '').strip(),
                            'registrationReason': row.get('Geliş Nedeni', '').strip(),
                            'medicalHistory': {
                                'personal': row.get('Özgeçmiş', '').strip(),
                                'family': row.get('Soygeçmiş', '').strip(),
                                'allergies': [a.strip() for a in row.get('Alerjiler', '').split(',') if a.strip()]
                            },
                            'isActive': True,
                            'dataSource': 'bulut_klinik',
                            'createdAt': firestore.SERVER_TIMESTAMP,
                            'updatedAt': firestore.SERVER_TIMESTAMP
                        }
                        
                        # Add to batch
                        doc_ref = self.db.collection('patients').document(patient_id)
                        batch.set(doc_ref, patient_data, merge=True)
                        batch_size += 1
                        
                        # Commit batch if size limit reached
                        if batch_size >= 500:
                            batch.commit()
                            logger.info(f"Committed batch of {batch_size} patients")
                            batch = self.db.batch()
                            batch_size = 0
                        
                        count += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing patient row: {e}")
                        self.stats["errors"].append(f"Patient import: {str(e)}")
            
            # Commit remaining batch
            if batch_size > 0:
                batch.commit()
                logger.info(f"Committed final batch of {batch_size} patients")
            
            logger.info(f"Imported {count} patients")
            self.stats["patients_imported"] = count
            return count
            
        except Exception as e:
            logger.error(f"Error importing patients: {e}")
            self.stats["errors"].append(f"Patients file: {str(e)}")
            return 0
    
    def import_protocols(self) -> int:
        """Import protocols from CSV to Firestore"""
        csv_file = self.data_dir / "protokoller_latest.csv"
        if not csv_file.exists():
            logger.warning(f"Protocols file not found: {csv_file}")
            return 0
        
        count = 0
        batch = self.db.batch()
        batch_size = 0
        
        try:
            with open(csv_file, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f, delimiter=';')
                
                for row in reader:
                    try:
                        # Process protocol data
                        protocol_data = {
                            'protocolNo': row.get('Protokol No', '').strip(),
                            'patientId': row.get('Hasta No', '').strip(),
                            'date': self.parse_date(row.get('Tarih', '')),
                            'doctorId': 'dr-ozlem-murzoglu',
                            'dataSource': 'bulut_klinik',
                            'createdAt': firestore.SERVER_TIMESTAMP,
                            'updatedAt': firestore.SERVER_TIMESTAMP
                        }
                        
                        # Add all other fields dynamically
                        for key, value in row.items():
                            if key not in ['Protokol No', 'Hasta No', 'Tarih']:
                                clean_key = key.replace(' ', '_').replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
                                protocol_data[clean_key] = value.strip() if value else ''
                        
                        doc_id = f"protocol_{row.get('Protokol No', count)}".replace(' ', '_')
                        doc_ref = self.db.collection('protocols').document(doc_id)
                        batch.set(doc_ref, protocol_data, merge=True)
                        batch_size += 1
                        
                        if batch_size >= 500:
                            batch.commit()
                            batch = self.db.batch()
                            batch_size = 0
                        
                        count += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing protocol: {e}")
                        self.stats["errors"].append(f"Protocol import: {str(e)}")
            
            if batch_size > 0:
                batch.commit()
            
            logger.info(f"Imported {count} protocols")
            self.stats["protocols_imported"] = count
            return count
            
        except Exception as e:
            logger.error(f"Error importing protocols: {e}")
            self.stats["errors"].append(f"Protocols file: {str(e)}")
            return 0
    
    def import_services(self) -> int:
        """Import services from CSV to Firestore"""
        csv_file = self.data_dir / "hizmetler_latest.csv"
        if not csv_file.exists():
            logger.warning(f"Services file not found: {csv_file}")
            return 0
        
        count = 0
        batch = self.db.batch()
        batch_size = 0
        
        try:
            with open(csv_file, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f, delimiter=';')
                
                for row in reader:
                    try:
                        # Process service data
                        service_data = {
                            'serviceId': row.get('Hizmet Kodu', '').strip(),
                            'serviceName': row.get('Hizmet Adı', row.get('Hizmet Adi', '')).strip(),
                            'dataSource': 'bulut_klinik',
                            'createdAt': firestore.SERVER_TIMESTAMP,
                            'updatedAt': firestore.SERVER_TIMESTAMP
                        }
                        
                        # Add all other fields
                        for key, value in row.items():
                            if key not in ['Hizmet Kodu', 'Hizmet Adı', 'Hizmet Adi']:
                                clean_key = key.replace(' ', '_').replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
                                service_data[clean_key] = value.strip() if value else ''
                        
                        doc_id = f"service_{row.get('Hizmet Kodu', count)}".replace(' ', '_')
                        doc_ref = self.db.collection('services').document(doc_id)
                        batch.set(doc_ref, service_data, merge=True)
                        batch_size += 1
                        
                        if batch_size >= 500:
                            batch.commit()
                            batch = self.db.batch()
                            batch_size = 0
                        
                        count += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing service: {e}")
                        self.stats["errors"].append(f"Service import: {str(e)}")
            
            if batch_size > 0:
                batch.commit()
            
            logger.info(f"Imported {count} services")
            self.stats["services_imported"] = count
            return count
            
        except Exception as e:
            logger.error(f"Error importing services: {e}")
            self.stats["errors"].append(f"Services file: {str(e)}")
            return 0
    
    def import_payments(self) -> int:
        """Import payments from CSV to Firestore"""
        csv_file = self.data_dir / "tahsilatlar_latest.csv"
        if not csv_file.exists():
            logger.warning(f"Payments file not found: {csv_file}")
            return 0
        
        count = 0
        batch = self.db.batch()
        batch_size = 0
        
        try:
            with open(csv_file, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f, delimiter=';')
                
                for row in reader:
                    try:
                        # Process payment data
                        payment_data = {
                            'paymentId': row.get('Tahsilat No', '').strip(),
                            'patientId': row.get('Hasta No', '').strip(),
                            'amount': row.get('Tutar', '').strip(),
                            'date': self.parse_date(row.get('Tarih', '')),
                            'dataSource': 'bulut_klinik',
                            'createdAt': firestore.SERVER_TIMESTAMP,
                            'updatedAt': firestore.SERVER_TIMESTAMP
                        }
                        
                        # Add all other fields
                        for key, value in row.items():
                            if key not in ['Tahsilat No', 'Hasta No', 'Tutar', 'Tarih']:
                                clean_key = key.replace(' ', '_').replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
                                payment_data[clean_key] = value.strip() if value else ''
                        
                        doc_id = f"payment_{row.get('Tahsilat No', count)}".replace(' ', '_')
                        doc_ref = self.db.collection('payments').document(doc_id)
                        batch.set(doc_ref, payment_data, merge=True)
                        batch_size += 1
                        
                        if batch_size >= 500:
                            batch.commit()
                            batch = self.db.batch()
                            batch_size = 0
                        
                        count += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing payment: {e}")
                        self.stats["errors"].append(f"Payment import: {str(e)}")
            
            if batch_size > 0:
                batch.commit()
            
            logger.info(f"Imported {count} payments")
            self.stats["payments_imported"] = count
            return count
            
        except Exception as e:
            logger.error(f"Error importing payments: {e}")
            self.stats["errors"].append(f"Payments file: {str(e)}")
            return 0
    
    def import_medical_records(self) -> int:
        """Import medical records from CSV to Firestore"""
        csv_file = self.data_dir / "medikal_bilgiler_latest.csv"
        if not csv_file.exists():
            logger.warning(f"Medical records file not found: {csv_file}")
            return 0
        
        count = 0
        batch = self.db.batch()
        batch_size = 0
        
        try:
            with open(csv_file, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f, delimiter=';')
                
                for row in reader:
                    try:
                        # Use actual column names from CSV
                        protokol_no = row.get('Protokol No', '').strip()
                        tc_kimlik = row.get('Hasta Kimlik Numarası', row.get('Hasta Kimlik Numaras�', '')).strip()
                        
                        if not protokol_no and not tc_kimlik:
                            continue
                        
                        record_data = {
                            'protokolNo': protokol_no,
                            'tcKimlik': tc_kimlik,
                            'patientName': f"{row.get('Hasta Adı', row.get('Hasta Ad�', ''))} {row.get('Hasta Soyadı', row.get('Hasta Soyad�', ''))}".strip(),
                            'doctorId': 'dr-ozlem-murzoglu',
                            'doctorName': 'Dr. Özlem Murzoğlu',
                            'date': self.parse_date(row.get('Protokol Tarihi', '')),
                            'history': row.get('Hikayesi', '').strip(),
                            'complaint': row.get('Şikayeti', row.get('�ikayeti', '')).strip(),
                            'personalHistory': row.get('Özgeçmiş', row.get('�zge�mi�', '')).strip(),
                            'familyHistory': row.get('Soygeçmiş', row.get('Soyge�mi�', '')).strip(),
                            'findings': row.get('Bulgular', '').strip(),
                            'procedures': row.get('Uygulamalar', '').strip(),
                            'recommendations': row.get('Öneriler', row.get('�neriler', '')).strip(),
                            'notes': row.get('Notlar', '').strip(),
                            'diagnosisCodes': row.get('Tanı Kodları', row.get('Tan� Kodlar�', '')).strip(),
                            'dataSource': 'bulut_klinik',
                            'createdAt': firestore.SERVER_TIMESTAMP,
                            'updatedAt': firestore.SERVER_TIMESTAMP
                        }
                        
                        # Generate document ID
                        date_str = row.get('Protokol Tarihi', '').replace('.', '_').replace(':', '_').replace(' ', '_')
                        doc_id = f"{protokol_no}_{tc_kimlik}_{count}".replace(' ', '_')
                        doc_ref = self.db.collection('medical_records').document(doc_id)
                        batch.set(doc_ref, record_data, merge=True)
                        batch_size += 1
                        
                        if batch_size >= 500:
                            batch.commit()
                            batch = self.db.batch()
                            batch_size = 0
                        
                        count += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing medical record: {e}")
                        self.stats["errors"].append(f"Medical record import: {str(e)}")
            
            if batch_size > 0:
                batch.commit()
            
            logger.info(f"Imported {count} medical records")
            self.stats["medical_records_imported"] = count
            return count
            
        except Exception as e:
            logger.error(f"Error importing medical records: {e}")
            self.stats["errors"].append(f"Medical records file: {str(e)}")
            return 0
    
    def create_parent_accounts(self) -> int:
        """Create parent user accounts for patients"""
        logger.info("Creating parent accounts...")
        count = 0
        
        try:
            # Get all patients
            patients = self.db.collection('patients').stream()
            
            # Group by parent info
            parents = {}
            for patient_doc in patients:
                patient = patient_doc.to_dict()
                
                # Use mother or father info for parent account
                parent_name = patient.get('motherName') or patient.get('fatherName')
                if not parent_name:
                    continue
                
                # Generate parent key
                parent_key = parent_name.lower().replace(' ', '')
                
                if parent_key not in parents:
                    parents[parent_key] = {
                        'name': parent_name,
                        'children': [],
                        'phone': patient.get('phone', ''),
                        'email': patient.get('email', '')
                    }
                
                parents[parent_key]['children'].append(patient_doc.id)
            
            # Create user accounts
            batch = self.db.batch()
            batch_size = 0
            
            for parent_key, parent_info in parents.items():
                try:
                    # Generate email if not exists
                    email = parent_info['email']
                    if not email:
                        email = self.generate_email(
                            parent_info['name'].split()[0] if parent_info['name'] else 'parent',
                            parent_info['name'].split()[-1] if parent_info['name'] else 'user',
                            parent_key
                        )
                    
                    # Create or update user document
                    user_data = {
                        'email': email,
                        'displayName': parent_info['name'],
                        'role': 'parent',
                        'children': parent_info['children'],
                        'phone': parent_info['phone'],
                        'accountStatus': 'active',
                        'emailVerified': False,
                        'createdAt': firestore.SERVER_TIMESTAMP,
                        'updatedAt': firestore.SERVER_TIMESTAMP
                    }
                    
                    # Use email hash as document ID
                    doc_id = hashlib.md5(email.encode()).hexdigest()
                    doc_ref = self.db.collection('users').document(doc_id)
                    batch.set(doc_ref, user_data, merge=True)
                    batch_size += 1
                    
                    if batch_size >= 500:
                        batch.commit()
                        logger.info(f"Created batch of {batch_size} parent accounts")
                        batch = self.db.batch()
                        batch_size = 0
                    
                    count += 1
                    
                except Exception as e:
                    logger.error(f"Error creating parent account: {e}")
                    self.stats["errors"].append(f"Parent account: {str(e)}")
            
            if batch_size > 0:
                batch.commit()
            
            logger.info(f"Created {count} parent accounts")
            self.stats["users_created"] = count
            return count
            
        except Exception as e:
            logger.error(f"Error creating parent accounts: {e}")
            self.stats["errors"].append(f"Parent accounts: {str(e)}")
            return 0
    
    def generate_report(self) -> str:
        """Generate import report"""
        report = f"""
# BulutKlinik to Firestore Import Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary
- Patients Imported: {self.stats['patients_imported']}
- Protocols Imported: {self.stats['protocols_imported']}
- Services Imported: {self.stats['services_imported']}
- Payments Imported: {self.stats['payments_imported']}
- Medical Records Imported: {self.stats['medical_records_imported']}
- Parent Accounts Created: {self.stats['users_created']}

## Errors ({len(self.stats['errors'])})
"""
        for error in self.stats['errors'][:20]:  # Show first 20 errors
            report += f"- {error}\n"
        
        if len(self.stats['errors']) > 20:
            report += f"\n... and {len(self.stats['errors']) - 20} more errors\n"
        
        return report
    
    def run_import(self):
        """Run complete import process"""
        logger.info("Starting BulutKlinik data import to Firestore...")
        
        # Import data in order
        self.import_patients()
        self.import_protocols()
        self.import_services()
        self.import_payments()
        self.import_medical_records()
        self.create_parent_accounts()
        
        # Generate and save report
        report = self.generate_report()
        report_file = self.data_dir / f"import_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        logger.info(f"Import complete. Report saved to {report_file}")
        print(report)
        
        return self.stats

if __name__ == "__main__":
    import sys
    
    data_dir = sys.argv[1] if len(sys.argv) > 1 else "data/bulut_klinik"
    
    importer = BulutKlinikImporter(data_dir)
    stats = importer.run_import()
    
    # Exit with error if no data imported
    if stats['patients_imported'] == 0:
        sys.exit(1)
    else:
        sys.exit(0)