import { Injectable } from '@angular/core';

export interface PediatricIcon {
  name: string;
  svg: string;
  animation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PediatricIconsService {
  private icons: Map<string, PediatricIcon> = new Map([
    ['baby', {
      name: 'baby',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="9" r="3" class="icon-head"/>
        <path d="M12 12v7" class="icon-body"/>
        <path d="M9 14l-2 2" class="icon-arm-left"/>
        <path d="M15 14l2 2" class="icon-arm-right"/>
        <path d="M10 19l-2 2" class="icon-leg-left"/>
        <path d="M14 19l2 2" class="icon-leg-right"/>
        <path d="M10 8c0-1 0.5-2 2-2s2 1 2 2" class="icon-hair"/>
      </svg>`,
      animation: 'bounce'
    }],
    
    ['stethoscope', {
      name: 'stethoscope',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 8V6a2 2 0 012-2h2.5" class="icon-tube-left"/>
        <path d="M20 8V6a2 2 0 00-2-2h-2.5" class="icon-tube-right"/>
        <path d="M4 8v8a4 4 0 004 4h8a4 4 0 004-4V8" class="icon-chest"/>
        <circle cx="12" cy="14" r="2" class="icon-chest-piece"/>
        <path d="M8.5 4L12 7.5L15.5 4" class="icon-earpiece"/>
      </svg>`,
      animation: 'pulse'
    }],
    
    ['heart-care', {
      name: 'heart-care',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" class="icon-heart"/>
        <path d="M12 8v5" class="icon-plus-v"/>
        <path d="M9.5 10.5h5" class="icon-plus-h"/>
      </svg>`,
      animation: 'heartbeat'
    }],
    
    ['vaccine', {
      name: 'vaccine',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 3l4 4-2.5 2.5" class="icon-needle"/>
        <path d="M11 9l6 6" class="icon-syringe-body"/>
        <rect x="8" y="12" width="6" height="8" rx="1" class="icon-syringe"/>
        <path d="M10 14v2" class="icon-measure-1"/>
        <path d="M10 17v1" class="icon-measure-2"/>
        <circle cx="5" cy="19" r="1" class="icon-droplet" fill="currentColor"/>
      </svg>`,
      animation: 'inject'
    }],
    
    ['teddy-bear', {
      name: 'teddy-bear',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="8" cy="6" r="2" class="icon-ear-left"/>
        <circle cx="16" cy="6" r="2" class="icon-ear-right"/>
        <circle cx="12" cy="10" r="4" class="icon-head"/>
        <circle cx="10" cy="9" r="0.5" fill="currentColor" class="icon-eye-left"/>
        <circle cx="14" cy="9" r="0.5" fill="currentColor" class="icon-eye-right"/>
        <path d="M12 11v1" class="icon-nose"/>
        <ellipse cx="12" cy="17" rx="5" ry="4" class="icon-body"/>
        <path d="M7 15l-2 4" class="icon-arm-left"/>
        <path d="M17 15l2 4" class="icon-arm-right"/>
      </svg>`,
      animation: 'wiggle'
    }],
    
    ['growth-chart', {
      name: 'growth-chart',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 20h18" class="icon-axis-x"/>
        <path d="M3 20V4" class="icon-axis-y"/>
        <path d="M7 16v-4" class="icon-bar-1"/>
        <path d="M11 16v-6" class="icon-bar-2"/>
        <path d="M15 16v-8" class="icon-bar-3"/>
        <path d="M19 16v-10" class="icon-bar-4"/>
        <path d="M6 10l4-3 4 5 5-7" class="icon-trend" stroke-dasharray="20" stroke-dashoffset="20"/>
      </svg>`,
      animation: 'grow'
    }],
    
    ['nutrition', {
      name: 'nutrition',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2C8 2 5 5 5 9c0 7 7 13 7 13s7-6 7-13c0-4-3-7-7-7z" class="icon-apple"/>
        <path d="M12 2c-1 0-2 1-2 2" class="icon-stem"/>
        <path d="M14 4c1-1 2-1 3 0" class="icon-leaf"/>
      </svg>`,
      animation: 'sway'
    }],
    
    ['thermometer', {
      name: 'thermometer',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" class="icon-thermometer-body"/>
        <circle cx="11.5" cy="17.5" r="2" fill="currentColor" class="icon-mercury"/>
        <path d="M11.5 14v-8" class="icon-mercury-line" stroke="currentColor" stroke-width="3"/>
      </svg>`,
      animation: 'rise'
    }],
    
    ['shield-health', {
      name: 'shield-health',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l8 3v8c0 3-2 6-8 8-6-2-8-5-8-8V5l8-3z" class="icon-shield"/>
        <path d="M12 8v6" class="icon-cross-v"/>
        <path d="M9 11h6" class="icon-cross-h"/>
      </svg>`,
      animation: 'shield'
    }],
    
    ['playground', {
      name: 'playground',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 20L8 4L12 20" class="icon-slide"/>
        <path d="M16 20V10" class="icon-pole"/>
        <circle cx="16" cy="7" r="3" class="icon-swing-seat"/>
        <path d="M13 7h6" class="icon-swing-rope"/>
        <path d="M2 20h20" class="icon-ground"/>
      </svg>`,
      animation: 'swing'
    }]
  ]);

  getIcon(name: string): PediatricIcon | undefined {
    return this.icons.get(name);
  }

  getAllIcons(): PediatricIcon[] {
    return Array.from(this.icons.values());
  }

  getAnimatedSVG(name: string): string {
    const icon = this.getIcon(name);
    if (!icon) return '';
    
    const animations = {
      bounce: `
        @keyframes icon-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .icon-head { animation: icon-bounce 2s infinite; }
      `,
      pulse: `
        @keyframes icon-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .icon-chest-piece { animation: icon-pulse 1.5s infinite; }
      `,
      heartbeat: `
        @keyframes icon-heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          40% { transform: scale(1); }
          60% { transform: scale(1.15); }
          80% { transform: scale(1); }
        }
        .icon-heart { animation: icon-heartbeat 1.5s infinite; transform-origin: center; }
      `,
      inject: `
        @keyframes icon-inject {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        .icon-syringe { animation: icon-inject 2s infinite; }
        .icon-droplet { animation: icon-inject 2s infinite 0.5s; }
      `,
      wiggle: `
        @keyframes icon-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        .icon-ear-left { animation: icon-wiggle 3s infinite; transform-origin: bottom center; }
        .icon-ear-right { animation: icon-wiggle 3s infinite 0.5s; transform-origin: bottom center; }
      `,
      grow: `
        @keyframes icon-grow {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
        .icon-trend { animation: icon-grow 2s forwards; }
        .icon-bar-1, .icon-bar-2, .icon-bar-3, .icon-bar-4 {
          animation: icon-grow 1s forwards;
          transform-origin: bottom;
        }
      `,
      sway: `
        @keyframes icon-sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        svg { animation: icon-sway 3s infinite ease-in-out; transform-origin: top center; }
      `,
      rise: `
        @keyframes icon-rise {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        .icon-mercury-line { animation: icon-rise 2s infinite; transform-origin: bottom; }
      `,
      shield: `
        @keyframes icon-shield {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .icon-shield { animation: icon-shield 3s infinite; transform-origin: center; }
      `,
      swing: `
        @keyframes icon-swing {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        .icon-swing-seat { animation: icon-swing 2s infinite ease-in-out; transform-origin: top center; }
      `
    };
    
    const animation = icon.animation ? animations[icon.animation as keyof typeof animations] : '';
    
    return `
      <div class="pediatric-icon" style="width: 48px; height: 48px; color: var(--color-primary);">
        <style>${animation}</style>
        ${icon.svg}
      </div>
    `;
  }
}