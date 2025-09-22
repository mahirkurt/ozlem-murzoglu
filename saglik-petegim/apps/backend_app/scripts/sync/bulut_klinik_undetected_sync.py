#!/usr/bin/env python3
"""
Bulut Klinik EHR Integration Script (Undetected Chrome Version)
Downloads CSV data files from Bulut Klinik system using undetected Chrome
to bypass reCAPTCHA and other bot detection mechanisms
"""

import os
import sys
import time
import logging
from datetime import datetime
from pathlib import Path
import argparse
from typing import Dict, List, Optional
import shutil

try:
    import undetected_chromedriver as uc
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
except ImportError as e:
    print(f"Required packages missing: {e}")
    print("Install with: pip install undetected-chromedriver selenium")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class BulutKlinikUndetectedSync:
    """Handles authentication and data synchronization with Bulut Klinik using undetected Chrome"""
    
    BASE_URL = "https://app.bulutklinik.com"
    LOGIN_URL = f"{BASE_URL}/Login.gg"
    CLINIC_MEMBERSHIP_URL = f"{BASE_URL}/Sec/Security/clinic_membership"
    
    # Export endpoints with descriptions
    EXPORT_DATA = [
        {"name": "hastalar", "url": "/Sec/Security/export_data/0", "desc": "Patients"},
        {"name": "hizmetler", "url": "/Sec/Security/export_data/1", "desc": "Services"},
        {"name": "protokoller", "url": "/Sec/Security/export_data/2", "desc": "Protocols"},
        {"name": "tahsilatlar", "url": "/Sec/Security/export_data/3", "desc": "Collections"},
        {"name": "randevular", "url": "/Sec/Security/export_data/4", "desc": "Appointments"},
        {"name": "medikal_bilgiler", "url": "/Sec/Security/export_data/5", "desc": "Medical Info"},
        {"name": "obstetri", "url": "/Sec/Security/export_data/6", "desc": "Obstetrics"},
        {"name": "gynecology", "url": "/Sec/Security/export_data/7", "desc": "Gynecology"},
        {"name": "persentil", "url": "/Sec/Security/export_pediatrics_data/1", "desc": "Percentile"},
        {"name": "muayene", "url": "/Sec/Security/export_pediatrics_data/2", "desc": "Examination"},
        {"name": "asilar", "url": "/Sec/Security/export_pediatrics_data/3", "desc": "Vaccinations"},
    ]
    
    def __init__(self, username: str, password: str, data_dir: str, headless: bool = True):
        """Initialize the sync client
        
        Args:
            username: Login username
            password: Login password
            data_dir: Directory to save CSV files
            headless: Run browser in headless mode
        """
        self.username = username
        self.password = password
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.headless = headless
        self.driver = None
        self.downloads_dir = self.data_dir / "temp_downloads"
        self.downloads_dir.mkdir(exist_ok=True)
        
    def setup_driver(self):
        """Setup undetected Chrome driver with appropriate options"""
        try:
            # Configure Chrome options
            options = uc.ChromeOptions()
            
            # Set download directory
            prefs = {
                "download.default_directory": str(self.downloads_dir.absolute()),
                "download.prompt_for_download": False,
                "download.directory_upgrade": True,
                "safebrowsing.enabled": True,
                "safebrowsing_for_trusted_sources_enabled": False
            }
            options.add_experimental_option("prefs", prefs)
            
            if self.headless:
                options.add_argument("--headless=new")
            
            # Additional options for stability
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument("--window-size=1920,1080")
            options.add_argument("--start-maximized")
            options.add_argument("--disable-blink-features=AutomationControlled")
            
            # Initialize undetected Chrome driver
            self.driver = uc.Chrome(options=options, version_main=None)
            logger.info("Undetected Chrome driver initialized successfully")
            
            # Set longer timeout
            self.driver.implicitly_wait(10)
            
        except Exception as e:
            logger.error(f"Failed to initialize Chrome driver: {str(e)}")
            raise
    
    def wait_for_recaptcha(self):
        """Wait for reCAPTCHA to be solved automatically or manually"""
        try:
            # Check if reCAPTCHA exists
            recaptcha_frame = self.driver.find_elements(By.CSS_SELECTOR, "iframe[src*='recaptcha']")
            if recaptcha_frame:
                logger.info("reCAPTCHA detected, waiting for solution...")
                # Give time for automatic solving or manual intervention
                time.sleep(5)
        except:
            pass
    
    def login(self) -> bool:
        """Authenticate with Bulut Klinik
        
        Returns:
            True if login successful, False otherwise
        """
        try:
            logger.info(f"Navigating to login page: {self.LOGIN_URL}")
            self.driver.get(self.LOGIN_URL)
            
            # Wait for page to fully load
            time.sleep(3)
            
            # Wait for login form to load
            wait = WebDriverWait(self.driver, 30)
            
            # Wait for and fill email field
            logger.info("Waiting for email field...")
            email_field = wait.until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            
            # Clear and fill email
            email_field.clear()
            time.sleep(0.5)
            for char in self.username:
                email_field.send_keys(char)
                time.sleep(0.1)  # Type slowly to appear more human-like
            logger.info("Email entered")
            
            # Find and fill password field
            password_field = self.driver.find_element(By.ID, "password")
            password_field.clear()
            time.sleep(0.5)
            for char in self.password:
                password_field.send_keys(char)
                time.sleep(0.1)  # Type slowly
            logger.info("Password entered")
            
            # Wait for any JavaScript to initialize
            time.sleep(2)
            
            # Handle reCAPTCHA if present
            self.wait_for_recaptcha()
            
            # Find and click login button
            login_button = self.driver.find_element(By.ID, "btn_login_portal")
            
            # Scroll to button to ensure it's visible
            self.driver.execute_script("arguments[0].scrollIntoView(true);", login_button)
            time.sleep(1)
            
            # Click using JavaScript for reliability
            self.driver.execute_script("arguments[0].click();", login_button)
            logger.info("Login button clicked")
            
            # Wait for login to process
            time.sleep(5)
            
            # Check for 2FA prompt
            try:
                sms_field = self.driver.find_element(By.ID, "sms_code")
                if sms_field:
                    logger.warning("2FA SMS verification required. Manual intervention needed.")
                    # Wait for manual SMS code entry (up to 2 minutes)
                    for i in range(24):  # 24 * 5 seconds = 2 minutes
                        time.sleep(5)
                        if self.driver.current_url != self.LOGIN_URL:
                            logger.info("2FA completed successfully")
                            break
            except NoSuchElementException:
                pass  # No 2FA required
            
            # Check if login was successful by trying to access data page
            time.sleep(3)
            self.driver.get(self.CLINIC_MEMBERSHIP_URL)
            time.sleep(3)
            
            # Verify we're logged in
            if "export_data" in self.driver.page_source or "Dışarı Aktarmak" in self.driver.page_source:
                logger.info("Successfully logged in to Bulut Klinik")
                return True
            else:
                # Check current URL for more info
                current_url = self.driver.current_url
                logger.error(f"Login verification failed. Current URL: {current_url}")
                return False
                
        except TimeoutException:
            logger.error("Login timeout - elements not found")
            return False
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return False
    
    def download_file(self, export_data: Dict) -> bool:
        """Download a specific CSV file
        
        Args:
            export_data: Dictionary with name, url, and desc
            
        Returns:
            True if download successful, False otherwise
        """
        try:
            url = f"{self.BASE_URL}{export_data['url']}"
            logger.info(f"Downloading {export_data['desc']} from {url}")
            
            # Clear downloads directory before download
            for file in self.downloads_dir.glob("*.csv"):
                file.unlink()
            
            # Navigate to the export URL
            self.driver.get(url)
            
            # Wait for download to complete
            download_wait = 30  # Maximum wait time in seconds
            download_complete = False
            
            for i in range(download_wait):
                time.sleep(1)
                csv_files = list(self.downloads_dir.glob("*.csv"))
                # Check for both .csv and .csv.crdownload files
                downloading_files = list(self.downloads_dir.glob("*.crdownload"))
                
                if csv_files and not downloading_files:
                    download_complete = True
                    break
            
            if download_complete and csv_files:
                # Get the downloaded file
                latest_file = csv_files[0]
                
                # Generate proper filename
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                new_filename = f"{export_data['name']}_{timestamp}.csv"
                new_filepath = self.data_dir / new_filename
                
                # Move and rename the file
                shutil.move(str(latest_file), str(new_filepath))
                
                # Also save as latest version
                latest_filepath = self.data_dir / f"{export_data['name']}_latest.csv"
                shutil.copy2(str(new_filepath), str(latest_filepath))
                
                logger.info(f"Successfully downloaded {export_data['name']} to {new_filepath}")
                return True
            else:
                logger.warning(f"No file downloaded for {export_data['name']}")
                return False
                
        except Exception as e:
            logger.error(f"Error downloading {export_data['name']}: {str(e)}")
            return False
    
    def sync_all_data(self) -> Dict[str, bool]:
        """Download all available CSV files
        
        Returns:
            Dictionary with download status for each endpoint
        """
        results = {}
        
        try:
            self.setup_driver()
            
            if not self.login():
                logger.error("Failed to authenticate. Cannot proceed with sync.")
                return results
            
            logger.info("Starting data synchronization...")
            
            for export_data in self.EXPORT_DATA:
                # Navigate back to membership page before each download
                self.driver.get(self.CLINIC_MEMBERSHIP_URL)
                time.sleep(2)
                
                success = self.download_file(export_data)
                results[export_data['name']] = success
                
                if success:
                    logger.info(f"✓ {export_data['name']} downloaded successfully")
                else:
                    logger.warning(f"✗ {export_data['name']} download failed")
                
                # Small delay between downloads
                time.sleep(3)
            
        finally:
            if self.driver:
                self.driver.quit()
                logger.info("Browser closed")
        
        # Clean up temp downloads directory
        try:
            for file in self.downloads_dir.glob("*"):
                file.unlink()
        except:
            pass
        
        # Log summary
        successful = sum(1 for v in results.values() if v)
        total = len(results)
        logger.info(f"Sync completed: {successful}/{total} files downloaded successfully")
        
        return results
    
    def cleanup_old_files(self, keep_count: int = 1):
        """Remove old CSV files, keeping only the most recent timestamped versions
        
        Args:
            keep_count: Number of timestamped versions to keep for each data type (default: 1)
        """
        try:
            import re
            
            # Pattern to match timestamped CSV files
            timestamp_pattern = re.compile(r'^(.+?)_(\d{8}_\d{6})\.csv$')
            
            # Dictionary to store files by data type
            files_by_type = {}
            
            # Scan all CSV files
            for csv_file in self.data_dir.glob("*.csv"):
                filename = csv_file.name
                
                # Skip _latest.csv files - always keep these
                if filename.endswith("_latest.csv"):
                    continue
                
                # Check if it's a timestamped file
                match = timestamp_pattern.match(filename)
                if match:
                    data_type = match.group(1)
                    timestamp = match.group(2)
                    
                    if data_type not in files_by_type:
                        files_by_type[data_type] = []
                    
                    files_by_type[data_type].append({
                        'path': csv_file,
                        'timestamp': timestamp,
                        'filename': filename
                    })
            
            # Process each data type
            total_deleted = 0
            
            for data_type, files in files_by_type.items():
                # Sort files by timestamp (newest first)
                files.sort(key=lambda x: x['timestamp'], reverse=True)
                
                # Delete older files (keep only the specified number)
                for i, file_info in enumerate(files):
                    if i >= keep_count:
                        try:
                            file_info['path'].unlink()
                            logger.info(f"Cleanup: Deleted old file {file_info['filename']}")
                            total_deleted += 1
                        except Exception as e:
                            logger.error(f"Failed to delete {file_info['filename']}: {str(e)}")
            
            if total_deleted > 0:
                logger.info(f"Cleanup completed: {total_deleted} old files removed")
            else:
                logger.info("Cleanup: No old files to remove")
                    
        except Exception as e:
            logger.error(f"Error during cleanup: {str(e)}")


def main():
    """Main entry point for the sync script"""
    parser = argparse.ArgumentParser(description="Sync data from Bulut Klinik EHR using undetected Chrome")
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
        "--no-headless",
        action="store_true",
        help="Run browser in visible mode (not headless)"
    )
    parser.add_argument(
        "--cleanup",
        action="store_true",
        help="Clean up old files after sync"
    )
    parser.add_argument(
        "--keep-count",
        type=int,
        default=1,
        help="Number of timestamped versions to keep for each data type (default: 1)"
    )
    
    args = parser.parse_args()
    
    # Validate credentials
    if not args.username or not args.password:
        logger.error("Username and password are required")
        sys.exit(1)
    
    # Create sync client
    client = BulutKlinikUndetectedSync(
        username=args.username,
        password=args.password,
        data_dir=args.data_dir,
        headless=not args.no_headless
    )
    
    # Perform sync
    results = client.sync_all_data()
    
    # Cleanup if requested
    if args.cleanup:
        client.cleanup_old_files(args.keep_count)
    
    # Exit with appropriate code
    if not results:
        sys.exit(1)
    elif all(results.values()):
        sys.exit(0)
    else:
        sys.exit(2)  # Partial success


if __name__ == "__main__":
    main()