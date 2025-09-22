import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-10-ya-ocuk-in-bilgiler',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './10-ya-ocuk-in-bilgiler.component.html',
  styleUrl: './10-ya-ocuk-in-bilgiler.component.css'
})
export class Doc10YaOcukInBilgilerComponent implements OnInit, AfterViewInit, OnDestroy {
  title = '10. YAŞ ZİYARETİ';
  category = 'Bright Futures (Çocuk)';
  description: string = "AMERİKAN PEDİATRİ AKADEMİSİ DOKTORUMDAN ÖNERÌLER 10. YAŞ ZİYARETİ KENDİNLE İLGİLEN! Ailenle vakit geçirmenin tadını çıkar. Evdeki işlere ve çevrende ihtiyaç duyanlara yardım et. B…";
  toc: { id: string; text: string; level: number }[] = [];
  activeSection: string = '';
  private tocIds = new Set<string>();
  private observer: IntersectionObserver | null = null;

  @ViewChild('contentRoot') contentRoot!: ElementRef<HTMLElement>;

  constructor(private titleService: Title, private meta: Meta) {}

  ngOnInit(): void {
    const fullTitle = this.title + ' | Kaynaklar | Özlem Murzoğlu';
    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: this.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: this.description });
  }

  ngAfterViewInit(): void {
    // Build TOC from h2/h3 headings
    const root = this.contentRoot?.nativeElement;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[];
    this.toc = headings.map(h => {
      let text = (h.textContent || '').trim();
      const level = h.tagName.toLowerCase() === 'h2' ? 2 : 3;
      let id = this.slugify(text);
      // ensure unique
      let base = id;
      let i = 2;
      while (this.tocIds.has(id) || document.getElementById(id)) {
        id = base + '-' + (i++);
      }
      this.tocIds.add(id);
      h.setAttribute('id', id);
      return { id, text, level };
    });

    // Set up IntersectionObserver for active section detection
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, options);

    // Observe all sections with IDs
    this.toc.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        this.observer?.observe(element);
      }
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${this.title} - Dr. Özlem Murzoğlu</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
            columns: 2;
            column-gap: 20mm;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.5;
            color: var(--md-sys-color-on-surface);
            max-width: 100%;
            font-size: 12px;
          }
          .pdf-header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--md-sys-color-primary);
            margin-bottom: 20px;
            column-span: all;
          }
          .pdf-logo {
            font-size: 18px;
            font-weight: bold;
            color: var(--md-sys-color-primary);
            margin-bottom: 8px;
          }
          h1 {
            color: var(--md-sys-color-on-surface);
            font-size: 22px;
            margin: var(--md-sys-spacing-2) 0;
          }
          h2 {
            color: var(--md-sys-color-primary);
            font-size: 16px;
            margin-top: 18px;
            margin-bottom: 12px;
            page-break-after: avoid;
          }
          h3, h4 {
            color: var(--md-sys-color-on-surface);
            margin-top: 15px;
            margin-bottom: 8px;
            page-break-after: avoid;
          }
          p {
            margin: var(--md-sys-spacing-2) 0;
            text-align: justify;
          }
          .content-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .flow-item, .content-card-item {
            margin: var(--md-sys-spacing-2) 0;
            padding: var(--md-sys-spacing-2);
            border-left: 3px solid var(--md-sys-color-primary);
            background: var(--md-sys-color-surface-container-low);
            break-inside: avoid;
          }
          .sub-items {
            margin-left: 15px;
            margin-top: 8px;
          }
          .sub-item-card {
            margin: var(--md-sys-spacing-1) 0;
            padding: var(--md-sys-spacing-1) var(--md-sys-spacing-2);
            border-left: 2px solid var(--md-sys-color-primary);
            background: var(--md-sys-color-surface-container);
            break-inside: avoid;
          }
          .disclaimer-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 12px;
            color: var(--md-sys-color-on-surface-variant);
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="pdf-header">
          <div class="pdf-logo">Dr. Özlem Murzoğlu Çocuk Sağlığı ve Hastalıkları Kliniği</div>
          <h1>${this.title}</h1>
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
