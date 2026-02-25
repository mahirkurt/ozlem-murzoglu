import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme = signal<Theme>('auto');
  private prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.theme.set(savedTheme);
    }

    // Listen for system theme changes
    this.prefersDark.addEventListener('change', () => {
      if (this.theme() === 'auto') {
        this.applyTheme(this.theme());
      }
    });

    // Apply theme on changes
    effect(() => {
      const currentTheme = this.theme();
      this.applyTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });

    // Apply initial theme
    this.applyTheme(this.theme());
  }

  getTheme() {
    return this.theme();
  }

  setTheme(theme: Theme) {
    this.theme.set(theme);
  }

  toggleTheme() {
    const current = this.theme();
    let next: Theme;

    switch (current) {
      case 'light':
        next = 'dark';
        break;
      case 'dark':
        next = 'auto';
        break;
      case 'auto':
        next = 'light';
        break;
    }

    this.theme.set(next);
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('light-theme', 'dark-theme');

    // Determine actual theme to apply
    let actualTheme: 'light' | 'dark';

    if (theme === 'auto') {
      actualTheme = this.prefersDark.matches ? 'dark' : 'light';
    } else {
      actualTheme = theme;
    }

    // Apply theme class and data attribute
    root.classList.add(`${actualTheme}-theme`);
    root.setAttribute('data-theme', actualTheme);

    // Bridge legacy variables to MD3 token system.
    // Legacy vars (--color-*, --glass-*, --shadow-*) are used by some components.
    // By referencing MD3 tokens instead of hardcoded hex, they auto-adapt to theme.
    this.bridgeLegacyVariables();

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        actualTheme === 'dark' ? '#1a1c1e' : '#2E6E6A'
      );
    }
  }

  private bridgeLegacyVariables() {
    const root = document.documentElement;

    // Map legacy variables → MD3 tokens (auto-switch via data-theme attribute)
    const mappings: Record<string, string> = {
      '--color-primary': 'var(--md-sys-color-primary)',
      '--color-primary-light': 'var(--md-sys-color-inverse-primary)',
      '--color-primary-dark': 'var(--md-sys-color-primary)',
      '--color-secondary': 'var(--md-sys-color-secondary)',
      '--color-secondary-light': 'var(--md-sys-color-secondary-container)',
      '--color-secondary-dark': 'var(--md-sys-color-on-secondary-container)',
      '--color-accent': 'var(--md-sys-color-tertiary)',
      '--color-accent-light': 'var(--md-sys-color-tertiary-container)',
      '--color-accent-dark': 'var(--md-sys-color-on-tertiary-container)',
      '--color-neutral-50': 'var(--md-sys-color-surface)',
      '--color-neutral-100': 'var(--md-sys-color-surface-container-low)',
      '--color-neutral-200': 'var(--md-sys-color-surface-container)',
      '--color-neutral-300': 'var(--md-sys-color-surface-container-high)',
      '--color-neutral-400': 'var(--md-sys-color-surface-container-highest)',
      '--color-neutral-500': 'var(--md-sys-color-outline)',
      '--color-neutral-600': 'var(--md-sys-color-outline-variant)',
      '--color-neutral-700': 'var(--md-sys-color-on-surface-variant)',
      '--color-neutral-800': 'var(--md-sys-color-on-surface)',
      '--color-neutral-900': 'var(--md-sys-color-on-surface)',
      '--glass-bg': 'var(--md-sys-color-glass-surface, rgba(255, 255, 255, 0.7))',
      '--glass-border': 'var(--md-sys-color-glass-border, rgba(255, 255, 255, 0.18))',
      '--shadow-xs': 'var(--md-sys-elevation-level1)',
      '--shadow-sm': 'var(--md-sys-elevation-level1)',
      '--shadow-md': 'var(--md-sys-elevation-level2)',
      '--shadow-lg': 'var(--md-sys-elevation-level3)',
      '--shadow-xl': 'var(--md-sys-elevation-level4)',
    };

    Object.entries(mappings).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });
  }
}
