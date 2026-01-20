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
    this.prefersDark.addEventListener('change', (e) => {
      if (this.theme() === 'auto') {
        this.applyTheme(e.matches ? 'dark' : 'light');
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
    
    // Update CSS variables for dynamic theming
    if (actualTheme === 'dark') {
      this.applyDarkThemeVariables();
    } else {
      this.applyLightThemeVariables();
    }
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', actualTheme === 'dark' ? '#0F1419' : 'var(--md-sys-color-primary)');
    }
  }
  
  private applyDarkThemeVariables() {
    const root = document.documentElement;
    
    // Override color variables for dark theme
    root.style.setProperty('--color-primary', '#0A8FA3');
    root.style.setProperty('--color-primary-light', '#14B8C7');
    root.style.setProperty('--color-primary-dark', 'var(--md-sys-color-primary)');
    
    root.style.setProperty('--color-secondary', '#6FAF99');
    root.style.setProperty('--color-secondary-light', '#94D2BD');
    root.style.setProperty('--color-secondary-dark', '#4A8670');
    
    root.style.setProperty('--color-accent', '#FF8B70');
    root.style.setProperty('--color-accent-light', '#FFB099');
    root.style.setProperty('--color-accent-dark', 'var(--md-sys-color-tertiary)');
    
    root.style.setProperty('--color-neutral-50', '#0F1419');
    root.style.setProperty('--color-neutral-100', '#1A1F26');
    root.style.setProperty('--color-neutral-200', '#252B33');
    root.style.setProperty('--color-neutral-300', '#303740');
    root.style.setProperty('--color-neutral-400', '#4A5259');
    root.style.setProperty('--color-neutral-500', '#6C757D');
    root.style.setProperty('--color-neutral-600', '#8B9399');
    root.style.setProperty('--color-neutral-700', '#AAB1B6');
    root.style.setProperty('--color-neutral-800', '#CED4DA');
    root.style.setProperty('--color-neutral-900', '#E9ECEF');
    
    // Update glassmorphism variables
    root.style.setProperty('--glass-bg', 'rgba(15, 20, 25, 0.7)');
    root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');
    
    // Update shadows for dark theme
    root.style.setProperty('--shadow-xs', '0 1px 2px rgba(var(--md-sys-color-shadow), 0.2)');
    root.style.setProperty('--shadow-sm', '0 2px 4px rgba(var(--md-sys-color-shadow), 0.3)');
    root.style.setProperty('--shadow-md', '0 4px 6px rgba(var(--md-sys-color-shadow), 0.4)');
    root.style.setProperty('--shadow-lg', '0 10px 15px rgba(var(--md-sys-color-shadow), 0.5)');
    root.style.setProperty('--shadow-xl', '0 20px 25px rgba(var(--md-sys-color-shadow), 0.6)');
  }
  
  private applyLightThemeVariables() {
    const root = document.documentElement;
    
    // Reset to light theme variables
    root.style.setProperty('--color-primary', 'var(--md-sys-color-primary)');
    root.style.setProperty('--color-primary-light', '#0A8FA3');
    root.style.setProperty('--color-primary-dark', '#003D4F');
    
    root.style.setProperty('--color-secondary', '#94D2BD');
    root.style.setProperty('--color-secondary-light', '#B8E6D3');
    root.style.setProperty('--color-secondary-dark', '#6FAF99');
    
    root.style.setProperty('--color-accent', 'var(--md-sys-color-tertiary)');
    root.style.setProperty('--color-accent-light', '#FF8B70');
    root.style.setProperty('--color-accent-dark', '#D74A2B');
    
    root.style.setProperty('--color-neutral-50', 'var(--md-sys-color-surface-container-low)');
    root.style.setProperty('--color-neutral-100', '#E9ECEF');
    root.style.setProperty('--color-neutral-200', '#DEE2E6');
    root.style.setProperty('--color-neutral-300', '#CED4DA');
    root.style.setProperty('--color-neutral-400', '#ADB5BD');
    root.style.setProperty('--color-neutral-500', '#6C757D');
    root.style.setProperty('--color-neutral-600', '#495057');
    root.style.setProperty('--color-neutral-700', '#343A40');
    root.style.setProperty('--color-neutral-800', '#212529');
    root.style.setProperty('--color-neutral-900', '#0F1419');
    
    // Reset glassmorphism variables
    root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
    root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.18)');
    
    // Reset shadows
    root.style.setProperty('--shadow-xs', '0 1px 2px rgba(var(--md-sys-color-primary-rgb), 0.05)');
    root.style.setProperty('--shadow-sm', '0 2px 4px rgba(var(--md-sys-color-primary-rgb), 0.06), 0 1px 2px rgba(var(--md-sys-color-primary-rgb), 0.04)');
    root.style.setProperty('--shadow-md', '0 4px 6px rgba(var(--md-sys-color-primary-rgb), 0.07), 0 2px 4px rgba(var(--md-sys-color-primary-rgb), 0.04)');
    root.style.setProperty('--shadow-lg', '0 10px 15px rgba(var(--md-sys-color-primary-rgb), 0.08), 0 4px 6px rgba(var(--md-sys-color-primary-rgb), 0.05)');
    root.style.setProperty('--shadow-xl', '0 20px 25px rgba(var(--md-sys-color-primary-rgb), 0.1), 0 10px 10px rgba(var(--md-sys-color-primary-rgb), 0.04)');
  }
}
