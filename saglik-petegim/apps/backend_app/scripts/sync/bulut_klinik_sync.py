#!/usr/bin/env python3
"""
Bulut Klinik EHR Integration Script
Downloads CSV data files from Bulut Klinik system
"""

import os
import sys
import time
import logging
from datetime import datetime
from pathlib import Path
import requests
from typing import Dict, List, Optional
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class BulutKlinikSync:
    """Handles authentication and data synchronization with Bulut Klinik"""
    
    BASE_URL = "https://app.bulutklinik.com"
    LOGIN_URL = f"{BASE_URL}"  # Main page usually has login form
    CLINIC_MEMBERSHIP_URL = f"{BASE_URL}/Sec/Security/clinic_membership"
    
    # Export endpoints based on the HTML content
    EXPORT_ENDPOINTS = {
        "hastalar": "/Sec/Security/export_data/0",  # Patients
        "hizmetler": "/Sec/Security/export_data/1",  # Services
        "protokoller": "/Sec/Security/export_data/2",  # Protocols
        "tahsilatlar": "/Sec/Security/export_data/3",  # Collections
        "randevular": "/Sec/Security/export_data/4",  # Appointments
        "medikal_bilgiler": "/Sec/Security/export_data/5",  # Medical Info
        "obstetri": "/Sec/Security/export_data/6",  # Obstetrics
        "gynecology": "/Sec/Security/export_data/7",  # Gynecology
        "persentil": "/Sec/Security/export_pediatrics_data/1",  # Percentile
        "muayene": "/Sec/Security/export_pediatrics_data/2",  # Examination
        "asilar": "/Sec/Security/export_pediatrics_data/3",  # Vaccinations
    }
    
    def __init__(self, username: str, password: str, data_dir: str):
        """Initialize the sync client
        
        Args:
            username: Login username
            password: Login password
            data_dir: Directory to save CSV files
        """
        self.username = username
        self.password = password
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
    def login(self) -> bool:
        """Authenticate with Bulut Klinik
        
        Returns:
            True if login successful, False otherwise
        """
        try:
            logger.info("Attempting to login to Bulut Klinik...")
            
            # First, get the login page to obtain any necessary tokens
            response = self.session.get(self.LOGIN_URL)
            if response.status_code != 200:
                logger.error(f"Failed to access login page: {response.status_code}")
                return False
            
            # Prepare login data
            login_data = {
                'Username': self.username,
                'Password': self.password,
                'RememberMe': 'false'
            }
            
            # Submit login credentials
            response = self.session.post(
                self.LOGIN_URL,
                data=login_data,
                allow_redirects=True
            )
            
            # Check if login was successful
            if response.status_code == 200:
                # Verify we can access the clinic membership page
                verify_response = self.session.get(self.CLINIC_MEMBERSHIP_URL)
                if verify_response.status_code == 200:
                    logger.info("Successfully logged in to Bulut Klinik")
                    return True
                else:
                    logger.error("Login appeared successful but cannot access data page")
                    return False
            else:
                logger.error(f"Login failed with status code: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return False
    
    def download_csv(self, endpoint_name: str, endpoint_path: str) -> bool:
        """Download a specific CSV file
        
        Args:
            endpoint_name: Name of the data type (for file naming)
            endpoint_path: API endpoint path
            
        Returns:
            True if download successful, False otherwise
        """
        try:
            url = f"{self.BASE_URL}{endpoint_path}"
            logger.info(f"Downloading {endpoint_name} from {url}")
            
            response = self.session.get(url, stream=True)
            
            if response.status_code == 200:
                # Generate filename with timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{endpoint_name}_{timestamp}.csv"
                filepath = self.data_dir / filename
                
                # Save the file
                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                
                # Also save as latest version (without timestamp)
                latest_filepath = self.data_dir / f"{endpoint_name}_latest.csv"
                with open(filepath, 'rb') as src, open(latest_filepath, 'wb') as dst:
                    dst.write(src.read())
                
                logger.info(f"Successfully downloaded {endpoint_name} to {filepath}")
                return True
            else:
                logger.error(f"Failed to download {endpoint_name}: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error downloading {endpoint_name}: {str(e)}")
            return False
    
    def sync_all_data(self) -> Dict[str, bool]:
        """Download all available CSV files
        
        Returns:
            Dictionary with download status for each endpoint
        """
        results = {}
        
        if not self.login():
            logger.error("Failed to authenticate. Cannot proceed with sync.")
            return results
        
        logger.info("Starting data synchronization...")
        
        for name, endpoint in self.EXPORT_ENDPOINTS.items():
            # Add a small delay between requests to be respectful
            time.sleep(1)
            
            success = self.download_csv(name, endpoint)
            results[name] = success
            
            if success:
                logger.info(f"✓ {name} downloaded successfully")
            else:
                logger.warning(f"✗ {name} download failed")
        
        # Log summary
        successful = sum(1 for v in results.values() if v)
        total = len(results)
        logger.info(f"Sync completed: {successful}/{total} files downloaded successfully")
        
        return results
    
    def cleanup_old_files(self, days_to_keep: int = 7):
        """Remove old CSV files to save space
        
        Args:
            days_to_keep: Number of days to keep files
        """
        try:
            cutoff_time = time.time() - (days_to_keep * 24 * 60 * 60)
            
            for filepath in self.data_dir.glob("*.csv"):
                # Skip latest files
                if "_latest.csv" in filepath.name:
                    continue
                    
                if filepath.stat().st_mtime < cutoff_time:
                    filepath.unlink()
                    logger.info(f"Removed old file: {filepath.name}")
                    
        except Exception as e:
            logger.error(f"Error during cleanup: {str(e)}")


def main():
    """Main entry point for the sync script"""
    parser = argparse.ArgumentParser(description="Sync data from Bulut Klinik EHR")
    parser.add_argument(
        "--username",
        default=os.environ.get("BULUT_KLINIK_USERNAME"),
        help="Bulut Klinik username (or set BULUT_KLINIK_USERNAME env var)"
    )
    parser.add_argument(
        "--password",
        default=os.environ.get("BULUT_KLINIK_PASSWORD"),
        help="Bulut Klinik password (or set BULUT_KLINIK_PASSWORD env var)"
    )
    parser.add_argument(
        "--data-dir",
        default=os.environ.get("BULUT_KLINIK_DATA_DIR", "apps/backend_app/data/bulut_klinik"),
        help="Directory to save CSV files"
    )
    parser.add_argument(
        "--cleanup",
        action="store_true",
        help="Clean up old files after sync"
    )
    parser.add_argument(
        "--cleanup-days",
        type=int,
        default=7,
        help="Number of days to keep old files (default: 7)"
    )
    
    args = parser.parse_args()
    
    # Validate credentials
    if not args.username or not args.password:
        logger.error("Username and password are required")
        sys.exit(1)
    
    # Create sync client
    client = BulutKlinikSync(
        username=args.username,
        password=args.password,
        data_dir=args.data_dir
    )
    
    # Perform sync
    results = client.sync_all_data()
    
    # Cleanup if requested
    if args.cleanup:
        client.cleanup_old_files(args.cleanup_days)
    
    # Exit with appropriate code
    if not results:
        sys.exit(1)
    elif all(results.values()):
        sys.exit(0)
    else:
        sys.exit(2)  # Partial success


if __name__ == "__main__":
    main()