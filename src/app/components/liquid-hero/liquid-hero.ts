import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-liquid-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <section class="liquid-hero homepage-hero md3-relative">
      <!-- Liquid Background -->
      <div class="liquid-background md3-absolute">
        <canvas #liquidCanvas></canvas>
      </div>

      <!-- Floating Elements -->
      <div class="floating-elements md3-absolute">
        <div class="float-element element-1"></div>
        <div class="float-element element-2"></div>
        <div class="float-element element-3"></div>
        <div class="float-element element-4"></div>
      </div>

      <!-- Content -->
      <div class="hero-content md3-relative">
        <div class="md3-container">
          <div class="content-wrapper md3-flex md3-flex-col md3-items-center md3-justify-center">
            <h1 class="hero-title md3-display-large md3-text-on-primary">
              {{ 'HERO.TITLE' | translate }}
            </h1>
            <p class="hero-subtitle md3-headline-medium md3-text-on-primary">
              {{ 'HERO.SUBTITLE' | translate }}
            </p>

            <div class="hero-cta md3-flex md3-items-center md3-justify-center md3-gap-lg md3-mt-xl">
              <a routerLink="/hakkimizda" class="md3-button md3-button-filled hero-button">
                <span class="button-text">{{ 'HOME.CTA_LEARN_MORE' | translate }}</span>
                <svg
                  class="button-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .liquid-hero {
        position: relative;
        height: 100vh;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 0;
        margin: 0;
        padding-top: 0;
        background:
          radial-gradient(at 40% 20%, var(--md-sys-color-primary) 0px, transparent 50%),
          radial-gradient(at 80% 0%, var(--md-sys-color-secondary) 0px, transparent 50%),
          radial-gradient(at 10% 50%, var(--md-sys-color-tertiary) 0px, transparent 50%),
          radial-gradient(at 80% 80%, var(--md-sys-color-primary-container) 0px, transparent 50%),
          radial-gradient(at 0% 100%, var(--md-sys-color-primary) 0px, transparent 50%),
          linear-gradient(
            135deg,
            var(--md-sys-color-primary) 0%,
            var(--md-sys-color-primary-container) 25%,
            var(--md-sys-color-secondary-container) 50%,
            var(--md-sys-color-primary-container) 75%,
            var(--md-sys-color-primary) 100%
          );
        background-size: 400% 400%;
        animation: heroWaveAnimation 20s var(--md-sys-motion-easing-standard) infinite;
      }

      @keyframes heroWaveAnimation {
        0% {
          background-position: 0% 50%;
        }
        25% {
          background-position: 50% 25%;
        }
        50% {
          background-position: 100% 50%;
        }
        75% {
          background-position: 50% 75%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      /* Disable complex animations on mobile */
      @media (prefers-reduced-motion: reduce) {
        .liquid-hero,
        .float-element,
        .hero-title,
        .hero-cta {
          animation: none !important;
        }
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
        border-radius: var(--md-sys-shape-corner-full);
        animation: float-random 20s infinite ease-in-out;
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
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
        background: radial-gradient(
          circle at 30% 30%,
          color-mix(in srgb, var(--md-sys-color-secondary) 40%, transparent) 0%,
          transparent 60%
        );
        top: 10%;
        left: 10%;
        animation-duration: 25s;
        filter: blur(30px);
      }

      .element-2 {
        width: 300px;
        height: 300px;
        background: radial-gradient(
          circle at 70% 70%,
          color-mix(in srgb, var(--md-sys-color-tertiary) 50%, transparent) 0%,
          transparent 60%
        );
        top: 60%;
        right: 10%;
        animation-duration: 30s;
        animation-delay: -5s;
        filter: blur(25px);
      }

      .element-3 {
        width: 500px;
        height: 500px;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(255, 255, 255, 0.15) 0%,
          transparent 60%
        );
        bottom: -10%;
        left: 30%;
        animation-duration: 35s;
        animation-delay: -10s;
        filter: blur(35px);
      }

      .element-4 {
        width: 350px;
        height: 350px;
        background: radial-gradient(
          circle at 40% 40%,
          color-mix(in srgb, var(--md-sys-color-primary) 30%, transparent) 0%,
          transparent 60%
        );
        top: 30%;
        right: 30%;
        animation-duration: 28s;
        animation-delay: -15s;
        filter: blur(28px);
      }

      @keyframes float-random {
        0%,
        100% {
          transform: translate3d(0, 0, 0) scale(1);
        }
        25% {
          transform: translate3d(50px, -50px, 0) scale(1.1);
        }
        50% {
          transform: translate3d(-30px, 30px, 0) scale(0.9);
        }
        75% {
          transform: translate3d(40px, 20px, 0) scale(1.05);
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .floating-elements {
          display: none;
        }

        .liquid-hero {
          animation: heroWaveAnimation 25s ease infinite;
          animation-delay: 0s;
          margin: 0;
          height: 100vh;
          min-height: 500px;
        }
      }

      /* Content */
      .hero-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      .md3-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
      }

      .content-wrapper {
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
      }

      .hero-title {
        animation: fade-in-up 0.9s var(--md-sys-motion-easing-emphasized) 0.15s both;
        color: var(--md-sys-color-surface);
        text-shadow:
          0 6px 30px rgba(var(--md-sys-color-shadow), 0.25),
          0 2px 6px rgba(var(--md-sys-color-shadow), 0.2);
        text-align: center;
        width: 100%;
        max-width: 100%;
        margin-bottom: var(--spacing-xl);
      }

      @keyframes gradient-shift {
        0%,
        100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }

      .hero-subtitle {
        animation: fade-in-up 0.95s var(--md-sys-motion-easing-emphasized) 0.2s both;
        color: rgba(255, 255, 255, 0.9);
        text-shadow:
          0 4px 20px rgba(var(--md-sys-color-shadow), 0.2),
          0 2px 4px rgba(var(--md-sys-color-shadow), 0.15);
        text-align: center;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        margin-bottom: var(--spacing-xxl);
        font-size: 1.25rem;
        line-height: 1.6;
        font-weight: 400;
      }

      /* CTA */
      .hero-cta {
        animation: fade-in-up 1s var(--md-sys-motion-easing-emphasized) 0.3s both;
      }

      .hero-button {
        background: rgba(255, 255, 255, 0.98);
        color: var(--md-sys-color-primary);
        padding: var(--md-sys-spacing-4) var(--md-sys-spacing-8);
        font-size: 1rem;
        font-weight: 500;
        letter-spacing: 0.1px;
        border-radius: var(--radius-xxl);
        box-shadow:
          0 3px 5px rgba(var(--md-sys-color-shadow), 0.1),
          0 1px 18px rgba(var(--md-sys-color-shadow), 0.08),
          0 6px 10px rgba(var(--md-sys-color-shadow), 0.08);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: var(--md-sys-spacing-3);
        border: none;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: var(--md-sys-shape-corner-full);
          background: var(--md-sys-color-primary);
          opacity: 0.1;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        &:hover {
          transform: translateY(-2px);
          background: white;
          box-shadow:
            0 5px 10px rgba(var(--md-sys-color-shadow), 0.12),
            0 3px 28px rgba(var(--md-sys-color-shadow), 0.1),
            0 8px 16px rgba(var(--md-sys-color-shadow), 0.1);
        }

        &:hover::before {
          width: 300px;
          height: 300px;
        }

        &:active {
          transform: translateY(0);
          box-shadow:
            0 1px 3px rgba(var(--md-sys-color-shadow), 0.12),
            0 1px 2px rgba(var(--md-sys-color-shadow), 0.24);
        }
      }

      .button-text {
        position: relative;
        z-index: 1;
      }

      .button-icon {
        width: 20px;
        height: 20px;
        transition: transform var(--transition-transform);
      }

      .hero-button:hover .button-icon {
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
        .liquid-hero {
          min-height: 100vh;
          height: 100vh;
        }

        .hero-content {
          padding: var(--spacing-xxl) var(--spacing-md);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-title {
          font-size: clamp(1.5rem, 4.5vw, 1.875rem);
          line-height: 1.2;
          margin-bottom: var(--spacing-lg);
        }

        .hero-button {
          width: 100%;
          max-width: 280px;
          justify-content: center;
          padding: var(--spacing-sm) var(--spacing-lg);
          font-size: 1rem;
        }

        .button-icon {
          width: 18px;
          height: 18px;
        }
      }

      @media (max-width: 480px) {
        .hero-content {
          padding: 75pxpx /* TODO: Consider MD3 spacing token */px /* TODO: Consider MD3 spacing token */ var(--md-sys-spacing-4);
        }

        .hero-title {
          font-size: 1.25rem;
          line-height: 1.15;
          margin-bottom: 1.5rem;
        }

        .hero-cta {
          margin-top: 1rem;
        }

        .cta-button {
          padding: var(--md-sys-spacing-3) var(--md-sys-spacing-5);
          font-size: 0.9rem;
          max-width: 260px;
        }
      }

      @media (max-height: 700px) and (max-width: 768px) {
        .hero-title {
          margin-bottom: 1.5rem;
          font-size: 1.4rem;
        }

        .hero-cta {
          margin-top: 1rem;
        }
      }
    `,
  ],
})
export class LiquidHeroComponent implements OnInit {
  ngOnInit() {
    // Component initialization if needed
  }
}
