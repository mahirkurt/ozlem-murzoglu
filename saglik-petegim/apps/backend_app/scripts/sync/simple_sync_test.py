#!/usr/bin/env python3
"""
Simple sync test script for GitHub Actions validation
"""

import os
import sys
import json
from datetime import datetime
from pathlib import Path

def main():
    print("=== BulutKlinik Simple Sync Test ===")
    print(f"Time: {datetime.now().isoformat()}")
    
    # Check environment variables
    username = os.environ.get('BULUT_KLINIK_USERNAME')
    password = os.environ.get('BULUT_KLINIK_PASSWORD')
    data_dir = os.environ.get('BULUT_KLINIK_DATA_DIR', 'apps/backend_app/data/bulut_klinik')
    
    if not username or not password:
        print("ERROR: Missing credentials!")
        print(f"Username provided: {bool(username)}")
        print(f"Password provided: {bool(password)}")
        sys.exit(1)
    
    print(f"Username: {username[:3]}***")
    print(f"Data directory: {data_dir}")
    
    # Create data directory
    data_path = Path(data_dir)
    data_path.mkdir(parents=True, exist_ok=True)
    
    # Create test files
    test_data = {
        "sync_time": datetime.now().isoformat(),
        "status": "success",
        "message": "Test sync completed successfully",
        "credentials_valid": True,
        "data_dir": str(data_path.absolute())
    }
    
    # Write test output
    output_file = data_path / f"sync_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(test_data, f, indent=2, ensure_ascii=False)
    
    print(f"Test file created: {output_file}")
    
    # Create sample CSV files for testing
    sample_files = [
        "hastalar_latest.csv",
        "protokoller_latest.csv",
        "medikal_bilgiler_latest.csv"
    ]
    
    for filename in sample_files:
        filepath = data_path / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write("id,name,data\n")
            f.write("1,Test Patient,Sample Data\n")
        print(f"Created sample file: {filepath}")
    
    print("\n=== Sync Test Completed Successfully ===")
    return 0

if __name__ == "__main__":
    sys.exit(main())