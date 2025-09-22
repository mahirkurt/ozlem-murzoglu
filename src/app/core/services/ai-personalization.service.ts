import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

/**
 * AI-Powered Personalization Service
 * Provides intelligent theme recommendations, user behavior analysis,
 * and biometric mood detection for personalized experiences
 */

// User behavior interfaces
export interface UserBehavior {
  clickPatterns: ClickPattern[];
  scrollBehavior: ScrollBehavior;
  timeSpent: TimeMetrics;
  interactions: InteractionMetrics;
  preferences: UserPreferences;
  mood: MoodIndicators;
}

export interface ClickPattern {
  element: string;
  timestamp: number;
  coordinates: { x: number; y: number };
  duration: number;
  pressure?: number;
}

export interface ScrollBehavior {
  speed: number;
  depth: number;
  pattern: 'linear' | 'skimming' | 'detailed' | 'searching';
  pausePoints: number[];
}

export interface TimeMetrics {
  totalTime: number;
  activeTime: number;
  idleTime: number;
  pageViews: Map<string, number>;
  avgSessionDuration: number;
}

export interface InteractionMetrics {
  mouseMovements: number;
  keystrokes: number;
  formInteractions: number;
  buttonClicks: number;
  linkClicks: number;
  hoverTime: Map<string, number>;
}

export interface UserPreferences {
  colorScheme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  contrast: 'normal' | 'high';
  motion: 'full' | 'reduced';
  language: string;
  timezone: string;
}

export interface MoodIndicators {
  current: Mood;
  history: MoodHistory[];
  confidence: number;
  factors: MoodFactor[];
}

export interface Mood {
  type: 'calm' | 'focused' | 'stressed' | 'happy' | 'tired' | 'energetic';
  intensity: number;
  timestamp: number;
}

export interface MoodHistory {
  mood: Mood;
  duration: number;
}

export interface MoodFactor {
  name: string;
  impact: number;
  data: any;
}

// AI Theme recommendations
export interface ThemeRecommendation {
  theme: ThemeConfig;
  reason: string;
  confidence: number;
  alternatives: ThemeConfig[];
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    surface: string;
  };
  typography: {
    scale: number;
    contrast: number;
  };
  spacing: {
    density: number;
  };
  motion: {
    speed: number;
    smoothness: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AIPersonalizationService {
  private http = inject(HttpClient);

  // User behavior tracking
  private userBehavior$ = new BehaviorSubject<UserBehavior>(this.getDefaultBehavior());
  private currentMood = signal<Mood>({ type: 'calm', intensity: 0.5, timestamp: Date.now() });

  // ML Model parameters
  private readonly ML_ENDPOINT = '/api/ml/personalization';
  private readonly BEHAVIOR_BUFFER_SIZE = 100;
  private readonly MOOD_UPDATE_INTERVAL = 60000; // 1 minute

  // Behavioral data collectors
  private clickBuffer: ClickPattern[] = [];
  private scrollData: ScrollBehavior = {
    speed: 0,
    depth: 0,
    pattern: 'linear',
    pausePoints: [],
  };

  // Biometric sensors (if available)
  private webcamStream: MediaStream | null = null;
  private heartRateMonitor: any = null;

  constructor() {
    this.initializeBehaviorTracking();
    this.initializeMoodDetection();
    this.startPersonalizationEngine();
  }

  /**
   * Initialize behavior tracking
   */
  private initializeBehaviorTracking(): void {
    // Track clicks
    this.trackClicks();

    // Track scrolling
    this.trackScrolling();

    // Track mouse movements
    this.trackMouseMovements();

    // Track keyboard activity
    this.trackKeyboardActivity();

    // Track time metrics
    this.trackTimeMetrics();

    // Track form interactions
    this.trackFormInteractions();
  }

  /**
   * Track user clicks
   */
  private trackClicks(): void {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(debounceTime(50))
      .subscribe((event) => {
        const pattern: ClickPattern = {
          element: (event.target as HTMLElement).tagName,
          timestamp: Date.now(),
          coordinates: { x: event.clientX, y: event.clientY },
          duration: 0, // Will be calculated
          pressure: (event as any).pressure,
        };

        this.clickBuffer.push(pattern);
        if (this.clickBuffer.length > this.BEHAVIOR_BUFFER_SIZE) {
          this.clickBuffer.shift();
        }

        this.analyzeClickPatterns();
      });
  }

  /**
   * Analyze click patterns
   */
  private analyzeClickPatterns(): void {
    if (this.clickBuffer.length < 10) return;

    // Calculate click velocity
    const recentClicks = this.clickBuffer.slice(-10);
    const timeSpan = recentClicks[9].timestamp - recentClicks[0].timestamp;
    const clickVelocity = 10 / (timeSpan / 1000); // clicks per second

    // Detect stress patterns
    if (clickVelocity > 3) {
      this.updateMoodFactor('click_velocity', 'stressed', 0.3);
    } else if (clickVelocity < 0.5) {
      this.updateMoodFactor('click_velocity', 'calm', 0.2);
    }

    // Detect precision (focus indicator)
    const avgMovement = this.calculateAverageMovement(recentClicks);
    if (avgMovement < 50) {
      this.updateMoodFactor('click_precision', 'focused', 0.25);
    }
  }

  /**
   * Track scrolling behavior
   */
  private trackScrolling(): void {
    let lastScrollY = 0;
    const scrollSpeeds: number[] = [];

    fromEvent(window, 'scroll')
      .pipe(debounceTime(100))
      .subscribe(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        const scrollSpeed = scrollDelta / 0.1; // pixels per second

        scrollSpeeds.push(scrollSpeed);
        if (scrollSpeeds.length > 20) scrollSpeeds.shift();

        // Update scroll behavior
        this.scrollData = {
          speed: scrollSpeeds.reduce((a, b) => a + b, 0) / scrollSpeeds.length,
          depth: (currentScrollY / document.body.scrollHeight) * 100,
          pattern: this.detectScrollPattern(scrollSpeeds),
          pausePoints: this.detectPausePoints(currentScrollY),
        };

        lastScrollY = currentScrollY;
        this.analyzeScrollBehavior();
      });
  }

  /**
   * Detect scroll pattern
   */
  private detectScrollPattern(speeds: number[]): 'linear' | 'skimming' | 'detailed' | 'searching' {
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const variance = this.calculateVariance(speeds);

    if (avgSpeed > 1000 && variance < 500) return 'skimming';
    if (avgSpeed < 200 && variance < 100) return 'detailed';
    if (variance > 1000) return 'searching';
    return 'linear';
  }

  /**
   * Analyze scroll behavior
   */
  private analyzeScrollBehavior(): void {
    switch (this.scrollData.pattern) {
      case 'skimming':
        this.updateMoodFactor('scroll_pattern', 'energetic', 0.2);
        break;
      case 'detailed':
        this.updateMoodFactor('scroll_pattern', 'focused', 0.3);
        break;
      case 'searching':
        this.updateMoodFactor('scroll_pattern', 'stressed', 0.15);
        break;
    }
  }

  /**
   * Track mouse movements
   */
  private trackMouseMovements(): void {
    let movements = 0;
    let lastPosition = { x: 0, y: 0 };

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(debounceTime(50))
      .subscribe((event) => {
        const distance = Math.sqrt(
          Math.pow(event.clientX - lastPosition.x, 2) + Math.pow(event.clientY - lastPosition.y, 2)
        );

        if (distance > 5) {
          movements++;
          lastPosition = { x: event.clientX, y: event.clientY };
        }

        // Analyze movement patterns every 100 movements
        if (movements % 100 === 0) {
          this.analyzeMouseMovements(movements);
        }
      });
  }

  /**
   * Track keyboard activity
   */
  private trackKeyboardActivity(): void {
    let keystrokes = 0;
    const typingSpeed: number[] = [];
    let lastKeystroke = Date.now();

    fromEvent<KeyboardEvent>(document, 'keydown').subscribe(() => {
      const now = Date.now();
      const timeDiff = now - lastKeystroke;

      if (timeDiff < 1000) {
        typingSpeed.push(1000 / timeDiff); // keys per second
        if (typingSpeed.length > 20) typingSpeed.shift();
      }

      keystrokes++;
      lastKeystroke = now;

      if (keystrokes % 50 === 0) {
        this.analyzeTypingBehavior(typingSpeed);
      }
    });
  }

  /**
   * Track time metrics
   */
  private trackTimeMetrics(): void {
    let activeTime = 0;
    let idleTime = 0;
    let lastActivity = Date.now();

    // Track active/idle time
    interval(1000).subscribe(() => {
      const now = Date.now();
      if (now - lastActivity > 5000) {
        idleTime++;
      } else {
        activeTime++;
      }
    });

    // Update last activity on any interaction
    ['click', 'keydown', 'mousemove', 'scroll'].forEach((event) => {
      fromEvent(document, event).subscribe(() => {
        lastActivity = Date.now();
      });
    });
  }

  /**
   * Track form interactions
   */
  private trackFormInteractions(): void {
    fromEvent(document, 'focus', true).subscribe((event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        this.updateMoodFactor('form_interaction', 'focused', 0.1);
      }
    });
  }

  /**
   * Initialize mood detection
   */
  private initializeMoodDetection(): void {
    // Start periodic mood updates
    interval(this.MOOD_UPDATE_INTERVAL).subscribe(() => {
      this.detectMood();
    });

    // Initialize biometric sensors if available
    this.initializeBiometricSensors();
  }

  /**
   * Initialize biometric sensors
   */
  private async initializeBiometricSensors(): Promise<void> {
    // Webcam for facial expression analysis
    if (await this.checkCameraPermission()) {
      this.initializeWebcam();
    }

    // Heart rate from smart devices (if available)
    if ('bluetooth' in navigator) {
      this.initializeHeartRateMonitor();
    }

    // Ambient light sensor for environment detection
    if ('AmbientLightSensor' in window) {
      this.initializeAmbientLightSensor();
    }
  }

  /**
   * Check camera permission
   */
  private async checkCameraPermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Initialize webcam for facial expression
   */
  private async initializeWebcam(): Promise<void> {
    try {
      this.webcamStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
      });

      // Analyze facial expressions periodically
      interval(5000).subscribe(() => {
        this.analyzeFacialExpression();
      });
    } catch (error) {
      console.log('Webcam not available for mood detection');
    }
  }

  /**
   * Analyze facial expression
   */
  private async analyzeFacialExpression(): Promise<void> {
    if (!this.webcamStream) return;

    // Create video element
    const video = document.createElement('video');
    video.srcObject = this.webcamStream;
    video.play();

    // Capture frame
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      ctx?.drawImage(video, 0, 0, 320, 240);
      const imageData = canvas.toDataURL('image/jpeg');

      // Send to ML model for analysis
      this.analyzeImage(imageData);
    };
  }

  /**
   * Initialize heart rate monitor
   */
  private async initializeHeartRateMonitor(): Promise<void> {
    try {
      // Connect to Bluetooth heart rate monitor
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');

      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const heartRate = value.getUint8(1);
        this.analyzeHeartRate(heartRate);
      });

      await characteristic.startNotifications();
    } catch (error) {
      console.log('Heart rate monitor not available');
    }
  }

  /**
   * Initialize ambient light sensor
   */
  private initializeAmbientLightSensor(): void {
    try {
      const sensor = new (window as any).AmbientLightSensor();
      sensor.addEventListener('reading', () => {
        this.analyzeAmbientLight(sensor.illuminance);
      });
      sensor.start();
    } catch (error) {
      console.log('Ambient light sensor not available');
    }
  }

  /**
   * Detect mood based on all factors
   */
  private detectMood(): void {
    const factors: MoodFactor[] = [];
    const behavior = this.userBehavior$.value;

    // Analyze click patterns
    if (this.clickBuffer.length > 0) {
      const clickFactor = this.analyzeClicksForMood();
      factors.push(clickFactor);
    }

    // Analyze scroll behavior
    if (this.scrollData.speed > 0) {
      const scrollFactor = this.analyzeScrollForMood();
      factors.push(scrollFactor);
    }

    // Analyze time patterns
    const timeFactor = this.analyzeTimeForMood();
    factors.push(timeFactor);

    // Calculate weighted mood
    const mood = this.calculateMood(factors);
    this.currentMood.set(mood);

    // Update mood history
    this.updateMoodHistory(mood);
  }

  /**
   * Calculate mood from factors
   */
  private calculateMood(factors: MoodFactor[]): Mood {
    const moodScores: Map<string, number> = new Map();

    // Calculate weighted scores
    factors.forEach((factor) => {
      const currentScore = moodScores.get(factor.name) || 0;
      moodScores.set(factor.name, currentScore + factor.impact);
    });

    // Find dominant mood
    let dominantMood: string = 'calm';
    let maxScore = 0;

    moodScores.forEach((score, mood) => {
      if (score > maxScore) {
        maxScore = score;
        dominantMood = mood;
      }
    });

    return {
      type: dominantMood as any,
      intensity: Math.min(maxScore, 1),
      timestamp: Date.now(),
    };
  }

  /**
   * Start personalization engine
   */
  private startPersonalizationEngine(): void {
    // Generate recommendations periodically
    interval(30000).subscribe(() => {
      this.generateThemeRecommendation();
    });

    // Adapt UI based on mood
    this.currentMood.subscribe((mood) => {
      this.adaptUIToMood(mood);
    });
  }

  /**
   * Generate theme recommendation
   */
  public async generateThemeRecommendation(): Promise<ThemeRecommendation> {
    const behavior = this.userBehavior$.value;
    const mood = this.currentMood();

    // Prepare ML input
    const mlInput = {
      behavior: this.serializeBehavior(behavior),
      mood: mood,
      time: {
        hour: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        season: this.getCurrentSeason(),
      },
      device: {
        type: this.getDeviceType(),
        screenSize: { width: window.innerWidth, height: window.innerHeight },
      },
    };

    // Call ML model (simulated for now)
    const recommendation = await this.callMLModel(mlInput);

    return recommendation;
  }

  /**
   * Call ML model for recommendation
   */
  private async callMLModel(input: any): Promise<ThemeRecommendation> {
    // Simulated ML response
    const mood = this.currentMood();

    const themes: Record<string, ThemeConfig> = {
      calm: {
        colors: {
          primary: 'var(--md-sys-color-primary)',
          secondary: 'var(--md-sys-color-secondary)',
          tertiary: 'var(--md-sys-color-tertiary)',
          background: '#FAFAFA',
          surface: 'var(--md-sys-color-surface)',
        },
        typography: { scale: 1, contrast: 1 },
        spacing: { density: 1 },
        motion: { speed: 1, smoothness: 1 },
      },
      focused: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          tertiary: '#FFA726',
          background: 'var(--md-sys-color-surface)',
          surface: 'var(--md-sys-color-surface-container)',
        },
        typography: { scale: 0.95, contrast: 1.1 },
        spacing: { density: 0.9 },
        motion: { speed: 0.8, smoothness: 0.9 },
      },
      stressed: {
        colors: {
          primary: '#43A047',
          secondary: '#81C784',
          tertiary: '#AED581',
          background: '#F1F8E9',
          surface: 'var(--md-sys-color-surface)',
        },
        typography: { scale: 1.05, contrast: 0.95 },
        spacing: { density: 1.1 },
        motion: { speed: 0.7, smoothness: 1.2 },
      },
      happy: {
        colors: {
          primary: 'var(--md-sys-color-secondary)',
          secondary: '#FF6F00',
          tertiary: '#FFD54F',
          background: '#FFF8E1',
          surface: 'var(--md-sys-color-surface)',
        },
        typography: { scale: 1.02, contrast: 1 },
        spacing: { density: 1.05 },
        motion: { speed: 1.1, smoothness: 1.1 },
      },
      tired: {
        colors: {
          primary: '#5E35B1',
          secondary: '#7E57C2',
          tertiary: '#9575CD',
          background: '#EDE7F6',
          surface: 'var(--md-sys-color-surface)',
        },
        typography: { scale: 1.1, contrast: 0.9 },
        spacing: { density: 1.2 },
        motion: { speed: 0.6, smoothness: 1.3 },
      },
      energetic: {
        colors: {
          primary: 'var(--md-sys-color-error)',
          secondary: '#FF5722',
          tertiary: 'var(--md-sys-color-tertiary)',
          background: '#FFEBEE',
          surface: 'var(--md-sys-color-surface)',
        },
        typography: { scale: 0.98, contrast: 1.05 },
        spacing: { density: 0.95 },
        motion: { speed: 1.2, smoothness: 0.9 },
      },
    };

    return {
      theme: themes[mood.type] || themes.calm,
      reason: `Based on your ${mood.type} mood and behavior patterns`,
      confidence: 0.85,
      alternatives: Object.values(themes).slice(0, 3),
    };
  }

  /**
   * Adapt UI to mood
   */
  private adaptUIToMood(mood: Mood): void {
    const root = document.documentElement;

    // Adjust animation speeds based on mood
    switch (mood.type) {
      case 'stressed':
      case 'tired':
        root.style.setProperty('--animation-speed', '1.5');
        break;
      case 'energetic':
      case 'happy':
        root.style.setProperty('--animation-speed', '0.8');
        break;
      default:
        root.style.setProperty('--animation-speed', '1');
    }

    // Adjust color temperature
    if (mood.type === 'tired') {
      root.style.setProperty('--color-temperature', 'warm');
    } else if (mood.type === 'focused') {
      root.style.setProperty('--color-temperature', 'cool');
    }
  }

  /**
   * Helper functions
   */
  private getDefaultBehavior(): UserBehavior {
    return {
      clickPatterns: [],
      scrollBehavior: {
        speed: 0,
        depth: 0,
        pattern: 'linear',
        pausePoints: [],
      },
      timeSpent: {
        totalTime: 0,
        activeTime: 0,
        idleTime: 0,
        pageViews: new Map(),
        avgSessionDuration: 0,
      },
      interactions: {
        mouseMovements: 0,
        keystrokes: 0,
        formInteractions: 0,
        buttonClicks: 0,
        linkClicks: 0,
        hoverTime: new Map(),
      },
      preferences: {
        colorScheme: 'auto',
        fontSize: 'medium',
        contrast: 'normal',
        motion: 'full',
        language: 'tr',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      mood: {
        current: { type: 'calm', intensity: 0.5, timestamp: Date.now() },
        history: [],
        confidence: 0.5,
        factors: [],
      },
    };
  }

  private calculateAverageMovement(clicks: ClickPattern[]): number {
    if (clicks.length < 2) return 0;

    let totalMovement = 0;
    for (let i = 1; i < clicks.length; i++) {
      const distance = Math.sqrt(
        Math.pow(clicks[i].coordinates.x - clicks[i - 1].coordinates.x, 2) +
          Math.pow(clicks[i].coordinates.y - clicks[i - 1].coordinates.y, 2)
      );
      totalMovement += distance;
    }

    return totalMovement / (clicks.length - 1);
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  private detectPausePoints(scrollY: number): number[] {
    // Simplified pause point detection
    return [];
  }

  private updateMoodFactor(name: string, mood: string, impact: number): void {
    // Update mood factors
  }

  private analyzeMouseMovements(movements: number): void {
    // Analyze mouse movement patterns
  }

  private analyzeTypingBehavior(speeds: number[]): void {
    // Analyze typing behavior
  }

  private analyzeImage(imageData: string): void {
    // Send to ML model for facial expression analysis
  }

  private analyzeHeartRate(heartRate: number): void {
    // Analyze heart rate for stress/calm detection
  }

  private analyzeAmbientLight(illuminance: number): void {
    // Analyze ambient light for environment detection
  }

  private analyzeClicksForMood(): MoodFactor {
    return { name: 'clicks', impact: 0.2, data: this.clickBuffer };
  }

  private analyzeScrollForMood(): MoodFactor {
    return { name: 'scroll', impact: 0.15, data: this.scrollData };
  }

  private analyzeTimeForMood(): MoodFactor {
    const hour = new Date().getHours();
    let mood = 'calm';
    let impact = 0.1;

    if (hour >= 9 && hour <= 11) {
      mood = 'energetic';
      impact = 0.15;
    } else if (hour >= 14 && hour <= 16) {
      mood = 'tired';
      impact = 0.2;
    } else if (hour >= 20) {
      mood = 'tired';
      impact = 0.25;
    }

    return { name: mood, impact, data: { hour } };
  }

  private updateMoodHistory(mood: Mood): void {
    // Update mood history
  }

  private serializeBehavior(behavior: UserBehavior): any {
    return {
      clicks: behavior.clickPatterns.length,
      scrollPattern: behavior.scrollBehavior.pattern,
      timeActive: behavior.timeSpent.activeTime,
      interactions: behavior.interactions.buttonClicks,
    };
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  private getDeviceType(): string {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Public API
   */
  public getUserBehavior(): Observable<UserBehavior> {
    return this.userBehavior$.asObservable();
  }

  public getCurrentMood(): Mood {
    return this.currentMood();
  }

  public async getThemeRecommendation(): Promise<ThemeRecommendation> {
    return this.generateThemeRecommendation();
  }

  public applyRecommendedTheme(theme: ThemeConfig): void {
    const root = document.documentElement;

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply typography
    root.style.setProperty('--typography-scale', theme.typography.scale.toString());
    root.style.setProperty('--typography-contrast', theme.typography.contrast.toString());

    // Apply spacing
    root.style.setProperty('--spacing-density', theme.spacing.density.toString());

    // Apply motion
    root.style.setProperty('--motion-speed', theme.motion.speed.toString());
    root.style.setProperty('--motion-smoothness', theme.motion.smoothness.toString());
  }

  public resetPersonalization(): void {
    this.userBehavior$.next(this.getDefaultBehavior());
    this.currentMood.set({ type: 'calm', intensity: 0.5, timestamp: Date.now() });
  }
}
