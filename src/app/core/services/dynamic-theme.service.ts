import { Injectable, signal, computed, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, fromEvent, interval, animationFrameScheduler } from 'rxjs';
import { map, distinctUntilChanged, throttleTime, startWith } from 'rxjs/operators';

/**
 * Dynamic Theme Service - The Living Interface Engine
 * Manages context-aware, time-sensitive, and personalized theming
 */

export interface DynamicThemeConfig {
  // Core theme settings
  primaryHue: number;
  primarySaturation: number;
  primaryLightness: number;

  // Rhythm and spacing
  baseUnit: number;
  density: 'comfortable' | 'compact' | 'spacious';
  roundness: number; // 0-1 multiplier for border radius

  // Motion
  motionSpeed: number; // Multiplier for animation speed
  motionIntensity: 'subtle' | 'moderate' | 'expressive';

  // Context
  mood: 'balanced' | 'focused' | 'energetic' | 'relaxed';
  contentType: 'default' | 'reading' | 'media' | 'data';

  // Personalization
  colorScheme: 'monochromatic' | 'analogous' | 'complementary' | 'triadic';
  contrastPreference: 'standard' | 'increased' | 'high';

  // Time awareness
  autoAdjustTime: boolean;
  autoAdjustAmbient: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DynamicThemeService {
  // Reactive state
  private config = signal<DynamicThemeConfig>({
    primaryHue: 175,
    primarySaturation: 42,
    primaryLightness: 35,
    baseUnit: 4,
    density: 'comfortable',
    roundness: 1,
    motionSpeed: 1,
    motionIntensity: 'moderate',
    mood: 'balanced',
    contentType: 'default',
    colorScheme: 'analogous',
    contrastPreference: 'standard',
    autoAdjustTime: true,
    autoAdjustAmbient: false,
  });

  // Computed values
  public currentTheme = computed(() => this.generateThemeVariables());

  // Time and ambient light signals
  private currentHour = signal(new Date().getHours());
  private ambientLight = signal(1); // 0-1 scale
  private scrollPosition = signal(0);
  private mousePosition = signal({ x: 0, y: 0 });

  // Color extraction from images
  private dominantColor = signal<string | null>(null);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient
  ) {
    this.initializeTheme();
    this.setupTimeTracking();
    this.setupInteractionTracking();
    this.setupThemeEffects();
  }

  /**
   * Initialize theme system
   */
  private initializeTheme(): void {
    // Load saved preferences
    const saved = localStorage.getItem('dynamic-theme-config');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        this.config.set({ ...this.config(), ...config });
      } catch (e) {
        console.error('Failed to load theme config:', e);
      }
    }

    // Apply initial theme
    this.applyTheme();
  }

  /**
   * Setup time tracking for adaptive theming
   */
  private setupTimeTracking(): void {
    if (this.config().autoAdjustTime) {
      // Update time every minute
      interval(60000).subscribe(() => {
        this.currentHour.set(new Date().getHours());
      });

      // React to time changes
      effect(() => {
        const hour = this.currentHour();
        this.adjustThemeForTime(hour);
      });
    }
  }

  /**
   * Setup interaction tracking for responsive theming
   */
  private setupInteractionTracking(): void {
    // Track scroll position
    fromEvent(window, 'scroll')
      .pipe(
        throttleTime(100, animationFrameScheduler),
        map(() => window.scrollY),
        distinctUntilChanged()
      )
      .subscribe((position) => {
        this.scrollPosition.set(position);
        this.updateScrollBasedTheme(position);
      });

    // Track mouse position for interactive effects
    fromEvent<MouseEvent>(this.document, 'mousemove')
      .pipe(
        throttleTime(50, animationFrameScheduler),
        map((e) => ({ x: e.clientX, y: e.clientY }))
      )
      .subscribe((position) => {
        this.mousePosition.set(position);
        this.updateInteractiveTheme(position);
      });
  }

  /**
   * Setup reactive effects for theme changes
   */
  private setupThemeEffects(): void {
    effect(() => {
      const theme = this.currentTheme();
      this.applyThemeVariables(theme);
      this.saveThemeConfig();
    });
  }

  /**
   * Generate theme variables based on current config
   */
  private generateThemeVariables(): Record<string, string> {
    const config = this.config();
    const hour = this.currentHour();
    const ambient = this.ambientLight();

    // Calculate time-based adjustments
    const timeWarmth = this.calculateTimeWarmth(hour);
    const timeBrightness = this.calculateTimeBrightness(hour);

    // Adjust primary color based on context
    let hue = config.primaryHue;
    let saturation = config.primarySaturation;
    let lightness = config.primaryLightness;

    // Time adjustments
    if (config.autoAdjustTime) {
      hue = (hue + timeWarmth) % 360;
      lightness = lightness + timeBrightness;
    }

    // Mood adjustments
    const moodAdjustments = this.getMoodAdjustments(config.mood);
    saturation = saturation * moodAdjustments.saturationMultiplier;

    // Generate color scheme
    const colors = this.generateColorScheme(hue, saturation, lightness, config.colorScheme);

    // Calculate spacing rhythm
    const spacing = this.generateSpacingVariables(config.baseUnit, config.density);

    // Motion variables
    const motion = this.generateMotionVariables(config.motionSpeed, config.motionIntensity);

    return {
      // Primary color components
      '--theme-primary-hue': `${hue}`,
      '--theme-primary-saturation': `${saturation}%`,
      '--theme-primary-lightness': `${lightness}%`,

      // Generated colors
      ...colors,

      // Spacing rhythm
      ...spacing,

      // Motion
      ...motion,

      // Shape
      '--roundness': `${config.roundness}`,

      // Elevation
      '--elevation-intensity': `${moodAdjustments.elevationIntensity}`,

      // Contrast
      '--contrast-ratio': `${this.getContrastRatio(config.contrastPreference)}`,

      // Time and ambient
      '--hour': `${hour}`,
      '--daylight': `${timeBrightness}`,
      '--ambient-light': `${ambient}`,

      // Interactive variables
      '--scroll-progress': `${this.scrollPosition() / (document.body.scrollHeight - window.innerHeight)}`,
      '--mouse-x': `${this.mousePosition().x}px`,
      '--mouse-y': `${this.mousePosition().y}px`,
    };
  }

  /**
   * Calculate warmth adjustment based on time
   */
  private calculateTimeWarmth(hour: number): number {
    // Warmer in evening (18-22), cooler in morning (6-10)
    if (hour >= 18 && hour <= 22) {
      return 15; // Warm shift
    } else if (hour >= 6 && hour <= 10) {
      return -10; // Cool shift
    }
    return 0;
  }

  /**
   * Calculate brightness adjustment based on time
   */
  private calculateTimeBrightness(hour: number): number {
    // Darker at night, brighter during day
    if (hour >= 22 || hour <= 6) {
      return -10; // Darker
    } else if (hour >= 10 && hour <= 16) {
      return 5; // Brighter
    }
    return 0;
  }

  /**
   * Get mood-based adjustments
   */
  private getMoodAdjustments(mood: string) {
    switch (mood) {
      case 'focused':
        return {
          saturationMultiplier: 0.6,
          elevationIntensity: 0.5,
          motionSpeedMultiplier: 0.7,
        };
      case 'energetic':
        return {
          saturationMultiplier: 1.3,
          elevationIntensity: 1.5,
          motionSpeedMultiplier: 1.3,
        };
      case 'relaxed':
        return {
          saturationMultiplier: 0.8,
          elevationIntensity: 0.7,
          motionSpeedMultiplier: 0.8,
        };
      default:
        return {
          saturationMultiplier: 1,
          elevationIntensity: 1,
          motionSpeedMultiplier: 1,
        };
    }
  }

  /**
   * Generate color scheme based on type
   */
  private generateColorScheme(
    hue: number,
    saturation: number,
    lightness: number,
    type: string
  ): Record<string, string> {
    const colors: Record<string, string> = {};

    // Primary color
    colors['--md-sys-color-primary'] = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colors['--md-sys-color-on-primary'] = lightness > 50 ? '#000000' : '#ffffff';

    switch (type) {
      case 'monochromatic':
        // Variations of the same hue
        colors['--md-sys-color-secondary'] =
          `hsl(${hue}, ${saturation * 0.6}%, ${lightness + 15}%)`;
        colors['--md-sys-color-tertiary'] = `hsl(${hue}, ${saturation * 0.4}%, ${lightness - 15}%)`;
        break;

      case 'analogous':
        // Adjacent colors on the wheel
        colors['--md-sys-color-secondary'] =
          `hsl(${(hue + 30) % 360}, ${saturation * 0.8}%, ${lightness}%)`;
        colors['--md-sys-color-tertiary'] =
          `hsl(${(hue - 30 + 360) % 360}, ${saturation * 0.8}%, ${lightness}%)`;
        break;

      case 'complementary':
        // Opposite on the color wheel
        colors['--md-sys-color-secondary'] =
          `hsl(${(hue + 180) % 360}, ${saturation * 0.7}%, ${lightness}%)`;
        colors['--md-sys-color-tertiary'] =
          `hsl(${(hue + 60) % 360}, ${saturation * 0.5}%, ${lightness + 10}%)`;
        break;

      case 'triadic':
        // Three evenly spaced colors
        colors['--md-sys-color-secondary'] =
          `hsl(${(hue + 120) % 360}, ${saturation * 0.8}%, ${lightness}%)`;
        colors['--md-sys-color-tertiary'] =
          `hsl(${(hue + 240) % 360}, ${saturation * 0.8}%, ${lightness}%)`;
        break;
    }

    // Surface colors
    colors['--md-sys-color-surface'] = `hsl(${hue}, 5%, 98%)`;
    colors['--md-sys-color-surface-variant'] = `hsl(${hue}, 10%, 95%)`;
    colors['--md-sys-color-background'] = `hsl(${hue}, 3%, 99%)`;

    return colors;
  }

  /**
   * Generate spacing variables based on rhythm
   */
  private generateSpacingVariables(baseUnit: number, density: string): Record<string, string> {
    const multiplier = density === 'compact' ? 0.75 : density === 'spacious' ? 1.25 : 1;

    return {
      '--space-xxs': `${baseUnit * multiplier}px`,
      '--space-xs': `${baseUnit * 2 * multiplier}px`,
      '--space-sm': `${baseUnit * 3 * multiplier}px`,
      '--space-md': `${baseUnit * 4 * multiplier}px`,
      '--space-lg': `${baseUnit * 6 * multiplier}px`,
      '--space-xl': `${baseUnit * 8 * multiplier}px`,
      '--space-xxl': `${baseUnit * 12 * multiplier}px`,
      '--space-xxxl': `${baseUnit * 16 * multiplier}px`,
    };
  }

  /**
   * Generate motion variables
   */
  private generateMotionVariables(speed: number, intensity: string): Record<string, string> {
    const baseSpeed = intensity === 'subtle' ? 1.5 : intensity === 'expressive' ? 0.8 : 1;
    const adjustedSpeed = baseSpeed / speed;

    return {
      '--motion-speed': `${speed}`,
      '--motion-quick': `${150 * adjustedSpeed}ms`,
      '--motion-smooth': `${300 * adjustedSpeed}ms`,
      '--motion-slow': `${500 * adjustedSpeed}ms`,
      '--motion-leisurely': `${800 * adjustedSpeed}ms`,
    };
  }

  /**
   * Get contrast ratio based on preference
   */
  private getContrastRatio(preference: string): number {
    switch (preference) {
      case 'increased':
        return 1.3;
      case 'high':
        return 1.6;
      default:
        return 1;
    }
  }

  /**
   * Apply theme variables to DOM
   */
  private applyThemeVariables(variables: Record<string, string>): void {
    const root = this.document.documentElement;

    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  /**
   * Apply complete theme
   */
  private applyTheme(): void {
    const variables = this.generateThemeVariables();
    this.applyThemeVariables(variables);
  }

  /**
   * Adjust theme based on time
   */
  private adjustThemeForTime(hour: number): void {
    if (!this.config().autoAdjustTime) return;

    // Subtle automatic adjustments
    const config = this.config();

    if (hour >= 22 || hour < 6) {
      // Night mode - reduce contrast, warm colors
      this.updateConfig({
        mood: 'relaxed',
        contrastPreference: 'standard',
      });
    } else if (hour >= 9 && hour < 17) {
      // Work hours - focused mode
      this.updateConfig({
        mood: 'focused',
        contrastPreference: 'increased',
      });
    } else {
      // Evening - balanced
      this.updateConfig({
        mood: 'balanced',
        contrastPreference: 'standard',
      });
    }
  }

  /**
   * Update theme based on scroll position
   */
  private updateScrollBasedTheme(position: number): void {
    const scrollProgress = position / (document.body.scrollHeight - window.innerHeight);

    // Update CSS variable for scroll-based effects
    this.document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}`);

    // Parallax effect for background
    this.document.documentElement.style.setProperty('--scroll-y', `${position}px`);
  }

  /**
   * Update interactive theme based on mouse position
   */
  private updateInteractiveTheme(position: { x: number; y: number }): void {
    // Update CSS variables for mouse position
    this.document.documentElement.style.setProperty('--mouse-x', `${position.x}px`);
    this.document.documentElement.style.setProperty('--mouse-y', `${position.y}px`);

    // Calculate mouse position as percentage
    const xPercent = position.x / window.innerWidth;
    const yPercent = position.y / window.innerHeight;

    this.document.documentElement.style.setProperty('--mouse-x-percent', `${xPercent}`);
    this.document.documentElement.style.setProperty('--mouse-y-percent', `${yPercent}`);
  }

  /**
   * Save theme configuration
   */
  private saveThemeConfig(): void {
    localStorage.setItem('dynamic-theme-config', JSON.stringify(this.config()));
  }

  // Public API

  /**
   * Update theme configuration
   */
  public updateConfig(partial: Partial<DynamicThemeConfig>): void {
    this.config.update((current) => ({ ...current, ...partial }));
  }

  /**
   * Set mood
   */
  public setMood(mood: 'balanced' | 'focused' | 'energetic' | 'relaxed'): void {
    this.updateConfig({ mood });
  }

  /**
   * Set content type
   */
  public setContentType(type: 'default' | 'reading' | 'media' | 'data'): void {
    this.updateConfig({ contentType: type });

    // Apply content-specific adjustments
    switch (type) {
      case 'reading':
        this.updateConfig({
          contrastPreference: 'increased',
          motionIntensity: 'subtle',
          density: 'spacious',
        });
        break;
      case 'media':
        this.updateConfig({
          contrastPreference: 'standard',
          motionIntensity: 'expressive',
          mood: 'relaxed',
        });
        break;
      case 'data':
        this.updateConfig({
          density: 'compact',
          motionIntensity: 'subtle',
          mood: 'focused',
        });
        break;
    }
  }

  /**
   * Extract dominant color from image
   */
  public async extractColorFromImage(imageUrl: string): Promise<void> {
    // This would use a color extraction library or API
    // For now, simulate with a placeholder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      // Get dominant color (simplified - would use proper algorithm)
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const dominantColor = this.extractDominantColor(imageData);
        this.applyMaterialYouTheme(dominantColor);
      }
    };
  }

  /**
   * Extract dominant color from image data
   */
  private extractDominantColor(imageData: ImageData): { h: number; s: number; l: number } {
    // Simplified color extraction - in production, use a proper algorithm
    const data = imageData.data;
    let r = 0,
      g = 0,
      b = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);

    // Convert RGB to HSL
    return this.rgbToHsl(r, g, b);
  }

  /**
   * Convert RGB to HSL
   */
  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Apply Material You theme from extracted color
   */
  private applyMaterialYouTheme(color: { h: number; s: number; l: number }): void {
    this.updateConfig({
      primaryHue: color.h,
      primarySaturation: color.s,
      primaryLightness: color.l,
      colorScheme: 'analogous', // Works well with extracted colors
    });
  }

  /**
   * Reset to defaults
   */
  public reset(): void {
    localStorage.removeItem('dynamic-theme-config');
    this.config.set({
      primaryHue: 175,
      primarySaturation: 42,
      primaryLightness: 35,
      baseUnit: 4,
      density: 'comfortable',
      roundness: 1,
      motionSpeed: 1,
      motionIntensity: 'moderate',
      mood: 'balanced',
      contentType: 'default',
      colorScheme: 'analogous',
      contrastPreference: 'standard',
      autoAdjustTime: true,
      autoAdjustAmbient: false,
    });
  }

  /**
   * Get current configuration
   */
  public getConfig(): DynamicThemeConfig {
    return this.config();
  }

  /**
   * Enable ambient light detection (requires permission)
   */
  public async enableAmbientLightDetection(): Promise<void> {
    if ('AmbientLightSensor' in window) {
      try {
        // @ts-ignore - AmbientLightSensor is experimental
        const sensor = new AmbientLightSensor();
        sensor.addEventListener('reading', () => {
          // Normalize to 0-1 scale (assuming max 1000 lux for indoor)
          const normalized = Math.min(sensor.illuminance / 1000, 1);
          this.ambientLight.set(normalized);
        });
        sensor.start();
      } catch (e) {
        console.error('Ambient light sensor not available:', e);
      }
    }
  }
}
