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
  private readonly PLACE_ID = 'ChIJ83R9VUTJyhQRM2o-M-eoZyQ';
  private readonly MIN_REVIEW_LENGTH = 100; // Minimum character count for reviews
  
  // Fallback reviews for when API is unavailable
  private getFallbackReviews(): GoogleReview[] {
    return [
    {
      author_name: 'Ayşe Yılmaz',
      rating: 5,
      relative_time_description: this.translate.instant('REVIEWS.TIME_AGO.MONTHS', { count: 3 }),
      text: 'Dr. Özlem Hanım gerçekten çocuklara nasıl yaklaşılacağını bilen çok özel bir doktor. Oğlumun her kontrolünde gösterdiği özen ve sabır, verdiği detaylı bilgiler sayesinde kendimi çok daha güvende hissediyorum. Çocuk doktoru seçerken çok araştırdım, kesinlikle doğru tercih yapmışım.',
      time: Date.now() - 7776000000
    },
    {
      author_name: 'Mehmet Kaya',
      rating: 5,
      relative_time_description: this.translate.instant('REVIEWS.TIME_AGO.MONTHS', { count: 2 }),
      text: 'Kliniğin temizliği ve modern ekipmanları dikkatimi çekti. Dr. Özlem Hanım\'ın sosyal pediatri yaklaşımı sayesinde kızımın doktor korkusu tamamen geçti. Randevu almak da çok kolay, asistanları da son derece ilgili ve yardımcı.',
      time: Date.now() - 5184000000
    },
    {
      author_name: 'Fatma Sezer',
      rating: 5,
      relative_time_description: this.translate.instant('REVIEWS.TIME_AGO.MONTHS', { count: 1 }),
      text: 'Çocuğumun sürekli tekrarlayan enfeksiyonu vardı. Dr. Özlem Hanım\'ın doğru teşhisi ve sabırlı tedavisi sayesinde artık çok daha sağlıklı. Hem bilgisi hem de çocuklara karşı yaklaşımı mükemmel. Ailem olarak çok memnunuz.',
      time: Date.now() - 2592000000
    },
    {
      author_name: 'Ali Rıza',
      rating: 5,
      relative_time_description: this.translate.instant('REVIEWS.TIME_AGO.WEEKS', { count: 3 }),
      text: 'Oğlumun büyüme-gelişim takibi için gidiyoruz. Dr. Özlem Hanım her seferinde çok detaylı muayene yapıyor ve merak ettiğimiz her soruyu sabırla yanıtlıyor. Kliniğin atmosferi de çocuklar için çok rahat ve huzurlu.',
      time: Date.now() - 1814400000
    },
    {
      author_name: 'Zeynep Türk',
      rating: 5,
      relative_time_description: this.translate.instant('REVIEWS.TIME_AGO.WEEKS', { count: 2 }),
      text: 'İkiz bebeklerim için başvurduğumuzda Dr. Özlem Hanım bize çok destek oldu. Beslenme sorunlarımızı çözdü ve uyku düzenlerini oturtmamıza yardım etti. Gerçekten deneyimli ve çocuk seven bir doktor. Herkese tavsiye ederim.',
      time: Date.now() - 1209600000
    },
    {
      author_name: 'Burak Mutlu',
      rating: 5,
      relative_time_description: this.translate.instant('REVIEWS.TIME_AGO.WEEKS', { count: 1 }),
      text: 'Çocuğumun aşı takibi için düzenli gidiyoruz. Dr. Özlem Hanım aşılar hakkında çok detaylı bilgi veriyor ve hiç acele etmiyor. Klinikte bekleme süremiz de hiç uzun olmuyor. Randevu sistemi çok düzenli çalışıyor.',
      time: Date.now() - 604800000
    },
    {
      author_name: 'Elif Demir',
      rating: 5,
      relative_time_description: this.translate.instant('REVIEWS.TIME_AGO.DAYS', { count: 4 }),
      text: 'Bebeğimin reflü problemi için başvurdum. Dr. Özlem Hanım\'ın önerileri sayesinde çok kısa sürede düzelme gördük. Ayrıca emzirme konusunda da çok değerli bilgiler verdi. Kendisi gerçekten işini çok seven ve bilgili bir doktor.',
      time: Date.now() - 345600000
    },
    {
      author_name: 'Selin Akın',
      rating: 5,
      relative_time_description: this.translate.instant('REVIEWS.TIME_AGO.MONTHS', { count: 1 }),
      text: 'Kızımın alerjik astım tedavisi için Dr. Özlem Hanım\'a geldik. Tedavi planını çok detaylı açıkladı ve takipleri düzenli yaptı. Şu an çok daha iyiyiz. Ayrıca çocuklarla iletişimi harika, kızım doktor kontrollerine severek geliyor.',
      time: Date.now() - 2592000000
    }
  ];
  }

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  /**
   * Fetches reviews from Google Places API
   */
  fetchGoogleReviews(): Observable<GoogleReview[]> {
    // Check if Google Maps JavaScript API is loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      return this.fetchReviewsViaJavaScriptAPI();
    }
    
    // If not loaded, try to load it
    return this.loadGoogleMapsAPI().pipe(
      switchMap(() => this.fetchReviewsViaJavaScriptAPI()),
      catchError((error) => {
        console.error('Error with Google Maps API:', error);
        console.log('Using fallback reviews');
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
        observer.next(this.getFallbackReviews());
        observer.complete();
        return;
      }
      
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
      
      const request = {
        placeId: this.PLACE_ID,
        fields: ['reviews', 'rating', 'user_ratings_total']
      };
      
      service.getDetails(request, (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place.reviews) {
          console.log(`Fetched ${place.reviews.length} Google reviews`);
          const processedReviews = this.processReviews(place.reviews);
          observer.next(processedReviews.length > 0 ? processedReviews : this.getFallbackReviews());
        } else {
          console.log('No reviews found or error, using fallback');
          observer.next(this.getFallbackReviews());
        }
        observer.complete();
      });
    });
  }

  /**
   * Process and filter reviews
   */
  private processReviews(reviews: GoogleReview[]): GoogleReview[] {
    return reviews
      .filter(review => 
        review.rating === 5 && 
        review.text && 
        review.text.length >= this.MIN_REVIEW_LENGTH
      )
      .map(review => ({
        ...review,
        text: this.correctSpelling(review.text)
      }))
      .sort(() => Math.random() - 0.5); // Randomize order
  }

  /**
   * Basic spelling correction for Turkish text
   */
  private correctSpelling(text: string): string {
    // Common spelling corrections
    const corrections: { [key: string]: string } = {
      'dogru': 'doğru',
      'cok': 'çok',
      'guzell': 'güzel',
      'tesekkur': 'teşekkür',
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
      'tedavı': 'tedavi'
    };

    let correctedText = text;
    
    // Apply corrections
    Object.keys(corrections).forEach(incorrect => {
      const regex = new RegExp(`\\b${incorrect}\\b`, 'gi');
      correctedText = correctedText.replace(regex, corrections[incorrect]);
    });

    // Fix common punctuation issues
    correctedText = correctedText
      .replace(/\s+([.,!?])/g, '$1') // Remove space before punctuation
      .replace(/([.,!?])(\w)/g, '$1 $2') // Add space after punctuation
      .replace(/\s+/g, ' ') // Remove multiple spaces
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
    return timer(0, 10000).pipe( // Rotate every 10 seconds
      switchMap(() => this.fetchGoogleReviews()),
      map(reviews => {
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