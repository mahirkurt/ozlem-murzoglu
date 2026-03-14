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
    title: 'Çocuk Doktoru Ataşehir | Uzm. Dr. Özlem Murzoğlu',
    description:
      'Ataşehir çocuk doktoru Uzm. Dr. Özlem Murzoğlu. Aşı takibi, gelişim kontrolü, uyku danışmanlığı ve 7 uzmanlık alanında hizmet. Randevu: 0216 688 44 83',
    keywords:
      'çocuk doktoru ataşehir, ataşehir çocuk doktoru, pediatrist ataşehir, bebek doktoru ataşehir, Dr. Özlem Murzoğlu, çocuk sağlığı uzmanı ataşehir',
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
        title: 'Çocuk Doktoru Ataşehir | Uzm. Dr. Özlem Murzoğlu',
        description:
          'Ataşehir çocuk doktoru Uzm. Dr. Özlem Murzoğlu. Aşı takibi, gelişim kontrolü, uyku danışmanlığı ve 7 uzmanlık alanında hizmet. Randevu: 0216 688 44 83',
        keywords: 'çocuk doktoru ataşehir, ataşehir çocuk doktoru, pediatrist ataşehir, bebek doktoru ataşehir, Dr. Özlem Murzoğlu, çocuk sağlığı uzmanı ataşehir',
        jsonLd: this.getHomePageSchema(),
      },
      about: {
        title: 'Dr. Özlem Murzoğlu | Sosyal Pediatri Uzmanı Ataşehir',
        description:
          'Uzm. Dr. Özlem Murzoğlu - Sosyal pediatri alanında uzman çocuk doktoru. Bright Futures sertifikalı, AAP standartlarında hizmet. Ataşehir Uphill Towers.',
        ogType: 'profile',
      },
      services: {
        title: 'Çocuk Sağlığı Hizmetleri Ataşehir | 7 Uzmanlık Alanı',
        description:
          'Aşı takibi, Bright Futures gelişim programı, uyku danışmanlığı, beslenme terapisi, Triple P ebeveynlik ve laboratuvar hizmetleri. Hemen randevu alın.',
        jsonLd: this.getServicesSchema(),
      },
      contact: {
        title: 'İletişim ve Randevu | Dr. Özlem Murzoğlu Ataşehir',
        description: 'Ataşehir Uphill Towers\'da çocuk doktoru randevusu alın. Telefon: 0216 688 44 83. WhatsApp ile hızlı randevu.',
        jsonLd: this.getContactSchema(),
      },
      resources: {
        title: 'Ebeveyn Kaynakları | Dr. Özlem Murzoğlu',
        description:
          'Çocuk sağlığı, gelişim rehberleri, aşı takvimi ve beslenme önerileri. Uzman pediatrist tavsiyesiyle güvenilir bilgi.',
      },
      'bright-futures': {
        title: 'Bright Futures Gelişim Takibi Ataşehir | Dr. Özlem Murzoğlu',
        description:
          'AAP standartlarında Bright Futures gelişim takip programı. Yaşa özel değerlendirmeler ve kişisel gelişim planı. Ataşehir\'de uzman pediatrist.',
        jsonLd: this.getServiceSchema('Bright Futures'),
      },
      'triple-p': {
        title: 'Triple P Ebeveynlik Programı İstanbul | Dr. Özlem Murzoğlu',
        description:
          'Triple P Pozitif Ebeveynlik Programı ile çocuğunuzun davranışlarını anlayın. Sertifikalı uzman desteği, Ataşehir.',
        jsonLd: this.getServiceSchema('Triple P'),
      },
      'sos-feeding': {
        title: 'Çocuk Beslenme Terapisi | SOS Feeding Ataşehir',
        description:
          'Çocuğunuz yemek yemiyor mu? SOS Feeding ile duyusal entegrasyon yaklaşımıyla oyun temelli beslenme terapisi. Uzm. Dr. Özlem Murzoğlu.',
        jsonLd: this.getServiceSchema('SOS Feeding'),
      },
      'saglikli-uykular': {
        title: 'Bebek Uyku Danışmanlığı İstanbul | Sağlıklı Uykular',
        description:
          'Bebeğiniz uyumakta zorlanıyor mu? Sağlıklı Uykular programı ile kişisel uyku planı ve uzman takibi. Ataşehir\'de pediatrist desteği.',
        jsonLd: this.getServiceSchema('Sağlıklı Uykular'),
      },
      'laboratuvar-goruntuleme': {
        title: 'Çocuk Laboratuvar ve Görüntüleme Ataşehir | Dr. Özlem Murzoğlu',
        description:
          'Çocuklara özel kan tahlili, idrar testi, görüntüleme ve alerji testleri. Ataşehir\'de pediatri kliniğinde hızlı sonuç.',
        jsonLd: this.getServiceSchema('Laboratuvar ve Görüntüleme'),
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
      name: 'Dr. Özlem Murzoğlu Kliniği',
      alternateName: 'Ataşehir Çocuk Doktoru - Dr. Özlem Murzoğlu',
      description: "Ataşehir İstanbul'da çocuk sağlığı ve hastalıkları kliniği. Bright Futures gelişim takibi, Triple P ebeveyn desteği, beslenme ve uyku danışmanlığı.",
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
        addressLocality: 'Ataşehir',
        addressRegion: 'İstanbul',
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
        { '@type': 'City', name: 'Ataşehir' },
        { '@type': 'City', name: 'Kadıköy' },
        { '@type': 'City', name: 'Ümraniye' },
        { '@type': 'City', name: 'Maltepe' },
        { '@type': 'City', name: 'İstanbul' },
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
        '@id': `${this.baseUrl}/#clinic`,
        name: 'Dr. Özlem Murzoğlu Kliniği',
        telephone: '+902166884483',
        email: 'klinik@drmurzoglu.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Barbaros Mah. Ak Zambak Sok. No:3, Uphill Towers A Blok Daire 30',
          addressLocality: 'Ataşehir',
          addressRegion: 'İstanbul',
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
