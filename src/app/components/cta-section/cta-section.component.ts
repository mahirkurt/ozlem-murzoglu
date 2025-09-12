import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">{{ title }}</h2>
          <p class="cta-description" *ngIf="description">{{ description }}</p>
          <div class="cta-actions" *ngIf="buttonText">
            <a [routerLink]="buttonLink" class="cta-button">
              {{ buttonText }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cta-section {
      background: #ffd54f;
      background-image: 
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
      padding: 80px 0;
      margin-top: 0;
      margin-bottom: 0;
      position: relative;
      overflow: hidden;
    }
    
    .cta-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 200%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: shimmer 8s infinite;
    }
    
    @keyframes shimmer {
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .cta-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .cta-title {
      font-family: 'Figtree', sans-serif;
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--md-sys-color-on-primary-container);
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .cta-description {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.125rem;
      color: var(--md-sys-color-on-primary-container);
      opacity: 0.9;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .cta-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      align-items: center;
    }

    .cta-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 16px 32px;
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      border-radius: 100px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      background: var(--md-sys-color-primary-hover, var(--md-sys-color-primary));
    }

    @media (max-width: 768px) {
      .cta-section {
        padding: 60px 0;
      }

      .cta-title {
        font-size: 2rem;
      }

      .cta-description {
        font-size: 1rem;
      }

      .cta-button {
        padding: 14px 28px;
        font-size: 0.95rem;
      }
    }

    @media (max-width: 480px) {
      .cta-section {
        padding: 48px 0;
      }

      .cta-title {
        font-size: 1.75rem;
      }

      .cta-actions {
        flex-direction: column;
        width: 100%;
      }

      .cta-button {
        width: 100%;
        max-width: 280px;
      }
    }
  `]
})
export class CtaSectionComponent {
  @Input() title: string = '';
  @Input() description?: string;
  @Input() buttonText?: string;
  @Input() buttonLink: string = '/iletisim';
}