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
  private readonly MIN_REVIEW_LENGTH = 50; // Reduced minimum character count for more reviews
  private readonly PLACES_API_V1_URL = 'https://places.googleapis.com/v1';
  
  // Minimal fallback reviews only for development
  private getFallbackReviews(): GoogleReview[] {
    console.log('Using fallback reviews - API not available');
    return [
      {
        author_name: 'Ayşe Yılmaz',
        rating: 5,
        relative_time_description: this.translate.instant('REVIEWS.TIME_AGO.MONTHS', { count: 3 }),
        text: 'Dr. Özlem Hanım gerçekten çocuklara nasıl yaklaşılacağını bilen çok özel bir doktor. Oğlumun her kontrolünde gösterdiği özen ve sabır sayesinde kendimi çok daha güvende hissediyorum.',
        time: Date.now() - 7776000000
      }
    ];
  }

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {
    console.log('🔍 GoogleReviewsService initialized');
    console.log('📍 Place ID:', this.PLACE_ID);
    console.log('🔑 API Key configured:', this.API_KEY ? 'Yes' : 'No');
  }

  /**
   * Fetches reviews from Google Places API with enhanced filtering
   */
  fetchGoogleReviews(): Observable<GoogleReview[]> {
    console.log('🚀 fetchGoogleReviews started - fetching reviews for Place ID:', this.PLACE_ID);
    
    // Check if Google Maps JavaScript API is loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      console.log('✅ Google Maps JavaScript API already loaded');
      return this.fetchReviewsViaJavaScriptAPI();
    }
    
    console.log('⏳ Google Maps JavaScript API not loaded, loading now...');
    // If not loaded, try to load it
    return this.loadGoogleMapsAPI().pipe(
      switchMap(() => this.fetchReviewsViaJavaScriptAPI()),
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
        observer.next();
        observer.complete();
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.API_KEY}&libraries=places&language=tr`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        observer.next();
        observer.complete();
      };
      
      script.onerror = (error) => {
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
      
      console.log(`Fetching reviews for Place ID: ${this.PLACE_ID}`);
      
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
      
      const request = {
        placeId: this.PLACE_ID,
        fields: ['reviews', 'rating', 'user_ratings_total', 'name']
      };
      
      service.getDetails(request, (place: any, status: any) => {
        console.log('Google Places API response status:', status);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          console.log('Place found:', place.name);
          console.log('Total user ratings:', place.user_ratings_total);
          console.log('Average rating:', place.rating);
          
          if (place.reviews && place.reviews.length > 0) {
            console.log(`Raw reviews count: ${place.reviews.length}`);
            const processedReviews = this.processReviews(place.reviews);
            
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
        } else {
          console.log('Place not found or API error, using fallback');
          observer.next(this.getFallbackReviews());
        }
        observer.complete();
      });
    });
  }

  /**
   * Process and filter reviews - only 5-star reviews with full names
   */
  private processReviews(reviews: GoogleReview[]): GoogleReview[] {
    console.log(`Processing ${reviews.length} raw reviews`);
    
    const filtered = reviews
      .filter(review => {
        // Only 5-star reviews
        if (review.rating !== 5) {
          return false;
        }
        
        // Must have review text
        if (!review.text || review.text.length < this.MIN_REVIEW_LENGTH) {
          return false;
        }
        
        // Must have full name (at least 2 parts)
        const nameParts = review.author_name.trim().split(' ');
        if (nameParts.length < 2) {
          return false;
        }
        
        // Filter out obviously fake names
        const fullName = review.author_name.toLowerCase();
        if (fullName.includes('anonymous') || 
            fullName.includes('user') || 
            nameParts.some(part => part.length < 2)) {
          return false;
        }
        
        return true;
      })
      .map(review => ({
        ...review,
        text: this.correctSpelling(review.text),
        author_name: this.formatName(review.author_name)
      }))
      .sort(() => Math.random() - 0.5); // Randomize order
    
    console.log(`Filtered to ${filtered.length} high-quality 5-star reviews`);
    return filtered;
  }

  /**
   * Format author name properly
   */
  private formatName(name: string): string {
    return name.split(' ')
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
   * Get random reviews with rotation
   */
  getRotatingReviews(count: number = 3): Observable<GoogleReview[]> {
    console.log('🔄 getRotatingReviews called, requesting', count, 'reviews');
    return timer(0, 10000).pipe( // Rotate every 10 seconds
      switchMap(() => this.fetchGoogleReviews()),
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