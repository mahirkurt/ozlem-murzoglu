import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { FavoriteButtonComponent } from '../../../components/favorite-button/favorite-button.component';

export interface ResourceContent {
  title: string;
  category: string;
  description: string;
  content: string; // HTML or Markdown content
  contentType?: 'html' | 'markdown'; // Content type indicator
  metadata?: {
    author?: string;
    date?: string;
    source?: string;
  };
}

@Component({
  selector: 'app-base-resource',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, FavoriteButtonComponent],
  template: `
    <div class="resource-page">
      <!-- Hero Section with Gradient -->
      <div class="resource-hero dynamic-gradient">
        <div class="hero-pattern"></div>
        <div class="gradient-overlay"></div>
        <div class="container">
          <nav class="breadcrumb">
            <a routerLink="/bilgi-merkezi" class="breadcrumb-link">
              <span class="material-icons">folder</span>
              <span>{{ 'RESOURCES.INFO_CENTER' | translate }}</span>
            </a>
            <span class="material-icons separator">chevron_right</span>
            <a [routerLink]="categoryRoute" class="breadcrumb-link">
              <span>{{ getCategoryTranslation() | translate }}</span>
            </a>
            <span class="material-icons separator">chevron_right</span>
            <span class="current">{{ getTitle() }}</span>
          </nav>
          
          <div class="hero-content">
            <h1 class="page-title">{{ getTitle() }}</h1>
            <div class="meta-info">
              <div class="meta-item">
                <span class="material-icons">category</span>
                <span>{{ getCategoryTranslation() | translate }}</span>
              </div>
              <div class="meta-item">
                <span class="material-icons">description</span>
                <span>{{ 'RESOURCES.INFO_DOCUMENT' | translate }}</span>
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
                <h3>{{ 'RESOURCES.TOC' | translate }}</h3>
              </div>
              <nav class="toc-nav">
                <a *ngFor="let item of toc" 
                   class="toc-link" 
                   [attr.href]="'#' + item.id" 
                   [ngClass]="{'level-3': item.level === 3}">
                  <span class="dot"></span>
                  <span class="label">{{ item.text }}</span>
                </a>
              </nav>
            </aside>
            
            <!-- Main Content -->
            <main class="main-content">
              <div class="content-card">
                <div class="card-actions">
                  <app-favorite-button
                    [resourceKey]="resourceKey"
                    [categoryKey]="categoryKey"
                    [title]="getTitle()"
                    [description]="resourceContent?.description || ''"
                    [route]="currentRoute"
                    [showText]="true">
                  </app-favorite-button>
                  <button class="action-btn" (click)="printDocument()">
                    <span class="material-icons">print</span>
                    <span>{{ 'RESOURCES.PRINT' | translate }}</span>
                  </button>
                  <button class="action-btn" (click)="downloadPdf()">
                    <span class="material-icons">download</span>
                    <span>{{ 'RESOURCES.DOWNLOAD_PDF' | translate }}</span>
                  </button>
                </div>
                
                <div class="printable-content" #contentRoot [innerHTML]="sanitizedContent"></div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: [
    '../clean-resource-styles.css',
    '../resource-utilities.css'
  ]
})
export class BaseResourceComponent implements OnInit, AfterViewInit {
  @Input() resourceKey!: string; // Key to load content from JSON
  @Input() categoryKey!: string; // Category key for translations
  @ViewChild('contentRoot') contentRoot!: ElementRef<HTMLElement>;

  resourceContent?: ResourceContent;
  sanitizedContent: SafeHtml = '';
  toc: { id: string; text: string; level: number }[] = [];
  private tocIds = new Set<string>();
  
  get currentRoute(): string {
    return this.router.url;
  }

  constructor(
    private titleService: Title,
    private meta: Meta,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  get categoryRoute(): string {
    const categoryRoutes: { [key: string]: string } = {
      'vaccines': '/bilgi-merkezi/asilar',
      'general': '/bilgi-merkezi/genel-bilgiler',
      'diseases': '/bilgi-merkezi/hastaliklar',
      'pregnancy': '/bilgi-merkezi/gebelik-donemi',
      'development': '/bilgi-merkezi/gelisim-rehberleri',
      'toys': '/bilgi-merkezi/oyuncaklar',
      'media': '/bilgi-merkezi/aile-medya-plani',
      'bright-futures-family': '/bilgi-merkezi/bright-futures-aile',
      'bright-futures-child': '/bilgi-merkezi/bright-futures-cocuk'
    };
    return categoryRoutes[this.categoryKey] || '/bilgi-merkezi';
  }

  ngOnInit(): void {
    this.loadContent();
  }

  ngAfterViewInit(): void {
    // Build TOC after content is loaded
    setTimeout(() => this.buildToc(), 100);
  }

  private loadContent(): void {
    const lang = this.translate.currentLang || 'tr';
    const contentKey = `RESOURCES.${this.categoryKey.toUpperCase()}.${this.resourceKey.toUpperCase()}`;
    
    // Load content from translation files
    this.translate.get(contentKey).subscribe(content => {
      if (typeof content === 'object' && content.title) {
        this.resourceContent = content as ResourceContent;
        
        // Check if content is markdown
        if (content.contentType === 'markdown') {
          // Parse markdown to HTML
          const htmlContent = marked.parse(content.content) as string;
          this.sanitizedContent = this.sanitizer.sanitize(1, htmlContent) || '';
        } else {
          // Use content as HTML directly
          this.sanitizedContent = this.sanitizer.sanitize(1, content.content) || '';
        }
        
        this.updateMeta();
      }
    });
  }

  private updateMeta(): void {
    if (!this.resourceContent) return;
    
    const fullTitle = `${this.resourceContent.title} | ${this.translate.instant('RESOURCES.INFO_CENTER')} | Özlem Murzoğlu`;
    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: this.resourceContent.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: this.resourceContent.description });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:image', content: 'https://ozlemmurzoglu.com/og-image.png' });
    
    // Add structured data for SEO
    this.addStructuredData();
  }
  
  private addStructuredData(): void {
    if (!this.resourceContent) return;
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      'headline': this.resourceContent.title,
      'description': this.resourceContent.description,
      'author': {
        '@type': 'Person',
        'name': 'Dr. Özlem Murzoğlu',
        'jobTitle': 'Pediatrician',
        'url': 'https://ozlemmurzoglu.com'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Dr. Özlem Murzoğlu Kliniği',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://ozlemmurzoglu.com/logos/OM-Wide-Color.svg'
        }
      },
      'datePublished': new Date().toISOString(),
      'dateModified': new Date().toISOString(),
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': window.location.href
      }
    };
    
    // Remove any existing structured data script
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Add new structured data script
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  getTitle(): string {
    if (!this.resourceContent) return '';
    return this.resourceContent.title;
  }

  getCategoryTranslation(): string {
    const categoryTranslations: { [key: string]: string } = {
      'vaccines': 'RESOURCES.CATEGORY_VACCINES',
      'general': 'RESOURCES.CATEGORY_GENERAL',
      'diseases': 'RESOURCES.CATEGORY_DISEASES',
      'pregnancy': 'RESOURCES.CATEGORY_PREGNANCY',
      'development': 'RESOURCES.CATEGORY_DEVELOPMENT',
      'toys': 'RESOURCES.CATEGORY_TOYS',
      'media': 'RESOURCES.CATEGORY_MEDIA',
      'bright-futures-family': 'RESOURCES.CATEGORY_BRIGHT_FUTURES_FAMILY',
      'bright-futures-child': 'RESOURCES.CATEGORY_BRIGHT_FUTURES_CHILD'
    };
    return categoryTranslations[this.categoryKey] || 'RESOURCES.CATEGORY_OTHER';
  }

  private buildToc(): void {
    const root = this.contentRoot?.nativeElement;
    if (!root) return;
    
    const headings = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[];
    this.toc = headings.map(h => {
      let text = (h.textContent || '').trim();
      const level = h.tagName.toLowerCase() === 'h2' ? 2 : 3;
      let id = this.slugify(text);
      
      // Ensure unique ID
      let base = id;
      let i = 2;
      while (this.tocIds.has(id) || document.getElementById(id)) {
        id = base + '-' + (i++);
      }
      this.tocIds.add(id);
      h.setAttribute('id', id);
      return { id, text, level };
    });
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9s-]/g, '')
      .trim()
      .replace(/s+/g, '-')
      .replace(/-+/g, '-');
  }

  downloadPdf(): void {
    const printContent = document.querySelector('.printable-content');
    if (!printContent || !this.resourceContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${this.resourceContent.title} - Özlem Murzoğlu</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
          }
          .pdf-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #7b61ff;
            margin-bottom: 30px;
          }
          .pdf-logo {
            font-size: 24px;
            font-weight: bold;
            color: #7b61ff;
            margin-bottom: 10px;
          }
          h1 {
            color: #1a1a1a;
            font-size: 28px;
            margin: 10px 0;
          }
          h2 {
            color: #7b61ff;
            font-size: 20px;
            margin-top: 25px;
            margin-bottom: 15px;
          }
          h3, h4 {
            color: #333;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          p {
            margin: 10px 0;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="pdf-header">
          <div class="pdf-logo">Özlem Murzoğlu</div>
          <h1>${this.resourceContent.title}</h1>
        </div>
        ${printContent.innerHTML}
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
    };
  }

  printDocument(): void {
    window.print();
  }
}