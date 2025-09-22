#!/usr/bin/env python3
"""
BulutKlinik Ajax Login and Data Export
"""

import requests
import json
import time
import os
from datetime import datetime
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BulutKlinikAjaxSync:
    def __init__(self, username: str, password: str, data_dir: str):
        self.username = username
        self.password = password
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://app.bulutklinik.com',
            'Referer': 'https://app.bulutklinik.com/Login.gg',
        })
    
    def login(self) -> bool:
        """Login using AJAX request"""
        try:
            # First get the login page to get cookies and tokens
            logger.info("Getting login page...")
            login_page = self.session.get("https://app.bulutklinik.com/Login.gg")
            
            # Extract any tokens from the page
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(login_page.text, 'html.parser')
            
            # Get hidden fields
            hidden_fields = {}
            form = soup.find('form', {'id': 'login-form'})
            if form:
                for hidden in form.find_all('input', {'type': 'hidden'}):
                    name = hidden.get('name')
                    value = hidden.get('value', '')
                    if name:
                        hidden_fields[name] = value
            
            logger.info(f"Found hidden fields: {list(hidden_fields.keys())}")
            
            # Prepare login data
            login_data = {
                'email': self.username,
                'password': self.password,
                'remember_me': '0',
                'process': 'login',
                'firebase_token': '',
            }
            
            # Add hidden fields
            login_data.update(hidden_fields)
            
            logger.info("Sending login request...")
            
            # Try AJAX login endpoint
            response = self.session.post(
                "https://app.bulutklinik.com/Login_ajax.gg",
                data=login_data,
                headers={
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                }
            )
            
            logger.info(f"Login response status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    result = response.json()
                    logger.info(f"Login response: {result}")
                    
                    if result.get('status') == 'success' or result.get('success'):
                        logger.info("Login successful!")
                        return True
                    else:
                        logger.error(f"Login failed: {result.get('message', 'Unknown error')}")
                        return False
                except json.JSONDecodeError:
                    # Not JSON, might be redirect or HTML
                    if 'dashboard' in response.text.lower() or 'clinic' in response.text.lower():
                        logger.info("Login appears successful (non-JSON response)")
                        return True
                    else:
                        logger.error("Login failed - unexpected response")
                        return False
            else:
                logger.error(f"Login request failed with status {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return False
    
    def download_csv(self, name: str, url: str) -> bool:
        """Download CSV file"""
        try:
            full_url = f"https://app.bulutklinik.com{url}"
            logger.info(f"Downloading {name} from {full_url}")
            
            response = self.session.get(full_url, stream=True)
            
            if response.status_code == 200:
                # Check content type
                content_type = response.headers.get('Content-Type', '')
                logger.info(f"Content-Type: {content_type}")
                
                # Generate filename
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{name}_{timestamp}.csv"
                filepath = self.data_dir / filename
                
                # Save file
                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                
                # Check file size
                file_size = filepath.stat().st_size
                logger.info(f"Downloaded {name}: {file_size} bytes")
                
                if file_size > 0:
                    # Also save as latest
                    latest_filepath = self.data_dir / f"{name}_latest.csv"
                    with open(filepath, 'rb') as src, open(latest_filepath, 'wb') as dst:
                        dst.write(src.read())
                    return True
                else:
                    logger.warning(f"Downloaded file is empty: {name}")
                    return False
            else:
                logger.error(f"Download failed for {name}: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error downloading {name}: {str(e)}")
            return False
    
    def sync_all_data(self):
        """Download all data files"""
        if not self.login():
            logger.error("Login failed, cannot proceed")
            return False
        
        # Export endpoints
        exports = {
            "hastalar": "/Sec/Security/export_data/0",
            "hizmetler": "/Sec/Security/export_data/1",
            "protokoller": "/Sec/Security/export_data/2",
            "tahsilatlar": "/Sec/Security/export_data/3",
            "randevular": "/Sec/Security/export_data/4",
            "medikal_bilgiler": "/Sec/Security/export_data/5",
            "obstetri": "/Sec/Security/export_data/6",
            "gynecology": "/Sec/Security/export_data/7",
            "persentil": "/Sec/Security/export_pediatrics_data/1",
            "muayene": "/Sec/Security/export_pediatrics_data/2",
            "asilar": "/Sec/Security/export_pediatrics_data/3",
        }
        
        results = {}
        for name, url in exports.items():
            time.sleep(1)  # Be nice to the server
            results[name] = self.download_csv(name, url)
        
        # Summary
        successful = sum(1 for v in results.values() if v)
        total = len(results)
        logger.info(f"Sync completed: {successful}/{total} files downloaded")
        
        return results

if __name__ == "__main__":
    import sys
    
    username = os.environ.get("BULUT_KLINIK_USERNAME", "ozlem.murzoglu@gmail.com")
    password = os.environ.get("BULUT_KLINIK_PASSWORD", "Omitf138!")
    data_dir = "data/bulut_klinik"
    
    client = BulutKlinikAjaxSync(username, password, data_dir)
    results = client.sync_all_data()
    
    if not results or not any(results.values()):
        sys.exit(1)
    else:
        sys.exit(0)