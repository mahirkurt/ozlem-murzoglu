import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs/operators';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  robots?: string;
  author?: string;
  locale?: string;
  jsonLd?: any;
  structuredData?: any;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private router = inject(Router);
  private translate = inject(TranslateService);

  private readonly baseUrl = 'https://ozlemmurzoglu.com';

  constructor() {
    this.initializeRouterEvents();
  }

  private get brandName(): string {
    return this.translate.instant('HEADER.BRAND_NAME');
  }

  private get clinicName(): string {
    return this.translate.instant('COMMON.CLINIC_NAME');
  }

  private get defaultSeo(): SeoData {
    return {
      title: this.translate.instant('SEO.PAGES.HOME.TITLE'),
      description: this.translate.instant('SEO.PAGES.HOME.DESCRIPTION'),
      keywords: this.translate.instant('SEO.PAGES.HOME.KEYWORDS'),
      ogType: 'website',
      ogImage: 'https://ozlemmurzoglu.com/assets/images/og-image.jpg',
      twitterCard: 'summary_large_image',
      author: this.brandName,
      robots: 'index, follow',
    };
  }

  updateTags(data: Partial<SeoData>): void {
    const seoData = { ...this.defaultSeo, ...data };

    // Update title
    if (seoData.title) {
      const fullTitle = seoData.title.includes(this.brandName)
        ? seoData.title
        : `${seoData.title} | ${this.brandName}`;
      this.title.setTitle(fullTitle);
      this.meta.updateTag({ property: 'og:title', content: fullTitle });
      this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    }

    // Update description
    if (seoData.description) {
      this.meta.updateTag({ name: 'description', content: seoData.description });
      this.meta.updateTag({ property: 'og:description', content: seoData.description });
      this.meta.updateTag({ name: 'twitter:description', content: seoData.description });
    }

    // Update keywords
    if (seoData.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seoData.keywords });
    }

    // Update OG tags
    if (seoData.ogImage) {
      this.meta.updateTag({ property: 'og:image', content: seoData.ogImage });
    }
    if (seoData.ogType) {
      this.meta.updateTag({ property: 'og:type', content: seoData.ogType });
    }

    // Update Twitter tags
    if (seoData.twitterCard) {
      this.meta.updateTag({ name: 'twitter:card', content: seoData.twitterCard });
    }
    if (seoData.twitterImage) {
      this.meta.updateTag({ name: 'twitter:image', content: seoData.twitterImage });
    }

    // Update canonical URL
    if (seoData.canonical) {
      this.updateCanonicalUrl(seoData.canonical);
    }

    // Update robots
    if (seoData.robots) {
      this.meta.updateTag({ name: 'robots', content: seoData.robots });
    }

    // Update author
    if (seoData.author) {
      this.meta.updateTag({ name: 'author', content: seoData.author });
    }

    // Update JSON-LD structured data
    if (seoData.jsonLd) {
      this.updateJsonLd(seoData.jsonLd);
    } else if (seoData.structuredData) {
      this.updateJsonLd(seoData.structuredData);
    }
  }

  private initializeRouterEvents(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.router.url)
      )
      .subscribe((url) => {
        this.updateCanonicalUrl(url);
        this.updateLocale();
      });
  }

  /**
   * Ana SEO güncelleme metodu
   */
  updateSeo(data: SeoData): void {
    // Title
    const title = data.title || this.defaultSeo.title;
    this.title.setTitle(title!);

    // Meta tags
    this.updateMetaTag('description', data.description || this.defaultSeo.description);
    this.updateMetaTag('keywords', data.keywords || this.defaultSeo.keywords);
    this.updateMetaTag('author', data.author || this.defaultSeo.author);
    this.updateMetaTag('robots', data.robots || this.defaultSeo.robots);

    // Open Graph
    this.updateMetaTag('og:title', data.ogTitle || title);
    this.updateMetaTag(
      'og:description',
      data.ogDescription || data.description || this.defaultSeo.description
    );
    this.updateMetaTag('og:image', data.ogImage || this.defaultSeo.ogImage);
    this.updateMetaTag('og:type', data.ogType || this.defaultSeo.ogType);
    this.updateMetaTag('og:url', data.canonical || this.getCanonicalUrl());
    this.updateMetaTag('og:locale', data.locale || this.getCurrentLocale());
    this.updateMetaTag('og:site_name', this.brandName);

    // Twitter Card
    this.updateMetaTag('twitter:card', data.twitterCard || this.defaultSeo.twitterCard);
    this.updateMetaTag('twitter:title', data.twitterTitle || data.ogTitle || title);
    this.updateMetaTag(
      'twitter:description',
      data.twitterDescription || data.description || this.defaultSeo.description
    );
    this.updateMetaTag(
      'twitter:image',
      data.twitterImage || data.ogImage || this.defaultSeo.ogImage
    );

    // Canonical URL
    if (data.canonical) {
      this.updateCanonicalUrl(data.canonical);
    }

    // JSON-LD Structured Data
    if (data.jsonLd) {
      this.updateJsonLd(data.jsonLd);
    }
  }

  /**
   * Çeviri anahtarları ile SEO güncelleme
   */
  async updateSeoWithTranslation(keys: {
    title?: string;
    description?: string;
    keywords?: string;
  }): Promise<void> {
    const translations = await this.translate
      .get([keys.title || '', keys.description || '', keys.keywords || ''].filter(Boolean))
      .toPromise();

    const seoData: SeoData = {};

    if (keys.title && translations[keys.title]) {
      seoData.title = translations[keys.title];
      seoData.ogTitle = translations[keys.title];
      seoData.twitterTitle = translations[keys.title];
    }

    if (keys.description && translations[keys.description]) {
      seoData.description = translations[keys.description];
      seoData.ogDescription = translations[keys.description];
      seoData.twitterDescription = translations[keys.description];
    }

    if (keys.keywords && translations[keys.keywords]) {
      seoData.keywords = translations[keys.keywords];
    }

    this.updateSeo(seoData);
  }

  /**
   * Sayfa bazlı SEO presetleri
   */
  setPageSeo(pageName: string): void {
    const pageSeoMap: Record<string, SeoData> = {
      home: {
        title: this.translate.instant('SEO.PAGES.HOME.TITLE'),
        description: this.translate.instant('SEO.PAGES.HOME.DESCRIPTION'),
        keywords: this.translate.instant('SEO.PAGES.HOME.KEYWORDS'),
        jsonLd: this.getHomePageSchema(),
      },
      about: {
        title: this.translate.instant('SEO.PAGES.ABOUT.TITLE'),
        description: this.translate.instant('SEO.PAGES.ABOUT.DESCRIPTION'),
        ogType: 'profile',
      },
      services: {
        title: this.translate.instant('SEO.PAGES.SERVICES.TITLE'),
        description: this.translate.instant('SEO.PAGES.SERVICES.DESCRIPTION'),
        jsonLd: this.getServicesSchema(),
      },
      contact: {
        title: this.translate.instant('SEO.PAGES.CONTACT.TITLE'),
        description: this.translate.instant('SEO.PAGES.CONTACT.DESCRIPTION'),
        jsonLd: this.getContactSchema(),
      },
      resources: {
        title: this.translate.instant('SEO.PAGES.RESOURCES.TITLE'),
        description: this.translate.instant('SEO.PAGES.RESOURCES.DESCRIPTION'),
      },
      'bright-futures': {
        title: this.translate.instant('SEO.PAGES.BRIGHT_FUTURES.TITLE'),
        description: this.translate.instant('SEO.PAGES.BRIGHT_FUTURES.DESCRIPTION'),
        jsonLd: this.getServiceSchema(
          this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.TITLE')
        ),
      },
      'triple-p': {
        title: this.translate.instant('SEO.PAGES.TRIPLE_P.TITLE'),
        description: this.translate.instant('SEO.PAGES.TRIPLE_P.DESCRIPTION'),
        jsonLd: this.getServiceSchema(this.translate.instant('SERVICES.SERVICE_TRIPLE_P.TITLE')),
      },
      'sos-feeding': {
        title: this.translate.instant('SEO.PAGES.SOS_FEEDING.TITLE'),
        description: this.translate.instant('SEO.PAGES.SOS_FEEDING.DESCRIPTION'),
        jsonLd: this.getServiceSchema(
          this.translate.instant('SERVICES.SERVICE_SOS_FEEDING.TITLE')
        ),
      },
      'saglikli-uykular': {
        title: this.translate.instant('SEO.PAGES.HEALTHY_SLEEP.TITLE'),
        description: this.translate.instant('SEO.PAGES.HEALTHY_SLEEP.DESCRIPTION'),
        jsonLd: this.getServiceSchema(this.translate.instant('SERVICES.SERVICE_SLEEP.TITLE')),
      },
      'bright-futures-program': {
        title: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.HERO_TITLE') + ' | Dr. Özlem Murzoğlu',
        description: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.HERO_SUBTITLE'),
        jsonLd: [
          this.getServiceSchema(this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.HERO_TITLE')),
          this.generateFaqSchema([
            { question: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q1'), answer: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A1') },
            { question: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q2'), answer: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A2') },
            { question: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q3'), answer: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A3') },
            { question: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q4'), answer: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A4') },
            { question: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q5'), answer: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A5') },
            { question: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q6'), answer: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A6') },
          ]),
        ],
      },
      'asi-takibi': {
        title: this.translate.instant('SERVICES.SERVICE_VACCINES.HERO_TITLE') + ' | Dr. Özlem Murzoğlu',
        description: this.translate.instant('SERVICES.SERVICE_VACCINES.HERO_SUBTITLE'),
        jsonLd: [
          this.getServiceSchema(this.translate.instant('SERVICES.SERVICE_VACCINES.HERO_TITLE')),
          this.generateFaqSchema([
            { question: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_Q1'), answer: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_A1') },
            { question: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_Q2'), answer: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_A2') },
            { question: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_Q3'), answer: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_A3') },
            { question: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_Q4'), answer: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_A4') },
            { question: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_Q5'), answer: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_A5') },
            { question: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_Q6'), answer: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_A6') },
            { question: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_Q7'), answer: this.translate.instant('SERVICES.SERVICE_VACCINES.FAQ_A7') },
          ]),
        ],
      },
      'laboratuvar-goruntuleme': {
        title: this.translate.instant('SEO.PAGES.LAB.TITLE'),
        description: this.translate.instant('SEO.PAGES.LAB.DESCRIPTION'),
        jsonLd: [
          this.getServiceSchema(this.translate.instant('SERVICES.SERVICE_LAB.TITLE')),
          this.generateFaqSchema([
            { question: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_Q1'), answer: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_A1') },
            { question: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_Q2'), answer: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_A2') },
            { question: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_Q3'), answer: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_A3') },
            { question: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_Q4'), answer: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_A4') },
            { question: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_Q5'), answer: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_A5') },
            { question: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_Q6'), answer: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_A6') },
            { question: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_Q7'), answer: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_A7') },
            { question: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_Q8'), answer: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_A8') },
            { question: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_Q9'), answer: this.translate.instant('SERVICES.SERVICE_LAB_IMAGING.FAQ_A9') },
          ]),
        ],
      },
    };

    const seoData = pageSeoMap[pageName] || {};
    this.updateSeo(seoData);
  }

  /**
   * Meta tag güncelleme yardımcı metodu
   */
  private updateMetaTag(name: string, content?: string): void {
    if (!content) return;

    const isProperty = name.startsWith('og:') || name.startsWith('twitter:');

    if (isProperty) {
      this.meta.updateTag({ property: name, content });
    } else {
      this.meta.updateTag({ name, content });
    }
  }

  /**
   * Canonical URL güncelleme
   */
  private updateCanonicalUrl(url: string): void {
    const canonicalUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;

    // Mevcut canonical link'i kaldır
    const existingLink = document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.remove();
    }

    // Yeni canonical link ekle
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    document.head.appendChild(link);
  }

  /**
   * Canonical URL oluştur
   */
  private getCanonicalUrl(): string {
    return `${this.baseUrl}${this.router.url}`;
  }

  /**
   * Locale güncelleme
   */
  private updateLocale(): void {
    const locale = this.getCurrentLocale();
    this.updateMetaTag('og:locale', locale);
    document.documentElement.setAttribute('lang', locale.split('_')[0]);
  }

  /**
   * Mevcut locale'i al
   */
  private getCurrentLocale(): string {
    const lang = this.translate.currentLang || 'tr';
    return lang === 'tr' ? 'tr_TR' : 'en_US';
  }

  /**
   * JSON-LD Structured Data güncelleme
   */
  private updateJsonLd(data: any): void {
    // Mevcut script'i kaldır
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Yeni script ekle
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Ana sayfa schema.org yapılandırması
   */
  private getHomePageSchema(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'MedicalClinic',
      '@id': `${this.baseUrl}/#clinic`,
      name: this.clinicName,
      alternateName: this.translate.instant('SEO.SCHEMA.CLINIC_ALT_NAME'),
      description: this.translate.instant('SEO.SCHEMA.CLINIC_DESCRIPTION'),
      url: this.baseUrl,
      telephone: '+902166884483',
      email: 'klinik@drmurzoglu.com',
      image: `${this.baseUrl}/images/dr_murzoglu.jpg`,
      logo: `${this.baseUrl}/logos/OM-Icon-Color.svg`,
      medicalSpecialty: 'Pediatrics',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Barbaros Mah. Ak Zambak Sok. No:3, Uphill Towers A Blok Daire 30',
        addressLocality: this.translate.instant('SEO.LOCATIONS.ATASEHIR'),
        addressRegion: this.translate.instant('SEO.LOCATIONS.ISTANBUL'),
        postalCode: '34746',
        addressCountry: 'TR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 40.9884,
        longitude: 29.1303,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '14:00',
        },
      ],
      sameAs: [
        'https://www.facebook.com/dr.murzoglu',
        'https://instagram.com/dr.ozlemmurzoglu',
        'https://x.com/ozlemmurzoglu',
        'https://www.linkedin.com/in/ozlemmurzoglu',
        'https://www.youtube.com/@ozlemmurzoglu',
      ],
      areaServed: [
        { '@type': 'City', name: this.translate.instant('SEO.LOCATIONS.ATASEHIR') },
        { '@type': 'City', name: this.translate.instant('SEO.LOCATIONS.KADIKOY') },
        { '@type': 'City', name: this.translate.instant('SEO.LOCATIONS.UMRANIYE') },
        { '@type': 'City', name: this.translate.instant('SEO.LOCATIONS.MALTEPE') },
        { '@type': 'City', name: this.translate.instant('SEO.LOCATIONS.ISTANBUL') },
      ],
    };
  }

  /**
   * Hizmetler schema.org yapılandırması
   */
  private getServicesSchema(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'MedicalBusiness',
      name: this.translate.instant('SEO.SCHEMA.SERVICES_BUSINESS_NAME'),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: this.translate.instant('SEO.SCHEMA.SERVICES_CATALOG_NAME'),
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'MedicalProcedure',
              name: this.translate.instant('SERVICES.SERVICE_BRIGHT_FUTURES.TITLE'),
              description: this.translate.instant('SEO.SCHEMA.SERVICE_DESCRIPTIONS.BRIGHT_FUTURES'),
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'MedicalProcedure',
              name: this.translate.instant('SERVICES.SERVICE_TRIPLE_P.TITLE'),
              description: this.translate.instant('SEO.SCHEMA.SERVICE_DESCRIPTIONS.TRIPLE_P'),
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'MedicalProcedure',
              name: this.translate.instant('SERVICES.SERVICE_SOS_FEEDING.TITLE'),
              description: this.translate.instant('SEO.SCHEMA.SERVICE_DESCRIPTIONS.SOS_FEEDING'),
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'MedicalProcedure',
              name: this.translate.instant('SERVICES.SERVICE_SLEEP.TITLE'),
              description: this.translate.instant('SEO.SCHEMA.SERVICE_DESCRIPTIONS.HEALTHY_SLEEP'),
            },
          },
        ],
      },
    };
  }

  /**
   * İletişim sayfası schema.org yapılandırması
   */
  private getContactSchema(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      mainEntity: {
        '@type': 'MedicalClinic',
        '@id': `${this.baseUrl}/#clinic`,
        name: this.clinicName,
        telephone: '+902166884483',
        email: 'klinik@drmurzoglu.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Barbaros Mah. Ak Zambak Sok. No:3, Uphill Towers A Blok Daire 30',
          addressLocality: this.translate.instant('SEO.LOCATIONS.ATASEHIR'),
          addressRegion: this.translate.instant('SEO.LOCATIONS.ISTANBUL'),
          postalCode: '34746',
          addressCountry: 'TR',
        },
      },
    };
  }

  /**
   * Servis sayfası schema.org yapılandırması
   */
  private getServiceSchema(serviceName: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'MedicalProcedure',
      name: serviceName,
      procedureType: this.translate.instant('SEO.SCHEMA.PROCEDURE_TYPE'),
      provider: {
        '@type': 'Person',
        name: this.brandName,
        jobTitle: this.translate.instant('SEO.SCHEMA.PROVIDER_JOB_TITLE'),
        worksFor: {
          '@type': 'MedicalClinic',
          name: this.clinicName,
        },
      },
    };
  }

  /**
   * FAQ sayfası schema.org yapılandırması (FAQPage rich snippet)
   */
  generateFaqSchema(items: Array<{ question: string; answer: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
  }

  /**
   * Breadcrumb schema oluştur
   */
  generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.baseUrl}${item.url}`,
      })),
    };
  }

  /**
   * Article schema oluştur (blog/kaynaklar için)
   */
  generateArticleSchema(article: {
    title: string;
    description: string;
    author?: string;
    datePublished?: string;
    dateModified?: string;
    image?: string;
  }): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      author: {
        '@type': 'Person',
        name: article.author || this.brandName,
      },
      datePublished: article.datePublished || new Date().toISOString(),
      dateModified: article.dateModified || new Date().toISOString(),
      image: article.image || `${this.baseUrl}/assets/images/og-image.jpg`,
      publisher: {
        '@type': 'Organization',
        name: this.brandName,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logos/OM-Wide-Color.svg`,
        },
      },
    };
  }
}
