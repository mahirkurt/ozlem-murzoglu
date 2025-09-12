import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { animate, style, transition, trigger } from '@angular/animations';

export interface NavigationRailItem {
  id: string;
  icon: string;
  label: string;
  badge?: number | string;
  disabled?: boolean;
}

/**
 * MD3 Navigation Rail Component
 * Tablet ve masaüstü için dikey navigasyon
 */
@Component({
  selector: 'app-navigation-rail',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatBadgeModule, MatTooltipModule],
  template: `
    <nav class="navigation-rail" [class.expanded]="isExpanded()">
      <!-- FAB (Optional) -->
      <div class="rail-fab" *ngIf="showFab">
        <button mat-fab [color]="fabColor" (click)="fabClick.emit()">
          <mat-icon>{{ fabIcon }}</mat-icon>
        </button>
      </div>

      <!-- Menu Button (Optional) -->
      <div class="rail-menu" *ngIf="showMenu">
        <button mat-icon-button (click)="toggleExpanded()">
          <mat-icon>menu</mat-icon>
        </button>
      </div>

      <!-- Navigation Items -->
      <div class="rail-items">
        <button
          *ngFor="let item of items"
          class="rail-item"
          [class.active]="item.id === activeItemId()"
          [disabled]="item.disabled"
          [matTooltip]="!isExpanded() ? item.label : ''"
          matTooltipPosition="right"
          (click)="selectItem(item)"
          [@itemAnimation]
        >
          <div class="item-indicator" [@indicatorAnimation]></div>

          <mat-icon
            [matBadge]="item.badge"
            [matBadgeHidden]="!item.badge"
            matBadgeSize="small"
            matBadgeColor="error"
            class="item-icon"
          >
            {{ item.icon }}
          </mat-icon>

          <span class="item-label" [@labelAnimation]>
            {{ item.label }}
          </span>
        </button>
      </div>

      <!-- Bottom Actions (Optional) -->
      <div class="rail-bottom" *ngIf="bottomItems.length > 0">
        <button
          *ngFor="let item of bottomItems"
          class="rail-item bottom-item"
          [disabled]="item.disabled"
          [matTooltip]="!isExpanded() ? item.label : ''"
          matTooltipPosition="right"
          (click)="bottomItemClick.emit(item)"
        >
          <mat-icon class="item-icon">{{ item.icon }}</mat-icon>

          <span class="item-label" *ngIf="isExpanded()">
            {{ item.label }}
          </span>
        </button>
      </div>
    </nav>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .navigation-rail {
        width: 80px;
        height: 100%;
        background: var(--md-sys-color-surface);
        border-right: 1px solid var(--md-sys-color-outline-variant);
        display: flex;
        flex-direction: column;
        padding: 12px;
        transition: width 300ms cubic-bezier(0.2, 0, 0, 1);

        &.expanded {
          width: 256px;

          .rail-item {
            justify-content: flex-start;
            padding: 0 24px;
          }

          .item-label {
            opacity: 1;
            width: auto;
            margin-left: 12px;
          }
        }
      }

      .rail-fab {
        margin-bottom: 12px;
        display: flex;
        justify-content: center;

        .expanded & {
          justify-content: flex-start;
          padding-left: 12px;
        }
      }

      .rail-menu {
        margin-bottom: 8px;
        display: flex;
        justify-content: center;

        .expanded & {
          justify-content: flex-start;
          padding-left: 16px;
        }
      }

      .rail-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;

        &::-webkit-scrollbar {
          width: 4px;
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background: var(--md-sys-color-outline-variant);
          border-radius: 2px;
        }
      }

      .rail-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 56px;
        width: 100%;
        padding: 0;
        border: none;
        background: transparent;
        color: var(--md-sys-color-on-surface-variant);
        border-radius: var(--md-sys-shape-corner-full);
        cursor: pointer;
        transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        font-weight: 500;
        overflow: hidden;

        &:hover:not(:disabled) {
          background: rgba(var(--md-sys-color-on-surface-rgb), 0.08);
        }

        &:focus-visible {
          outline: 2px solid var(--md-sys-color-primary);
          outline-offset: 2px;
        }

        &:active:not(:disabled) {
          transform: scale(0.95);
        }

        &:disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }

        &.active {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);

          .item-indicator {
            opacity: 1;
            width: 56px;
            height: 32px;
          }

          .item-icon {
            color: var(--md-sys-color-on-secondary-container);
          }
        }
      }

      .item-indicator {
        position: absolute;
        background: var(--md-sys-color-secondary-container);
        border-radius: var(--md-sys-shape-corner-full);
        opacity: 0;
        width: 0;
        height: 0;
        transition: all 300ms cubic-bezier(0.2, 0, 0, 1);
        z-index: 0;
      }

      .item-icon {
        position: relative;
        z-index: 1;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .item-label {
        opacity: 0;
        width: 0;
        overflow: hidden;
        white-space: nowrap;
        transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
        position: relative;
        z-index: 1;
      }

      .rail-bottom {
        margin-top: auto;
        padding-top: 12px;
        border-top: 1px solid var(--md-sys-color-outline-variant);
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .bottom-item {
        justify-content: center !important;

        .expanded & {
          justify-content: flex-start !important;
        }
      }

      // Responsive
      @media (max-width: 768px) {
        .navigation-rail {
          width: 56px;
          padding: 8px;

          &.expanded {
            width: 200px;
          }
        }

        .rail-item {
          height: 48px;
        }
      }

      // Dark mode
      :host-context(.dark-mode) {
        .navigation-rail {
          background: var(--md-sys-color-surface-container);
          border-right-color: var(--md-sys-color-outline);
        }
      }
    `,
  ],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate(
          '300ms cubic-bezier(0.2, 0, 0, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('indicatorAnimation', [
      transition(':enter', [
        style({ opacity: 0, width: 0, height: 0 }),
        animate('300ms cubic-bezier(0.2, 0, 0, 1)'),
      ]),
    ]),
    trigger('labelAnimation', [
      transition(':enter', [
        style({ opacity: 0, width: 0 }),
        animate('200ms 100ms cubic-bezier(0.2, 0, 0, 1)'),
      ]),
    ]),
  ],
})
export class NavigationRailComponent {
  @Input() items: NavigationRailItem[] = [];
  @Input() bottomItems: NavigationRailItem[] = [];
  @Input() showFab = false;
  @Input() fabIcon = 'add';
  @Input() fabColor: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() showMenu = false;
  @Input() expandable = true;

  @Output() itemSelected = new EventEmitter<NavigationRailItem>();
  @Output() fabClick = new EventEmitter<void>();
  @Output() bottomItemClick = new EventEmitter<NavigationRailItem>();

  activeItemId = signal<string | null>(null);
  isExpanded = signal(false);

  @Input()
  set activeItem(id: string | null) {
    this.activeItemId.set(id);
  }

  selectItem(item: NavigationRailItem) {
    if (item.disabled) return;

    this.activeItemId.set(item.id);
    this.itemSelected.emit(item);
  }

  toggleExpanded() {
    if (this.expandable) {
      this.isExpanded.update((v) => !v);
    }
  }
}
