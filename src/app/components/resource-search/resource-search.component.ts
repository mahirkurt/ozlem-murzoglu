import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ResourceSearchService, SearchResult } from '../../services/resource-search.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-resource-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  template: `
    <div class="resource-search">
      <div class="search-container">
        <div class="search-input-wrapper">
          <span class="material-icons search-icon">search</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            [placeholder]="'RESOURCES.SEARCH_PLACEHOLDER' | translate"
            class="search-input"
            [class.has-results]="searchResults.length > 0"
          />
          <button 
            *ngIf="searchQuery" 
            (click)="clearSearch()" 
            class="clear-btn"
            [attr.aria-label]="'RESOURCES.CLEAR_SEARCH' | translate">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="search-info" *ngIf="searchQuery && !isSearching">
          <span *ngIf="searchResults.length > 0">
            {{ 'RESOURCES.SEARCH_RESULTS_COUNT' | translate: {count: searchResults.length} }}
          </span>
          <span *ngIf="searchResults.length === 0 && searchQuery.length >= 2">
            {{ 'RESOURCES.NO_RESULTS' | translate }}
          </span>
        </div>

        <div class="search-loading" *ngIf="isSearching">
          <div class="spinner"></div>
          <span>{{ 'RESOURCES.SEARCHING' | translate }}</span>
        </div>
      </div>

      <div class="search-results" *ngIf="searchResults.length > 0 && !isSearching">
        <div class="results-list">
          <a
            *ngFor="let result of searchResults"
            [routerLink]="result.route"
            class="result-item"
            (click)="clearSearch()">
            
            <div class="result-header">
              <span class="result-category">
                {{ getCategoryLabel(result.categoryKey) | translate }}
              </span>
              <span class="result-score" *ngIf="showRelevanceScore">
                {{ result.relevanceScore }}
              </span>
            </div>
            
            <h3 class="result-title">{{ result.title }}</h3>
            
            <p class="result-snippet" [innerHTML]="result.matchedContent"></p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resource-search {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .search-container {
      position: relative;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 50px;
      padding: 12px 20px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .search-input-wrapper:focus-within {
      border-color: #7b61ff;
      box-shadow: 0 4px 12px rgba(123, 97, 255, 0.15);
    }

    .search-icon {
      color: #666;
      margin-right: 12px;
      font-size: 24px;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 16px;
      color: #333;
      background: transparent;
    }

    .search-input::placeholder {
      color: #999;
    }

    .clear-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      transition: color 0.2s;
    }

    .clear-btn:hover {
      color: #333;
    }

    .search-info {
      margin-top: 12px;
      padding: 0 20px;
      font-size: 14px;
      color: #666;
    }

    .search-loading {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
      padding: 0 20px;
      color: #666;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #e0e0e0;
      border-top-color: #7b61ff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .search-results {
      margin-top: 24px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .results-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .result-item {
      display: block;
      padding: 20px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .result-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #7b61ff;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .result-category {
      font-size: 12px;
      font-weight: 600;
      color: #7b61ff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .result-score {
      font-size: 10px;
      color: #999;
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .result-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }

    .result-snippet {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .result-snippet :deep(mark) {
      background: #fff3cd;
      color: #333;
      padding: 2px 4px;
      border-radius: 2px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .resource-search {
        padding: 16px;
      }

      .search-input-wrapper {
        padding: 10px 16px;
      }

      .result-item {
        padding: 16px;
      }

      .result-title {
        font-size: 16px;
      }
    }
  `]
})
export class ResourceSearchComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  isSearching: boolean = false;
  showRelevanceScore: boolean = false; // Set to true for debugging
  
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private searchService: ResourceSearchService) {}

  ngOnInit(): void {
    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });

    // Subscribe to search results
    this.searchService.getSearchResults()
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        this.searchResults = results;
      });

    // Subscribe to loading state
    this.searchService.getIsSearching()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isSearching => {
        this.isSearching = isSearching;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  private async performSearch(query: string): Promise<void> {
    await this.searchService.searchResources(query);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchService.clearSearch();
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