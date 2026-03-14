import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
export class GoogleBusinessReviewsComponent implements OnInit, OnDestroy {
  private readonly googleReviewsService = inject(GoogleReviewsService);
  private readonly autoRotateIntervalMs = 7000;

  readonly googleBusinessProfileUrl = 'https://maps.app.goo.gl/T6NqV7g4LzakSesKA';

  reviews: GoogleReview[] = [];
  loading = true;
  hasData = false;

  averageRating = 0;
  reviewCount = 0;
  activeIndex = 0;
  isAutoRotateEnabled = true;

  private autoRotateTimerId: ReturnType<typeof setInterval> | null = null;
  private isCarouselInteracting = false;
  private prefersReducedMotion = false;

  ngOnInit(): void {
    this.prefersReducedMotion = this.detectReducedMotionPreference();
    this.isAutoRotateEnabled = !this.prefersReducedMotion;

    this.googleReviewsService.fetchGoogleReviews().subscribe({
      next: ({ reviews, summary }) => {
        this.reviews = reviews.slice(0, 8);
        this.averageRating = summary.rating;
        this.reviewCount = summary.reviewCount;
        this.hasData = reviews.length > 0 || summary.reviewCount > 0;
        this.loading = false;
        this.activeIndex = 0;
        this.syncAutoRotate();
      },
      error: () => {
        this.loading = false;
        this.hasData = false;
        this.clearAutoRotateTimer();
      }
    });
  }

  ngOnDestroy(): void {
    this.clearAutoRotateTimer();
  }

  get activeReview(): GoogleReview | null {
    return this.reviews[this.activeIndex] ?? null;
  }

  get hasMultipleReviews(): boolean {
    return this.reviews.length > 1;
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
    return [0, 1, 2, 3, 4].map(index => index < Math.round(rating));
  }

  trackByReview(index: number, review: GoogleReview): string {
    return `${review.author_name}-${review.time}-${index}`;
  }

  showPreviousReview(): void {
    if (!this.hasMultipleReviews) {
      return;
    }

    this.activeIndex = (this.activeIndex - 1 + this.reviews.length) % this.reviews.length;
    this.restartAutoRotateAfterManualAction();
  }

  showNextReview(fromAutoRotate = false): void {
    if (!this.hasMultipleReviews) {
      return;
    }

    this.activeIndex = (this.activeIndex + 1) % this.reviews.length;

    if (!fromAutoRotate) {
      this.restartAutoRotateAfterManualAction();
    }
  }

  goToReview(index: number): void {
    if (index < 0 || index >= this.reviews.length || index === this.activeIndex) {
      return;
    }

    this.activeIndex = index;
    this.restartAutoRotateAfterManualAction();
  }

  toggleAutoRotate(): void {
    this.isAutoRotateEnabled = !this.isAutoRotateEnabled;
    this.syncAutoRotate();
  }

  onCarouselMouseEnter(): void {
    this.isCarouselInteracting = true;
    this.clearAutoRotateTimer();
  }

  onCarouselMouseLeave(): void {
    this.isCarouselInteracting = false;
    this.syncAutoRotate();
  }

  onCarouselFocusIn(): void {
    this.isCarouselInteracting = true;
    this.clearAutoRotateTimer();
  }

  onCarouselFocusOut(event: FocusEvent): void {
    const currentTarget = event.currentTarget as HTMLElement | null;
    const relatedTarget = event.relatedTarget as Node | null;

    if (currentTarget && relatedTarget && currentTarget.contains(relatedTarget)) {
      return;
    }

    this.isCarouselInteracting = false;
    this.syncAutoRotate();
  }

  onCarouselKeydown(event: KeyboardEvent): void {
    if (!this.hasMultipleReviews) {
      return;
    }

    const target = event.target as HTMLElement | null;
    const tagName = target?.tagName?.toLowerCase();

    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.showPreviousReview();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.showNextReview();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.goToReview(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.goToReview(this.reviews.length - 1);
    }
  }

  private restartAutoRotateAfterManualAction(): void {
    if (!this.isAutoRotateEnabled) {
      return;
    }

    this.clearAutoRotateTimer();
    this.syncAutoRotate();
  }

  private syncAutoRotate(): void {
    const shouldAutoRotate =
      !this.loading &&
      this.hasMultipleReviews &&
      this.isAutoRotateEnabled &&
      !this.prefersReducedMotion &&
      !this.isCarouselInteracting;

    if (!shouldAutoRotate) {
      this.clearAutoRotateTimer();
      return;
    }

    if (this.autoRotateTimerId !== null || typeof window === 'undefined') {
      return;
    }

    this.autoRotateTimerId = window.setInterval(() => {
      this.showNextReview(true);
    }, this.autoRotateIntervalMs);
  }

  private clearAutoRotateTimer(): void {
    if (this.autoRotateTimerId !== null) {
      clearInterval(this.autoRotateTimerId);
      this.autoRotateTimerId = null;
    }
  }

  private detectReducedMotionPreference(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
