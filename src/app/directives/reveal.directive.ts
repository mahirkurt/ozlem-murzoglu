import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() revealClass: string = 'reveal';
  @Input() revealThreshold: number = 0.1;
  @Input() revealDelay: number = 0;
  @Input() revealAnimation: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'rotate' = 'fade';
  
  private observer: IntersectionObserver | null = null;
  private timeout: any;
  
  constructor(private el: ElementRef) {}
  
  ngOnInit() {
    this.setupAnimation();
    this.createObserver();
  }
  
  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  
  private setupAnimation() {
    const element = this.el.nativeElement;
    element.style.transition = `all 0.8s var(--ease-out) ${this.revealDelay}ms`;
    
    switch (this.revealAnimation) {
      case 'fade':
        element.style.opacity = '0';
        break;
      case 'slide-up':
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        break;
      case 'slide-left':
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        break;
      case 'slide-right':
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        break;
      case 'scale':
        element.style.opacity = '0';
        element.style.transform = 'scale(0.9)';
        break;
      case 'rotate':
        element.style.opacity = '0';
        element.style.transform = 'rotate(-5deg) scale(0.95)';
        break;
    }
  }
  
  private createObserver() {
    const options = {
      threshold: this.revealThreshold,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.timeout = setTimeout(() => {
            this.revealElement();
          }, this.revealDelay);
          
          if (this.observer) {
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, options);
    
    this.observer.observe(this.el.nativeElement);
  }
  
  private revealElement() {
    const element = this.el.nativeElement;
    element.style.opacity = '1';
    element.style.transform = 'none';
    element.classList.add('revealed');
  }
}