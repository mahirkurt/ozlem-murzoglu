import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-liquid-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <section class="liquid-hero">
      <!-- Liquid Background -->
      <div class="liquid-background">
        <canvas #liquidCanvas></canvas>
      </div>
      
      <!-- Floating Elements -->
      <div class="floating-elements">
        <div class="float-element element-1"></div>
        <div class="float-element element-2"></div>
        <div class="float-element element-3"></div>
        <div class="float-element element-4"></div>
      </div>
      
      <!-- Content -->
      <div class="hero-content">
        <div class="container">
          <div class="content-wrapper">
            <div class="hero-subtitle">{{ 'HERO.SUBTITLE' | translate }}</div>
            <h1 class="hero-title">
              {{ 'HERO.TITLE' | translate }}
            </h1>
            
            <div class="hero-cta">
              <a href="/hakkimizda" class="cta-button primary">
                <span class="button-text">{{ 'HOME.CTA_LEARN_MORE' | translate }}</span>
                <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .liquid-hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding-top: 140px;
      background: 
        radial-gradient(at 40% 20%, var(--color-secondary) 0px, transparent 50%),
        radial-gradient(at 80% 0%, var(--color-primary-light) 0px, transparent 50%),
        radial-gradient(at 10% 50%, var(--color-accent-light) 0px, transparent 50%),
        radial-gradient(at 80% 80%, var(--color-secondary-light) 0px, transparent 50%),
        radial-gradient(at 0% 100%, var(--color-primary) 0px, transparent 50%),
        linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    }
    
    .liquid-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          rgba(255, 255, 255, 0.03) 2px,
          rgba(255, 255, 255, 0.03) 4px
        ),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255, 255, 255, 0.03) 2px,
          rgba(255, 255, 255, 0.03) 4px
        );
      pointer-events: none;
    }
    
    .liquid-hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
      pointer-events: none;
      opacity: 0.03;
      mix-blend-mode: overlay;
    }
    
    /* Liquid Background */
    .liquid-background {
      position: absolute;
      inset: 0;
      opacity: 0.3;
    }
    
    canvas {
      width: 100%;
      height: 100%;
    }
    
    /* Floating Elements - Enhanced */
    .floating-elements {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    
    .float-element {
      position: absolute;
      border-radius: 50%;
      animation: float-random 20s infinite ease-in-out;
    }
    
    .float-element::before {
      content: '';
      position: absolute;
      inset: -20px;
      border-radius: inherit;
      background: inherit;
      filter: blur(60px);
      opacity: 0.5;
    }
    
    .element-1 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle at 30% 30%, rgba(255, 183, 77, 0.4) 0%, transparent 60%);
      top: 10%;
      left: 10%;
      animation-duration: 25s;
      filter: blur(30px);
    }
    
    .element-2 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle at 70% 70%, rgba(148, 187, 233, 0.5) 0%, transparent 60%);
      top: 60%;
      right: 10%;
      animation-duration: 30s;
      animation-delay: -5s;
      filter: blur(25px);
    }
    
    .element-3 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
      bottom: -10%;
      left: 30%;
      animation-duration: 35s;
      animation-delay: -10s;
      filter: blur(35px);
    }
    
    .element-4 {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle at 40% 40%, rgba(10, 147, 150, 0.3) 0%, transparent 60%);
      top: 30%;
      right: 30%;
      animation-duration: 28s;
      animation-delay: -15s;
      filter: blur(28px);
    }
    
    @keyframes float-random {
      0%, 100% {
        transform: translate(0, 0) scale(1) rotate(0deg);
      }
      25% {
        transform: translate(50px, -50px) scale(1.1) rotate(90deg);
      }
      50% {
        transform: translate(-30px, 30px) scale(0.9) rotate(180deg);
      }
      75% {
        transform: translate(40px, 20px) scale(1.05) rotate(270deg);
      }
    }
    
    /* Content */
    .hero-content {
      position: relative;
      z-index: 10;
      width: 100%;
      padding: 2rem 0;
      display: flex;
      justify-content: center;
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      padding: 0 2rem;
      display: flex;
      justify-content: center;
    }
    
    .content-wrapper {
      max-width: 900px;
      text-align: center;
    }
    
    .hero-subtitle {
      color: rgba(255, 255, 255, 0.95);
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
      animation: fade-in-down 0.8s ease-out;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      position: relative;
      opacity: 0.9;
    }
    
    .hero-title {
      font-family: 'Figtree', sans-serif;
      font-size: clamp(2rem, 4.2vw, 3.4rem);
      font-weight: 600;
      line-height: 1.25;
      margin-bottom: 3rem;
      letter-spacing: -0.02em;
      animation: fade-in-up 0.8s ease-out;
      color: #ffffff;
      text-shadow: 0 3px 15px rgba(0, 0, 0, 0.25);
      max-width: 1100px;
      margin-left: auto;
      margin-right: auto;
    }
    
    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    
    /* Hero description removed */
    
    /* CTA */
    .hero-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      animation: fade-in-up 0.8s ease-out 0.5s both;
    }
    
    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: rgba(255, 255, 255, 0.95);
      border: none;
      border-radius: 12px;
      color: var(--color-primary);
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.1),
        0 2px 8px rgba(255, 255, 255, 0.1);
      cursor: pointer;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 1);
      box-shadow: 
        0 8px 30px rgba(0, 0, 0, 0.15),
        0 4px 16px rgba(255, 255, 255, 0.2);
    }
    
    .cta-button:active {
      transform: translateY(0);
    }
    
    .button-text {
      position: relative;
      z-index: 1;
    }
    
    .button-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }
    
    .cta-button:hover .button-icon {
      transform: translateX(4px);
    }
    
    @keyframes fade-in-down {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .hero-section {
        min-height: 100vh;
        padding-top: 120px;
      }
      
      .hero-content {
        padding: 0 20px;
      }
      
      .hero-subtitle {
        font-size: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .hero-title {
        font-size: 1.75rem;
        line-height: 1.3;
        margin-bottom: 1.5rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
        line-height: 1.5;
        margin-bottom: 2rem;
      }
      
      .hero-stats {
        gap: 1.5rem;
        flex-direction: column;
      }
      
      .stat-item {
        width: 100%;
        text-align: center;
      }
      
      .stat-number {
        font-size: 1.75rem;
      }
      
      .stat-label {
        font-size: 0.875rem;
      }
      
      .hero-cta {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
      }
      
      .cta-button {
        width: 100%;
        justify-content: center;
        padding: 16px 32px;
      }
      
      .cta-secondary {
        width: 100%;
        justify-content: center;
      }
      
      .scroll-indicator {
        bottom: 20px;
      }
    }
    
    @media (max-width: 480px) {
      .hero-title {
        font-size: 1.5rem;
      }
      
      .hero-subtitle {
        font-size: 0.9rem;
      }
      
      .hero-subtitle {
        font-size: 0.9rem;
      }
    }
  `]
})
export class LiquidHeroComponent implements OnInit {
  
  ngOnInit() {
    // Component initialization if needed
  }
}