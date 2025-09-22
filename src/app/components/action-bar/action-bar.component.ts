import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="action-bar" [@slideInUp]>
      <div class="action-bar__container">
        <div class="action-bar__group">
          <button
            class="action-btn action-btn--primary"
            (click)="handlePrint()"
            [attr.aria-label]="'ACTIONS.PRINT' | translate"
          >
            <span class="material-icons">print</span>
            <span class="action-btn__label">{{ 'ACTIONS.PRINT' | translate }}</span>
          </button>

          <button
            class="action-btn"
            (click)="handleDownload()"
            *ngIf="downloadLink"
            [attr.aria-label]="'ACTIONS.DOWNLOAD' | translate"
          >
            <span class="material-icons">download</span>
            <span class="action-btn__label">{{ 'ACTIONS.DOWNLOAD' | translate }}</span>
          </button>

          <button
            class="action-btn"
            (click)="handleShare()"
            [attr.aria-label]="'ACTIONS.SHARE' | translate"
          >
            <span class="material-icons">share</span>
            <span class="action-btn__label">{{ 'ACTIONS.SHARE' | translate }}</span>
          </button>

          <button
            class="action-btn"
            (click)="handleBookmark()"
            [class.action-btn--active]="isBookmarked"
            [attr.aria-label]="
              isBookmarked ? ('ACTIONS.BOOKMARKED' | translate) : ('ACTIONS.BOOKMARK' | translate)
            "
          >
            <span class="material-icons">{{ isBookmarked ? 'bookmark' : 'bookmark_border' }}</span>
            <span class="action-btn__label">
              {{ (isBookmarked ? 'ACTIONS.BOOKMARKED' : 'ACTIONS.BOOKMARK') | translate }}
            </span>
          </button>
        </div>

        <div class="action-bar__feedback" *ngIf="showFeedback">
          <span class="feedback-label">{{ 'ACTIONS.WAS_HELPFUL' | translate }}</span>
          <button
            class="feedback-btn"
            (click)="handleFeedback(true)"
            [class.feedback-btn--active]="feedbackGiven === true"
            [attr.aria-label]="'ACTIONS.YES' | translate"
          >
            <span class="material-icons">thumb_up</span>
          </button>
          <button
            class="feedback-btn"
            (click)="handleFeedback(false)"
            [class.feedback-btn--active]="feedbackGiven === false"
            [attr.aria-label]="'ACTIONS.NO' | translate"
          >
            <span class="material-icons">thumb_down</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnInit {
  @Input() downloadLink?: string;
  @Input() showFeedback: boolean = true;
  @Input() isBookmarked: boolean = false;

  @Output() print = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();
  @Output() share = new EventEmitter<void>();
  @Output() bookmark = new EventEmitter<void>();
  @Output() feedback = new EventEmitter<boolean>();

  feedbackGiven: boolean | null = null;

  constructor() {}

  handlePrint() {
    this.print.emit();
    window.print();
  }

  handleDownload() {
    if (this.downloadLink) {
      this.download.emit();
      window.open(this.downloadLink, '_blank');
    }
  }

  async handleShare() {
    this.share.emit();

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        this.copyToClipboard();
      }
    } else {
      this.copyToClipboard();
    }
  }

  private copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.showSnackbar('Link kopyalandı!', 'Tamam', 3000);
    });
  }

  private showSnackbar(message: string, action?: string, duration: number = 3000) {
    // Remove existing snackbar if any
    const existingSnackbar = document.querySelector('.md3-snackbar');
    if (existingSnackbar) {
      existingSnackbar.remove();
    }

    // Create MD3 snackbar element
    const snackbar = document.createElement('div');
    snackbar.className = 'md3-snackbar';
    snackbar.innerHTML = `
      <span>${message}</span>
      ${action ? `<button class="md3-snackbar-action">${action}</button>` : ''}
    `;

    document.body.appendChild(snackbar);

    // Add visible class after a brief delay for animation
    setTimeout(() => snackbar.classList.add('md3-snackbar-visible'), 10);

    // Handle action button click if present
    if (action) {
      const actionBtn = snackbar.querySelector('.md3-snackbar-action');
      actionBtn?.addEventListener('click', () => {
        snackbar.classList.remove('md3-snackbar-visible');
        setTimeout(() => snackbar.remove(), 300);
      });
    }

    // Auto-hide after duration
    setTimeout(() => {
      snackbar.classList.remove('md3-snackbar-visible');
      setTimeout(() => snackbar.remove(), 300);
    }, duration);
  }

  handleBookmark() {
    this.isBookmarked = !this.isBookmarked;
    this.bookmark.emit();

    // Save bookmark state to localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const currentUrl = window.location.href;

    if (this.isBookmarked) {
      if (!bookmarks.includes(currentUrl)) {
        bookmarks.push(currentUrl);
      }
      this.showSnackbar('Kaydedildi!', 'Tamam', 2000);
    } else {
      const index = bookmarks.indexOf(currentUrl);
      if (index > -1) {
        bookmarks.splice(index, 1);
      }
      this.showSnackbar('Kayıt kaldırıldı', 'Tamam', 2000);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  handleFeedback(isHelpful: boolean) {
    this.feedbackGiven = isHelpful;
    this.feedback.emit(isHelpful);

    this.showSnackbar(
      isHelpful ? 'Teşekkürler! Geri bildiriminiz alındı.' : 'Geri bildiriminiz için teşekkürler.',
      'Tamam',
      3000
    );
  }

  ngOnInit() {
    // Check if current page is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    this.isBookmarked = bookmarks.includes(window.location.href);
  }
}
