import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <a 
      href="https://api.whatsapp.com/send?phone=905466884483&text=Merhaba%2C%20WhatsApp%20bilgilerinizi%20web%20sitenizden%20ald%C4%B1m."
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-floating"
      [attr.aria-label]="'APPOINTMENT_SECTION.WHATSAPP_CONTACT' | translate"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 012.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z"/>
      </svg>
      <span class="whatsapp-text">{{ 'HEADER.WHATSAPP' | translate }}</span>
      <span class="whatsapp-pulse"></span>
    </a>
  `,
  styles: [`
    .whatsapp-floating {
      position: fixed;
      bottom: calc(30px + env(safe-area-inset-bottom, 0px));
      right: calc(30px + env(safe-area-inset-right, 0px));
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--md-sys-color-brand-whatsapp) 0%, var(--md-sys-color-brand-whatsapp-dark) 100%);
      border-radius: var(--md-sys-shape-corner-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
      z-index: 999;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    
    .whatsapp-floating:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 30px rgba(37, 211, 102, 0.5);
      width: auto;
      padding: 0 20px;
      border-radius: var(--md-sys-shape-corner-extra-large);
    }
    
    .whatsapp-floating svg {
      flex-shrink: 0;
    }
    
    .whatsapp-text {
      max-width: 0;
      overflow: hidden;
      white-space: nowrap;
      transition: all 0.3s ease;
      margin-left: 0;
      font-weight: 600;
      font-size: 16px;
    }
    
    .whatsapp-floating:hover .whatsapp-text {
      max-width: 100px;
      margin-left: 10px;
    }
    
    .whatsapp-pulse {
      position: absolute;
      inset: 0;
      border-radius: var(--md-sys-shape-corner-full);
      background: linear-gradient(135deg, var(--md-sys-color-brand-whatsapp) 0%, var(--md-sys-color-brand-whatsapp-dark) 100%);
      animation: pulse 2s infinite;
      z-index: -1;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }
    
    @media (max-width: 768px) {
      .whatsapp-floating {
        bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        right: calc(16px + env(safe-area-inset-right, 0px));
        width: 50px;
        height: 50px;
      }
      
      .whatsapp-floating svg {
        width: 24px;
        height: 24px;
      }
    }

    @media (max-width: 600px) {
      .whatsapp-floating {
        bottom: calc(12px + env(safe-area-inset-bottom, 0px));
        right: calc(72px + env(safe-area-inset-right, 0px));
        width: 46px;
        height: 46px;
        box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
      }

      .whatsapp-floating:hover {
        width: 46px;
        padding: 0;
        border-radius: var(--md-sys-shape-corner-full);
      }

      .whatsapp-text {
        display: none;
      }
    }
  `]
})
export class WhatsAppButtonComponent {}
