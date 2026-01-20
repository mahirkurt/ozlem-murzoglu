import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { PageHeaderComponent, Breadcrumb } from '../../../components/page-header/page-header.component';
import { ContactCtaComponent } from '../../../components/contact-cta/contact-cta.component';

interface ResourceDoc {
  slug: string;
  title: string;
  description: string;
  path: string;
  downloadUrl: string;
}

interface ResourceIndex {
  categories: Record<string, { title: string; documents: ResourceDoc[] }>;
}

@Component({
  selector: 'app-bright-futures-cocuk',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, PageHeaderComponent, ContactCtaComponent],
  templateUrl: './index.component.html',
  styleUrls: ['../resource-enhanced-styles.scss']
})
export class BrightFuturesCocukCategoryComponent implements OnInit {
  categorySlug = 'bright-futures-cocuk';
  categoryTitle = '';
  docs: ResourceDoc[] = [];
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private http: HttpClient,
    private title: Title,
    private meta: Meta,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.http.get<ResourceIndex>('/assets/resources/resources-index.json').subscribe({
      next: (index) => {
        const category = index.categories[this.categorySlug];
        this.categoryTitle = category?.title || 'Bright Futures (Çocuk)';
        this.docs = category?.documents || [];
        this.breadcrumbs = [
          { translateKey: 'RESOURCES.HOME_BREADCRUMB', url: '/' },
          { translateKey: 'RESOURCES.RESOURCES_BREADCRUMB', url: '/kaynaklar' },
          { label: this.categoryTitle }
        ];
        const resourcesLabel = this.translate.instant('RESOURCES.SECTION_TITLE');
        const siteLabel = this.translate.instant('COMMON.DOCTOR_NAME');
        const fullTitle = this.categoryTitle + ' | ' + resourcesLabel + ' | ' + siteLabel;
        this.title.setTitle(fullTitle);
        this.meta.updateTag({ name: 'description', content: this.translate.instant('RESOURCES.CATEGORY_SUBTITLE') });
      },
      error: (err) => console.error('Failed to load resources index', err)
    });
  }
}
