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

      <!-- Floating Elements (REMOVED for Aurora Mesh Phase 7) -->
      <!-- Pure CSS Gradient Background Active -->

      <!-- Content -->
      <div class="hero-content md3-relative">
        <div class="md3-container">
          <div class="content-wrapper md3-flex md3-flex-col md3-items-center md3-justify-center">
            <h1 class="hero-title md3-display-large" [innerHTML]="'HERO.TITLE' | translate">
            </h1>
            <p class="hero-subtitle md3-headline-medium" [innerHTML]="'HERO.SUBTITLE' | translate">
            </p>

            <div class="hero-cta md3-flex md3-items-center md3-justify-center md3-gap-lg md3-mt-xl">
              <a routerLink="/hakkimizda" class="md3-button md3-button-filled hero-button">
                <span class="button-text">{{ 'HOME.CTA_LEARN_MORE' | translate }}</span>
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
