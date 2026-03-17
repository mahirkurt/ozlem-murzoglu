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

            <div class="liquid-hero__cta">
              <a routerLink="/randevu" class="hero-button hero-button--primary">
                {{ 'HOME.CTA_APPOINTMENT' | translate }}
              </a>
              <a routerLink="/hakkimizda" class="hero-button hero-button--secondary">
                {{ 'HOME.CTA_LEARN_MORE' | translate }}
              </a>
            </div>
          </div>
          <div class="hero-art-container" aria-hidden="true">
            <img class="growth-tree" src="assets/illustrations/tree.svg" alt="" width="420" height="520" loading="eager" />
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./liquid-hero.scss']
})
export class LiquidHeroComponent {}
