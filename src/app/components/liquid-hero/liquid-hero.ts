import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-liquid-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="liquid-visual-root hero-container homepage-hero">
      <div class="hero-floats" aria-hidden="true">
        <div class="hero-float hero-float--1"></div>
        <div class="hero-float hero-float--2"></div>
        <div class="hero-float hero-float--3"></div>
      </div>
      <div class="hero-pattern-overlay" aria-hidden="true"></div>
      <div class="hero-ambient-glow" aria-hidden="true"></div>
      <div class="liquid-hero__content">
        <div class="liquid-hero__layout">
          <div class="hero-text-column">
            <p class="hero-supertitle">{{ 'HOME.HERO_OVERLINE' | translate }}</p>
            <h1 class="hero-title" [innerHTML]="'HOME.HERO_TITLE' | translate"></h1>
            <p class="hero-subtitle" *ngIf="('HOME.HERO_DESCRIPTION' | translate) as heroDescription">
              {{ heroDescription }}
            </p>

            <div class="liquid-hero__cta">
              <a routerLink="/randevu" class="hero-button hero-button--primary">
                {{ 'HOME.CTA_APPOINTMENT' | translate }}
              </a>
              <a routerLink="/hakkimizda" class="hero-button hero-button--secondary">
                {{ 'HOME.CTA_LEARN_MORE' | translate }}
              </a>
            </div>
            <p class="hero-microcopy">{{ 'HOME.HERO_MICROCOPY' | translate }}</p>
          </div>
          <div class="hero-art-container" aria-hidden="true">
            <!-- CSS growth tree placeholder (Task 2) -->
          </div>
        </div>
        <div class="hero-badges">
          <div class="hero-badge">
            <span class="hero-badge__icon" aria-hidden="true">&#9733;</span>
            <span>{{ 'HOME.HERO_BADGE_BRIGHT' | translate }}</span>
          </div>
          <div class="hero-badge">
            <span class="hero-badge__icon" aria-hidden="true">&#9733;</span>
            <span>{{ 'HOME.HERO_BADGE_TRIPLE_P' | translate }}</span>
          </div>
          <div class="hero-badge">
            <span class="hero-badge__icon" aria-hidden="true">&#9733;</span>
            <span>{{ 'HOME.HERO_BADGE_SOCIAL_PED' | translate }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./liquid-hero.scss']
})
export class LiquidHeroComponent {}
