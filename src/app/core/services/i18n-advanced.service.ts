import { Injectable, signal, computed, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';

// Locale imports
import localeEn from '@angular/common/locales/en';
import localeTr from '@angular/common/locales/tr';
import localeAr from '@angular/common/locales/ar';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localeRu from '@angular/common/locales/ru';
import localeZh from '@angular/common/locales/zh';
import localeJa from '@angular/common/locales/ja';

/**
 * Advanced Internationalization Service
 * Multi-language support, RTL layout, locale-specific formatting
 */

export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  currency: string;
  currencyDisplay: 'symbol' | 'code' | 'name';
  numberFormat: {
    decimal: string;
    thousand: string;
    precision: number;
  };
  firstDayOfWeek: number; // 0 = Sunday, 1 = Monday
  weekendDays: number[];
  phoneFormat: string;
  postalCodeFormat: string;
}

export interface TranslationMetadata {
  language: string;
  lastUpdated: Date;
  completeness: number;
  missingKeys: string[];
  fallbackLanguage?: string;
}

export interface PluralRule {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

@Injectable({
  providedIn: 'root',
})
export class I18nAdvancedService {
  // Supported locales configuration
  private readonly locales: Map<string, LocaleConfig> = new Map([
    [
      'en',
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
        dateFormat: 'MM/dd/yyyy',
        timeFormat: 'h:mm a',
        currency: 'USD',
        currencyDisplay: 'symbol',
        numberFormat: {
          decimal: '.',
          thousand: ',',
          precision: 2,
        },
        firstDayOfWeek: 0,
        weekendDays: [0, 6],
        phoneFormat: '+1 (XXX) XXX-XXXX',
        postalCodeFormat: 'XXXXX',
      },
    ],
    [
      'tr',
      {
        code: 'tr',
        name: 'Turkish',
        nativeName: 'Türkçe',
        direction: 'ltr',
        dateFormat: 'dd.MM.yyyy',
        timeFormat: 'HH:mm',
        currency: 'TRY',
        currencyDisplay: 'symbol',
        numberFormat: {
          decimal: ',',
          thousand: '.',
          precision: 2,
        },
        firstDayOfWeek: 1,
        weekendDays: [0, 6],
        phoneFormat: '+90 (XXX) XXX XX XX',
        postalCodeFormat: 'XXXXX',
      },
    ],
    [
      'ar',
      {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        direction: 'rtl',
        dateFormat: 'dd/MM/yyyy',
        timeFormat: 'HH:mm',
        currency: 'SAR',
        currencyDisplay: 'symbol',
        numberFormat: {
          decimal: '٫',
          thousand: '٬',
          precision: 2,
        },
        firstDayOfWeek: 6,
        weekendDays: [5, 6],
        phoneFormat: '+XXX XX XXX XXXX',
        postalCodeFormat: 'XXXXX',
      },
    ],
    [
      'de',
      {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        direction: 'ltr',
        dateFormat: 'dd.MM.yyyy',
        timeFormat: 'HH:mm',
        currency: 'EUR',
        currencyDisplay: 'symbol',
        numberFormat: {
          decimal: ',',
          thousand: '.',
          precision: 2,
        },
        firstDayOfWeek: 1,
        weekendDays: [0, 6],
        phoneFormat: '+49 XXX XXXXXXXX',
        postalCodeFormat: 'XXXXX',
      },
    ],
    [
      'fr',
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        direction: 'ltr',
        dateFormat: 'dd/MM/yyyy',
        timeFormat: 'HH:mm',
        currency: 'EUR',
        currencyDisplay: 'symbol',
        numberFormat: {
          decimal: ',',
          thousand: ' ',
          precision: 2,
        },
        firstDayOfWeek: 1,
        weekendDays: [0, 6],
        phoneFormat: '+33 X XX XX XX XX',
        postalCodeFormat: 'XXXXX',
      },
    ],
  ]);

  // State management
  private currentLocale = signal<LocaleConfig>(this.locales.get('tr')!);
  private availableLanguages = signal<string[]>(['tr', 'en', 'ar', 'de', 'fr']);
  private translationCache = new Map<string, any>();
  private missingTranslations = signal<Set<string>>(new Set());

  // Computed values
  public locale = computed(() => this.currentLocale());
  public isRTL = computed(() => this.currentLocale().direction === 'rtl');
  public languages = computed(() => this.availableLanguages());

  // Pipes for formatting
  private datePipe: DatePipe | null = null;
  private currencyPipe: CurrencyPipe | null = null;
  private decimalPipe: DecimalPipe | null = null;

  constructor(private translate: TranslateService) {
    this.initializeI18n();
  }

  /**
   * Initialize i18n system
   */
  private initializeI18n(): void {
    // Register locales
    registerLocaleData(localeEn);
    registerLocaleData(localeTr);
    registerLocaleData(localeAr);
    registerLocaleData(localeDe);
    registerLocaleData(localeFr);
    registerLocaleData(localeEs);
    registerLocaleData(localeRu);
    registerLocaleData(localeZh);
    registerLocaleData(localeJa);

    // Set default and fallback languages
    this.translate.setDefaultLang('tr');
    this.translate.addLangs(this.availableLanguages());

    // Load saved preference or detect from browser
    const savedLang = localStorage.getItem('preferred-language');
    const browserLang = this.translate.getBrowserLang();
    const initialLang =
      savedLang || (this.availableLanguages().includes(browserLang!) ? browserLang : 'tr');

    this.setLanguage(initialLang!);

    // Setup RTL effect
    effect(() => {
      this.applyRTLLayout(this.isRTL());
    });

    // Monitor missing translations
    this.translate.onTranslationChange.subscribe(() => {
      this.checkTranslationCompleteness();
    });
  }

  /**
   * Change language
   */
  public async setLanguage(langCode: string): Promise<void> {
    const locale = this.locales.get(langCode);
    if (!locale) {
      console.warn(`Locale ${langCode} not supported`);
      return;
    }

    // Load translations
    await this.loadTranslations(langCode);

    // Update state
    this.currentLocale.set(locale);
    this.translate.use(langCode);

    // Update formatters
    this.updateFormatters(langCode);

    // Save preference
    localStorage.setItem('preferred-language', langCode);

    // Update HTML lang attribute
    document.documentElement.lang = langCode;

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('language-changed', { detail: langCode }));
  }

  /**
   * Load translations with caching
   */
  private async loadTranslations(langCode: string): Promise<void> {
    // Check cache first
    if (this.translationCache.has(langCode)) {
      this.translate.setTranslation(langCode, this.translationCache.get(langCode));
      return;
    }

    try {
      // Load from server/assets
      const translations = await this.translate.getTranslation(langCode).toPromise();
      this.translationCache.set(langCode, translations);

      // Load lazy modules translations
      await this.loadModuleTranslations(langCode);
    } catch (error) {
      console.error(`Failed to load translations for ${langCode}:`, error);

      // Fallback to default language
      if (langCode !== 'tr') {
        await this.setLanguage('tr');
      }
    }
  }

  /**
   * Load module-specific translations
   */
  private async loadModuleTranslations(langCode: string): Promise<void> {
    // Dynamically import module translations
    const modules = ['services', 'resources', 'about', 'contact'];

    for (const module of modules) {
      try {
        const moduleTranslations = await import(`../../../assets/i18n/${langCode}/${module}.json`);

        // Merge with existing translations
        const current = this.translate.translations[langCode] || {};
        this.translate.setTranslation(
          langCode,
          {
            ...current,
            [module]: moduleTranslations.default,
          },
          true
        );
      } catch (error) {
        console.warn(`Module translations not found: ${module} for ${langCode}`);
      }
    }
  }

  /**
   * Apply RTL layout
   */
  private applyRTLLayout(isRTL: boolean): void {
    const html = document.documentElement;
    const body = document.body;

    if (isRTL) {
      html.setAttribute('dir', 'rtl');
      body.classList.add('rtl');

      // Adjust Material components for RTL
      this.adjustMaterialComponentsRTL(true);
    } else {
      html.setAttribute('dir', 'ltr');
      body.classList.remove('rtl');

      // Reset Material components
      this.adjustMaterialComponentsRTL(false);
    }
  }

  /**
   * Adjust Material components for RTL
   */
  private adjustMaterialComponentsRTL(isRTL: boolean): void {
    // Add RTL-specific styles
    const styleId = 'rtl-material-adjustments';
    let styleEl = document.getElementById(styleId);

    if (isRTL) {
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.textContent = `
          /* RTL adjustments for Material components */
          .rtl .mat-drawer-content {
            margin-right: auto !important;
            margin-left: 0 !important;
          }
          
          .rtl .mat-drawer {
            transform: translateX(100%);
          }
          
          .rtl .mat-drawer.mat-drawer-opened {
            transform: translateX(0);
          }
          
          .rtl .mat-form-field-prefix {
            margin-left: 0.5em;
            margin-right: 0;
          }
          
          .rtl .mat-form-field-suffix {
            margin-right: 0.5em;
            margin-left: 0;
          }
          
          .rtl .mat-list-item-content {
            flex-direction: row-reverse;
          }
          
          .rtl .mat-tab-label {
            direction: rtl;
          }
          
          .rtl .mat-paginator {
            flex-direction: row-reverse;
          }
          
          .rtl .mat-icon-button {
            transform: scaleX(-1);
          }
          
          .rtl .back-icon,
          .rtl .forward-icon {
            transform: scaleX(-1);
          }
        `;
        document.head.appendChild(styleEl);
      }
    } else {
      if (styleEl) {
        styleEl.remove();
      }
    }
  }

  /**
   * Update formatting pipes
   */
  private updateFormatters(langCode: string): void {
    this.datePipe = new DatePipe(langCode);
    this.currencyPipe = new CurrencyPipe(langCode);
    this.decimalPipe = new DecimalPipe(langCode);
  }

  /**
   * Format date according to locale
   */
  public formatDate(date: Date | string | number, format?: string): string {
    if (!this.datePipe) {
      this.updateFormatters(this.currentLocale().code);
    }

    const localeFormat = format || this.currentLocale().dateFormat;
    return this.datePipe!.transform(date, localeFormat) || '';
  }

  /**
   * Format time according to locale
   */
  public formatTime(date: Date | string | number, format?: string): string {
    if (!this.datePipe) {
      this.updateFormatters(this.currentLocale().code);
    }

    const localeFormat = format || this.currentLocale().timeFormat;
    return this.datePipe!.transform(date, localeFormat) || '';
  }

  /**
   * Format currency according to locale
   */
  public formatCurrency(value: number, currencyCode?: string): string {
    if (!this.currencyPipe) {
      this.updateFormatters(this.currentLocale().code);
    }

    const locale = this.currentLocale();
    const currency = currencyCode || locale.currency;
    const display = locale.currencyDisplay;

    return this.currencyPipe!.transform(value, currency, display) || '';
  }

  /**
   * Format number according to locale
   */
  public formatNumber(value: number, minDigits?: number, maxDigits?: number): string {
    if (!this.decimalPipe) {
      this.updateFormatters(this.currentLocale().code);
    }

    const locale = this.currentLocale();
    const digitsInfo = `1.${minDigits || 0}-${maxDigits || locale.numberFormat.precision}`;

    return this.decimalPipe!.transform(value, digitsInfo) || '';
  }

  /**
   * Format phone number according to locale
   */
  public formatPhoneNumber(phone: string): string {
    const locale = this.currentLocale();
    const format = locale.phoneFormat;
    const digits = phone.replace(/\D/g, '');

    let formatted = format;
    let digitIndex = 0;

    formatted = formatted.replace(/X/g, () => {
      return digitIndex < digits.length ? digits[digitIndex++] : '';
    });

    return formatted.trim();
  }

  /**
   * Get plural form
   */
  public getPluralForm(count: number, forms: PluralRule): string {
    const locale = this.currentLocale().code;
    const pluralRules = new Intl.PluralRules(locale);
    const rule = pluralRules.select(count);

    switch (rule) {
      case 'zero':
        return forms.zero || forms.other;
      case 'one':
        return forms.one || forms.other;
      case 'two':
        return forms.two || forms.other;
      case 'few':
        return forms.few || forms.other;
      case 'many':
        return forms.many || forms.other;
      default:
        return forms.other;
    }
  }

  /**
   * Translate with interpolation and plural support
   */
  public t(key: string, params?: any): string {
    const translation = this.translate.instant(key, params);

    // Track missing translations
    if (translation === key) {
      this.missingTranslations.update((set) => {
        set.add(key);
        return new Set(set);
      });
    }

    // Handle plural forms
    if (params?.count !== undefined && translation.includes('|')) {
      const forms = translation.split('|');
      const pluralForms: PluralRule = {
        zero: forms[0],
        one: forms[1],
        two: forms[2],
        few: forms[3],
        many: forms[4],
        other: forms[5] || forms[forms.length - 1],
      };

      return this.getPluralForm(params.count, pluralForms).replace('{{count}}', params.count);
    }

    return translation;
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  public getRelativeTime(date: Date | string | number): string {
    const rtf = new Intl.RelativeTimeFormat(this.currentLocale().code, {
      numeric: 'auto',
    });

    const now = new Date();
    const then = new Date(date);
    const diff = then.getTime() - now.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (Math.abs(years) >= 1) return rtf.format(years, 'year');
    if (Math.abs(months) >= 1) return rtf.format(months, 'month');
    if (Math.abs(weeks) >= 1) return rtf.format(weeks, 'week');
    if (Math.abs(days) >= 1) return rtf.format(days, 'day');
    if (Math.abs(hours) >= 1) return rtf.format(hours, 'hour');
    if (Math.abs(minutes) >= 1) return rtf.format(minutes, 'minute');
    return rtf.format(seconds, 'second');
  }

  /**
   * Check translation completeness
   */
  private checkTranslationCompleteness(): void {
    const currentLang = this.translate.currentLang;
    const defaultLang = this.translate.defaultLang;

    const currentTranslations = this.translate.translations[currentLang] || {};
    const defaultTranslations = this.translate.translations[defaultLang] || {};

    const missingKeys = this.findMissingKeys(defaultTranslations, currentTranslations);

    if (missingKeys.length > 0) {
      console.warn(`Missing translations for ${currentLang}:`, missingKeys);
      this.missingTranslations.update((set) => {
        missingKeys.forEach((key) => set.add(key));
        return new Set(set);
      });
    }
  }

  /**
   * Find missing translation keys
   */
  private findMissingKeys(source: any, target: any, prefix = ''): string[] {
    const missing: string[] = [];

    for (const key in source) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof source[key] === 'object' && source[key] !== null) {
        missing.push(...this.findMissingKeys(source[key], target[key] || {}, fullKey));
      } else if (!(key in target)) {
        missing.push(fullKey);
      }
    }

    return missing;
  }

  /**
   * Get translation metadata
   */
  public getTranslationMetadata(langCode: string): TranslationMetadata {
    const translations = this.translate.translations[langCode] || {};
    const defaultTranslations = this.translate.translations[this.translate.defaultLang] || {};

    const totalKeys = this.countKeys(defaultTranslations);
    const translatedKeys = this.countKeys(translations);
    const missingKeys = this.findMissingKeys(defaultTranslations, translations);

    return {
      language: langCode,
      lastUpdated: new Date(), // Would come from server/metadata
      completeness: Math.round((translatedKeys / totalKeys) * 100),
      missingKeys,
      fallbackLanguage: this.translate.defaultLang,
    };
  }

  /**
   * Count translation keys
   */
  private countKeys(obj: any): number {
    let count = 0;

    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        count += this.countKeys(obj[key]);
      } else {
        count++;
      }
    }

    return count;
  }

  /**
   * Export missing translations
   */
  public exportMissingTranslations(): Blob {
    const missing = Array.from(this.missingTranslations());
    const data = {
      language: this.currentLocale().code,
      timestamp: new Date().toISOString(),
      missingKeys: missing,
    };

    const json = JSON.stringify(data, null, 2);
    return new Blob([json], { type: 'application/json' });
  }
}
