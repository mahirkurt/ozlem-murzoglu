import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SearchResult {
  resourceKey: string;
  categoryKey: string;
  title: string;
  description: string;
  matchedContent: string;
  relevanceScore: number;
  route: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResourceSearchService {
  private searchResults$ = new BehaviorSubject<SearchResult[]>([]);
  private isSearching$ = new BehaviorSubject<boolean>(false);
  
  constructor(private translate: TranslateService) {}

  getSearchResults(): Observable<SearchResult[]> {
    return this.searchResults$.asObservable();
  }

  getIsSearching(): Observable<boolean> {
    return this.isSearching$.asObservable();
  }

  async searchResources(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      this.searchResults$.next([]);
      return [];
    }

    this.isSearching$.next(true);
    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase().trim();
    const lang = this.translate.currentLang || 'tr';

    try {
      // Get all resource translations
      const resources = await this.translate.get('RESOURCES').toPromise();
      
      // Define all categories and their routes
      const categories = [
        { key: 'VACCINES', route: '/bilgi-merkezi/asilar', categoryKey: 'vaccines' },
        { key: 'GENERAL', route: '/bilgi-merkezi/genel-bilgiler', categoryKey: 'general' },
        { key: 'DISEASES', route: '/bilgi-merkezi/hastaliklar', categoryKey: 'diseases' },
        { key: 'PREGNANCY', route: '/bilgi-merkezi/gebelik-donemi', categoryKey: 'pregnancy' },
        { key: 'DEVELOPMENT', route: '/bilgi-merkezi/gelisim-rehberleri', categoryKey: 'development' },
        { key: 'TOYS', route: '/bilgi-merkezi/oyuncaklar', categoryKey: 'toys' },
        { key: 'MEDIA', route: '/bilgi-merkezi/aile-medya-plani', categoryKey: 'media' },
        { key: 'BRIGHT_FUTURES_FAMILY', route: '/bilgi-merkezi/bright-futures-aile', categoryKey: 'bright-futures-family' },
        { key: 'BRIGHT_FUTURES_CHILD', route: '/bilgi-merkezi/bright-futures-cocuk', categoryKey: 'bright-futures-child' }
      ];

      // Search through each category
      for (const category of categories) {
        const categoryResources = resources[category.key];
        if (!categoryResources) continue;

        // Search through each resource in the category
        for (const [resourceKey, resource] of Object.entries(categoryResources)) {
          if (typeof resource !== 'object' || !resource) continue;
          
          const resourceData = resource as any;
          
          // Calculate relevance score based on where the match is found
          let relevanceScore = 0;
          let matchedContent = '';
          
          // Check title (highest relevance)
          if (resourceData.title && resourceData.title.toLowerCase().includes(searchTerm)) {
            relevanceScore += 10;
            matchedContent = this.highlightMatch(resourceData.title, searchTerm);
          }
          
          // Check description (medium relevance)
          if (resourceData.description && resourceData.description.toLowerCase().includes(searchTerm)) {
            relevanceScore += 5;
            if (!matchedContent) {
              matchedContent = this.highlightMatch(resourceData.description, searchTerm);
            }
          }
          
          // Check content (lower relevance)
          if (resourceData.content && resourceData.content.toLowerCase().includes(searchTerm)) {
            relevanceScore += 2;
            if (!matchedContent) {
              const contentSnippet = this.extractSnippet(resourceData.content, searchTerm);
              matchedContent = this.highlightMatch(contentSnippet, searchTerm);
            }
          }
          
          // Add to results if there's a match
          if (relevanceScore > 0) {
            const routeKey = resourceKey.toLowerCase().replace(/_/g, '-');
            results.push({
              resourceKey,
              categoryKey: category.categoryKey,
              title: resourceData.title || '',
              description: resourceData.description || '',
              matchedContent,
              relevanceScore,
              route: `${category.route}/${routeKey}`
            });
          }
        }
      }

      // Sort by relevance score
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      this.searchResults$.next(results);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults$.next([]);
      return [];
    } finally {
      this.isSearching$.next(false);
    }
  }

  private extractSnippet(content: string, searchTerm: string): string {
    const index = content.toLowerCase().indexOf(searchTerm);
    if (index === -1) return '';
    
    const snippetLength = 150;
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + searchTerm.length + 100);
    
    let snippet = content.substring(start, end);
    
    // Add ellipsis if needed
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return snippet;
  }

  private highlightMatch(text: string, searchTerm: string): string {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  clearSearch(): void {
    this.searchResults$.next([]);
  }
}