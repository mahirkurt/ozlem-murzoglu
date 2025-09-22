#!/usr/bin/env python3
"""
BulutKlinik Login with visible browser for debugging
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
from pathlib import Path
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def login_and_download():
    # Chrome options - NOT headless for debugging
    chrome_options = Options()
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # Set download directory
    download_dir = str(Path.cwd() / "data" / "bulut_klinik")
    Path(download_dir).mkdir(parents=True, exist_ok=True)
    
    prefs = {
        "download.default_directory": download_dir,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "safebrowsing.enabled": True
    }
    chrome_options.add_experimental_option("prefs", prefs)
    
    # Initialize driver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    try:
        logger.info("Opening BulutKlinik login page...")
        driver.get("https://app.bulutklinik.com/Login.gg")
        
        # Wait for page to load
        time.sleep(3)
        
        # Find and fill email
        logger.info("Filling login form...")
        email_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email_field.clear()
        email_field.send_keys("ozlem.murzoglu@gmail.com")
        
        # Find and fill password
        password_field = driver.find_element(By.ID, "password")
        password_field.clear()
        password_field.send_keys("Omitf138!")
        
        # Wait a moment
        time.sleep(2)
        
        # Click login button
        logger.info("Clicking login button...")
        login_button = driver.find_element(By.ID, "btn_login_portal")
        driver.execute_script("arguments[0].scrollIntoView(true);", login_button)
        time.sleep(1)
        
        # Click using JavaScript
        driver.execute_script("arguments[0].click();", login_button)
        
        logger.info("Waiting for login to complete...")
        time.sleep(10)  # Wait for login
        
        # Check current URL
        logger.info(f"Current URL: {driver.current_url}")
        
        # Try to navigate to export pages
        exports = [
            ("hastalar", "https://app.bulutklinik.com/Sec/Security/export_data/0"),
            ("randevular", "https://app.bulutklinik.com/Sec/Security/export_data/4"),
            ("asilar", "https://app.bulutklinik.com/Sec/Security/export_pediatrics_data/3"),
        ]
        
        for name, url in exports:
            logger.info(f"Downloading {name}...")
            driver.get(url)
            time.sleep(5)  # Wait for download
        
        logger.info("Downloads complete. Check the data/bulut_klinik folder.")
        
        # Keep browser open for inspection
        input("Press Enter to close the browser...")
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        input("Error occurred. Press Enter to close...")
    finally:
        driver.quit()

if __name__ == "__main__":
    login_and_download()