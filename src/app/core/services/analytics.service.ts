import { Injectable, signal, computed } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Advanced Analytics Service
 * Custom event tracking, heatmap integration, user journey mapping
 */

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  customDimensions?: Record<string, any>;
  timestamp?: number;
}

export interface UserJourneyStep {
  page: string;
  timestamp: number;
  duration: number;
  interactions: number;
  scrollDepth: number;
  exitIntent: boolean;
}

export interface HeatmapData {
  element: string;
  x: number;
  y: number;
  timestamp: number;
  type: 'click' | 'hover' | 'scroll';
}

export interface UserBehaviorMetrics {
  sessionDuration: number;
  pageViews: number;
  bounceRate: number;
  averageTimeOnPage: number;
  scrollDepth: number;
  clickThroughRate: number;
  conversionRate: number;
  engagementScore: number;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  // State management
  private events = signal<AnalyticsEvent[]>([]);
  private journey = signal<UserJourneyStep[]>([]);
  private heatmapData = signal<HeatmapData[]>([]);
  private sessionStartTime = Date.now();
  private pageStartTime = Date.now();
  private currentPage = '';
  private interactionCount = 0;
  private maxScrollDepth = 0;

  // Computed metrics
  public metrics = computed(() => this.calculateMetrics());
  public journeyMap = computed(() => this.journey());
  public eventHistory = computed(() => this.events());

  // Configuration
  private config = {
    enableHeatmap: true,
    enableJourneyTracking: true,
    enableAutoTracking: true,
    sampleRate: 1.0, // 100% sampling
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    customDimensions: {} as Record<string, any>,
  };

  // External integrations
  private gtag: any = (window as any).gtag;
  private clarity: any = (window as any).clarity;
  private hotjar: any = (window as any).hj;
  private mixpanel: any = (window as any).mixpanel;

  constructor(private router: Router) {
    this.initializeAnalytics();
  }

  /**
   * Initialize analytics systems
   */
  private initializeAnalytics(): void {
    // Google Analytics 4
    this.initializeGA4();

    // Microsoft Clarity (heatmaps)
    this.initializeClarity();

    // Custom tracking
    this.setupAutoTracking();

    // Journey tracking
    this.setupJourneyTracking();

    // Performance tracking
    this.trackWebVitals();
  }

  /**
   * Initialize Google Analytics 4
   */
  private initializeGA4(): void {
    if (!this.gtag) {
      // Load GA4 script dynamically
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`;
      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      this.gtag = function () {
        (window as any).dataLayer.push(arguments);
      };
      this.gtag('js', new Date());
      this.gtag('config', 'G-XXXXXXXXXX', {
        send_page_view: false,
        custom_map: this.config.customDimensions,
      });
    }
  }

  /**
   * Initialize Microsoft Clarity for heatmaps
   */
  private initializeClarity(): void {
    if (!this.clarity && this.config.enableHeatmap) {
      (function (c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        t = l.createElement(r);
        t.async = 1;
        t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', 'CLARITY_PROJECT_ID');
    }
  }

  /**
   * Setup automatic event tracking
   */
  private setupAutoTracking(): void {
    if (!this.config.enableAutoTracking) return;

    // Click tracking
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const trackable = target.closest('[data-track]');

      if (trackable) {
        const category = trackable.getAttribute('data-track-category') || 'interaction';
        const action = trackable.getAttribute('data-track-action') || 'click';
        const label = trackable.getAttribute('data-track-label') || trackable.textContent?.trim();
        const value = parseInt(trackable.getAttribute('data-track-value') || '0');

        this.trackEvent({
          category,
          action,
          label,
          value,
        });
      }

      // Heatmap data collection
      if (this.config.enableHeatmap) {
        this.collectHeatmapData(event, 'click');
      }

      this.interactionCount++;
    });

    // Form tracking
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const formName = form.getAttribute('name') || form.id || 'unnamed-form';

      this.trackEvent({
        category: 'form',
        action: 'submit',
        label: formName,
      });
    });

    // Scroll tracking
    let scrollTimer: any;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollPercentage = this.calculateScrollDepth();
        this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercentage);

        // Track milestone scroll depths
        const milestones = [25, 50, 75, 90, 100];
        for (const milestone of milestones) {
          if (scrollPercentage >= milestone && !this.hasTrackedMilestone(milestone)) {
            this.trackEvent({
              category: 'engagement',
              action: 'scroll',
              label: `${milestone}%`,
              value: milestone,
            });
          }
        }
      }, 100);
    });

    // Video tracking
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      video.addEventListener('play', () => {
        this.trackEvent({
          category: 'video',
          action: 'play',
          label: video.getAttribute('data-video-name') || video.src,
        });
      });

      video.addEventListener('pause', () => {
        this.trackEvent({
          category: 'video',
          action: 'pause',
          label: video.getAttribute('data-video-name') || video.src,
          value: Math.round(video.currentTime),
        });
      });

      video.addEventListener('ended', () => {
        this.trackEvent({
          category: 'video',
          action: 'complete',
          label: video.getAttribute('data-video-name') || video.src,
        });
      });
    });

    // Error tracking
    window.addEventListener('error', (event) => {
      this.trackEvent({
        category: 'error',
        action: 'javascript',
        label: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
      });
    });

    // Exit intent tracking
    document.addEventListener('mouseleave', (event) => {
      if (event.clientY <= 0) {
        this.trackEvent({
          category: 'engagement',
          action: 'exit_intent',
          label: this.currentPage,
        });
      }
    });
  }

  /**
   * Setup user journey tracking
   */
  private setupJourneyTracking(): void {
    if (!this.config.enableJourneyTracking) return;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Save previous page data
        if (this.currentPage) {
          const duration = Date.now() - this.pageStartTime;
          this.journey.update((j) => [
            ...j,
            {
              page: this.currentPage,
              timestamp: this.pageStartTime,
              duration,
              interactions: this.interactionCount,
              scrollDepth: this.maxScrollDepth,
              exitIntent: false,
            },
          ]);
        }

        // Reset for new page
        this.currentPage = event.urlAfterRedirects;
        this.pageStartTime = Date.now();
        this.interactionCount = 0;
        this.maxScrollDepth = 0;

        // Track page view
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  /**
   * Track Web Vitals
   */
  private trackWebVitals(): void {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.trackEvent({
          category: 'web_vitals',
          action: 'LCP',
          value: Math.round(lastEntry.renderTime || lastEntry.loadTime),
        });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.trackEvent({
            category: 'web_vitals',
            action: 'FID',
            value: Math.round(entry.processingStart - entry.startTime),
          });
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.trackEvent({
          category: 'web_vitals',
          action: 'CLS',
          value: Math.round(clsValue * 1000),
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }
  }

  /**
   * Track custom event
   */
  public trackEvent(event: AnalyticsEvent): void {
    // Add timestamp if not provided
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    // Add to local storage
    this.events.update((e) => [...e, event]);

    // Send to GA4
    if (this.gtag) {
      this.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.customDimensions,
      });
    }

    // Send to Mixpanel
    if (this.mixpanel) {
      this.mixpanel.track(`${event.category}_${event.action}`, {
        label: event.label,
        value: event.value,
        ...event.customDimensions,
      });
    }

    // Console log in development
    if (!environment.production) {
      console.log('📊 Analytics Event:', event);
    }
  }

  /**
   * Track page view
   */
  public trackPageView(url: string, title?: string): void {
    const pageData = {
      page_path: url,
      page_title: title || document.title,
      page_location: window.location.href,
    };

    // GA4
    if (this.gtag) {
      this.gtag('event', 'page_view', pageData);
    }

    // Custom tracking
    this.trackEvent({
      category: 'navigation',
      action: 'page_view',
      label: url,
    });
  }

  /**
   * Track user properties
   */
  public setUserProperties(properties: Record<string, any>): void {
    // GA4
    if (this.gtag) {
      this.gtag('set', 'user_properties', properties);
    }

    // Mixpanel
    if (this.mixpanel) {
      this.mixpanel.people.set(properties);
    }

    // Store locally
    this.config.customDimensions = {
      ...this.config.customDimensions,
      ...properties,
    };
  }

  /**
   * Track conversion
   */
  public trackConversion(conversionType: string, value?: number): void {
    this.trackEvent({
      category: 'conversion',
      action: conversionType,
      value: value || 1,
    });

    // GA4 conversion
    if (this.gtag) {
      this.gtag('event', 'conversion', {
        send_to: 'G-XXXXXXXXXX',
        value: value,
        currency: 'TRY',
      });
    }
  }

  /**
   * Collect heatmap data
   */
  private collectHeatmapData(event: MouseEvent, type: 'click' | 'hover' | 'scroll'): void {
    const target = event.target as HTMLElement;
    const selector = this.generateSelector(target);

    this.heatmapData.update((h) => [
      ...h,
      {
        element: selector,
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
        type,
      },
    ]);

    // Send to Clarity
    if (this.clarity) {
      this.clarity('set', 'custom_event', {
        type,
        element: selector,
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  /**
   * Generate CSS selector for element
   */
  private generateSelector(element: HTMLElement): string {
    const path: string[] = [];
    let current = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();

      if (current.id) {
        selector = `#${current.id}`;
        path.unshift(selector);
        break;
      } else if (current.className) {
        selector += `.${current.className.split(' ').join('.')}`;
      }

      path.unshift(selector);
      current = current.parentElement!;
    }

    return path.join(' > ');
  }

  /**
   * Calculate scroll depth
   */
  private calculateScrollDepth(): number {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
  }

  /**
   * Check if milestone has been tracked
   */
  private hasTrackedMilestone(milestone: number): boolean {
    return this.events().some(
      (e) => e.category === 'engagement' && e.action === 'scroll' && e.value === milestone
    );
  }

  /**
   * Calculate user behavior metrics
   */
  private calculateMetrics(): UserBehaviorMetrics {
    const events = this.events();
    const journey = this.journey();

    const sessionDuration = Date.now() - this.sessionStartTime;
    const pageViews = journey.length;
    const totalInteractions = journey.reduce((sum, step) => sum + step.interactions, 0);
    const averageTimeOnPage =
      journey.length > 0
        ? journey.reduce((sum, step) => sum + step.duration, 0) / journey.length
        : 0;

    const bounceRate = pageViews === 1 && totalInteractions < 3 ? 1 : 0;
    const clickEvents = events.filter((e) => e.action === 'click').length;
    const clickThroughRate = pageViews > 0 ? clickEvents / pageViews : 0;
    const conversions = events.filter((e) => e.category === 'conversion').length;
    const conversionRate = pageViews > 0 ? conversions / pageViews : 0;

    const engagementScore = this.calculateEngagementScore({
      sessionDuration,
      pageViews,
      totalInteractions,
      scrollDepth: this.maxScrollDepth,
      conversions,
    });

    return {
      sessionDuration,
      pageViews,
      bounceRate,
      averageTimeOnPage,
      scrollDepth: this.maxScrollDepth,
      clickThroughRate,
      conversionRate,
      engagementScore,
    };
  }

  /**
   * Calculate engagement score (0-100)
   */
  private calculateEngagementScore(metrics: any): number {
    let score = 0;

    // Time on site (max 30 points)
    score += Math.min(30, (metrics.sessionDuration / 1000 / 60) * 3); // 1 point per 20 seconds

    // Page views (max 20 points)
    score += Math.min(20, metrics.pageViews * 4);

    // Interactions (max 20 points)
    score += Math.min(20, metrics.totalInteractions * 2);

    // Scroll depth (max 20 points)
    score += (metrics.scrollDepth / 100) * 20;

    // Conversions (max 10 points)
    score += Math.min(10, metrics.conversions * 10);

    return Math.round(score);
  }

  /**
   * Get user journey visualization data
   */
  public getUserJourneyVisualization(): any {
    const journey = this.journey();

    return {
      nodes: journey.map((step, index) => ({
        id: index,
        label: step.page,
        duration: step.duration,
        interactions: step.interactions,
      })),
      edges: journey.slice(0, -1).map((_, index) => ({
        from: index,
        to: index + 1,
      })),
    };
  }

  /**
   * Export analytics data
   */
  public exportAnalyticsData(): Blob {
    const data = {
      events: this.events(),
      journey: this.journey(),
      metrics: this.metrics(),
      heatmap: this.heatmapData(),
    };

    const json = JSON.stringify(data, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  /**
   * Clear analytics data
   */
  public clearAnalyticsData(): void {
    this.events.set([]);
    this.journey.set([]);
    this.heatmapData.set([]);
    this.sessionStartTime = Date.now();
    this.pageStartTime = Date.now();
    this.interactionCount = 0;
    this.maxScrollDepth = 0;
  }
}

// Environment placeholder
const environment = { production: false };
