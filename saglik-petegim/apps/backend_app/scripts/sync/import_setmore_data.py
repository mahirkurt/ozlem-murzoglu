#!/usr/bin/env python3
"""
Import Setmore appointment system data to Firestore
"""

import os
import sys
import json
import re
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Dict, List, Optional, Tuple
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SetmoreDataImporter:
    def __init__(self):
        """Initialize Firebase and load data files"""
        # Initialize Firebase
        self._initialize_firebase()
        
        # Data paths
        self.data_dir = Path(__file__).parent.parent.parent / 'data' / 'setmore'
        self.contacts_file = self.data_dir / 'Contacts.csv'
        self.appointments_file = self.data_dir / 'Appointments.xlsx'
        
        # Mapping dictionaries
        self.patient_mapping = {}  # setmore_name -> firestore_patient_id
        self.user_mapping = {}     # phone/email -> firestore_user_id
        
        # Statistics
        self.stats = {
            'contacts_processed': 0,
            'contacts_matched': 0,
            'contacts_created': 0,
            'users_created': 0,
            'appointments_processed': 0,
            'appointments_imported': 0,
            'errors': []
        }
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        cred_path = Path("D:/GitHub Repos/Saglik-Petegim/apps/flutter_app/saglikpetegim-firebase-adminsdk-fbsvc-c6a289df06.json")
        
        if not firebase_admin._apps:
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
        
        self.db = firestore.client()
        logger.info("Firebase initialized successfully")
    
    def normalize_phone(self, phone: str) -> str:
        """Normalize phone number to standard format"""
        if pd.isna(phone) or not phone:
            return ""
        
        # Convert to string and clean
        phone = str(phone).strip()
        
        # Remove country name prefixes
        phone = re.sub(r'(Türkiye|Turkey|Hollanda|Netherlands|Birleşik Krallık|UK|DEU|Germany)', '', phone)
        
        # Remove all non-digit characters except +
        phone = re.sub(r'[^\d+]', '', phone)
        
        # Handle double country codes
        phone = re.sub(r'\+90\+90', '+90', phone)
        phone = re.sub(r'\+31\+31', '+31', phone)
        
        # Add + if missing for international numbers
        if phone and not phone.startswith('+'):
            if phone.startswith('90') and len(phone) == 12:
                phone = '+' + phone
            elif phone.startswith('31') and len(phone) == 11:
                phone = '+' + phone
            elif phone.startswith('49') and len(phone) > 10:
                phone = '+' + phone
            elif phone.startswith('44') and len(phone) > 10:
                phone = '+' + phone
            elif phone.startswith('994') and len(phone) > 10:
                phone = '+' + phone
            elif phone.startswith('05') and len(phone) == 11:
                phone = '+9' + phone
            elif phone.startswith('5') and len(phone) == 10:
                phone = '+90' + phone
        
        return phone
    
    def parse_date(self, date_str: str) -> Optional[datetime]:
        """Parse various date formats"""
        if pd.isna(date_str) or not date_str:
            return None
        
        date_str = str(date_str).strip()
        
        # Try different formats
        formats = [
            '%d.%m.%Y',
            '%d/%m/%Y',
            '%d-%m-%Y',
            '%Y-%m-%d',
            '%d%m%Y',
            '%d-%b-%Y',
            '%d %b %Y'
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt)
            except:
                continue
        
        # Handle timestamp (milliseconds)
        try:
            if len(date_str) > 10 and date_str.isdigit():
                return datetime.fromtimestamp(int(date_str) / 1000)
        except:
            pass
        
        # Handle special format like "27052025"
        if len(date_str) == 8 and date_str.isdigit():
            try:
                day = date_str[:2]
                month = date_str[2:4]
                year = date_str[4:]
                return datetime.strptime(f"{day}/{month}/{year}", '%d/%m/%Y')
            except:
                pass
        
        logger.warning(f"Could not parse date: {date_str}")
        return None
    
    def validate_tc_number(self, tc: str) -> Optional[str]:
        """Validate and return TC number"""
        if pd.isna(tc) or not tc:
            return None
        
        tc = str(tc).strip()
        
        # Remove any decimal points from float conversion
        if '.' in tc:
            tc = tc.split('.')[0]
        
        # TC number should be 11 digits
        if tc.isdigit() and len(tc) == 11:
            return tc
        
        return None
    
    def parse_parent_names(self, parent_str: str) -> List[str]:
        """Extract parent names from combined string"""
        if pd.isna(parent_str) or not parent_str:
            return []
        
        parent_str = str(parent_str).strip()
        
        # Split by common separators
        names = re.split(r'[-,/]', parent_str)
        
        # Clean and filter
        names = [n.strip() for n in names if n.strip() and n.strip() != '&']
        
        return names
    
    def load_contacts(self) -> pd.DataFrame:
        """Load and clean contacts data"""
        logger.info(f"Loading contacts from {self.contacts_file}")
        
        # Read CSV with proper encoding and error handling
        df = pd.read_csv(self.contacts_file, encoding='utf-8', on_bad_lines='skip')
        
        # Clean column names
        df.columns = df.columns.str.strip()
        
        # Normalize phone numbers
        df['Phone_Normalized'] = df['Phone'].apply(self.normalize_phone)
        
        # Parse TC numbers
        df['TC_Validated'] = df['T.C. Kimlik No'].apply(self.validate_tc_number)
        
        # Parse birth dates
        df['Birth_Date_Parsed'] = df['Çocuk Doğ. Tar.'].apply(self.parse_date)
        
        logger.info(f"Loaded {len(df)} contacts")
        return df
    
    def load_appointments(self) -> pd.DataFrame:
        """Load and clean appointments data"""
        logger.info(f"Loading appointments from {self.appointments_file}")
        
        # Read Excel
        df = pd.read_excel(self.appointments_file)
        
        # Clean column names
        df.columns = df.columns.str.strip()
        
        # Parse appointment datetime
        def parse_appointment_datetime(row):
            try:
                date_str = str(row['Appointment date'])
                time_str = str(row['Appointment time'])
                
                # Parse date
                date_obj = pd.to_datetime(date_str)
                
                # Parse time (format: "03:00 PM - 04:00 PM")
                if '-' in time_str:
                    start_time = time_str.split('-')[0].strip()
                    end_time = time_str.split('-')[1].strip()
                    
                    # Convert to 24-hour format
                    start_dt = pd.to_datetime(f"{date_obj.date()} {start_time}", format='%Y-%m-%d %I:%M %p')
                    end_dt = pd.to_datetime(f"{date_obj.date()} {end_time}", format='%Y-%m-%d %I:%M %p')
                    
                    return start_dt, end_dt
                else:
                    return date_obj, date_obj + timedelta(hours=1)
            except Exception as e:
                logger.warning(f"Error parsing appointment datetime: {e}")
                return None, None
        
        # Apply datetime parsing
        df[['Start_DateTime', 'End_DateTime']] = df.apply(
            parse_appointment_datetime, axis=1, result_type='expand'
        )
        
        # Normalize phone numbers
        df['Phone_Normalized'] = df['Phone'].apply(self.normalize_phone)
        
        # Parse TC numbers
        df['TC_Validated'] = df['T.C. Kimlik No'].apply(self.validate_tc_number)
        
        # Classify service types
        def classify_service(service):
            if pd.isna(service):
                return 'unknown'
            service_lower = str(service).lower()
            if 'online' in service_lower:
                return 'online_consultation'
            elif 'kontrol' in service_lower:
                return 'followup'
            elif 'muayene' in service_lower or 'klinik' in service_lower:
                return 'clinical_visit'
            else:
                return 'other'
        
        df['Service_Type'] = df['Service/class/event'].apply(classify_service)
        
        logger.info(f"Loaded {len(df)} appointments")
        return df
    
    def match_patient(self, row: pd.Series) -> Optional[str]:
        """Match Setmore contact with existing Firestore patient"""
        # Try TC number match first
        if row.get('TC_Validated'):
            patients = self.db.collection('patients').where('tcNo', '==', row['TC_Validated']).limit(1).get()
            if patients:
                return patients[0].id
        
        # Try phone match
        if row.get('Phone_Normalized'):
            patients = self.db.collection('patients').where('phone', '==', row['Phone_Normalized']).limit(1).get()
            if patients:
                return patients[0].id
        
        # Try name match (fuzzy)
        if row.get('Name'):
            name_parts = row['Name'].lower().split()
            patients = self.db.collection('patients').get()
            for patient in patients:
                patient_data = patient.to_dict()
                patient_name = patient_data.get('name', '').lower()
                if all(part in patient_name for part in name_parts):
                    return patient.id
        
        return None
    
    def create_patient_from_setmore(self, row: pd.Series) -> str:
        """Create new patient record from Setmore data"""
        patient_data = {
            'name': row.get('Name', ''),
            'tcNo': row.get('TC_Validated', ''),
            'phone': row.get('Phone_Normalized', ''),
            'birthDate': row.get('Birth_Date_Parsed'),
            'address': row.get('Address', ''),
            'gender': 'Belirtilmemiş',
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
            'metadata': {
                'source': 'setmore_import',
                'importDate': firestore.SERVER_TIMESTAMP,
                'originalData': {
                    'email': row.get('Email', ''),
                    'email1': row.get('Email1', ''),
                    'phone1': row.get('Phone1', ''),
                    'phone2': row.get('Phone2', ''),
                    'phone3': row.get('Phone3', ''),
                    'company': row.get('Company', ''),
                    'parentName': row.get('Ebeveyn Adı', '')
                }
            }
        }
        
        # Remove None values
        patient_data = {k: v for k, v in patient_data.items() if v is not None and v != ''}
        
        # Create document
        doc_ref = self.db.collection('patients').add(patient_data)[1]
        logger.info(f"Created new patient: {row.get('Name')} -> {doc_ref.id}")
        
        return doc_ref.id
    
    def create_or_update_caregiver(self, row: pd.Series, patient_id: str):
        """Create or update caregiver user account"""
        # Determine email
        email = None
        for email_field in ['Email', 'Email1']:
            if row.get(email_field) and '@' in str(row.get(email_field)):
                email = row.get(email_field)
                break
        
        # If no email, generate one from phone
        phone = row.get('Phone_Normalized')
        if not email and phone:
            # Create a placeholder email
            phone_digits = re.sub(r'[^\d]', '', phone)
            email = f"setmore_{phone_digits}@saglikpetegim.app"
        
        if not email:
            return None
        
        # Check if user exists
        users = self.db.collection('users').where('email', '==', email).limit(1).get()
        
        if users:
            # Update existing user
            user_id = users[0].id
            user_data = users[0].to_dict()
            
            # Add child if not already linked
            children = user_data.get('children', [])
            if not any(c.get('patientId') == patient_id for c in children):
                children.append({
                    'patientId': patient_id,
                    'patientName': row.get('Name', ''),
                    'relationship': 'parent',
                    'accessLevel': 'full',
                    'isPrimaryCaregiver': True
                })
                
                self.db.collection('users').document(user_id).update({
                    'children': children,
                    'updatedAt': firestore.SERVER_TIMESTAMP
                })
                logger.info(f"Updated user {email} with child {patient_id}")
        else:
            # Create new user
            parent_names = self.parse_parent_names(row.get('Ebeveyn Adı', ''))
            first_name = parent_names[0] if parent_names else 'Veli'
            last_name = parent_names[1] if len(parent_names) > 1 else ''
            
            user_data = {
                'email': email,
                'role': 'caregiver',
                'accountType': 'caregiver',
                'accountStatus': 'active',
                'onboardingRequired': True,
                'personalInfo': {
                    'firstName': first_name,
                    'lastName': last_name,
                    'phone': phone or '',
                    'tcKimlik': '',
                    'addresses': []
                },
                'children': [{
                    'patientId': patient_id,
                    'patientName': row.get('Name', ''),
                    'relationship': 'parent',
                    'accessLevel': 'full',
                    'isPrimaryCaregiver': True
                }],
                'emergencyContacts': [],
                'dataUpdatePolicy': {
                    'allowSystemOverride': False,
                    'lockedFields': ['tcKimlik']
                },
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP,
                'metadata': {
                    'source': 'setmore_import',
                    'needsPasswordReset': True,
                    'needsEmailVerification': True
                }
            }
            
            doc_ref = self.db.collection('users').add(user_data)[1]
            logger.info(f"Created new user: {email} -> {doc_ref.id}")
            self.stats['users_created'] += 1
            
            return doc_ref.id
        
        return user_id if users else None
    
    def import_contacts(self):
        """Import all contacts from Setmore"""
        logger.info("Starting contact import...")
        
        contacts_df = self.load_contacts()
        
        for idx, row in contacts_df.iterrows():
            try:
                self.stats['contacts_processed'] += 1
                
                # Skip if no name
                if pd.isna(row.get('Name')):
                    continue
                
                # Try to match with existing patient
                patient_id = self.match_patient(row)
                
                if patient_id:
                    # Update existing patient with Setmore data
                    update_data = {}
                    
                    if row.get('Phone_Normalized') and not pd.isna(row.get('Phone_Normalized')):
                        update_data['phone'] = row['Phone_Normalized']
                    
                    if row.get('Address') and not pd.isna(row.get('Address')):
                        update_data['address'] = row['Address']
                    
                    if row.get('TC_Validated'):
                        update_data['tcNo'] = row['TC_Validated']
                    
                    if row.get('Birth_Date_Parsed'):
                        update_data['birthDate'] = row['Birth_Date_Parsed']
                    
                    if update_data:
                        update_data['updatedAt'] = firestore.SERVER_TIMESTAMP
                        update_data['metadata.setmoreImported'] = True
                        update_data['metadata.setmoreImportDate'] = firestore.SERVER_TIMESTAMP
                        
                        self.db.collection('patients').document(patient_id).update(update_data)
                        logger.info(f"Updated patient: {row['Name']} -> {patient_id}")
                    
                    self.stats['contacts_matched'] += 1
                else:
                    # Create new patient
                    patient_id = self.create_patient_from_setmore(row)
                    self.stats['contacts_created'] += 1
                
                # Store mapping
                self.patient_mapping[row['Name']] = patient_id
                
                # Create/update caregiver account
                if row.get('Email') or row.get('Email1') or row.get('Phone_Normalized'):
                    self.create_or_update_caregiver(row, patient_id)
                
            except Exception as e:
                logger.error(f"Error processing contact {row.get('Name')}: {e}")
                self.stats['errors'].append(f"Contact {row.get('Name')}: {str(e)}")
        
        logger.info(f"Contact import completed. Processed: {self.stats['contacts_processed']}, "
                   f"Matched: {self.stats['contacts_matched']}, Created: {self.stats['contacts_created']}")
    
    def import_appointments(self):
        """Import all appointments from Setmore"""
        logger.info("Starting appointment import...")
        
        appointments_df = self.load_appointments()
        
        for idx, row in appointments_df.iterrows():
            try:
                self.stats['appointments_processed'] += 1
                
                # Skip if no valid datetime
                if pd.isna(row.get('Start_DateTime')):
                    continue
                
                # Skip cancelled appointments (optional)
                # if row.get('Status') == 'Cancelled':
                #     continue
                
                # Find patient
                customer_name = row.get('Customer name')
                patient_id = None
                
                if customer_name and not pd.isna(customer_name):
                    # Check mapping first
                    patient_id = self.patient_mapping.get(customer_name)
                    
                    # Try to find by name if not in mapping
                    if not patient_id:
                        patients = self.db.collection('patients').where('name', '==', customer_name).limit(1).get()
                        if patients:
                            patient_id = patients[0].id
                            self.patient_mapping[customer_name] = patient_id
                
                # Create appointment record
                appointment_data = {
                    'appointmentId': f"setmore_{row.get('Booking ID', '')}",
                    'patientId': patient_id or 'unknown',
                    'patientName': customer_name or 'Unknown',
                    'appointmentDate': row['Start_DateTime'],
                    'appointmentTime': {
                        'start': row['Start_DateTime'].strftime('%H:%M'),
                        'end': row['End_DateTime'].strftime('%H:%M') if row.get('End_DateTime') else ''
                    },
                    'serviceType': row.get('Service_Type', 'unknown'),
                    'serviceName': row.get('Service/class/event', ''),
                    'status': row.get('Status', '').lower() if row.get('Status') else 'unknown',
                    'bookingSource': row.get('Booked from', '').lower().replace(' ', '_') if row.get('Booked from') else 'unknown',
                    'bookingId': row.get('Booking ID', ''),
                    'bookedOn': pd.to_datetime(row.get('Booked on')) if row.get('Booked on') else None,
                    'teamMember': 'Dr. Özlem Murzoğlu',
                    'contact': {
                        'phone': row.get('Phone_Normalized', ''),
                        'email': row.get('Email', ''),
                        'countryCode': row.get('Country code', '')
                    },
                    'notes': row.get('Comments', ''),
                    'metadata': {
                        'imported': True,
                        'importDate': firestore.SERVER_TIMESTAMP,
                        'source': 'setmore',
                        'originalData': {
                            'address': row.get('Address', ''),
                            'city': row.get('City', ''),
                            'country': row.get('Country', ''),
                            'zipcode': row.get('Zipcode / Postal code', ''),
                            'label': row.get('Label', ''),
                            'tc': row.get('TC_Validated', ''),
                            'parentName': row.get('Ebeveyn Adı', '')
                        }
                    }
                }
                
                # Remove None values
                appointment_data = {k: v for k, v in appointment_data.items() 
                                  if v is not None and v != '' and v != 'nan'}
                
                # Check if appointment already exists
                existing = self.db.collection('appointments_history')\
                    .where('bookingId', '==', row.get('Booking ID', ''))\
                    .limit(1).get()
                
                if not existing:
                    # Create appointment
                    self.db.collection('appointments_history').add(appointment_data)
                    logger.info(f"Created appointment: {row.get('Booking ID')} for {customer_name}")
                    self.stats['appointments_imported'] += 1
                else:
                    logger.info(f"Appointment already exists: {row.get('Booking ID')}")
                
            except Exception as e:
                logger.error(f"Error processing appointment {row.get('Booking ID')}: {e}")
                self.stats['errors'].append(f"Appointment {row.get('Booking ID')}: {str(e)}")
        
        logger.info(f"Appointment import completed. Processed: {self.stats['appointments_processed']}, "
                   f"Imported: {self.stats['appointments_imported']}")
    
    def generate_report(self):
        """Generate import report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'statistics': self.stats,
            'patient_mappings': self.patient_mapping,
            'errors': self.stats['errors']
        }
        
        report_file = self.data_dir / f'import_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False, default=str)
        
        logger.info(f"Import report saved to {report_file}")
        
        # Print summary
        print("\n" + "="*50)
        print("SETMORE DATA IMPORT SUMMARY")
        print("="*50)
        print(f"Contacts Processed: {self.stats['contacts_processed']}")
        print(f"  - Matched: {self.stats['contacts_matched']}")
        print(f"  - Created: {self.stats['contacts_created']}")
        print(f"Users Created: {self.stats['users_created']}")
        print(f"Appointments Processed: {self.stats['appointments_processed']}")
        print(f"  - Imported: {self.stats['appointments_imported']}")
        print(f"Errors: {len(self.stats['errors'])}")
        print("="*50)
    
    def run(self):
        """Run the complete import process"""
        try:
            logger.info("Starting Setmore data import...")
            
            # Phase 1: Import contacts
            self.import_contacts()
            
            # Phase 2: Import appointments
            self.import_appointments()
            
            # Phase 3: Generate report
            self.generate_report()
            
            logger.info("Setmore data import completed successfully!")
            
        except Exception as e:
            logger.error(f"Import failed: {e}")
            raise


if __name__ == "__main__":
    importer = SetmoreDataImporter()
    importer.run()