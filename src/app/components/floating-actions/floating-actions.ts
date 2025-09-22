import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-actions" [class.expanded]="isExpanded">
      <!-- Main FAB Button -->
      <button class="fab-main" (click)="toggleExpand()" [class.rotate]="isExpanded">
        <span class="material-icons">{{isExpanded ? 'close' : 'support_agent'}}</span>
      </button>
      
      <!-- Action Buttons -->
      <div class="fab-actions">
        <a href="https://wa.me/905462378400" 
           target="_blank" 
           class="fab-action whatsapp"
           [style.transform]="isExpanded ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)'"
           [style.transition-delay]="isExpanded ? '0.1s' : '0s'">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span class="tooltip">WhatsApp</span>
        </a>
        
        <a href="tel:+902222378400" 
           class="fab-action phone"
           [style.transform]="isExpanded ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)'"
           [style.transition-delay]="isExpanded ? '0.2s' : '0s'">
          <span class="material-icons">phone</span>
          <span class="tooltip">Ara</span>
        </a>
        
        <a href="/randevu" 
           class="fab-action appointment"
           [style.transform]="isExpanded ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)'"
           [style.transition-delay]="isExpanded ? '0.3s' : '0s'">
          <span class="material-icons">calendar_month</span>
          <span class="tooltip">Randevu</span>
        </a>
      </div>
      
      <!-- Pulse Effect -->
      <div class="pulse-ring"></div>
      <div class="pulse-ring"></div>
    </div>
  `,
  styles: [`
    .floating-actions {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }
    
    .fab-main {
      width: 64px;
      height: 64px;
      border-radius: var(--md-sys-shape-corner-full);
      background: linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-primary) 100%);
      border: none;
      color: white;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(var(--md-sys-color-primary-rgb), 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 10;
    }
    
    .fab-main:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 30px rgba(var(--md-sys-color-primary-rgb), 0.4);
    }
    
    .fab-main.rotate {
      background: linear-gradient(135deg, var(--md-sys-color-error) 0%, #E91E63 100%);
    }
    
    .fab-main .material-icons {
      font-size: 28px;
      transition: transform 0.3s ease;
    }
    
    .fab-main.rotate .material-icons {
      transform: rotate(135deg);
    }
    
    .fab-actions {
      position: absolute;
      bottom: 80px;
      right: 0;
      display: flex;
      flex-direction: column;
      gap: var(--md-sys-spacing-4);
      align-items: flex-end;
    }
    
    .fab-action {
      width: 48px;
      height: 48px;
      border-radius: var(--md-sys-shape-corner-full);
      background: white;
      box-shadow: 0 4px 12px rgba(var(--md-sys-color-shadow), 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    
    .fab-action:hover {
      transform: scale(1.1) translateY(0) !important;
      box-shadow: 0 6px 20px rgba(var(--md-sys-color-shadow), 0.2);
    }
    
    .fab-action.whatsapp {
      background: var(--md-sys-color-brand-whatsapp);
      color: white;
    }
    
    .fab-action.phone {
      background: linear-gradient(135deg, var(--md-sys-color-secondary) 0%, #FFA726 100%);
      color: white;
    }
    
    .fab-action.appointment {
      background: linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-primary) 100%);
      color: white;
    }
    
    .fab-action .material-icons {
      font-size: 24px;
    }
    
    .fab-action svg {
      width: 24px;
      height: 24px;
    }
    
    .tooltip {
      position: absolute;
      right: 60px;
      background: rgba(var(--md-sys-color-shadow), 0.8);
      color: white;
      padding: var(--md-sys-spacing-1) var(--md-sys-spacing-3);
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    
    .fab-action:hover .tooltip {
      opacity: 1;
    }
    
    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 64px;
      height: 64px;
      border: 2px solid rgba(var(--md-sys-color-primary-rgb), 0.3);
      border-radius: var(--md-sys-shape-corner-full);
      animation: pulse-animation 2s infinite;
      z-index: 0;
    }
    
    .pulse-ring:nth-child(2) {
      animation-delay: 0.5s;
    }
    
    @keyframes pulse-animation {
      0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0;
      }
    }
    
    @media (max-width: 768px) {
      .floating-actions {
        bottom: 16px;
        right: 16px;
      }
      
      .fab-main {
        width: 56px;
        height: 56px;
      }
      
      .fab-action {
        width: 44px;
        height: 44px;
      }
    }
  `]
})
export class FloatingActionsComponent implements OnInit {
  isExpanded = false;
  
  ngOnInit() {
    // Auto-pulse for attention after 3 seconds
    setTimeout(() => {
      this.pulse();
    }, 3000);
  }
  
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
  
  pulse() {
    // Add attention-grabbing animation
    const mainButton = document.querySelector('.fab-main');
    if (mainButton && !this.isExpanded) {
      mainButton.classList.add('pulse');
      setTimeout(() => {
        mainButton.classList.remove('pulse');
      }, 1000);
    }
  }
}