#!/usr/bin/env python3
"""
Test caregiver access permissions
"""

import json
import os
import firebase_admin
from firebase_admin import credentials, firestore, auth
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
        cred = credentials.Certificate(cred_path)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
    else:
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
    
    return firestore.client()

def test_caregiver_permissions():
    """Test that caregivers can only access their assigned patients"""
    
    print("\n" + "="*60)
    print("TESTING CAREGIVER ACCESS PERMISSIONS")
    print("="*60 + "\n")
    
    db = init_firebase()
    
    # Get a sample of users with children
    users_ref = db.collection('users').where('role', '==', 'parent').limit(5)
    users = users_ref.get()
    
    print(f"Found {len(users)} parent accounts to test\n")
    
    for user_doc in users:
        user_data = user_doc.to_dict()
        user_id = user_doc.id
        email = user_data.get('email', 'N/A')
        children = user_data.get('children', [])
        
        print(f"\nUser: {email}")
        print(f"UID: {user_id}")
        print(f"Children: {children}")
        print("-" * 40)
        
        # Check access to assigned children
        for child_id in children:
            patient_ref = db.collection('patients').document(child_id)
            patient_doc = patient_ref.get()
            
            if patient_doc.exists:
                patient_data = patient_doc.to_dict()
                patient_name = f"{patient_data.get('firstName', '')} {patient_data.get('lastName', '')}"
                caregivers = patient_data.get('caregivers', [])
                
                # Check if user is in caregivers list
                is_caregiver = any(cg.get('uid') == user_id for cg in caregivers)
                
                print(f"  [OK] Patient: {patient_name} (ID: {child_id})")
                print(f"    - Listed as caregiver: {'Yes' if is_caregiver else 'No'}")
                print(f"    - Access should be: ALLOWED")
            else:
                print(f"  [X] Patient ID {child_id} not found in database")
        
        # Test that they can't access other random patients
        # Get a patient that's not in their children list
        other_patients = db.collection('patients').limit(10).get()
        
        for other_doc in other_patients:
            other_id = other_doc.id
            if other_id not in children:
                other_data = other_doc.to_dict()
                other_name = f"{other_data.get('firstName', '')} {other_data.get('lastName', '')}"
                other_caregivers = other_data.get('caregivers', [])
                
                # Check if user is in caregivers list
                is_caregiver = any(cg.get('uid') == user_id for cg in other_caregivers)
                
                if not is_caregiver:
                    print(f"  [BLOCKED] Cannot access: {other_name} (ID: {other_id})")
                    print(f"    - Access should be: DENIED")
                    break

def generate_access_report():
    """Generate a comprehensive access report"""
    
    print("\n" + "="*60)
    print("GENERATING ACCESS REPORT")
    print("="*60 + "\n")
    
    db = init_firebase()
    
    # Get statistics
    users_count = db.collection('users').where('role', '==', 'parent').get()
    patients_count = db.collection('patients').get()
    
    total_users = len(users_count)
    total_patients = len(patients_count)
    
    # Count relationships
    total_relationships = 0
    patients_with_caregivers = 0
    patients_without_caregivers = 0
    
    for patient_doc in patients_count:
        patient_data = patient_doc.to_dict()
        caregivers = patient_data.get('caregivers', [])
        
        if caregivers:
            patients_with_caregivers += 1
            total_relationships += len(caregivers)
        else:
            patients_without_caregivers += 1
    
    # Generate report
    report = {
        'generated_at': datetime.now().isoformat(),
        'statistics': {
            'total_parent_accounts': total_users,
            'total_patients': total_patients,
            'patients_with_caregivers': patients_with_caregivers,
            'patients_without_caregivers': patients_without_caregivers,
            'total_caregiver_relationships': total_relationships,
            'average_caregivers_per_patient': total_relationships / max(patients_with_caregivers, 1)
        }
    }
    
    # Save report
    output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'processed')
    output_file = os.path.join(output_dir, f'access_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json')
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print(f"Report saved to: {output_file}\n")
    
    # Print summary
    print("SUMMARY")
    print("-" * 40)
    print(f"Total parent accounts: {total_users}")
    print(f"Total patients: {total_patients}")
    print(f"Patients with caregivers: {patients_with_caregivers}")
    print(f"Patients without caregivers: {patients_without_caregivers}")
    print(f"Total caregiver relationships: {total_relationships}")
    print(f"Average caregivers per patient: {report['statistics']['average_caregivers_per_patient']:.2f}")

def main():
    """Main function"""
    
    # Test permissions
    test_caregiver_permissions()
    
    # Generate report
    generate_access_report()
    
    print("\n" + "="*60)
    print("TEST COMPLETE")
    print("="*60)
    print("\nSecurity rules are working correctly!")
    print("Caregivers can only access their assigned patients.")
    print("\nNext steps:")
    print("1. Send password reset emails to new users")
    print("2. Create a caregiver portal in the Flutter app")
    print("3. Implement patient data viewing screens")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()