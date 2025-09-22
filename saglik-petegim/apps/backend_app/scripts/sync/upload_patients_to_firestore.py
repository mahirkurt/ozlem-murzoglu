#!/usr/bin/env python3
"""
Upload patients data from JSON to Firestore
"""

import json
import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

def init_firebase():
    """Initialize Firebase Admin SDK"""
    possible_paths = [
        os.path.join(os.path.dirname(__file__), '..', '..', 'saglikpetegim-firebase-adminsdk-fbsvc-9879d2b6a1.json'),
    ]
    
    cred_path = None
    for path in possible_paths:
        if os.path.exists(path):
            cred_path = path
            break
    
    if cred_path:
        print(f"Using service account key: {cred_path}")
        cred = credentials.Certificate(cred_path)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
    else:
        print("Using default credentials")
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
    
    return firestore.client()

def upload_patients():
    """Upload patients from JSON to Firestore"""
    
    print("\n" + "="*60)
    print("UPLOADING PATIENTS TO FIRESTORE")
    print("="*60 + "\n")
    
    db = init_firebase()
    
    # Load patients data
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'processed')
    patients_file = os.path.join(data_dir, 'patients.json')
    
    if not os.path.exists(patients_file):
        print(f"Error: Patients file not found at {patients_file}")
        return
    
    with open(patients_file, 'r', encoding='utf-8') as f:
        patients = json.load(f)
    
    print(f"Loaded {len(patients)} patients from JSON\n")
    
    # Batch upload
    batch = db.batch()
    batch_count = 0
    max_batch_size = 400  # Firestore limit is 500
    
    uploaded = 0
    failed = 0
    
    for patient in patients:
        try:
            patient_id = patient['patientId']
            
            # Convert dates
            if patient.get('dateOfBirth'):
                try:
                    patient['dateOfBirth'] = datetime.fromisoformat(patient['dateOfBirth'])
                except:
                    patient['dateOfBirth'] = None
            
            # Add timestamps
            patient['createdAt'] = firestore.SERVER_TIMESTAMP
            patient['updatedAt'] = firestore.SERVER_TIMESTAMP
            patient['dataSource'] = 'bulut_klinik'
            patient['isActive'] = True
            
            # Create document reference
            patient_ref = db.collection('patients').document(patient_id)
            
            # Add to batch
            batch.set(patient_ref, patient)
            batch_count += 1
            
            # Commit batch if limit reached
            if batch_count >= max_batch_size:
                batch.commit()
                print(f"Committed batch of {batch_count} patients")
                batch = db.batch()
                batch_count = 0
            
            uploaded += 1
            
            if uploaded % 10 == 0:
                print(f"Processed {uploaded} patients...")
                
        except Exception as e:
            print(f"Error uploading patient {patient.get('patientId')}: {e}")
            failed += 1
    
    # Commit remaining batch
    if batch_count > 0:
        batch.commit()
        print(f"Committed final batch of {batch_count} patients")
    
    print("\n" + "="*60)
    print("UPLOAD COMPLETE")
    print("="*60)
    print(f"Successfully uploaded: {uploaded} patients")
    print(f"Failed: {failed} patients")
    print("="*60 + "\n")

def main():
    """Main function"""
    upload_patients()

if __name__ == "__main__":
    main()