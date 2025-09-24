import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { GoogleReviewsService, GoogleReview } from '../../services/google-reviews.service';
import { Subscription } from 'rxjs';

interface Testimonial {
  id: number;
  author: string;
  initials: string;
  text: string;
  textKey: string;
  rating: number;
  date: string;
  dateKey: string;
}

@Component({
  selector: 'app-testimonial-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './testimonial-section.component.html',
  styleUrl: './testimonial-section.component.css'
})
export class TestimonialSectionComponent implements OnInit, OnDestroy {
  rating = 5.0;
  ratingArray = Array(5).fill(0);
  currentTestimonialIndex = 0;
  private testimonialInterval: any;
  private reviewsSubscription?: Subscription;
  private langChangeSubscription?: Subscription;
  googleReviews: GoogleReview[] = [];
  isLoadingReviews = true;
  allReviews: GoogleReview[] = []; // Store all fetched reviews

  // No mock data - only real Google reviews
  testimonials: Testimonial[] = [];

  constructor(
    private googleReviewsService: GoogleReviewsService,
    private translate: TranslateService
  ) {}

  get currentTestimonials(): Testimonial[] {
    // Only use real Google reviews
    if (this.googleReviews.length > 0) {
      const startIndex = this.currentTestimonialIndex % Math.max(1, this.googleReviews.length);
      const reviewsToShow = [];

      // Show up to 3 reviews, cycling through all available
      for (let i = 0; i < Math.min(3, this.googleReviews.length); i++) {
        const index = (startIndex + i) % this.googleReviews.length;
        const review = this.googleReviews[index];
        reviewsToShow.push({
          id: index + 1,
          author: review.author_name,
          initials: this.googleReviewsService.getAuthorInitials(review.author_name),
          text: review.text,
          textKey: '',
          rating: review.rating,
          date: review.relative_time_description,
          dateKey: ''
        });
      }
      return reviewsToShow;
    }

    // No reviews available - return empty array
    return [];
  }

  ngOnInit() {
    this.loadGoogleReviews();
    this.startTestimonialRotation();

    // Listen for language changes
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log('Language changed to:', event.lang);
      // Clear cache and reload reviews in new language
      this.googleReviewsService.clearCache();
      this.loadGoogleReviews();
    });
  }

  private loadGoogleReviews() {
    this.isLoadingReviews = true;
    // Get all reviews once, no timer
    this.reviewsSubscription = this.googleReviewsService.getRotatingReviews(50).subscribe({
      next: (reviews) => {
        this.allReviews = reviews;
        this.googleReviews = reviews.slice(0, 10); // Show first 10
        this.isLoadingReviews = false;
      },
      error: (error) => {
        console.error('Error loading Google reviews:', error);
        this.isLoadingReviews = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
    if (this.reviewsSubscription) {
      this.reviewsSubscription.unsubscribe();
    }
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private startTestimonialRotation() {
    this.testimonialInterval = setInterval(() => {
      if (this.allReviews.length > 3) {
        // Rotate through all stored reviews
        this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % Math.max(1, this.allReviews.length);
        // Update displayed reviews
        const startIdx = this.currentTestimonialIndex % this.allReviews.length;
        this.googleReviews = [...this.allReviews.slice(startIdx), ...this.allReviews.slice(0, startIdx)].slice(0, 10);
      }
    }, 15000); // Rotate every 15 seconds (faster rotation)
  }

  trackByTestimonialId(index: number, testimonial: Testimonial): number {
    return testimonial.id;
  }
}