import { Component, Input, Output, EventEmitter, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  badge?: number;
  action?: () => void;
  children?: NavigationItem[];
}

type NavigationType = 'rail' | 'drawer' | 'bottom';

/**
 * MD3 Adaptive Navigation Component
 * Automatically switches between navigation patterns based on screen size:
 * - Bottom navigation on mobile (compact)
 * - Navigation rail on tablets (medium)
 * - Navigation drawer on desktop (expanded)
 */
@Component({
  selector: 'app-md3-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <!-- Navigation Rail (Tablets) -->
    <nav 
      *ngIf="navigationType() === 'rail'"
      class="nav-rail"
      [class.collapsed]="isCollapsed()"
      role="navigation"
      attr.aria-label="Main navigation">
      
      <!-- Menu Toggle -->
      <button 
        class="md3-icon-button"
        class="menu-toggle"
        (click)="toggleCollapse()"
        attr.aria-label="Toggle navigation"
        attr.aria-expanded="{{ !isCollapsed() }}">
        <span class="material-icons-rounded">menu</span>
      </button>
      
      <!-- Logo/Brand -->
      <div class="rail-header">
        <img 
          [src]="logoSrc" 
          alt="{{ brandName }} logo"
          class="rail-logo"
          *ngIf="logoSrc">
        <span class="rail-brand" *ngIf="!isCollapsed()">{{ brandName }}</span>
      </div>
      
      <!-- Navigation Items -->
      <div class="rail-items">
        <button
          *ngFor="let item of navigationItems; trackBy: trackByFn"
          class="rail-item"
          [class.active]="isActive(item)"
          [routerLink]="item.route"
          (click)="handleItemClick(item)"
                    [title]="isCollapsed() ? item.label : ''"
          >
          
          <span class="material-icons-rounded" 
            [attr.data-badge]="item.badge"
                                    >
            {{ item.icon }}
          </span>
          
          <span class="rail-label" *ngIf="!isCollapsed()">
            {{ item.label }}
          </span>
        </button>
      </div>
      
      <!-- FAB (Optional) -->
      <button 
        mat-fab
        class="rail-fab"
        *ngIf="fabIcon"
        (click)="onFabClick.emit()"
        [attr.aria-label]="fabLabel">
        <span class="material-icons-rounded">{{ fabIcon }}</span>
      </button>
    </nav>
    
    <!-- Navigation Drawer (Desktop) -->
    <nav 
      *ngIf="navigationType() === 'drawer'"
      class="nav-drawer"
      [class.expanded]="!isCollapsed()"
      role="navigation"
      attr.aria-label="Main navigation">
      
      <!-- Drawer Header -->
      <div class="drawer-header">
        <img 
          [src]="logoSrc" 
          alt="{{ brandName }} logo"
          class="drawer-logo"
          *ngIf="logoSrc">
        <div class="drawer-brand">
          <h2>{{ brandName }}</h2>
          <p class="drawer-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
      </div>
      
      <!-- Navigation Sections -->
      <div class="drawer-content">
        <div 
          *ngFor="let section of navigationSections"
          class="drawer-section">
          
          <h3 class="section-title" *ngIf="section.title">
            {{ section.title }}
          </h3>
          
          <button
            *ngFor="let item of section.items; trackBy: trackByFn"
            class="drawer-item"
            [class.active]="isActive(item)"
            [routerLink]="item.route"
            (click)="handleItemClick(item)"
            matRipple>
            
            <span class="material-icons-rounded" 
              class="drawer-icon"
              [attr.data-badge]="item.badge"
                            matBadgeColor="accent">
              {{ item.icon }}
            </span>
            
            <span class="drawer-label">{{ item.label }}</span>
            
            <span class="material-icons-rounded" class="drawer-trailing" *ngIf="item.children">
              keyboard_arrow_right
            </span>
          </button>
          
          <!-- Nested Items -->
          <div 
            *ngIf="expandedItems.has(item.id) && item.children"
            class="drawer-nested">
            <button
              *ngFor="let child of item.children"
              class="drawer-item nested"
              [class.active]="isActive(child)"
              [routerLink]="child.route"
              (click)="handleItemClick(child)"
              matRipple>
              <span class="drawer-label">{{ child.label }}</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Drawer Footer -->
      <div class="drawer-footer" *ngIf="showSettings">
        <button 
          class="md3-icon-button"
          (click)="onSettingsClick.emit()"
          title="Settings">
          <span class="material-icons-rounded">settings</span>
        </button>
        
        <button 
          class="md3-icon-button"
          (click)="onProfileClick.emit()"
          title="Profile">
          <span class="material-icons-rounded">account_circle</span>
        </button>
      </div>
    </nav>
    
    <!-- Bottom Navigation (Mobile) -->
    <nav 
      *ngIf="navigationType() === 'bottom'"
      class="nav-bottom"
      role="navigation"
      attr.aria-label="Main navigation">
      
      <button
        *ngFor="let item of bottomNavigationItems; trackBy: trackByFn"
        class="bottom-item"
        [class.active]="isActive(item)"
        [routerLink]="item.route"
        (click)="handleItemClick(item)"
        matRipple>
        
        <span class="material-icons-rounded" 
          class="bottom-icon"
          [attr.data-badge]="item.badge"
                              >
          {{ item.icon }}
        </span>
        
        <span class="bottom-label">{{ item.label }}</span>
      </button>
    </nav>
    
    <!-- Scrim for drawer -->
    <div 
      class="nav-scrim"
      *ngIf="navigationType() === 'drawer' && !isCollapsed() && showScrim"
      (click)="toggleCollapse()">
    </div>
  `,
  styleUrls: ['./md3-navigation.component.scss']
})
export class Md3NavigationComponent {
  @Input() navigationItems: NavigationItem[] = [];
  @Input() bottomNavigationItems: NavigationItem[] = [];
  @Input() navigationSections: { title?: string; items: NavigationItem[] }[] = [];
  @Input() brandName = 'App Name';
  @Input() subtitle = '';
  @Input() logoSrc = '';
  @Input() fabIcon = '';
  @Input() fabLabel = 'Create';
  @Input() showSettings = true;
  @Input() showScrim = false;
  @Input() activeItemId = '';
  
  @Output() onItemClick = new EventEmitter<NavigationItem>();
  @Output() onFabClick = new EventEmitter<void>();
  @Output() onSettingsClick = new EventEmitter<void>();
  @Output() onProfileClick = new EventEmitter<void>();
  
  navigationType = signal<NavigationType>('drawer');
  isCollapsed = signal(false);
  expandedItems = new Set<string>();
  
  private breakpoints = {
    compact: 600,
    medium: 840
  };
  
  constructor() {
    this.updateNavigationType();
  }
  
  @HostListener('window:resize')
  onResize() {
    this.updateNavigationType();
  }
  
  private updateNavigationType() {
    const width = window.innerWidth;
    
    if (width < this.breakpoints.compact) {
      this.navigationType.set('bottom');
      this.isCollapsed.set(false); // Bottom nav is always expanded
    } else if (width < this.breakpoints.medium) {
      this.navigationType.set('rail');
      this.isCollapsed.set(true); // Rail starts collapsed on tablets
    } else {
      this.navigationType.set('drawer');
      this.isCollapsed.set(false); // Drawer starts expanded on desktop
    }
  }
  
  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }
  
  handleItemClick(item: NavigationItem) {
    if (item.children) {
      // Toggle expansion for items with children
      if (this.expandedItems.has(item.id)) {
        this.expandedItems.delete(item.id);
      } else {
        this.expandedItems.add(item.id);
      }
    }
    
    if (item.action) {
      item.action();
    }
    
    this.onItemClick.emit(item);
    
    // Auto-collapse on mobile after selection
    if (this.navigationType() === 'bottom') {
      this.isCollapsed.set(true);
    }
  }
  
  isActive(item: NavigationItem): boolean {
    return item.id === this.activeItemId;
  }
  
  trackByFn(index: number, item: NavigationItem): string {
    return item.id;
  }
}