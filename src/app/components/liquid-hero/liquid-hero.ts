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
            <svg class="growth-tree" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <!-- Main trunk (curved teal path rising from bottom center) -->
              <path class="growth-tree__trunk"
                d="M200 500 C200 460, 195 400, 190 350 C185 300, 180 260, 185 220 C190 180, 195 140, 200 100"
                fill="none" stroke-width="3" stroke-linecap="round"/>

              <!-- Branch 1: Primary teal, upper-right -->
              <path class="growth-tree__branch growth-tree__branch--primary"
                d="M195 200 C210 180, 240 160, 280 140"
                fill="none" stroke-width="2.5" stroke-linecap="round"/>

              <!-- Branch 2: Secondary amber, upper-left -->
              <path class="growth-tree__branch growth-tree__branch--secondary"
                d="M190 240 C170 220, 140 200, 100 190"
                fill="none" stroke-width="2.5" stroke-linecap="round"/>

              <!-- Branch 3: Tertiary coral, mid-right -->
              <path class="growth-tree__branch growth-tree__branch--tertiary"
                d="M192 280 C215 265, 250 250, 300 240"
                fill="none" stroke-width="2.5" stroke-linecap="round"/>

              <!-- Branch 4: Success green, mid-left -->
              <path class="growth-tree__branch growth-tree__branch--success"
                d="M188 310 C165 295, 130 285, 90 280"
                fill="none" stroke-width="2" stroke-linecap="round"/>

              <!-- Branch 5: Info blue, lower-right -->
              <path class="growth-tree__branch growth-tree__branch--info"
                d="M190 340 C210 330, 245 320, 270 300"
                fill="none" stroke-width="2" stroke-linecap="round"/>

              <!-- Branch 6: Tertiary coral, upper-far-left -->
              <path class="growth-tree__branch growth-tree__branch--tertiary-alt"
                d="M197 160 C175 140, 145 125, 120 110"
                fill="none" stroke-width="2" stroke-linecap="round"/>

              <!-- Leaf nodes: breathing circles at branch tips -->
              <!-- Primary branch leaves -->
              <circle class="growth-tree__leaf growth-tree__leaf--primary" cx="280" cy="140" r="8"/>
              <circle class="growth-tree__leaf growth-tree__leaf--primary" cx="250" cy="155" r="6"/>

              <!-- Secondary branch leaves -->
              <circle class="growth-tree__leaf growth-tree__leaf--secondary" cx="100" cy="190" r="8"/>
              <circle class="growth-tree__leaf growth-tree__leaf--secondary" cx="130" cy="205" r="6"/>

              <!-- Tertiary branch leaves -->
              <circle class="growth-tree__leaf growth-tree__leaf--tertiary" cx="300" cy="240" r="7"/>
              <circle class="growth-tree__leaf growth-tree__leaf--tertiary" cx="120" cy="110" r="7"/>

              <!-- Success branch leaves -->
              <circle class="growth-tree__leaf growth-tree__leaf--success" cx="90" cy="280" r="8"/>
              <circle class="growth-tree__leaf growth-tree__leaf--success" cx="115" cy="290" r="6"/>

              <!-- Info branch leaves -->
              <circle class="growth-tree__leaf growth-tree__leaf--info" cx="270" cy="300" r="7"/>
              <circle class="growth-tree__leaf growth-tree__leaf--info" cx="248" cy="315" r="6"/>

              <!-- Top crown leaf (primary) -->
              <circle class="growth-tree__leaf growth-tree__leaf--primary" cx="200" cy="95" r="10"/>
            </svg>
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
