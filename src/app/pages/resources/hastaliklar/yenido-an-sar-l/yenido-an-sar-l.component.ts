import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PageHeaderComponent, Breadcrumb } from '../../../../components/page-header/page-header.component';
import { ContactCtaComponent } from '../../../../components/contact-cta/contact-cta.component';

interface ResourceDocPayload {
  title: string;
  description: string;
  category: string;
  categoryTitle: string;
  contentHtml: string;
  downloadUrl: string;
}

@Component({
  selector: 'app-yenido-an-sar-l',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, PageHeaderComponent, ContactCtaComponent],
  templateUrl: './yenido-an-sar-l.component.html',
  styleUrls: ['../../resource-enhanced-styles.scss']
})
export class YenidoAnSarLComponent implements OnInit, AfterViewInit {
  docAssetPath = '/assets/resources/docs/hastaliklar/yenido-an-sar-l.json';
  resource: ResourceDocPayload | null = null;
  contentHtml: SafeHtml | null = null;
  breadcrumbs: Breadcrumb[] = [];
  toc: { id: string; text: string; level: number }[] = [];
  private tocIds = new Set<string>();

  @ViewChild('contentRoot') contentRoot!: ElementRef<HTMLElement>;

  constructor(
    private http: HttpClient,
    private titleService: Title,
    private meta: Meta,
    private translate: TranslateService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.http.get<ResourceDocPayload>(this.docAssetPath).subscribe({
      next: (doc) => {
        this.resource = doc;
        this.contentHtml = this.sanitizer.bypassSecurityTrustHtml(doc.contentHtml);
        this.breadcrumbs = this.buildBreadcrumbs(doc);
        const resourcesLabel = this.translate.instant('RESOURCES.SECTION_TITLE');
        const siteLabel = this.translate.instant('COMMON.DOCTOR_NAME');
        const fullTitle = doc.title + ' | ' + resourcesLabel + ' | ' + siteLabel;
        this.titleService.setTitle(fullTitle);
        this.meta.updateTag({ name: 'description', content: doc.description });
        this.meta.updateTag({ property: 'og:title', content: fullTitle });
        this.meta.updateTag({ property: 'og:description', content: doc.description });
        setTimeout(() => this.buildToc(), 0);
      },
      error: (err) => console.error('Failed to load resource document', err)
    });
  }

  ngAfterViewInit(): void {
    if (this.resource) {
      this.buildToc();
    }
  }

  private buildBreadcrumbs(doc: ResourceDocPayload): Breadcrumb[] {
    return [
      { translateKey: 'RESOURCES.HOME_BREADCRUMB', url: '/' },
      { translateKey: 'RESOURCES.RESOURCES_BREADCRUMB', url: '/kaynaklar' },
      { label: doc.categoryTitle, url: '/kaynaklar/' + doc.category },
      { label: doc.title }
    ];
  }

  private buildToc(): void {
    const root = this.contentRoot?.nativeElement;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[];
    this.tocIds.clear();
    this.toc = headings.map(h => {
      const text = (h.textContent || '').trim();
      const level = h.tagName.toLowerCase() === 'h2' ? 2 : 3;
      let id = this.slugify(text);
      const base = id;
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
    const normalized = text
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u');
    return normalized
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9s-]/g, '')
      .trim()
      .replace(/s+/g, '-')
      .replace(/-+/g, '-');
  }

  printPage(): void {
    window.print();
  }

  sharePage(): void {
    if (!this.resource) return;
    const data = {
      title: this.resource.title,
      text: this.resource.description,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(data).catch(console.error);
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(console.error);
    }
  }
}
