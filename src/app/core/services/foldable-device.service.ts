import { Injectable, signal, computed, effect } from '@angular/core';
import { Observable, fromEvent, of } from 'rxjs';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';

/**
 * Foldable Device Service
 * Katlanabilir cihazlar ve çift ekranlı cihazlar için adaptif düzen desteği
 */

export type DevicePosture =
  | 'continuous' // Normal tek ekran
  | 'dual-vertical' // Dikey katlanmış
  | 'dual-horizontal' // Yatay katlanmış
  | 'folded' // Kapalı
  | 'tablet' // Tablet modu
  | 'book' // Kitap modu
  | 'tent' // Çadır modu
  | 'laptop'; // Laptop modu

export interface FoldableFeatures {
  spanning: 'none' | 'single-fold-vertical' | 'single-fold-horizontal' | 'dual-screen';
  foldAngle: number;
  screenSegments: DOMRect[];
  hingeWidth: number;
  hasHinge: boolean;
}

export interface AdaptiveLayout {
  type: 'single' | 'list-detail' | 'two-page' | 'companion' | 'extended';
  primaryWidth: string;
  secondaryWidth: string;
  hingeMode: 'avoid' | 'span' | 'split';
}

@Injectable({
  providedIn: 'root',
})
export class FoldableDeviceService {
  // Device state
  private devicePosture = signal<DevicePosture>('continuous');
  private foldAngle = signal<number>(180);
  private screenSegments = signal<DOMRect[]>([]);
  private isSpanning = signal<boolean>(false);

  // Computed values
  public posture = computed(() => this.devicePosture());
  public angle = computed(() => this.foldAngle());
  public segments = computed(() => this.screenSegments());
  public spanning = computed(() => this.isSpanning());
  public isFoldable = computed(() => this.screenSegments().length > 1);
  public isDualScreen = computed(() => this.screenSegments().length === 2);

  // Layout recommendations
  public recommendedLayout = computed(() => this.getRecommendedLayout());

  // CSS Environment Variables for fold/hinge
  private cssEnvVariables = {
    foldTop: 0,
    foldLeft: 0,
    foldWidth: 0,
    foldHeight: 0,
  };

  // Media queries for foldables
  private readonly foldableQueries = {
    singleVertical: '(spanning: single-fold-vertical)',
    singleHorizontal: '(spanning: single-fold-horizontal)',
    dualScreen: '(spanning: dual-screen)',
    foldable: '(screen-fold-posture)',
    minFoldAngle: '(min-screen-fold-angle: 120deg)',
    maxFoldAngle: '(max-screen-fold-angle: 180deg)',
  };

  constructor() {
    this.initializeFoldableDetection();
    this.setupPostureObserver();
    this.setupViewportSegments();
    this.applyCSSEnvironmentVariables();
  }

  /**
   * Initialize foldable device detection
   */
  private initializeFoldableDetection(): void {
    // Check for experimental APIs
    if ('getWindowSegments' in window) {
      this.detectWindowSegments();
    }

    // Check for CSS environment variables
    this.detectCSSEnvironmentVariables();

    // Setup media query listeners
    this.setupMediaQueryListeners();

    // Check for device posture API
    if ('devicePosture' in navigator) {
      this.observeDevicePosture();
    }
  }

  /**
   * Detect window segments (for Surface Duo, Galaxy Fold, etc.)
   */
  private detectWindowSegments(): void {
    try {
      const segments = (window as any).getWindowSegments();
      if (segments && segments.length > 0) {
        this.screenSegments.set(segments);
        this.isSpanning.set(segments.length > 1);
      }
    } catch (error) {
      console.debug('Window segments API not available:', error);
    }
  }

  /**
   * Detect CSS environment variables for fold
   */
  private detectCSSEnvironmentVariables(): void {
    const styles = getComputedStyle(document.documentElement);

    // Check for fold environment variables
    const envVars = ['env(fold-top)', 'env(fold-left)', 'env(fold-width)', 'env(fold-height)'];

    envVars.forEach((envVar, index) => {
      const value = styles.getPropertyValue(envVar);
      if (value && value !== '0') {
        const numValue = parseInt(value);
        switch (index) {
          case 0:
            this.cssEnvVariables.foldTop = numValue;
            break;
          case 1:
            this.cssEnvVariables.foldLeft = numValue;
            break;
          case 2:
            this.cssEnvVariables.foldWidth = numValue;
            break;
          case 3:
            this.cssEnvVariables.foldHeight = numValue;
            break;
        }
      }
    });
  }

  /**
   * Setup media query listeners for foldable features
   */
  private setupMediaQueryListeners(): void {
    Object.entries(this.foldableQueries).forEach(([key, query]) => {
      try {
        const mediaQuery = window.matchMedia(query);
        mediaQuery.addEventListener('change', (e) => {
          this.handleMediaQueryChange(key, e.matches);
        });

        // Initial check
        if (mediaQuery.matches) {
          this.handleMediaQueryChange(key, true);
        }
      } catch (error) {
        console.debug(`Media query ${query} not supported:`, error);
      }
    });
  }

  /**
   * Handle media query changes
   */
  private handleMediaQueryChange(queryType: string, matches: boolean): void {
    if (!matches) return;

    switch (queryType) {
      case 'singleVertical':
        this.devicePosture.set('dual-vertical');
        break;
      case 'singleHorizontal':
        this.devicePosture.set('dual-horizontal');
        break;
      case 'dualScreen':
        this.devicePosture.set('dual-vertical');
        this.isSpanning.set(true);
        break;
    }
  }

  /**
   * Observe device posture API
   */
  private observeDevicePosture(): void {
    const posture = (navigator as any).devicePosture;

    if (posture) {
      // Initial posture
      this.updatePostureFromAPI(posture.type);

      // Listen for changes
      posture.addEventListener('change', () => {
        this.updatePostureFromAPI(posture.type);
      });
    }
  }

  /**
   * Update posture from Device Posture API
   */
  private updatePostureFromAPI(postureType: string): void {
    const postureMap: Record<string, DevicePosture> = {
      continuous: 'continuous',
      folded: 'folded',
      'folded-over': 'tent',
      laptop: 'laptop',
      tablet: 'tablet',
      book: 'book',
    };

    const posture = postureMap[postureType] || 'continuous';
    this.devicePosture.set(posture);
  }

  /**
   * Setup viewport segments observer
   */
  private setupViewportSegments(): void {
    // Visualize viewport segments for debugging
    if ('visualViewport' in window) {
      const viewport = window.visualViewport;

      viewport?.addEventListener('resize', () => {
        this.detectWindowSegments();
      });

      viewport?.addEventListener('scroll', () => {
        this.detectWindowSegments();
      });
    }

    // Observe orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.detectWindowSegments();
        this.detectCSSEnvironmentVariables();
      }, 100);
    });
  }

  /**
   * Setup posture observer effect
   */
  private setupPostureObserver(): void {
    effect(() => {
      const posture = this.devicePosture();
      const angle = this.foldAngle();

      // Apply CSS classes based on posture
      this.applyPostureClasses(posture);

      // Update layout recommendations
      this.updateLayoutForPosture(posture);

      // Dispatch custom event
      window.dispatchEvent(
        new CustomEvent('posture-change', {
          detail: { posture, angle },
        })
      );
    });
  }

  /**
   * Apply CSS classes based on posture
   */
  private applyPostureClasses(posture: DevicePosture): void {
    const body = document.body;

    // Remove all posture classes
    body.classList.remove(
      'posture-continuous',
      'posture-dual-vertical',
      'posture-dual-horizontal',
      'posture-folded',
      'posture-tablet',
      'posture-book',
      'posture-tent',
      'posture-laptop'
    );

    // Add current posture class
    body.classList.add(`posture-${posture}`);

    // Add spanning class if applicable
    if (this.isSpanning()) {
      body.classList.add('device-spanning');
    } else {
      body.classList.remove('device-spanning');
    }
  }

  /**
   * Apply CSS environment variables
   */
  private applyCSSEnvironmentVariables(): void {
    const root = document.documentElement;

    // Set custom properties for fold dimensions
    root.style.setProperty('--fold-top', `${this.cssEnvVariables.foldTop}px`);
    root.style.setProperty('--fold-left', `${this.cssEnvVariables.foldLeft}px`);
    root.style.setProperty('--fold-width', `${this.cssEnvVariables.foldWidth}px`);
    root.style.setProperty('--fold-height', `${this.cssEnvVariables.foldHeight}px`);

    // Calculate safe areas to avoid the fold
    const segments = this.screenSegments();
    if (segments.length > 1) {
      const gap = segments[1].left - segments[0].right;
      root.style.setProperty('--fold-gap', `${gap}px`);

      // Safe areas for content
      root.style.setProperty('--safe-area-left', `${segments[0].width}px`);
      root.style.setProperty('--safe-area-right', `${segments[1].width}px`);
    }
  }

  /**
   * Get recommended layout based on device posture
   */
  private getRecommendedLayout(): AdaptiveLayout {
    const posture = this.devicePosture();
    const segments = this.screenSegments();

    switch (posture) {
      case 'dual-vertical':
        return {
          type: 'list-detail',
          primaryWidth: '50%',
          secondaryWidth: '50%',
          hingeMode: 'avoid',
        };

      case 'dual-horizontal':
        return {
          type: 'two-page',
          primaryWidth: '100%',
          secondaryWidth: '100%',
          hingeMode: 'split',
        };

      case 'tablet':
        return {
          type: 'extended',
          primaryWidth: '100%',
          secondaryWidth: '0',
          hingeMode: 'span',
        };

      case 'book':
        return {
          type: 'two-page',
          primaryWidth: '50%',
          secondaryWidth: '50%',
          hingeMode: 'avoid',
        };

      case 'laptop':
        return {
          type: 'companion',
          primaryWidth: '100%',
          secondaryWidth: '100%',
          hingeMode: 'split',
        };

      default:
        return {
          type: 'single',
          primaryWidth: '100%',
          secondaryWidth: '0',
          hingeMode: 'none',
        };
    }
  }

  /**
   * Update layout for posture
   */
  private updateLayoutForPosture(posture: DevicePosture): void {
    const layout = this.getRecommendedLayout();
    const root = document.documentElement;

    // Set layout CSS variables
    root.style.setProperty('--layout-type', layout.type);
    root.style.setProperty('--primary-width', layout.primaryWidth);
    root.style.setProperty('--secondary-width', layout.secondaryWidth);
    root.style.setProperty('--hinge-mode', layout.hingeMode);
  }

  /**
   * Check if device is foldable
   */
  public checkFoldableSupport(): boolean {
    return (
      'getWindowSegments' in window ||
      'devicePosture' in navigator ||
      this.checkCSSSpanningSupport()
    );
  }

  /**
   * Check CSS spanning support
   */
  private checkCSSSpanningSupport(): boolean {
    try {
      const query = window.matchMedia('(spanning: none)');
      return query.media !== 'not all';
    } catch {
      return false;
    }
  }

  /**
   * Get spanning state observable
   */
  public getSpanningState(): Observable<string> {
    // Create observables for each media query
    const checkQuery = (query: string) => {
      try {
        const mq = window.matchMedia(query);
        return fromEvent<MediaQueryListEvent>(mq, 'change').pipe(
          startWith({ matches: mq.matches } as MediaQueryListEvent),
          map(() => mq.matches)
        );
      } catch {
        return of(false);
      }
    };

    // Combine all query results
    const verticalObs = checkQuery(this.foldableQueries.singleVertical);
    const horizontalObs = checkQuery(this.foldableQueries.singleHorizontal);
    const dualObs = checkQuery(this.foldableQueries.dualScreen);

    // Return combined result
    return new Observable<string>(observer => {
      const subscriptions = [
        verticalObs.subscribe(matches => {
          if (matches) observer.next('single-fold-vertical');
        }),
        horizontalObs.subscribe(matches => {
          if (matches) observer.next('single-fold-horizontal');
        }),
        dualObs.subscribe(matches => {
          if (matches) observer.next('dual-screen');
        })
      ];

      // Default state
      observer.next('none');

      return () => {
        subscriptions.forEach(sub => sub.unsubscribe());
      };
    }).pipe(distinctUntilChanged());
  }

  /**
   * Get adaptive layout class
   */
  public getAdaptiveLayoutClass(): string {
    const layout = this.recommendedLayout();
    const posture = this.devicePosture();

    return `layout-${layout.type} posture-${posture}`;
  }

  /**
   * Should avoid hinge area
   */
  public shouldAvoidHinge(): boolean {
    const layout = this.recommendedLayout();
    return layout.hingeMode === 'avoid' && this.isSpanning();
  }

  /**
   * Get safe area for content
   */
  public getSafeArea(side: 'left' | 'right' | 'both'): DOMRect | null {
    const segments = this.screenSegments();

    if (segments.length < 2) {
      return null;
    }

    switch (side) {
      case 'left':
        return segments[0];
      case 'right':
        return segments[1];
      case 'both':
        return new DOMRect(
          segments[0].left,
          segments[0].top,
          segments[1].right - segments[0].left,
          Math.max(segments[0].height, segments[1].height)
        );
      default:
        return null;
    }
  }

  /**
   * Apply layout to element
   */
  public applyLayoutToElement(
    element: HTMLElement,
    options?: {
      avoidHinge?: boolean;
      preferSide?: 'left' | 'right';
      spanHinge?: boolean;
    }
  ): void {
    const layout = this.recommendedLayout();
    const segments = this.screenSegments();

    if (segments.length < 2) {
      // Single screen - no special layout needed
      element.style.removeProperty('grid-column');
      element.style.removeProperty('margin-left');
      element.style.removeProperty('margin-right');
      return;
    }

    if (options?.spanHinge) {
      // Span across both segments
      element.style.gridColumn = '1 / -1';
    } else if (options?.avoidHinge) {
      // Place on preferred side
      const side = options.preferSide || 'left';
      element.style.gridColumn = side === 'left' ? '1' : '2';
    }

    // Add appropriate margins to avoid hinge
    if (layout.hingeMode === 'avoid') {
      const hingeWidth = this.cssEnvVariables.foldWidth;
      if (hingeWidth > 0) {
        element.style.paddingLeft = `calc(${hingeWidth / 2}px + 16px)`;
        element.style.paddingRight = `calc(${hingeWidth / 2}px + 16px)`;
      }
    }
  }

  /**
   * Create CSS for foldable layouts
   */
  public generateFoldableCSS(): string {
    return `
      /* Foldable Device Layouts */
      
      /* Base grid for dual-screen layouts */
      .foldable-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: env(fold-width, 0);
        width: 100%;
        height: 100%;
      }
      
      /* List-Detail Layout */
      .layout-list-detail {
        display: grid;
        grid-template-columns: minmax(300px, 1fr) 2fr;
        gap: env(fold-width, 0);
      }
      
      @media (spanning: single-fold-vertical) {
        .layout-list-detail .list-pane {
          grid-column: 1;
        }
        
        .layout-list-detail .detail-pane {
          grid-column: 2;
        }
      }
      
      /* Two-Page Layout */
      .layout-two-page {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: env(fold-width, 0);
      }
      
      @media (spanning: single-fold-horizontal) {
        .layout-two-page {
          grid-template-columns: 1fr;
          grid-template-rows: 1fr 1fr;
          gap: env(fold-height, 0);
        }
      }
      
      /* Companion Layout */
      .layout-companion {
        display: flex;
        flex-direction: column;
      }
      
      @media (spanning: single-fold-horizontal) {
        .layout-companion .primary-content {
          flex: 1;
        }
        
        .layout-companion .companion-content {
          height: 50%;
          border-top: 1px solid var(--md-sys-color-outline);
        }
      }
      
      /* Avoid hinge */
      .avoid-hinge {
        padding-left: max(env(safe-area-inset-left), calc(env(fold-left) + env(fold-width) + 16px));
        padding-right: max(env(safe-area-inset-right), 16px);
      }
      
      /* Posture-specific styles */
      .posture-dual-vertical .app-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: env(fold-width, 0);
      }
      
      .posture-tablet .app-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--md-sys-spacing-6);
      }
      
      .posture-book .reading-content {
        column-count: 2;
        column-gap: calc(env(fold-width, 0) + 32px);
      }
      
      /* Animations for posture changes */
      .posture-transition {
        transition: all 300ms cubic-bezier(0.2, 0, 0, 1);
      }
    `;
  }

  /**
   * Test mode for development
   */
  public simulateFoldableDevice(type: 'surface-duo' | 'galaxy-fold' | 'lg-dual-screen'): void {
    switch (type) {
      case 'surface-duo':
        this.screenSegments.set([new DOMRect(0, 0, 540, 800), new DOMRect(574, 0, 540, 800)]);
        this.devicePosture.set('dual-vertical');
        this.cssEnvVariables.foldWidth = 34;
        break;

      case 'galaxy-fold':
        this.screenSegments.set([new DOMRect(0, 0, 840, 1960)]);
        this.devicePosture.set('tablet');
        break;

      case 'lg-dual-screen':
        this.screenSegments.set([new DOMRect(0, 0, 1080, 2460), new DOMRect(1080, 0, 1080, 2460)]);
        this.devicePosture.set('book');
        break;
    }

    this.isSpanning.set(true);
    this.applyCSSEnvironmentVariables();
  }
}
