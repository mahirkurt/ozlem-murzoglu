#!/usr/bin/env python3
"""
Check BulutKlinik login page structure
"""

import requests
from bs4 import BeautifulSoup

# Get the login page
response = requests.get("https://app.bulutklinik.com/Login.gg")
print(f"Status: {response.status_code}")
print(f"URL: {response.url}")

# Parse HTML
soup = BeautifulSoup(response.text, 'html.parser')

# Find all forms
forms = soup.find_all('form')
print(f"\nFound {len(forms)} forms")

for i, form in enumerate(forms):
    print(f"\nForm {i+1}:")
    print(f"  ID: {form.get('id', 'N/A')}")
    print(f"  Action: {form.get('action', 'N/A')}")
    print(f"  Method: {form.get('method', 'N/A')}")
    
    # Find input fields
    inputs = form.find_all('input')
    print(f"  Inputs ({len(inputs)}):")
    for inp in inputs:
        input_type = inp.get('type', 'text')
        input_name = inp.get('name', 'N/A')
        input_id = inp.get('id', 'N/A')
        print(f"    - Type: {input_type}, Name: {input_name}, ID: {input_id}")
    
    # Find buttons
    buttons = form.find_all(['button', 'input[type="submit"]'])
    print(f"  Buttons ({len(buttons)}):")
    for btn in buttons:
        btn_type = btn.get('type', 'N/A')
        btn_id = btn.get('id', 'N/A')
        btn_text = btn.text.strip() if btn.text else btn.get('value', 'N/A')
        print(f"    - Type: {btn_type}, ID: {btn_id}, Text: {btn_text}")

# Look for JavaScript login functions
scripts = soup.find_all('script')
print(f"\n\nFound {len(scripts)} script tags")

for i, script in enumerate(scripts):
    if script.string and ('login' in script.string.lower() or 'ajax' in script.string.lower()):
        print(f"\nScript {i+1} contains login/ajax code:")
        # Print first 500 chars of relevant scripts
        lines = script.string.split('\n')
        for line in lines[:20]:
            if 'login' in line.lower() or 'ajax' in line.lower() or 'post' in line.lower():
                print(f"  {line.strip()[:100]}")

# Save full HTML for inspection
with open('bulut_klinik_login_page.html', 'w', encoding='utf-8') as f:
    f.write(response.text)
print("\nFull HTML saved to bulut_klinik_login_page.html")