import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[scrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit {
  @Input() scrollReveal: 'fade-up' | 'fade-left' | 'fade-right' | 'zoom-in' | 'flip' = 'fade-up';
  @Input() scrollDelay: number = 0;
  @Input() scrollDuration: number = 1000;
  
  constructor(private el: ElementRef) {}
  
  ngOnInit() {
    const element = this.el.nativeElement as HTMLElement;
    const hasWindow = typeof window !== 'undefined';

    if (!hasWindow) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.transition = 'none';
      return;
    }

    const transitionEasing = 'var(--md-sys-motion-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))';
    const revealOffset = 'var(--md-sys-spacing-12)';
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.transition = 'none';
      return;
    }

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show the content immediately
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    // Set initial styles
    element.style.opacity = '0';
    element.style.transition =
      `opacity ${this.scrollDuration}ms ${transitionEasing} ${this.scrollDelay}ms, ` +
      `transform ${this.scrollDuration}ms ${transitionEasing} ${this.scrollDelay}ms`;

    // Set initial transform based on animation type
    switch(this.scrollReveal) {
      case 'fade-up':
        element.style.transform = `translateY(${revealOffset})`;
        break;
      case 'fade-left':
        element.style.transform = `translateX(${revealOffset})`;
        break;
      case 'fade-right':
        element.style.transform = `translateX(calc(-1 * ${revealOffset}))`;
        break;
      case 'zoom-in':
        element.style.transform = 'scale(0.8)';
        break;
      case 'flip':
        element.style.transform = 'rotateY(90deg)';
        break;
    }

    // Fallback: Show content after a maximum wait time
    const fallbackTimeoutMs = Math.max(1200, this.scrollDuration + this.scrollDelay + 300);
    const fallbackTimeout = setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    }, fallbackTimeoutMs);

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            clearTimeout(fallbackTimeout); // Clear fallback if observer triggers
            element.style.opacity = '1';
            element.style.transform = 'none';
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(element);
  }
}
