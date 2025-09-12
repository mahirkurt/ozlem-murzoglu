import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
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

  // Accessibility state
  private screenReaderActive = signal(false);
  private keyboardNavigationActive = signal(false);
  private highContrastMode = signal(false);
  private reducedMotion = signal(false);
  private fontSize = signal<'normal' | 'large' | 'extra-large'>('normal');

  // Skip links
  private skipLinks = [
    { id: 'main-content', label: 'Ana içeriğe geç' },
    { id: 'main-navigation', label: 'Ana menüye geç' },
    { id: 'search', label: 'Arama alanına geç' },
    { id: 'footer', label: 'Footer alanına geç' },
  ];

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
  }

  /**
   * Initialize accessibility features
   */
  private initializeAccessibility(): void {
    // Add accessibility attributes to body
    this.document.body.setAttribute('role', 'application');
    this.document.body.setAttribute('aria-label', 'Dr. Özlem Murzoğlu Pediatri Kliniği');

    // Set language
    this.document.documentElement.setAttribute('lang', 'tr');

    // Add landmark roles if missing
    this.ensureLandmarkRoles();
  }

  /**
   * Ensure all landmark roles are present
   */
  private ensureLandmarkRoles(): void {
    // Main content
    const main = this.document.querySelector('main');
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
      main.setAttribute('aria-label', 'Ana içerik');
    }

    // Navigation
    const nav = this.document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Ana navigasyon');
    }

    // Header
    const header = this.document.querySelector('header');
    if (header && !header.getAttribute('role')) {
      header.setAttribute('role', 'banner');
      header.setAttribute('aria-label', 'Site başlığı');
    }

    // Footer
    const footer = this.document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
      footer.setAttribute('aria-label', 'Site altbilgi');
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
        this.announceAction(`${key} kısayolu kullanıldı`);
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
    const titles: Record<string, string> = {
      '/': 'Ana Sayfa',
      '/hizmetlerimiz': 'Hizmetlerimiz',
      '/hakkimizda': 'Hakkımızda',
      '/iletisim': 'İletişim',
      '/kaynaklar': 'Kaynaklar',
      '/randevu': 'Randevu Al',
    };

    return titles[url] || 'Sayfa';
  }

  /**
   * Create skip links for keyboard navigation
   */
  private createSkipLinks(): void {
    const skipLinksContainer = this.document.createElement('div');
    skipLinksContainer.className = 'skip-links';
    skipLinksContainer.setAttribute('role', 'navigation');
    skipLinksContainer.setAttribute('aria-label', 'Hızlı erişim linkleri');

    this.skipLinks.forEach((link) => {
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
      this.announceAction(`${elementId} alanına geçildi`);
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
    this.announce(`${pageTitle} sayfası yüklendi`, 'polite');
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
    this.document.title = `${title} - Dr. Özlem Murzoğlu`;
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
    const menuButton = this.document.querySelector('[aria-label="Ana menüyü aç"]') as HTMLElement;
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
      const closeButton = modal.querySelector('[aria-label*="Kapat"]') as HTMLElement;
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
    this.announceAction('Yazı boyutu büyütüldü');
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
    this.announceAction('Yazı boyutu küçültüldü');
  }

  /**
   * High contrast toggle
   */
  public toggleHighContrast(): void {
    const isActive = !this.highContrastMode();
    this.highContrastMode.set(isActive);
    this.document.body.classList.toggle('high-contrast', isActive);
    this.announceAction(
      isActive ? 'Yüksek kontrast modu açıldı' : 'Yüksek kontrast modu kapatıldı'
    );
  }

  /**
   * Get keyboard shortcuts for display
   */
  public getKeyboardShortcuts(): Array<{ key: string; description: string }> {
    return [
      { key: 'Alt+H', description: 'Ana sayfaya git' },
      { key: 'Alt+S', description: 'Hizmetler sayfasına git' },
      { key: 'Alt+A', description: 'Hakkımızda sayfasına git' },
      { key: 'Alt+I', description: 'İletişim sayfasına git' },
      { key: 'Alt+R', description: 'Kaynaklar sayfasına git' },
      { key: 'Alt+M', description: 'Ana menüyü aç/kapat' },
      { key: 'Alt+/', description: 'Arama alanına odaklan' },
      { key: 'Alt++', description: 'Yazı boyutunu büyüt' },
      { key: 'Alt+-', description: 'Yazı boyutunu küçült' },
      { key: 'Alt+C', description: 'Yüksek kontrastı aç/kapat' },
      { key: 'Escape', description: 'Tüm modalleri kapat' },
    ];
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
