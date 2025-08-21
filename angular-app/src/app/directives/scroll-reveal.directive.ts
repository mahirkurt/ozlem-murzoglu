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
    
    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
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