import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

export interface CmsResource {
  id?: number;
  resourceKey: string;
  categoryKey: string;
  title: string;
  description: string;
  content: string;
  contentType: 'html' | 'markdown';
  metadata?: {
    author?: string;
    publishDate?: string;
    tags?: string[];
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface CmsSearchResult extends CmsResource {
  relevanceScore: number;
  matchedContent: string;
}

export interface CmsCategory {
  key: string;
  count: number;
}

export interface CmsResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  // Firebase Functions endpoints
  private readonly functionsUrl = environment.production 
    ? 'https://europe-west1-ozlem-murzoglu.cloudfunctions.net'
    : 'http://localhost:5001/ozlem-murzoglu/europe-west1';

  // Cache for resources
  private cache = new Map<string, Observable<any>>();
  private cacheTimeout = 5 * 60 * 1000; // 5 dakika

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  /**
   * Tüm resource'ları getir
   */
  getResources(category?: string): Observable<CmsResource[]> {
    const locale = this.translate.currentLang || 'tr';
    const cacheKey = `resources_${locale}_${category || 'all'}`;
    
    // Cache kontrolü
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const params = new HttpParams()
      .set('locale', locale)
      .set('category', category || '');
    
    const request$ = this.http.get<CmsResponse<CmsResource[]>>(
      `${this.functionsUrl}/getResources`,
      { params }
    ).pipe(
      map(response => response.data),
      catchError(this.handleError),
      shareReplay(1),
      tap(() => this.scheduleCacheCleanup(cacheKey))
    );
    
    this.cache.set(cacheKey, request$);
    return request$;
  }

  /**
   * Tek bir resource getir
   */
  getResource(resourceKey: string, categoryKey: string): Observable<CmsResource | null> {
    const locale = this.translate.currentLang || 'tr';
    const cacheKey = `resource_${locale}_${categoryKey}_${resourceKey}`;
    
    // Cache kontrolü
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const params = new HttpParams()
      .set('resourceKey', resourceKey)
      .set('categoryKey', categoryKey)
      .set('locale', locale);
    
    const request$ = this.http.get<CmsResponse<CmsResource>>(
      `${this.functionsUrl}/getResource`,
      { params }
    ).pipe(
      map(response => response.data),
      catchError(error => {
        if (error.status === 404) {
          return of(null);
        }
        return this.handleError(error);
      }),
      shareReplay(1),
      tap(() => this.scheduleCacheCleanup(cacheKey))
    );
    
    this.cache.set(cacheKey, request$);
    return request$;
  }

  /**
   * Resource'larda arama yap
   */
  searchResources(query: string): Observable<CmsSearchResult[]> {
    if (!query || query.trim().length < 2) {
      return of([]);
    }
    
    const locale = this.translate.currentLang || 'tr';
    const cacheKey = `search_${locale}_${query.toLowerCase()}`;
    
    // Arama sonuçları için kısa cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const params = new HttpParams()
      .set('q', query)
      .set('locale', locale);
    
    const request$ = this.http.get<CmsResponse<CmsSearchResult[]>>(
      `${this.functionsUrl}/searchResources`,
      { params }
    ).pipe(
      map(response => response.data),
      catchError(this.handleError),
      shareReplay(1),
      tap(() => this.scheduleCacheCleanup(cacheKey, 60000)) // 1 dakika cache
    );
    
    this.cache.set(cacheKey, request$);
    return request$;
  }

  /**
   * Kategorileri getir
   */
  getCategories(): Observable<CmsCategory[]> {
    const locale = this.translate.currentLang || 'tr';
    const cacheKey = `categories_${locale}`;
    
    // Cache kontrolü
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const params = new HttpParams()
      .set('locale', locale);
    
    const request$ = this.http.get<CmsResponse<CmsCategory[]>>(
      `${this.functionsUrl}/getCategories`,
      { params }
    ).pipe(
      map(response => response.data),
      catchError(this.handleError),
      shareReplay(1),
      tap(() => this.scheduleCacheCleanup(cacheKey))
    );
    
    this.cache.set(cacheKey, request$);
    return request$;
  }

  /**
   * Cache'i temizle
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Belirli bir cache key'ini temizle
   */
  clearCacheKey(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Pattern'e göre cache temizle
   */
  clearCachePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];
    
    this.cache.forEach((value, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Cache temizleme zamanlaması
   */
  private scheduleCacheCleanup(key: string, timeout: number = this.cacheTimeout): void {
    setTimeout(() => {
      this.cache.delete(key);
    }, timeout);
  }

  /**
   * Hata yönetimi
   */
  private handleError(error: any): Observable<never> {
    console.error('CMS Service Error:', error);
    
    let errorMessage = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    
    if (error.error?.error) {
      errorMessage = error.error.error;
    } else if (error.status === 0) {
      errorMessage = 'Sunucuya bağlanılamadı.';
    } else if (error.status === 404) {
      errorMessage = 'Kaynak bulunamadı.';
    } else if (error.status === 500) {
      errorMessage = 'Sunucu hatası.';
    }
    
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Fallback: JSON dosyalarından yükle
   * CMS erişilemezse local JSON'dan yükle
   */
  async loadFromLocalJson(categoryKey: string, resourceKey: string): Promise<any> {
    try {
      const locale = this.translate.currentLang || 'tr';
      const translations = await this.translate.get(`RESOURCES.${categoryKey.toUpperCase()}.${resourceKey.toUpperCase()}`).toPromise();
      
      return {
        resourceKey,
        categoryKey,
        title: translations.title,
        description: translations.description,
        content: translations.content,
        contentType: translations.contentType || 'html',
        locale
      };
    } catch (error) {
      console.error('Failed to load from local JSON:', error);
      return null;
    }
  }
}