import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wave-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wave-divider" [ngClass]="'wave-' + type" [style.height.px]="height">
      <svg 
        preserveAspectRatio="none" 
        viewBox="0 0 1200 120" 
        xmlns="http://www.w3.org/2000/svg"
        [style.height.px]="height"
        [style.width]="'100%'"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" [style.stop-color]="color1" />
            <stop offset="50%" [style.stop-color]="color2" />
            <stop offset="100%" [style.stop-color]="color3" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" [style.stop-color]="color2" [style.stop-opacity]="0.5" />
            <stop offset="50%" [style.stop-color]="color3" [style.stop-opacity]="0.5" />
            <stop offset="100%" [style.stop-color]="color1" [style.stop-opacity]="0.5" />
          </linearGradient>
        </defs>
        
        <!-- Wave Type 1: Smooth -->
        <path *ngIf="type === 'smooth'" 
          d="M0,60 C150,100 350,20 600,60 C850,100 1050,20 1200,60 L1200,120 L0,120 Z"
          fill="url(#waveGradient1)"
          class="wave-path wave-1"
        />
        <path *ngIf="type === 'smooth'" 
          d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,120 L0,120 Z"
          fill="url(#waveGradient2)"
          class="wave-path wave-2"
        />
        
        <!-- Wave Type 2: Sharp -->
        <path *ngIf="type === 'sharp'" 
          d="M0,80 L200,40 L400,80 L600,20 L800,80 L1000,40 L1200,80 L1200,120 L0,120 Z"
          fill="url(#waveGradient1)"
          class="wave-path wave-1"
        />
        <path *ngIf="type === 'sharp'" 
          d="M0,60 L300,20 L600,60 L900,20 L1200,60 L1200,120 L0,120 Z"
          fill="url(#waveGradient2)"
          class="wave-path wave-2"
        />
        
        <!-- Wave Type 3: Curve -->
        <path *ngIf="type === 'curve'" 
          d="M0,20 Q300,80 600,40 T1200,20 L1200,120 L0,120 Z"
          fill="url(#waveGradient1)"
          class="wave-path wave-1"
        />
        <path *ngIf="type === 'curve'" 
          d="M0,40 Q300,100 600,60 T1200,40 L1200,120 L0,120 Z"
          fill="url(#waveGradient2)"
          class="wave-path wave-2"
        />
        
        <!-- Wave Type 4: Ocean -->
        <path *ngIf="type === 'ocean'" 
          d="M0,30 C100,60 200,10 300,40 C400,70 500,20 600,50 C700,80 800,30 900,60 C1000,90 1100,40 1200,70 L1200,120 L0,120 Z"
          fill="url(#waveGradient1)"
          class="wave-path wave-1"
        />
        <path *ngIf="type === 'ocean'" 
          d="M0,50 C150,80 250,30 400,60 C550,90 650,40 800,70 C950,100 1050,50 1200,80 L1200,120 L0,120 Z"
          fill="url(#waveGradient2)"
          class="wave-path wave-2"
        />
      </svg>
    </div>
  `,
  styles: [`
    .wave-divider {
      position: relative;
      width: 100%;
      overflow: hidden;
      line-height: 0;
      transform: rotate(180deg);
    }
    
    .wave-divider.flip {
      transform: rotate(0deg);
    }
    
    svg {
      position: relative;
      display: block;
      width: 100%;
    }
    
    .wave-path {
      transition: all 0.5s var(--ease-in-out);
    }
    
    .wave-1 {
      animation: wave-animation-1 20s linear infinite;
    }
    
    .wave-2 {
      animation: wave-animation-2 15s linear infinite;
      animation-direction: reverse;
    }
    
    @keyframes wave-animation-1 {
      0% { transform: translateX(0); }
      100% { transform: translateX(-1200px); }
    }
    
    @keyframes wave-animation-2 {
      0% { transform: translateX(0); }
      100% { transform: translateX(-1200px); }
    }
    
    @media (prefers-reduced-motion: reduce) {
      .wave-1, .wave-2 {
        animation: none;
      }
    }
  `]
})
export class WaveDividerComponent {
  @Input() type: 'smooth' | 'sharp' | 'curve' | 'ocean' = 'smooth';
  @Input() height: number = 120;
  @Input() color1: string = 'var(--color-primary)';
  @Input() color2: string = 'var(--color-primary-light)';
  @Input() color3: string = 'var(--color-secondary)';
  @Input() flip: boolean = false;
}