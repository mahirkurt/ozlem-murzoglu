import { Injectable, signal, computed, effect } from '@angular/core';
import { AiPersonalizationService } from './ai-personalization.service';

/**
 * AI-Powered Adaptive Density Service
 * Kullanıcı davranışına göre arayüz yoğunluğunu dinamik olarak ayarlar
 */

export type DensityLevel =
  | 'compact' // Deneyimli kullanıcılar için yoğun düzen
  | 'comfortable' // Standart düzen
  | 'spacious'; // Yeni kullanıcılar için ferah düzen

export interface DensityMetrics {
  clickSpeed: number; // Ortalama tıklama hızı (ms)
  scrollVelocity: number; // Scroll hızı (px/s)
  navigationSpeed: number; // Sayfalar arası geçiş hızı
  interactionRate: number; // Dakikadaki etkileşim sayısı
  errorRate: number; // Hata oranı (%)
  taskCompletionTime: number; // Görev tamamlama süresi (ms)
  focusTime: number; // Bir öğede kalma süresi (ms)
  hesitationCount: number; // Tereddüt sayısı
}

export interface DensityProfile {
  userType: 'novice' | 'intermediate' | 'expert' | 'power-user';
  preferredDensity: DensityLevel;
  adaptiveEnabled: boolean;
  confidence: number; // 0-1 arası güven skoru
  lastUpdated: Date;
}

export interface DensitySettings {
  spacing: {
    base: number;
    scale: number;
    unit: string;
  };
  fontSize: {
    base: number;
    scale: number;
  };
  components: {
    buttonHeight: number;
    inputHeight: number;
    cardPadding: number;
    listItemHeight: number;
    iconSize: number;
  };
  grid: {
    columns: number;
    gap: number;
  };
  animations: {
    duration: number;
    stagger: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AiAdaptiveDensityService {
  // User metrics
  private metrics = signal<DensityMetrics>({
    clickSpeed: 0,
    scrollVelocity: 0,
    navigationSpeed: 0,
    interactionRate: 0,
    errorRate: 0,
    taskCompletionTime: 0,
    focusTime: 0,
    hesitationCount: 0,
  });

  // Density state
  private currentDensity = signal<DensityLevel>('comfortable');
  private userProfile = signal<DensityProfile>({
    userType: 'intermediate',
    preferredDensity: 'comfortable',
    adaptiveEnabled: true,
    confidence: 0.5,
    lastUpdated: new Date(),
  });

  // Learning parameters
  private readonly learningRate = 0.1;
  private readonly confidenceThreshold = 0.7;
  private readonly metricsHistory: DensityMetrics[] = [];
  private readonly maxHistorySize = 100;

  // Density configurations
  private readonly densityConfigs: Record<DensityLevel, DensitySettings> = {
    compact: {
      spacing: { base: 2, scale: 1.25, unit: 'px' },
      fontSize: { base: 13, scale: 1.1 },
      components: {
        buttonHeight: 32,
        inputHeight: 36,
        cardPadding: 12,
        listItemHeight: 40,
        iconSize: 18,
      },
      grid: { columns: 6, gap: 8 },
      animations: { duration: 150, stagger: 20 },
    },
    comfortable: {
      spacing: { base: 4, scale: 1.5, unit: 'px' },
      fontSize: { base: 14, scale: 1.15 },
      components: {
        buttonHeight: 40,
        inputHeight: 44,
        cardPadding: 16,
        listItemHeight: 48,
        iconSize: 24,
      },
      grid: { columns: 4, gap: 16 },
      animations: { duration: 250, stagger: 40 },
    },
    spacious: {
      spacing: { base: 6, scale: 1.618, unit: 'px' },
      fontSize: { base: 16, scale: 1.2 },
      components: {
        buttonHeight: 48,
        inputHeight: 52,
        cardPadding: 24,
        listItemHeight: 56,
        iconSize: 28,
      },
      grid: { columns: 3, gap: 24 },
      animations: { duration: 350, stagger: 60 },
    },
  };

  // Computed values
  public density = computed(() => this.currentDensity());
  public profile = computed(() => this.userProfile());
  public settings = computed(() => this.densityConfigs[this.currentDensity()]);
  public isAdaptive = computed(() => this.userProfile().adaptiveEnabled);

  // Tracking variables
  private lastInteractionTime = Date.now();
  private interactionCount = 0;
  private errorCount = 0;
  private successCount = 0;
  private lastScrollTime = 0;
  private lastScrollPosition = 0;
  private hesitationTimer: any;

  constructor(private aiService: AiPersonalizationService) {
    this.initializeTracking();
    this.loadUserProfile();
    this.startAdaptiveLearning();
  }

  /**
   * Initialize user interaction tracking
   */
  private initializeTracking(): void {
    // Click speed tracking
    document.addEventListener('click', (event) => {
      const now = Date.now();
      const clickSpeed = now - this.lastInteractionTime;

      this.updateMetric('clickSpeed', clickSpeed);
      this.lastInteractionTime = now;
      this.interactionCount++;

      // Check for hesitation
      this.detectHesitation(event);
    });

    // Scroll velocity tracking
    window.addEventListener('scroll', () => {
      const now = Date.now();
      const scrollPosition = window.pageYOffset;
      const timeDiff = now - this.lastScrollTime;
      const scrollDiff = Math.abs(scrollPosition - this.lastScrollPosition);

      if (timeDiff > 0) {
        const velocity = (scrollDiff / timeDiff) * 1000; // px/s
        this.updateMetric('scrollVelocity', velocity);
      }

      this.lastScrollTime = now;
      this.lastScrollPosition = scrollPosition;
    });

    // Navigation speed tracking
    this.trackNavigationSpeed();

    // Error tracking
    this.trackErrors();

    // Focus time tracking
    this.trackFocusTime();

    // Calculate interaction rate every minute
    setInterval(() => {
      const rate = this.interactionCount;
      this.updateMetric('interactionRate', rate);
      this.interactionCount = 0;
    }, 60000);
  }

  /**
   * Track navigation speed between pages
   */
  private trackNavigationSpeed(): void {
    let navigationStartTime = Date.now();

    // Track route changes
    window.addEventListener('popstate', () => {
      const navigationTime = Date.now() - navigationStartTime;
      this.updateMetric('navigationSpeed', navigationTime);
      navigationStartTime = Date.now();
    });
  }

  /**
   * Track user errors
   */
  private trackErrors(): void {
    // Form validation errors
    document.addEventListener(
      'invalid',
      () => {
        this.errorCount++;
        this.calculateErrorRate();
      },
      true
    );

    // Click on disabled elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.hasAttribute('disabled') || target.getAttribute('aria-disabled') === 'true') {
        this.errorCount++;
        this.calculateErrorRate();
      }
    });
  }

  /**
   * Track focus time on elements
   */
  private trackFocusTime(): void {
    let focusStartTime = 0;

    document.addEventListener('focusin', () => {
      focusStartTime = Date.now();
    });

    document.addEventListener('focusout', () => {
      if (focusStartTime > 0) {
        const focusTime = Date.now() - focusStartTime;
        this.updateMetric('focusTime', focusTime);
        focusStartTime = 0;
      }
    });
  }

  /**
   * Detect user hesitation
   */
  private detectHesitation(event: MouseEvent): void {
    clearTimeout(this.hesitationTimer);

    // Check if user hovers over an element for too long before clicking
    const target = event.target as HTMLElement;
    const isInteractive =
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.tagName === 'INPUT' ||
      target.getAttribute('role') === 'button';

    if (isInteractive) {
      this.hesitationTimer = setTimeout(() => {
        this.metrics.update((m) => ({
          ...m,
          hesitationCount: m.hesitationCount + 1,
        }));
      }, 3000); // 3 seconds = hesitation
    }
  }

  /**
   * Calculate error rate
   */
  private calculateErrorRate(): void {
    const totalInteractions = this.errorCount + this.successCount;
    if (totalInteractions > 0) {
      const errorRate = (this.errorCount / totalInteractions) * 100;
      this.updateMetric('errorRate', errorRate);
    }
  }

  /**
   * Update a specific metric
   */
  private updateMetric(metric: keyof DensityMetrics, value: number): void {
    this.metrics.update((m) => ({
      ...m,
      [metric]: this.smoothValue(m[metric], value),
    }));
  }

  /**
   * Smooth metric values using exponential moving average
   */
  private smoothValue(oldValue: number, newValue: number): number {
    return oldValue * (1 - this.learningRate) + newValue * this.learningRate;
  }

  /**
   * Start adaptive learning process
   */
  private startAdaptiveLearning(): void {
    // Run analysis every 30 seconds
    setInterval(() => {
      if (this.userProfile().adaptiveEnabled) {
        this.analyzeUserBehavior();
      }
    }, 30000);

    // Setup effect to apply density changes
    effect(() => {
      const density = this.currentDensity();
      this.applyDensitySettings(density);
    });
  }

  /**
   * Analyze user behavior and adjust density
   */
  private analyzeUserBehavior(): void {
    const metrics = this.metrics();

    // Store metrics history
    this.metricsHistory.push({ ...metrics });
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.shift();
    }

    // Calculate user profile
    const userType = this.classifyUserType(metrics);
    const recommendedDensity = this.recommendDensity(userType, metrics);
    const confidence = this.calculateConfidence(metrics);

    // Update profile
    this.userProfile.update((profile) => ({
      ...profile,
      userType,
      confidence,
      lastUpdated: new Date(),
    }));

    // Apply density if confidence is high enough
    if (confidence >= this.confidenceThreshold && recommendedDensity !== this.currentDensity()) {
      this.setDensity(recommendedDensity, true);
    }
  }

  /**
   * Classify user type based on metrics
   */
  private classifyUserType(metrics: DensityMetrics): DensityProfile['userType'] {
    const score = this.calculateUserScore(metrics);

    if (score < 25) return 'novice';
    if (score < 50) return 'intermediate';
    if (score < 75) return 'expert';
    return 'power-user';
  }

  /**
   * Calculate user proficiency score (0-100)
   */
  private calculateUserScore(metrics: DensityMetrics): number {
    let score = 50; // Start with neutral score

    // Fast interactions increase score
    if (metrics.clickSpeed < 500) score += 10;
    else if (metrics.clickSpeed > 2000) score -= 10;

    // Fast scrolling increases score
    if (metrics.scrollVelocity > 1000) score += 10;
    else if (metrics.scrollVelocity < 200) score -= 10;

    // Fast navigation increases score
    if (metrics.navigationSpeed < 1000) score += 10;
    else if (metrics.navigationSpeed > 5000) score -= 10;

    // High interaction rate increases score
    if (metrics.interactionRate > 30) score += 15;
    else if (metrics.interactionRate < 5) score -= 15;

    // Low error rate increases score
    if (metrics.errorRate < 5) score += 10;
    else if (metrics.errorRate > 20) score -= 20;

    // Low hesitation increases score
    if (metrics.hesitationCount < 2) score += 10;
    else if (metrics.hesitationCount > 5) score -= 15;

    // Short focus time (quick decisions) increases score
    if (metrics.focusTime < 1000) score += 5;
    else if (metrics.focusTime > 5000) score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Recommend density based on user type
   */
  private recommendDensity(
    userType: DensityProfile['userType'],
    metrics: DensityMetrics
  ): DensityLevel {
    // Base recommendation
    const baseRecommendation: Record<DensityProfile['userType'], DensityLevel> = {
      novice: 'spacious',
      intermediate: 'comfortable',
      expert: 'comfortable',
      'power-user': 'compact',
    };

    let recommendation = baseRecommendation[userType];

    // Adjust based on specific metrics
    if (metrics.errorRate > 15 && recommendation === 'compact') {
      recommendation = 'comfortable'; // User struggling, give more space
    }

    if (metrics.hesitationCount > 5 && recommendation !== 'spacious') {
      recommendation = 'spacious'; // User confused, maximize clarity
    }

    if (metrics.interactionRate > 50 && recommendation === 'spacious') {
      recommendation = 'comfortable'; // Very active user, can handle denser UI
    }

    return recommendation;
  }

  /**
   * Calculate confidence in the recommendation
   */
  private calculateConfidence(metrics: DensityMetrics): number {
    // Need enough data points
    if (this.metricsHistory.length < 10) {
      return 0.3; // Low confidence with little data
    }

    // Calculate variance in metrics
    const variance = this.calculateMetricsVariance();

    // High variance = low confidence
    const confidence = Math.max(0, 1 - variance / 100);

    return confidence;
  }

  /**
   * Calculate variance in metrics history
   */
  private calculateMetricsVariance(): number {
    if (this.metricsHistory.length < 2) return 100;

    const scores = this.metricsHistory.map((m) => this.calculateUserScore(m));
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;

    return Math.sqrt(variance);
  }

  /**
   * Set density level
   */
  public setDensity(level: DensityLevel, isAutomatic = false): void {
    this.currentDensity.set(level);

    // Update profile
    this.userProfile.update((profile) => ({
      ...profile,
      preferredDensity: level,
    }));

    // Save preference
    this.saveUserProfile();

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent('density-change', {
        detail: { level, isAutomatic },
      })
    );

    // Log for analytics
    this.logDensityChange(level, isAutomatic);
  }

  /**
   * Apply density settings to DOM
   */
  private applyDensitySettings(density: DensityLevel): void {
    const settings = this.densityConfigs[density];
    const root = document.documentElement;

    // Apply spacing
    root.style.setProperty(
      '--density-spacing-base',
      `${settings.spacing.base}${settings.spacing.unit}`
    );
    root.style.setProperty('--density-spacing-scale', `${settings.spacing.scale}`);

    // Apply font sizes
    root.style.setProperty('--density-font-base', `${settings.fontSize.base}px`);
    root.style.setProperty('--density-font-scale', `${settings.fontSize.scale}`);

    // Apply component sizes
    root.style.setProperty('--density-button-height', `${settings.components.buttonHeight}px`);
    root.style.setProperty('--density-input-height', `${settings.components.inputHeight}px`);
    root.style.setProperty('--density-card-padding', `${settings.components.cardPadding}px`);
    root.style.setProperty('--density-list-item-height', `${settings.components.listItemHeight}px`);
    root.style.setProperty('--density-icon-size', `${settings.components.iconSize}px`);

    // Apply grid settings
    root.style.setProperty('--density-grid-columns', `${settings.grid.columns}`);
    root.style.setProperty('--density-grid-gap', `${settings.grid.gap}px`);

    // Apply animation settings
    root.style.setProperty('--density-animation-duration', `${settings.animations.duration}ms`);
    root.style.setProperty('--density-animation-stagger', `${settings.animations.stagger}ms`);

    // Add density class
    document.body.className = document.body.className.replace(/density-\w+/, '');
    document.body.classList.add(`density-${density}`);
  }

  /**
   * Toggle adaptive mode
   */
  public toggleAdaptive(enabled: boolean): void {
    this.userProfile.update((profile) => ({
      ...profile,
      adaptiveEnabled: enabled,
    }));

    this.saveUserProfile();
  }

  /**
   * Get density recommendations
   */
  public getRecommendations(): {
    current: DensityLevel;
    recommended: DensityLevel;
    confidence: number;
    reason: string;
  } {
    const metrics = this.metrics();
    const userType = this.classifyUserType(metrics);
    const recommended = this.recommendDensity(userType, metrics);
    const confidence = this.calculateConfidence(metrics);

    let reason = '';
    if (userType === 'power-user') {
      reason = 'Hızlı kullanım paternleriniz tespit edildi. Daha yoğun düzen öneriyoruz.';
    } else if (userType === 'novice') {
      reason = 'Rahat kullanım için daha ferah bir düzen öneriyoruz.';
    } else if (metrics.errorRate > 15) {
      reason = 'Hata oranını azaltmak için daha açık bir düzen öneriyoruz.';
    } else {
      reason = 'Mevcut kullanım alışkanlıklarınıza uygun düzen.';
    }

    return {
      current: this.currentDensity(),
      recommended,
      confidence,
      reason,
    };
  }

  /**
   * Reset learning data
   */
  public resetLearning(): void {
    this.metricsHistory.length = 0;
    this.metrics.set({
      clickSpeed: 0,
      scrollVelocity: 0,
      navigationSpeed: 0,
      interactionRate: 0,
      errorRate: 0,
      taskCompletionTime: 0,
      focusTime: 0,
      hesitationCount: 0,
    });

    this.userProfile.update((profile) => ({
      ...profile,
      confidence: 0.5,
      userType: 'intermediate',
    }));
  }

  /**
   * Export user profile
   */
  public exportProfile(): DensityProfile {
    return this.userProfile();
  }

  /**
   * Import user profile
   */
  public importProfile(profile: DensityProfile): void {
    this.userProfile.set(profile);
    this.currentDensity.set(profile.preferredDensity);
    this.saveUserProfile();
  }

  /**
   * Save user profile to localStorage
   */
  private saveUserProfile(): void {
    const profile = this.userProfile();
    localStorage.setItem('density_profile', JSON.stringify(profile));
  }

  /**
   * Load user profile from localStorage
   */
  private loadUserProfile(): void {
    const saved = localStorage.getItem('density_profile');
    if (saved) {
      try {
        const profile = JSON.parse(saved) as DensityProfile;
        this.userProfile.set(profile);
        this.currentDensity.set(profile.preferredDensity);
      } catch (error) {
        console.error('Failed to load density profile:', error);
      }
    }
  }

  /**
   * Log density change for analytics
   */
  private logDensityChange(level: DensityLevel, isAutomatic: boolean): void {
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'density_change', {
        event_category: 'ui_adaptation',
        event_label: level,
        custom_dimension_1: isAutomatic ? 'automatic' : 'manual',
        custom_dimension_2: this.userProfile().userType,
      });
    }
  }
}
