import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

type BlogCategoryId =
  | 'BABY_CARE'
  | 'CHILD_PSYCHOLOGY'
  | 'CHILD_DEVELOPMENT'
  | 'ADOLESCENCE'
  | 'SAFETY'
  | 'DENTAL_HEALTH';

type BlogTagId =
  | 'TEETHING'
  | 'BABY'
  | 'GUMS'
  | 'BULLYING'
  | 'SCHOOL'
  | 'CHILD_PSYCHOLOGY'
  | 'SAFETY'
  | 'PACIFIER'
  | 'WEANING'
  | 'DEVELOPMENT'
  | 'TOILET_TRAINING'
  | 'CHILD_DEVELOPMENT'
  | 'PARENTING'
  | 'ADOLESCENCE'
  | 'COMMUNICATION'
  | 'CAR_SAFETY'
  | 'CAR_SEAT'
  | 'TRAVEL'
  | 'SAFE_SLEEP'
  | 'SIDS'
  | 'BABY_SAFETY'
  | 'SLEEP'
  | 'DENTAL_HEALTH'
  | 'CAVITY_PREVENTION'
  | 'FLUORIDE'
  | 'ORAL_CARE'
  | 'THUMB_SUCKING'
  | 'HABITS'
  | 'COLIC'
  | 'BABY_CRYING'
  | 'SOOTHING'
  | 'BABY_CARE'
  | 'SEPARATION_ANXIETY'
  | 'ATTACHMENT'
  | 'DIAPER_RASH'
  | 'DIAPER_DERMATITIS'
  | 'SKIN_CARE';

interface BlogArticleDefinition {
  id: string;
  slug: string;
  key: string;
  category: BlogCategoryId;
  tags: BlogTagId[];
  publishedAt: string;
  readTime: number;
  image: string;
  featured: boolean;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategoryId;
  tags: string[];
  date: string;
  readTime: number;
  image: string;
  author: string;
  featured: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly translate = inject(TranslateService);

  private readonly articleDefinitions: BlogArticleDefinition[] = [
    {
      id: '1',
      slug: 'dis-cikarma-sureci',
      key: 'DIS_CIKARMA_SURECI',
      category: 'BABY_CARE',
      tags: ['TEETHING', 'BABY', 'GUMS'],
      publishedAt: '2024-03-15',
      readTime: 5,
      image: '/assets/images/blog/teething.svg',
      featured: true,
    },
    {
      id: '2',
      slug: 'cocuklar-arasi-zorbalik',
      key: 'COCUKLAR_ARASI_ZORBALIK',
      category: 'CHILD_PSYCHOLOGY',
      tags: ['BULLYING', 'SCHOOL', 'CHILD_PSYCHOLOGY', 'SAFETY'],
      publishedAt: '2024-03-10',
      readTime: 6,
      image: '/assets/images/blog/bullying.svg',
      featured: true,
    },
    {
      id: '3',
      slug: 'emzik-ve-emzik-birakma',
      key: 'EMZIK_VE_EMZIK_BIRAKMA',
      category: 'BABY_CARE',
      tags: ['PACIFIER', 'BABY', 'WEANING', 'DEVELOPMENT'],
      publishedAt: '2024-03-05',
      readTime: 7,
      image: '/assets/images/blog/pacifier.svg',
      featured: false,
    },
    {
      id: '4',
      slug: 'tuvalet-egitimi',
      key: 'TUVALET_EGITIMI',
      category: 'CHILD_DEVELOPMENT',
      tags: ['TOILET_TRAINING', 'CHILD_DEVELOPMENT', 'PARENTING'],
      publishedAt: '2024-02-28',
      readTime: 8,
      image: '/assets/images/blog/potty-training.svg',
      featured: false,
    },
    {
      id: '5',
      slug: 'bir-ergenle-iletisim-kurmak',
      key: 'BIR_ERGENLE_ILETISIM_KURMAK',
      category: 'ADOLESCENCE',
      tags: ['ADOLESCENCE', 'COMMUNICATION', 'PARENTING', 'CHILD_PSYCHOLOGY'],
      publishedAt: '2024-02-20',
      readTime: 9,
      image: '/assets/images/blog/teen-communication.svg',
      featured: true,
    },
    {
      id: '6',
      slug: 'araba-guvenlik-koltuklari',
      key: 'ARABA_GUVENLIK_KOLTUKLARI',
      category: 'SAFETY',
      tags: ['CAR_SAFETY', 'CAR_SEAT', 'SAFETY', 'TRAVEL'],
      publishedAt: '2024-02-15',
      readTime: 6,
      image: '/assets/images/blog/car-safety.svg',
      featured: false,
    },
    {
      id: '7',
      slug: 'guvenli-uyku',
      key: 'GUVENLI_UYKU',
      category: 'BABY_CARE',
      tags: ['SAFE_SLEEP', 'SIDS', 'BABY_SAFETY', 'SLEEP'],
      publishedAt: '2024-02-10',
      readTime: 5,
      image: '/assets/images/blog/safe-sleep.svg',
      featured: true,
    },
    {
      id: '8',
      slug: 'saglikli-disler',
      key: 'SAGLIKLI_DISLER',
      category: 'DENTAL_HEALTH',
      tags: ['DENTAL_HEALTH', 'CAVITY_PREVENTION', 'FLUORIDE', 'ORAL_CARE'],
      publishedAt: '2024-02-05',
      readTime: 6,
      image: '/assets/images/blog/dental-health.svg',
      featured: false,
    },
    {
      id: '9',
      slug: 'emzik-parmak-emme',
      key: 'EMZIK_PARMAK_EMME',
      category: 'BABY_CARE',
      tags: ['PACIFIER', 'THUMB_SUCKING', 'CHILD_DEVELOPMENT', 'HABITS'],
      publishedAt: '2024-01-30',
      readTime: 7,
      image: '/assets/images/blog/thumb-sucking.svg',
      featured: false,
    },
    {
      id: '10',
      slug: 'kolik',
      key: 'KOLIK',
      category: 'BABY_CARE',
      tags: ['COLIC', 'BABY_CRYING', 'SOOTHING', 'BABY_CARE'],
      publishedAt: '2024-01-25',
      readTime: 6,
      image: '/assets/images/blog/colic.svg',
      featured: false,
    },
    {
      id: '11',
      slug: 'ayrilik-kaygisi',
      key: 'AYRILIK_KAYGISI',
      category: 'CHILD_PSYCHOLOGY',
      tags: ['SEPARATION_ANXIETY', 'CHILD_PSYCHOLOGY', 'ATTACHMENT', 'DEVELOPMENT'],
      publishedAt: '2024-01-20',
      readTime: 5,
      image: '/assets/images/blog/separation-anxiety.svg',
      featured: false,
    },
    {
      id: '12',
      slug: 'pisikler',
      key: 'PISIKLER',
      category: 'BABY_CARE',
      tags: ['DIAPER_RASH', 'DIAPER_DERMATITIS', 'SKIN_CARE', 'BABY_CARE'],
      publishedAt: '2024-01-15',
      readTime: 4,
      image: '/assets/images/blog/diaper-rash.svg',
      featured: false,
    },
  ];

  private readonly articlesSubject = new BehaviorSubject<BlogArticle[]>([]);
  readonly articles$ = this.articlesSubject.asObservable();

  constructor() {
    this.refreshArticles();
    this.translate.onLangChange.subscribe(() => this.refreshArticles());
  }

  getAllArticles(): Observable<BlogArticle[]> {
    return this.articles$;
  }

  getArticleBySlug(slug: string): Observable<BlogArticle | undefined> {
    return this.articles$.pipe(map((articles) => articles.find((article) => article.slug === slug)));
  }

  getFeaturedArticles(): Observable<BlogArticle[]> {
    return this.articles$.pipe(map((articles) => articles.filter((article) => article.featured)));
  }

  getArticlesByCategory(category: string): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map((articles) => {
        if (!category) {
          return articles;
        }

        return articles.filter((article) => article.category === category);
      }),
    );
  }

  getCategories(): string[] {
    return [...new Set(this.articleDefinitions.map((article) => article.category))];
  }

  searchArticles(query: string): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map((articles) => {
        const searchQuery = query.toLocaleLowerCase(this.getLocale());
        return articles.filter((article) =>
          article.title.toLocaleLowerCase(this.getLocale()).includes(searchQuery) ||
          article.excerpt.toLocaleLowerCase(this.getLocale()).includes(searchQuery) ||
          article.content.toLocaleLowerCase(this.getLocale()).includes(searchQuery) ||
          article.tags.some((tag) => tag.toLocaleLowerCase(this.getLocale()).includes(searchQuery)),
        );
      }),
    );
  }

  private refreshArticles(): void {
    this.articlesSubject.next(this.articleDefinitions.map((definition) => this.localizeArticle(definition)));
  }

  private localizeArticle(definition: BlogArticleDefinition): BlogArticle {
    const prefix = `BLOG.ARTICLES.${definition.key}`;

    return {
      id: definition.id,
      slug: definition.slug,
      title: this.translate.instant(`${prefix}.TITLE`),
      excerpt: this.translate.instant(`${prefix}.EXCERPT`),
      content: this.translate.instant(`${prefix}.CONTENT`),
      category: definition.category,
      tags: definition.tags.map((tag) => this.translate.instant(`BLOG.TAGS.${tag}`)),
      date: this.formatDate(definition.publishedAt),
      readTime: definition.readTime,
      image: definition.image,
      author: this.translate.instant('COMMON.DOCTOR_NAME'),
      featured: definition.featured,
    };
  }

  private formatDate(date: string): string {
    const [year, month, day] = date.split('-').map(Number);
    const publishedAt = new Date(Date.UTC(year, month - 1, day));

    return new Intl.DateTimeFormat(this.getLocale(), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(publishedAt);
  }

  private getLocale(): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'tr';
    return lang === 'tr' ? 'tr-TR' : 'en-US';
  }
}
