import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
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

@Injectable({
  providedIn: 'root'
})
export class GoogleReviewsService {
  // Google Places API configuration
  private readonly API_KEY = 'AIzaSyDZNlErCHqvQYj0gh_zTwyyzj_Lwoo7V94';
  private readonly PLACE_ID = 'ChIJ83R9VUTJyhQRM2o-M-eoZyQ'; // Dr. Özlem Murzoğlu - Verified Place ID
  private readonly MIN_REVIEW_LENGTH = 50; // Further reduced for faster loading
  private readonly PLACES_API_V1_URL = 'https://places.googleapis.com/v1';

  // Cache configuration
  private reviewsCache: Map<string, { reviews: GoogleReview[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 60 * 24; // Extended cache to 24 hours for better performance
  private googleMapsLoaded = false;
  
  // Return empty array when API is not available - only use real reviews
  private getFallbackReviews(): GoogleReview[] {
    console.log('No fallback reviews - returning empty array');
    return [];
  }

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {
    console.log('🔍 GoogleReviewsService initialized');
    console.log('📍 Place ID:', this.PLACE_ID);
    console.log('🔑 API Key configured:', this.API_KEY ? 'Yes' : 'No');
    // Pre-load Google Maps API and reviews immediately
    this.preloadGoogleMapsAPI();
    this.prefetchReviews();
  }

  private preloadGoogleMapsAPI(): void {
    if (typeof window !== 'undefined' && !this.googleMapsLoaded) {
      // Load immediately without waiting
      this.loadGoogleMapsAPI().subscribe({
        next: () => {
          console.log('✅ Google Maps API pre-loaded');
        },
        error: (err) => console.log('⚠️ Google Maps API pre-load failed:', err)
      });
    }
  }

  private prefetchReviews(): void {
    // Prefetch reviews immediately without delay
    this.fetchGoogleReviews().subscribe({
      next: (reviews) => {
        console.log(`📦 Prefetched ${reviews.length} reviews`);
        // Store in cache for immediate access
        const currentLang = this.translate.currentLang || 'tr';
        const cacheKey = `reviews_${currentLang}`;
        this.reviewsCache.set(cacheKey, { reviews, timestamp: Date.now() });
      },
      error: () => console.log('⚠️ Prefetch failed')
    });
  }

  /**
   * Fetches reviews from Google Places API with enhanced filtering and caching
   */
  fetchGoogleReviews(): Observable<GoogleReview[]> {
    const currentLang = this.translate.currentLang || 'tr';
    const cacheKey = `reviews_${currentLang}`;

    // Check cache first
    const cached = this.reviewsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('📦 Returning cached reviews for', currentLang);
      return of(cached.reviews);
    }

    console.log('🚀 fetchGoogleReviews started - fetching reviews for Place ID:', this.PLACE_ID);

    // Check if Google Maps JavaScript API is loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      console.log('✅ Google Maps JavaScript API already loaded');
      return this.fetchReviewsViaJavaScriptAPI().pipe(
        map(reviews => {
          // Cache the results
          this.reviewsCache.set(cacheKey, { reviews, timestamp: Date.now() });
          return reviews;
        })
      );
    }

    console.log('⏳ Google Maps JavaScript API not loaded, loading now...');
    // If not loaded, try to load it
    return this.loadGoogleMapsAPI().pipe(
      switchMap(() => this.fetchReviewsViaJavaScriptAPI()),
      map(reviews => {
        // Cache the results
        this.reviewsCache.set(cacheKey, { reviews, timestamp: Date.now() });
        return reviews;
      }),
      catchError((error) => {
        console.error('❌ Error with Google Maps API:', error);
        console.log('🔄 Falling back to minimal reviews');
        return of(this.getFallbackReviews());
      })
    );
  }

  private loadGoogleMapsAPI(): Observable<void> {
    return new Observable(observer => {
      if (typeof window === 'undefined') {
        observer.error('Not in browser environment');
        return;
      }

      if (window.google && window.google.maps) {
        this.googleMapsLoaded = true;
        observer.next();
        observer.complete();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          this.googleMapsLoaded = true;
          observer.next();
          observer.complete();
        });
        return;
      }

      const script = document.createElement('script');
      const currentLang = this.translate.currentLang || 'tr';
      // Use async loading parameter and v=weekly for latest stable version
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.API_KEY}&libraries=places&language=${currentLang}&v=weekly&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('Google Maps API loaded successfully');
        this.googleMapsLoaded = true;
        observer.next();
        observer.complete();
      };

      script.onerror = (error) => {
        console.error('Failed to load Google Maps API:', error);
        observer.error(error);
      };

      document.head.appendChild(script);
    });
  }

  private fetchReviewsViaJavaScriptAPI(): Observable<GoogleReview[]> {
    return new Observable(observer => {
      if (!window.google || !window.google.maps) {
        console.log('Google Maps API not available, using fallback');
        observer.next(this.getFallbackReviews());
        observer.complete();
        return;
      }

      console.log(`Fetching reviews using new Places API for Place ID: ${this.PLACE_ID}`);

      // Use the new google.maps.places.Place API
      if (window.google.maps.places && window.google.maps.places.Place) {
        const currentLang = this.translate.currentLang || 'tr';
        const place = new window.google.maps.places.Place({
          id: this.PLACE_ID,
          requestedLanguage: currentLang
        });

        // Fetch place details with optimized fields
        place.fetchFields({
          fields: ['reviews', 'rating', 'userRatingCount']
        }).then(() => {
          console.log('Place found:', place.displayName);
          console.log('Total user ratings:', place.userRatingCount);
          console.log('Average rating:', place.rating);

          if (place.reviews && place.reviews.length > 0) {
            console.log(`Raw reviews count: ${place.reviews.length}`);
            console.log('Sample raw review:', place.reviews[0]);

            // Convert new API format to our format
            const convertedReviews = place.reviews.map((review: any) => {
              // Debug: Log raw review structure
              console.log('Raw review structure:', JSON.stringify(review, null, 2));

              // Try multiple possible field names for review text
              // New API uses nested text.text structure
              const reviewText = review.text?.text ||
                                review.text ||
                                review.originalText?.text ||
                                review.originalText ||
                                review.comment ||
                                '';

              const converted = {
                author_name: review.authorAttribution?.displayName ||
                            review.author_name ||
                            'Anonymous',
                author_url: review.authorAttribution?.uri || '',
                profile_photo_url: review.authorAttribution?.photoUri || '',
                rating: review.rating || 5,
                relative_time_description: review.relativePublishTimeDescription ||
                                          review.relative_time_description ||
                                          '',
                text: reviewText,
                time: review.publishTime ? new Date(review.publishTime).getTime() : Date.now()
              };

              console.log('Converted review:', {
                author: converted.author_name,
                text: converted.text?.substring(0, 50),
                rating: converted.rating,
                hasText: !!converted.text,
                textLength: converted.text?.length || 0
              });

              return converted;
            });

            const processedReviews = this.processReviews(convertedReviews);

            if (processedReviews.length > 0) {
              console.log(`Returning ${processedReviews.length} filtered reviews`);
              observer.next(processedReviews);
            } else {
              console.log('No reviews met criteria, using fallback');
              observer.next(this.getFallbackReviews());
            }
          } else {
            console.log('No reviews found in place data, using fallback');
            observer.next(this.getFallbackReviews());
          }
          observer.complete();
        }).catch((error: any) => {
          console.error('Error fetching place details:', error);
          console.log('Using fallback reviews due to API error');
          observer.next(this.getFallbackReviews());
          observer.complete();
        });
      } else {
        // Fallback to legacy API if new API is not available
        console.log('New Places API not available, trying legacy API');
        const service = new window.google.maps.places.PlacesService(
          document.createElement('div')
        );

        const request = {
          placeId: this.PLACE_ID,
          fields: ['reviews', 'rating', 'user_ratings_total', 'name']
        };

        service.getDetails(request, (place: any, status: any) => {
          console.log('Legacy API response status:', status);

          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            console.log('Place found:', place.name);
            console.log('Total user ratings:', place.user_ratings_total);
            console.log('Average rating:', place.rating);

            if (place.reviews && place.reviews.length > 0) {
              console.log(`Raw reviews count: ${place.reviews.length}`);
              console.log('Sample review from legacy API:', JSON.stringify(place.reviews[0], null, 2));

              // Legacy API should have direct format
              const processedReviews = this.processReviews(place.reviews);

              if (processedReviews.length > 0) {
                console.log(`Returning ${processedReviews.length} filtered reviews`);
                observer.next(processedReviews);
              } else {
                console.log('No reviews met criteria after filtering');
                // Return all reviews without filtering if none pass
                if (place.reviews.length > 0) {
                  console.log('Returning all reviews without filtering');
                  const allReviews = place.reviews.map((review: any) => ({
                    author_name: review.author_name || 'Google Kullanıcısı',
                    author_url: review.author_url || '',
                    profile_photo_url: review.profile_photo_url || '',
                    rating: review.rating || 5,
                    relative_time_description: review.relative_time_description || '',
                    text: review.text || '',
                    time: review.time || Date.now()
                  }));
                  observer.next(allReviews);
                } else {
                  observer.next(this.getFallbackReviews());
                }
              }
            } else {
              console.log('No reviews found in place data, using fallback');
              observer.next(this.getFallbackReviews());
            }
          } else {
            console.log('Place not found or API error, using fallback');
            observer.next(this.getFallbackReviews());
          }
          observer.complete();
        });
      }
    });
  }

  /**
   * Process and filter reviews - optimized for fast loading
   */
  private processReviews(reviews: GoogleReview[]): GoogleReview[] {
    console.log(`Processing ${reviews.length} raw reviews`);

    const filtered = reviews
      .filter(review => {
        // Only filter out reviews with rating less than 4
        if (!review.rating || review.rating < 4) {
          console.log(`Skipping review with rating ${review.rating}`);
          return false;
        }
        // Accept all 4-5 star reviews, even without text
        return true;
      })
      .map(review => ({
        ...review,
        text: review.text ? this.correctSpelling(review.text) : '',
        author_name: this.formatName(review.author_name || 'Google Kullanıcısı')
      }))
      .sort((a, b) => {
        // Sort by rating first (5 stars first), then by time (recent first)
        if (b.rating !== a.rating) return b.rating - a.rating;
        return (b.time || 0) - (a.time || 0);
      })
      .slice(0, 20); // Get more reviews for better rotation

    console.log(`Returning ${filtered.length} reviews (4-5 stars)`);
    return filtered;
  }

  /**
   * Format author name properly
   */
  private formatName(name: string): string {
    if (!name || name.trim().length === 0) {
      return 'Google Kullanıcısı';
    }

    // Handle single-name users by adding initial
    const parts = name.trim().split(' ');
    if (parts.length === 1 && parts[0].length > 1) {
      // Add a surname initial
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase() + ' ' +
             parts[0].charAt(0).toUpperCase() + '.';
    }

    return parts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Enhanced spelling correction for Turkish text
   */
  private correctSpelling(text: string): string {
    // Common spelling corrections for Turkish
    const corrections: { [key: string]: string } = {
      'dogru': 'doğru',
      'cok': 'çok',
      'guzell': 'güzel',
      'güzell': 'güzel',
      'tesekkur': 'teşekkür',
      'teşekkur': 'teşekkür',
      'cocuk': 'çocuk',
      'buyume': 'büyüme',
      'gelisim': 'gelişim',
      'ogretmen': 'öğretmen',
      'ogrenci': 'öğrenci',
      'gunluk': 'günlük',
      'bugun': 'bugün',
      'duzenli': 'düzenli',
      'ilac': 'ilaç',
      'asi': 'aşı',
      'saglik': 'sağlık',
      'hastalik': 'hastalık',
      'surekli': 'sürekli',
      'ozgur': 'özgür',
      'guvende': 'güvende',
      'mukemmel': 'mükemmel',
      'suphesiz': 'şüphesiz',
      'onemlı': 'önemli',
      'tedavı': 'tedavi',
      'konusunda': 'konusunda',
      'hakkinda': 'hakkında',
      'icin': 'için',
      'kadin': 'kadın',
      'kucuk': 'küçük',
      'ustte': 'üstte',
      'altta': 'altta',
      'yukarida': 'yukarıda',
      'asagida': 'aşağıda'
    };

    let correctedText = text;
    
    // Apply corrections (case insensitive)
    Object.keys(corrections).forEach(incorrect => {
      const regex = new RegExp(`\\b${incorrect}\\b`, 'gi');
      correctedText = correctedText.replace(regex, corrections[incorrect]);
    });

    // Fix common punctuation and spacing issues
    correctedText = correctedText
      .replace(/\s+([.,!?;:])/g, '$1') // Remove space before punctuation
      .replace(/([.,!?;:])(\w)/g, '$1 $2') // Add space after punctuation
      .replace(/\s+/g, ' ') // Remove multiple spaces
      .replace(/\.{2,}/g, '...') // Fix multiple dots
      .trim();

    // Capitalize first letter of sentences
    correctedText = correctedText.replace(/(^|\. )(\w)/g, (match, p1, p2) => 
      p1 + p2.toUpperCase()
    );

    return correctedText;
  }

  /**
   * Get random reviews with rotation - optimized with caching
   */
  getRotatingReviews(count: number = 3): Observable<GoogleReview[]> {
    console.log('🔄 getRotatingReviews called, requesting', count, 'reviews');
    // Fetch once and cache, no timer polling
    return this.fetchGoogleReviews().pipe(
      map(reviews => {
        console.log('📊 Processing reviews for rotation, total:', reviews.length);
        const selectedReviews: GoogleReview[] = [];
        const availableReviews = [...reviews];

        for (let i = 0; i < Math.min(count, availableReviews.length); i++) {
          const randomIndex = Math.floor(Math.random() * availableReviews.length);
          selectedReviews.push(availableReviews[randomIndex]);
          availableReviews.splice(randomIndex, 1);
        }

        return selectedReviews;
      })
    );
  }

  /**
   * Clear cache when language changes
   */
  clearCache(): void {
    this.reviewsCache.clear();
    console.log('🗑️ Reviews cache cleared');
  }

  /**
   * Get author initials from name
   */
  getAuthorInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  /**
   * Format relative time for display
   */
  formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return this.translate.instant('REVIEWS.TIME_AGO.YEARS', { count: years });
    } else if (months > 0) {
      return this.translate.instant('REVIEWS.TIME_AGO.MONTHS', { count: months });
    } else if (weeks > 0) {
      return this.translate.instant('REVIEWS.TIME_AGO.WEEKS', { count: weeks });
    } else if (days > 0) {
      return this.translate.instant('REVIEWS.TIME_AGO.DAYS', { count: days });
    } else if (hours > 0) {
      return this.translate.instant('REVIEWS.TIME_AGO.HOURS', { count: hours });
    } else if (minutes > 0) {
      return this.translate.instant('REVIEWS.TIME_AGO.MINUTES', { count: minutes });
    } else {
      return this.translate.instant('REVIEWS.TIME_AGO.JUST_NOW');
    }
  }
}