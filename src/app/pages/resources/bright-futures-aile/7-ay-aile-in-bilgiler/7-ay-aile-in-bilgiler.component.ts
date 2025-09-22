import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-7-ay-aile-in-bilgiler',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './7-ay-aile-in-bilgiler.component.html',
  styleUrl: './7-ay-aile-in-bilgiler.component.css'
})
export class Doc7AyAileInBilgilerComponent implements OnInit, AfterViewInit {
  title = '7. AY ZİYARETİ';
  category = 'Bright Futures (Aile)';
  description: string = "AMERİKAN PEDİATRİ AKADEMİSİ BRIGHT FUTURES PROGRAMI 7. AY ZİYARETİ BİLGİ FÖYÜ EVİNİZİN DURUMU Sigara içmeyin veya elektronik sigara kullanmayın. Evinizi ve arabanızı dumansız tutu…";
  toc: { id: string; text: string; level: number }[] = [];
  private tocIds = new Set<string>();

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
        <title>${this.title} - Özlem Murzoğlu</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: var(--md-sys-color-on-surface);
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
            color: var(--md-sys-color-on-surface);
            font-size: 28px;
            margin: var(--md-sys-spacing-2) 0;
          }
          h2 {
            color: #7b61ff;
            font-size: 20px;
            margin-top: 25px;
            margin-bottom: 15px;
          }
          h3, h4 {
            color: var(--md-sys-color-on-surface);
            margin-top: 20px;
            margin-bottom: 10px;
          }
          p {
            margin: var(--md-sys-spacing-2) 0;
          }
          .content-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .flow-item, .content-card-item {
            margin: var(--md-sys-spacing-2) 0;
            padding: var(--md-sys-spacing-2);
            border-left: 3px solid #7b61ff;
            background: var(--md-sys-color-surface-container-low);
          }
          .sub-items {
            margin-left: 20px;
            margin-top: 10px;
          }
          .sub-item-card {
            margin: var(--md-sys-spacing-1) 0;
            padding: var(--md-sys-spacing-1) var(--md-sys-spacing-2);
            border-left: 2px solid var(--md-sys-color-success);
            background: var(--md-sys-color-surface-container);
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
          <div class="pdf-logo">Özlem Murzoğlu</div>
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