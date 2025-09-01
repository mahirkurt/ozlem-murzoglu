import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FavoriteResource {
  resourceKey: string;
  categoryKey: string;
  title: string;
  description: string;
  route: string;
  addedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'resource_favorites';
  private favorites$ = new BehaviorSubject<FavoriteResource[]>([]);
  
  constructor() {
    this.loadFavorites();
  }

  /**
   * Get all favorites as observable
   */
  getFavorites(): Observable<FavoriteResource[]> {
    return this.favorites$.asObservable();
  }

  /**
   * Get current favorites value
   */
  getFavoritesValue(): FavoriteResource[] {
    return this.favorites$.value;
  }

  /**
   * Check if a resource is in favorites
   */
  isFavorite(resourceKey: string, categoryKey: string): boolean {
    return this.favorites$.value.some(
      fav => fav.resourceKey === resourceKey && fav.categoryKey === categoryKey
    );
  }

  /**
   * Add a resource to favorites
   */
  addFavorite(resource: Omit<FavoriteResource, 'addedAt'>): void {
    if (this.isFavorite(resource.resourceKey, resource.categoryKey)) {
      return; // Already in favorites
    }

    const newFavorite: FavoriteResource = {
      ...resource,
      addedAt: new Date()
    };

    const updatedFavorites = [...this.favorites$.value, newFavorite];
    this.updateFavorites(updatedFavorites);
  }

  /**
   * Remove a resource from favorites
   */
  removeFavorite(resourceKey: string, categoryKey: string): void {
    const updatedFavorites = this.favorites$.value.filter(
      fav => !(fav.resourceKey === resourceKey && fav.categoryKey === categoryKey)
    );
    this.updateFavorites(updatedFavorites);
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(resource: Omit<FavoriteResource, 'addedAt'>): boolean {
    if (this.isFavorite(resource.resourceKey, resource.categoryKey)) {
      this.removeFavorite(resource.resourceKey, resource.categoryKey);
      return false;
    } else {
      this.addFavorite(resource);
      return true;
    }
  }

  /**
   * Clear all favorites
   */
  clearFavorites(): void {
    this.updateFavorites([]);
  }

  /**
   * Get favorites count
   */
  getFavoritesCount(): number {
    return this.favorites$.value.length;
  }

  /**
   * Sort favorites by date (newest first)
   */
  getFavoritesSortedByDate(): FavoriteResource[] {
    return [...this.favorites$.value].sort(
      (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
    );
  }

  /**
   * Sort favorites by title (alphabetical)
   */
  getFavoritesSortedByTitle(): FavoriteResource[] {
    return [...this.favorites$.value].sort(
      (a, b) => a.title.localeCompare(b.title, 'tr')
    );
  }

  /**
   * Group favorites by category
   */
  getFavoritesGroupedByCategory(): Map<string, FavoriteResource[]> {
    const grouped = new Map<string, FavoriteResource[]>();
    
    this.favorites$.value.forEach(fav => {
      const category = fav.categoryKey;
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(fav);
    });
    
    return grouped;
  }

  /**
   * Export favorites as JSON
   */
  exportFavorites(): string {
    return JSON.stringify(this.favorites$.value, null, 2);
  }

  /**
   * Import favorites from JSON
   */
  importFavorites(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString);
      if (!Array.isArray(imported)) {
        throw new Error('Invalid format');
      }
      
      // Validate and convert dates
      const favorites = imported.map(item => ({
        ...item,
        addedAt: new Date(item.addedAt)
      }));
      
      this.updateFavorites(favorites);
      return true;
    } catch (error) {
      console.error('Failed to import favorites:', error);
      return false;
    }
  }

  /**
   * Load favorites from localStorage
   */
  private loadFavorites(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const favorites = JSON.parse(stored);
        // Convert date strings back to Date objects
        const parsedFavorites = favorites.map((fav: any) => ({
          ...fav,
          addedAt: new Date(fav.addedAt)
        }));
        this.favorites$.next(parsedFavorites);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
      this.favorites$.next([]);
    }
  }

  /**
   * Save favorites to localStorage
   */
  private saveFavorites(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites$.value));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }

  /**
   * Update favorites and save to storage
   */
  private updateFavorites(favorites: FavoriteResource[]): void {
    this.favorites$.next(favorites);
    this.saveFavorites();
  }
}