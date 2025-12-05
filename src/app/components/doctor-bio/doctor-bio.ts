import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-doctor-bio',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="doctor-bio-section">
      <div class="container">
        <div class="bio-content">
          <div class="doctor-image-wrapper">
            <img 
              src="/images/dr_murzoglu.jpg" 
              alt="Uzm. Dr. Özlem Murzoğlu" 
              class="doctor-image"
              loading="lazy"
            />
            <div class="image-decoration"></div>
          </div>
          
          <div class="doctor-info">
            <h2 class="section-title">{{ 'DOCTOR_BIO.TITLE' | translate }}</h2>
            <p class="doctor-subtitle">{{ 'DOCTOR_BIO.SUBTITLE' | translate }}</p>
            
            <div class="bio-text">
              <p>{{ 'DOCTOR_BIO.BIO_PARAGRAPH_1' | translate }}</p>
              <p>{{ 'DOCTOR_BIO.BIO_PARAGRAPH_2' | translate }}</p>
              <p>{{ 'DOCTOR_BIO.BIO_PARAGRAPH_3' | translate }}</p>
            </div>
            
            <div class="qualifications">
              <div class="qualification-item">
                <span class="material-icons">school</span>
                <div>
                  <strong>{{ 'DOCTOR_BIO.MEDICAL_EDUCATION' | translate }}</strong>
                  <span>{{ 'DOCTOR_BIO.MEDICAL_SCHOOL' | translate }}</span>
                </div>
              </div>
              
              <div class="qualification-item">
                <span class="material-icons">medical_services</span>
                <div>
                  <strong>{{ 'DOCTOR_BIO.SPECIALIZATION' | translate }}</strong>
                  <span>{{ 'DOCTOR_BIO.SPECIALIZATION_SCHOOL' | translate }}</span>
                </div>
              </div>
              
              <div class="qualification-item">
                <span class="material-icons">psychology</span>
                <div>
                  <strong>{{ 'DOCTOR_BIO.DOCTORATE' | translate }}</strong>
                  <span>{{ 'DOCTOR_BIO.DOCTORATE_FIELD' | translate }}</span>
                </div>
              </div>
              
              <div class="qualification-item">
                <span class="material-icons">child_care</span>
                <div>
                  <strong>{{ 'DOCTOR_BIO.BACHELOR' | translate }}</strong>
                  <span>{{ 'DOCTOR_BIO.BACHELOR_FIELD' | translate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './doctor-bio.scss'
})
export class DoctorBioComponent {}