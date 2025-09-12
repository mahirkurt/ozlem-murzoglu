import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

/**
 * Performance Optimizer Service
 * Advanced code splitting, resource hints, and performance optimizations
 */

export interface PerformanceMetrics {
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
  TTI: number; // Time to Interactive
  TBT: number; // Total Blocking Time
  INP: number; // Interaction to Next Paint
}

export interface ResourceHint {
  type: 'dns-prefetch' | 'preconnect' | 'prefetch' | 'preload' | 'prerender' | 'modulepreload';
  url: string;
  as?: string;
  crossorigin?: boolean;
  importance?: 'high' | 'low' | 'auto';
}

@Injectable({
  providedIn: 'root',
})
export class PerformanceOptimizerService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private metrics$ = new BehaviorSubject<PerformanceMetrics>({
    FCP: 0,
    LCP: 0,
    FID: 0,
    CLS: 0,
    TTFB: 0,
    TTI: 0,
    TBT: 0,
    INP: 0,
  });

  // Performance Observer
  private performanceObserver: PerformanceObserver | null = null;

  // Resource loading strategy
  private readonly CRITICAL_RESOURCES = ['/styles.css', '/main.js', '/polyfills.js', '/runtime.js'];

  constructor() {
    this.initializePerformanceMonitoring();
    this.setupCodeSplitting();
    this.setupResourceHints();
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupFontOptimization();
    this.setupCriticalCSS();
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      // Observe paint timing
      this.observePaintTiming();

      // Observe layout shift
      this.observeLayoutShift();

      // Observe long tasks
      this.observeLongTasks();

      // Observe first input
      this.observeFirstInput();

      // Observe largest contentful paint
      this.observeLCP();

      // Observe interaction to next paint
      this.observeINP();
    }

    // Measure Core Web Vitals
    this.measureCoreWebVitals();
  }

  /**
   * Observe paint timing
   */
  private observePaintTiming(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.updateMetric('FCP', entry.startTime);
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.log('Paint timing not supported');
    }
  }

  /**
   * Observe layout shift
   */
  private observeLayoutShift(): void {
    let clsScore = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsScore += (entry as any).value;
            this.updateMetric('CLS', clsScore);
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.log('Layout shift tracking not supported');
    }
  }

  /**
   * Observe long tasks
   */
  private observeLongTasks(): void {
    let totalBlockingTime = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const blockingTime = entry.duration - 50;
          if (blockingTime > 0) {
            totalBlockingTime += blockingTime;
            this.updateMetric('TBT', totalBlockingTime);
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.log('Long task tracking not supported');
    }
  }

  /**
   * Observe first input
   */
  private observeFirstInput(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any;
          this.updateMetric('FID', fidEntry.processingStart - fidEntry.startTime);
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.log('First input tracking not supported');
    }
  }

  /**
   * Observe largest contentful paint
   */
  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.updateMetric('LCP', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.log('LCP tracking not supported');
    }
  }

  /**
   * Observe interaction to next paint
   */
  private observeINP(): void {
    let maxINP = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'event' && (entry as any).interactionId) {
            const inp = entry.duration;
            maxINP = Math.max(maxINP, inp);
            this.updateMetric('INP', maxINP);
          }
        }
      });
      observer.observe({ entryTypes: ['event'] });
    } catch (e) {
      console.log('INP tracking not supported');
    }
  }

  /**
   * Measure Core Web Vitals
   */
  private measureCoreWebVitals(): void {
    // Time to First Byte
    if (performance.timing) {
      const ttfb = performance.timing.responseStart - performance.timing.navigationStart;
      this.updateMetric('TTFB', ttfb);
    }

    // Time to Interactive
    if ('PerformanceLongTaskTiming' in window) {
      const tti = this.calculateTTI();
      this.updateMetric('TTI', tti);
    }
  }

  /**
   * Calculate Time to Interactive
   */
  private calculateTTI(): number {
    const fcp = this.metrics$.value.FCP;
    const longTasksEnd = performance.now(); // Simplified
    return Math.max(fcp, longTasksEnd);
  }

  /**
   * Setup code splitting
   */
  private setupCodeSplitting(): void {
    // Route-based code splitting
    this.setupRouteSplitting();

    // Component-based code splitting
    this.setupComponentSplitting();

    // Library code splitting
    this.setupLibrarySplitting();
  }

  /**
   * Setup route-based code splitting
   */
  private setupRouteSplitting(): void {
    // Preload modules for likely navigation paths
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.predictNextRoutes(currentRoute).forEach((route) => {
        this.preloadRoute(route);
      });
    });
  }

  /**
   * Predict next routes based on user behavior
   */
  private predictNextRoutes(currentRoute: string): string[] {
    const predictions: Record<string, string[]> = {
      '/': ['/hizmetlerimiz', '/hakkimizda'],
      '/hizmetlerimiz': ['/randevu', '/iletisim'],
      '/hakkimizda': ['/hizmetlerimiz', '/iletisim'],
      '/kaynaklar': ['/hizmetlerimiz'],
    };

    return predictions[currentRoute] || [];
  }

  /**
   * Preload route module
   */
  private preloadRoute(route: string): void {
    // Dynamic import for route module
    switch (route) {
      case '/hizmetlerimiz':
        import('../../../pages/services/services').then(() => {
          console.log('Services module preloaded');
        });
        break;
      case '/hakkimizda':
        import('../../../pages/about/about').then(() => {
          console.log('About module preloaded');
        });
        break;
      // Add more routes as needed
    }
  }

  /**
   * Setup component-based code splitting
   */
  private setupComponentSplitting(): void {
    // Intersection Observer for lazy loading components
    if ('IntersectionObserver' in window) {
      const lazyComponents = document.querySelectorAll('[data-lazy-component]');

      const componentObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const componentName = entry.target.getAttribute('data-lazy-component');
              if (componentName) {
                this.loadComponent(componentName);
                componentObserver.unobserve(entry.target);
              }
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      lazyComponents.forEach((component) => {
        componentObserver.observe(component);
      });
    }
  }

  /**
   * Load component dynamically
   */
  private async loadComponent(componentName: string): Promise<void> {
    try {
      const module = await import(
        `../../../components/${componentName}/${componentName}.component`
      );
      console.log(`Component ${componentName} loaded`);
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
    }
  }

  /**
   * Setup library code splitting
   */
  private setupLibrarySplitting(): void {
    // Split vendor chunks
    this.splitVendorChunks();

    // Load libraries on demand
    this.setupOnDemandLibraries();
  }

  /**
   * Split vendor chunks
   */
  private splitVendorChunks(): void {
    // This would be configured in webpack/build config
    // Separate chunks for:
    // - Angular core
    // - Angular Material
    // - RxJS
    // - Other third-party libraries
  }

  /**
   * Setup on-demand library loading
   */
  private setupOnDemandLibraries(): void {
    // Load heavy libraries only when needed
    const libraryLoaders = {
      charts: () => import('chart.js'),
      maps: () => import('leaflet'),
      pdf: () => import('pdfjs-dist'),
      excel: () => import('xlsx'),
    };

    // Expose global loader
    (window as any).loadLibrary = (name: keyof typeof libraryLoaders) => {
      return libraryLoaders[name]();
    };
  }

  /**
   * Setup resource hints
   */
  private setupResourceHints(): void {
    // DNS prefetch for external domains
    this.addResourceHint({
      type: 'dns-prefetch',
      url: 'https://fonts.googleapis.com',
    });

    this.addResourceHint({
      type: 'dns-prefetch',
      url: 'https://fonts.gstatic.com',
    });

    // Preconnect to critical origins
    this.addResourceHint({
      type: 'preconnect',
      url: 'https://fonts.googleapis.com',
      crossorigin: true,
    });

    // Preload critical resources
    this.CRITICAL_RESOURCES.forEach((resource) => {
      this.addResourceHint({
        type: 'preload',
        url: resource,
        as: resource.endsWith('.css') ? 'style' : 'script',
        importance: 'high',
      });
    });

    // Prefetch next page resources
    this.setupPrefetching();

    // Module preload for ES modules
    this.setupModulePreload();
  }

  /**
   * Add resource hint
   */
  private addResourceHint(hint: ResourceHint): void {
    const link = document.createElement('link');
    link.rel = hint.type;
    link.href = hint.url;

    if (hint.as) {
      link.setAttribute('as', hint.as);
    }

    if (hint.crossorigin) {
      link.setAttribute('crossorigin', 'anonymous');
    }

    if (hint.importance) {
      link.setAttribute('importance', hint.importance);
    }

    document.head.appendChild(link);
  }

  /**
   * Setup prefetching
   */
  private setupPrefetching(): void {
    // Prefetch on link hover
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href && href.startsWith('/')) {
          this.prefetchRoute(href);
        }
      }
    });

    // Prefetch visible links
    if ('IntersectionObserver' in window && 'requestIdleCallback' in window) {
      const linkObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestIdleCallback(() => {
              const href = (entry.target as HTMLAnchorElement).href;
              if (href) {
                this.prefetchRoute(href);
              }
            });
          }
        });
      });

      document.querySelectorAll('a[href^="/"]').forEach((link) => {
        linkObserver.observe(link);
      });
    }
  }

  /**
   * Prefetch route
   */
  private prefetchRoute(route: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  }

  /**
   * Setup module preload
   */
  private setupModulePreload(): void {
    // Preload ES modules
    const modules = ['/chunk-vendors.js', '/chunk-common.js'];

    modules.forEach((module) => {
      this.addResourceHint({
        type: 'modulepreload',
        url: module,
      });
    });
  }

  /**
   * Setup lazy loading
   */
  private setupLazyLoading(): void {
    // Native lazy loading for images
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });

    // Native lazy loading for iframes
    document.querySelectorAll('iframe').forEach((iframe) => {
      if (!iframe.hasAttribute('loading')) {
        iframe.setAttribute('loading', 'lazy');
      }
    });

    // Intersection Observer for custom lazy loading
    this.setupCustomLazyLoading();
  }

  /**
   * Setup custom lazy loading
   */
  private setupCustomLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const lazyElements = document.querySelectorAll('[data-lazy]');

      const lazyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              const lazySrc = element.getAttribute('data-lazy');

              if (lazySrc) {
                if (element.tagName === 'IMG') {
                  (element as HTMLImageElement).src = lazySrc;
                } else if (element.tagName === 'VIDEO') {
                  (element as HTMLVideoElement).src = lazySrc;
                } else {
                  element.style.backgroundImage = `url(${lazySrc})`;
                }

                element.removeAttribute('data-lazy');
                lazyObserver.unobserve(element);
              }
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      lazyElements.forEach((element) => {
        lazyObserver.observe(element);
      });
    }
  }

  /**
   * Setup image optimization
   */
  private setupImageOptimization(): void {
    // WebP support detection
    this.detectWebPSupport();

    // AVIF support detection
    this.detectAVIFSupport();

    // Responsive images
    this.setupResponsiveImages();

    // Progressive image loading
    this.setupProgressiveImageLoading();
  }

  /**
   * Detect WebP support
   */
  private detectWebPSupport(): void {
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      const isSupported = webp.height === 2;
      document.documentElement.classList.toggle('webp', isSupported);

      if (isSupported) {
        this.convertImagesToWebP();
      }
    };
    webp.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  /**
   * Detect AVIF support
   */
  private detectAVIFSupport(): void {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      const isSupported = avif.height === 2;
      document.documentElement.classList.toggle('avif', isSupported);

      if (isSupported) {
        this.convertImagesToAVIF();
      }
    };
    avif.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgANogQEAwgMg';
  }

  /**
   * Convert images to WebP
   */
  private convertImagesToWebP(): void {
    document.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !src.includes('.webp')) {
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        img.setAttribute('src', webpSrc);
      }
    });
  }

  /**
   * Convert images to AVIF
   */
  private convertImagesToAVIF(): void {
    document.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !src.includes('.avif')) {
        const avifSrc = src.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
        img.setAttribute('src', avifSrc);
      }
    });
  }

  /**
   * Setup responsive images
   */
  private setupResponsiveImages(): void {
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('srcset')) {
        const src = img.getAttribute('src');
        if (src) {
          const srcset = `
            ${src.replace('.', '-320w.')} 320w,
            ${src.replace('.', '-640w.')} 640w,
            ${src.replace('.', '-1280w.')} 1280w,
            ${src.replace('.', '-1920w.')} 1920w
          `;
          img.setAttribute('srcset', srcset);
          img.setAttribute(
            'sizes',
            '(max-width: 320px) 280px, (max-width: 640px) 600px, (max-width: 1280px) 1200px, 1920px'
          );
        }
      }
    });
  }

  /**
   * Setup progressive image loading
   */
  private setupProgressiveImageLoading(): void {
    document.querySelectorAll('img[data-placeholder]').forEach((img) => {
      const placeholder = img.getAttribute('data-placeholder');
      const fullSrc = img.getAttribute('data-src');

      if (placeholder && fullSrc) {
        // Load placeholder
        (img as HTMLImageElement).src = placeholder;
        img.classList.add('loading');

        // Load full image
        const fullImage = new Image();
        fullImage.onload = () => {
          (img as HTMLImageElement).src = fullSrc;
          img.classList.remove('loading');
          img.classList.add('loaded');
        };
        fullImage.src = fullSrc;
      }
    });
  }

  /**
   * Setup font optimization
   */
  private setupFontOptimization(): void {
    // Font display swap
    this.addFontDisplaySwap();

    // Subset fonts
    this.subsetFonts();

    // Variable fonts
    this.useVariableFonts();

    // Local font detection
    this.detectLocalFonts();
  }

  /**
   * Add font-display: swap
   */
  private addFontDisplaySwap(): void {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Subset fonts
   */
  private subsetFonts(): void {
    // Use unicode-range to subset fonts
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Figtree';
        src: url('/fonts/figtree-latin.woff2') format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Use variable fonts
   */
  private useVariableFonts(): void {
    if (CSS.supports('font-variation-settings', 'normal')) {
      document.documentElement.classList.add('variable-fonts');
    }
  }

  /**
   * Detect local fonts
   */
  private detectLocalFonts(): void {
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        const localFonts = ['Figtree', 'DM Sans'];
        localFonts.forEach((font) => {
          if (document.fonts.check(`16px ${font}`)) {
            console.log(`Local font ${font} available`);
          }
        });
      });
    }
  }

  /**
   * Setup critical CSS
   */
  private setupCriticalCSS(): void {
    // Inline critical CSS
    this.inlineCriticalCSS();

    // Defer non-critical CSS
    this.deferNonCriticalCSS();
  }

  /**
   * Inline critical CSS
   */
  private inlineCriticalCSS(): void {
    const criticalCSS = `
      /* Critical CSS */
      body { margin: 0; font-family: 'DM Sans', sans-serif; }
      .header { height: 60px; background: var(--primary); }
      .main { min-height: calc(100vh - 120px); }
      .footer { height: 60px; background: var(--surface); }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }

  /**
   * Defer non-critical CSS
   */
  private deferNonCriticalCSS(): void {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link) => {
      if (!link.hasAttribute('data-critical')) {
        link.setAttribute('media', 'print');
        link.setAttribute('onload', "this.media='all'");
      }
    });
  }

  /**
   * Update performance metric
   */
  private updateMetric(metric: keyof PerformanceMetrics, value: number): void {
    const current = this.metrics$.value;
    this.metrics$.next({
      ...current,
      [metric]: value,
    });
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return this.metrics$.value;
  }

  /**
   * Get performance score
   */
  public getPerformanceScore(): number {
    const metrics = this.metrics$.value;

    // Calculate score based on Core Web Vitals thresholds
    let score = 100;

    // FCP scoring
    if (metrics.FCP > 3000) score -= 20;
    else if (metrics.FCP > 1800) score -= 10;

    // LCP scoring
    if (metrics.LCP > 4000) score -= 25;
    else if (metrics.LCP > 2500) score -= 12;

    // FID scoring
    if (metrics.FID > 300) score -= 25;
    else if (metrics.FID > 100) score -= 12;

    // CLS scoring
    if (metrics.CLS > 0.25) score -= 25;
    else if (metrics.CLS > 0.1) score -= 12;

    // INP scoring
    if (metrics.INP > 500) score -= 5;
    else if (metrics.INP > 200) score -= 2;

    return Math.max(0, score);
  }

  /**
   * Generate performance report
   */
  public generateReport(): string {
    const metrics = this.metrics$.value;
    const score = this.getPerformanceScore();

    return `
Performance Report
==================
Score: ${score}/100

Core Web Vitals:
- FCP: ${metrics.FCP.toFixed(0)}ms
- LCP: ${metrics.LCP.toFixed(0)}ms
- FID: ${metrics.FID.toFixed(0)}ms
- CLS: ${metrics.CLS.toFixed(3)}
- INP: ${metrics.INP.toFixed(0)}ms

Additional Metrics:
- TTFB: ${metrics.TTFB.toFixed(0)}ms
- TTI: ${metrics.TTI.toFixed(0)}ms
- TBT: ${metrics.TBT.toFixed(0)}ms
    `;
  }
}
