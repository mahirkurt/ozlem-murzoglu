import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GoogleReview, GoogleReviewsService } from '../../services/google-reviews.service';

@Component({
  selector: 'app-google-business-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './google-business-reviews.component.html',
  styleUrl: './google-business-reviews.component.scss'
})
export class GoogleBusinessReviewsComponent implements OnInit {
  private readonly googleReviewsService = inject(GoogleReviewsService);

  readonly googleBusinessProfileUrl = 'https://maps.app.goo.gl/T6NqV7g4LzakSesKA';

  reviews: GoogleReview[] = [];
  loading = true;

  averageRating = 0;
  reviewCount = 0;

  ngOnInit(): void {
    this.googleReviewsService.fetchGoogleReviews().subscribe({
      next: (reviews) => {
        const ratedReviews = reviews.filter((review) => typeof review.rating === 'number' && review.rating > 0);

        this.reviews = ratedReviews.slice(0, 3);
        this.reviewCount = ratedReviews.length;

        if (ratedReviews.length > 0) {
          const total = ratedReviews.reduce((sum, review) => sum + review.rating, 0);
          this.averageRating = Number((total / ratedReviews.length).toFixed(1));
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getRatingPercent(): number {
    return Math.max(0, Math.min(100, (this.averageRating / 5) * 100));
  }

  getAuthorInitials(name: string): string {
    return this.googleReviewsService.getAuthorInitials(name);
  }

  getRelativeTime(review: GoogleReview): string {
    if (review.time) {
      return this.googleReviewsService.formatRelativeTime(review.time);
    }

    return review.relative_time_description || '';
  }

  asFiveStarArray(rating: number): boolean[] {
    return [0, 1, 2, 3, 4].map((index) => index < Math.round(rating));
  }
}

