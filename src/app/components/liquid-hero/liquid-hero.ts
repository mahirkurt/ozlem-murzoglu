import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-liquid-hero',
  standalone: true,
  imports: [CommonModule],
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
            <span class="hero-badge">Dr. Özlem Murzoğlu</span>
            <h1 class="hero-title">
              <span class="word" *ngFor="let word of titleWords; let i = index" 
                    [style.animation-delay]="i * 0.1 + 's'">{{word}}</span>
            </h1>
            <p class="hero-description">
              Çocuğunuzun sağlıklı geleceği için modern tıp ve sevgi dolu yaklaşımı birleştiriyoruz
            </p>
            
            <div class="hero-stats">
              <div class="stat" *ngFor="let stat of stats">
                <span class="stat-number" [attr.data-target]="stat.value">0</span>
                <span class="stat-label">{{stat.label}}</span>
              </div>
            </div>
            
            <div class="hero-cta">
              <button class="primary-btn magnetic-btn">
                <span class="btn-text">Randevu Al</span>
                <span class="btn-bg"></span>
              </button>
              
              <button class="play-btn">
                <span class="play-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </span>
                <span class="play-text">Tanıtım Videosu</span>
              </button>
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
      overflow: hidden;
      background: linear-gradient(135deg, #005F73 0%, #0A9396 50%, #94BBE9 100%);
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
    }
    
    .content-wrapper {
      max-width: 800px;
    }
    
    .hero-badge {
      display: inline-block;
      padding: 8px 20px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 30px;
      color: white;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 2rem;
      animation: fade-in-down 0.8s ease-out;
    }
    
    .hero-title {
      font-family: 'Figtree', sans-serif;
      font-size: clamp(3rem, 8vw, 5.5rem);
      font-weight: 700;
      color: white;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      letter-spacing: -0.03em;
    }
    
    .hero-title .word {
      display: inline-block;
      animation: word-reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
      margin-right: 0.3em;
    }
    
    @keyframes word-reveal {
      0% {
        opacity: 0;
        transform: translateY(100%) rotateX(-90deg);
        filter: blur(10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0) rotateX(0);
        filter: blur(0);
      }
    }
    
    .hero-description {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(1.125rem, 2vw, 1.5rem);
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
      margin-bottom: 3rem;
      animation: fade-in-up 0.8s ease-out 0.5s both;
    }
    
    /* Stats */
    .hero-stats {
      display: flex;
      gap: 3rem;
      margin-bottom: 3rem;
      animation: fade-in-up 0.8s ease-out 0.6s both;
    }
    
    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .stat-number {
      font-family: 'Figtree', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: #FFB74D;
      text-shadow: 0 0 30px rgba(255, 183, 77, 0.5);
    }
    
    .stat-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    /* CTA */
    .hero-cta {
      display: flex;
      align-items: center;
      gap: 2rem;
      animation: fade-in-up 0.8s ease-out 0.7s both;
    }
    
    .primary-btn {
      position: relative;
      padding: 18px 40px;
      background: transparent;
      border: 2px solid white;
      border-radius: 60px;
      color: white;
      font-family: 'DM Sans', sans-serif;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .btn-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%);
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 60px;
    }
    
    .primary-btn:hover .btn-bg {
      transform: translateY(0);
    }
    
    .btn-text {
      position: relative;
      z-index: 1;
    }
    
    .play-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    .play-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .play-icon::before {
      content: '';
      position: absolute;
      inset: -10px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      animation: pulse-ring 2s infinite;
    }
    
    .play-btn:hover .play-icon {
      background: white;
      transform: scale(1.1);
    }
    
    .play-btn:hover .play-icon svg {
      color: #005F73;
    }
    
    .play-icon svg {
      width: 24px;
      height: 24px;
      margin-left: 3px;
      transition: all 0.3s ease;
    }
    
    @keyframes pulse-ring {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(1.3);
        opacity: 0;
      }
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
  titleWords = ['Çocuk', 'Sağlığında', 'Güvenilir', 'Adres'];
  
  stats = [
    { value: 15, label: 'Yıllık Deneyim' },
    { value: 5000, label: 'Mutlu Aile' },
    { value: 100, label: 'Memnuniyet %' }
  ];
  
  ngOnInit() {
    // Animate numbers on load
    setTimeout(() => {
      this.animateNumbers();
    }, 1000);
  }
  
  private animateNumbers() {
    const elements = document.querySelectorAll('.stat-number');
    elements.forEach((el: any) => {
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const updateNumber = () => {
        current += increment;
        if (current < target) {
          el.textContent = Math.floor(current);
          requestAnimationFrame(updateNumber);
        } else {
          el.textContent = target + (el.getAttribute('data-target') == '100' ? '%' : '+');
        }
      };
      
      updateNumber();
    });
  }
}