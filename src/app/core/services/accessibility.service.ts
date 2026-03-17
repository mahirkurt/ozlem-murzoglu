import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

/**
 * Enhanced Accessibility Service
 * Provides comprehensive A11y features including ARIA management,
 * screen reader support, and keyboard navigation
 */
@Injectable({
  providedIn: 'root',
})
export class AccessibilityService {
  private document = inject(DOCUMENT);
  private router = inject(Router);
  private translate = inject(TranslateService);

  // Accessibility state
  private screenReaderActive = signal(false);
  private keyboardNavigationActive = signal(false);
  private highContrastMode = signal(false);
  private reducedMotion = signal(false);
  private fontSize = signal<'normal' | 'large' | 'extra-large'>('normal');

  private pageTitleKeyMap: Record<string, string> = {
    '/': 'HEADER.NAV_HOME',
    '/hizmetlerimiz': 'HEADER.NAV_SERVICES',
    '/hakkimizda': 'HEADER.NAV_ABOUT',
    '/iletisim': 'HEADER.NAV_CONTACT',
    '/kaynaklar': 'HEADER.NAV_INFO_CENTER',
    '/randevu': 'HEADER.NAV_APPOINTMENT',
  };

  // Keyboard shortcuts
  private shortcuts = new Map<string, () => void>([
    ['Alt+H', () => this.navigateTo('/')],
    ['Alt+S', () => this.navigateTo('/hizmetlerimiz')],
    ['Alt+A', () => this.navigateTo('/hakkimizda')],
    ['Alt+I', () => this.navigateTo('/iletisim')],
    ['Alt+R', () => this.navigateTo('/kaynaklar')],
    ['Alt+M', () => this.toggleMainMenu()],
    ['Alt+/', () => this.focusSearch()],
    ['Alt++', () => this.increaseFontSize()],
    ['Alt+-', () => this.decreaseFontSize()],
    ['Alt+C', () => this.toggleHighContrast()],
    ['Escape', () => this.closeAllModals()],
  ]);

  // ARIA live regions
  private liveRegions = {
    polite: null as HTMLElement | null,
    assertive: null as HTMLElement | null,
    status: null as HTMLElement | null,
  };

  constructor() {
    this.initializeAccessibility();
    this.setupKeyboardShortcuts();
    this.detectUserPreferences();
    this.setupRouteAnnouncements();
    this.createSkipLinks();
    this.createLiveRegions();
    this.translate.onLangChange.subscribe(() => this.refreshLocalizedAccessibility());
  }

  /**
   * Initialize accessibility features
   */
  private initializeAccessibility(): void {
    // Add accessibility attributes to body
    this.document.body.setAttribute('role', 'application');
    this.document.body.setAttribute(
      'aria-label',
      this.translate.instant('ACCESSIBILITY.CLINIC_ARIA_LABEL')
    );

    // Set language
    this.document.documentElement.setAttribute('lang', this.translate.currentLang || 'tr');

    // Add landmark roles if missing
    this.ensureLandmarkRoles();
  }

  /**
   * Ensure all landmark roles are present
   */
  private ensureLandmarkRoles(): void {
    // Main content
    const main = this.document.querySelector('main');
    if (main) {
      if (!main.getAttribute('role')) {
        main.setAttribute('role', 'main');
      }
      main.setAttribute('aria-label', this.translate.instant('ACCESSIBILITY.MAIN_CONTENT'));
    }

    // Navigation
    const nav = this.document.querySelector('nav');
    if (nav) {
      if (!nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
      nav.setAttribute('aria-label', this.translate.instant('ACCESSIBILITY.MAIN_NAVIGATION'));
    }

    // Header
    const header = this.document.querySelector('header');
    if (header) {
      if (!header.getAttribute('role')) {
        header.setAttribute('role', 'banner');
      }
      header.setAttribute('aria-label', this.translate.instant('ACCESSIBILITY.SITE_HEADER'));
    }

    // Footer
    const footer = this.document.querySelector('footer');
    if (footer) {
      if (!footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
      }
      footer.setAttribute('aria-label', this.translate.instant('ACCESSIBILITY.SITE_FOOTER'));
    }
  }

  /**
   * Setup keyboard shortcuts
   */
  private setupKeyboardShortcuts(): void {
    this.document.addEventListener('keydown', (event: KeyboardEvent) => {
      const key = this.getShortcutKey(event);
      const handler = this.shortcuts.get(key);

      if (handler) {
        event.preventDefault();
        handler();
        this.announceAction(
          this.translate.instant('ACCESSIBILITY.SHORTCUT_USED', { shortcut: key })
        );
      }
    });
  }

  /**
   * Get shortcut key string from keyboard event
   */
  private getShortcutKey(event: KeyboardEvent): string {
    const keys = [];
    if (event.altKey) keys.push('Alt');
    if (event.ctrlKey) keys.push('Ctrl');
    if (event.shiftKey) keys.push('Shift');
    if (event.metaKey) keys.push('Meta');

    // Special keys
    if (event.key === 'Escape') {
      return 'Escape';
    }

    keys.push(event.key.toUpperCase());
    return keys.join('+');
  }

  /**
   * Detect user accessibility preferences
   */
  private detectUserPreferences(): void {
    // Check for screen reader
    const screenReaderActive = this.document.body.getAttribute('data-screen-reader') === 'true';
    this.screenReaderActive.set(screenReaderActive);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.reducedMotion.set(prefersReducedMotion);
    if (prefersReducedMotion) {
      this.document.body.classList.add('reduced-motion');
    }

    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    this.highContrastMode.set(prefersHighContrast);
    if (prefersHighContrast) {
      this.document.body.classList.add('high-contrast');
    }

    // Check for color scheme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      this.document.body.setAttribute('data-theme', 'dark');
    }

    // Listen for changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion.set(e.matches);
      this.document.body.classList.toggle('reduced-motion', e.matches);
    });

    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      this.highContrastMode.set(e.matches);
      this.document.body.classList.toggle('high-contrast', e.matches);
    });
  }

  /**
   * Setup route change announcements for screen readers
   */
  private setupRouteAnnouncements(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Announce page change
        const pageTitle = this.getPageTitle(event.url);
        this.announcePageChange(pageTitle);

        // Update page title for screen readers
        this.updatePageTitle(pageTitle);

        // Focus management
        this.manageFocusOnRouteChange();
      });
  }

  /**
   * Get page title from URL
   */
  private getPageTitle(url: string): string {
    const translationKey = this.pageTitleKeyMap[url];
    return translationKey
      ? this.translate.instant(translationKey)
      : this.translate.instant('ACCESSIBILITY.PAGE_FALLBACK');
  }

  /**
   * Create skip links for keyboard navigation
   */
  private createSkipLinks(): void {
    const existingContainer = this.document.querySelector('.skip-links');
    existingContainer?.remove();

    const skipLinksContainer = this.document.createElement('div');
    skipLinksContainer.className = 'skip-links';
    skipLinksContainer.setAttribute('role', 'navigation');
    skipLinksContainer.setAttribute(
      'aria-label',
      this.translate.instant('ACCESSIBILITY.SKIP_LINKS_NAV')
    );

    this.getSkipLinks().forEach((link) => {
      const anchor = this.document.createElement('a');
      anchor.href = `#${link.id}`;
      anchor.className = 'skip-link';
      anchor.textContent = link.label;
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        this.skipToElement(link.id);
      });
      skipLinksContainer.appendChild(anchor);
    });

    this.document.body.insertBefore(skipLinksContainer, this.document.body.firstChild);
  }

  /**
   * Skip to element by ID
   */
  private skipToElement(elementId: string): void {
    const element = this.document.getElementById(elementId);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.announceAction(
        this.translate.instant('ACCESSIBILITY.SKIP_LINK_ACTIVATED', {
          target: this.getSkipLinkLabel(elementId),
        })
      );
    }
  }

  /**
   * Create ARIA live regions
   */
  private createLiveRegions(): void {
    // Polite announcements
    this.liveRegions.polite = this.createLiveRegion('polite', 'status');

    // Assertive announcements
    this.liveRegions.assertive = this.createLiveRegion('assertive', 'alert');

    // Status updates
    this.liveRegions.status = this.createLiveRegion('polite', 'status');
  }

  /**
   * Create a live region element
   */
  private createLiveRegion(priority: string, role: string): HTMLElement {
    const region = this.document.createElement('div');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', role);
    region.className = 'sr-only'; // Screen reader only
    region.style.position = 'absolute';
    region.style.left = '-10000px';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.overflow = 'hidden';
    this.document.body.appendChild(region);
    return region;
  }

  /**
   * Announce message to screen readers
   */
  public announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const region = this.liveRegions[priority];
    if (region) {
      region.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }

  /**
   * Announce page change
   */
  private announcePageChange(pageTitle: string): void {
    this.announce(
      this.translate.instant('ACCESSIBILITY.PAGE_LOADED', { pageTitle }),
      'polite'
    );
  }

  /**
   * Announce action
   */
  private announceAction(action: string): void {
    this.announce(action, 'polite');
  }

  /**
   * Update page title
   */
  private updatePageTitle(title: string): void {
    this.document.title = this.translate.instant('ACCESSIBILITY.DOCUMENT_TITLE', { title });
  }

  /**
   * Manage focus on route change
   */
  private manageFocusOnRouteChange(): void {
    // Focus on main content
    setTimeout(() => {
      const mainContent = this.document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
      }
    }, 100);
  }

  /**
   * Navigation helpers
   */
  private navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  private toggleMainMenu(): void {
    const menuButton = this.document.querySelector('[data-a11y-menu-toggle="main"]') as HTMLElement;
    if (menuButton) {
      menuButton.click();
    }
  }

  private focusSearch(): void {
    const searchInput = this.document.querySelector('[role="search"] input') as HTMLElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  private closeAllModals(): void {
    const modals = this.document.querySelectorAll('[role="dialog"]');
    modals.forEach((modal) => {
      const closeButton = modal.querySelector('[data-a11y-close="true"]') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    });
  }

  /**
   * Font size management
   */
  public increaseFontSize(): void {
    const currentSize = this.fontSize();
    if (currentSize === 'normal') {
      this.fontSize.set('large');
      this.document.body.classList.add('font-large');
    } else if (currentSize === 'large') {
      this.fontSize.set('extra-large');
      this.document.body.classList.remove('font-large');
      this.document.body.classList.add('font-extra-large');
    }
    this.announceAction(this.translate.instant('ACCESSIBILITY.FONT_SIZE_INCREASED'));
  }

  public decreaseFontSize(): void {
    const currentSize = this.fontSize();
    if (currentSize === 'extra-large') {
      this.fontSize.set('large');
      this.document.body.classList.remove('font-extra-large');
      this.document.body.classList.add('font-large');
    } else if (currentSize === 'large') {
      this.fontSize.set('normal');
      this.document.body.classList.remove('font-large');
    }
    this.announceAction(this.translate.instant('ACCESSIBILITY.FONT_SIZE_DECREASED'));
  }

  /**
   * High contrast toggle
   */
  public toggleHighContrast(): void {
    const isActive = !this.highContrastMode();
    this.highContrastMode.set(isActive);
    this.document.body.classList.toggle('high-contrast', isActive);
    this.announceAction(
      this.translate.instant(
        isActive ? 'ACCESSIBILITY.HIGH_CONTRAST_ENABLED' : 'ACCESSIBILITY.HIGH_CONTRAST_DISABLED'
      )
    );
  }

  /**
   * Get keyboard shortcuts for display
   */
  public getKeyboardShortcuts(): Array<{ key: string; description: string }> {
    return [
      { key: 'Alt+H', description: this.translate.instant('ACCESSIBILITY.SHORTCUTS.GO_HOME') },
      { key: 'Alt+S', description: this.translate.instant('ACCESSIBILITY.SHORTCUTS.GO_SERVICES') },
      { key: 'Alt+A', description: this.translate.instant('ACCESSIBILITY.SHORTCUTS.GO_ABOUT') },
      { key: 'Alt+I', description: this.translate.instant('ACCESSIBILITY.SHORTCUTS.GO_CONTACT') },
      { key: 'Alt+R', description: this.translate.instant('ACCESSIBILITY.SHORTCUTS.GO_RESOURCES') },
      { key: 'Alt+M', description: this.translate.instant('ACCESSIBILITY.SHORTCUTS.TOGGLE_MENU') },
      { key: 'Alt+/', description: this.translate.instant('ACCESSIBILITY.SHORTCUTS.FOCUS_SEARCH') },
      { key: 'Alt++', description: this.translate.instant('ACCESSIBILITY.SHORTCUTS.INCREASE_FONT') },
      { key: 'Alt+-', description: this.translate.instant('ACCESSIBILITY.SHORTCUTS.DECREASE_FONT') },
      {
        key: 'Alt+C',
        description: this.translate.instant('ACCESSIBILITY.SHORTCUTS.TOGGLE_HIGH_CONTRAST'),
      },
      { key: 'Escape', description: this.translate.instant('ACCESSIBILITY.SHORTCUTS.CLOSE_MODALS') },
    ];
  }

  private refreshLocalizedAccessibility(): void {
    this.document.body.setAttribute(
      'aria-label',
      this.translate.instant('ACCESSIBILITY.CLINIC_ARIA_LABEL')
    );
    this.document.documentElement.setAttribute('lang', this.translate.currentLang || 'tr');
    this.ensureLandmarkRoles();
    this.createSkipLinks();
  }

  private getSkipLinks(): Array<{ id: string; label: string }> {
    return [
      { id: 'main-content', label: this.translate.instant('ACCESSIBILITY.SKIP_LINKS.MAIN_CONTENT') },
      {
        id: 'main-navigation',
        label: this.translate.instant('ACCESSIBILITY.SKIP_LINKS.MAIN_NAVIGATION'),
      },
      { id: 'search', label: this.translate.instant('ACCESSIBILITY.SKIP_LINKS.SEARCH') },
      { id: 'footer', label: this.translate.instant('ACCESSIBILITY.SKIP_LINKS.FOOTER') },
    ];
  }

  private getSkipLinkLabel(id: string): string {
    return this.getSkipLinks().find((link) => link.id === id)?.label || id;
  }

  /**
   * Add custom keyboard shortcut
   */
  public addShortcut(key: string, handler: () => void): void {
    this.shortcuts.set(key, handler);
  }

  /**
   * Remove keyboard shortcut
   */
  public removeShortcut(key: string): void {
    this.shortcuts.delete(key);
  }

  /**
   * Check if screen reader is active
   */
  public isScreenReaderActive(): boolean {
    return this.screenReaderActive();
  }

  /**
   * Check if reduced motion is preferred
   */
  public prefersReducedMotion(): boolean {
    return this.reducedMotion();
  }
}
