import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChildren,
  QueryList,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface StatItem {
  value: number;
  suffix: string;
  labelKey: string;
  isText?: boolean;
  textValue?: string;
}

@Component({
  selector: 'app-stats-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './stats-section.component.html',
  styleUrl: './stats-section.component.scss'
})
export class StatsSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('statValue') statValueElements!: QueryList<ElementRef<HTMLElement>>;

  private platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  stats: StatItem[] = [
    { value: 15, suffix: '+', labelKey: 'HOME.STATS_YEARS' },
    { value: 5000, suffix: '+', labelKey: 'HOME.STATS_FAMILIES' },
    { value: 3, suffix: '', labelKey: 'HOME.STATS_CERTS' },
    { value: 0, suffix: '', labelKey: 'HOME.STATS_AAP', isText: true, textValue: 'AAP' }
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.runCountUpAnimations();
            this.observer?.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    // Observe the host element's parent section
    const hostEl = this.statValueElements.first?.nativeElement.closest('.stats-section');
    if (hostEl) {
      this.observer.observe(hostEl);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private runCountUpAnimations(): void {
    const elements = this.statValueElements.toArray();
    elements.forEach((elRef, index) => {
      const stat = this.stats[index];
      if (stat.isText) {
        elRef.nativeElement.textContent = stat.textValue!;
      } else {
        this.animateCount(elRef.nativeElement, stat.value, stat.suffix, 2000);
      }
    });
  }

  private animateCount(element: HTMLElement, target: number, suffix: string, duration: number): void {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.textContent = target + suffix;
      return;
    }

    const start = performance.now();
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = Math.floor(eased * target);
      element.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target + suffix;
      }
    };
    requestAnimationFrame(update);
  }
}
