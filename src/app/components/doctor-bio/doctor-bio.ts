import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-bio',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  template: `
    <section class="doctor-bio">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-label">{{ 'DOCTOR_BIO.LABEL' | translate }}</span>
          <h2 class="section-title">{{ 'DOCTOR_BIO.SECTION_TITLE' | translate }}</h2>
        </div>

        <!-- 2-Column Grid Layout -->
        <div class="bio-grid">
          <!-- Left Column: Doctor Photo -->
          <div class="photo-column">
            <div class="photo-card">
              <div class="photo-frame">
                <img 
                  src="/images/dr_murzoglu.jpg" 
                  alt="Uzm. Dr. Özlem Murzoğlu" 
                  class="doctor-photo"
                  loading="lazy"
                />
                <div class="photo-glow"></div>
              </div>
              
              <!-- Floating Stats Removed as per request -->
              <!-- <div class="floating-stats"> ... </div> -->
            </div>
          </div>

          <!-- Right Column: Bio Content -->
          <div class="content-column">


            <div class="bio-description">
              <p>{{ 'DOCTOR_BIO.BIO_PARAGRAPH_1' | translate }}</p>
              <p>{{ 'DOCTOR_BIO.BIO_PARAGRAPH_2' | translate }}</p>
            </div>

            <!-- Qualifications Grid -->
            <div class="qualifications-grid">
              <div class="qualification-card">
                <div class="qual-icon">
                  <span class="material-icons">school</span>
                </div>
                <div class="qual-content">
                  <span class="qual-title">{{ 'DOCTOR_BIO.MEDICAL_EDUCATION' | translate }}</span>
                  <span class="qual-detail">{{ 'DOCTOR_BIO.MEDICAL_SCHOOL' | translate }}</span>
                </div>
              </div>

              <div class="qualification-card">
                <div class="qual-icon secondary">
                  <span class="material-icons">medical_services</span>
                </div>
                <div class="qual-content">
                  <span class="qual-title">{{ 'DOCTOR_BIO.SPECIALIZATION' | translate }}</span>
                  <span class="qual-detail">{{ 'DOCTOR_BIO.SPECIALIZATION_SCHOOL' | translate }}</span>
                </div>
              </div>

              <div class="qualification-card">
                <div class="qual-icon tertiary">
                  <span class="material-icons">psychology</span>
                </div>
                <div class="qual-content">
                  <span class="qual-title">{{ 'DOCTOR_BIO.DOCTORATE' | translate }}</span>
                  <span class="qual-detail">{{ 'DOCTOR_BIO.DOCTORATE_FIELD' | translate }}</span>
                </div>
              </div>

              <div class="qualification-card">
                <div class="qual-icon">
                  <span class="material-icons">child_care</span>
                </div>
                <div class="qual-content">
                  <span class="qual-title">{{ 'DOCTOR_BIO.BACHELOR' | translate }}</span>
                  <span class="qual-detail">{{ 'DOCTOR_BIO.BACHELOR_FIELD' | translate }}</span>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <div class="bio-actions">
              <a routerLink="/hakkimizda/dr-ozlem-murzoglu" class="btn-primary">
                <span>{{ 'DOCTOR_BIO.READ_MORE' | translate }}</span>
                <span class="material-icons">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Background Decoration -->
      <div class="bg-decoration bg-decoration-1"></div>
      <div class="bg-decoration bg-decoration-2"></div>
    </section>
  `,
  styleUrl: './doctor-bio.scss'
})
export class DoctorBioComponent {}