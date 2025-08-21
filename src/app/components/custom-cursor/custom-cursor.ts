import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cursor-dot" [style.left.px]="dotX" [style.top.px]="dotY"></div>
    <div class="cursor-outline" [style.left.px]="outlineX" [style.top.px]="outlineY"></div>
  `,
  styles: [`
    .cursor-dot {
      position: fixed;
      width: 8px;
      height: 8px;
      background: #005F73;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      mix-blend-mode: difference;
      transition: transform 0.2s ease;
    }
    
    .cursor-outline {
      position: fixed;
      width: 40px;
      height: 40px;
      border: 2px solid rgba(0, 95, 115, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: all 0.15s ease;
      transform: translate(-50%, -50%);
    }
    
    :host-context(body.link-hover) .cursor-outline {
      width: 60px;
      height: 60px;
      border-color: #FFB74D;
      background: rgba(255, 183, 77, 0.1);
    }
    
    :host-context(body.button-hover) .cursor-outline {
      width: 80px;
      height: 80px;
      border-color: #005F73;
      background: rgba(0, 95, 115, 0.1);
      mix-blend-mode: difference;
    }
    
    @media (max-width: 768px) {
      .cursor-dot, .cursor-outline {
        display: none;
      }
    }
  `]
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  dotX = 0;
  dotY = 0;
  outlineX = 0;
  outlineY = 0;
  
  private requestId: number | null = null;
  private targetX = 0;
  private targetY = 0;
  
  ngOnInit() {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      this.initCursor();
    }
  }
  
  ngOnDestroy() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }
    document.removeEventListener('mousemove', this.onMouseMove);
    this.removeHoverListeners();
  }
  
  private initCursor() {
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.addHoverListeners();
    this.animate();
    
    // Hide default cursor
    document.body.style.cursor = 'none';
  }
  
  private onMouseMove = (e: MouseEvent) => {
    this.targetX = e.clientX;
    this.targetY = e.clientY;
    
    // Instant update for dot
    this.dotX = e.clientX - 4;
    this.dotY = e.clientY - 4;
  };
  
  private animate = () => {
    // Smooth follow for outline
    this.outlineX += (this.targetX - this.outlineX) * 0.1;
    this.outlineY += (this.targetY - this.outlineY) * 0.1;
    
    this.requestId = requestAnimationFrame(this.animate);
  };
  
  private addHoverListeners() {
    // Add hover effects for links
    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('mouseenter', () => {
        document.body.classList.add('link-hover');
      });
      link.addEventListener('mouseleave', () => {
        document.body.classList.remove('link-hover');
      });
    });
    
    // Add hover effects for buttons
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('mouseenter', () => {
        document.body.classList.add('button-hover');
      });
      button.addEventListener('mouseleave', () => {
        document.body.classList.remove('button-hover');
      });
    });
  }
  
  private removeHoverListeners() {
    document.querySelectorAll('a').forEach(link => {
      link.removeEventListener('mouseenter', () => {});
      link.removeEventListener('mouseleave', () => {});
    });
    
    document.querySelectorAll('button').forEach(button => {
      button.removeEventListener('mouseenter', () => {});
      button.removeEventListener('mouseleave', () => {});
    });
  }
}