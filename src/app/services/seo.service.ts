import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  twitterCard?: string;
  structuredData?: any;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly defaultConfig: SeoConfig = {
    title: 'Dr. Özlem Murzoğlu | Çocuk Sağlığı ve Hastalıkları Uzmanı',
    description:
      "Ataşehir İstanbul'da 20+ yıllık deneyimli Çocuk Sağlığı ve Hastalıkları Uzmanı. Bright Futures programı, Triple P aile danışmanlığı ve modern pediatri hizmetleri.",
    keywords:
      'Dr. Özlem Murzoğlu, çocuk doktoru, pediatri uzmanı, Ataşehir çocuk doktoru, İstanbul pediatri',
    image: 'https://ozlemmurzoglu.com/logos/OM-Icon-Color.svg',
    url: 'https://ozlemmurzoglu.com',
    type: 'website',
    author: 'Dr. Özlem Murzoğlu',
    twitterCard: 'summary_large_image',
  };

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateTags(config: SeoConfig): void {
    const seoConfig = { ...this.defaultConfig, ...config };

    // Update title
    if (seoConfig.title) {
      const fullTitle = seoConfig.title.includes('Dr. Özlem Murzoğlu')
        ? seoConfig.title
        : `${seoConfig.title} | Dr. Özlem Murzoğlu`;
      this.title.setTitle(fullTitle);
      this.meta.updateTag({ property: 'og:title', content: fullTitle });
      this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    }

    // Update description
    if (seoConfig.description) {
      this.meta.updateTag({ name: 'description', content: seoConfig.description });
      this.meta.updateTag({ property: 'og:description', content: seoConfig.description });
      this.meta.updateTag({ name: 'twitter:description', content: seoConfig.description });
    }

    // Update keywords
    if (seoConfig.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seoConfig.keywords });
    }

    // Update image
    if (seoConfig.image) {
      const imageUrl = seoConfig.image.startsWith('http')
        ? seoConfig.image
        : `https://ozlemmurzoglu.com${seoConfig.image}`;
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    }

    // Update URL
    if (seoConfig.url) {
      const fullUrl = seoConfig.url.startsWith('http')
        ? seoConfig.url
        : `https://ozlemmurzoglu.com${seoConfig.url}`;
      this.meta.updateTag({ property: 'og:url', content: fullUrl });
      this.updateCanonicalUrl(fullUrl);
    }

    // Update type
    if (seoConfig.type) {
      this.meta.updateTag({ property: 'og:type', content: seoConfig.type });
    }

    // Update author
    if (seoConfig.author) {
      this.meta.updateTag({ name: 'author', content: seoConfig.author });
    }

    // Update Twitter card
    if (seoConfig.twitterCard) {
      this.meta.updateTag({ name: 'twitter:card', content: seoConfig.twitterCard });
    }

    // Update structured data
    if (seoConfig.structuredData) {
      this.updateStructuredData(seoConfig.structuredData);
    }
  }

  private updateCanonicalUrl(url: string): void {
    const link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (link) {
      link.href = url;
    } else {
      const newLink: HTMLLinkElement = this.document.createElement('link');
      newLink.setAttribute('rel', 'canonical');
      newLink.setAttribute('href', url);
      this.document.head.appendChild(newLink);
    }
  }

  private updateStructuredData(data: any): void {
    // Remove existing structured data
    const existingScripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach((script) => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });

    // Add new structured data
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  generateArticleSchema(article: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      image: article.image,
      author: {
        '@type': 'Person',
        name: 'Dr. Özlem Murzoğlu',
        url: 'https://ozlemmurzoglu.com/hakkimizda',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Dr. Özlem Murzoğlu Kliniği',
        logo: {
          '@type': 'ImageObject',
          url: 'https://ozlemmurzoglu.com/logos/OM-Icon-Color.svg',
        },
      },
      datePublished: article.publishedDate,
      dateModified: article.modifiedDate || article.publishedDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': article.url,
      },
    };
  }

  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  generateServiceSchema(service: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'MedicalProcedure',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'Physician',
        name: 'Dr. Özlem Murzoğlu',
        medicalSpecialty: 'Pediatrics',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Barbaros Mah. Ak Zambak Sok. No:3',
          addressLocality: 'Ataşehir',
          addressRegion: 'İstanbul',
          postalCode: '34746',
          addressCountry: 'TR',
        },
      },
    };
  }

  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }
}
