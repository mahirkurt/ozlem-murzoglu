import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-5-ya-geli-imsel-neriler',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './5-ya-geli-imsel-neriler.component.html',
  styleUrl: './5-ya-geli-imsel-neriler.component.css'
})
export class Doc5YaGeliImselNerilerComponent implements OnInit, AfterViewInit {
  title = '5 Yaş Gelişimsel Öneriler';
  category = 'Gelişim Rehberleri';
  description: string = "UZM.DR. ÖZLEM MURZOĞLU - ÇOCUK SAĞLIĞI VE HASTALIKLARI KLİNİĞİ GELİŞİM ÖNERİLERİ İPUÇLARI VE ETKİNLİKLER: 5 Yaşındaki Çocuğunuz İçin Neler Yapabilirsiniz? Çocuğunuzun ilk öğretmen…";
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
}
