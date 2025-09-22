#!/usr/bin/env python3
"""
Test BulutKlinik login and export functionality
"""

import requests
import json
from bs4 import BeautifulSoup
import time

# Session with headers
session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Cache-Control': 'max-age=0',
})

def test_login():
    print("Testing BulutKlinik login...")
    
    # Step 1: Get login page
    login_url = "https://app.bulutklinik.com/Login.gg"
    response = session.get(login_url)
    print(f"Login page status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"Failed to get login page: {response.text[:500]}")
        return False
    
    # Parse the page to find form tokens
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Look for CSRF token or other hidden fields
    csrf_token = None
    hidden_fields = {}
    
    form = soup.find('form', {'id': 'form_login'})
    if form:
        print("Found login form")
        for hidden in form.find_all('input', {'type': 'hidden'}):
            name = hidden.get('name')
            value = hidden.get('value', '')
            if name:
                hidden_fields[name] = value
                print(f"Hidden field: {name} = {value[:20]}...")
    else:
        print("Login form not found, looking for alternative...")
    
    # Check for meta CSRF token
    csrf_meta = soup.find('meta', {'name': 'csrf-token'})
    if csrf_meta:
        csrf_token = csrf_meta.get('content')
        print(f"CSRF token found: {csrf_token[:20]}...")
    
    # Step 2: Prepare login data
    login_data = {
        'email': 'ozlem.murzoglu@gmail.com',
        'password': 'Omitf138!',
        'remember_me': '0',
    }
    
    # Add hidden fields
    login_data.update(hidden_fields)
    
    # Add CSRF token if found
    if csrf_token:
        session.headers['X-CSRF-Token'] = csrf_token
        login_data['_token'] = csrf_token
    
    print(f"Login data prepared: {list(login_data.keys())}")
    
    # Step 3: Submit login
    print("Submitting login...")
    
    # Try different login endpoints
    login_endpoints = [
        "https://app.bulutklinik.com/Login.gg",
        "https://app.bulutklinik.com/login",
        "https://app.bulutklinik.com/auth/login",
        "https://app.bulutklinik.com/Sec/Security/Login"
    ]
    
    for endpoint in login_endpoints:
        print(f"\nTrying endpoint: {endpoint}")
        
        response = session.post(
            endpoint,
            data=login_data,
            allow_redirects=True,
            headers={
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': login_url,
                'Origin': 'https://app.bulutklinik.com'
            }
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response URL: {response.url}")
        
        # Check if login was successful
        if response.status_code == 200:
            if 'dashboard' in response.url.lower() or 'clinic_membership' in response.url.lower():
                print("Login successful!")
                return True
            elif 'login' not in response.url.lower():
                # Might be logged in, verify
                verify_url = "https://app.bulutklinik.com/Sec/Security/clinic_membership"
                verify_response = session.get(verify_url)
                if verify_response.status_code == 200:
                    print("Login verified!")
                    return True
    
    print("All login attempts failed")
    return False

def test_export():
    print("\nTesting data export...")
    
    # Test export endpoints
    export_endpoints = {
        "patients": "https://app.bulutklinik.com/Sec/Security/export_data/0",
        "services": "https://app.bulutklinik.com/Sec/Security/export_data/1",
    }
    
    for name, url in export_endpoints.items():
        print(f"\nTesting {name} export from {url}")
        response = session.get(url, stream=True)
        
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('Content-Type', 'Unknown')}")
        print(f"Content-Length: {response.headers.get('Content-Length', 'Unknown')}")
        
        if response.status_code == 200:
            # Check if it's CSV
            content_type = response.headers.get('Content-Type', '')
            if 'csv' in content_type or 'text' in content_type or 'octet-stream' in content_type:
                # Read first 1000 bytes
                content = response.raw.read(1000)
                print(f"First 200 chars: {content[:200]}")
                
                # Save to file
                filename = f"test_{name}.csv"
                with open(filename, 'wb') as f:
                    f.write(content)
                    # Write rest of content
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                print(f"Saved to {filename}")
            else:
                print(f"Unexpected content type: {content_type}")
                print(f"Response preview: {response.text[:500]}")

if __name__ == "__main__":
    if test_login():
        test_export()
    else:
        print("\nLogin failed, cannot test export")