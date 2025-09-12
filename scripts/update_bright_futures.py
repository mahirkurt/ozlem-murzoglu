import os
import re

def update_pdf_function(content):
    """PDF fonksiyonlarındaki İngilizce ikon metinlerini Material Icons ile değiştir"""
    
    # PDF fonksiyonundaki ikon replacements
    icon_replacements = [
        ('folder', '<span class="material-icons">folder</span>'),
        ('chevron_right', '<span class="material-icons">chevron_right</span>'),
        ('category', '<span class="material-icons">category</span>'),
        ('description', '<span class="material-icons">description</span>'),
        ('list', '<span class="material-icons">list</span>'),
        ('picture_as_pdf', '<span class="material-icons">picture_as_pdf</span>'),
        ('print', '<span class="material-icons">print</span>'),
        ('share', '<span class="material-icons">share</span>'),
        ('download', '<span class="material-icons">download</span>')
    ]
    
    # PDF fonksiyonunu bul
    pdf_pattern = r'downloadPdf\(\)[^}]*?\{[^}]*?const\s+icons\s*=\s*\{([^}]+)\}'
    pdf_match = re.search(pdf_pattern, content, re.DOTALL)
    
    if pdf_match:
        icons_content = pdf_match.group(1)
        new_icons = """
      folder: '<span class="material-icons">folder</span>',
      chevron_right: '<span class="material-icons">chevron_right</span>',
      category: '<span class="material-icons">category</span>',
      description: '<span class="material-icons">description</span>',
      list: '<span class="material-icons">list</span>'
    """
        
        # Replace the icons object
        new_content = content[:pdf_match.start(1)] + new_icons + content[pdf_match.end(1):]
        return new_content
    
    return content

def update_clinic_name(content):
    """Mürzoğlu -> Murzoğlu"""
    content = content.replace('Mürzoğlu', 'Murzoğlu')
    content = content.replace('mürzoğlu', 'murzoğlu')
    content = content.replace('MÜRZOĞLU', 'MURZOĞLU')
    return content

def update_html_template(file_path):
    """HTML template'i güncelle"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Eğer zaten güncel ise atla
    if 'dynamic-gradient' in content:
        return False
    
    # Yeni template yapısı
    new_template = '''<div class="resource-page">
  <!-- Hero Section with Dynamic Gradient -->
  <div class="resource-hero dynamic-gradient">
    <div class="hero-pattern"></div>
    <div class="gradient-overlay"></div>
    <div class="container">
      <nav class="breadcrumb">
        <a routerLink="/bilgi-merkezi" class="breadcrumb-link">
          <span class="material-icons">folder</span>
          <span>Bilgi Merkezi</span>
        </a>
        <span class="material-icons separator">chevron_right</span>
        <a routerLink="/bilgi-merkezi/bright-futures-aile" class="breadcrumb-link" *ngIf="category === 'Bright Futures (Aile)'">
          <span>{{ category }}</span>
        </a>
        <span class="material-icons separator">chevron_right</span>
        <span class="current">{{ title }}</span>
      </nav>
      
      <div class="hero-content">
        <h1 class="page-title">{{ title }}</h1>
        <div class="meta-info">
          <div class="meta-item">
            <span class="material-icons">category</span>
            <span>{{ category }}</span>
          </div>
          <div class="meta-item">
            <span class="material-icons">description</span>
            <span>Bilgi Dökümanı</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Content Section -->
  <div class="resource-content">
    <div class="container">
      <div class="content-wrapper">
        <!-- Table of Contents (auto) -->
        <aside class="toc-sidebar" *ngIf="toc.length">
          <div class="toc-header">
            <span class="material-icons">list</span>
            <h3>İçindekiler</h3>
          </div>
          <nav class="toc-nav">
            <a *ngFor="let item of toc" 
               class="toc-link" 
               (click)="scrollToSection(item.id)" 
               [ngClass]="{'level-3': item.level === 3, 'active': activeSection === item.id}">
              <span class="dot"></span>
              <span class="label">{{ item.text }}</span>
            </a>
          </nav>
        </aside>
        
        <!-- Main Content -->
        <article class="content-card">
          <div class="content-body printable-content" #contentRoot>
'''
    
    # İçeriği bul ve koru
    content_match = re.search(r'<div[^>]*class="[^"]*content-body[^"]*"[^>]*#contentRoot[^>]*>(.*?)</div>\s*</article>', content, re.DOTALL)
    if not content_match:
        content_match = re.search(r'<div[^>]*#contentRoot[^>]*>(.*?)</div>\s*(?:</article>|</div>\s*</div>)', content, re.DOTALL)
    
    if content_match:
        inner_content = content_match.group(1).strip()
    else:
        # Fallback - tüm body içeriğini al
        body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL)
        if body_match:
            inner_content = body_match.group(1).strip()
        else:
            inner_content = "<!-- Content could not be extracted -->"
    
    # Action bar template
    action_bar_template = '''          </div>
        </article>
      </div>
    </div>
    
    <!-- Action Bar -->
    <div class="action-bar-wrapper">
      <div class="container">
        <div class="action-bar">
          <div class="action-group">
            <button (click)="downloadPdf()" class="action-btn btn-primary">
              <span class="material-icons">picture_as_pdf</span>
              <span>PDF İndir</span>
            </button>
            <button (click)="printDocument()" class="action-btn btn-secondary">
              <span class="material-icons">print</span>
              <span>Yazdır</span>
            </button>
            <button class="action-btn btn-secondary" onclick="navigator.share && navigator.share({title: this.title, url: window.location.href})">
              <span class="material-icons">share</span>
              <span>Paylaş</span>
            </button>
          </div>
          <a href="/documents/{{ documentPath }}" 
             download 
             class="action-btn btn-primary">
            <span class="material-icons">download</span>
            <span>Orijinal Dökümanı İndir</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>'''
    
    # Yeni içeriği oluştur
    new_content = new_template + inner_content + action_bar_template
    
    # Klinik adını düzelt
    new_content = update_clinic_name(new_content)
    
    # Dosyayı güncelle
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

def update_typescript_file(file_path):
    """TypeScript dosyasını güncelle"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # PDF fonksiyonunu güncelle
    content = update_pdf_function(content)
    
    # Klinik adını düzelt
    content = update_clinic_name(content)
    
    # categoryRoute ekle (eğer yoksa)
    if 'categoryRoute' not in content:
        # category tanımından sonra ekle
        category_pattern = r"(category\s*=\s*'[^']+';)"
        category_match = re.search(category_pattern, content)
        if category_match:
            insert_pos = category_match.end()
            # Bright Futures Aile mi Çocuk mu belirle
            if 'bright-futures-aile' in file_path:
                route_value = 'bright-futures-aile'
            elif 'bright-futures-cocuk' in file_path:
                route_value = 'bright-futures-cocuk'
            else:
                route_value = 'bright-futures'
            
            new_line = f"\n  categoryRoute = '{route_value}';"
            content = content[:insert_pos] + new_line + content[insert_pos:]
    
    # TOC ve scroll fonksiyonlarının varlığını kontrol et
    if 'activeSection' not in content:
        # Component class'ının sonunu bul
        class_end = content.rfind('}')
        if class_end > 0:
            toc_code = '''
  toc: any[] = [];
  activeSection: string = '';

  ngAfterViewInit() {
    this.generateTOC();
    this.setupScrollSpy();
  }

  generateTOC() {
    const headings = this.el.nativeElement.querySelectorAll('.content-body h2, .content-body h3');
    this.toc = Array.from(headings).map((heading: any, index) => ({
      id: `section-${index}`,
      text: heading.textContent.trim(),
      level: parseInt(heading.tagName.charAt(1))
    }));
    
    headings.forEach((heading: any, index) => {
      heading.id = `section-${index}`;
    });
  }

  setupScrollSpy() {
    const options = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, options);

    const headings = this.el.nativeElement.querySelectorAll('.content-body h2, .content-body h3');
    headings.forEach((heading: any) => observer.observe(heading));
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
'''
            content = content[:class_end] + toc_code + '\n' + content[class_end:]
    
    # Dosyayı güncelle
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def process_bright_futures_pages():
    """Tüm Bright Futures sayfalarını işle"""
    base_path = r"D:\GitHub Repos\ozlem-murzoglu\src\app\pages\resources"
    
    # Bright Futures Aile ve Çocuk dizinleri
    directories = [
        os.path.join(base_path, 'bright-futures-aile'),
        os.path.join(base_path, 'bright-futures-cocuk')
    ]
    
    updated_count = 0
    
    for directory in directories:
        if not os.path.exists(directory):
            continue
            
        for folder in os.listdir(directory):
            folder_path = os.path.join(directory, folder)
            if os.path.isdir(folder_path):
                # HTML dosyasını güncelle
                html_files = [f for f in os.listdir(folder_path) if f.endswith('.component.html')]
                for html_file in html_files:
                    html_path = os.path.join(folder_path, html_file)
                    if update_html_template(html_path):
                        print(f"[OK] Updated HTML: {folder}")
                        updated_count += 1
                
                # TypeScript dosyasını güncelle
                ts_files = [f for f in os.listdir(folder_path) if f.endswith('.component.ts')]
                for ts_file in ts_files:
                    ts_path = os.path.join(folder_path, ts_file)
                    if update_typescript_file(ts_path):
                        print(f"[OK] Updated TS: {folder}")
    
    print(f"\nToplam {updated_count} sayfa güncellendi.")

if __name__ == "__main__":
    process_bright_futures_pages()