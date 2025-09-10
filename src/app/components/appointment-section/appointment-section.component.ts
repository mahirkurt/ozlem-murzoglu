import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="appointment-section">
      <div class="container md3-container">
        <div class="appointment-header">
          <h2 class="section-title">{{ 'APPOINTMENT_SECTION.TITLE' | translate }}</h2>
          <p class="section-subtitle">
            {{ 'APPOINTMENT_SECTION.SUBTITLE' | translate }}
          </p>
        </div>

        <div class="appointment-options">
          <!-- Direct Link Option -->
          <div class="appointment-card">
            <div class="card-icon">
              <span class="material-icons">calendar_today</span>
            </div>
            <h3>{{ 'APPOINTMENT_SECTION.QUICK_APPOINTMENT' | translate }}</h3>
            <p>{{ 'APPOINTMENT_SECTION.QUICK_APPOINTMENT_DESC' | translate }}</p>
            <a
              href="https://saglikpetegim.com/randevu"
              target="_blank"
              class="appointment-btn primary"
            >
              <span class="material-icons">open_in_new</span>
              {{ 'APPOINTMENT_SECTION.BOOK_APPOINTMENT' | translate }}
            </a>
          </div>

          <!-- WhatsApp Option -->
          <div class="appointment-card">
            <div class="card-icon whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                />
              </svg>
            </div>
            <h3>{{ 'APPOINTMENT_SECTION.WHATSAPP_CONTACT' | translate }}</h3>
            <p>{{ 'APPOINTMENT_SECTION.WHATSAPP_DESC' | translate }}</p>
            <a
              href="https://wa.me/905334985949?text=Merhaba,%20randevu%20almak%20istiyorum"
              target="_blank"
              class="appointment-btn whatsapp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                />
              </svg>
              {{ 'APPOINTMENT_SECTION.WHATSAPP' | translate }}
            </a>
          </div>

          <!-- Phone Option -->
          <div class="appointment-card">
            <div class="card-icon">
              <span class="material-icons">phone_in_talk</span>
            </div>
            <h3>{{ 'APPOINTMENT_SECTION.PHONE_APPOINTMENT' | translate }}</h3>
            <p>{{ 'APPOINTMENT_SECTION.PHONE_DESC' | translate }}</p>
            <a href="tel:+902165761190" class="appointment-btn secondary">
              <span class="material-icons">phone</span>
              0216 576 11 90
            </a>
          </div>
        </div>

        <!-- Embedded Appointment System -->
        <div class="embedded-appointment" *ngIf="showEmbedded">
          <div class="iframe-container">
            <iframe [src]="appointmentUrl" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .appointment-section {
        padding: 60px 0;
        background: #f8f9fa;
      }

      .appointment-header {
        text-align: center;
        margin-bottom: 60px;
      }

      .section-title {
        font-size: 2.25rem;
        color: var(--color-primary);
        margin-bottom: 16px;
        font-weight: 700;
      }

      .section-subtitle {
        font-size: 1.125rem;
        color: var(--color-neutral-600);
        max-width: 600px;
        margin: 0 auto;
      }

      .appointment-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-bottom: 60px;
      }

      .appointment-card {
        background: white;
        border-radius: 16px;
        padding: 40px 30px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 95, 115, 0.08);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .appointment-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      .appointment-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(0, 95, 115, 0.15);
      }

      .appointment-card:hover::before {
        transform: scaleX(1);
      }

      .card-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
        border-radius: 50%;
        position: relative;
      }

      .card-icon .material-icons {
        font-size: 40px;
        color: white;
      }

      .card-icon.whatsapp {
        background: linear-gradient(135deg, #25d366, #128c7e);
      }

      .card-icon svg {
        width: 40px;
        height: 40px;
        color: white;
      }

      .appointment-card h3 {
        font-size: 1.5rem;
        color: var(--color-primary);
        margin-bottom: 12px;
        font-weight: 600;
      }

      .appointment-card p {
        color: var(--color-neutral-600);
        margin-bottom: 24px;
        line-height: 1.6;
      }

      .appointment-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 32px;
        border-radius: 50px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        font-size: 1rem;
      }

      .appointment-btn.primary {
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
        color: white;
      }

      .appointment-btn.primary:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(0, 95, 115, 0.3);
      }

      .appointment-btn.whatsapp {
        background: linear-gradient(135deg, #25d366, #128c7e);
        color: white;
      }

      .appointment-btn.whatsapp:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
      }

      .appointment-btn.secondary {
        background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
        color: var(--color-primary);
      }

      .appointment-btn.secondary:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }

      .appointment-btn .material-icons {
        font-size: 20px;
      }

      .appointment-btn svg {
        width: 20px;
        height: 20px;
      }

      .embedded-appointment {
        margin-top: 60px;
        padding: 40px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 95, 115, 0.1);
      }

      .iframe-container {
        position: relative;
        width: 100%;
        padding-bottom: 100%;
        height: 0;
        overflow: hidden;
        border-radius: 16px;
        min-height: 800px;
      }

      .iframe-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 16px;
      }

      @media (max-width: 768px) {
        .appointment-options {
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .section-title {
          font-size: 2rem;
        }

        .appointment-card {
          padding: 30px 20px;
        }

        .iframe-container {
          min-height: 600px;
        }
      }
    `,
  ],
})
export class AppointmentSectionComponent {
  showEmbedded = false;
  appointmentUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.appointmentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://saglikpetegim.com/randevu'
    );
  }
}
