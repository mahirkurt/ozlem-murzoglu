#!/usr/bin/env python3
"""
Bulut Klinik EHR Integration Script (Selenium Version)
Downloads CSV data files from Bulut Klinik system using browser automation
"""

import os
import sys
import time
import logging
from datetime import datetime
from pathlib import Path
import argparse
from typing import Dict, List, Optional

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
    from webdriver_manager.chrome import ChromeDriverManager
except ImportError as e:
    print(f"Required packages missing: {e}")
    print("Install with: pip install selenium webdriver-manager")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class BulutKlinikSeleniumSync:
    """Handles authentication and data synchronization with Bulut Klinik using Selenium"""
    
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
        """Setup Chrome driver with appropriate options"""
        chrome_options = Options()
        
        if self.headless:
            chrome_options.add_argument("--headless=new")
        
        # Set download directory
        prefs = {
            "download.default_directory": str(self.downloads_dir.absolute()),
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "safebrowsing.enabled": True
        }
        chrome_options.add_experimental_option("prefs", prefs)
        
        # Additional options for stability
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--start-maximized")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        # User agent
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        try:
            # Use webdriver-manager to automatically download and manage ChromeDriver
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            logger.info("Chrome driver initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Chrome driver: {str(e)}")
            raise
    
    def login(self) -> bool:
        """Authenticate with Bulut Klinik
        
        Returns:
            True if login successful, False otherwise
        """
        try:
            logger.info("Navigating to login page...")
            self.driver.get(self.LOGIN_URL)
            
            # Wait for login form to load
            wait = WebDriverWait(self.driver, 20)
            
            # Wait for the email field using the correct selector
            email_field = wait.until(
                EC.presence_of_element_located((By.ID, "email")),
                message="Waiting for email field"
            )
            email_field.clear()
            email_field.send_keys(self.username)
            logger.info("Email entered")
            
            # Find and fill password field
            password_field = self.driver.find_element(By.ID, "password")
            password_field.clear()
            password_field.send_keys(self.password)
            logger.info("Password entered")
            
            # Wait a moment for any JavaScript to initialize
            time.sleep(2)
            
            # Click the login button
            login_button = self.driver.find_element(By.ID, "btn_login_portal")
            
            # Scroll to the button to ensure it's clickable
            self.driver.execute_script("arguments[0].scrollIntoView(true);", login_button)
            time.sleep(1)
            
            # Try to click using JavaScript if regular click fails
            try:
                login_button.click()
            except:
                self.driver.execute_script("arguments[0].click();", login_button)
            logger.info("Login form submitted")
            
            # Wait for redirect or login success
            time.sleep(5)
            
            # Check if we're logged in by trying to access the membership page
            self.driver.get(self.CLINIC_MEMBERSHIP_URL)
            time.sleep(3)
            
            # Check if we can see the export modal
            if "export_data" in self.driver.page_source or "Dışarı Aktarmak" in self.driver.page_source:
                logger.info("Successfully logged in to Bulut Klinik")
                return True
            else:
                logger.error("Login verification failed")
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
            
            # Navigate to the export URL
            self.driver.get(url)
            
            # Wait for download to start
            time.sleep(5)
            
            # Check if file was downloaded
            downloaded_files = list(self.downloads_dir.glob("*.csv"))
            if downloaded_files:
                # Get the most recent file
                latest_file = max(downloaded_files, key=lambda f: f.stat().st_mtime)
                
                # Generate proper filename
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                new_filename = f"{export_data['name']}_{timestamp}.csv"
                new_filepath = self.data_dir / new_filename
                
                # Move and rename the file
                latest_file.rename(new_filepath)
                
                # Also save as latest version
                latest_filepath = self.data_dir / f"{export_data['name']}_latest.csv"
                import shutil
                shutil.copy2(new_filepath, latest_filepath)
                
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
                # Navigate to clinic membership page before each download
                self.driver.get(self.CLINIC_MEMBERSHIP_URL)
                time.sleep(2)
                
                success = self.download_file(export_data)
                results[export_data['name']] = success
                
                if success:
                    logger.info(f"✓ {export_data['name']} downloaded successfully")
                else:
                    logger.warning(f"✗ {export_data['name']} download failed")
                
                # Small delay between downloads
                time.sleep(2)
            
        finally:
            if self.driver:
                self.driver.quit()
                logger.info("Browser closed")
        
        # Clean up temp downloads directory
        for file in self.downloads_dir.glob("*"):
            file.unlink()
        
        # Log summary
        successful = sum(1 for v in results.values() if v)
        total = len(results)
        logger.info(f"Sync completed: {successful}/{total} files downloaded successfully")
        
        return results
    
    def cleanup_old_files(self, keep_count: int = 1):
        """Remove old CSV files to save space
        
        Args:
            days_to_keep: Number of days to keep files
        """
        try:
            import time
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
    parser = argparse.ArgumentParser(description="Sync data from Bulut Klinik EHR using Selenium")
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
    client = BulutKlinikSeleniumSync(
        username=args.username,
        password=args.password,
        data_dir=args.data_dir,
        headless=not args.no_headless
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