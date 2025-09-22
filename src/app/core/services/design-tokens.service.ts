import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Design Token Service
 * Manages design tokens, generates CSS variables, and provides token automation
 */

// Design Token Types
export interface ColorToken {
  name: string;
  value: string;
  rgb?: string;
  hsl?: string;
  description?: string;
  contrast?: {
    onLight: number;
    onDark: number;
  };
}

export interface TypographyToken {
  name: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing?: string;
  textTransform?: string;
}

export interface SpacingToken {
  name: string;
  value: string;
  pixels: number;
  rem: number;
}

export interface ShadowToken {
  name: string;
  value: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
}

export interface BorderRadiusToken {
  name: string;
  value: string;
  pixels: number;
}

export interface AnimationToken {
  name: string;
  duration: string;
  easing: string;
  description?: string;
}

export interface DesignTokens {
  colors: {
    primary: ColorToken[];
    secondary: ColorToken[];
    tertiary: ColorToken[];
    neutral: ColorToken[];
    semantic: ColorToken[];
  };
  typography: {
    headings: TypographyToken[];
    body: TypographyToken[];
    labels: TypographyToken[];
  };
  spacing: SpacingToken[];
  shadows: ShadowToken[];
  borderRadius: BorderRadiusToken[];
  animations: AnimationToken[];
}

@Injectable({
  providedIn: 'root',
})
export class DesignTokensService {
  private document = inject(DOCUMENT);

  // Token storage
  private tokens$ = new BehaviorSubject<DesignTokens>(this.getDefaultTokens());

  // Token version for cache busting
  private tokenVersion = '1.0.0';

  constructor() {
    this.initializeTokens();
    this.applyTokensToDOM();
    this.setupTokenSync();
  }

  /**
   * Get default design tokens
   */
  private getDefaultTokens(): DesignTokens {
    return {
      colors: {
        primary: this.generateColorScale('var(--md-sys-color-primary)', 'teal'),
        secondary: this.generateColorScale('var(--md-sys-color-secondary)', 'amber'),
        tertiary: this.generateColorScale('var(--md-sys-color-tertiary)', 'coral'),
        neutral: this.generateColorScale('#7B7B7B', 'grey'),
        semantic: [
          { name: 'success', value: 'var(--md-sys-color-success)', description: 'Success state' },
          { name: 'warning', value: '#FF9800', description: 'Warning state' },
          { name: 'error', value: 'var(--md-sys-color-error)', description: 'Error state' },
          { name: 'info', value: '#2196F3', description: 'Info state' },
        ],
      },
      typography: {
        headings: [
          {
            name: 'display-large',
            fontFamily: 'Figtree',
            fontSize: '3.5rem',
            fontWeight: 800,
            lineHeight: '1.1',
            letterSpacing: '-0.025em',
          },
          {
            name: 'display-medium',
            fontFamily: 'Figtree',
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: '1.15',
            letterSpacing: '-0.02em',
          },
          {
            name: 'display-small',
            fontFamily: 'Figtree',
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: '1.2',
            letterSpacing: '-0.015em',
          },
          {
            name: 'headline-large',
            fontFamily: 'Figtree',
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: '1.25',
            letterSpacing: '-0.01em',
          },
          {
            name: 'headline-medium',
            fontFamily: 'Figtree',
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: '1.3',
            letterSpacing: '-0.005em',
          },
          {
            name: 'headline-small',
            fontFamily: 'Figtree',
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: '1.35',
          },
        ],
        body: [
          {
            name: 'body-large',
            fontFamily: 'DM Sans',
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: '1.6',
            letterSpacing: '0.5px',
          },
          {
            name: 'body-medium',
            fontFamily: 'DM Sans',
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: '1.55',
            letterSpacing: '0.25px',
          },
          {
            name: 'body-small',
            fontFamily: 'DM Sans',
            fontSize: '0.75rem',
            fontWeight: 400,
            lineHeight: '1.5',
            letterSpacing: '0.4px',
          },
        ],
        labels: [
          {
            name: 'label-large',
            fontFamily: 'DM Sans',
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: '1.4',
            letterSpacing: '0.1px',
          },
          {
            name: 'label-medium',
            fontFamily: 'DM Sans',
            fontSize: '0.75rem',
            fontWeight: 500,
            lineHeight: '1.35',
            letterSpacing: '0.5px',
          },
          {
            name: 'label-small',
            fontFamily: 'DM Sans',
            fontSize: '0.6875rem',
            fontWeight: 500,
            lineHeight: '1.3',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          },
        ],
      },
      spacing: this.generateSpacingScale(),
      shadows: this.generateShadowScale(),
      borderRadius: this.generateBorderRadiusScale(),
      animations: this.generateAnimationTokens(),
    };
  }

  /**
   * Generate color scale from base color
   */
  private generateColorScale(baseColor: string, name: string): ColorToken[] {
    const scale: ColorToken[] = [];
    const tints = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    tints.forEach((tint) => {
      const color = this.adjustColorBrightness(baseColor, tint);
      scale.push({
        name: `${name}-${tint}`,
        value: color,
        rgb: this.hexToRgb(color),
        hsl: this.hexToHsl(color),
        contrast: this.calculateContrast(color),
      });
    });

    return scale;
  }

  /**
   * Generate spacing scale
   */
  private generateSpacingScale(): SpacingToken[] {
    const baseUnit = 4;
    const scale = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64];

    return scale.map((multiplier) => ({
      name: `spacing-${multiplier}`,
      value: `${multiplier * baseUnit}px`,
      pixels: multiplier * baseUnit,
      rem: (multiplier * baseUnit) / 16,
    }));
  }

  /**
   * Generate shadow scale
   */
  private generateShadowScale(): ShadowToken[] {
    return [
      {
        name: 'elevation-0',
        value: 'none',
        x: 0,
        y: 0,
        blur: 0,
        spread: 0,
        color: '#000000',
        opacity: 0,
      },
      {
        name: 'elevation-1',
        value: '0 1px 2px 0 rgba(var(--md-sys-color-shadow), 0.05)',
        x: 0,
        y: 1,
        blur: 2,
        spread: 0,
        color: '#000000',
        opacity: 0.05,
      },
      {
        name: 'elevation-2',
        value: '0 1px 3px 0 rgba(var(--md-sys-color-shadow), 0.1), 0 1px 2px 0 rgba(var(--md-sys-color-shadow), 0.06)',
        x: 0,
        y: 1,
        blur: 3,
        spread: 0,
        color: '#000000',
        opacity: 0.1,
      },
      {
        name: 'elevation-3',
        value: '0 4px 6px -1px rgba(var(--md-sys-color-shadow), 0.1), 0 2px 4px -1px rgba(var(--md-sys-color-shadow), 0.06)',
        x: 0,
        y: 4,
        blur: 6,
        spread: -1,
        color: '#000000',
        opacity: 0.1,
      },
      {
        name: 'elevation-4',
        value: '0 10px 15px -3px rgba(var(--md-sys-color-shadow), 0.1), 0 4px 6px -2px rgba(var(--md-sys-color-shadow), 0.05)',
        x: 0,
        y: 10,
        blur: 15,
        spread: -3,
        color: '#000000',
        opacity: 0.1,
      },
      {
        name: 'elevation-5',
        value: '0 20px 25px -5px rgba(var(--md-sys-color-shadow), 0.1), 0 10px 10px -5px rgba(var(--md-sys-color-shadow), 0.04)',
        x: 0,
        y: 20,
        blur: 25,
        spread: -5,
        color: '#000000',
        opacity: 0.1,
      },
    ];
  }

  /**
   * Generate border radius scale
   */
  private generateBorderRadiusScale(): BorderRadiusToken[] {
    return [
      { name: 'radius-none', value: '0', pixels: 0 },
      { name: 'radius-sm', value: '0.25rem', pixels: 4 },
      { name: 'radius-md', value: '0.5rem', pixels: 8 },
      { name: 'radius-lg', value: '0.75rem', pixels: 12 },
      { name: 'radius-xl', value: '1rem', pixels: 16 },
      { name: 'radius-2xl', value: '1.5rem', pixels: 24 },
      { name: 'radius-3xl', value: '2rem', pixels: 32 },
      { name: 'radius-full', value: '9999px', pixels: 9999 },
    ];
  }

  /**
   * Generate animation tokens
   */
  private generateAnimationTokens(): AnimationToken[] {
    return [
      {
        name: 'duration-instant',
        duration: '50ms',
        easing: 'ease',
        description: 'Instant feedback',
      },
      {
        name: 'duration-fast',
        duration: '100ms',
        easing: 'ease',
        description: 'Fast interactions',
      },
      {
        name: 'duration-quick',
        duration: '200ms',
        easing: 'ease',
        description: 'Quick transitions',
      },
      {
        name: 'duration-normal',
        duration: '300ms',
        easing: 'ease',
        description: 'Normal animations',
      },
      {
        name: 'duration-smooth',
        duration: '400ms',
        easing: 'ease',
        description: 'Smooth transitions',
      },
      { name: 'duration-slow', duration: '600ms', easing: 'ease', description: 'Slow animations' },
      { name: 'easing-linear', duration: '300ms', easing: 'linear', description: 'Linear easing' },
      { name: 'easing-ease', duration: '300ms', easing: 'ease', description: 'Default easing' },
      { name: 'easing-ease-in', duration: '300ms', easing: 'ease-in', description: 'Ease in' },
      { name: 'easing-ease-out', duration: '300ms', easing: 'ease-out', description: 'Ease out' },
      {
        name: 'easing-ease-in-out',
        duration: '300ms',
        easing: 'ease-in-out',
        description: 'Ease in-out',
      },
      {
        name: 'easing-sharp',
        duration: '300ms',
        easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
        description: 'Sharp easing',
      },
      {
        name: 'easing-smooth',
        duration: '300ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        description: 'Smooth easing',
      },
      {
        name: 'easing-bounce',
        duration: '300ms',
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        description: 'Bounce effect',
      },
    ];
  }

  /**
   * Initialize tokens from storage or API
   */
  private initializeTokens(): void {
    // Check localStorage for custom tokens
    const storedTokens = localStorage.getItem('design-tokens');
    if (storedTokens) {
      try {
        const tokens = JSON.parse(storedTokens);
        this.tokens$.next(tokens);
      } catch (error) {
        console.error('Failed to parse stored tokens:', error);
      }
    }

    // Load tokens from API if available
    this.loadTokensFromAPI();
  }

  /**
   * Load tokens from API
   */
  private async loadTokensFromAPI(): Promise<void> {
    // Implement API call to load tokens
    // This could be from a design system API, Figma, etc.
  }

  /**
   * Apply tokens to DOM as CSS variables
   */
  private applyTokensToDOM(): void {
    const tokens = this.tokens$.value;
    const root = this.document.documentElement;

    // Apply color tokens
    Object.entries(tokens.colors).forEach(([category, colors]) => {
      colors.forEach((color) => {
        root.style.setProperty(`--token-color-${color.name}`, color.value);
        if (color.rgb) {
          root.style.setProperty(`--token-color-${color.name}-rgb`, color.rgb);
        }
      });
    });

    // Apply typography tokens
    Object.entries(tokens.typography).forEach(([category, typographies]) => {
      typographies.forEach((typo) => {
        root.style.setProperty(`--token-font-${typo.name}-family`, typo.fontFamily);
        root.style.setProperty(`--token-font-${typo.name}-size`, typo.fontSize);
        root.style.setProperty(`--token-font-${typo.name}-weight`, typo.fontWeight.toString());
        root.style.setProperty(`--token-font-${typo.name}-line-height`, typo.lineHeight);
        if (typo.letterSpacing) {
          root.style.setProperty(`--token-font-${typo.name}-letter-spacing`, typo.letterSpacing);
        }
      });
    });

    // Apply spacing tokens
    tokens.spacing.forEach((spacing) => {
      root.style.setProperty(`--token-${spacing.name}`, spacing.value);
      root.style.setProperty(`--token-${spacing.name}-rem`, `${spacing.rem}rem`);
    });

    // Apply shadow tokens
    tokens.shadows.forEach((shadow) => {
      root.style.setProperty(`--token-shadow-${shadow.name}`, shadow.value);
    });

    // Apply border radius tokens
    tokens.borderRadius.forEach((radius) => {
      root.style.setProperty(`--token-${radius.name}`, radius.value);
    });

    // Apply animation tokens
    tokens.animations.forEach((animation) => {
      root.style.setProperty(`--token-animation-${animation.name}`, animation.duration);
      root.style.setProperty(`--token-animation-${animation.name}-easing`, animation.easing);
    });
  }

  /**
   * Setup token synchronization
   */
  private setupTokenSync(): void {
    // Sync with Figma Tokens plugin
    this.syncWithFigmaTokens();

    // Sync with Style Dictionary
    this.syncWithStyleDictionary();

    // Watch for token changes
    this.tokens$.subscribe((tokens) => {
      this.applyTokensToDOM();
      this.saveTokensToStorage(tokens);
      this.broadcastTokenUpdate(tokens);
    });
  }

  /**
   * Sync with Figma Tokens
   */
  private syncWithFigmaTokens(): void {
    // Implement Figma Tokens plugin integration
    // This would connect to Figma API or use Figma Tokens sync
  }

  /**
   * Sync with Style Dictionary
   */
  private syncWithStyleDictionary(): void {
    // Implement Style Dictionary integration
    // This would generate platform-specific outputs
  }

  /**
   * Save tokens to storage
   */
  private saveTokensToStorage(tokens: DesignTokens): void {
    localStorage.setItem('design-tokens', JSON.stringify(tokens));
    localStorage.setItem('design-tokens-version', this.tokenVersion);
  }

  /**
   * Broadcast token update
   */
  private broadcastTokenUpdate(tokens: DesignTokens): void {
    // Broadcast to other tabs/windows
    const channel = new BroadcastChannel('design-tokens');
    channel.postMessage({ type: 'update', tokens });
  }

  /**
   * Export tokens to various formats
   */
  public exportTokens(format: 'json' | 'css' | 'scss' | 'js' | 'swift' | 'kotlin'): string {
    const tokens = this.tokens$.value;

    switch (format) {
      case 'json':
        return JSON.stringify(tokens, null, 2);

      case 'css':
        return this.exportAsCSS(tokens);

      case 'scss':
        return this.exportAsSCSS(tokens);

      case 'js':
        return this.exportAsJS(tokens);

      case 'swift':
        return this.exportAsSwift(tokens);

      case 'kotlin':
        return this.exportAsKotlin(tokens);

      default:
        return '';
    }
  }

  /**
   * Export as CSS
   */
  private exportAsCSS(tokens: DesignTokens): string {
    let css = ':root {\n';

    // Add all tokens as CSS variables
    Object.entries(tokens.colors).forEach(([category, colors]) => {
      css += `  /* Color: ${category} */\n`;
      colors.forEach((color) => {
        css += `  --${color.name}: ${color.value};\n`;
      });
    });

    css += '}\n';
    return css;
  }

  /**
   * Export as SCSS
   */
  private exportAsSCSS(tokens: DesignTokens): string {
    let scss = '// Design Tokens\n\n';

    // Colors
    scss += '// Colors\n';
    Object.entries(tokens.colors).forEach(([category, colors]) => {
      scss += `$color-${category}: (\n`;
      colors.forEach((color) => {
        scss += `  ${color.name}: ${color.value},\n`;
      });
      scss += ');\n\n';
    });

    return scss;
  }

  /**
   * Export as JavaScript
   */
  private exportAsJS(tokens: DesignTokens): string {
    return `export const designTokens = ${JSON.stringify(tokens, null, 2)};`;
  }

  /**
   * Export as Swift
   */
  private exportAsSwift(tokens: DesignTokens): string {
    let swift = 'import UIKit\n\n';
    swift += 'struct DesignTokens {\n';

    // Colors
    swift += '  struct Colors {\n';
    Object.entries(tokens.colors).forEach(([category, colors]) => {
      colors.forEach((color) => {
        swift += `    static let ${color.name} = UIColor(hex: "${color.value}")\n`;
      });
    });
    swift += '  }\n';

    swift += '}\n';
    return swift;
  }

  /**
   * Export as Kotlin
   */
  private exportAsKotlin(tokens: DesignTokens): string {
    let kotlin = 'package com.ozlemmurzoglu.designtokens\n\n';
    kotlin += 'object DesignTokens {\n';

    // Colors
    kotlin += '  object Colors {\n';
    Object.entries(tokens.colors).forEach(([category, colors]) => {
      colors.forEach((color) => {
        kotlin += `    const val ${color.name} = "${color.value}"\n`;
      });
    });
    kotlin += '  }\n';

    kotlin += '}\n';
    return kotlin;
  }

  /**
   * Helper functions
   */
  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `${r}, ${g}, ${b}`;
    }
    return '';
  }

  private hexToHsl(hex: string): string {
    // Convert hex to HSL
    // Implementation here
    return '';
  }

  private adjustColorBrightness(color: string, level: number): string {
    // Adjust color brightness based on level
    // Implementation here
    return color;
  }

  private calculateContrast(color: string): { onLight: number; onDark: number } {
    // Calculate WCAG contrast ratios
    return { onLight: 4.5, onDark: 4.5 };
  }

  /**
   * Public API
   */
  public getTokens(): Observable<DesignTokens> {
    return this.tokens$.asObservable();
  }

  public updateTokens(tokens: Partial<DesignTokens>): void {
    const current = this.tokens$.value;
    this.tokens$.next({ ...current, ...tokens });
  }

  public resetTokens(): void {
    this.tokens$.next(this.getDefaultTokens());
  }

  public getTokenVersion(): string {
    return this.tokenVersion;
  }
}
