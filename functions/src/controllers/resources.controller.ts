import { StrapiService, StrapiResource } from '../services/strapi.service';
import { CacheService } from '../services/cache.service';

export class ResourcesController {
  constructor(
    private strapiService: StrapiService,
    private cacheService: CacheService
  ) {}

  /**
   * Tüm resource'ları getir (cache'li)
   */
  async getResources(locale: string = 'tr', category?: string): Promise<any[]> {
    const cacheKey = CacheService.createResourcesListKey(locale, category);
    
    // Cache'den kontrol et
    const cached = this.cacheService.get<any[]>(cacheKey);
    if (cached) {
      console.log(`Cache hit: ${cacheKey}`);
      return cached;
    }
    
    // Strapi'den çek
    console.log(`Cache miss: ${cacheKey}, fetching from Strapi`);
    const resources = await this.strapiService.getResources(locale, category);
    
    // Veriyi transform et
    const transformed = this.transformResources(resources);
    
    // Cache'e kaydet
    this.cacheService.set(cacheKey, transformed, 3600); // 1 saat
    
    return transformed;
  }

  /**
   * Tek bir resource getir (cache'li)
   */
  async getResource(resourceKey: string, categoryKey: string, locale: string = 'tr'): Promise<any | null> {
    const cacheKey = CacheService.createResourceKey(resourceKey, categoryKey, locale);
    
    // Cache'den kontrol et
    const cached = this.cacheService.get<any>(cacheKey);
    if (cached) {
      console.log(`Cache hit: ${cacheKey}`);
      return cached;
    }
    
    // Strapi'den çek
    console.log(`Cache miss: ${cacheKey}, fetching from Strapi`);
    const resource = await this.strapiService.getResource(resourceKey, categoryKey, locale);
    
    if (!resource) {
      return null;
    }
    
    // Veriyi transform et
    const transformed = this.transformResource(resource);
    
    // Cache'e kaydet
    this.cacheService.set(cacheKey, transformed, 3600); // 1 saat
    
    return transformed;
  }

  /**
   * Resource'larda arama yap (cache'li)
   */
  async searchResources(query: string, locale: string = 'tr'): Promise<any[]> {
    const cacheKey = CacheService.createSearchKey(query, locale);
    
    // Cache'den kontrol et
    const cached = this.cacheService.get<any[]>(cacheKey);
    if (cached) {
      console.log(`Cache hit: ${cacheKey}`);
      return cached;
    }
    
    // Strapi'den ara
    console.log(`Cache miss: ${cacheKey}, searching in Strapi`);
    const resources = await this.strapiService.searchResources(query, locale);
    
    // Veriyi transform et ve relevans skoru ekle
    const transformed = this.transformSearchResults(resources, query);
    
    // Cache'e kaydet (kısa süre)
    this.cacheService.set(cacheKey, transformed, 300); // 5 dakika
    
    return transformed;
  }

  /**
   * Kategorileri getir (cache'li)
   */
  async getCategories(locale: string = 'tr'): Promise<any[]> {
    const cacheKey = CacheService.createCategoriesKey(locale);
    
    // Cache'den kontrol et
    const cached = this.cacheService.get<any[]>(cacheKey);
    if (cached) {
      console.log(`Cache hit: ${cacheKey}`);
      return cached;
    }
    
    // Strapi'den çek
    console.log(`Cache miss: ${cacheKey}, fetching from Strapi`);
    const categories = await this.strapiService.getCategories(locale);
    
    // Cache'e kaydet
    this.cacheService.set(cacheKey, categories, 7200); // 2 saat
    
    return categories;
  }

  /**
   * Resource'ları transform et
   */
  private transformResources(resources: StrapiResource[]): any[] {
    return resources.map(resource => this.transformResource(resource));
  }

  /**
   * Tek resource'u transform et
   */
  private transformResource(resource: StrapiResource): any {
    const attrs = resource.attributes;
    
    return {
      id: resource.id,
      resourceKey: attrs.resourceKey,
      categoryKey: attrs.categoryKey,
      title: attrs.title,
      description: attrs.description,
      content: attrs.content,
      contentType: attrs.contentType || 'html',
      metadata: attrs.metadata || {},
      seo: this.transformSeo(attrs.seo),
      locale: attrs.locale,
      createdAt: attrs.createdAt,
      updatedAt: attrs.updatedAt,
      publishedAt: attrs.publishedAt
    };
  }

  /**
   * SEO verilerini transform et
   */
  private transformSeo(seo: any): any {
    if (!seo) return null;
    
    return {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      ogImage: seo.ogImage?.data?.attributes?.url
    };
  }

  /**
   * Arama sonuçlarını transform et ve skorla
   */
  private transformSearchResults(resources: StrapiResource[], query: string): any[] {
    const searchTerm = query.toLowerCase();
    
    return resources
      .map(resource => {
        const transformed = this.transformResource(resource);
        let relevanceScore = 0;
        let matchedContent = '';
        
        // Başlıkta arama (en yüksek skor)
        if (transformed.title.toLowerCase().includes(searchTerm)) {
          relevanceScore += 10;
          matchedContent = this.highlightMatch(transformed.title, searchTerm);
        }
        
        // Açıklamada arama (orta skor)
        if (transformed.description.toLowerCase().includes(searchTerm)) {
          relevanceScore += 5;
          if (!matchedContent) {
            matchedContent = this.highlightMatch(transformed.description, searchTerm);
          }
        }
        
        // İçerikte arama (düşük skor)
        if (transformed.content.toLowerCase().includes(searchTerm)) {
          relevanceScore += 2;
          if (!matchedContent) {
            const snippet = this.extractSnippet(transformed.content, searchTerm);
            matchedContent = this.highlightMatch(snippet, searchTerm);
          }
        }
        
        return {
          ...transformed,
          relevanceScore,
          matchedContent
        };
      })
      .filter(result => result.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Metinde eşleşmeyi vurgula
   */
  private highlightMatch(text: string, searchTerm: string): string {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * İçerikten snippet çıkar
   */
  private extractSnippet(content: string, searchTerm: string): string {
    const index = content.toLowerCase().indexOf(searchTerm);
    if (index === -1) return '';
    
    const snippetLength = 150;
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + searchTerm.length + 100);
    
    let snippet = content.substring(start, end);
    
    // Elipsis ekle
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return snippet;
  }
}