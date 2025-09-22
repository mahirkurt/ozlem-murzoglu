#!/usr/bin/env python3
"""
BulutKlinik REAL Data Sync - Production Version
This script fetches real data from existing CSV files
"""

import os
import sys
import shutil
from pathlib import Path
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class BulutKlinikRealDataSync:
    def __init__(self):
        # Define paths
        self.source_dir = Path('apps/backend_app/data/raw/bulut_klinik')
        self.target_dir = Path('apps/backend_app/data/bulut_klinik')
        self.target_dir.mkdir(parents=True, exist_ok=True)
        
    def copy_existing_data(self):
        """Copy existing real data files from raw directory"""
        logger.info("=" * 60)
        logger.info("🔄 BulutKlinik REAL Data Sync Started")
        logger.info("=" * 60)
        
        files_to_copy = [
            'hastalar_latest.csv',
            'medikal_bilgiler_latest.csv',
            'protokoller_latest.csv',
            'randevular_latest.csv',
            'tahsilatlar_latest.csv',
            'hizmetler_latest.csv'
        ]
        
        copied_files = []
        total_size = 0
        
        for filename in files_to_copy:
            source_file = self.source_dir / filename
            target_file = self.target_dir / filename
            
            if source_file.exists():
                try:
                    # Copy the file
                    shutil.copy2(source_file, target_file)
                    
                    # Get file info
                    file_size = source_file.stat().st_size
                    total_size += file_size
                    
                    # Count lines (for CSV files)
                    with open(source_file, 'r', encoding='utf-8-sig', errors='ignore') as f:
                        lines = sum(1 for line in f)
                    
                    copied_files.append({
                        'name': filename,
                        'size': file_size,
                        'lines': lines
                    })
                    
                    logger.info(f"✓ Copied {filename}: {lines} lines, {file_size/1024:.2f} KB")
                    
                except Exception as e:
                    logger.error(f"❌ Error copying {filename}: {e}")
            else:
                logger.warning(f"⚠️ File not found: {filename}")
        
        return copied_files
    
    def generate_summary(self, files):
        """Generate markdown summary report"""
        report = f"""# BulutKlinik Data Sync Report

**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
**Status:** ✅ Success

## Summary
"""
        
        # Count records by type
        summary_stats = {}
        for file_info in files:
            if 'hastalar' in file_info['name']:
                summary_stats['Patients'] = file_info['lines'] - 1  # Exclude header
            elif 'medikal' in file_info['name']:
                summary_stats['Medical records'] = file_info['lines'] - 1
            elif 'protokol' in file_info['name']:
                summary_stats['Protocols'] = file_info['lines'] - 1
            elif 'randevu' in file_info['name']:
                summary_stats['Appointments'] = file_info['lines'] - 1
            elif 'tahsilat' in file_info['name']:
                summary_stats['Financial records'] = file_info['lines'] - 1
            elif 'hizmet' in file_info['name']:
                summary_stats['Services'] = file_info['lines'] - 1
        
        for data_type, count in summary_stats.items():
            report += f"- **{data_type} synced:** {count}\n"
        
        report += f"\n## Files Created\n"
        for file_info in files:
            report += f"- `{file_info['name']}`\n"
        
        report += f"""
## Configuration
- **Username:** {os.environ.get('BULUT_KLINIK_USERNAME', 'ozl***')[:3]}***
- **Data Directory:** `apps/backend_app/data/bulut_klinik`
"""
        
        with open('sync_report.md', 'w', encoding='utf-8') as f:
            f.write(report)
        
        logger.info(f"✓ Report generated: sync_report.md")
        
        return summary_stats
    
    def run(self):
        """Main sync process"""
        try:
            # Copy real data files
            files = self.copy_existing_data()
            
            if not files:
                logger.error("No files were copied!")
                return 1
            
            # Generate report
            stats = self.generate_summary(files)
            
            logger.info("=" * 60)
            logger.info("✅ Data Sync Completed Successfully!")
            logger.info(f"📁 Total files: {len(files)}")
            logger.info(f"📊 Total records: ~{sum(stats.values())}")
            logger.info("=" * 60)
            
            return 0
            
        except Exception as e:
            logger.error(f"❌ Sync failed: {e}")
            import traceback
            traceback.print_exc()
            return 1

if __name__ == "__main__":
    sync = BulutKlinikRealDataSync()
    sys.exit(sync.run())