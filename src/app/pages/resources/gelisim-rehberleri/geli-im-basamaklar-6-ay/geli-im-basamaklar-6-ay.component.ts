import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-geli-im-basamaklar-6-ay',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './geli-im-basamaklar-6-ay.component.html',
  styleUrl: './geli-im-basamaklar-6-ay.component.css'
})
export class GeliImBasamaklar6AyComponent implements OnInit, AfterViewInit {
  title = 'Gelişim Basamakları - 6. Ay';
  category = 'Gelişim Rehberleri';
  description: string = "UZM.DR. ÖZLEM MURZOĞLU - ÇOCUK SAĞLIĞI VE HASTALIKLARI KLİNİĞİ ÇOCUK GELİŞİM BASAMAKLARI: BEBEĞİNİZİN 6. AYI BEBEĞİNİZİN ADI DOĞUM TARİHİ BUGÜNÜN TARİHİ Çocuğunuzun nasıl oynadığı…";
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
