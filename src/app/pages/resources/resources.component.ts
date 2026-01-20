import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageHeaderComponent, Breadcrumb } from '../../components/page-header/page-header.component';
import { ContactCtaComponent } from '../../components/contact-cta/contact-cta.component';

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

interface ResourceCategoryConfig {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: 'primary' | 'secondary' | 'tertiary';
  route: string;
}

interface ResourceCategory extends ResourceCategoryConfig {
  documentCount: number;
}

const CATEGORY_CONFIG: ResourceCategoryConfig[] = [
  {
    id: 'bright-futures-aile',
    titleKey: 'RESOURCES.CATEGORIES.BRIGHT_FUTURES_FAMILY',
    descriptionKey: 'RESOURCES.CATEGORIES.BRIGHT_FUTURES_FAMILY_DESC',
    icon: 'family_restroom',
    color: 'primary',
    route: '/kaynaklar/bright-futures-aile'
  },
  {
    id: 'bright-futures-cocuk',
    titleKey: 'RESOURCES.CATEGORIES.BRIGHT_FUTURES_CHILD',
    descriptionKey: 'RESOURCES.CATEGORIES.BRIGHT_FUTURES_CHILD_DESC',
    icon: 'child_care',
    color: 'secondary',
    route: '/kaynaklar/bright-futures-cocuk'
  },
  {
    id: 'asilar',
    titleKey: 'RESOURCES.CATEGORIES.VACCINES',
    descriptionKey: 'RESOURCES.CATEGORIES.VACCINES_DESC',
    icon: 'vaccines',
    color: 'tertiary',
    route: '/kaynaklar/asilar'
  },
  {
    id: 'gebelik-donemi',
    titleKey: 'RESOURCES.CATEGORIES.PREGNANCY',
    descriptionKey: 'RESOURCES.CATEGORIES.PREGNANCY_DESC',
    icon: 'pregnant_woman',
    color: 'primary',
    route: '/kaynaklar/gebelik-donemi'
  },
  {
    id: 'gelisim-rehberleri',
    titleKey: 'RESOURCES.CATEGORIES.DEVELOPMENT',
    descriptionKey: 'RESOURCES.CATEGORIES.DEVELOPMENT_DESC',
    icon: 'trending_up',
    color: 'secondary',
    route: '/kaynaklar/gelisim-rehberleri'
  },
  {
    id: 'hastaliklar',
    titleKey: 'RESOURCES.CATEGORIES.DISEASES',
    descriptionKey: 'RESOURCES.CATEGORIES.DISEASES_DESC',
    icon: 'medical_information',
    color: 'tertiary',
    route: '/kaynaklar/hastaliklar'
  },
  {
    id: 'oyuncaklar',
    titleKey: 'RESOURCES.CATEGORIES.TOYS',
    descriptionKey: 'RESOURCES.CATEGORIES.TOYS_DESC',
    icon: 'toys',
    color: 'primary',
    route: '/kaynaklar/oyuncaklar'
  },
  {
    id: 'aile-medya-plani',
    titleKey: 'RESOURCES.CATEGORIES.MEDIA_PLAN',
    descriptionKey: 'RESOURCES.CATEGORIES.MEDIA_PLAN_DESC',
    icon: 'devices',
    color: 'secondary',
    route: '/kaynaklar/aile-medya-plani'
  },
  {
    id: 'genel-bilgiler',
    titleKey: 'RESOURCES.CATEGORIES.GENERAL_INFO',
    descriptionKey: 'RESOURCES.CATEGORIES.GENERAL_INFO_DESC',
    icon: 'info',
    color: 'tertiary',
    route: '/kaynaklar/genel-bilgiler'
  },
  {
    id: 'cdc-buyume-egrileri',
    titleKey: 'RESOURCES.CATEGORIES.CDC_GROWTH',
    descriptionKey: 'RESOURCES.CATEGORIES.CDC_GROWTH_DESC',
    icon: 'show_chart',
    color: 'primary',
    route: '/kaynaklar/cdc-buyume-egrileri'
  },
  {
    id: 'who-buyume-egrileri',
    titleKey: 'RESOURCES.CATEGORIES.WHO_GROWTH',
    descriptionKey: 'RESOURCES.CATEGORIES.WHO_GROWTH_DESC',
    icon: 'analytics',
    color: 'secondary',
    route: '/kaynaklar/who-buyume-egrileri'
  }
];

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, PageHeaderComponent, ContactCtaComponent],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss'
})
export class ResourcesComponent implements OnInit {
  query = '';
  results: { title: string; path: string; categoryKey: string }[] = [];
  categories: ResourceCategory[] = CATEGORY_CONFIG.map((config) => ({
    ...config,
    documentCount: 0
  }));
  popularDocs: ResourceDoc[] = [];
  breadcrumbs: Breadcrumb[] = [
    { translateKey: 'RESOURCES.HOME_BREADCRUMB', url: '/' },
    { translateKey: 'RESOURCES.RESOURCES_BREADCRUMB' }
  ];

  private index: ResourceIndex | null = null;
  private categoryKeyMap = new Map(CATEGORY_CONFIG.map((config) => [config.id, config.titleKey]));

  constructor(
    private http: HttpClient,
    private titleService: Title,
    private meta: Meta,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.updateMeta();
    this.http.get<ResourceIndex>('/assets/resources/resources-index.json').subscribe({
      next: (index) => {
        this.index = index;
        this.refreshCategories();
        this.buildPopularDocs();
      },
      error: (err) => console.error('Failed to load resources index', err)
    });
  }

  onSearch(q: string): void {
    this.query = q;
    if (!this.index || !q.trim()) {
      this.results = [];
      return;
    }

    const norm = (value: string) => value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

    const nq = norm(q);
    const acc: { title: string; path: string; categoryKey: string }[] = [];

    Object.entries(this.index.categories).forEach(([categoryId, category]) => {
      category.documents.forEach((doc) => {
        if (norm(doc.title).includes(nq)) {
          acc.push({
            title: doc.title,
            path: doc.path,
            categoryKey: this.categoryKeyMap.get(categoryId) || ''
          });
        }
      });
    });

    this.results = acc.slice(0, 50);
  }

  clearSearch(): void {
    this.query = '';
    this.results = [];
  }

  getColorClass(color: string): string {
    return `category-${color}`;
  }

  private refreshCategories(): void {
    if (!this.index) return;
    this.categories = CATEGORY_CONFIG.map((config) => ({
      ...config,
      documentCount: this.index?.categories[config.id]?.documents.length || 0
    }));
  }

  private buildPopularDocs(): void {
    if (!this.index) return;
    const docs = Object.values(this.index.categories).flatMap((category) => category.documents);
    const sorted = docs.slice().sort((a, b) => a.title.localeCompare(b.title, 'tr'));
    this.popularDocs = sorted.slice(0, 4);
  }

  private updateMeta(): void {
    const resourcesTitle = this.translate.instant('RESOURCES.PAGE_TITLE');
    const siteLabel = this.translate.instant('COMMON.DOCTOR_NAME');
    this.titleService.setTitle(resourcesTitle + ' | ' + siteLabel);
    this.meta.updateTag({ name: 'description', content: this.translate.instant('RESOURCES.SUBTITLE') });
  }
}
