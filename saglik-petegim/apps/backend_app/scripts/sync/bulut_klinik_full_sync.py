#!/usr/bin/env python3
"""
Full BulutKlinik Data Sync with Selenium
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
import shutil
from pathlib import Path
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BulutKlinikFullSync:
    def __init__(self, username: str, password: str, data_dir: str, headless: bool = True):
        self.username = username
        self.password = password
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.temp_dir = self.data_dir / "temp_downloads"
        self.temp_dir.mkdir(exist_ok=True)
        self.headless = headless
        self.driver = None
        
    def setup_driver(self):
        """Setup Chrome driver with download preferences"""
        chrome_options = Options()
        
        if self.headless:
            chrome_options.add_argument("--headless=new")
            chrome_options.add_argument("--window-size=1920,1080")
        
        # Add unique user-data-dir to avoid conflicts in GitHub Actions
        import tempfile
        temp_profile = tempfile.mkdtemp(prefix="chrome_profile_")
        chrome_options.add_argument(f"--user-data-dir={temp_profile}")
        
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        # Set download directory
        prefs = {
            "download.default_directory": str(self.temp_dir.absolute()),
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "safebrowsing.enabled": True,
            "safebrowsing.disable_download_protection": True
        }
        chrome_options.add_experimental_option("prefs", prefs)
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # Enable downloads in headless mode
        if self.headless:
            params = {
                "behavior": "allow",
                "downloadPath": str(self.temp_dir.absolute())
            }
            self.driver.execute_cdp_cmd("Page.setDownloadBehavior", params)
        
        logger.info("Chrome driver initialized")
    
    def login(self) -> bool:
        """Login to BulutKlinik"""
        try:
            logger.info("Navigating to login page...")
            self.driver.get("https://app.bulutklinik.com/Login.gg")
            time.sleep(3)
            
            # Fill email
            email_field = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            email_field.clear()
            email_field.send_keys(self.username)
            logger.info("Email entered")
            
            # Fill password
            password_field = self.driver.find_element(By.ID, "password")
            password_field.clear()
            password_field.send_keys(self.password)
            logger.info("Password entered")
            
            time.sleep(2)
            
            # Click login button
            login_button = self.driver.find_element(By.ID, "btn_login_portal")
            self.driver.execute_script("arguments[0].scrollIntoView(true);", login_button)
            time.sleep(1)
            self.driver.execute_script("arguments[0].click();", login_button)
            logger.info("Login button clicked")
            
            # Wait for login to complete
            time.sleep(8)
            
            # Check if logged in
            current_url = self.driver.current_url
            logger.info(f"Current URL after login: {current_url}")
            
            if "favorites" in current_url or "dashboard" in current_url or "clinic" in current_url:
                logger.info("Login successful!")
                return True
            else:
                logger.error("Login failed - unexpected URL")
                return False
                
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return False
    
    def wait_for_download(self, filename_pattern: str, timeout: int = 30) -> bool:
        """Wait for a file to be downloaded"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            # Check for completed files
            for file in self.temp_dir.glob(filename_pattern):
                if not str(file).endswith('.crdownload'):
                    logger.info(f"Download complete: {file.name}")
                    return True
            
            # Check if download is in progress
            for file in self.temp_dir.glob("*.crdownload"):
                logger.debug(f"Download in progress: {file.name}")
            
            time.sleep(1)
        
        logger.error(f"Download timeout for pattern: {filename_pattern}")
        return False
    
    def download_export(self, name: str, url: str) -> bool:
        """Download a specific export"""
        try:
            # Clear temp directory
            for file in self.temp_dir.glob("*"):
                file.unlink()
            
            logger.info(f"Downloading {name} from {url}")
            self.driver.get(url)
            
            # Wait for download
            if self.wait_for_download("*.csv"):
                # Move file to data directory with proper name
                for file in self.temp_dir.glob("*.csv"):
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    new_name = f"{name}_{timestamp}.csv"
                    new_path = self.data_dir / new_name
                    shutil.move(str(file), str(new_path))
                    
                    # Also save as latest
                    latest_path = self.data_dir / f"{name}_latest.csv"
                    shutil.copy(str(new_path), str(latest_path))
                    
                    logger.info(f"Saved {name} to {new_path}")
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error downloading {name}: {str(e)}")
            return False
    
    def sync_all_data(self):
        """Download all data exports"""
        try:
            self.setup_driver()
            
            if not self.login():
                logger.error("Login failed")
                return False
            
            # Export URLs - Only required data
            exports = [
                ("hastalar", "https://app.bulutklinik.com/Sec/Security/export_data/0"),
                ("hizmetler", "https://app.bulutklinik.com/Sec/Security/export_data/1"),
                ("protokoller", "https://app.bulutklinik.com/Sec/Security/export_data/2"),
                ("tahsilatlar", "https://app.bulutklinik.com/Sec/Security/export_data/3"),
                ("medikal_bilgiler", "https://app.bulutklinik.com/Sec/Security/export_data/5"),
            ]
            
            results = {}
            for name, url in exports:
                time.sleep(2)  # Be nice to server
                success = self.download_export(name, url)
                results[name] = success
                
                if success:
                    logger.info(f"✓ {name} downloaded successfully")
                else:
                    logger.warning(f"✗ {name} download failed")
            
            # Summary
            successful = sum(1 for v in results.values() if v)
            total = len(results)
            logger.info(f"\nSync completed: {successful}/{total} files downloaded")
            
            return results
            
        finally:
            if self.driver:
                self.driver.quit()
                logger.info("Browser closed")

if __name__ == "__main__":
    import sys
    
    username = os.environ.get("BULUT_KLINIK_USERNAME", "ozlem.murzoglu@gmail.com")
    password = os.environ.get("BULUT_KLINIK_PASSWORD", "Omitf138!")
    data_dir = os.environ.get("BULUT_KLINIK_DATA_DIR", "data/bulut_klinik")
    
    client = BulutKlinikFullSync(username, password, data_dir, headless=False)
    results = client.sync_all_data()
    
    if not results or not any(results.values()):
        sys.exit(1)
    else:
        sys.exit(0)