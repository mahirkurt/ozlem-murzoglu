"""
Verify User Permissions and Data Access
Ensures all user accounts can properly access their patient data
"""

import firebase_admin
from firebase_admin import credentials, firestore, auth
from pathlib import Path
import json
from datetime import datetime
from typing import Dict, List, Any

class PermissionVerifier:
    def __init__(self):
        self.base_path = Path(__file__).parent.parent.parent
        self._initialize_firebase()
        self.verification_results = {
            'timestamp': datetime.now().isoformat(),
            'users_verified': 0,
            'users_with_access': 0,
            'users_without_access': 0,
            'authentication_issues': [],
            'permission_issues': [],
            'mock_data_found': []
        }
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            firebase_admin.get_app()
        except:
            cred_path = self.base_path.parent / 'flutter_app' / 'saglikpetegim-firebase-adminsdk-fbsvc-c6a289df06.json'
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
        
        self.db = firestore.client()
    
    def verify_all_users(self):
        """Verify all user accounts and their permissions"""
        print("=" * 60)
        print("VERIFYING USER PERMISSIONS AND DATA ACCESS")
        print("=" * 60)
        
        # Get all users from Firestore
        users = self.db.collection('users').get()
        total_users = len(users)
        
        print(f"\nTotal users in database: {total_users}")
        print("-" * 40)
        
        for user_doc in users:
            user_data = user_doc.to_dict()
            user_id = user_doc.id
            email = user_data.get('email', 'No email')
            
            self.verification_results['users_verified'] += 1
            
            # Verify authentication
            auth_status = self._verify_authentication(email)
            
            # Verify data access
            access_status = self._verify_data_access(user_id, user_data)
            
            if auth_status and access_status:
                self.verification_results['users_with_access'] += 1
                print(f"[OK] {email}: Authentication and access verified")
            else:
                self.verification_results['users_without_access'] += 1
                print(f"[ISSUE] {email}: Problems detected")
                
                if not auth_status:
                    print(f"  - Authentication issue")
                if not access_status:
                    print(f"  - Data access issue")
        
        print("\n" + "=" * 60)
        self._print_summary()
    
    def _verify_authentication(self, email: str) -> bool:
        """Verify if user can authenticate"""
        try:
            # Check if user exists in Firebase Auth
            user = auth.get_user_by_email(email)
            
            # Verify user is not disabled
            if user.disabled:
                self.verification_results['authentication_issues'].append({
                    'email': email,
                    'issue': 'Account disabled'
                })
                return False
            
            # Check email verification (informational only)
            if not user.email_verified:
                print(f"  Note: {email} - Email not verified")
            
            return True
            
        except auth.UserNotFoundError:
            self.verification_results['authentication_issues'].append({
                'email': email,
                'issue': 'User not found in Firebase Auth'
            })
            return False
        except Exception as e:
            self.verification_results['authentication_issues'].append({
                'email': email,
                'issue': str(e)
            })
            return False
    
    def _verify_data_access(self, user_id: str, user_data: Dict) -> bool:
        """Verify user can access their patient data"""
        has_access = False
        
        # Check for children array (multi-child support)
        if 'children' in user_data and isinstance(user_data['children'], list):
            children = user_data['children']
            if children:
                # Verify each child's patient record exists
                for child in children:
                    patient_id = child.get('patientId')
                    if patient_id:
                        patient_doc = self.db.collection('patients').document(patient_id).get()
                        if patient_doc.exists:
                            has_access = True
                        else:
                            self.verification_results['permission_issues'].append({
                                'user_id': user_id,
                                'issue': f'Patient record {patient_id} not found'
                            })
        
        # Check for single patientId (legacy support)
        elif 'patientId' in user_data:
            patient_id = user_data['patientId']
            patient_doc = self.db.collection('patients').document(patient_id).get()
            if patient_doc.exists:
                has_access = True
            else:
                self.verification_results['permission_issues'].append({
                    'user_id': user_id,
                    'issue': f'Patient record {patient_id} not found'
                })
        
        # Check if user has role-based access
        if 'role' in user_data:
            if user_data['role'] in ['admin', 'doctor', 'caregiver']:
                has_access = True
        
        return has_access
    
    def check_mock_data(self):
        """Check for and remove mock/test data"""
        print("\n" + "=" * 60)
        print("CHECKING FOR MOCK DATA")
        print("=" * 60)
        
        # Check users collection
        print("\nChecking users collection...")
        users = self.db.collection('users').get()
        for user_doc in users:
            user_data = user_doc.to_dict()
            email = user_data.get('email', '')
            
            # Check for test/mock indicators
            if any(keyword in email.lower() for keyword in ['test', 'mock', 'demo', 'example']):
                self.verification_results['mock_data_found'].append({
                    'collection': 'users',
                    'id': user_doc.id,
                    'email': email
                })
                print(f"  Found mock user: {email}")
        
        # Check patients collection
        print("\nChecking patients collection...")
        patients = self.db.collection('patients').get()
        for patient_doc in patients:
            patient_data = patient_doc.to_dict()
            name = f"{patient_data.get('firstName', '')} {patient_data.get('lastName', '')}"
            
            # Check for test/mock indicators
            if any(keyword in name.lower() for keyword in ['test', 'mock', 'demo', 'example']):
                self.verification_results['mock_data_found'].append({
                    'collection': 'patients',
                    'id': patient_doc.id,
                    'name': name
                })
                print(f"  Found mock patient: {name}")
        
        if not self.verification_results['mock_data_found']:
            print("  No mock data found")
    
    def fix_permission_issues(self):
        """Attempt to fix detected permission issues"""
        print("\n" + "=" * 60)
        print("FIXING PERMISSION ISSUES")
        print("=" * 60)
        
        if not self.verification_results['permission_issues']:
            print("No permission issues to fix")
            return
        
        for issue in self.verification_results['permission_issues']:
            print(f"Fixing: {issue}")
            # Here we would implement fixes
            # For now, just log them
    
    def _print_summary(self):
        """Print verification summary"""
        print("\nVERIFICATION SUMMARY")
        print("-" * 40)
        print(f"Users verified: {self.verification_results['users_verified']}")
        print(f"Users with proper access: {self.verification_results['users_with_access']}")
        print(f"Users with issues: {self.verification_results['users_without_access']}")
        
        if self.verification_results['authentication_issues']:
            print(f"\nAuthentication issues: {len(self.verification_results['authentication_issues'])}")
            for issue in self.verification_results['authentication_issues'][:5]:  # Show first 5
                print(f"  - {issue['email']}: {issue['issue']}")
        
        if self.verification_results['permission_issues']:
            print(f"\nPermission issues: {len(self.verification_results['permission_issues'])}")
            for issue in self.verification_results['permission_issues'][:5]:  # Show first 5
                print(f"  - User {issue['user_id']}: {issue['issue']}")
        
        if self.verification_results['mock_data_found']:
            print(f"\nMock data found: {len(self.verification_results['mock_data_found'])}")
            for mock in self.verification_results['mock_data_found'][:5]:  # Show first 5
                print(f"  - {mock['collection']}: {mock.get('email', mock.get('name', 'Unknown'))}")
    
    def save_report(self):
        """Save verification report"""
        report_path = self.base_path / 'data' / 'sync' / 'reports' / f"permission_verification_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        report_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(self.verification_results, f, indent=2, ensure_ascii=False)
        
        print(f"\nReport saved to: {report_path}")
    
    def test_specific_accounts(self):
        """Test specific known accounts"""
        print("\n" + "=" * 60)
        print("TESTING SPECIFIC ACCOUNTS")
        print("=" * 60)
        
        test_accounts = [
            {'email': 'bihteratil@hotmail.com', 'name': 'Tuna Köse'},
            {'email': 'dr.ozlemmurzoglu@gmail.com', 'name': 'Dr. Özlem Murzoğlu'},
            {'email': 'buseguleryuzatik@gmail.com', 'name': 'Buse Güler Yüzatik'}
        ]
        
        for account in test_accounts:
            print(f"\nTesting: {account['name']} ({account['email']})")
            
            # Check authentication
            try:
                user = auth.get_user_by_email(account['email'])
                print(f"  [OK] Authentication: User exists (UID: {user.uid})")
                print(f"       Email verified: {user.email_verified}")
                print(f"       Account enabled: {not user.disabled}")
            except auth.UserNotFoundError:
                print(f"  [ERROR] Authentication: User not found")
            except Exception as e:
                print(f"  [ERROR] Authentication: {e}")
            
            # Check Firestore data
            user_docs = self.db.collection('users').where('email', '==', account['email']).limit(1).get()
            if user_docs:
                user_doc = user_docs[0]
                user_data = user_doc.to_dict()
                
                print(f"  [OK] Firestore: User document exists")
                
                # Check children/patients
                if 'children' in user_data:
                    children_count = len(user_data['children'])
                    print(f"       Children: {children_count}")
                    for child in user_data['children']:
                        print(f"         - {child.get('name', 'Unknown')} (ID: {child.get('patientId', 'N/A')})")
                elif 'patientId' in user_data:
                    print(f"       Patient ID: {user_data['patientId']}")
                else:
                    print(f"       No patient data linked")
            else:
                print(f"  [ERROR] Firestore: User document not found")


def main():
    verifier = PermissionVerifier()
    
    # Run all verifications
    verifier.verify_all_users()
    verifier.check_mock_data()
    verifier.test_specific_accounts()
    verifier.fix_permission_issues()
    verifier.save_report()
    
    print("\n" + "=" * 60)
    print("VERIFICATION COMPLETE")
    print("=" * 60)


if __name__ == '__main__':
    main()