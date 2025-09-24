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
    const element = this.el.nativeElement;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show the content immediately
      element.style.opacity = '1';
      return;
    }

    // Set initial styles
    element.style.opacity = '0';
    element.style.transition = `all ${this.scrollDuration}ms cubic-bezier(0.4, 0, 0.2, 1) ${this.scrollDelay}ms`;

    // Set initial transform based on animation type
    switch(this.scrollReveal) {
      case 'fade-up':
        element.style.transform = 'translateY(50px)';
        break;
      case 'fade-left':
        element.style.transform = 'translateX(50px)';
        break;
      case 'fade-right':
        element.style.transform = 'translateX(-50px)';
        break;
      case 'zoom-in':
        element.style.transform = 'scale(0.8)';
        break;
      case 'flip':
        element.style.transform = 'rotateY(90deg)';
        break;
    }

    // Fallback: Show content after a maximum wait time
    const fallbackTimeout = setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    }, 2000 + this.scrollDelay); // Show after 2 seconds + delay

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