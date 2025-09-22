#!/usr/bin/env python3
"""
Process Bulut Klinik CSV data locally without Firebase Auth
Creates structured JSON for later import
"""

import csv
import json
import os
import re
from datetime import datetime
from typing import Dict, List, Any
import hashlib

def parse_date(date_str: str) -> str:
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
            dt = datetime.strptime(date_str.strip(), fmt)
            return dt.isoformat()
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
        "birthWeight": None,
        "birthHeight": None,
        "birthWeek": None,
        "deliveryType": None,
        "vaccinations": [],
        "allergies": [],
        "medications": [],
        "hospitalizations": [],
        "examinations": [],
        "labResults": []
    }
    
    # Extract birth weight
    weight_match = re.search(r'(\d+)\s*g(?:r|ram)?', ozgecmis or '')
    if weight_match:
        medical_history["birthWeight"] = int(weight_match.group(1))
    
    # Extract birth height  
    height_match = re.search(r'(\d+)\s*cm', ozgecmis or '')
    if height_match:
        medical_history["birthHeight"] = int(height_match.group(1))
    
    # Extract gestational age
    week_match = re.search(r'(\d+)\+?(\d+)?\s*G[Hh]', ozgecmis or '')
    if week_match:
        weeks = int(week_match.group(1))
        days = int(week_match.group(2)) if week_match.group(2) else 0
        medical_history["birthWeek"] = weeks + (days / 7.0)
    
    # Detect delivery type
    if any(term in (ozgecmis or '').lower() for term in ['c/s', 'sezaryen', 'cesarean', 'sezeryan']):
        medical_history["deliveryType"] = "cesarean"
    elif any(term in (ozgecmis or '').lower() for term in ['normal', 'vajinal', 'nsvd']):
        medical_history["deliveryType"] = "vaginal"
    
    # Extract vaccinations
    vaccination_keywords = {
        'rotarix': 'Rotarix',
        'hepatit': 'Hepatit B',
        'bcg': 'BCG',
        'dbt': 'DBT',
        'opa': 'OPA',
        'kka': 'KKA',
        'suçiçeği': 'Suçiçeği',
        'menenjit': 'Menenjit',
        'meningokok': 'Meningokok'
    }
    
    text_to_search = (ozgecmis or '').lower() + ' ' + (soygecmis or '').lower()
    for keyword, vaccine_name in vaccination_keywords.items():
        if keyword in text_to_search:
            medical_history["vaccinations"].append(vaccine_name)
    
    # Extract examinations
    if 'göz muayenesi' in text_to_search:
        medical_history["examinations"].append("Göz Muayenesi")
    if 'kalça usg' in text_to_search or 'kalça ultrason' in text_to_search:
        medical_history["examinations"].append("Kalça USG")
    if 'işitme' in text_to_search:
        medical_history["examinations"].append("İşitme Testi")
    if 'tarama' in text_to_search:
        medical_history["examinations"].append("Yenidoğan Taraması")
    
    # Extract lab results
    lab_patterns = [
        (r'b12:\s*(\d+)', 'B12'),
        (r'ferritin:\s*(\d+[,.]?\d*)', 'Ferritin'),
        (r'demir.*?(\d+)/(\d+)', 'Demir/Total Demir'),
        (r'(\d+\.?\d*)/(\d+)/(\d+)/(\d+[,.]?\d*)/(\d+\.?\d*)', 'Hemogram')
    ]
    
    for pattern, lab_name in lab_patterns:
        match = re.search(pattern, ozgecmis or '', re.IGNORECASE)
        if match:
            medical_history["labResults"].append({
                "test": lab_name,
                "value": match.group(0)
            })
    
    return medical_history

def process_patients_csv(file_path: str) -> List[Dict[str, Any]]:
    """Process patients CSV file"""
    patients = []
    
    with open(file_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, delimiter=';')
        
        for row in reader:
            # Parse basic info
            patient = {
                "patientId": row.get("Hasta No", ""),
                "tcKimlik": row.get("Kimlik Numarası", ""),
                "firstName": row.get("Adı", "").strip(),
                "lastName": row.get("Soyadı", "").strip(), 
                "gender": "female" if row.get("Cinsiyeti") == "Kadın" else "male",
                "dateOfBirth": parse_date(row.get("Doğum Tarihi")),
                "placeOfBirth": row.get("Doğum Yeri", ""),
                "bloodType": row.get("Kan Grubu", ""),
                "address": row.get("Adres", ""),
                "phone": parse_phone(row.get("Telefon No")),
                "email": row.get("Eposta", "").strip(),
                "nationality": row.get("Uyruğu", "TÜRKİYE CUMHURİYETİ"),
                "passportNo": row.get("Pasaport Numarası", ""),
                "notes": row.get("Not", ""),
                "insurance": row.get("Anlaşmalı Kurum", ""),
                "registrationReason": row.get("Geliş Nedeni", "")
            }
            
            # Parse family info
            patient["parents"] = {
                "mother": {
                    "name": row.get("Anne Adı", ""),
                    "email": None,
                    "phone": None,
                    "info": {}
                },
                "father": {
                    "name": row.get("Baba Adı", ""),
                    "email": None,
                    "phone": None,
                    "info": {}
                }
            }
            
            # Parse medical history
            medical_history = parse_medical_history(
                row.get("Özgeçmiş"),
                row.get("Soygeçmiş")
            )
            patient["medicalHistory"] = medical_history
            
            # Parse allergies
            allergies_text = row.get("Alerjiler", "")
            if allergies_text:
                patient["medicalHistory"]["allergies"] = [a.strip() for a in allergies_text.split(',')]
            
            # Extract parent info from medical history
            family_history = row.get("Soygeçmiş", "")
            if family_history:
                # Try to extract mother's info
                mother_patterns = [
                    r'[Aa]nne\s+(\w+)[,\s]+(\d{4})',
                    r'(\w+)[,\s]+(\d{4})[,\s]+.*?anne'
                ]
                for pattern in mother_patterns:
                    mother_match = re.search(pattern, family_history)
                    if mother_match:
                        patient["parents"]["mother"]["name"] = mother_match.group(1) if not patient["parents"]["mother"]["name"] else patient["parents"]["mother"]["name"]
                        patient["parents"]["mother"]["info"]["birthYear"] = int(mother_match.group(2))
                        break
                
                # Extract mother's height
                mother_height = re.search(r'anne.*?(\d{3})\s*cm', family_history, re.IGNORECASE)
                if mother_height:
                    patient["parents"]["mother"]["info"]["height"] = int(mother_height.group(1))
                
                # Try to extract father's info
                father_patterns = [
                    r'[Bb]aba\s+(\w+)[,\s]+(\d{4})',
                    r'(\w+)[,\s]+(\d{4})[,\s]+.*?baba'
                ]
                for pattern in father_patterns:
                    father_match = re.search(pattern, family_history)
                    if father_match:
                        patient["parents"]["father"]["name"] = father_match.group(1) if not patient["parents"]["father"]["name"] else patient["parents"]["father"]["name"]
                        patient["parents"]["father"]["info"]["birthYear"] = int(father_match.group(2))
                        break
                
                # Extract father's height
                father_height = re.search(r'baba.*?(\d{3})\s*cm', family_history, re.IGNORECASE)
                if father_height:
                    patient["parents"]["father"]["info"]["height"] = int(father_height.group(1))
            
            # Use patient's email for primary caregiver if available
            if patient["email"]:
                patient["parents"]["mother"]["email"] = patient["email"]
                patient["parents"]["mother"]["phone"] = patient["phone"]
            
            # Generate caregiver info
            patient["caregivers"] = []
            
            # Add mother as primary caregiver
            if patient["parents"]["mother"]["name"]:
                mother_email = patient["parents"]["mother"].get("email")
                if not mother_email:
                    mother_email = generate_email_from_name(
                        patient["parents"]["mother"]["name"],
                        patient["lastName"],
                        patient["patientId"]
                    )
                
                patient["caregivers"].append({
                    "email": mother_email,
                    "name": f"{patient['parents']['mother']['name']} {patient['lastName']}",
                    "relationship": "mother",
                    "isPrimary": True,
                    "phone": patient["parents"]["mother"].get("phone", patient["phone"])
                })
            
            # Add father as secondary caregiver if has name
            if patient["parents"]["father"]["name"]:
                father_email = generate_email_from_name(
                    patient["parents"]["father"]["name"],
                    patient["lastName"],
                    patient["patientId"] + "_father"
                )
                
                patient["caregivers"].append({
                    "email": father_email,
                    "name": f"{patient['parents']['father']['name']} {patient['lastName']}",
                    "relationship": "father",
                    "isPrimary": False
                })
            
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
                "appointmentId": row.get("Protokol No", ""),
                "patientId": row.get("Hasta No", ""),
                "date": parse_date(row.get("Tarih")),
                "time": row.get("Saat", ""),
                "doctor": row.get("Doktor", ""),
                "service": row.get("Hizmet", ""),
                "status": row.get("Durum", "completed"),
                "notes": row.get("Not", "")
            }
            
            if appointment["patientId"]:
                appointments.append(appointment)
    
    return appointments

def process_services_csv(file_path: str) -> List[Dict[str, Any]]:
    """Process services CSV file"""
    services = []
    
    if not os.path.exists(file_path):
        return services
    
    with open(file_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, delimiter=';')
        
        for row in reader:
            service = {
                "serviceId": row.get("Hizmet Kodu", ""),
                "name": row.get("Hizmet Adı", ""),
                "category": row.get("Kategori", ""),
                "price": row.get("Fiyat", ""),
                "duration": row.get("Süre", "")
            }
            services.append(service)
    
    return services

def main():
    """Main function"""
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'bulut_klinik')
    output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'processed')
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Process patients
    patients_file = os.path.join(data_dir, 'hastalar_latest.csv')
    if os.path.exists(patients_file):
        print(f"Processing patients from {patients_file}")
        patients = process_patients_csv(patients_file)
        print(f"Processed {len(patients)} patients")
        
        # Save to JSON
        output_file = os.path.join(output_dir, 'patients.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(patients, f, ensure_ascii=False, indent=2, default=str)
        print(f"Saved patients to {output_file}")
    else:
        print("Patients file not found")
        patients = []
    
    # Process appointments
    appointments_file = os.path.join(data_dir, 'randevular_latest.csv')
    if os.path.exists(appointments_file):
        print(f"Processing appointments from {appointments_file}")
        appointments = process_appointments_csv(appointments_file)
        print(f"Processed {len(appointments)} appointments")
        
        # Save to JSON
        output_file = os.path.join(output_dir, 'appointments.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(appointments, f, ensure_ascii=False, indent=2, default=str)
        print(f"Saved appointments to {output_file}")
    else:
        print("Appointments file not found")
    
    # Process services
    services_file = os.path.join(data_dir, 'hizmetler_latest.csv')
    if os.path.exists(services_file):
        print(f"Processing services from {services_file}")
        services = process_services_csv(services_file)
        print(f"Processed {len(services)} services")
        
        # Save to JSON
        output_file = os.path.join(output_dir, 'services.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(services, f, ensure_ascii=False, indent=2, default=str)
        print(f"Saved services to {output_file}")
    else:
        print("Services file not found")
    
    # Create summary
    summary = {
        "processedAt": datetime.now().isoformat(),
        "stats": {
            "patients": len(patients),
            "appointments": len(appointments) if 'appointments' in locals() else 0,
            "services": len(services) if 'services' in locals() else 0,
            "caregivers": sum(len(p["caregivers"]) for p in patients)
        }
    }
    
    summary_file = os.path.join(output_dir, 'summary.json')
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print(f"\nSummary saved to {summary_file}")
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    main()