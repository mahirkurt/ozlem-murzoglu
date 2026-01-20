import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="appointment-widget" [class.expanded]="isExpanded">
      <!-- Floating Button -->
      <button 
        class="widget-button"
        (click)="toggleWidget()"
        [attr.aria-label]="isExpanded ? 'Randevu panelini kapat' : 'Online randevu al'"
      >
        <span class="material-icons-rounded" *ngIf="!isExpanded">calendar_today</span>
        <span class="material-icons-rounded" *ngIf="isExpanded">close</span>
        <span class="widget-text" *ngIf="!isExpanded">Online Randevu</span>
      </button>

      <!-- Expanded Options -->
      <div class="widget-options" *ngIf="isExpanded">
        <div class="widget-header">
          <h3>Hızlı Randevu</h3>
          <p>Size en uygun yöntemi seçin</p>
        </div>

        <div class="widget-actions">
          <a 
            href="https://saglikpetegim.com/randevu" 
            target="_blank" 
            class="widget-action primary"
            (click)="trackAction('online')"
          >
            <span class="material-icons-rounded">open_in_new</span>
            <div>
              <strong>Online Randevu</strong>
              <small>Randevu sistemine git</small>
            </div>
          </a>

          <a 
            href="https://wa.me/905334985949?text=Merhaba,%20randevu%20almak%20istiyorum" 
            target="_blank" 
            class="widget-action whatsapp"
            (click)="trackAction('whatsapp')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <div>
              <strong>WhatsApp</strong>
              <small>Hızlı iletişim</small>
            </div>
          </a>

          <a 
            href="tel:+902165761190" 
            class="widget-action phone"
            (click)="trackAction('phone')"
          >
            <span class="material-icons-rounded">phone</span>
            <div>
              <strong>0216 576 11 90</strong>
              <small>Telefon ile randevu</small>
            </div>
          </a>
        </div>
      </div>

      <!-- Pulse Animation -->
      <div class="widget-pulse" *ngIf="!isExpanded"></div>
    </div>
  `,
  styles: [`
    .appointment-widget {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 9999;
    }

    .widget-button {
      display: flex;
      align-items: center;
      gap: var(--md-sys-spacing-2);
      padding: var(--md-sys-spacing-4) var(--md-sys-spacing-6);
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
      color: white;
      border: none;
      border-radius: 50px;
      box-shadow: 0 8px 30px rgba(var(--md-sys-color-primary-rgb), 0.3);
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .widget-button::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: var(--md-sys-shape-corner-full);
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .widget-button:hover::before {
      width: 300px;
      height: 300px;
    }

    .widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 40px rgba(var(--md-sys-color-primary-rgb), 0.4);
    }

    .widget-button .material-icons-rounded {
      font-size: 24px;
      position: relative;
      z-index: 1;
    }

    .widget-text {
      position: relative;
      z-index: 1;
    }

    .appointment-widget.expanded .widget-button {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border-radius: var(--md-sys-shape-corner-full);
      padding: var(--md-sys-spacing-4);
      min-width: auto;
    }

    .widget-options {
      position: absolute;
      bottom: 80px;
      right: 0;
      background: white;
      border-radius: var(--md-sys-shape-corner-large);
      box-shadow: 0 20px 60px rgba(var(--md-sys-color-shadow), 0.15);
      padding: var(--md-sys-spacing-6);
      min-width: 320px;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .widget-header {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .widget-header h3 {
      color: var(--color-primary);
      font-size: 1.25rem;
      margin-bottom: 4px;
      font-weight: 600;
    }

    .widget-header p {
      color: var(--color-neutral-600);
      font-size: 0.875rem;
    }

    .widget-actions {
      display: flex;
      flex-direction: column;
      gap: var(--md-sys-spacing-3);
    }

    .widget-action {
      display: flex;
      align-items: center;
      gap: var(--md-sys-spacing-4);
      padding: var(--md-sys-spacing-4);
      border-radius: var(--md-sys-shape-corner-medium);
      text-decoration: none;
      transition: all 0.3s ease;
      border: 1px solid #e5e7eb;
    }

    .widget-action:hover {
      transform: translateX(8px);
      box-shadow: 0 4px 20px rgba(var(--md-sys-color-shadow), 0.1);
    }

    .widget-action.primary {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      border-color: var(--color-primary-light);
    }

    .widget-action.primary:hover {
      background: linear-gradient(135deg, #e0f2fe, #bae6fd);
    }

    .widget-action.whatsapp {
      background: linear-gradient(135deg, #f0fdf4, #dcfce7);
      border-color: var(--md-sys-color-brand-whatsapp);
    }

    .widget-action.whatsapp:hover {
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    }

    .widget-action.phone {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-color: #f59e0b;
    }

    .widget-action.phone:hover {
      background: linear-gradient(135deg, #fde68a, #fbbf24);
    }

    .widget-action .material-icons-rounded {
      font-size: 24px;
      color: var(--color-primary);
    }

    .widget-action svg {
      width: 24px;
      height: 24px;
      color: var(--md-sys-color-brand-whatsapp);
    }

    .widget-action.phone .material-icons-rounded {
      color: #f59e0b;
    }

    .widget-action div {
      flex: 1;
    }

    .widget-action strong {
      display: block;
      color: #1f2937;
      font-size: 0.95rem;
      margin-bottom: 2px;
    }

    .widget-action small {
      color: #6b7280;
      font-size: 0.8rem;
    }

    .widget-pulse {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border-radius: 50px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
      opacity: 0.3;
      pointer-events: none;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.3;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0;
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.3;
      }
    }

    @media (max-width: 768px) {
      .appointment-widget {
        bottom: 20px;
        right: 20px;
      }

      .widget-button {
        padding: var(--md-sys-spacing-3) var(--md-sys-spacing-5);
        font-size: 14px;
      }

      .widget-text {
        display: none;
      }

      .widget-options {
        right: -10px;
        left: auto;
        min-width: 280px;
        max-width: calc(100vw - 40px);
      }
    }
  `]
})
export class AppointmentWidgetComponent {
  isExpanded = false;

  toggleWidget() {
    this.isExpanded = !this.isExpanded;
  }

  trackAction(action: string) {
    console.log('Appointment action:', action);
    // Here you can add analytics tracking
    this.isExpanded = false;
  }
}