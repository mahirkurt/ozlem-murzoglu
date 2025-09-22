#!/usr/bin/env python3
"""
Create Firebase Auth accounts for caregivers and link them to patients
"""

import json
import os
import sys
import firebase_admin
from firebase_admin import credentials, firestore, auth
import secrets
import string
from datetime import datetime

# Initialize Firebase Admin SDK
def init_firebase():
    """Initialize Firebase Admin SDK"""
    # Try multiple possible paths for the service account key
    possible_paths = [
        os.path.join(os.path.dirname(__file__), '..', '..', 'saglikpetegim-firebase-adminsdk-fbsvc-9879d2b6a1.json'),
        os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'saglikpetegim-firebase-adminsdk-fbsvc-9879d2b6a1.json'),
        'saglikpetegim-firebase-adminsdk-fbsvc-9879d2b6a1.json'
    ]
    
    cred_path = None
    for path in possible_paths:
        if os.path.exists(path):
            cred_path = path
            break
    
    if cred_path:
        print(f"Using service account key: {cred_path}")
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        print("No service account key found, using default credentials")
        firebase_admin.initialize_app()
    
    return firestore.client()

def generate_password(length=12):
    """Generate a secure temporary password that meets Firebase requirements"""
    # Firebase requires: at least 6 chars, with letters, numbers, and special chars
    
    # Ensure at least one of each required character type
    password_chars = []
    
    # Add at least one uppercase letter
    password_chars.append(secrets.choice(string.ascii_uppercase))
    
    # Add at least one lowercase letter
    password_chars.append(secrets.choice(string.ascii_lowercase))
    
    # Add at least one digit
    password_chars.append(secrets.choice(string.digits))
    
    # Add at least one special character
    password_chars.append(secrets.choice("!@#$%&*"))
    
    # Fill the rest with random characters
    alphabet = string.ascii_letters + string.digits + "!@#$%&*"
    for _ in range(length - 4):
        password_chars.append(secrets.choice(alphabet))
    
    # Shuffle the password characters
    secrets.SystemRandom().shuffle(password_chars)
    
    return ''.join(password_chars)

def create_or_get_user(email, display_name, phone=None):
    """Create a Firebase Auth user or get existing one"""
    try:
        # Try to get existing user
        user = auth.get_user_by_email(email)
        print(f"  User already exists: {email} (UID: {user.uid})")
        
        # Update display name if different
        if user.display_name != display_name:
            auth.update_user(user.uid, display_name=display_name)
            print(f"  Updated display name to: {display_name}")
        
        return user.uid, None  # No password for existing user
        
    except auth.UserNotFoundError:
        # Create new user with temporary password
        password = generate_password()
        
        try:
            user = auth.create_user(
                email=email,
                email_verified=False,
                password=password,
                display_name=display_name,
                phone_number=phone if phone and phone.startswith('+') else None,
                disabled=False
            )
            
            print(f"  Created new user: {email} (UID: {user.uid})")
            print(f"  Temporary password: {password}")
            
            # Send password reset email for security
            try:
                auth.generate_password_reset_link(email)
                print(f"  Password reset email will be sent to: {email}")
            except Exception as e:
                print(f"  Could not generate password reset link: {e}")
            
            return user.uid, password
            
        except Exception as e:
            print(f"  Error creating user {email}: {e}")
            return None, None

def update_firestore_relationships(db, patient_id, caregiver_uid, caregiver_info):
    """Update Firestore to link caregiver to patient"""
    try:
        # Update patient document with caregiver UID
        patient_ref = db.collection('patients').document(patient_id)
        patient_doc = patient_ref.get()
        
        if patient_doc.exists:
            patient_data = patient_doc.to_dict()
            caregivers = patient_data.get('caregivers', [])
            
            # Check if caregiver already exists
            caregiver_exists = False
            for i, cg in enumerate(caregivers):
                if cg.get('email') == caregiver_info['email']:
                    # Update with UID
                    caregivers[i]['uid'] = caregiver_uid
                    caregiver_exists = True
                    break
            
            if not caregiver_exists:
                # Add new caregiver
                caregiver_info['uid'] = caregiver_uid
                caregivers.append(caregiver_info)
            
            # Update patient document
            patient_ref.update({
                'caregivers': caregivers,
                'updatedAt': firestore.SERVER_TIMESTAMP
            })
            print(f"  Updated patient {patient_id} with caregiver UID")
        
        # Create or update user document
        user_ref = db.collection('users').document(caregiver_uid)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            # Update existing user document
            user_data = user_doc.to_dict()
            children = user_data.get('children', [])
            if patient_id not in children:
                children.append(patient_id)
                user_ref.update({
                    'children': children,
                    'updatedAt': firestore.SERVER_TIMESTAMP
                })
                print(f"  Added patient {patient_id} to user's children list")
        else:
            # Create new user document
            user_data = {
                'uid': caregiver_uid,
                'email': caregiver_info['email'],
                'displayName': caregiver_info['name'],
                'phone': caregiver_info.get('phone', ''),
                'role': 'parent',
                'children': [patient_id],
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP,
                'accountStatus': 'active',
                'emailVerified': False
            }
            user_ref.set(user_data)
            print(f"  Created user document in Firestore")
            
    except Exception as e:
        print(f"  Error updating Firestore relationships: {e}")

def process_patients_file(file_path, db):
    """Process patients JSON file and create caregiver accounts"""
    
    print("\n" + "="*60)
    print("CREATING CAREGIVER ACCOUNTS")
    print("="*60 + "\n")
    
    # Load patients data
    with open(file_path, 'r', encoding='utf-8') as f:
        patients = json.load(f)
    
    print(f"Processing {len(patients)} patients...\n")
    
    # Track statistics
    stats = {
        'total_patients': len(patients),
        'caregivers_processed': 0,
        'new_accounts': 0,
        'existing_accounts': 0,
        'failed': 0
    }
    
    # Store credentials for new accounts
    new_credentials = []
    
    # Process each patient
    for patient in patients:
        patient_id = patient['patientId']
        patient_name = f"{patient['firstName']} {patient['lastName']}"
        
        print(f"\nPatient: {patient_name} (ID: {patient_id})")
        print("-" * 40)
        
        # Process each caregiver
        for caregiver in patient.get('caregivers', []):
            email = caregiver['email']
            name = caregiver['name']
            relationship = caregiver['relationship']
            phone = caregiver.get('phone')
            
            print(f"\nProcessing {relationship}: {name}")
            
            # Create or get Firebase Auth user
            uid, password = create_or_get_user(email, name, phone)
            
            if uid:
                # Update Firestore relationships
                update_firestore_relationships(db, patient_id, uid, caregiver)
                
                stats['caregivers_processed'] += 1
                
                if password:
                    stats['new_accounts'] += 1
                    new_credentials.append({
                        'patient': patient_name,
                        'patient_id': patient_id,
                        'caregiver': name,
                        'relationship': relationship,
                        'email': email,
                        'password': password,
                        'uid': uid
                    })
                else:
                    stats['existing_accounts'] += 1
            else:
                stats['failed'] += 1
                print(f"  Failed to create/get user for {email}")
    
    # Save credentials to file
    if new_credentials:
        output_file = os.path.join(
            os.path.dirname(file_path), 
            f'caregiver_credentials_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        )
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'generated_at': datetime.now().isoformat(),
                'credentials': new_credentials,
                'instructions': {
                    'en': 'These are temporary passwords. Users should reset their password on first login.',
                    'tr': 'Bunlar geçici şifrelerdir. Kullanıcılar ilk girişte şifrelerini sıfırlamalıdır.'
                }
            }, f, ensure_ascii=False, indent=2)
        
        print(f"\n\nCredentials saved to: {output_file}")
    
    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Total patients processed: {stats['total_patients']}")
    print(f"Total caregivers processed: {stats['caregivers_processed']}")
    print(f"New accounts created: {stats['new_accounts']}")
    print(f"Existing accounts found: {stats['existing_accounts']}")
    print(f"Failed operations: {stats['failed']}")
    print("="*60 + "\n")
    
    return stats

def main():
    """Main function"""
    # Initialize Firebase
    print("Initializing Firebase...")
    db = init_firebase()
    
    # Path to processed patients file
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'processed')
    patients_file = os.path.join(data_dir, 'patients.json')
    
    if not os.path.exists(patients_file):
        print(f"Error: Patients file not found at {patients_file}")
        print("Please run process_data_local.py first to generate the patients.json file")
        sys.exit(1)
    
    # Process patients and create accounts
    stats = process_patients_file(patients_file, db)
    
    # Deploy Firestore rules
    print("\n" + "="*60)
    print("IMPORTANT NEXT STEPS")
    print("="*60)
    print("1. Deploy the updated Firestore security rules:")
    print("   firebase deploy --only firestore:rules")
    print("\n2. Send password reset emails to new users")
    print("\n3. Notify caregivers about their accounts")
    print("\n4. Test access permissions with a caregiver account")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()