import NodeCache from 'node-cache';

export class CacheService {
  private cache: NodeCache;
  
  constructor() {
    // TTL: 1 saat (3600 saniye)
    // CheckPeriod: 10 dakika (600 saniye)
    this.cache = new NodeCache({
      stdTTL: 3600,
      checkperiod: 600,
      useClones: false
    });
  }

  /**
   * Cache'e veri ekle
   */
  set(key: string, value: any, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 3600);
  }

  /**
   * Cache'den veri al
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Cache'de key var mı kontrol et
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Cache'den veri sil
   */
  delete(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Pattern'e göre cache temizle
   */
  clearPattern(pattern: string): void {
    const keys = this.cache.keys();
    const regex = new RegExp(pattern.replace('*', '.*'));
    
    keys.forEach(key => {
      if (regex.test(key)) {
        this.cache.del(key);
      }
    });
  }

  /**
   * Tüm cache'i temizle
   */
  clearAll(): void {
    this.cache.flushAll();
  }

  /**
   * Cache istatistikleri
   */
  getStats(): NodeCache.Stats {
    return this.cache.getStats();
  }

  /**
   * Cache key oluştur
   */
  static createKey(...parts: string[]): string {
    return parts.join(':');
  }

  /**
   * Resource cache key'i oluştur
   */
  static createResourceKey(resourceKey: string, categoryKey: string, locale: string): string {
    return `resource:${categoryKey}:${resourceKey}:${locale}`;
  }

  /**
   * Resources list cache key'i oluştur
   */
  static createResourcesListKey(locale: string, category?: string): string {
    return category 
      ? `resources:${category}:${locale}`
      : `resources:all:${locale}`;
  }

  /**
   * Search cache key'i oluştur
   */
  static createSearchKey(query: string, locale: string): string {
    return `search:${query.toLowerCase()}:${locale}`;
  }

  /**
   * Categories cache key'i oluştur
   */
  static createCategoriesKey(locale: string): string {
    return `categories:${locale}`;
  }
}