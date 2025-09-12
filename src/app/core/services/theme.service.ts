import { Injectable, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

/**
 * Advanced Theme Service for MD3
 * Manages light/dark mode, custom themes, and system preferences
 */

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'teal' | 'blue' | 'green' | 'purple' | 'custom';

export interface ThemeConfig {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  contrastLevel: 'standard' | 'medium' | 'high';
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Reactive signals for theme state
  private themeMode = signal<ThemeMode>('auto');
  private systemPrefersDark = signal<boolean>(false);
  private colorScheme = signal<ColorScheme>('teal');
  private contrastLevel = signal<'standard' | 'medium' | 'high'>('standard');
  private reducedMotion = signal<boolean>(false);
  private fontSize = signal<'small' | 'medium' | 'large'>('medium');

  // Computed signal for actual theme
  public isDarkMode = signal<boolean>(false);

  // Storage key
  private readonly STORAGE_KEY = 'ozlem-theme-config';

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initializeTheme();
    this.setupSystemListeners();
    this.setupEffects();
  }

  /**
   * Initialize theme from localStorage or system preferences
   */
  private initializeTheme(): void {
    // Load saved preferences
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const config: ThemeConfig = JSON.parse(saved);
        this.applyThemeConfig(config);
      } catch (e) {
        console.error('Failed to parse saved theme config:', e);
      }
    }

    // Check system preferences
    this.checkSystemPreferences();
  }

  /**
   * Setup media query listeners for system preferences
   */
  private setupSystemListeners(): void {
    // Dark mode preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
      this.systemPrefersDark.set(e.matches);
      if (this.themeMode() === 'auto') {
        this.updateTheme();
      }
    });
    this.systemPrefersDark.set(darkModeQuery.matches);

    // Reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      this.reducedMotion.set(e.matches);
      this.updateTheme();
    });
    this.reducedMotion.set(motionQuery.matches);

    // High contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    contrastQuery.addEventListener('change', (e) => {
      if (e.matches) {
        this.contrastLevel.set('high');
        this.updateTheme();
      }
    });
    if (contrastQuery.matches) {
      this.contrastLevel.set('high');
    }
  }

  /**
   * Setup reactive effects for theme changes
   */
  private setupEffects(): void {
    // React to theme mode changes
    effect(() => {
      const mode = this.themeMode();
      const systemDark = this.systemPrefersDark();

      if (mode === 'auto') {
        this.isDarkMode.set(systemDark);
      } else {
        this.isDarkMode.set(mode === 'dark');
      }

      this.updateTheme();
    });

    // React to other theme changes
    effect(() => {
      const scheme = this.colorScheme();
      const contrast = this.contrastLevel();
      const motion = this.reducedMotion();
      const size = this.fontSize();

      this.updateTheme();
      this.saveThemeConfig();
    });
  }

  /**
   * Check current system preferences
   */
  private checkSystemPreferences(): void {
    this.systemPrefersDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /**
   * Apply theme configuration
   */
  private applyThemeConfig(config: ThemeConfig): void {
    this.themeMode.set(config.mode);
    this.colorScheme.set(config.colorScheme);
    this.contrastLevel.set(config.contrastLevel);
    this.reducedMotion.set(config.reducedMotion);
    this.fontSize.set(config.fontSize);
  }

  /**
   * Update DOM with current theme
   */
  private updateTheme(): void {
    const root = this.document.documentElement;
    const isDark = this.isDarkMode();

    // Set data attributes
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    root.setAttribute('data-color-scheme', this.colorScheme());
    root.setAttribute('data-contrast', this.contrastLevel());
    root.setAttribute('data-motion', this.reducedMotion() ? 'reduced' : 'normal');
    root.setAttribute('data-font-size', this.fontSize());

    // Update CSS custom properties
    this.updateCSSVariables(isDark);

    // Update meta theme-color
    const metaThemeColor = this.document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1c1b1f' : '#ffffff');
    }
  }

  /**
   * Update CSS custom properties for theming
   */
  private updateCSSVariables(isDark: boolean): void {
    const root = this.document.documentElement.style;

    if (isDark) {
      // Dark mode colors
      root.setProperty('--md-sys-color-primary', '#7dd3d0');
      root.setProperty('--md-sys-color-on-primary', '#003735');
      root.setProperty('--md-sys-color-primary-container', '#00504d');
      root.setProperty('--md-sys-color-on-primary-container', '#9ff1ed');

      root.setProperty('--md-sys-color-secondary', '#b1ccc7');
      root.setProperty('--md-sys-color-on-secondary', '#1c3633');
      root.setProperty('--md-sys-color-secondary-container', '#334c49');
      root.setProperty('--md-sys-color-on-secondary-container', '#cde8e3');

      root.setProperty('--md-sys-color-surface', '#1c1b1f');
      root.setProperty('--md-sys-color-on-surface', '#e6e1e5');
      root.setProperty('--md-sys-color-surface-variant', '#49454f');
      root.setProperty('--md-sys-color-on-surface-variant', '#cac4d0');

      root.setProperty('--md-sys-color-background', '#1c1b1f');
      root.setProperty('--md-sys-color-on-background', '#e6e1e5');

      root.setProperty('--md-sys-color-outline', '#938f99');
      root.setProperty('--md-sys-color-outline-variant', '#49454f');

      // Surface tint colors for elevation
      root.setProperty('--md-sys-color-surface-tint', '#7dd3d0');
      root.setProperty('--md-sys-color-surface-1', '#24232a');
      root.setProperty('--md-sys-color-surface-2', '#292831');
      root.setProperty('--md-sys-color-surface-3', '#2e2d35');
      root.setProperty('--md-sys-color-surface-4', '#313037');
      root.setProperty('--md-sys-color-surface-5', '#34333b');
    } else {
      // Light mode colors (default)
      root.setProperty('--md-sys-color-primary', '#2E6E6A');
      root.setProperty('--md-sys-color-on-primary', '#ffffff');
      root.setProperty('--md-sys-color-primary-container', '#c0e8e4');
      root.setProperty('--md-sys-color-on-primary-container', '#002019');

      root.setProperty('--md-sys-color-secondary', '#4a8783');
      root.setProperty('--md-sys-color-on-secondary', '#ffffff');
      root.setProperty('--md-sys-color-secondary-container', '#cde8e3');
      root.setProperty('--md-sys-color-on-secondary-container', '#051f1d');

      root.setProperty('--md-sys-color-surface', '#ffffff');
      root.setProperty('--md-sys-color-on-surface', '#333333');
      root.setProperty('--md-sys-color-surface-variant', '#FAF8F5');
      root.setProperty('--md-sys-color-on-surface-variant', '#49454f');

      root.setProperty('--md-sys-color-background', '#ffffff');
      root.setProperty('--md-sys-color-on-background', '#333333');

      root.setProperty('--md-sys-color-outline', '#79747e');
      root.setProperty('--md-sys-color-outline-variant', '#cac4d0');

      // Surface tint colors for elevation
      root.setProperty('--md-sys-color-surface-tint', '#2E6E6A');
      root.setProperty('--md-sys-color-surface-1', '#f5f8f7');
      root.setProperty('--md-sys-color-surface-2', '#eff4f3');
      root.setProperty('--md-sys-color-surface-3', '#e9f0ef');
      root.setProperty('--md-sys-color-surface-4', '#e7eded');
      root.setProperty('--md-sys-color-surface-5', '#e3ecea');
    }

    // Apply color scheme variations
    this.applyColorSchemeVariation();

    // Apply contrast adjustments
    this.applyContrastAdjustments();

    // Apply font size adjustments
    this.applyFontSizeAdjustments();
  }

  /**
   * Apply color scheme variations
   */
  private applyColorSchemeVariation(): void {
    const scheme = this.colorScheme();
    const root = this.document.documentElement.style;

    switch (scheme) {
      case 'blue':
        root.setProperty('--md-sys-color-primary', '#0061a4');
        root.setProperty('--md-sys-color-primary-container', '#d1e4ff');
        break;
      case 'green':
        root.setProperty('--md-sys-color-primary', '#006e1c');
        root.setProperty('--md-sys-color-primary-container', '#b6f397');
        break;
      case 'purple':
        root.setProperty('--md-sys-color-primary', '#6b40c2');
        root.setProperty('--md-sys-color-primary-container', '#e9ddff');
        break;
      // 'teal' is default, already set
    }
  }

  /**
   * Apply contrast adjustments
   */
  private applyContrastAdjustments(): void {
    const level = this.contrastLevel();
    const root = this.document.documentElement.style;

    switch (level) {
      case 'medium':
        root.setProperty('--md-sys-state-opacity-hover', '0.12');
        root.setProperty('--md-sys-state-opacity-focus', '0.16');
        root.setProperty('--md-sys-state-opacity-pressed', '0.16');
        break;
      case 'high':
        root.setProperty('--md-sys-state-opacity-hover', '0.16');
        root.setProperty('--md-sys-state-opacity-focus', '0.20');
        root.setProperty('--md-sys-state-opacity-pressed', '0.20');
        // Increase text contrast
        if (this.isDarkMode()) {
          root.setProperty('--md-sys-color-on-surface', '#ffffff');
          root.setProperty('--md-sys-color-on-background', '#ffffff');
        } else {
          root.setProperty('--md-sys-color-on-surface', '#000000');
          root.setProperty('--md-sys-color-on-background', '#000000');
        }
        break;
      default:
        // Standard contrast (default values)
        root.setProperty('--md-sys-state-opacity-hover', '0.08');
        root.setProperty('--md-sys-state-opacity-focus', '0.12');
        root.setProperty('--md-sys-state-opacity-pressed', '0.12');
    }
  }

  /**
   * Apply font size adjustments
   */
  private applyFontSizeAdjustments(): void {
    const size = this.fontSize();
    const root = this.document.documentElement.style;

    switch (size) {
      case 'small':
        root.setProperty('--md-sys-typescale-scale', '0.875');
        break;
      case 'large':
        root.setProperty('--md-sys-typescale-scale', '1.125');
        break;
      default:
        root.setProperty('--md-sys-typescale-scale', '1');
    }
  }

  /**
   * Save theme configuration to localStorage
   */
  private saveThemeConfig(): void {
    const config: ThemeConfig = {
      mode: this.themeMode(),
      colorScheme: this.colorScheme(),
      contrastLevel: this.contrastLevel(),
      reducedMotion: this.reducedMotion(),
      fontSize: this.fontSize(),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
  }

  // Public API methods

  /**
   * Toggle between light and dark mode
   */
  public toggleTheme(): void {
    const current = this.themeMode();
    if (current === 'light') {
      this.setThemeMode('dark');
    } else if (current === 'dark') {
      this.setThemeMode('light');
    } else {
      // If auto, set to opposite of current state
      this.setThemeMode(this.isDarkMode() ? 'light' : 'dark');
    }
  }

  /**
   * Set theme mode
   */
  public setThemeMode(mode: ThemeMode): void {
    this.themeMode.set(mode);
  }

  /**
   * Set color scheme
   */
  public setColorScheme(scheme: ColorScheme): void {
    this.colorScheme.set(scheme);
  }

  /**
   * Set contrast level
   */
  public setContrastLevel(level: 'standard' | 'medium' | 'high'): void {
    this.contrastLevel.set(level);
  }

  /**
   * Set font size
   */
  public setFontSize(size: 'small' | 'medium' | 'large'): void {
    this.fontSize.set(size);
  }

  /**
   * Get current theme configuration
   */
  public getThemeConfig(): ThemeConfig {
    return {
      mode: this.themeMode(),
      colorScheme: this.colorScheme(),
      contrastLevel: this.contrastLevel(),
      reducedMotion: this.reducedMotion(),
      fontSize: this.fontSize(),
    };
  }

  /**
   * Reset to default theme
   */
  public resetTheme(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.themeMode.set('auto');
    this.colorScheme.set('teal');
    this.contrastLevel.set('standard');
    this.fontSize.set('medium');
    this.checkSystemPreferences();
  }

  // Getters for template binding
  public get currentThemeMode(): ThemeMode {
    return this.themeMode();
  }

  public get currentColorScheme(): ColorScheme {
    return this.colorScheme();
  }

  public get isReducedMotion(): boolean {
    return this.reducedMotion();
  }

  public get currentFontSize(): 'small' | 'medium' | 'large' {
    return this.fontSize();
  }

  public get currentContrastLevel(): 'standard' | 'medium' | 'high' {
    return this.contrastLevel();
  }
}
