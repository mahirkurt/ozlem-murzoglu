import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-doctor-bio',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="doctor-bio-section">
      <div class="container md3-container">
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
  styles: [
    `
      .doctor-bio-section {
        padding: 60px 0;
        background: #f8f9fa;
        position: relative;
      }

      .bio-content {
        display: grid;
        grid-template-columns: 380px 1fr;
        gap: 60px;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }

      .doctor-image-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .doctor-image {
        width: 100%;
        max-width: 320px;
        height: 450px;
        object-fit: cover;
        object-position: center top;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 95, 115, 0.2);
        position: relative;
        z-index: 2;
      }

      .image-decoration {
        position: absolute;
        top: -15px;
        left: -15px;
        width: calc(100% + 30px);
        height: calc(100% + 30px);
        background: linear-gradient(
          135deg,
          var(--color-primary) 0%,
          var(--color-primary-light) 100%
        );
        border-radius: 20px;
        opacity: 0.08;
        z-index: 1;
      }

      .doctor-image-wrapper::before {
        content: '';
        position: absolute;
        top: 30px;
        left: 30px;
        right: -30px;
        bottom: -30px;
        background: linear-gradient(
          135deg,
          var(--color-secondary-light) 0%,
          var(--color-accent-light) 100%
        );
        border-radius: 20px;
        opacity: 0.1;
        z-index: 0;
      }

      .section-title {
        font-size: 2.25rem;
        color: var(--color-primary);
        margin-bottom: 8px;
        font-weight: 700;
      }

      .doctor-subtitle {
        font-size: var(--font-size-lg);
        color: var(--color-primary-light);
        margin-bottom: 30px;
        font-weight: 500;
      }

      .bio-text {
        margin-bottom: 40px;
      }

      .bio-text p {
        font-size: var(--font-size-base);
        color: var(--color-neutral-600);
        line-height: 1.8;
        margin-bottom: 20px;
      }

      .qualifications {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }

      .qualification-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 95, 115, 0.08);
        transition: all 0.3s ease;
      }

      .qualification-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 95, 115, 0.12);
      }

      .qualification-item .material-icons {
        color: var(--color-primary);
        font-size: 24px;
        background: linear-gradient(
          135deg,
          var(--color-primary-light) 0%,
          var(--color-primary) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .qualification-item div {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .qualification-item strong {
        font-size: 14px;
        color: var(--color-primary);
        font-weight: 600;
      }

      .qualification-item span {
        font-size: 13px;
        color: var(--color-neutral-600);
        line-height: 1.4;
      }

      @media (max-width: 768px) {
        .bio-content {
          grid-template-columns: 1fr;
          gap: 40px;
        }

        .doctor-image-wrapper {
          max-width: 300px;
          margin: 0 auto;
        }

        .qualifications {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DoctorBioComponent {}
