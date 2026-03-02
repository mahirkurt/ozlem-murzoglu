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
            <svg class="growth-tree" viewBox="0 0 420 520" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <!-- Ground / roots -->
              <path class="growth-tree__trunk" d="M160 510 C170 490, 185 480, 195 470" fill="none" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
              <path class="growth-tree__trunk" d="M260 510 C250 490, 235 480, 225 470" fill="none" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
              <path class="growth-tree__trunk" d="M190 510 C192 495, 200 485, 205 472" fill="none" stroke-width="1.2" stroke-linecap="round" opacity="0.3"/>
              <path class="growth-tree__trunk" d="M240 508 C238 496, 222 484, 218 474" fill="none" stroke-width="1.2" stroke-linecap="round" opacity="0.3"/>

              <!-- Main trunk (organic, tapered) -->
              <path class="growth-tree__trunk"
                d="M210 500 C208 460, 204 420, 200 380 C196 340, 192 300, 195 260 C198 220, 203 180, 208 150 C213 120, 215 100, 210 75"
                fill="none" stroke-width="5" stroke-linecap="round"/>
              <path class="growth-tree__trunk"
                d="M210 500 C212 460, 216 420, 220 380 C224 340, 228 310, 225 270 C222 240, 216 200, 212 165"
                fill="none" stroke-width="3.5" stroke-linecap="round" opacity="0.3"/>

              <!-- Major branches -->
              <path class="growth-tree__branch growth-tree__branch--primary"
                d="M208 150 C230 130, 260 108, 300 90 C320 82, 338 80, 350 84"
                fill="none" stroke-width="3" stroke-linecap="round"/>
              <path class="growth-tree__branch growth-tree__branch--primary"
                d="M300 90 C310 78, 315 62, 310 50"
                fill="none" stroke-width="2" stroke-linecap="round"/>

              <path class="growth-tree__branch growth-tree__branch--secondary"
                d="M200 190 C175 170, 145 155, 110 145 C90 140, 72 142, 60 150"
                fill="none" stroke-width="3" stroke-linecap="round"/>
              <path class="growth-tree__branch growth-tree__branch--secondary"
                d="M110 145 C98 132, 85 120, 78 105"
                fill="none" stroke-width="2" stroke-linecap="round"/>

              <path class="growth-tree__branch growth-tree__branch--tertiary"
                d="M218 240 C245 225, 275 215, 310 210 C335 207, 352 212, 362 222"
                fill="none" stroke-width="2.5" stroke-linecap="round"/>

              <path class="growth-tree__branch growth-tree__branch--success"
                d="M196 280 C170 265, 140 258, 105 258 C85 258, 68 264, 58 275"
                fill="none" stroke-width="2.5" stroke-linecap="round"/>

              <path class="growth-tree__branch growth-tree__branch--info"
                d="M222 330 C250 318, 278 310, 310 308 C330 307, 345 314, 352 325"
                fill="none" stroke-width="2" stroke-linecap="round"/>

              <path class="growth-tree__branch growth-tree__branch--primary-container"
                d="M210 120 C190 100, 165 85, 135 72 C118 66, 100 68, 88 76"
                fill="none" stroke-width="2.5" stroke-linecap="round"/>

              <!-- Sub-branches (fine detail) -->
              <path class="growth-tree__branch growth-tree__branch--primary"
                d="M340 84 C348 72, 358 68, 365 72" fill="none" stroke-width="1.5" stroke-linecap="round"/>
              <path class="growth-tree__branch growth-tree__branch--secondary"
                d="M68 150 C55 158, 48 170, 50 180" fill="none" stroke-width="1.5" stroke-linecap="round"/>
              <path class="growth-tree__branch growth-tree__branch--tertiary"
                d="M350 218 C360 208, 372 205, 380 210" fill="none" stroke-width="1.5" stroke-linecap="round"/>
              <path class="growth-tree__branch growth-tree__branch--success"
                d="M65 272 C52 280, 45 292, 50 302" fill="none" stroke-width="1.5" stroke-linecap="round"/>

              <!-- Leaf clusters (organic teardrop shapes) -->
              <!-- Top crown -->
              <ellipse class="growth-tree__leaf growth-tree__leaf--primary" cx="210" cy="68" rx="14" ry="18" transform="rotate(-5 210 68)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--primary" cx="198" cy="60" rx="10" ry="14" transform="rotate(-20 198 60)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--primary" cx="222" cy="62" rx="10" ry="14" transform="rotate(15 222 62)"/>

              <!-- Primary branch cluster (upper-right) -->
              <ellipse class="growth-tree__leaf growth-tree__leaf--primary" cx="350" cy="78" rx="12" ry="16" transform="rotate(25 350 78)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--primary" cx="340" cy="68" rx="9" ry="13" transform="rotate(10 340 68)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--primary" cx="362" cy="70" rx="8" ry="11" transform="rotate(40 362 70)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--primary" cx="310" cy="46" rx="10" ry="14" transform="rotate(-10 310 46)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--primary" cx="318" cy="36" rx="8" ry="12" transform="rotate(5 318 36)"/>

              <!-- Secondary branch cluster (upper-left, amber) -->
              <ellipse class="growth-tree__leaf growth-tree__leaf--secondary" cx="62" cy="145" rx="12" ry="16" transform="rotate(-30 62 145)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--secondary" cx="50" cy="155" rx="9" ry="13" transform="rotate(-15 50 155)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--secondary" cx="75" cy="135" rx="8" ry="12" transform="rotate(-40 75 135)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--secondary" cx="80" cy="100" rx="10" ry="14" transform="rotate(-5 80 100)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--secondary" cx="70" cy="108" rx="8" ry="12" transform="rotate(-25 70 108)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--secondary" cx="48" cy="178" rx="8" ry="11" transform="rotate(-10 48 178)"/>

              <!-- Primary-container cluster (upper-far-left) -->
              <ellipse class="growth-tree__leaf growth-tree__leaf--primary-container" cx="90" cy="70" rx="11" ry="15" transform="rotate(-20 90 70)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--primary-container" cx="78" cy="78" rx="8" ry="12" transform="rotate(-35 78 78)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--primary-container" cx="100" cy="62" rx="8" ry="11" transform="rotate(5 100 62)"/>

              <!-- Tertiary cluster (mid-right, coral) -->
              <ellipse class="growth-tree__leaf growth-tree__leaf--tertiary" cx="360" cy="216" rx="11" ry="15" transform="rotate(30 360 216)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--tertiary" cx="348" cy="206" rx="8" ry="12" transform="rotate(15 348 206)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--tertiary" cx="378" cy="208" rx="8" ry="11" transform="rotate(45 378 208)"/>

              <!-- Success cluster (mid-left, green) -->
              <ellipse class="growth-tree__leaf growth-tree__leaf--success" cx="60" cy="270" rx="11" ry="15" transform="rotate(-25 60 270)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--success" cx="48" cy="280" rx="8" ry="12" transform="rotate(-10 48 280)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--success" cx="72" cy="260" rx="8" ry="11" transform="rotate(-40 72 260)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--success" cx="48" cy="298" rx="7" ry="10" transform="rotate(-5 48 298)"/>

              <!-- Info cluster (lower-right, blue) -->
              <ellipse class="growth-tree__leaf growth-tree__leaf--info" cx="350" cy="320" rx="10" ry="14" transform="rotate(20 350 320)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--info" cx="340" cy="310" rx="8" ry="11" transform="rotate(5 340 310)"/>
              <ellipse class="growth-tree__leaf growth-tree__leaf--info" cx="360" cy="328" rx="7" ry="10" transform="rotate(35 360 328)"/>

              <!-- Blossoms (5-petal flowers) -->
              <g class="growth-tree__blossom growth-tree__blossom--tertiary" transform="translate(330 60)">
                <circle cx="0" cy="-5" r="3.5" opacity="0.7"/>
                <circle cx="4.8" cy="-1.5" r="3.5" opacity="0.7"/>
                <circle cx="3" cy="4" r="3.5" opacity="0.7"/>
                <circle cx="-3" cy="4" r="3.5" opacity="0.7"/>
                <circle cx="-4.8" cy="-1.5" r="3.5" opacity="0.7"/>
                <circle cx="0" cy="0" r="2.5" opacity="0.9"/>
              </g>

              <g class="growth-tree__blossom growth-tree__blossom--secondary" transform="translate(90 90)">
                <circle cx="0" cy="-4" r="3" opacity="0.6"/>
                <circle cx="3.8" cy="-1.2" r="3" opacity="0.6"/>
                <circle cx="2.4" cy="3.2" r="3" opacity="0.6"/>
                <circle cx="-2.4" cy="3.2" r="3" opacity="0.6"/>
                <circle cx="-3.8" cy="-1.2" r="3" opacity="0.6"/>
                <circle cx="0" cy="0" r="2" opacity="0.8"/>
              </g>

              <g class="growth-tree__blossom growth-tree__blossom--tertiary" transform="translate(370 230) scale(0.8)">
                <circle cx="0" cy="-4.5" r="3" opacity="0.6"/>
                <circle cx="4.3" cy="-1.4" r="3" opacity="0.6"/>
                <circle cx="2.6" cy="3.6" r="3" opacity="0.6"/>
                <circle cx="-2.6" cy="3.6" r="3" opacity="0.6"/>
                <circle cx="-4.3" cy="-1.4" r="3" opacity="0.6"/>
                <circle cx="0" cy="0" r="2" opacity="0.8"/>
              </g>

              <!-- Butterfly accent -->
              <g class="growth-tree__butterfly" transform="translate(280 140) rotate(-15)">
                <path d="M0 0 C-8 -10, -18 -12, -14 -2 C-18 -12, -12 -20, 0 -8" fill="currentColor" opacity="0.25"/>
                <path d="M0 0 C8 -10, 18 -12, 14 -2 C18 -12, 12 -20, 0 -8" fill="currentColor" opacity="0.2"/>
                <line x1="0" y1="0" x2="0" y2="-8" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
              </g>

              <!-- Sparkle accents -->
              <g class="growth-tree__sparkle" opacity="0.35">
                <line x1="175" y1="55" x2="175" y2="45" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                <line x1="170" y1="50" x2="180" y2="50" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              </g>
              <g class="growth-tree__sparkle" opacity="0.25">
                <line x1="385" y1="195" x2="385" y2="187" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/>
                <line x1="381" y1="191" x2="389" y2="191" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/>
              </g>
              <g class="growth-tree__sparkle" opacity="0.3">
                <line x1="40" y1="240" x2="40" y2="232" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/>
                <line x1="36" y1="236" x2="44" y2="236" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./liquid-hero.scss']
})
export class LiquidHeroComponent {}
