import { Injectable, signal, computed } from '@angular/core';
import {
  argbFromHex,
  hexFromArgb,
  QuantizerCelebi,
  Score,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
  MaterialDynamicColors,
  DynamicScheme,
  TonalPalette,
  Hct,
} from '@material/material-color-utilities';

/**
 * Material You Dynamic Color Service
 * Google'ın material-color-utilities kütüphanesi ile tam entegrasyon
 * Herhangi bir görsel veya renkten tam MD3 paleti üretir
 */

export interface DynamicColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;

  background: string;
  onBackground: string;

  outline: string;
  outlineVariant: string;

  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;

  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
}

export type ColorSchemeType =
  | 'content' // İçerik uyumlu (varsayılan)
  | 'expressive' // İfade gücü yüksek
  | 'fidelity' // Kaynak renge sadık
  | 'monochrome' // Tek renkli
  | 'neutral' // Nötr
  | 'tonalSpot' // Tonal nokta
  | 'vibrant'; // Canlı

@Injectable({
  providedIn: 'root',
})
export class MaterialYouColorService {
  // Mevcut renk şeması
  private colorScheme = signal<DynamicColorScheme | null>(null);

  // Tema modu
  private isDarkMode = signal(false);

  // Renk şeması tipi
  private schemeType = signal<ColorSchemeType>('content');

  // Kontrast seviyesi (-1 to 1, 0 is standard)
  private contrastLevel = signal(0);

  // Computed color scheme
  public currentScheme = computed(() => this.colorScheme());

  constructor() {
    this.initializeFromSystemPreference();
  }

  /**
   * Sistem tercihinden başlat
   */
  private initializeFromSystemPreference(): void {
    // Sistem karanlık mod tercihi
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode.set(prefersDark);

    // Sistem renk şeması (varsa)
    const systemAccent = getComputedStyle(document.documentElement)
      .getPropertyValue('--system-accent-color')
      ?.trim();

    if (systemAccent) {
      this.generateSchemeFromHex(systemAccent);
    } else {
      // Varsayılan tema rengi
      this.generateSchemeFromHex('var(--md-sys-color-primary)'); // Teal
    }

    // Sistem tercih değişimlerini dinle
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.setDarkMode(e.matches);
    });
  }

  /**
   * Görseldan renk paleti üret
   */
  public async generateSchemeFromImage(imageUrl: string): Promise<DynamicColorScheme> {
    const pixels = await this.extractPixelsFromImage(imageUrl);

    // Dominant renkleri bul
    const quantized = QuantizerCelebi.quantize(pixels, 128);
    const ranked = Score.score(quantized);

    // En yüksek skorlu rengi al
    const topColor = ranked[0];
    const sourceColor = hexFromArgb(topColor);

    return this.generateSchemeFromHex(sourceColor);
  }

  /**
   * Hex renkten tam MD3 paleti üret
   */
  public generateSchemeFromHex(hex: string): DynamicColorScheme {
    const argb = argbFromHex(hex);
    const sourceColorHct = Hct.fromInt(argb);

    // Seçilen şema tipine göre scheme oluştur
    const scheme = this.createScheme(sourceColorHct);

    // Renkleri çıkar
    const colors = this.extractColorsFromScheme(scheme);

    // State'i güncelle
    this.colorScheme.set(colors);

    // CSS değişkenlerini güncelle
    this.updateCSSVariables(colors);

    return colors;
  }

  /**
   * Şema tipine göre DynamicScheme oluştur
   */
  private createScheme(sourceColor: Hct): DynamicScheme {
    const isDark = this.isDarkMode();
    const contrast = this.contrastLevel();

    switch (this.schemeType()) {
      case 'expressive':
        return new SchemeExpressive(sourceColor, isDark, contrast);
      case 'fidelity':
        return new SchemeFidelity(sourceColor, isDark, contrast);
      case 'monochrome':
        return new SchemeMonochrome(sourceColor, isDark, contrast);
      case 'neutral':
        return new SchemeNeutral(sourceColor, isDark, contrast);
      case 'tonalSpot':
        return new SchemeTonalSpot(sourceColor, isDark, contrast);
      case 'vibrant':
        return new SchemeVibrant(sourceColor, isDark, contrast);
      case 'content':
      default:
        return new SchemeContent(sourceColor, isDark, contrast);
    }
  }

  /**
   * Scheme'den renkleri çıkar
   */
  private extractColorsFromScheme(scheme: DynamicScheme): DynamicColorScheme {
    return {
      // Primary
      primary: hexFromArgb(MaterialDynamicColors.primary.getArgb(scheme)),
      onPrimary: hexFromArgb(MaterialDynamicColors.onPrimary.getArgb(scheme)),
      primaryContainer: hexFromArgb(MaterialDynamicColors.primaryContainer.getArgb(scheme)),
      onPrimaryContainer: hexFromArgb(MaterialDynamicColors.onPrimaryContainer.getArgb(scheme)),

      // Secondary
      secondary: hexFromArgb(MaterialDynamicColors.secondary.getArgb(scheme)),
      onSecondary: hexFromArgb(MaterialDynamicColors.onSecondary.getArgb(scheme)),
      secondaryContainer: hexFromArgb(MaterialDynamicColors.secondaryContainer.getArgb(scheme)),
      onSecondaryContainer: hexFromArgb(MaterialDynamicColors.onSecondaryContainer.getArgb(scheme)),

      // Tertiary
      tertiary: hexFromArgb(MaterialDynamicColors.tertiary.getArgb(scheme)),
      onTertiary: hexFromArgb(MaterialDynamicColors.onTertiary.getArgb(scheme)),
      tertiaryContainer: hexFromArgb(MaterialDynamicColors.tertiaryContainer.getArgb(scheme)),
      onTertiaryContainer: hexFromArgb(MaterialDynamicColors.onTertiaryContainer.getArgb(scheme)),

      // Error
      error: hexFromArgb(MaterialDynamicColors.error.getArgb(scheme)),
      onError: hexFromArgb(MaterialDynamicColors.onError.getArgb(scheme)),
      errorContainer: hexFromArgb(MaterialDynamicColors.errorContainer.getArgb(scheme)),
      onErrorContainer: hexFromArgb(MaterialDynamicColors.onErrorContainer.getArgb(scheme)),

      // Surface
      surface: hexFromArgb(MaterialDynamicColors.surface.getArgb(scheme)),
      onSurface: hexFromArgb(MaterialDynamicColors.onSurface.getArgb(scheme)),
      surfaceVariant: hexFromArgb(MaterialDynamicColors.surfaceVariant.getArgb(scheme)),
      onSurfaceVariant: hexFromArgb(MaterialDynamicColors.onSurfaceVariant.getArgb(scheme)),

      // Background
      background: hexFromArgb(MaterialDynamicColors.background.getArgb(scheme)),
      onBackground: hexFromArgb(MaterialDynamicColors.onBackground.getArgb(scheme)),

      // Outline
      outline: hexFromArgb(MaterialDynamicColors.outline.getArgb(scheme)),
      outlineVariant: hexFromArgb(MaterialDynamicColors.outlineVariant.getArgb(scheme)),

      // Other
      shadow: hexFromArgb(MaterialDynamicColors.shadow.getArgb(scheme)),
      scrim: hexFromArgb(MaterialDynamicColors.scrim.getArgb(scheme)),
      inverseSurface: hexFromArgb(MaterialDynamicColors.inverseSurface.getArgb(scheme)),
      inverseOnSurface: hexFromArgb(MaterialDynamicColors.inverseOnSurface.getArgb(scheme)),
      inversePrimary: hexFromArgb(MaterialDynamicColors.inversePrimary.getArgb(scheme)),

      // Surface containers
      surfaceDim: hexFromArgb(MaterialDynamicColors.surfaceDim.getArgb(scheme)),
      surfaceBright: hexFromArgb(MaterialDynamicColors.surfaceBright.getArgb(scheme)),
      surfaceContainerLowest: hexFromArgb(
        MaterialDynamicColors.surfaceContainerLowest.getArgb(scheme)
      ),
      surfaceContainerLow: hexFromArgb(MaterialDynamicColors.surfaceContainerLow.getArgb(scheme)),
      surfaceContainer: hexFromArgb(MaterialDynamicColors.surfaceContainer.getArgb(scheme)),
      surfaceContainerHigh: hexFromArgb(MaterialDynamicColors.surfaceContainerHigh.getArgb(scheme)),
      surfaceContainerHighest: hexFromArgb(
        MaterialDynamicColors.surfaceContainerHighest.getArgb(scheme)
      ),
    };
  }

  /**
   * Görseldan piksel verisi çıkar
   */
  private async extractPixelsFromImage(imageUrl: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Performans için görsel boyutunu küçült
        const maxSize = 128;
        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height);
          width *= scale;
          height *= scale;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels: number[] = [];

        // ARGB formatına dönüştür
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const a = imageData.data[i + 3];

          // ARGB integer
          const argb = (a << 24) | (r << 16) | (g << 8) | b;
          pixels.push(argb);
        }

        resolve(pixels);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${imageUrl}`));
      };

      img.src = imageUrl;
    });
  }

  /**
   * CSS değişkenlerini güncelle
   */
  private updateCSSVariables(colors: DynamicColorScheme): void {
    const root = document.documentElement;

    Object.entries(colors).forEach(([key, value]) => {
      // camelCase'i kebab-case'e çevir
      const cssVarName = `--md-sys-color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });

    // Ek MD3 tokenları
    root.style.setProperty('--md-sys-state-hover-opacity', '0.08');
    root.style.setProperty('--md-sys-state-focus-opacity', '0.12');
    root.style.setProperty('--md-sys-state-pressed-opacity', '0.12');
    root.style.setProperty('--md-sys-state-dragged-opacity', '0.16');
    root.style.setProperty('--md-sys-state-disabled-opacity', '0.38');
  }

  /**
   * Karanlık mod değiştir
   */
  public setDarkMode(isDark: boolean): void {
    this.isDarkMode.set(isDark);

    // Mevcut renk varsa yeniden üret
    const current = this.colorScheme();
    if (current) {
      // Ana rengi hex'e çevir ve yeniden üret
      this.generateSchemeFromHex(current.primary);
    }

    // HTML'e class ekle/kaldır
    document.documentElement.classList.toggle('dark-mode', isDark);
  }

  /**
   * Şema tipini değiştir
   */
  public setSchemeType(type: ColorSchemeType): void {
    this.schemeType.set(type);

    // Mevcut renk varsa yeniden üret
    const current = this.colorScheme();
    if (current) {
      this.generateSchemeFromHex(current.primary);
    }
  }

  /**
   * Kontrast seviyesini ayarla
   */
  public setContrastLevel(level: number): void {
    // -1 ile 1 arasında sınırla
    const clampedLevel = Math.max(-1, Math.min(1, level));
    this.contrastLevel.set(clampedLevel);

    // Mevcut renk varsa yeniden üret
    const current = this.colorScheme();
    if (current) {
      this.generateSchemeFromHex(current.primary);
    }
  }

  /**
   * Sayfa içeriğine göre otomatik tema
   */
  public async generateSchemeFromPageContent(): Promise<DynamicColorScheme> {
    // Hero görseli veya ilk büyük görseli bul
    const heroImage = document.querySelector<HTMLImageElement>(
      '.hero-image, .hero img, [class*="hero"] img, main img'
    );

    if (heroImage?.src) {
      try {
        return await this.generateSchemeFromImage(heroImage.src);
      } catch (error) {
        console.warn('Could not extract colors from hero image:', error);
      }
    }

    // Alternatif: Logo'dan renk al
    const logo = document.querySelector<HTMLImageElement>(
      '.logo img, [class*="logo"] img, header img'
    );

    if (logo?.src) {
      try {
        return await this.generateSchemeFromImage(logo.src);
      } catch (error) {
        console.warn('Could not extract colors from logo:', error);
      }
    }

    // Varsayılan tema rengine dön
    return this.generateSchemeFromHex('var(--md-sys-color-primary)');
  }

  /**
   * Kullanıcı tercihini kaydet
   */
  public saveUserPreference(): void {
    const preference = {
      isDarkMode: this.isDarkMode(),
      schemeType: this.schemeType(),
      contrastLevel: this.contrastLevel(),
      primaryColor: this.colorScheme()?.primary,
    };

    localStorage.setItem('md3-color-preference', JSON.stringify(preference));
  }

  /**
   * Kullanıcı tercihini yükle
   */
  public loadUserPreference(): void {
    const stored = localStorage.getItem('md3-color-preference');

    if (stored) {
      try {
        const preference = JSON.parse(stored);

        this.isDarkMode.set(preference.isDarkMode ?? false);
        this.schemeType.set(preference.schemeType ?? 'content');
        this.contrastLevel.set(preference.contrastLevel ?? 0);

        if (preference.primaryColor) {
          this.generateSchemeFromHex(preference.primaryColor);
        }
      } catch (error) {
        console.error('Could not load color preference:', error);
      }
    }
  }
}
