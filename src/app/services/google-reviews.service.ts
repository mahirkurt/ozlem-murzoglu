import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, ReplaySubject } from 'rxjs';
import { map, catchError, switchMap, take, timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    google: any;
  }
}

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface PlaceSummary {
  rating: number;
  reviewCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleReviewsService {
  private readonly API_KEY = environment.googleMapsApiKey;
  private readonly PLACE_ID = environment.googlePlaceId;

  private reviewsCache: Map<string, { reviews: GoogleReview[], summary: PlaceSummary, timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 60 * 24;

  private mapsReady$ = new ReplaySubject<boolean>(1);
  private mapsLoading = false;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {
    if (this.API_KEY) {
      this.loadGoogleMapsAPI();
    } else {
      console.warn('[GoogleReviews] No API key configured in environment. Set googleMapsApiKey in environment.ts');
      this.mapsReady$.next(false);
    }
  }

  /**
   * Fetches reviews from Google Places API.
   * Returns empty array if API key is not configured or API fails.
   */
  fetchGoogleReviews(): Observable<{ reviews: GoogleReview[], summary: PlaceSummary }> {
    if (!this.API_KEY) {
      return of({ reviews: [], summary: { rating: 0, reviewCount: 0 } });
    }

    const currentLang = this.translate.currentLang || 'tr';
    const cacheKey = `reviews_${currentLang}`;

    const cached = this.reviewsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return of({ reviews: cached.reviews, summary: cached.summary });
    }

    return this.mapsReady$.pipe(
      take(1),
      timeout(15000),
      switchMap(ready => {
        if (!ready) {
          return of({ reviews: [] as GoogleReview[], summary: { rating: 0, reviewCount: 0 } as PlaceSummary });
        }
        return this.fetchReviewsFromAPI(currentLang);
      }),
      map(result => {
        if (result.reviews.length > 0) {
          this.reviewsCache.set(cacheKey, { ...result, timestamp: Date.now() });
        }
        return result;
      }),
      catchError(err => {
        console.error('[GoogleReviews] Fetch failed:', err);
        return of({ reviews: [] as GoogleReview[], summary: { rating: 0, reviewCount: 0 } as PlaceSummary });
      })
    );
  }

  private loadGoogleMapsAPI(): void {
    if (this.mapsLoading) return;
    this.mapsLoading = true;

    if (typeof window === 'undefined') {
      this.mapsReady$.next(false);
      return;
    }

    // Already loaded
    if (window.google?.maps?.places) {
      this.mapsReady$.next(true);
      return;
    }

    // Check for existing script
    const existing = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing) {
      this.waitForGoogleMaps();
      return;
    }

    const script = document.createElement('script');
    const lang = this.translate.currentLang || 'tr';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.API_KEY}&libraries=places&language=${lang}&v=weekly&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => this.waitForGoogleMaps();
    script.onerror = () => {
      console.error('[GoogleReviews] Failed to load Google Maps script');
      this.mapsReady$.next(false);
    };

    document.head.appendChild(script);
  }

  /** Poll for google.maps.places availability after script load */
  private waitForGoogleMaps(): void {
    let attempts = 0;
    const check = () => {
      if (window.google?.maps?.places) {
        this.mapsReady$.next(true);
      } else if (attempts < 20) {
        attempts++;
        setTimeout(check, 250);
      } else {
        console.error('[GoogleReviews] Google Maps Places library did not initialize');
        this.mapsReady$.next(false);
      }
    };
    check();
  }

  private fetchReviewsFromAPI(lang: string): Observable<{ reviews: GoogleReview[], summary: PlaceSummary }> {
    return new Observable(observer => {
      // Try new Places API first
      if (window.google.maps.places.Place) {
        this.fetchViaNewAPI(lang, observer);
      } else {
        this.fetchViaLegacyAPI(observer);
      }
    });
  }

  private fetchViaNewAPI(lang: string, observer: any): void {
    const place = new window.google.maps.places.Place({
      id: this.PLACE_ID,
      requestedLanguage: lang
    });

    place.fetchFields({
      fields: ['reviews', 'rating', 'userRatingCount', 'displayName']
    }).then(() => {
      const summary: PlaceSummary = {
        rating: place.rating || 0,
        reviewCount: place.userRatingCount || 0
      };

      if (!place.reviews || place.reviews.length === 0) {
        observer.next({ reviews: [], summary });
        observer.complete();
        return;
      }

      const reviews = place.reviews
        .map((r: any) => this.convertNewAPIReview(r))
        .filter((r: GoogleReview) => r.rating >= 4);

      reviews.sort((a: GoogleReview, b: GoogleReview) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return (b.time || 0) - (a.time || 0);
      });

      observer.next({ reviews: reviews.slice(0, 20), summary });
      observer.complete();
    }).catch((err: any) => {
      console.error('[GoogleReviews] New API failed, trying legacy:', err);
      this.fetchViaLegacyAPI(observer);
    });
  }

  private fetchViaLegacyAPI(observer: any): void {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    service.getDetails(
      { placeId: this.PLACE_ID, fields: ['reviews', 'rating', 'user_ratings_total', 'name'] },
      (place: any, status: any) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place) {
          console.error('[GoogleReviews] Legacy API failed, status:', status);
          observer.next({ reviews: [], summary: { rating: 0, reviewCount: 0 } });
          observer.complete();
          return;
        }

        const summary: PlaceSummary = {
          rating: place.rating || 0,
          reviewCount: place.user_ratings_total || 0
        };

        if (!place.reviews || place.reviews.length === 0) {
          observer.next({ reviews: [], summary });
          observer.complete();
          return;
        }

        const reviews = place.reviews
          .filter((r: any) => r.rating >= 4)
          .map((r: any): GoogleReview => ({
            author_name: this.formatName(r.author_name || ''),
            author_url: r.author_url || '',
            profile_photo_url: r.profile_photo_url || '',
            rating: r.rating || 5,
            relative_time_description: r.relative_time_description || '',
            text: r.text || '',
            time: r.time ? r.time * 1000 : Date.now()
          }))
          .sort((a: GoogleReview, b: GoogleReview) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return (b.time || 0) - (a.time || 0);
          });

        observer.next({ reviews: reviews.slice(0, 20), summary });
        observer.complete();
      }
    );
  }

  private convertNewAPIReview(review: any): GoogleReview {
    // New API: review.text can be string or { text: string }
    let text = '';
    if (typeof review.text === 'string') {
      text = review.text;
    } else if (review.text?.text) {
      text = review.text.text;
    } else if (typeof review.originalText === 'string') {
      text = review.originalText;
    } else if (review.originalText?.text) {
      text = review.originalText.text;
    }

    return {
      author_name: this.formatName(
        review.authorAttribution?.displayName || review.author_name || ''
      ),
      author_url: review.authorAttribution?.uri || '',
      profile_photo_url: review.authorAttribution?.photoUri || '',
      rating: review.rating || 5,
      relative_time_description: review.relativePublishTimeDescription || '',
      text,
      time: review.publishTime
        ? new Date(review.publishTime).getTime()
        : Date.now()
    };
  }

  private formatName(name: string): string {
    if (!name || name.trim().length === 0) return 'Google Kullanıcısı';
    return name.trim().split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  getAuthorInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  formatRelativeTime(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return this.translate.instant('REVIEWS.TIME_AGO.YEARS', { count: years });
    if (months > 0) return this.translate.instant('REVIEWS.TIME_AGO.MONTHS', { count: months });
    if (weeks > 0) return this.translate.instant('REVIEWS.TIME_AGO.WEEKS', { count: weeks });
    if (days > 0) return this.translate.instant('REVIEWS.TIME_AGO.DAYS', { count: days });
    return this.translate.instant('REVIEWS.TIME_AGO.JUST_NOW');
  }

  clearCache(): void {
    this.reviewsCache.clear();
  }
}
