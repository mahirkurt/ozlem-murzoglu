import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  @Input() appLazyLoad: string = ''; // Image source
  @Input() lazyPlaceholder: string = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect width="1" height="1" fill="%23f0f0f0"/%3E%3C/svg%3E';
  @Input() lazyBlur: boolean = true;
  
  private observer: IntersectionObserver | null = null;
  private img: HTMLImageElement | null = null;
  
  constructor(private el: ElementRef) {}
  
  ngOnInit() {
    const element = this.el.nativeElement;
    
    if (element.tagName === 'IMG') {
      this.img = element as HTMLImageElement;
      this.setupLazyLoading();
    } else {
      // For background images
      this.setupBackgroundLazyLoading();
    }
  }
  
  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
  
  private setupLazyLoading() {
    if (!this.img) return;
    
    // Set placeholder
    this.img.src = this.lazyPlaceholder;
    
    // Add blur effect
    if (this.lazyBlur) {
      this.img.style.filter = 'blur(10px)';
      this.img.style.transition = 'filter 0.5s var(--ease-out)';
    }
    
    // Add skeleton loading class
    this.img.classList.add('skeleton');
    
    // Create observer
    this.createObserver();
  }
  
  private setupBackgroundLazyLoading() {
    const element = this.el.nativeElement;
    
    // Set placeholder background
    element.style.backgroundImage = `url(${this.lazyPlaceholder})`;
    element.style.backgroundSize = 'cover';
    element.style.backgroundPosition = 'center';
    
    // Add blur effect
    if (this.lazyBlur) {
      element.style.filter = 'blur(10px)';
      element.style.transition = 'filter 0.5s var(--ease-out)';
    }
    
    // Add skeleton loading class
    element.classList.add('skeleton');
    
    // Create observer
    this.createBackgroundObserver();
  }
  
  private createObserver() {
    const options = {
      threshold: 0.01,
      rootMargin: '50px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage();
          if (this.observer) {
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, options);
    
    if (this.img) {
      this.observer.observe(this.img);
    }
  }
  
  private createBackgroundObserver() {
    const options = {
      threshold: 0.01,
      rootMargin: '50px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadBackgroundImage();
          if (this.observer) {
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, options);
    
    this.observer.observe(this.el.nativeElement);
  }
  
  private loadImage() {
    if (!this.img || !this.appLazyLoad) return;
    
    // Create a new image to preload
    const tempImg = new Image();
    
    tempImg.onload = () => {
      if (this.img) {
        // Remove skeleton class
        this.img.classList.remove('skeleton');
        
        // Set the actual image
        this.img.src = this.appLazyLoad;
        
        // Remove blur effect
        if (this.lazyBlur) {
          this.img.style.filter = 'none';
        }
        
        // Add loaded class for animations
        this.img.classList.add('lazy-loaded');
      }
    };
    
    tempImg.onerror = () => {
      console.error('Failed to load image:', this.appLazyLoad);
      if (this.img) {
        this.img.classList.remove('skeleton');
        this.img.classList.add('lazy-error');
      }
    };
    
    // Start loading
    tempImg.src = this.appLazyLoad;
  }
  
  private loadBackgroundImage() {
    const element = this.el.nativeElement;
    if (!this.appLazyLoad) return;
    
    // Create a new image to preload
    const tempImg = new Image();
    
    tempImg.onload = () => {
      // Remove skeleton class
      element.classList.remove('skeleton');
      
      // Set the actual background image
      element.style.backgroundImage = `url(${this.appLazyLoad})`;
      
      // Remove blur effect
      if (this.lazyBlur) {
        element.style.filter = 'none';
      }
      
      // Add loaded class for animations
      element.classList.add('lazy-loaded');
    };
    
    tempImg.onerror = () => {
      console.error('Failed to load background image:', this.appLazyLoad);
      element.classList.remove('skeleton');
      element.classList.add('lazy-error');
    };
    
    // Start loading
    tempImg.src = this.appLazyLoad;
  }
}