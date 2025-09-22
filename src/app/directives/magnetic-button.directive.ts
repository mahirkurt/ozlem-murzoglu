import { Directive, ElementRef, HostListener, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appMagneticButton]',
  standalone: true
})
export class MagneticButtonDirective implements OnInit {
  @Input() magneticStrength: number = 0.3;
  @Input() magneticRadius: number = 100;
  
  private button: HTMLElement;
  private boundingRect: DOMRect | null = null;
  
  constructor(private el: ElementRef) {
    this.button = this.el.nativeElement;
  }
  
  ngOnInit() {
    this.button.style.transition = 'transform 0.2s var(--ease-out)';
    this.button.style.willChange = 'transform';
  }
  
  @HostListener('mouseenter')
  onMouseEnter() {
    this.boundingRect = this.button.getBoundingClientRect();
  }
  
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.boundingRect) return;
    
    const centerX = this.boundingRect.left + this.boundingRect.width / 2;
    const centerY = this.boundingRect.top + this.boundingRect.height / 2;
    
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < this.magneticRadius) {
      const pullX = deltaX * this.magneticStrength;
      const pullY = deltaY * this.magneticStrength;
      
      this.button.style.transform = `translate(${pullX}px, ${pullY}px)`;
    }
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    this.button.style.transform = 'translate(0, 0)';
    this.boundingRect = null;
  }
  
  @HostListener('click')
  onClick() {
    // Add ripple effect on click
    this.createRipple();
  }
  
  private createRipple() {
    const ripple = document.createElement('span');
    ripple.classList.add('magnetic-ripple');
    ripple.style.cssText = `
      position: absolute;
      border-radius: var(--md-sys-shape-corner-full);
      background: rgba(255, 255, 255, 0.5);
      width: 100px;
      height: 100px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: magnetic-ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes magnetic-ripple {
        to {
          transform: translate(-50%, -50%) scale(4);
          opacity: 0;
        }
      }
    `;
    
    if (!document.head.querySelector('#magnetic-ripple-style')) {
      style.id = 'magnetic-ripple-style';
      document.head.appendChild(style);
    }
    
    this.button.style.position = 'relative';
    this.button.style.overflow = 'hidden';
    this.button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}