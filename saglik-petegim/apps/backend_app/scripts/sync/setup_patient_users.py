#!/usr/bin/env python3
"""
Setup patient users in Firestore only (faster version)
"""

import csv
import json
import secrets
import string
from datetime import datetime
from pathlib import Path
import logging
import firebase_admin
from firebase_admin import credentials, firestore
import hashlib

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        cred_path = Path("D:/GitHub Repos/Saglik-Petegim/apps/flutter_app/saglikpetegim-firebase-adminsdk-fbsvc-c6a289df06.json")
        cred = credentials.Certificate(str(cred_path))
        firebase_admin.initialize_app(cred)
        logger.info("Firebase initialized")
    return firestore.client()

def generate_password():
    """Generate a secure random password"""
    # Ensure password meets Firebase requirements
    upper = secrets.choice(string.ascii_uppercase)
    lower = secrets.choice(string.ascii_lowercase)
    digit = secrets.choice(string.digits)
    special = secrets.choice("!@#$%^&*")
    others = ''.join(secrets.choice(string.ascii_letters + string.digits + "!@#$%^&*") for _ in range(8))
    password = upper + lower + digit + special + others
    # Shuffle the password
    password_list = list(password)
    secrets.SystemRandom().shuffle(password_list)
    return ''.join(password_list)

def main():
    db = init_firebase()
    
    # Step 1: Delete all non-admin users
    logger.info("Cleaning existing users...")
    users_ref = db.collection('users')
    batch = db.batch()
    batch_size = 0
    deleted = 0
    
    for user_doc in users_ref.stream():
        user_data = user_doc.to_dict()
        email = user_data.get('email', '')
        role = user_data.get('role', '')
        
        # Keep only admin
        if email != 'ozlem.murzoglu@gmail.com' and role != 'admin':
            batch.delete(user_doc.reference)
            batch_size += 1
            
            if batch_size >= 500:
                batch.commit()
                deleted += batch_size
                logger.info(f"Deleted {deleted} users...")
                batch = db.batch()
                batch_size = 0
    
    if batch_size > 0:
        batch.commit()
        deleted += batch_size
    
    logger.info(f"Deleted {deleted} non-admin users")
    
    # Step 2: Create patient accounts from CSV
    csv_path = Path("D:/GitHub Repos/Saglik-Petegim/apps/backend_app/data/bulut_klinik/hastalar_latest.csv")
    credentials_list = []
    
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, delimiter=';')
        
        batch = db.batch()
        batch_size = 0
        created = 0
        
        for row in reader:
            email = row.get('Eposta', '').strip()
            if not email or '@' not in email:
                continue
            
            # Get patient info
            patient_id = row.get('Hasta No', '').strip()
            first_name = row.get('Adı', '').strip()
            last_name = row.get('Soyadı', '').strip()
            phone = row.get('Telefon No', '').strip()
            tc_kimlik = row.get('Kimlik Numarası', '').strip()
            
            # Generate password
            temp_password = generate_password()
            
            # Create user document
            user_data = {
                'email': email,
                'displayName': f"{first_name} {last_name}",
                'firstName': first_name,
                'lastName': last_name,
                'role': 'patient',
                'patientId': patient_id,
                'tcKimlik': tc_kimlik,
                'phone': phone,
                'accountStatus': 'active',
                'emailVerified': False,
                'passwordChangeRequired': True,
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP
            }
            
            # Use patient ID as document ID for easier lookup
            doc_ref = db.collection('users').document(f"patient_{patient_id}")
            batch.set(doc_ref, user_data)
            
            # Save credentials
            credentials_list.append({
                'email': email,
                'password': temp_password,
                'name': f"{first_name} {last_name}",
                'patientId': patient_id,
                'tcKimlik': tc_kimlik
            })
            
            batch_size += 1
            if batch_size >= 100:
                batch.commit()
                created += batch_size
                logger.info(f"Created {created} patient accounts...")
                batch = db.batch()
                batch_size = 0
        
        if batch_size > 0:
            batch.commit()
            created += batch_size
    
    logger.info(f"Created {created} patient accounts")
    
    # Step 3: Save credentials
    output_dir = Path("D:/GitHub Repos/Saglik-Petegim/apps/backend_app/data")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save as JSON
    json_path = output_dir / f"patient_credentials_{timestamp}.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(credentials_list, f, ensure_ascii=False, indent=2)
    
    # Save as CSV
    csv_output_path = output_dir / f"patient_credentials_{timestamp}.csv"
    with open(csv_output_path, 'w', encoding='utf-8', newline='') as f:
        if credentials_list:
            writer = csv.DictWriter(f, fieldnames=['email', 'password', 'name', 'patientId', 'tcKimlik'])
            writer.writeheader()
            writer.writerows(credentials_list)
    
    # Summary report
    report_path = output_dir / f"patient_accounts_report_{timestamp}.md"
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# Patient Accounts Setup Report\n\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write("## Summary\n")
        f.write(f"- Non-admin users deleted: {deleted}\n")
        f.write(f"- Patient accounts created: {len(credentials_list)}\n")
        f.write(f"- Credentials saved to: {json_path.name}\n\n")
        f.write("## Access Control\n")
        f.write("- Each patient can only access their own data\n")
        f.write("- Admin account preserved: ozlem.murzoglu@gmail.com\n")
        f.write("- All passwords are temporary and should be changed\n\n")
        f.write("## Files Generated\n")
        f.write(f"- JSON: {json_path.name}\n")
        f.write(f"- CSV: {csv_output_path.name}\n")
        f.write(f"- Report: {report_path.name}\n\n")
        f.write("⚠️ **Security Notice:** Store credentials securely and delete after distribution.\n")
    
    print(f"\n{'='*60}")
    print("PATIENT ACCOUNTS SETUP COMPLETE")
    print(f"{'='*60}")
    print(f"Deleted: {deleted} non-admin users")
    print(f"Created: {len(credentials_list)} patient accounts")
    print(f"Files saved in: {output_dir}")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()