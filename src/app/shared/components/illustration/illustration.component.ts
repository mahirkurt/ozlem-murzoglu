import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-illustration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <figure class="illustration-wrapper" 
            [class.glass-card]="glassEffect"
            [class.animated]="animated"
            [class.size-small]="size === 'small'"
            [class.size-medium]="size === 'medium'"
            [class.size-large]="size === 'large'"
            [attr.aria-labelledby]="titleId">
      
      <svg *ngIf="type === 'about'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <defs>
          <linearGradient id="grad-about" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" class="illo-fill-primary" style="stop-opacity:0.1"/>
            <stop offset="100%" class="illo-fill-secondary" style="stop-opacity:0.05"/>
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#grad-about)"/>
        <g transform="translate(300, 200)">
          <circle r="120" class="illo-fill-primary" opacity="0.1"/>
          <circle r="80" class="illo-fill-primary" opacity="0.2"/>
          <path d="M-60,-60 Q0,-80 60,-60 T60,0 Q0,20 -60,0 T-60,-60" class="illo-fill-secondary"/>
          <circle cx="-20" cy="-10" r="5" class="illo-fill-surface"/>
          <circle cx="20" cy="-10" r="5" class="illo-fill-surface"/>
          <path d="M-15,10 Q0,20 15,10" class="illo-stroke-strong" stroke-width="2" fill="none"/>
        </g>
        <g transform="translate(150, 300)">
          <rect x="-40" y="-30" width="80" height="60" rx="10" class="illo-fill-accent" opacity="0.3"/>
          <path d="M-20,-10 L0,-20 L20,-10 L20,10 L0,20 L-20,10 Z" class="illo-fill-accent"/>
        </g>
        <g transform="translate(450, 100)">
          <circle r="40" class="illo-fill-secondary" opacity="0.3"/>
          <path d="M-20,0 L-10,-17 L10,-17 L20,0 L10,17 L-10,17 Z" class="illo-fill-secondary"/>
        </g>
      </svg>

      <svg *ngIf="type === 'services'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <defs>
          <linearGradient id="grad-services" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" class="illo-fill-secondary" style="stop-opacity:0.1"/>
            <stop offset="100%" class="illo-fill-accent" style="stop-opacity:0.05"/>
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#grad-services)"/>
        <g transform="translate(300, 200)">
          <rect x="-150" y="-100" width="300" height="200" rx="20" class="illo-stroke-weak" stroke-width="2" fill="none"/>
          <rect x="-130" y="-80" width="80" height="80" rx="10" class="illo-fill-primary" opacity="0.2"/>
          <rect x="-40" y="-80" width="80" height="80" rx="10" class="illo-fill-secondary" opacity="0.2"/>
          <rect x="50" y="-80" width="80" height="80" rx="10" class="illo-fill-accent" opacity="0.2"/>
          <circle cx="-90" cy="-40" r="25" class="illo-fill-primary"/>
          <circle cx="0" cy="-40" r="25" class="illo-fill-secondary"/>
          <circle cx="90" cy="-40" r="25" class="illo-fill-accent"/>
          <path d="M-90,-40 L-90,-25 M-90,-40 L-75,-40" class="illo-stroke-surface" stroke-width="3" stroke-linecap="round"/>
          <path d="M0,-40 L0,-25 M-8,-40 L8,-40" class="illo-stroke-surface" stroke-width="3" stroke-linecap="round"/>
          <path d="M90,-50 L90,-30 M80,-40 L100,-40" class="illo-stroke-surface" stroke-width="3" stroke-linecap="round"/>
          <rect x="-130" y="20" width="260" height="60" rx="10" class="illo-fill-primary" opacity="0.1"/>
          <circle cx="-100" cy="50" r="8" class="illo-fill-primary"/>
          <rect x="-70" y="45" width="180" height="10" rx="5" class="illo-fill-primary" opacity="0.3"/>
        </g>
      </svg>

      <svg *ngIf="type === 'contact'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <defs>
          <linearGradient id="grad-contact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" class="illo-fill-accent" style="stop-opacity:0.1"/>
            <stop offset="100%" class="illo-fill-primary" style="stop-opacity:0.05"/>
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#grad-contact)"/>
        <g transform="translate(300, 200)">
          <rect x="-120" y="-80" width="240" height="160" rx="15" class="illo-fill-surface" opacity="0.9"/>
          <rect x="-120" y="-80" width="240" height="160" rx="15" class="illo-stroke-weak" stroke-width="2" fill="none"/>
          <rect x="-100" y="-60" width="200" height="30" rx="5" class="illo-fill-primary" opacity="0.1"/>
          <rect x="-100" y="-20" width="200" height="30" rx="5" class="illo-fill-primary" opacity="0.1"/>
          <rect x="-100" y="20" width="120" height="30" rx="5" class="illo-fill-primary" opacity="0.1"/>
          <circle cx="150" cy="0" r="40" class="illo-fill-accent" opacity="0.3"/>
          <path d="M130,-20 L170,-20 L150,10 Z" class="illo-fill-accent"/>
          <circle cx="150" cy="-5" r="3" class="illo-fill-surface"/>
        </g>
        <g transform="translate(150, 320)">
          <circle r="25" class="illo-fill-primary" opacity="0.3"/>
          <path d="M-10,-10 L10,-10 L10,10 L0,15 L-10,10 Z" class="illo-fill-primary"/>
        </g>
        <g transform="translate(450, 320)">
          <circle r="25" class="illo-fill-secondary" opacity="0.3"/>
          <path d="M-10,-5 Q0,-10 10,-5 L10,5 Q0,10 -10,5 Z" class="illo-fill-secondary"/>
        </g>
      </svg>

      <svg *ngIf="type === 'blog' || type === 'pregnancy'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <rect width="600" height="400" class="illo-fill-surface"/>
        <g transform="translate(300, 200)">
          <circle r="100" class="illo-fill-secondary" opacity="0.2"/>
          <circle r="70" class="illo-fill-secondary" opacity="0.3"/>
          <circle cx="0" cy="-20" r="40" class="illo-fill-primary"/>
          <path d="M-30,20 Q0,50 30,20" class="illo-fill-accent" opacity="0.5"/>
          <circle cx="-10" cy="-20" r="5" class="illo-fill-surface"/>
          <circle cx="10" cy="-20" r="5" class="illo-fill-surface"/>
        </g>
      </svg>

      <svg *ngIf="type === 'baby' || type === 'newborn'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <rect width="600" height="400" class="illo-fill-surface"/>
        <g transform="translate(300, 200)">
          <ellipse rx="80" ry="100" class="illo-fill-primary" opacity="0.2"/>
          <circle cy="-20" r="50" class="illo-fill-secondary" opacity="0.3"/>
          <circle cy="-20" r="35" class="illo-fill-secondary"/>
          <path d="M-60,30 Q-40,60 0,60 Q40,60 60,30" class="illo-fill-primary" opacity="0.3"/>
          <circle cx="-12" cy="-20" r="4" class="illo-fill-surface"/>
          <circle cx="12" cy="-20" r="4" class="illo-fill-surface"/>
          <path d="M-8,-5 Q0,0 8,-5" class="illo-stroke-strong" stroke-width="2" fill="none"/>
        </g>
      </svg>

      <svg *ngIf="type === 'toddler' || type === 'child'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <rect width="600" height="400" class="illo-fill-surface"/>
        <g transform="translate(300, 200)">
          <rect x="-40" y="0" width="80" height="120" rx="20" class="illo-fill-primary" opacity="0.3"/>
          <circle cy="-40" r="45" class="illo-fill-secondary"/>
          <circle cx="-15" cy="-40" r="5" class="illo-fill-surface"/>
          <circle cx="15" cy="-40" r="5" class="illo-fill-surface"/>
          <path d="M-10,-25 Q0,-20 10,-25" class="illo-stroke-strong" stroke-width="2" fill="none"/>
          <rect x="-60" y="40" width="30" height="80" rx="10" class="illo-fill-primary" opacity="0.4"/>
          <rect x="30" y="40" width="30" height="80" rx="10" class="illo-fill-primary" opacity="0.4"/>
        </g>
        <g transform="translate(150, 300)">
          <circle r="30" class="illo-fill-accent" opacity="0.3"/>
          <path d="M-15,-15 L15,-15 L15,15 L-15,15 Z" class="illo-fill-accent" transform="rotate(45)"/>
        </g>
      </svg>

      <svg *ngIf="type === 'nutrition' || type === 'feeding'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <rect width="600" height="400" class="illo-fill-surface"/>
        <g transform="translate(300, 200)">
          <circle r="80" class="illo-fill-primary" opacity="0.2"/>
          <path d="M-40,-40 L-40,40 L40,40 L40,-20 Q40,-40 20,-40 Z" class="illo-fill-accent" opacity="0.5"/>
          <rect x="-30" y="-30" width="60" height="60" rx="10" class="illo-fill-secondary"/>
          <circle cx="0" cy="0" r="20" class="illo-fill-surface"/>
          <path d="M-5,-5 L5,5 M5,-5 L-5,5" class="illo-stroke-strong" stroke-width="2"/>
        </g>
        <g transform="translate(450, 150)">
          <ellipse rx="40" ry="30" class="illo-fill-accent" opacity="0.3"/>
          <ellipse rx="25" ry="18" class="illo-fill-accent"/>
        </g>
      </svg>

      <svg *ngIf="type === 'vaccine' || type === 'health'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <rect width="600" height="400" class="illo-fill-surface"/>
        <g transform="translate(300, 200)">
          <rect x="-15" y="-80" width="30" height="100" rx="15" class="illo-fill-primary" opacity="0.3"/>
          <rect x="-15" y="-80" width="30" height="60" rx="15" class="illo-fill-primary"/>
          <rect x="-5" y="-100" width="10" height="20" class="illo-fill-secondary"/>
          <path d="M-2,-95 L2,-95" class="illo-stroke-strong" stroke-width="2"/>
          <circle cy="40" r="10" class="illo-fill-accent"/>
        </g>
        <g transform="translate(150, 200)">
          <path d="M-30,-30 L30,-30 L30,30 L-30,30 Z" class="illo-fill-secondary" opacity="0.2" transform="rotate(45)"/>
          <path d="M-20,-20 L20,-20 L20,20 L-20,20 Z" class="illo-fill-secondary" opacity="0.4" transform="rotate(45)"/>
          <path d="M-10,0 L10,0 M0,-10 L0,10" class="illo-stroke-surface" stroke-width="3"/>
        </g>
        <g transform="translate(450, 200)">
          <circle r="40" class="illo-fill-accent" opacity="0.2"/>
          <circle r="25" class="illo-fill-accent" opacity="0.4"/>
          <path d="M0,-15 L0,15 M-15,0 L15,0" class="illo-stroke-surface" stroke-width="3"/>
        </g>
      </svg>

      <svg *ngIf="type === 'sleep'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <rect width="600" height="400" class="illo-fill-surface"/>
        <g transform="translate(300, 200)">
          <path d="M-50,0 Q-30,-60 30,-60 Q80,-60 100,0" class="illo-fill-primary" opacity="0.3"/>
          <circle cx="30" cy="-30" r="35" class="illo-fill-secondary" opacity="0.5"/>
          <path d="M10,-40 Q30,-50 50,-40 Q45,-20 30,-15 Q15,-20 10,-40" class="illo-fill-secondary"/>
          <g transform="translate(-80, -80)">
            <path d="M0,0 L10,-5 L8,5 L20,3 L15,12 L25,10" class="illo-stroke-accent" stroke-width="2" fill="none" opacity="0.5"/>
          </g>
          <g transform="translate(80, -100)">
            <path d="M0,0 L8,-4 L6,4 L15,2 L12,8 L18,7" class="illo-stroke-accent" stroke-width="1.5" fill="none" opacity="0.4"/>
          </g>
        </g>
      </svg>

      <svg *ngIf="type === 'development' || type === 'growth'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <rect width="600" height="400" class="illo-fill-surface"/>
        <g transform="translate(300, 250)">
          <rect x="-150" y="0" width="300" height="10" class="illo-fill-primary" opacity="0.2"/>
          <rect x="-120" y="-40" width="40" height="40" class="illo-fill-secondary" opacity="0.4"/>
          <rect x="-60" y="-60" width="40" height="60" class="illo-fill-secondary" opacity="0.5"/>
          <rect x="0" y="-80" width="40" height="80" class="illo-fill-secondary" opacity="0.6"/>
          <rect x="60" y="-100" width="40" height="100" class="illo-fill-secondary" opacity="0.7"/>
          <rect x="120" y="-120" width="40" height="120" class="illo-fill-secondary"/>
          <path d="M-100,-40 L-40,-60 L20,-80 L80,-100 L140,-120" class="illo-stroke-accent" stroke-width="3" fill="none"/>
          <circle cx="-100" cy="-40" r="5" class="illo-fill-accent"/>
          <circle cx="-40" cy="-60" r="5" class="illo-fill-accent"/>
          <circle cx="20" cy="-80" r="5" class="illo-fill-accent"/>
          <circle cx="80" cy="-100" r="5" class="illo-fill-accent"/>
          <circle cx="140" cy="-120" r="5" class="illo-fill-accent"/>
        </g>
      </svg>

      <svg *ngIf="type === 'parenting' || type === 'family'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <rect width="600" height="400" class="illo-fill-surface"/>
        <g transform="translate(300, 200)">
          <circle cx="-80" cy="-20" r="35" class="illo-fill-primary" opacity="0.5"/>
          <circle cx="80" cy="-20" r="35" class="illo-fill-secondary" opacity="0.5"/>
          <circle cy="20" r="25" class="illo-fill-accent" opacity="0.5"/>
          <path d="M-80,10 Q-40,30 0,30 Q40,30 80,10" class="illo-stroke-primary" stroke-width="3" fill="none"/>
          <circle cx="-80" cy="-20" r="25" class="illo-fill-primary"/>
          <circle cx="80" cy="-20" r="25" class="illo-fill-secondary"/>
          <circle cy="20" r="18" class="illo-fill-accent"/>
        </g>
      </svg>

      <svg *ngIf="!type || type === 'default'" class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <rect width="600" height="400" class="illo-fill-surface"/>
        <circle cx="120" cy="200" r="80" class="illo-fill-primary"/>
        <path d="M300,100 L500,300" class="illo-stroke-weak" stroke-width="8" fill="none"/>
        <circle cx="480" cy="220" r="64" class="illo-fill-secondary"/>
      </svg>
      
      <figcaption class="sr-only">{{ title }}</figcaption>
    </figure>
  `,
  styles: [`
    .illustration-wrapper {
      display: block;
      width: 100%;
      height: auto;
      position: relative;
    }

    .illustration-wrapper.size-small {
      max-width: 200px;
    }

    .illustration-wrapper.size-medium {
      max-width: 400px;
    }

    .illustration-wrapper.size-large {
      max-width: 600px;
    }

    .illustration-wrapper.animated svg {
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    svg.illo {
      width: 100%;
      height: auto;
      display: block;
    }
  `]
})
export class IllustrationComponent {
  @Input() type: string = 'default';
  @Input() title: string = 'İllüstrasyon';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() animated: boolean = false;
  @Input() glassEffect: boolean = false;
  
  titleId = 'illo-' + Math.random().toString(36).slice(2);
}