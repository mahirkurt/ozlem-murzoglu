import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FavoritesService } from '../../services/favorites.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <button 
      class="favorite-btn"
      [class.is-favorite]="isFavorite"
      (click)="toggleFavorite()"
      [attr.aria-label]="(isFavorite ? 'FAVORITES.REMOVE' : 'FAVORITES.ADD') | translate"
      [attr.title]="(isFavorite ? 'FAVORITES.REMOVE' : 'FAVORITES.ADD') | translate">
      <span class="material-icons">
        {{ isFavorite ? 'favorite' : 'favorite_border' }}
      </span>
      <span class="btn-text" *ngIf="showText">
        {{ (isFavorite ? 'FAVORITES.REMOVE' : 'FAVORITES.ADD') | translate }}
      </span>
    </button>
  `,
  styles: [`
    .favorite-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
      color: #666;
    }

    .favorite-btn:hover {
      border-color: #ff6b6b;
      background: #fff5f5;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.15);
    }

    .favorite-btn.is-favorite {
      border-color: #ff6b6b;
      background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
      color: white;
    }

    .favorite-btn.is-favorite:hover {
      background: linear-gradient(135deg, #ff5252 0%, #ff6b6b 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
    }

    .favorite-btn .material-icons {
      font-size: 20px;
      transition: transform 0.3s ease;
    }

    .favorite-btn:hover .material-icons {
      transform: scale(1.2);
    }

    .favorite-btn.is-favorite .material-icons {
      animation: heartbeat 0.6s ease;
    }

    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.3); }
      50% { transform: scale(1.1); }
      75% { transform: scale(1.2); }
    }

    .btn-text {
      display: none;
    }

    @media (min-width: 768px) {
      .btn-text {
        display: inline;
      }
    }

    /* Compact mode without text */
    .favorite-btn:not(.show-text) {
      padding: 8px;
      border-radius: 50%;
      min-width: 40px;
      min-height: 40px;
      justify-content: center;
    }

    .favorite-btn:not(.show-text) .btn-text {
      display: none !important;
    }
  `]
})
export class FavoriteButtonComponent implements OnInit, OnDestroy {
  @Input() resourceKey!: string;
  @Input() categoryKey!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() route!: string;
  @Input() showText: boolean = false;
  
  isFavorite: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    // Check initial favorite status
    this.isFavorite = this.favoritesService.isFavorite(this.resourceKey, this.categoryKey);
    
    // Subscribe to favorites changes
    this.favoritesService.getFavorites()
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.isFavorite = favorites.some(
          fav => fav.resourceKey === this.resourceKey && fav.categoryKey === this.categoryKey
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFavorite(): void {
    const wasFavorite = this.isFavorite;
    
    this.favoritesService.toggleFavorite({
      resourceKey: this.resourceKey,
      categoryKey: this.categoryKey,
      title: this.title,
      description: this.description,
      route: this.route
    });

    // Animate the icon
    const button = document.activeElement as HTMLElement;
    if (button) {
      button.blur(); // Remove focus after click
    }

    // Show notification (optional)
    this.showNotification(!wasFavorite);
  }

  private showNotification(added: boolean): void {
    // You can implement a toast notification here
    // Notification: added ? 'Added to favorites' : 'Removed from favorites'
  }
}