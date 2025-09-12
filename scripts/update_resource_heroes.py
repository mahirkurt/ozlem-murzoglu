#!/usr/bin/env python3
import os
import re
from pathlib import Path

def update_html_file(html_path):
    """Update HTML file to use global hero-section component"""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already properly using global hero-section
    if '<app-hero-section' in content and 'resource-hero dynamic-gradient' not in content:
        return False
    
    # More precise pattern to match the old hero section structure
    # This pattern matches from resource-hero to the end of its container div
    pattern = r'<!-- Hero Section.*?-->\s*<div class="resource-hero dynamic-gradient">.*?</div>\s*</div>\s*</div>'
    
    # Check if pattern exists
    if not re.search(pattern, content, re.DOTALL):
        # Try alternative pattern without comment
        pattern = r'<div class="resource-hero dynamic-gradient">.*?</div>\s*</div>\s*</div>'
        if not re.search(pattern, content, re.DOTALL):
            return False
    
    replacement = '''<!-- Hero Section using global component -->
  <app-hero-section
    [title]="title"
    [subtitle]="category"
    colorTheme="blue">
  </app-hero-section>'''
    
    # Replace the old hero with new one
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL, count=1)
    
    # Remove duplicate content sections
    new_content = re.sub(r'(<!-- Content Section -->\s*<div class="resource-content">\s*<div class="container">\s*</div>\s*</div>\s*)+', '', new_content)
    
    if new_content != content:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def update_ts_file(ts_path):
    """Update TypeScript file to import HeroSectionComponent"""
    if not os.path.exists(ts_path):
        return False
        
    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already imports HeroSectionComponent
    if 'HeroSectionComponent' in content:
        return False
    
    modified = False
    
    # Add import statement
    if "import { Title, Meta } from '@angular/platform-browser';" in content:
        content = content.replace(
            "import { Title, Meta } from '@angular/platform-browser';",
            "import { Title, Meta } from '@angular/platform-browser';\nimport { HeroSectionComponent } from '../../../../components/shared/hero-section/hero-section.component';"
        )
        modified = True
    
    # Add to imports array
    imports_match = re.search(r'imports:\s*\[(.*?)\]', content, re.DOTALL)
    if imports_match:
        current_imports = imports_match.group(1)
        if 'HeroSectionComponent' not in current_imports:
            new_imports = current_imports.rstrip() + ", HeroSectionComponent"
            content = content.replace(
                f"imports: [{current_imports}]",
                f"imports: [{new_imports}]"
            )
            modified = True
    
    if modified:
        with open(ts_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def update_css_file(css_path):
    """Remove custom hero styles from CSS file"""
    if not os.path.exists(css_path):
        return False
        
    with open(css_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove dynamic gradient section
    pattern = r'/\* Dynamic Hero Gradient \*/.*?(?=(/\*|$))'
    new_content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    # Clean up extra newlines
    new_content = re.sub(r'\n{3,}', '\n\n', new_content)
    
    if new_content != content:
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    resources_path = Path("src/app/pages/resources")
    
    # Find all HTML files with the pattern
    html_files = list(resources_path.rglob("*.component.html"))
    
    updated_html = 0
    updated_ts = 0
    updated_css = 0
    
    for html_path in html_files:
        # Check if this file needs updating
        with open(html_path, 'r', encoding='utf-8') as f:
            if 'resource-hero dynamic-gradient' not in f.read():
                continue
        
        print(f"Processing {html_path.name}...")
        
        # Update HTML
        if update_html_file(html_path):
            updated_html += 1
            print(f"  [OK] Updated HTML")
        
        # Update corresponding TypeScript file
        ts_path = html_path.with_suffix('.ts')
        if update_ts_file(ts_path):
            updated_ts += 1
            print(f"  [OK] Updated TypeScript")
        
        # Update corresponding CSS file
        css_path = html_path.with_suffix('.css')
        if update_css_file(css_path):
            updated_css += 1
            print(f"  [OK] Updated CSS")
    
    print(f"\nSummary:")
    print(f"  HTML files updated: {updated_html}")
    print(f"  TypeScript files updated: {updated_ts}")
    print(f"  CSS files updated: {updated_css}")

if __name__ == "__main__":
    main()