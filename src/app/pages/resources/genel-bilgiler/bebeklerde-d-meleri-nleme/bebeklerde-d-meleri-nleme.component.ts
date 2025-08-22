import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ContentCleanerService } from '../../../../shared/services/content-cleaner.service';

@Component({
  selector: 'app-bebeklerde-d-meleri-nleme',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bebeklerde-d-meleri-nleme.component.html',
  styleUrl: './bebeklerde-d-meleri-nleme.component.css'
})
export class BebeklerdeDMeleriNlemeComponent implements OnInit, AfterViewInit {
  title = 'Bebeklerde Düşmeleri Önleme';
  category = 'Genel Bilgiler';
  description: string = "UZM.DR. ÖZLEM MURZOĞLU - ÇOCUK SAĞLIĞI VE HASTALIKLARI KLİNİĞİ BEBEKLİK DÖNEMİ DÜŞMELERİ ÖNLEME Hastaneye gitmek zorunda kalan çocuklarda en sık görülen yaralanma nedeni düşmelerd…";
  toc: { id: string; text: string; level: number }[] = [];
  private tocIds = new Set<string>();

  @ViewChild('contentRoot') contentRoot!: ElementRef<HTMLElement>;

  constructor(
    private titleService: Title, 
    private meta: Meta,
    private contentCleaner: ContentCleanerService
  ) {}

  ngOnInit(): void {
    const fullTitle = this.title + ' | Kaynaklar | Özlem Mürzoğlu';
    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: this.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: this.description });
  }

  ngAfterViewInit(): void {
    // Clean content first
    const root = this.contentRoot?.nativeElement;
    if (!root) return;
    
    // Apply content cleaning
    this.contentCleaner.cleanResourceContent(root);
    
    // Build TOC from h2/h3 headings
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
