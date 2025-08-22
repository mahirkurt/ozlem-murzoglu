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
      padding-top: 80px;
      background: #005F73;
      background-image: 
        radial-gradient(ellipse at top left, rgba(148, 187, 233, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(10, 147, 150, 0.4) 0%, transparent 50%),
        radial-gradient(circle at center, rgba(255, 183, 77, 0.1) 0%, transparent 70%);
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
    
    .hero-badge {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 3rem;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(40px) saturate(150%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 100px;
      margin-bottom: 3rem;
      animation: fade-in-down 0.8s ease-out;
      position: relative;
      overflow: hidden;
      box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1);
    }
    
    .hero-badge::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(
        from 0deg at 50% 50%,
        transparent 0deg,
        rgba(255, 183, 77, 0.1) 60deg,
        transparent 120deg,
        rgba(148, 187, 233, 0.1) 180deg,
        transparent 240deg,
        rgba(255, 255, 255, 0.05) 300deg,
        transparent 360deg
      );
      animation: rotate 20s linear infinite;
    }
    
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .badge-title {
      color: white;
      font-family: 'Figtree', sans-serif;
      font-size: 1.25rem;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 1;
    }
    
    .badge-subtitle {
      color: rgba(255, 255, 255, 0.85);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 400;
      letter-spacing: 1px;
      text-transform: uppercase;
      position: relative;
      z-index: 1;
    }
    
    .hero-title {
      font-family: 'Figtree', sans-serif;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 2rem;
      letter-spacing: -0.02em;
      animation: fade-in-up 0.8s ease-out;
      background: linear-gradient(
        135deg,
        #ffffff 0%,
        #ffffff 40%,
        rgba(255, 183, 77, 0.9) 60%,
        #ffffff 80%,
        #ffffff 100%
      );
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradient-shift 8s ease infinite, fade-in-up 0.8s ease-out;
    }
    
    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    
    .hero-description {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(1.125rem, 2vw, 1.375rem);
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.8;
      margin-bottom: 3rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      animation: fade-in-up 0.8s ease-out 0.3s both;
      text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
      position: relative;
    }
    
    .hero-description::after {
      content: '';
      position: absolute;
      bottom: -1.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(255, 183, 77, 0.6), transparent);
      animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.5; transform: translateX(-50%) scaleX(0.5); }
      50% { opacity: 1; transform: translateX(-50%) scaleX(1); }
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
      gap: 1.2rem;
      padding: 1.2rem 2.5rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 60px;
      color: white;
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 1.125rem;
      font-weight: 500;
      position: relative;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    .explore-link::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 183, 77, 0.2) 0%, rgba(148, 187, 233, 0.2) 100%);
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    
    .explore-link:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 8px 30px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    .explore-link:hover::before {
      opacity: 1;
    }
    
    .explore-link:hover .link-arrow {
      transform: translateX(8px) rotate(45deg);
    }
    
    .link-text {
      position: relative;
      z-index: 1;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    .link-arrow {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 1;
    }
    
    .link-arrow svg {
      width: 20px;
      height: 20px;
    }
    
    /* Scroll Indicator - Minimalist */
    .scroll-indicator {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bounce-slow 3s infinite;
    }
    
    .scroll-line {
      width: 30px;
      height: 50px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 25px;
      position: relative;
      overflow: hidden;
    }
    
    .scroll-line::before {
      content: '';
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 10px;
      background: white;
      border-radius: 2px;
      animation: scroll-down 2s infinite;
    }
    
    .scroll-line::after {
      content: '';
      position: absolute;
      inset: -10px;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 35px;
      animation: pulse-outline 2s infinite;
    }
    
    @keyframes pulse-outline {
      0%, 100% { opacity: 0; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1); }
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