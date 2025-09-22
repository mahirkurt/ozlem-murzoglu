#!/usr/bin/env python3
"""
Process Bulut Klinik CSV data and sync to Firestore
"""

import csv
import json
import os
import re
from datetime import datetime
from typing import Dict, List, Any
import firebase_admin
from firebase_admin import credentials, firestore, auth
import hashlib

# Initialize Firebase Admin SDK
cred_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'firebase-service-account.json')
if os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
else:
    firebase_admin.initialize_app()

db = firestore.client()

def parse_date(date_str: str) -> datetime:
    """Parse date from various formats"""
    if not date_str:
        return None
    
    formats = [
        "%Y-%m-%d",
        "%d.%m.%Y",
        "%d/%m/%Y",
        "%Y/%m/%d"
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt)
        except ValueError:
            continue
    return None

def parse_phone(phone_str: str) -> str:
    """Clean and format phone number"""
    if not phone_str:
        return ""
    
    # Remove non-numeric characters except +
    phone = re.sub(r'[^0-9+]', '', phone_str.strip())
    
    # Ensure Turkish format
    if phone.startswith('0'):
        phone = '+9' + phone
    elif phone.startswith('5'):
        phone = '+90' + phone
    elif not phone.startswith('+'):
        phone = '+90' + phone
    
    return phone

def generate_email_from_name(first_name: str, last_name: str, patient_id: str) -> str:
    """Generate a unique email for caregivers without email"""
    first = re.sub(r'[^a-zA-Z]', '', first_name.lower())[:10]
    last = re.sub(r'[^a-zA-Z]', '', last_name.lower())[:10]
    hash_id = hashlib.md5(patient_id.encode()).hexdigest()[:6]
    return f"{first}.{last}.{hash_id}@saglikpetegim.com"

def parse_medical_history(ozgecmis: str, soygecmis: str) -> Dict[str, Any]:
    """Parse medical history from text"""
    medical_history = {
        "personal": ozgecmis or "",
        "family": soygecmis or "",
        "birth_weight": None,
        "birth_height": None,
        "birth_week": None,
        "delivery_type": None,
        "vaccinations": [],
        "allergies": [],
        "medications": [],
        "hospitalizations": []
    }
    
    # Extract birth weight
    weight_match = re.search(r'(\d+)\s*g(?:r|ram)?', ozgecmis or '')
    if weight_match:
        medical_history["birth_weight"] = int(weight_match.group(1))
    
    # Extract birth height
    height_match = re.search(r'(\d+)\s*cm', ozgecmis or '')
    if height_match:
        medical_history["birth_height"] = int(height_match.group(1))
    
    # Extract gestational age
    week_match = re.search(r'(\d+)\+?(\d+)?\s*G[Hh]', ozgecmis or '')
    if week_match:
        weeks = int(week_match.group(1))
        days = int(week_match.group(2)) if week_match.group(2) else 0
        medical_history["birth_week"] = weeks + (days / 7.0)
    
    # Detect delivery type
    if any(term in (ozgecmis or '').lower() for term in ['c/s', 'sezaryen', 'cesarean']):
        medical_history["delivery_type"] = "cesarean"
    elif any(term in (ozgecmis or '').lower() for term in ['normal', 'vajinal', 'nsvd']):
        medical_history["delivery_type"] = "vaginal"
    
    # Extract vaccinations
    if 'rotarix' in (ozgecmis or '').lower():
        medical_history["vaccinations"].append("Rotarix")
    if 'hepatit' in (ozgecmis or '').lower():
        medical_history["vaccinations"].append("Hepatit B")
    
    return medical_history

def process_patients_csv(file_path: str) -> List[Dict[str, Any]]:
    """Process patients CSV file"""
    patients = []
    
    with open(file_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, delimiter=';')
        
        for row in reader:
            # Parse basic info
            patient = {
                "patient_id": row.get("Hasta No", ""),
                "tc_kimlik": row.get("Kimlik Numarası", ""),
                "first_name": row.get("Adı", "").strip(),
                "last_name": row.get("Soyadı", "").strip(),
                "gender": "female" if row.get("Cinsiyeti") == "Kadın" else "male",
                "date_of_birth": parse_date(row.get("Doğum Tarihi")),
                "place_of_birth": row.get("Doğum Yeri", ""),
                "blood_type": row.get("Kan Grubu", ""),
                "address": row.get("Adres", ""),
                "phone": parse_phone(row.get("Telefon No")),
                "email": row.get("Eposta", "").strip(),
                "nationality": row.get("Uyruğu", "TÜRKİYE CUMHURİYETİ"),
                "passport_no": row.get("Pasaport Numarası", ""),
                "notes": row.get("Not", ""),
                "insurance": row.get("Anlaşmalı Kurum", "")
            }
            
            # Parse family info
            patient["parents"] = {
                "mother": {
                    "name": row.get("Anne Adı", ""),
                    "email": None,
                    "phone": None
                },
                "father": {
                    "name": row.get("Baba Adı", ""),
                    "email": None,
                    "phone": None
                }
            }
            
            # Parse medical history
            medical_history = parse_medical_history(
                row.get("Özgeçmiş"),
                row.get("Soygeçmiş")
            )
            patient["medical_history"] = medical_history
            
            # Parse allergies
            allergies_text = row.get("Alerjiler", "")
            if allergies_text:
                patient["medical_history"]["allergies"] = [a.strip() for a in allergies_text.split(',')]
            
            # Extract parent info from medical history
            family_history = row.get("Soygeçmiş", "")
            if family_history:
                # Try to extract mother's info
                mother_match = re.search(r'[Aa]nne\s+(\w+)[,\s]+(\d{4})', family_history)
                if mother_match:
                    patient["parents"]["mother"]["name"] = mother_match.group(1)
                    patient["parents"]["mother"]["birth_year"] = int(mother_match.group(2))
                
                # Try to extract father's info
                father_match = re.search(r'[Bb]aba\s+(\w+)[,\s]+(\d{4})', family_history)
                if father_match:
                    patient["parents"]["father"]["name"] = father_match.group(1)
                    patient["parents"]["father"]["birth_year"] = int(father_match.group(2))
            
            # Use patient's email for primary caregiver if available
            if patient["email"]:
                patient["parents"]["mother"]["email"] = patient["email"]
                patient["parents"]["mother"]["phone"] = patient["phone"]
            
            patients.append(patient)
    
    return patients

def process_appointments_csv(file_path: str) -> List[Dict[str, Any]]:
    """Process appointments CSV file"""
    appointments = []
    
    if not os.path.exists(file_path):
        return appointments
    
    with open(file_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, delimiter=';')
        
        for row in reader:
            appointment = {
                "appointment_id": row.get("Protokol No", ""),
                "patient_id": row.get("Hasta No", ""),
                "date": parse_date(row.get("Tarih")),
                "time": row.get("Saat", ""),
                "doctor": row.get("Doktor", ""),
                "service": row.get("Hizmet", ""),
                "status": row.get("Durum", "completed"),
                "notes": row.get("Not", "")
            }
            appointments.append(appointment)
    
    return appointments

def create_or_update_user(email: str, display_name: str, phone: str = None) -> str:
    """Create or update a Firebase Auth user"""
    try:
        # Try to get existing user
        user = auth.get_user_by_email(email)
        
        # Update user if needed
        update_params = {}
        if display_name and user.display_name != display_name:
            update_params['display_name'] = display_name
        if phone and user.phone_number != phone:
            update_params['phone_number'] = phone
        
        if update_params:
            auth.update_user(user.uid, **update_params)
        
        return user.uid
    except auth.UserNotFoundError:
        # Create new user
        user = auth.create_user(
            email=email,
            display_name=display_name,
            phone_number=phone if phone else None,
            password=hashlib.sha256(email.encode()).hexdigest()[:16]  # Temporary password
        )
        return user.uid
    except Exception as e:
        print(f"Error creating/updating user {email}: {e}")
        return None

def sync_to_firestore(patients: List[Dict[str, Any]], appointments: List[Dict[str, Any]]):
    """Sync processed data to Firestore"""
    
    batch = db.batch()
    batch_count = 0
    max_batch_size = 400  # Firestore batch limit is 500
    
    # Process patients
    for patient_data in patients:
        try:
            # Create patient document
            patient_ref = db.collection('patients').document(patient_data['patient_id'])
            
            # Prepare patient document
            patient_doc = {
                'patientId': patient_data['patient_id'],
                'tcKimlik': patient_data['tc_kimlik'],
                'firstName': patient_data['first_name'],
                'lastName': patient_data['last_name'],
                'gender': patient_data['gender'],
                'dateOfBirth': patient_data['date_of_birth'],
                'placeOfBirth': patient_data['place_of_birth'],
                'bloodType': patient_data['blood_type'],
                'address': patient_data['address'],
                'phone': patient_data['phone'],
                'email': patient_data['email'],
                'nationality': patient_data['nationality'],
                'passportNo': patient_data['passport_no'],
                'notes': patient_data['notes'],
                'insurance': patient_data['insurance'],
                'medicalHistory': patient_data['medical_history'],
                'parents': patient_data['parents'],
                'caregivers': [],
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP,
                'dataSource': 'bulut_klinik',
                'isActive': True
            }
            
            # Create caregiver users
            caregivers_uids = []
            
            # Process mother as caregiver
            if patient_data['parents']['mother']['name']:
                mother_email = patient_data['parents']['mother'].get('email')
                if not mother_email:
                    mother_email = generate_email_from_name(
                        patient_data['parents']['mother']['name'],
                        patient_data['last_name'],
                        patient_data['patient_id']
                    )
                
                mother_display_name = f"{patient_data['parents']['mother']['name']} {patient_data['last_name']}"
                mother_uid = create_or_update_user(
                    mother_email,
                    mother_display_name,
                    patient_data['parents']['mother'].get('phone')
                )
                
                if mother_uid:
                    caregivers_uids.append({
                        'uid': mother_uid,
                        'email': mother_email,
                        'name': mother_display_name,
                        'relationship': 'mother',
                        'isPrimary': True
                    })
                    
                    # Create user profile in Firestore
                    user_ref = db.collection('users').document(mother_uid)
                    batch.set(user_ref, {
                        'uid': mother_uid,
                        'email': mother_email,
                        'displayName': mother_display_name,
                        'phone': patient_data['parents']['mother'].get('phone', ''),
                        'role': 'parent',
                        'children': [patient_data['patient_id']],
                        'createdAt': firestore.SERVER_TIMESTAMP,
                        'updatedAt': firestore.SERVER_TIMESTAMP
                    }, merge=True)
            
            # Process father as caregiver if has contact info
            if patient_data['parents']['father']['name'] and patient_data.get('email'):
                father_email = generate_email_from_name(
                    patient_data['parents']['father']['name'],
                    patient_data['last_name'],
                    patient_data['patient_id'] + '_father'
                )
                
                father_display_name = f"{patient_data['parents']['father']['name']} {patient_data['last_name']}"
                father_uid = create_or_update_user(
                    father_email,
                    father_display_name
                )
                
                if father_uid:
                    caregivers_uids.append({
                        'uid': father_uid,
                        'email': father_email,
                        'name': father_display_name,
                        'relationship': 'father',
                        'isPrimary': False
                    })
                    
                    # Create user profile in Firestore
                    user_ref = db.collection('users').document(father_uid)
                    batch.set(user_ref, {
                        'uid': father_uid,
                        'email': father_email,
                        'displayName': father_display_name,
                        'role': 'parent',
                        'children': [patient_data['patient_id']],
                        'createdAt': firestore.SERVER_TIMESTAMP,
                        'updatedAt': firestore.SERVER_TIMESTAMP
                    }, merge=True)
            
            patient_doc['caregivers'] = caregivers_uids
            
            # Add to batch
            batch.set(patient_ref, patient_doc, merge=True)
            batch_count += 1
            
            # Commit batch if limit reached
            if batch_count >= max_batch_size:
                batch.commit()
                print(f"Committed batch of {batch_count} operations")
                batch = db.batch()
                batch_count = 0
                
        except Exception as e:
            print(f"Error processing patient {patient_data.get('patient_id')}: {e}")
    
    # Process appointments
    for appointment_data in appointments:
        try:
            if not appointment_data['patient_id']:
                continue
                
            # Create appointment document
            appointment_ref = db.collection('appointments').document()
            
            appointment_doc = {
                'appointmentId': appointment_data['appointment_id'],
                'patientId': appointment_data['patient_id'],
                'date': appointment_data['date'],
                'time': appointment_data['time'],
                'doctor': appointment_data['doctor'],
                'service': appointment_data['service'],
                'status': appointment_data['status'],
                'notes': appointment_data['notes'],
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP,
                'dataSource': 'bulut_klinik'
            }
            
            batch.set(appointment_ref, appointment_doc)
            batch_count += 1
            
            # Commit batch if limit reached
            if batch_count >= max_batch_size:
                batch.commit()
                print(f"Committed batch of {batch_count} operations")
                batch = db.batch()
                batch_count = 0
                
        except Exception as e:
            print(f"Error processing appointment {appointment_data.get('appointment_id')}: {e}")
    
    # Commit remaining batch
    if batch_count > 0:
        batch.commit()
        print(f"Committed final batch of {batch_count} operations")

def main():
    """Main function"""
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'bulut_klinik')
    
    # Process patients
    patients_file = os.path.join(data_dir, 'hastalar_latest.csv')
    if os.path.exists(patients_file):
        print(f"Processing patients from {patients_file}")
        patients = process_patients_csv(patients_file)
        print(f"Processed {len(patients)} patients")
    else:
        print("Patients file not found")
        patients = []
    
    # Process appointments
    appointments_file = os.path.join(data_dir, 'randevular_latest.csv')
    if os.path.exists(appointments_file):
        print(f"Processing appointments from {appointments_file}")
        appointments = process_appointments_csv(appointments_file)
        print(f"Processed {len(appointments)} appointments")
    else:
        print("Appointments file not found")
        appointments = []
    
    # Sync to Firestore
    if patients or appointments:
        print("Syncing to Firestore...")
        sync_to_firestore(patients, appointments)
        print("Sync completed!")
    else:
        print("No data to sync")

if __name__ == "__main__":
    main()