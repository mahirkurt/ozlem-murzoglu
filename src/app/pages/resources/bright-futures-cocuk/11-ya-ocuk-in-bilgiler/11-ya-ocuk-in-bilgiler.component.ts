import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-11-ya-ocuk-in-bilgiler',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './11-ya-ocuk-in-bilgiler.component.html',
  styleUrl: './11-ya-ocuk-in-bilgiler.component.css'
})
export class Doc11YaOcukInBilgilerComponent implements OnInit, AfterViewInit, OnDestroy {
  title = '11. YAŞ ZİYARETİ';
  category = 'Bright Futures (Çocuk)';
  description: string = "AMERİKAN PEDİATRİ AKADEMİSİ DOKTORUMDAN ÖNERÌLER 11. YAŞ ZİYARETİ HAYAT NASIL GİDİYOR? Ailenle vakit geçirmenin tadını çıkar. Ev işlerine yardım etmenin yollarını ara. Ailenin kur…";
  toc: { id: string; text: string; level: number }[] = [];
  activeSection: string = '';
  private tocIds = new Set<string>();
  private observer: IntersectionObserver | null = null;

  @ViewChild('contentRoot') contentRoot!: ElementRef<HTMLElement>;

  constructor(private titleService: Title, private meta: Meta) {}

  ngOnInit(): void {
    const fullTitle = this.title + ' | Kaynaklar | Özlem Mürzoğlu';
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
        <title>${this.title} - Dr. Özlem Mürzoğlu</title>
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
            color: #333;
            max-width: 100%;
            font-size: 12px;
          }
          .pdf-header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #005F73;
            margin-bottom: 20px;
            column-span: all;
          }
          .pdf-logo {
            font-size: 18px;
            font-weight: bold;
            color: #005F73;
            margin-bottom: 8px;
          }
          h1 {
            color: #1a1a1a;
            font-size: 22px;
            margin: 8px 0;
          }
          h2 {
            color: #005F73;
            font-size: 16px;
            margin-top: 18px;
            margin-bottom: 12px;
            page-break-after: avoid;
          }
          h3, h4 {
            color: #333;
            margin-top: 15px;
            margin-bottom: 8px;
            page-break-after: avoid;
          }
          p {
            margin: 8px 0;
            text-align: justify;
          }
          .content-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .flow-item, .content-card-item {
            margin: 8px 0;
            padding: 8px;
            border-left: 3px solid #0A9396;
            background: #f8f9fa;
            break-inside: avoid;
          }
          .sub-items {
            margin-left: 15px;
            margin-top: 8px;
          }
          .sub-item-card {
            margin: 4px 0;
            padding: 4px 8px;
            border-left: 2px solid #0A9396;
            background: #f5f5f5;
            break-inside: avoid;
          }
          .disclaimer-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="pdf-header">
          <div class="pdf-logo">Dr. Özlem Mürzoğlu Çocuk Sağlığı ve Hastalıkları Kliniği</div>
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
