import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FavoritesService, FavoriteResource } from '../../services/favorites.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="favorites-page">
      <!-- Hero Section -->
      <div class="favorites-hero">
        <div class="container">
          <nav class="breadcrumb">
            <a routerLink="/" class="breadcrumb-link">
              <span class="material-icons">home</span>
              <span>{{ 'HOME.NAV_HOME' | translate }}</span>
            </a>
            <span class="material-icons separator">chevron_right</span>
            <a routerLink="/bilgi-merkezi" class="breadcrumb-link">
              <span>{{ 'RESOURCES.INFO_CENTER' | translate }}</span>
            </a>
            <span class="material-icons separator">chevron_right</span>
            <span class="current">{{ 'FAVORITES.PAGE_TITLE' | translate }}</span>
          </nav>

          <div class="hero-content">
            <h1 class="page-title">
              <span class="material-icons title-icon">favorite</span>
              {{ 'FAVORITES.PAGE_TITLE' | translate }}
            </h1>
            <p class="page-subtitle">
              {{ 'FAVORITES.PAGE_SUBTITLE' | translate }}
            </p>
            
            <div class="favorites-stats">
              <div class="stat-item">
                <span class="stat-number">{{ favoritesCount }}</span>
                <span class="stat-label">{{ 'FAVORITES.SAVED_RESOURCES' | translate }}</span>
              </div>
              <div class="stat-item" *ngIf="categoriesCount > 0">
                <span class="stat-number">{{ categoriesCount }}</span>
                <span class="stat-label">{{ 'FAVORITES.CATEGORIES' | translate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Favorites Content -->
      <div class="favorites-content">
        <div class="container">
          <!-- Toolbar -->
          <div class="favorites-toolbar" *ngIf="favorites.length > 0">
            <div class="sort-options">
              <label>{{ 'FAVORITES.SORT_BY' | translate }}:</label>
              <button 
                class="sort-btn"
                [class.active]="sortBy === 'date'"
                (click)="setSortBy('date')">
                <span class="material-icons">schedule</span>
                {{ 'FAVORITES.SORT_DATE' | translate }}
              </button>
              <button 
                class="sort-btn"
                [class.active]="sortBy === 'title'"
                (click)="setSortBy('title')">
                <span class="material-icons">sort_by_alpha</span>
                {{ 'FAVORITES.SORT_TITLE' | translate }}
              </button>
              <button 
                class="sort-btn"
                [class.active]="sortBy === 'category'"
                (click)="setSortBy('category')">
                <span class="material-icons">category</span>
                {{ 'FAVORITES.SORT_CATEGORY' | translate }}
              </button>
            </div>

            <div class="actions">
              <button class="action-btn" (click)="exportFavorites()">
                <span class="material-icons">download</span>
                {{ 'FAVORITES.EXPORT' | translate }}
              </button>
              <button class="action-btn danger" (click)="clearAllFavorites()">
                <span class="material-icons">delete_sweep</span>
                {{ 'FAVORITES.CLEAR_ALL' | translate }}
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="favorites.length === 0">
            <div class="empty-icon">
              <span class="material-icons">favorite_border</span>
            </div>
            <h2>{{ 'FAVORITES.EMPTY_TITLE' | translate }}</h2>
            <p>{{ 'FAVORITES.EMPTY_DESC' | translate }}</p>
            <a routerLink="/bilgi-merkezi" class="browse-btn">
              <span class="material-icons">explore</span>
              {{ 'FAVORITES.BROWSE_RESOURCES' | translate }}
            </a>
          </div>

          <!-- Favorites Grid -->
          <div class="favorites-grid" *ngIf="sortBy !== 'category' && favorites.length > 0">
            <div *ngFor="let favorite of sortedFavorites" class="favorite-card">
              <div class="card-header">
                <span class="category-badge">
                  {{ getCategoryLabel(favorite.categoryKey) | translate }}
                </span>
                <button 
                  class="remove-btn"
                  (click)="removeFavorite(favorite)"
                  [attr.aria-label]="'FAVORITES.REMOVE' | translate">
                  <span class="material-icons">close</span>
                </button>
              </div>
              
              <a [routerLink]="favorite.route" class="card-body">
                <h3 class="card-title">{{ favorite.title }}</h3>
                <p class="card-description">{{ favorite.description }}</p>
                
                <div class="card-footer">
                  <span class="added-date">
                    <span class="material-icons">schedule</span>
                    {{ formatDate(favorite.addedAt) }}
                  </span>
                  <span class="view-link">
                    {{ 'FAVORITES.VIEW_RESOURCE' | translate }}
                    <span class="material-icons">arrow_forward</span>
                  </span>
                </div>
              </a>
            </div>
          </div>

          <!-- Grouped by Category -->
          <div class="favorites-grouped" *ngIf="sortBy === 'category' && favorites.length > 0">
            <div *ngFor="let group of groupedFavorites" class="category-group">
              <h2 class="group-title">
                {{ getCategoryLabel(group.category) | translate }}
                <span class="count">({{ group.items.length }})</span>
              </h2>
              
              <div class="group-items">
                <div *ngFor="let favorite of group.items" class="favorite-item">
                  <a [routerLink]="favorite.route" class="item-link">
                    <span class="material-icons item-icon">description</span>
                    <div class="item-content">
                      <h4 class="item-title">{{ favorite.title }}</h4>
                      <p class="item-desc">{{ favorite.description }}</p>
                    </div>
                  </a>
                  <button 
                    class="remove-btn"
                    (click)="removeFavorite(favorite)"
                    [attr.aria-label]="'FAVORITES.REMOVE' | translate">
                    <span class="material-icons">close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: FavoriteResource[] = [];
  sortedFavorites: FavoriteResource[] = [];
  groupedFavorites: { category: string; items: FavoriteResource[] }[] = [];
  favoritesCount: number = 0;
  categoriesCount: number = 0;
  sortBy: 'date' | 'title' | 'category' = 'date';
  
  private destroy$ = new Subject<void>();

  constructor(
    private favoritesService: FavoritesService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.favoritesService.getFavorites()
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.favorites = favorites;
        this.favoritesCount = favorites.length;
        this.updateDisplay();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setSortBy(sortBy: 'date' | 'title' | 'category'): void {
    this.sortBy = sortBy;
    this.updateDisplay();
  }

  private updateDisplay(): void {
    switch (this.sortBy) {
      case 'date':
        this.sortedFavorites = this.favoritesService.getFavoritesSortedByDate();
        break;
      case 'title':
        this.sortedFavorites = this.favoritesService.getFavoritesSortedByTitle();
        break;
      case 'category':
        const grouped = this.favoritesService.getFavoritesGroupedByCategory();
        this.groupedFavorites = Array.from(grouped.entries()).map(([category, items]) => ({
          category,
          items: items.sort((a, b) => a.title.localeCompare(b.title, 'tr'))
        }));
        this.categoriesCount = this.groupedFavorites.length;
        break;
    }
  }

  removeFavorite(favorite: FavoriteResource): void {
    if (confirm(this.translate.instant('FAVORITES.CONFIRM_REMOVE'))) {
      this.favoritesService.removeFavorite(favorite.resourceKey, favorite.categoryKey);
    }
  }

  clearAllFavorites(): void {
    if (confirm(this.translate.instant('FAVORITES.CONFIRM_CLEAR_ALL'))) {
      this.favoritesService.clearFavorites();
    }
  }

  exportFavorites(): void {
    const json = this.favoritesService.exportFavorites();
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `favoriler-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return this.translate.instant('DATE.TODAY');
    if (days === 1) return this.translate.instant('DATE.YESTERDAY');
    if (days < 7) return this.translate.instant('DATE.DAYS_AGO', { count: days });
    if (days < 30) return this.translate.instant('DATE.WEEKS_AGO', { count: Math.floor(days / 7) });
    if (days < 365) return this.translate.instant('DATE.MONTHS_AGO', { count: Math.floor(days / 30) });
    return this.translate.instant('DATE.YEARS_AGO', { count: Math.floor(days / 365) });
  }

  getCategoryLabel(categoryKey: string): string {
    const categoryLabels: { [key: string]: string } = {
      'vaccines': 'RESOURCES.CATEGORY_VACCINES',
      'general': 'RESOURCES.CATEGORY_GENERAL',
      'diseases': 'RESOURCES.CATEGORY_DISEASES',
      'pregnancy': 'RESOURCES.CATEGORY_PREGNANCY',
      'development': 'RESOURCES.CATEGORY_DEVELOPMENT',
      'toys': 'RESOURCES.CATEGORY_TOYS',
      'media': 'RESOURCES.CATEGORY_MEDIA',
      'bright-futures-family': 'RESOURCES.CATEGORY_BRIGHT_FUTURES_FAMILY',
      'bright-futures-child': 'RESOURCES.CATEGORY_BRIGHT_FUTURES_CHILD'
    };
    return categoryLabels[categoryKey] || 'RESOURCES.CATEGORY_OTHER';
  }
}