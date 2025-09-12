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

  private readonly defaultSeo: SeoData = {
    title: 'Dr. Özlem Murzoğlu - Çocuk Sağlığı ve Hastalıkları Uzmanı',
    description:
      "Ankara'da çocuk sağlığı ve hastalıkları uzmanı Dr. Özlem Murzoğlu. Bright Futures programı, Triple P ebeveyn desteği, SOS Feeding ve uyku danışmanlığı hizmetleri.",
    keywords:
      'çocuk doktoru, pediatri, ankara çocuk doktoru, bright futures, triple p, sos feeding, uyku danışmanlığı, aşı, bebek bakımı',
    ogType: 'website',
    ogImage: 'https://ozlemmurzoglu.com/assets/images/og-image.jpg',
    twitterCard: 'summary_large_image',
    author: 'Dr. Özlem Murzoğlu',
    robots: 'index, follow',
  };

  private readonly baseUrl = 'https://ozlemmurzoglu.com';

  constructor() {
    this.initializeRouterEvents();
  }

  updateTags(data: Partial<SeoData>): void {
    const seoData = { ...this.defaultSeo, ...data };

    // Update title
    if (seoData.title) {
      const fullTitle = seoData.title.includes('Dr. Özlem Murzoğlu')
        ? seoData.title
        : `${seoData.title} | Dr. Özlem Murzoğlu`;
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
    this.updateMetaTag('og:site_name', 'Dr. Özlem Murzoğlu');

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
        title: 'Dr. Özlem Murzoğlu - Çocuk Sağlığı ve Hastalıkları Uzmanı',
        description:
          "Ankara'da çocuk sağlığı uzmanı Dr. Özlem Murzoğlu. Modern pediatri yaklaşımı ile bebeğinizin ve çocuğunuzun sağlıklı gelişimi için yanınızdayız.",
        jsonLd: this.getHomePageSchema(),
      },
      about: {
        title: 'Hakkımızda - Dr. Özlem Murzoğlu',
        description:
          'Dr. Özlem Murzoğlu hakkında detaylı bilgi. Eğitim, deneyim ve uzmanlık alanları.',
        ogType: 'profile',
      },
      services: {
        title: 'Hizmetlerimiz - Dr. Özlem Murzoğlu',
        description:
          'Bright Futures programı, Triple P ebeveyn desteği, SOS Feeding, uyku danışmanlığı ve laboratuvar hizmetleri.',
        jsonLd: this.getServicesSchema(),
      },
      contact: {
        title: 'İletişim - Dr. Özlem Murzoğlu',
        description: 'Dr. Özlem Murzoğlu kliniği iletişim bilgileri, adres ve randevu alma.',
        jsonLd: this.getContactSchema(),
      },
      resources: {
        title: 'Kaynaklar - Dr. Özlem Murzoğlu',
        description:
          'Ebeveynler için faydalı kaynaklar, gelişim rehberleri, aşı bilgileri ve sağlık önerileri.',
      },
      'bright-futures': {
        title: 'Bright Futures Programı - Dr. Özlem Murzoğlu',
        description:
          'AAP Bright Futures programı ile çocuğunuzun gelişimini yakından takip edin. Yaşa özel gelişim değerlendirmeleri.',
        jsonLd: this.getServiceSchema('Bright Futures'),
      },
      'triple-p': {
        title: 'Triple P Pozitif Ebeveynlik - Dr. Özlem Murzoğlu',
        description:
          'Triple P Pozitif Ebeveynlik Programı ile ebeveynlik becerilerinizi geliştirin.',
        jsonLd: this.getServiceSchema('Triple P'),
      },
      'sos-feeding': {
        title: 'SOS Feeding Beslenme Danışmanlığı - Dr. Özlem Murzoğlu',
        description:
          'SOS Feeding yaklaşımı ile yemek yeme sorunlarının çözümü. Seçici yeme davranışı tedavisi.',
        jsonLd: this.getServiceSchema('SOS Feeding'),
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
      name: 'Dr. Özlem Murzoğlu Kliniği',
      description: 'Çocuk Sağlığı ve Hastalıkları Uzmanı',
      url: this.baseUrl,
      telephone: '+90 312 241 99 78',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Kızılırmak Mah. 1450. Sok. No:13/30',
        addressLocality: 'Çankaya',
        addressRegion: 'Ankara',
        postalCode: '06510',
        addressCountry: 'TR',
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
      medicalSpecialty: 'Pediatrics',
      priceRange: '$$',
    };
  }

  /**
   * Hizmetler schema.org yapılandırması
   */
  private getServicesSchema(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'MedicalBusiness',
      name: 'Dr. Özlem Murzoğlu - Pediatri Hizmetleri',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Pediatri Hizmetleri',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'MedicalProcedure',
              name: 'Bright Futures Programı',
              description: 'AAP gelişim takip programı',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'MedicalProcedure',
              name: 'Triple P Ebeveyn Desteği',
              description: 'Pozitif ebeveynlik programı',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'MedicalProcedure',
              name: 'SOS Feeding',
              description: 'Beslenme danışmanlığı',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'MedicalProcedure',
              name: 'Uyku Danışmanlığı',
              description: 'Bebek ve çocuk uyku danışmanlığı',
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
        name: 'Dr. Özlem Murzoğlu Kliniği',
        telephone: '+90 312 241 99 78',
        email: 'info@ozlemmurzoglu.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Kızılırmak Mah. 1450. Sok. No:13/30',
          addressLocality: 'Çankaya',
          addressRegion: 'Ankara',
          postalCode: '06510',
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
      procedureType: 'Pediatric Consultation',
      provider: {
        '@type': 'Person',
        name: 'Dr. Özlem Murzoğlu',
        jobTitle: 'Çocuk Sağlığı ve Hastalıkları Uzmanı',
        worksFor: {
          '@type': 'MedicalClinic',
          name: 'Dr. Özlem Murzoğlu Kliniği',
        },
      },
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
        name: article.author || 'Dr. Özlem Murzoğlu',
      },
      datePublished: article.datePublished || new Date().toISOString(),
      dateModified: article.dateModified || new Date().toISOString(),
      image: article.image || `${this.baseUrl}/assets/images/og-image.jpg`,
      publisher: {
        '@type': 'Organization',
        name: 'Dr. Özlem Murzoğlu',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logos/OM-Wide-Color.svg`,
        },
      },
    };
  }
}
