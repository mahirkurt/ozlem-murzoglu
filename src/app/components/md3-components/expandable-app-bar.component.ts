import { Component, Input, Output, EventEmitter, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

/**
 * MD3 Expandable Top App Bar
 * Sayfa kaydırıldığında küçülen large/medium app bar
 */
@Component({
  selector: 'app-expandable-app-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="'expandable-app-bar ' + variant() + ' ' + (isCollapsed() ? 'collapsed' : 'expanded')"
      [@toolbarAnimation]="isCollapsed() ? 'collapsed' : 'expanded'"
    >
      <!-- Leading Section -->
      <div class="leading-section">
        <button class="md3-icon-button" (click)="navigationClick.emit()" *ngIf="showNavigation">
          <span class="material-icons">{{ navigationIcon }}</span>
        </button>
      </div>

      <!-- Title Section -->
      <div class="title-section">
        <h1 class="app-bar-title" [@titleAnimation]="isCollapsed() ? 'collapsed' : 'expanded'">
          {{ title }}
        </h1>
        <p
          class="app-bar-subtitle"
          *ngIf="subtitle && variant() === 'large'"
          [@subtitleAnimation]="isCollapsed() ? 'collapsed' : 'expanded'"
        >
          {{ subtitle }}
        </p>
      </div>

      <!-- Trailing Section -->
      <div class="trailing-section">
        <ng-content select="[trailing]"></ng-content>
        <button
          class="md3-icon-button"
          *ngFor="let action of trailingActions"
          (click)="actionClick.emit(action)"
        >
          <span class="material-icons">{{ action.icon }}</span>
        </button>
      </div>
    </div>

    <!-- Extended Content (for large variant) -->
    <div
      class="extended-content"
      *ngIf="variant() === 'large' && !isCollapsed()"
      [@extendedAnimation]="isCollapsed() ? 'collapsed' : 'expanded'"
    >
      <ng-content select="[extended]"></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: sticky;
        top: 0;
        z-index: 1000;
        background: var(--md-sys-color-surface);
        transition: all 300ms cubic-bezier(0.2, 0, 0, 1);
      }

      .expandable-app-bar {
        padding: 0 16px;
        display: flex;
        align-items: center;
        gap: var(--md-sys-spacing-4);
        transition: all 300ms cubic-bezier(0.2, 0, 0, 1);

        &.small {
          height: 64px;

          &.collapsed {
            height: 56px;
          }
        }

        &.medium {
          height: 112px;

          &.collapsed {
            height: 64px;
          }

          .title-section {
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
          }
        }

        &.large {
          height: 152px;
          padding-bottom: 28px;
          align-items: flex-end;

          &.collapsed {
            height: 64px;
            padding-bottom: 0;
            align-items: center;
          }

          .title-section {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-end;
          }
        }
      }

      .leading-section {
        display: flex;
        align-items: center;
      }

      .title-section {
        flex: 1;
        display: flex;
        overflow: hidden;
      }

      .app-bar-title {
        margin: 0;
        font-family: var(--md-sys-typescale-font-brand);
        transition: all 300ms cubic-bezier(0.2, 0, 0, 1);

        .small & {
          font-size: 20px;
          font-weight: 500;
        }

        .medium & {
          font-size: 24px;
          font-weight: 500;

          .collapsed & {
            font-size: 20px;
          }
        }

        .large & {
          font-size: 36px;
          font-weight: 400;
          line-height: 1.2;

          .collapsed & {
            font-size: 20px;
            font-weight: 500;
          }
        }
      }

      .app-bar-subtitle {
        margin: var(--md-sys-spacing-1) 0 0 0;
        font-family: var(--md-sys-typescale-font-plain);
        font-size: 14px;
        color: var(--md-sys-color-on-surface-variant);
        opacity: 1;
        transition: all 200ms cubic-bezier(0.2, 0, 0, 1);

        .collapsed & {
          opacity: 0;
          height: 0;
        }
      }

      .trailing-section {
        display: flex;
        align-items: center;
        gap: var(--md-sys-spacing-2);
      }

      .extended-content {
        padding: var(--md-sys-spacing-4) var(--md-sys-spacing-6);
        background: var(--md-sys-color-surface);
        border-top: 1px solid var(--md-sys-color-outline-variant);
      }

      // Elevation
      :host {
        box-shadow: 0 1px 2px 0 rgba(var(--md-sys-color-shadow), 0.15);

        &.scrolled {
          box-shadow: 0 2px 4px 0 rgba(var(--md-sys-color-shadow), 0.2);
        }
      }

      // Dark mode support
      :host-context(.dark-mode) {
        .expandable-app-bar {
          background: var(--md-sys-color-surface-container-high);
        }

        .extended-content {
          background: var(--md-sys-color-surface-container);
        }
      }
    `,
  ],
  animations: [
    trigger('toolbarAnimation', [
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      state(
        'collapsed',
        style({
          height: '64px',
        })
      ),
      transition('expanded <=> collapsed', [animate('300ms cubic-bezier(0.2, 0, 0, 1)')]),
    ]),
    trigger('titleAnimation', [
      state(
        'expanded',
        style({
          fontSize: '*',
          fontWeight: '*',
        })
      ),
      state(
        'collapsed',
        style({
          fontSize: '20px',
          fontWeight: '500',
        })
      ),
      transition('expanded <=> collapsed', [animate('300ms cubic-bezier(0.2, 0, 0, 1)')]),
    ]),
    trigger('subtitleAnimation', [
      state(
        'expanded',
        style({
          opacity: 1,
          height: '*',
        })
      ),
      state(
        'collapsed',
        style({
          opacity: 0,
          height: 0,
        })
      ),
      transition('expanded <=> collapsed', [animate('200ms cubic-bezier(0.2, 0, 0, 1)')]),
    ]),
    trigger('extendedAnimation', [
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      state(
        'collapsed',
        style({
          height: 0,
          opacity: 0,
        })
      ),
      transition('expanded <=> collapsed', [animate('250ms cubic-bezier(0.2, 0, 0, 1)')]),
    ]),
  ],
})
export class ExpandableAppBarComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() showNavigation = true;
  @Input() navigationIcon = 'menu';
  @Input() trailingActions: Array<{ icon: string; label?: string }> = [];
  @Input() collapseOnScroll = true;
  @Input() scrollThreshold = 100;

  @Output() navigationClick = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<{ icon: string; label?: string }>();

  variant = signal<'small' | 'medium' | 'large'>('medium');
  isCollapsed = signal(false);

  private lastScrollPosition = 0;

  @Input()
  set type(value: 'small' | 'medium' | 'large') {
    this.variant.set(value);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.collapseOnScroll) return;

    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Collapse when scrolled past threshold
    if (currentScrollPosition > this.scrollThreshold) {
      this.isCollapsed.set(true);
    } else {
      this.isCollapsed.set(false);
    }

    // Optional: Hide on scroll down, show on scroll up
    // if (currentScrollPosition > this.lastScrollPosition && currentScrollPosition > this.scrollThreshold) {
    //   this.isCollapsed.set(true);
    // } else if (currentScrollPosition < this.lastScrollPosition) {
    //   this.isCollapsed.set(false);
    // }

    this.lastScrollPosition = currentScrollPosition;
  }
}
