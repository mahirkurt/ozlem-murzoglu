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
      <div class="liquid-hero__content">
        <div class="liquid-hero__layout">
          <p class="hero-supertitle">{{ 'HOME.HERO_SUBTITLE' | translate }}</p>
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
          <div class="hero-trust">
            <div class="hero-trust__item">
              <span>{{ 'HOME.HERO_TRUST_1' | translate }}</span>
            </div>
            <div class="hero-trust__item">
              <span>{{ 'HOME.HERO_TRUST_2' | translate }}</span>
            </div>
            <div class="hero-trust__item">
              <span>{{ 'HOME.HERO_TRUST_3' | translate }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./liquid-hero.scss']
})
export class LiquidHeroComponent {}
