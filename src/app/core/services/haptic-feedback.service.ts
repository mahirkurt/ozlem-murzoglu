import { Injectable, signal } from '@angular/core';

/**
 * Haptic Feedback Service
 * Dokunsal geri bildirim için gelişmiş servis
 * Web Vibration API ve native platform entegrasyonları
 */

export type HapticStyle =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'soft'
  | 'rigid'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

export interface HapticPattern {
  pattern: number[];
  intensity?: number;
  sharpness?: number;
}

export interface HapticConfig {
  enabled: boolean;
  intensity: number; // 0-1 arası
  customPatterns: Map<string, HapticPattern>;
  platformSpecific: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HapticFeedbackService {
  // Haptic patterns (duration, pause, duration, pause...)
  private readonly patterns: Record<HapticStyle, HapticPattern> = {
    light: {
      pattern: [10],
      intensity: 0.3,
      sharpness: 0.3,
    },
    medium: {
      pattern: [20],
      intensity: 0.5,
      sharpness: 0.5,
    },
    heavy: {
      pattern: [30],
      intensity: 0.8,
      sharpness: 0.8,
    },
    soft: {
      pattern: [15, 10, 15],
      intensity: 0.2,
      sharpness: 0.1,
    },
    rigid: {
      pattern: [5, 5, 5, 5, 5],
      intensity: 1.0,
      sharpness: 1.0,
    },
    success: {
      pattern: [10, 50, 10, 50, 20],
      intensity: 0.6,
      sharpness: 0.7,
    },
    warning: {
      pattern: [30, 30, 30],
      intensity: 0.7,
      sharpness: 0.8,
    },
    error: {
      pattern: [50, 100, 50],
      intensity: 0.9,
      sharpness: 1.0,
    },
    selection: {
      pattern: [5],
      intensity: 0.4,
      sharpness: 0.6,
    },
  };

  // Configuration
  private config = signal<HapticConfig>({
    enabled: true,
    intensity: 1.0,
    customPatterns: new Map(),
    platformSpecific: true,
  });

  // Platform detection
  private isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  private isAndroid = /Android/i.test(navigator.userAgent);
  private supportsVibration = 'vibrate' in navigator;
  private supportsHapticEngine = 'HapticEngine' in window || 'webkit' in window;

  // iOS Haptic Engine (if available)
  private hapticEngine: any = null;

  constructor() {
    this.initializeHapticEngine();
    this.loadUserPreferences();
  }

  /**
   * Initialize platform-specific haptic engine
   */
  private initializeHapticEngine(): void {
    // Check for iOS Haptic Engine
    if (this.isIOS && this.supportsHapticEngine) {
      try {
        // iOS 13+ Haptic Touch API
        if ('HapticEngine' in window) {
          this.hapticEngine = (window as any).HapticEngine;
        }
        // Older iOS WebKit
        else if ('webkit' in window && (window as any).webkit.messageHandlers?.haptic) {
          this.hapticEngine = (window as any).webkit.messageHandlers.haptic;
        }
      } catch (error) {
        console.warn('Haptic Engine initialization failed:', error);
      }
    }

    // Check for Taptic Engine support
    this.checkTapticEngineSupport();
  }

  /**
   * Check for Taptic Engine support (iOS)
   */
  private checkTapticEngineSupport(): void {
    if (this.isIOS) {
      // Create a test vibration to check support
      const testVibration = () => {
        if (this.supportsVibration) {
          navigator.vibrate(1);
        }
      };

      // Request permission on user interaction
      document.addEventListener('touchstart', testVibration, { once: true });
    }
  }

  /**
   * Main haptic feedback method
   */
  public trigger(style: HapticStyle = 'light', customPattern?: HapticPattern): void {
    if (!this.config().enabled) return;

    const pattern = customPattern || this.patterns[style];
    const adjustedPattern = this.adjustPatternForIntensity(pattern);

    // Platform-specific implementation
    if (this.config().platformSpecific) {
      this.triggerPlatformSpecific(style, adjustedPattern);
    } else {
      this.triggerGeneric(adjustedPattern);
    }

    // Log for analytics
    this.logHapticEvent(style);
  }

  /**
   * Platform-specific haptic trigger
   */
  private triggerPlatformSpecific(style: HapticStyle, pattern: HapticPattern): void {
    if (this.isIOS) {
      this.triggerIOS(style, pattern);
    } else if (this.isAndroid) {
      this.triggerAndroid(pattern);
    } else {
      this.triggerGeneric(pattern);
    }
  }

  /**
   * iOS-specific haptic feedback
   */
  private triggerIOS(style: HapticStyle, pattern: HapticPattern): void {
    // Try iOS Haptic Engine first
    if (this.hapticEngine) {
      try {
        // iOS 13+ CoreHaptics style
        if (this.hapticEngine.playPattern) {
          this.hapticEngine.playPattern({
            pattern: this.convertToIOSPattern(pattern),
            style: this.mapToIOSStyle(style),
          });
          return;
        }
        // Older iOS WebKit message
        else if (this.hapticEngine.postMessage) {
          this.hapticEngine.postMessage({
            type: 'haptic',
            style: this.mapToIOSStyle(style),
          });
          return;
        }
      } catch (error) {
        console.debug('iOS Haptic Engine failed, falling back to vibration:', error);
      }
    }

    // Fallback to standard vibration
    this.triggerGeneric(pattern);
  }

  /**
   * Android-specific haptic feedback
   */
  private triggerAndroid(pattern: HapticPattern): void {
    if (this.supportsVibration) {
      // Android supports pattern arrays directly
      navigator.vibrate(pattern.pattern);
    }

    // Check for Android-specific haptic APIs
    if ('HapticFeedback' in window) {
      try {
        const haptic = (window as any).HapticFeedback;
        haptic.perform(this.mapToAndroidConstant(pattern.intensity || 0.5));
      } catch (error) {
        console.debug('Android HapticFeedback API failed:', error);
      }
    }
  }

  /**
   * Generic haptic feedback (cross-platform)
   */
  private triggerGeneric(pattern: HapticPattern): void {
    if (this.supportsVibration) {
      navigator.vibrate(pattern.pattern);
    } else {
      // Visual feedback fallback
      this.visualFeedbackFallback();
    }
  }

  /**
   * Adjust pattern intensity
   */
  private adjustPatternForIntensity(pattern: HapticPattern): HapticPattern {
    const intensity = this.config().intensity * (pattern.intensity || 1);

    return {
      ...pattern,
      pattern: pattern.pattern.map((duration) => Math.round(duration * intensity)),
      intensity,
    };
  }

  /**
   * Convert to iOS pattern format
   */
  private convertToIOSPattern(pattern: HapticPattern): any {
    return {
      events: pattern.pattern.map((duration, index) => ({
        eventType: index % 2 === 0 ? 'hapticTransient' : 'pause',
        time: duration / 1000, // Convert to seconds
        eventParameters: {
          intensity: pattern.intensity || 0.5,
          sharpness: pattern.sharpness || 0.5,
        },
      })),
    };
  }

  /**
   * Map style to iOS haptic style
   */
  private mapToIOSStyle(style: HapticStyle): string {
    const mapping: Record<HapticStyle, string> = {
      light: 'impactLight',
      medium: 'impactMedium',
      heavy: 'impactHeavy',
      soft: 'selection',
      rigid: 'impactRigid',
      success: 'notificationSuccess',
      warning: 'notificationWarning',
      error: 'notificationError',
      selection: 'selection',
    };

    return mapping[style] || 'impactLight';
  }

  /**
   * Map intensity to Android haptic constant
   */
  private mapToAndroidConstant(intensity: number): number {
    // Android haptic feedback constants
    const HAPTIC_FEEDBACK_CONSTANTS = {
      CLOCK_TICK: 4,
      CONTEXT_CLICK: 6,
      KEYBOARD_PRESS: 3,
      KEYBOARD_RELEASE: 7,
      KEYBOARD_TAP: 3,
      LONG_PRESS: 0,
      TEXT_HANDLE_MOVE: 9,
      VIRTUAL_KEY: 1,
      VIRTUAL_KEY_RELEASE: 2,
    };

    if (intensity < 0.3) return HAPTIC_FEEDBACK_CONSTANTS.CLOCK_TICK;
    if (intensity < 0.6) return HAPTIC_FEEDBACK_CONSTANTS.KEYBOARD_TAP;
    if (intensity < 0.8) return HAPTIC_FEEDBACK_CONSTANTS.CONTEXT_CLICK;
    return HAPTIC_FEEDBACK_CONSTANTS.LONG_PRESS;
  }

  /**
   * Visual feedback fallback for devices without haptic support
   */
  private visualFeedbackFallback(): void {
    // Create a subtle visual pulse effect
    const element = document.activeElement as HTMLElement;
    if (!element) return;

    element.style.transition = 'transform 100ms ease-out';
    element.style.transform = 'scale(0.98)';

    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 100);
  }

  /**
   * Button click haptic
   */
  public buttonClick(): void {
    this.trigger('light');
  }

  /**
   * Toggle/Switch haptic
   */
  public toggleSwitch(enabled: boolean): void {
    this.trigger(enabled ? 'success' : 'light');
  }

  /**
   * Slider change haptic
   */
  public sliderChange(): void {
    this.trigger('selection');
  }

  /**
   * Tab selection haptic
   */
  public tabSelect(): void {
    this.trigger('medium');
  }

  /**
   * Long press haptic
   */
  public longPress(): void {
    this.trigger('heavy');
  }

  /**
   * Drag start/end haptic
   */
  public dragStart(): void {
    this.trigger('medium');
  }

  public dragEnd(): void {
    this.trigger('light');
  }

  /**
   * Success feedback
   */
  public success(): void {
    this.trigger('success');
  }

  /**
   * Error feedback
   */
  public error(): void {
    this.trigger('error');
  }

  /**
   * Warning feedback
   */
  public warning(): void {
    this.trigger('warning');
  }

  /**
   * Custom pattern
   */
  public custom(name: string): void {
    const customPattern = this.config().customPatterns.get(name);
    if (customPattern) {
      this.trigger('light', customPattern);
    }
  }

  /**
   * Register custom pattern
   */
  public registerPattern(name: string, pattern: HapticPattern): void {
    this.config.update((config) => {
      config.customPatterns.set(name, pattern);
      return config;
    });
  }

  /**
   * Morse code haptic
   */
  public morseCode(text: string): void {
    const morseMap: Record<string, string> = {
      A: '.-',
      B: '-...',
      C: '-.-.',
      D: '-..',
      E: '.',
      F: '..-.',
      G: '--.',
      H: '....',
      I: '..',
      J: '.---',
      K: '-.-',
      L: '.-..',
      M: '--',
      N: '-.',
      O: '---',
      P: '.--.',
      Q: '--.-',
      R: '.-.',
      S: '...',
      T: '-',
      U: '..-',
      V: '...-',
      W: '.--',
      X: '-..-',
      Y: '-.--',
      Z: '--..',
      '0': '-----',
      '1': '.----',
      '2': '..---',
      '3': '...--',
      '4': '....-',
      '5': '.....',
      '6': '-....',
      '7': '--...',
      '8': '---..',
      '9': '----.',
    };

    const pattern: number[] = [];
    const dot = 100;
    const dash = 300;
    const pause = 100;

    text
      .toUpperCase()
      .split('')
      .forEach((char, index) => {
        const morse = morseMap[char];
        if (morse) {
          morse.split('').forEach((symbol, symbolIndex) => {
            if (symbolIndex > 0) pattern.push(pause);
            pattern.push(symbol === '.' ? dot : dash);
          });
          if (index < text.length - 1) pattern.push(pause * 3);
        }
      });

    this.trigger('light', { pattern });
  }

  /**
   * Rhythm pattern
   */
  public rhythm(bpm: number, beats: number): void {
    const beatDuration = 60000 / bpm; // ms per beat
    const pattern: number[] = [];

    for (let i = 0; i < beats; i++) {
      if (i > 0) pattern.push(beatDuration - 50);
      pattern.push(50); // Short haptic pulse
    }

    this.trigger('light', { pattern });
  }

  /**
   * Configure haptic settings
   */
  public configure(config: Partial<HapticConfig>): void {
    this.config.update((current) => ({ ...current, ...config }));
    this.saveUserPreferences();
  }

  /**
   * Enable/disable haptic feedback
   */
  public setEnabled(enabled: boolean): void {
    this.config.update((config) => ({ ...config, enabled }));
    this.saveUserPreferences();
  }

  /**
   * Set intensity (0-1)
   */
  public setIntensity(intensity: number): void {
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    this.config.update((config) => ({ ...config, intensity: clampedIntensity }));
    this.saveUserPreferences();
  }

  /**
   * Check if haptic is supported
   */
  public isSupported(): boolean {
    return this.supportsVibration || this.supportsHapticEngine;
  }

  /**
   * Get platform info
   */
  public getPlatformInfo(): {
    platform: string;
    supportsVibration: boolean;
    supportsHapticEngine: boolean;
    features: string[];
  } {
    const features: string[] = [];

    if (this.supportsVibration) features.push('vibration');
    if (this.supportsHapticEngine) features.push('haptic-engine');
    if (this.isIOS) features.push('ios-taptic');
    if (this.isAndroid) features.push('android-haptic');

    return {
      platform: this.isIOS ? 'iOS' : this.isAndroid ? 'Android' : 'Web',
      supportsVibration: this.supportsVibration,
      supportsHapticEngine: this.supportsHapticEngine,
      features,
    };
  }

  /**
   * Save user preferences
   */
  private saveUserPreferences(): void {
    const preferences = {
      enabled: this.config().enabled,
      intensity: this.config().intensity,
      platformSpecific: this.config().platformSpecific,
    };

    localStorage.setItem('haptic_preferences', JSON.stringify(preferences));
  }

  /**
   * Load user preferences
   */
  private loadUserPreferences(): void {
    const saved = localStorage.getItem('haptic_preferences');
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        this.config.update((config) => ({ ...config, ...preferences }));
      } catch (error) {
        console.error('Failed to load haptic preferences:', error);
      }
    }
  }

  /**
   * Log haptic event for analytics
   */
  private logHapticEvent(style: HapticStyle): void {
    // This would integrate with analytics service
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'haptic_feedback', {
        event_category: 'interaction',
        event_label: style,
        value: this.config().intensity,
      });
    }
  }
}
