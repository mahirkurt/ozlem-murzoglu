import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-2-ya-aile-in-bilgiler-v2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './2-ya-aile-in-bilgiler-v2.component.html',
  styleUrl: './2-ya-aile-in-bilgiler-v2.component.css'
})
export class Doc2YaAileInBilgilerV2Component implements OnInit, AfterViewInit {
  title = '2½ YAŞ ZİYARETİ';
  category = 'Bright Futures (Aile)';
  description: string = "2½ Yaş ziyareti için aile bilgileri";
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
    const root = this.contentRoot?.nativeElement;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[];
    this.toc = headings.map(h => {
      let text = (h.textContent || '').trim();
      const level = h.tagName.toLowerCase() === 'h2' ? 2 : 3;
      let id = this.slugify(text);
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
      .normalize('NFD').replace(/[̀-ͯ ]/g, '')
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
          .content-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
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