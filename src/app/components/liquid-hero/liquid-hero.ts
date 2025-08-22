import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-liquid-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
            <div class="hero-badge">
              <span class="badge-title">Uzm. Dr. Özlem Murzoğlu</span>
              <span class="badge-subtitle">Çocuk Sağlığı ve Hastalıkları Kliniği</span>
            </div>
            <h1 class="hero-title">
              En Değerli Varlığınız için Bilim ve Şefkati Birleştiren Bütüncül Yaklaşım
            </h1>
            <p class="hero-description">
              Sosyal pediatri ve çocuk gelişimi disiplinlerini harmanlayan kapsamlı yaklaşımla doğumdan yetişkinliğe kanıta dayalı ve çocuğunuza özel bir sağlık deneyimi
            </p>
            
            <div class="hero-cta">
              <a href="/hakkimizda" class="explore-link">
                <span class="link-text">Kliniğimizi Yakından Tanıyın</span>
                <span class="link-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="scroll-indicator">
        <span class="scroll-text">Keşfet</span>
        <div class="scroll-line"></div>
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
      background: linear-gradient(135deg, #005F73 0%, #0A9396 50%, #94BBE9 100%);
      padding-top: 80px; /* Header için boşluk */
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
    
    /* Floating Elements */
    .floating-elements {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    
    .float-element {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      animation: float-random 20s infinite ease-in-out;
    }
    
    .element-1 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255, 183, 77, 0.3) 0%, transparent 70%);
      top: 10%;
      left: 10%;
      animation-duration: 25s;
    }
    
    .element-2 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(148, 187, 233, 0.4) 0%, transparent 70%);
      top: 60%;
      right: 10%;
      animation-duration: 30s;
      animation-delay: -5s;
    }
    
    .element-3 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      bottom: -10%;
      left: 30%;
      animation-duration: 35s;
      animation-delay: -10s;
    }
    
    .element-4 {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(0, 95, 115, 0.2) 0%, transparent 70%);
      top: 30%;
      right: 30%;
      animation-duration: 28s;
      animation-delay: -15s;
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
    
    .hero-badge {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      margin-bottom: 2.5rem;
      animation: fade-in-down 0.8s ease-out;
      position: relative;
      overflow: hidden;
    }
    
    .hero-badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      animation: shimmer 3s infinite;
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    .badge-title {
      color: white;
      font-family: 'Figtree', sans-serif;
      font-size: 1.125rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .badge-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 400;
      letter-spacing: 0.5px;
    }
    
    .hero-title {
      font-family: 'Figtree', sans-serif;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      color: white;
      line-height: 1.3;
      margin-bottom: 2rem;
      letter-spacing: -0.02em;
      animation: fade-in-up 0.8s ease-out;
    }
    
    
    .hero-description {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(1.125rem, 2vw, 1.375rem);
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.7;
      margin-bottom: 3rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      animation: fade-in-up 0.8s ease-out 0.3s both;
    }
    
    /* CTA */
    .hero-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      animation: fade-in-up 0.8s ease-out 0.5s both;
    }
    
    .explore-link {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 2rem;
      color: white;
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 1.125rem;
      font-weight: 500;
      position: relative;
      transition: all 0.3s ease;
      overflow: hidden;
    }
    
    .explore-link::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, white, transparent);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    
    .explore-link:hover::before {
      transform: translateX(0);
    }
    
    .explore-link:hover .link-arrow {
      transform: translateX(5px);
    }
    
    .link-text {
      position: relative;
      z-index: 1;
      letter-spacing: 0.5px;
    }
    
    .link-arrow {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }
    
    .link-arrow svg {
      width: 20px;
      height: 20px;
    }
    
    /* Scroll Indicator */
    .scroll-indicator {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      animation: bounce-slow 3s infinite;
    }
    
    .scroll-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .scroll-line {
      width: 1px;
      height: 60px;
      background: linear-gradient(to bottom, white 0%, transparent 100%);
      position: relative;
      overflow: hidden;
    }
    
    .scroll-line::after {
      content: '';
      position: absolute;
      top: -20px;
      left: 0;
      width: 100%;
      height: 20px;
      background: white;
      animation: scroll-down 2s infinite;
    }
    
    @keyframes scroll-down {
      0% {
        transform: translateY(0);
        opacity: 1;
      }
      100% {
        transform: translateY(80px);
        opacity: 0;
      }
    }
    
    @keyframes bounce-slow {
      0%, 20%, 50%, 80%, 100% {
        transform: translateX(-50%) translateY(0);
      }
      40% {
        transform: translateX(-50%) translateY(-10px);
      }
      60% {
        transform: translateX(-50%) translateY(-5px);
      }
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
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-stats {
        gap: 2rem;
      }
      
      .stat-number {
        font-size: 2rem;
      }
      
      .hero-cta {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class LiquidHeroComponent implements OnInit {
  
  ngOnInit() {
    // Component initialization if needed
  }
}