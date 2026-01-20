import { Component, Input, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface TocItem {
  id: string;
  text: string;
  level: number;
  active?: boolean;
}

@Component({
  selector: 'app-toc-sidebar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <aside class="toc-sidebar" [class.toc-sidebar--sticky]="sticky">
      <nav class="toc-nav">
        <h3 class="toc-title">
          <span class="material-icons-rounded">format_list_bulleted</span>
          {{ 'RESOURCES.TABLE_OF_CONTENTS' | translate }}
        </h3>

        <ul class="toc-list">
          <li
            *ngFor="let item of toc"
            class="toc-item"
            [class.toc-item--level-1]="item.level === 1"
            [class.toc-item--level-2]="item.level === 2"
            [class.toc-item--level-3]="item.level === 3"
            [class.toc-item--active]="item.active"
          >
            <a [href]="'#' + item.id" class="toc-link" (click)="scrollToSection($event, item.id)">
              {{ item.text }}
            </a>
          </li>
        </ul>

        <div class="toc-progress" *ngIf="showProgress">
          <div class="toc-progress-bar" [style.width.%]="progressPercentage"></div>
        </div>
      </nav>
    </aside>
  `,
  styleUrls: ['./toc-sidebar.component.scss'],
})
export class TocSidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() toc: TocItem[] = [];
  @Input() sticky: boolean = true;
  @Input() showProgress: boolean = true;

  progressPercentage: number = 0;
  private observer?: IntersectionObserver;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.updateProgress.bind(this));
    }
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.updateProgress.bind(this));
    }

    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver() {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      return;
    }

    const options = {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const tocItem = this.toc.find((item) => item.id === id);

        if (tocItem) {
          tocItem.active = entry.isIntersecting;
        }
      });

      // Ensure only one item is active at a time
      const activeItems = this.toc.filter((item) => item.active);
      if (activeItems.length > 1) {
        // Keep only the first active item
        activeItems.slice(1).forEach((item) => (item.active = false));
      }
    }, options);

    // Observe all headings
    this.toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        this.observer?.observe(element);
      }
    });
  }

  private updateProgress() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.progressPercentage = (winScroll / height) * 100;
  }

  scrollToSection(event: Event, id: string) {
    event.preventDefault();
    const element = document.getElementById(id);

    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
}
