#!/usr/bin/env python3
"""
Prepare caregiver onboarding - Convert patient accounts to caregiver accounts
"""

import csv
import json
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

def convert_to_caregiver_accounts():
    """Convert existing patient accounts to caregiver accounts with onboarding flag"""
    db = init_firebase()
    
    logger.info("Converting patient accounts to caregiver accounts...")
    
    # Get all current users
    users_ref = db.collection('users')
    patients_ref = db.collection('patients')
    
    # Track conversions
    converted = 0
    batch = db.batch()
    batch_size = 0
    
    for user_doc in users_ref.stream():
        user_data = user_doc.to_dict()
        
        # Skip admin accounts
        if user_data.get('role') == 'admin':
            continue
            
        # Get associated patient info
        patient_id = user_data.get('patientId')
        if not patient_id:
            continue
            
        # Fetch patient data
        patient_doc = patients_ref.document(patient_id).get()
        if not patient_doc.exists:
            continue
            
        patient_data = patient_doc.to_dict()
        
        # Convert to caregiver account
        updated_user_data = {
            'role': 'caregiver_pending',  # Pending until onboarding complete
            'accountType': 'caregiver',
            'email': user_data.get('email'),
            'displayName': user_data.get('displayName'),
            
            # Onboarding flags
            'onboardingRequired': True,
            'onboardingStatus': {
                'profileCompleted': False,
                'relationshipsDefined': False,
                'contactsVerified': False,
                'preferencesSet': False,
                'completedAt': None
            },
            
            # Temporary child association (to be confirmed during onboarding)
            'pendingChildren': [
                {
                    'patientId': patient_id,
                    'patientName': f"{patient_data.get('firstName', '')} {patient_data.get('lastName', '')}",
                    'tcKimlik': patient_data.get('tcKimlik', ''),
                    'dateOfBirth': patient_data.get('dateOfBirth'),
                    'relationshipToConfirm': None  # Will be set during onboarding
                }
            ],
            
            # Empty profile to be filled during onboarding
            'personalInfo': {
                'firstName': '',
                'lastName': '',
                'tcKimlik': '',
                'phone': user_data.get('phone', ''),
                'dateOfBirth': None,
                'addresses': []
            },
            
            # System info
            'createdAt': user_data.get('createdAt'),
            'updatedAt': firestore.SERVER_TIMESTAMP,
            'lastLogin': None,
            'passwordChangeRequired': True,
            
            # Note: Old fields will be removed manually or ignored
            # Firebase Admin SDK doesn't support FieldValue.delete()
        }
        
        batch.update(user_doc.reference, updated_user_data)
        batch_size += 1
        
        if batch_size >= 100:
            batch.commit()
            converted += batch_size
            logger.info(f"Converted {converted} accounts...")
            batch = db.batch()
            batch_size = 0
    
    if batch_size > 0:
        batch.commit()
        converted += batch_size
    
    logger.info(f"Total accounts converted: {converted}")
    
    # Create onboarding instructions document
    create_onboarding_instructions(db)
    
    return converted

def create_onboarding_instructions(db):
    """Create system configuration for onboarding flow"""
    
    onboarding_config = {
        'version': '1.0',
        'createdAt': firestore.SERVER_TIMESTAMP,
        'steps': [
            {
                'step': 1,
                'id': 'personal_info',
                'title': 'Kişisel Bilgileriniz',
                'description': 'Lütfen kişisel bilgilerinizi tamamlayın',
                'required': True,
                'fields': [
                    'firstName', 'lastName', 'tcKimlik', 
                    'dateOfBirth', 'phone', 'address'
                ]
            },
            {
                'step': 2,
                'id': 'relationship_definition',
                'title': 'Çocuğunuzla İlişkiniz',
                'description': 'Hastamızla olan ilişkinizi belirtin',
                'required': True,
                'options': [
                    'mother', 'father', 'grandmother', 'grandfather',
                    'aunt', 'uncle', 'legal_guardian', 'other'
                ]
            },
            {
                'step': 3,
                'id': 'verify_children',
                'title': 'Çocuk Bilgileri Doğrulama',
                'description': 'Sistemde kayıtlı çocuk bilgilerini doğrulayın',
                'required': True
            },
            {
                'step': 4,
                'id': 'add_other_children',
                'title': 'Diğer Çocuklar',
                'description': 'Varsa diğer çocuklarınızı ekleyin',
                'required': False
            },
            {
                'step': 5,
                'id': 'add_other_caregivers',
                'title': 'Diğer Bakım Verenler',
                'description': 'Diğer ebeveyn veya bakım verenleri ekleyin',
                'required': False
            },
            {
                'step': 6,
                'id': 'emergency_contacts',
                'title': 'Acil Durum Kişileri',
                'description': 'Acil durum kişilerini belirleyin',
                'required': True
            },
            {
                'step': 7,
                'id': 'preferences',
                'title': 'Bildirim Tercihleri',
                'description': 'İletişim tercihlerinizi ayarlayın',
                'required': False
            }
        ],
        'messages': {
            'welcome': """
                Hoş Geldiniz! 
                
                Sağlık Peteğim sistemine ilk girişinizi yapıyorsunuz.
                Çocuğunuzun sağlık kayıtlarına güvenli erişim için 
                lütfen bilgilerinizi tamamlayın.
                
                Bu işlem sadece bir kez yapılacaktır ve yaklaşık 
                5 dakika sürecektir.
            """,
            'completion': """
                Tebrikler!
                
                Hesabınız başarıyla oluşturuldu. Artık çocuğunuzun
                tüm sağlık kayıtlarına güvenli bir şekilde erişebilirsiniz.
            """
        }
    }
    
    # Save configuration
    db.collection('system_config').document('onboarding').set(onboarding_config)
    logger.info("Onboarding configuration created")

def generate_onboarding_report():
    """Generate report of accounts requiring onboarding"""
    db = init_firebase()
    
    users_ref = db.collection('users')
    pending_users = []
    
    for user_doc in users_ref.stream():
        user_data = user_doc.to_dict()
        if user_data.get('onboardingRequired'):
            # Convert DatetimeWithNanoseconds to string
            children = []
            for child in user_data.get('pendingChildren', []):
                child_clean = {
                    'patientId': child.get('patientId'),
                    'patientName': child.get('patientName'),
                    'tcKimlik': child.get('tcKimlik', ''),
                    'dateOfBirth': str(child.get('dateOfBirth')) if child.get('dateOfBirth') else None
                }
                children.append(child_clean)
            
            pending_users.append({
                'userId': user_doc.id,
                'email': user_data.get('email'),
                'pendingChildren': children
            })
    
    # Save report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = Path(f"D:/GitHub Repos/Saglik-Petegim/apps/backend_app/data/onboarding_report_{timestamp}.json")
    
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump({
            'generated': datetime.now().isoformat(),
            'totalPendingUsers': len(pending_users),
            'users': pending_users
        }, f, ensure_ascii=False, indent=2)
    
    logger.info(f"Onboarding report saved to {report_path}")
    return len(pending_users)

def main():
    """Main execution"""
    # Convert accounts
    converted = convert_to_caregiver_accounts()
    
    # Generate report
    pending = generate_onboarding_report()
    
    print(f"\n{'='*60}")
    print("CAREGIVER ONBOARDING PREPARATION COMPLETE")
    print(f"{'='*60}")
    print(f"Accounts converted: {converted}")
    print(f"Pending onboarding: {pending}")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()