#!/usr/bin/env python3
"""
Bright Futures Data Mapper
Maps BulutKlinik data to Bright Futures format with age-appropriate visit schedules
and milestone tracking
"""

import os
import sys
import json
import re
from datetime import datetime, timedelta
from pathlib import Path
import logging
from typing import Dict, List, Optional, Tuple

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except ImportError:
    logger.error("Firebase Admin SDK not installed. Run: pip install firebase-admin")
    sys.exit(1)

class BrightFuturesDataMapper:
    """Maps BulutKlinik data to Bright Futures format"""
    
    def __init__(self):
        self.db = None
        
        # Bright Futures visit schedule (age in months -> visit type)
        self.bf_visit_schedule = {
            0: {"type": "newborn", "name": "Newborn Visit", "age_range": "3-5 days"},
            0.5: {"type": "first_week", "name": "First Week Visit", "age_range": "3-5 days"},
            1: {"type": "1_month", "name": "1 Month Visit", "age_range": "1 month"},
            2: {"type": "2_month", "name": "2 Month Visit", "age_range": "2 months"},
            4: {"type": "4_month", "name": "4 Month Visit", "age_range": "4 months"},
            6: {"type": "6_month", "name": "6 Month Visit", "age_range": "6 months"},
            9: {"type": "9_month", "name": "9 Month Visit", "age_range": "9 months"},
            12: {"type": "12_month", "name": "12 Month Visit", "age_range": "12 months"},
            15: {"type": "15_month", "name": "15 Month Visit", "age_range": "15 months"},
            18: {"type": "18_month", "name": "18 Month Visit", "age_range": "18 months"},
            24: {"type": "24_month", "name": "2 Year Visit", "age_range": "24 months"},
            30: {"type": "30_month", "name": "2.5 Year Visit", "age_range": "30 months"},
            36: {"type": "3_year", "name": "3 Year Visit", "age_range": "3 years"},
            48: {"type": "4_year", "name": "4 Year Visit", "age_range": "4 years"},
            60: {"type": "5_year", "name": "5 Year Visit", "age_range": "5 years"},
            72: {"type": "6_year", "name": "6 Year Visit", "age_range": "6 years"},
            84: {"type": "7_year", "name": "7 Year Visit", "age_range": "7 years"},
            96: {"type": "8_year", "name": "8 Year Visit", "age_range": "8 years"},
            108: {"type": "9_year", "name": "9 Year Visit", "age_range": "9 years"},
            120: {"type": "10_year", "name": "10 Year Visit", "age_range": "10 years"},
            132: {"type": "11_year", "name": "11 Year Visit", "age_range": "11 years"},
            144: {"type": "12_year", "name": "12 Year Visit", "age_range": "12 years"},
            156: {"type": "13_year", "name": "13 Year Visit", "age_range": "13 years"},
            168: {"type": "14_year", "name": "14 Year Visit", "age_range": "14 years"},
            180: {"type": "15_year", "name": "15 Year Visit", "age_range": "15 years"},
            192: {"type": "16_year", "name": "16 Year Visit", "age_range": "16 years"},
            204: {"type": "17_year", "name": "17 Year Visit", "age_range": "17 years"},
            216: {"type": "18_year", "name": "18 Year Visit", "age_range": "18 years"}
        }
        
        # Common vaccination schedule
        self.vaccination_schedule = {
            "BCG": {"ages": [0], "doses": 1},
            "Hepatit B": {"ages": [0, 2, 6], "doses": 3},
            "DTP": {"ages": [2, 4, 6, 15, 48], "doses": 5},
            "Hib": {"ages": [2, 4, 6, 15], "doses": 4},
            "Pneumo": {"ages": [2, 4, 6, 12], "doses": 4},
            "Polio": {"ages": [2, 4, 6, 18, 48], "doses": 5},
            "MMR": {"ages": [12, 48], "doses": 2},
            "Varicella": {"ages": [12, 48], "doses": 2},
            "Hepatit A": {"ages": [12, 18], "doses": 2}
        }
        
        # Developmental milestones by age
        self.developmental_milestones = {
            2: ["smiles", "follows_objects", "head_control"],
            4: ["laughs", "holds_head_up", "reaches_for_objects"],
            6: ["sits_with_support", "rolls_over", "babbles"],
            9: ["sits_without_support", "crawls", "says_mama_dada"],
            12: ["walks_with_support", "says_first_words", "feeds_self"],
            15: ["walks_independently", "says_3_words", "points"],
            18: ["runs", "says_10_words", "uses_spoon"],
            24: ["jumps", "combines_words", "follows_2_step_commands"],
            36: ["pedals_tricycle", "speaks_in_sentences", "toilet_training"],
            48: ["hops", "tells_stories", "dresses_self"],
            60: ["skips", "writes_name", "ties_shoes"]
        }
    
    def initialize_firebase(self):
        """Initialize Firebase connection"""
        try:
            if not firebase_admin._apps:
                # Try to get credentials from environment or file
                creds_base64 = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS_BASE64')
                if creds_base64:
                    import base64
                    creds_json = base64.b64decode(creds_base64).decode('utf-8')
                    creds_data = json.loads(creds_json)
                    cred = credentials.Certificate(creds_data)
                else:
                    creds_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS', 'service-account.json')
                    cred = credentials.Certificate(creds_path)
                
                firebase_admin.initialize_app(cred, {
                    'projectId': 'saglikpetegim'
                })
            
            self.db = firestore.client()
            logger.info("✓ Firebase initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {e}")
            return False
    
    def calculate_age_in_months(self, birth_date: datetime, reference_date: datetime) -> int:
        """Calculate age in months between two dates"""
        try:
            months = (reference_date.year - birth_date.year) * 12
            months += reference_date.month - birth_date.month
            return max(0, months)
        except:
            return 0
    
    def parse_date_string(self, date_str: str) -> Optional[datetime]:
        """Parse various date string formats"""
        if not date_str:
            return None
        
        # Try different date formats
        formats = ['%Y-%m-%d %H:%M:%S', '%Y-%m-%d', '%d.%m.%Y', '%d/%m/%Y', '%m/%d/%Y']
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt)
            except:
                continue
        
        return None
    
    def determine_closest_bf_visit(self, age_in_months: int) -> Dict:
        """Determine the closest Bright Futures visit for given age"""
        if age_in_months is None:
            return self.bf_visit_schedule[0]
        
        # Find the closest scheduled visit
        closest_age = min(self.bf_visit_schedule.keys(), 
                         key=lambda x: abs(x - age_in_months))
        
        return self.bf_visit_schedule[closest_age]
    
    def extract_patient_birth_date(self, patient_data: Dict) -> Optional[datetime]:
        """Extract birth date from patient data"""
        birth_date_str = None
        
        # Try different field names
        for field in ['birthDate', 'Doğum_Tarihi', 'birth_date', 'dateOfBirth']:
            if field in patient_data:
                birth_date_str = patient_data[field]
                break
        
        if birth_date_str:
            return self.parse_date_string(birth_date_str)
        
        return None
    
    def create_visit_schedule_for_patient(self, patient_id: str, birth_date: datetime) -> List[Dict]:
        """Create a complete visit schedule for a patient based on their age"""
        visit_schedule = []
        
        today = datetime.now()
        patient_age_months = self.calculate_age_in_months(birth_date, today)
        
        for age_months, visit_info in self.bf_visit_schedule.items():
            # Only create schedules for future visits or recent past visits
            if age_months <= patient_age_months + 6:  # Include visits up to 6 months in future
                scheduled_date = birth_date + timedelta(days=age_months * 30.44)  # Average month length
                
                visit_data = {
                    'patientId': patient_id,
                    'visitType': visit_info['type'],
                    'visitName': visit_info['name'],
                    'ageCategory': visit_info['age_range'],
                    'scheduledDate': scheduled_date,
                    'ageInMonths': age_months,
                    'status': 'scheduled' if scheduled_date > today else 'overdue',
                    'expectedMilestones': self.get_expected_milestones(age_months),
                    'expectedVaccinations': self.get_expected_vaccinations(age_months),
                    'screeningTests': self.get_expected_screenings(age_months),
                    'source': 'bf_schedule_generator',
                    'createdAt': firestore.SERVER_TIMESTAMP
                }
                
                visit_schedule.append(visit_data)
        
        return visit_schedule
    
    def get_expected_milestones(self, age_months: int) -> List[str]:
        """Get expected developmental milestones for given age"""
        milestones = []
        
        for milestone_age, milestone_list in self.developmental_milestones.items():
            if milestone_age <= age_months:
                milestones.extend(milestone_list)
        
        return milestones
    
    def get_expected_vaccinations(self, age_months: int) -> List[Dict]:
        """Get expected vaccinations for given age"""
        expected_vaccines = []
        
        for vaccine_name, schedule in self.vaccination_schedule.items():
            for dose_age in schedule['ages']:
                if abs(dose_age - age_months) <= 1:  # Within 1 month
                    expected_vaccines.append({
                        'vaccine': vaccine_name,
                        'doseNumber': schedule['ages'].index(dose_age) + 1,
                        'totalDoses': schedule['doses']
                    })
        
        return expected_vaccines
    
    def get_expected_screenings(self, age_months: int) -> List[str]:
        """Get expected screening tests for given age"""
        screenings = []
        
        # Define screening schedule
        screening_schedule = {
            2: ["hearing_test", "vision_screening"],
            6: ["iron_deficiency_screening"],
            12: ["lead_screening", "tuberculosis_test"],
            18: ["autism_screening_mchat"],
            24: ["vision_screening", "blood_pressure"],
            36: ["vision_screening", "hearing_test"],
            48: ["vision_screening", "blood_pressure"],
            60: ["vision_screening", "scoliosis_screening"],
            132: ["depression_screening", "scoliosis_screening"]  # 11 years
        }
        
        for screening_age, screening_list in screening_schedule.items():
            if abs(screening_age - age_months) <= 3:  # Within 3 months
                screenings.extend(screening_list)
        
        return screenings
    
    def analyze_completed_milestones(self, medical_records: List[Dict], age_months: int) -> Dict:
        """Analyze medical records to identify completed milestones"""
        completed_milestones = {
            'motor_skills': [],
            'language_skills': [],
            'social_skills': [],
            'cognitive_skills': []
        }
        
        # Analyze text in medical records for milestone indicators
        for record in medical_records:
            findings = (record.get('findings', '') or '').lower()
            history = (record.get('medicalHistory', '') or '').lower()
            notes = (record.get('notes', '') or '').lower()
            
            full_text = f"{findings} {history} {notes}"
            
            # Motor skills
            if any(word in full_text for word in ['yürüyor', 'walking', 'koşuyor', 'running']):
                completed_milestones['motor_skills'].append('walking')
            if any(word in full_text for word in ['oturuyor', 'sitting', 'emekliyor', 'crawling']):
                completed_milestones['motor_skills'].append('sitting')
            
            # Language skills
            if any(word in full_text for word in ['konuşuyor', 'talking', 'sözcük', 'word']):
                completed_milestones['language_skills'].append('talking')
            if any(word in full_text for word in ['gülüyor', 'laughing', 'smiling']):
                completed_milestones['social_skills'].append('social_smiling')
        
        return completed_milestones
    
    def generate_screening_recommendations(self, patient_id: str, age_months: int, 
                                         medical_history: List[Dict]) -> List[Dict]:
        """Generate screening recommendations based on age and medical history"""
        recommendations = []
        
        # Age-based screenings
        if age_months >= 18 and age_months <= 24:
            recommendations.append({
                'type': 'M-CHAT-R',
                'reason': 'Autism screening recommended at 18-24 months',
                'urgency': 'routine',
                'dueDate': datetime.now() + timedelta(days=30)
            })
        
        if age_months >= 12:
            recommendations.append({
                'type': 'lead_screening',
                'reason': 'Lead screening recommended at 12 months',
                'urgency': 'routine',
                'dueDate': datetime.now() + timedelta(days=30)
            })
        
        # Risk-based screenings based on medical history
        for record in medical_history:
            findings = (record.get('findings', '') or '').lower()
            
            if 'işitme' in findings or 'hearing' in findings:
                recommendations.append({
                    'type': 'audiology_referral',
                    'reason': 'Hearing concerns noted in medical history',
                    'urgency': 'high',
                    'dueDate': datetime.now() + timedelta(days=14)
                })
            
            if 'gelişim' in findings or 'development' in findings:
                recommendations.append({
                    'type': 'developmental_assessment',
                    'reason': 'Developmental concerns noted in medical history',
                    'urgency': 'medium',
                    'dueDate': datetime.now() + timedelta(days=30)
                })
        
        return recommendations
    
    def process_patients_for_bf_integration(self):
        """Process all patients to create Bright Futures integration data"""
        logger.info("🔄 Processing patients for Bright Futures integration...")
        
        try:
            # Get all users/patients
            users = self.db.collection('users').get()
            
            processed_count = 0
            
            for user in users:
                user_data = user.data()
                
                # Extract birth date
                birth_date = None
                if 'personalInfo' in user_data:
                    birth_date = self.extract_patient_birth_date(user_data['personalInfo'])
                
                if not birth_date:
                    logger.warning(f"No birth date found for user {user.id}")
                    continue
                
                # Calculate current age
                age_months = self.calculate_age_in_months(birth_date, datetime.now())
                
                # Get patient's medical records for analysis
                medical_records = list(self.db.collection('health_records')
                                     .where('userId', '==', user.id).get())
                medical_records_data = [record.data() for record in medical_records]
                
                # Create visit schedule
                visit_schedule = self.create_visit_schedule_for_patient(user.id, birth_date)
                
                # Analyze completed milestones
                completed_milestones = self.analyze_completed_milestones(medical_records_data, age_months)
                
                # Generate screening recommendations
                screening_recommendations = self.generate_screening_recommendations(
                    user.id, age_months, medical_records_data)
                
                # Save BF patient profile
                bf_profile = {
                    'patientId': user.id,
                    'patientName': user_data.get('displayName', ''),
                    'birthDate': birth_date,
                    'currentAgeMonths': age_months,
                    'currentAgeCategory': self.determine_closest_bf_visit(age_months),
                    'completedMilestones': completed_milestones,
                    'screeningRecommendations': screening_recommendations,
                    'visitSchedule': visit_schedule,
                    'lastUpdated': firestore.SERVER_TIMESTAMP,
                    'source': 'bf_data_mapper'
                }
                
                # Save to Firestore
                self.db.collection('bf_patient_profiles').document(user.id).set(bf_profile)
                
                # Save individual visit schedules
                for visit in visit_schedule:
                    visit_doc = self.db.collection('bf_visit_schedules').document()
                    visit_doc.set(visit)
                
                processed_count += 1
                logger.info(f"Processed BF integration for patient {user.id}")
                
                # Process in batches to avoid overwhelming Firestore
                if processed_count % 10 == 0:
                    logger.info(f"Processed {processed_count} patients so far...")
            
            logger.info(f"✅ Completed BF integration for {processed_count} patients")
            
        except Exception as e:
            logger.error(f"Error processing patients for BF integration: {e}")
            raise

def main():
    """Main entry point"""
    logger.info("🚀 Starting Bright Futures Data Mapper")
    
    mapper = BrightFuturesDataMapper()
    
    if not mapper.initialize_firebase():
        logger.error("Failed to initialize Firebase. Exiting.")
        sys.exit(1)
    
    # Process all patients for BF integration
    mapper.process_patients_for_bf_integration()
    
    logger.info("✅ Bright Futures Data Mapping completed")

if __name__ == '__main__':
    main()