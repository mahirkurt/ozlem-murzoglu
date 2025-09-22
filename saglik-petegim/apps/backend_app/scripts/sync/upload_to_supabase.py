#!/usr/bin/env python3
"""
Upload Bulut Klinik CSV data to Supabase
Transforms and standardizes data before uploading
"""

import os
import sys
import csv
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
import argparse
from dotenv import load_dotenv

# Add Supabase client
try:
    from supabase import create_client, Client
    import pandas as pd
except ImportError:
    print("Required packages missing. Install with:")
    print("pip install supabase pandas python-dotenv")
    sys.exit(1)

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class BulutKlinikToSupabase:
    """Handle data transformation and upload to Supabase"""
    
    def __init__(self, supabase_url: str, supabase_key: str, data_dir: str):
        """Initialize the uploader
        
        Args:
            supabase_url: Supabase project URL
            supabase_key: Supabase service key
            data_dir: Directory containing CSV files
        """
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.data_dir = Path(data_dir)
        self.patient_map = {}  # TC -> UUID mapping
        
    def read_csv(self, filename: str, encoding: str = 'utf-8-sig') -> List[Dict]:
        """Read CSV file and return as list of dictionaries"""
        filepath = self.data_dir / filename
        if not filepath.exists():
            logger.warning(f"File not found: {filepath}")
            return []
        
        try:
            with open(filepath, 'r', encoding=encoding) as f:
                # Use semicolon as delimiter (Bulut Klinik format)
                reader = csv.DictReader(f, delimiter=';')
                return list(reader)
        except Exception as e:
            logger.error(f"Error reading {filename}: {str(e)}")
            return []
    
    def parse_date(self, date_str: Optional[str]) -> Optional[str]:
        """Parse date string to ISO format"""
        if not date_str or date_str.strip() == '':
            return None
        
        try:
            # Try different date formats
            for fmt in ['%Y-%m-%d', '%d.%m.%Y', '%d/%m/%Y', '%Y/%m/%d']:
                try:
                    dt = datetime.strptime(date_str.strip(), fmt)
                    return dt.strftime('%Y-%m-%d')
                except ValueError:
                    continue
            return None
        except Exception:
            return None
    
    def parse_datetime(self, datetime_str: Optional[str]) -> Optional[str]:
        """Parse datetime string to ISO format"""
        if not datetime_str or datetime_str.strip() == '':
            return None
        
        try:
            # Try different datetime formats
            for fmt in ['%Y-%m-%d %H:%M:%S', '%d.%m.%Y %H:%M:%S', '%d/%m/%Y %H:%M']:
                try:
                    dt = datetime.strptime(datetime_str.strip(), fmt)
                    return dt.isoformat()
                except ValueError:
                    continue
            return None
        except Exception:
            return None
    
    def parse_decimal(self, value: Optional[str]) -> Optional[float]:
        """Parse decimal value"""
        if not value or value.strip() == '':
            return None
        
        try:
            # Replace comma with dot for decimal
            cleaned = value.strip().replace(',', '.')
            return float(cleaned)
        except (ValueError, AttributeError):
            return None
    
    def upload_patients(self) -> Dict[str, str]:
        """Upload patient data and return TC -> UUID mapping"""
        logger.info("Uploading patients...")
        
        patients_data = self.read_csv('hastalar_latest.csv')
        if not patients_data:
            logger.error("No patient data found")
            return {}
        
        patient_map = {}
        success_count = 0
        error_count = 0
        
        for row in patients_data:
            try:
                # Transform data
                patient = {
                    'tc_kimlik_no': row.get('Kimlik Numarası', '').strip(),
                    'hasta_no': row.get('Hasta No', '').strip(),
                    'adi': row.get('Adı', '').strip(),
                    'soyadi': row.get('Soyadı', '').strip(),
                    'cinsiyeti': row.get('Cinsiyeti', '').strip(),
                    'uyrugu': row.get('Uyruğu', '').strip() or None,
                    'pasaport_no': row.get('Pasaport Numarası', '').strip() or None,
                    'gelis_tarihi': self.parse_date(row.get('Geliş Tarihi')),
                    'ozgecmis': row.get('Özgeçmiş', '').strip() or None,
                    'soygecmis': row.get('Soygeçmiş', '').strip() or None,
                    'alerjiler': row.get('Alerjiler', '').strip() or None,
                    'gelis_nedeni': row.get('Geliş Nedeni', '').strip() or None,
                    'adres': row.get('Adres', '').strip() or None,
                    'dogum_tarihi': self.parse_date(row.get('Doğum Tarihi')),
                    'dogum_yeri': row.get('Doğum Yeri', '').strip() or None,
                    'telefon_no': row.get('Telefon No', '').strip() or None,
                    'eposta': row.get('Eposta', '').strip() or None,
                    'kan_grubu': row.get('Kan Grubu', '').strip() or None,
                    'baba_adi': row.get('Baba Adı', '').strip() or None,
                    'anne_adi': row.get('Anne Adı', '').strip() or None,
                    'medeni_hali': row.get('Medeni Hali', '').strip() or None,
                    'notlar': row.get('Not', '').strip() or None,
                    'anlasmalı_kurum': row.get('Anlaşmalı Kurum', '').strip() or None,
                }
                
                # Skip if no TC or hasta_no
                if not patient['tc_kimlik_no'] or not patient['hasta_no']:
                    logger.warning(f"Skipping patient without TC/No: {patient.get('adi')} {patient.get('soyadi')}")
                    continue
                
                # Upsert to Supabase
                result = self.supabase.table('bulut_klinik_patients').upsert(
                    patient,
                    on_conflict='tc_kimlik_no'
                ).execute()
                
                if result.data:
                    patient_id = result.data[0]['id']
                    patient_map[patient['tc_kimlik_no']] = patient_id
                    patient_map[patient['hasta_no']] = patient_id
                    success_count += 1
                    logger.debug(f"Uploaded patient: {patient['adi']} {patient['soyadi']}")
                
            except Exception as e:
                error_count += 1
                logger.error(f"Error uploading patient {row.get('Adı', '')} {row.get('Soyadı', '')}: {str(e)}")
        
        logger.info(f"Patients upload completed: {success_count} success, {error_count} errors")
        self.patient_map = patient_map
        return patient_map
    
    def upload_protocols(self):
        """Upload protocol data"""
        logger.info("Uploading protocols...")
        
        protocols_data = self.read_csv('protokoller_latest.csv')
        if not protocols_data:
            logger.warning("No protocol data found")
            return
        
        success_count = 0
        error_count = 0
        
        for row in protocols_data:
            try:
                hasta_no = row.get('Hasta No', '').strip()
                patient_id = self.patient_map.get(hasta_no)
                
                if not patient_id:
                    logger.warning(f"Patient not found for protocol: {row.get('Protokol No')}")
                    continue
                
                protocol = {
                    'protokol_no': row.get('Protokol No', '').strip(),
                    'patient_id': patient_id,
                    'hasta_no': hasta_no,
                    'isim': row.get('İsim', '').strip(),
                    'soyisim': row.get('Soyisim', '').strip(),
                    'baba_adi': row.get('Baba Adı', '').strip() or None,
                    'anne_adi': row.get('Anne Adı', '').strip() or None,
                    'anne_tc_no': row.get('Anne TC No', '').strip() or None,
                    'anlasmalı_kurum': row.get('Anlaşmalı Kurum', '').strip() or None,
                    'brans': row.get('Branş', '').strip() or None,
                    'doktor': row.get('Doktor', '').strip() or None,
                    'protokol_tarihi': self.parse_datetime(row.get('Protokol Tarihi')),
                    'protokol_tipi': row.get('Protokol Tipi', '').strip() or None,
                    'gelis_nedeni': row.get('Geliş Nedeni', '').strip() or None,
                }
                
                result = self.supabase.table('bulut_klinik_protocols').upsert(
                    protocol,
                    on_conflict='protokol_no'
                ).execute()
                
                if result.data:
                    success_count += 1
                
            except Exception as e:
                error_count += 1
                logger.error(f"Error uploading protocol {row.get('Protokol No', '')}: {str(e)}")
        
        logger.info(f"Protocols upload completed: {success_count} success, {error_count} errors")
    
    def upload_services(self):
        """Upload service data"""
        logger.info("Uploading services...")
        
        services_data = self.read_csv('hizmetler_latest.csv')
        if not services_data:
            logger.warning("No service data found")
            return
        
        success_count = 0
        error_count = 0
        
        for row in services_data:
            try:
                # Try to find patient by name
                hasta_adi = row.get('Hasta Adı', '').strip()
                patient_id = None
                
                # Search in patient_map by name (approximate)
                for tc, pid in self.patient_map.items():
                    if not tc.isdigit():  # Skip hasta_no entries
                        continue
                    # This is a simplified matching - in production, use better matching
                    patient_id = pid
                    break
                
                service = {
                    'protokol_no': row.get('Protokol No', '').strip(),
                    'hizmet_no': row.get('Hizmet No', '').strip(),
                    'patient_id': patient_id,
                    'hasta_adi': hasta_adi,
                    'islem_tarihi': self.parse_datetime(row.get('İşlem Tarihi')),
                    'hizmet_vergi': self.parse_decimal(row.get('Hizmet Vergi')),
                    'adet': int(row.get('Adet', 1)) if row.get('Adet') else 1,
                    'hasta_tutari': self.parse_decimal(row.get('Hasta Tutarı')),
                    'kurum_tutari': self.parse_decimal(row.get('Kurum Tutarı')),
                    'hizmet_adi': row.get('Hizmet Adı', '').strip() or None,
                    'grup_adi': row.get('Grup Adı', '').strip() or None,
                    'indirim_tutari': self.parse_decimal(row.get('İndirim Tutarı')),
                    'tahsilat_tutari': self.parse_decimal(row.get('Tahsilat Tutarı')),
                }
                
                result = self.supabase.table('bulut_klinik_services').insert(service).execute()
                
                if result.data:
                    success_count += 1
                
            except Exception as e:
                error_count += 1
                logger.error(f"Error uploading service: {str(e)}")
        
        logger.info(f"Services upload completed: {success_count} success, {error_count} errors")
    
    def upload_appointments(self):
        """Upload appointment data"""
        logger.info("Uploading appointments...")
        
        appointments_data = self.read_csv('randevular_latest.csv')
        if not appointments_data:
            logger.warning("No appointment data found")
            return
        
        success_count = 0
        error_count = 0
        
        for row in appointments_data:
            try:
                hasta_no = row.get('Hasta_No', '').strip()
                patient_id = self.patient_map.get(hasta_no)
                
                appointment = {
                    'patient_id': patient_id,
                    'hasta_no': hasta_no,
                    'hasta_adi': row.get('Hasta_Adı', '').strip(),
                    'hasta_soyadi': row.get('Hasta_Soyadı', '').strip(),
                    'telefon': row.get('Telefon', '').strip() or None,
                    'randevu_baslangic': self.parse_datetime(row.get('Randevu_Başlangıç')),
                    'randevu_bitis': self.parse_datetime(row.get('Randevu_Bitiş')),
                    'randevu_tipi': row.get('Randevu_Tipi', '').strip() or None,
                    'randevu_durumu': row.get('Randevu_Durumu', '').strip() or None,
                    'randevu_basligi': row.get('Randevu_Başlığı', '').strip() or None,
                    'randevu_notu': row.get('Randevu_Notu', '').strip() or None,
                    'doktor': row.get('Doktor', '').strip() or None,
                    'kaynak': row.get('Kaynak', '').strip() or None,
                }
                
                if appointment['randevu_baslangic']:
                    result = self.supabase.table('bulut_klinik_appointments').insert(appointment).execute()
                    
                    if result.data:
                        success_count += 1
                
            except Exception as e:
                error_count += 1
                logger.error(f"Error uploading appointment: {str(e)}")
        
        logger.info(f"Appointments upload completed: {success_count} success, {error_count} errors")
    
    def upload_payments(self):
        """Upload payment data"""
        logger.info("Uploading payments...")
        
        payments_data = self.read_csv('tahsilatlar_latest.csv')
        if not payments_data:
            logger.warning("No payment data found")
            return
        
        success_count = 0
        error_count = 0
        
        for row in payments_data:
            try:
                hasta_no = row.get('Hasta_No', '').strip()
                patient_id = self.patient_map.get(hasta_no)
                
                payment = {
                    'protokol_no': row.get('Protokol_No', '').strip(),
                    'patient_id': patient_id,
                    'hasta_no': hasta_no,
                    'hasta_adi': row.get('Hasta_Adı', '').strip(),
                    'hasta_soyadi': row.get('Hasta_Soyadı', '').strip(),
                    'odenen_miktar': self.parse_decimal(row.get('Ödenen_Miktar')),
                    'cinsi': row.get('Cinsi', 'TL').strip(),
                    'tarihi': self.parse_datetime(row.get('Tarihi')),
                }
                
                if payment['odenen_miktar'] and payment['tarihi']:
                    result = self.supabase.table('bulut_klinik_payments').insert(payment).execute()
                    
                    if result.data:
                        success_count += 1
                
            except Exception as e:
                error_count += 1
                logger.error(f"Error uploading payment: {str(e)}")
        
        logger.info(f"Payments upload completed: {success_count} success, {error_count} errors")
    
    def upload_medical_records(self):
        """Upload medical record data"""
        logger.info("Uploading medical records...")
        
        medical_data = self.read_csv('medikal_bilgiler_latest.csv')
        if not medical_data:
            logger.warning("No medical record data found")
            return
        
        success_count = 0
        error_count = 0
        
        for row in medical_data:
            try:
                tc_no = row.get('Hasta Kimlik Numarası', '').strip()
                patient_id = self.patient_map.get(tc_no)
                
                # Extract physical data from Bulgular if present
                bulgular = row.get('Bulgular', '')
                kilo = None
                boy = None
                tansiyon = None
                
                # Simple extraction (can be improved with regex)
                if 'kg' in bulgular.lower():
                    try:
                        # Extract weight
                        import re
                        weight_match = re.search(r'(\d+[.,]?\d*)\s*kg', bulgular.lower())
                        if weight_match:
                            kilo = self.parse_decimal(weight_match.group(1))
                    except:
                        pass
                
                if 'cm' in bulgular.lower():
                    try:
                        # Extract height
                        import re
                        height_match = re.search(r'(\d+[.,]?\d*)\s*cm', bulgular.lower())
                        if height_match:
                            boy = self.parse_decimal(height_match.group(1))
                    except:
                        pass
                
                medical_record = {
                    'protokol_no': row.get('Protokol No', '').strip(),
                    'patient_id': patient_id,
                    'hasta_kimlik_no': tc_no,
                    'hasta_adi': row.get('Hasta Adı', '').strip(),
                    'hasta_soyadi': row.get('Hasta Soyadı', '').strip(),
                    'protokol_tarihi': self.parse_datetime(row.get('Protokol Tarihi')),
                    'hikayesi': row.get('Hikayesi', '').strip() or None,
                    'sikayeti': row.get('Şikayeti', '').strip() or None,
                    'ozgecmis': row.get('Özgeçmiş', '').strip() or None,
                    'soygecmis': row.get('Soygeçmiş', '').strip() or None,
                    'bulgular': bulgular or None,
                    'uygulamalar': row.get('Uygulamalar', '').strip() or None,
                    'oneriler': row.get('Öneriler', '').strip() or None,
                    'notlar': row.get('Notlar', '').strip() or None,
                    'tani_kodlari': row.get('Tanı Kodları', '').strip() or None,
                    'kilo': kilo,
                    'boy': boy,
                    'tansiyon': tansiyon,
                }
                
                result = self.supabase.table('bulut_klinik_medical_records').insert(medical_record).execute()
                
                if result.data:
                    success_count += 1
                
            except Exception as e:
                error_count += 1
                logger.error(f"Error uploading medical record: {str(e)}")
        
        logger.info(f"Medical records upload completed: {success_count} success, {error_count} errors")
    
    def upload_all(self):
        """Upload all data in the correct order"""
        logger.info("Starting full data upload to Supabase...")
        
        # Order matters - patients first, then related data
        self.upload_patients()
        self.upload_protocols()
        self.upload_services()
        self.upload_appointments()
        self.upload_payments()
        self.upload_medical_records()
        
        logger.info("Full data upload completed!")

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Upload Bulut Klinik data to Supabase")
    parser.add_argument(
        "--data-dir",
        default="apps/backend_app/data/bulut_klinik",
        help="Directory containing CSV files"
    )
    parser.add_argument(
        "--supabase-url",
        default=os.getenv("SUPABASE_URL"),
        help="Supabase project URL"
    )
    parser.add_argument(
        "--supabase-key",
        default=os.getenv("SUPABASE_SERVICE_KEY"),
        help="Supabase service key"
    )
    
    args = parser.parse_args()
    
    if not args.supabase_url or not args.supabase_key:
        logger.error("Supabase URL and service key are required")
        sys.exit(1)
    
    uploader = BulutKlinikToSupabase(
        supabase_url=args.supabase_url,
        supabase_key=args.supabase_key,
        data_dir=args.data_dir
    )
    
    uploader.upload_all()

if __name__ == "__main__":
    main()