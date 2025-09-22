#!/usr/bin/env python3
"""
Create patient user accounts from CSV emails and clean non-patient users
"""

import csv
import json
import secrets
import string
from datetime import datetime
from pathlib import Path
import logging
import firebase_admin
from firebase_admin import credentials, firestore, auth
import hashlib

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        cred_path = Path("D:/GitHub Repos/Saglik-Petegim/apps/flutter_app/saglikpetegim-firebase-adminsdk-fbsvc-c6a289df06.json")
        if cred_path.exists():
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
            logger.info("Firebase initialized")
        else:
            logger.error(f"Firebase service account not found at {cred_path}")
            raise FileNotFoundError(f"Service account file not found: {cred_path}")
    
    return firestore.client()

def generate_password(length=12):
    """Generate a secure random password"""
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    password = ''.join(secrets.choice(characters) for _ in range(length))
    return password

def clean_existing_users(db, keep_admin_email="ozlem.murzoglu@gmail.com"):
    """Remove all non-admin, non-patient users from Firestore"""
    logger.info("Cleaning existing users...")
    
    users_ref = db.collection('users')
    deleted_count = 0
    kept_count = 0
    
    try:
        # Get all users
        users = users_ref.stream()
        batch = db.batch()
        batch_size = 0
        
        for user_doc in users:
            user_data = user_doc.to_dict()
            email = user_data.get('email', '')
            role = user_data.get('role', '')
            
            # Keep admin and patient accounts
            if email == keep_admin_email or role == 'admin':
                kept_count += 1
                logger.info(f"Keeping admin: {email}")
            elif role == 'patient':
                kept_count += 1
                logger.info(f"Keeping existing patient: {email}")
            else:
                # Delete non-patient, non-admin users
                batch.delete(user_doc.reference)
                batch_size += 1
                logger.info(f"Deleting {role} user: {email}")
                
                if batch_size >= 500:
                    batch.commit()
                    deleted_count += batch_size
                    batch = db.batch()
                    batch_size = 0
        
        if batch_size > 0:
            batch.commit()
            deleted_count += batch_size
        
        logger.info(f"Deleted {deleted_count} users, kept {kept_count} users")
        
    except Exception as e:
        logger.error(f"Error cleaning users: {e}")
    
    return deleted_count

def create_patient_accounts(db, csv_path):
    """Create patient user accounts from CSV"""
    logger.info("Creating patient accounts...")
    
    credentials_list = []
    created_count = 0
    updated_count = 0
    
    try:
        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f, delimiter=';')
            
            batch = db.batch()
            batch_size = 0
            
            for row in reader:
                try:
                    email = row.get('Eposta', '').strip()
                    if not email or '@' not in email:
                        continue
                    
                    # Get patient info
                    patient_id = row.get('Hasta No', '').strip()
                    first_name = row.get('Adı', '').strip()
                    last_name = row.get('Soyadı', '').strip()
                    phone = row.get('Telefon No', '').strip()
                    tc_kimlik = row.get('Kimlik Numarası', '').strip()
                    
                    # Generate temporary password
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
                        'updatedAt': firestore.SERVER_TIMESTAMP,
                        'lastPasswordChange': firestore.SERVER_TIMESTAMP
                    }
                    
                    # Use email hash as document ID
                    doc_id = hashlib.md5(email.encode()).hexdigest()
                    doc_ref = db.collection('users').document(doc_id)
                    
                    # Check if user already exists
                    existing = doc_ref.get()
                    if existing.exists:
                        # Update existing user
                        batch.update(doc_ref, user_data)
                        updated_count += 1
                        logger.info(f"Updated patient account: {email}")
                    else:
                        # Create new user
                        batch.set(doc_ref, user_data)
                        created_count += 1
                        logger.info(f"Created patient account: {email}")
                    
                    # Try to create Firebase Auth user
                    try:
                        # Check if auth user exists
                        try:
                            existing_auth_user = auth.get_user_by_email(email)
                            # Update password
                            auth.update_user(
                                existing_auth_user.uid,
                                password=temp_password
                            )
                            logger.info(f"Updated Firebase Auth password for: {email}")
                        except auth.UserNotFoundError:
                            # Create new auth user
                            auth_user = auth.create_user(
                                email=email,
                                password=temp_password,
                                display_name=f"{first_name} {last_name}",
                                disabled=False
                            )
                            logger.info(f"Created Firebase Auth user: {email}")
                    except Exception as auth_error:
                        logger.warning(f"Firebase Auth error for {email}: {auth_error}")
                    
                    # Save credentials
                    credentials_list.append({
                        'email': email,
                        'password': temp_password,
                        'name': f"{first_name} {last_name}",
                        'patientId': patient_id,
                        'tcKimlik': tc_kimlik
                    })
                    
                    batch_size += 1
                    if batch_size >= 500:
                        batch.commit()
                        logger.info(f"Committed batch of {batch_size} users")
                        batch = db.batch()
                        batch_size = 0
                    
                except Exception as e:
                    logger.error(f"Error processing patient {row.get('Hasta No', '')}: {e}")
            
            # Commit remaining batch
            if batch_size > 0:
                batch.commit()
                logger.info(f"Committed final batch of {batch_size} users")
        
        logger.info(f"Created {created_count} new accounts, updated {updated_count} accounts")
        
    except Exception as e:
        logger.error(f"Error creating patient accounts: {e}")
    
    return credentials_list

def save_credentials_report(credentials_list, output_dir):
    """Save credentials to a secure file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save as JSON
    json_path = Path(output_dir) / f"patient_credentials_{timestamp}.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(credentials_list, f, ensure_ascii=False, indent=2)
    
    # Save as CSV for easy access
    csv_path = Path(output_dir) / f"patient_credentials_{timestamp}.csv"
    with open(csv_path, 'w', encoding='utf-8', newline='') as f:
        if credentials_list:
            writer = csv.DictWriter(f, fieldnames=credentials_list[0].keys())
            writer.writeheader()
            writer.writerows(credentials_list)
    
    # Save summary report
    report_path = Path(output_dir) / f"account_creation_report_{timestamp}.md"
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# Patient Account Creation Report\n\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write(f"## Summary\n")
        f.write(f"- Total accounts created: {len(credentials_list)}\n")
        f.write(f"- Credentials saved to: {json_path.name}\n\n")
        f.write("## Important Notes\n")
        f.write("- All passwords are temporary and must be changed on first login\n")
        f.write("- Patients can only access their own data\n")
        f.write("- Admin account (ozlem.murzoglu@gmail.com) has been preserved\n\n")
        f.write("## Security Notice\n")
        f.write("⚠️ This file contains sensitive credentials. Store securely and delete after distribution.\n")
    
    logger.info(f"Credentials saved to {output_dir}")
    return report_path

def main():
    """Main execution"""
    # Initialize Firebase
    db = init_firebase()
    
    # Paths
    csv_path = Path("D:/GitHub Repos/Saglik-Petegim/apps/backend_app/data/bulut_klinik/hastalar_latest.csv")
    output_dir = Path("D:/GitHub Repos/Saglik-Petegim/apps/backend_app/data/credentials")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Step 1: Clean existing non-patient users
    deleted = clean_existing_users(db)
    
    # Step 2: Create patient accounts
    credentials = create_patient_accounts(db, csv_path)
    
    # Step 3: Save credentials report
    report_path = save_credentials_report(credentials, output_dir)
    
    # Summary
    logger.info("\n" + "="*50)
    logger.info("ACCOUNT CREATION COMPLETE")
    logger.info("="*50)
    logger.info(f"Deleted users: {deleted}")
    logger.info(f"Patient accounts created/updated: {len(credentials)}")
    logger.info(f"Report saved to: {report_path}")
    logger.info("="*50)

if __name__ == "__main__":
    main()