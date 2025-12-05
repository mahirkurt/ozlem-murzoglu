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
            <h1 class="hero-title md3-display-large md3-text-on-primary" [innerHTML]="'HERO.TITLE' | translate">
            </h1>
            <p class="hero-subtitle md3-headline-medium md3-text-on-primary" [innerHTML]="'HERO.SUBTITLE' | translate">
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
  styleUrls: ['./liquid-hero.scss']
})
export class LiquidHeroComponent implements OnInit {
  ngOnInit() {
  }
}
