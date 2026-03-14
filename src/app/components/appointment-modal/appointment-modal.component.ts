import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CONTACT_CONFIG, CONTACT_HELPERS } from '../../config/contact.config';

@Component({
  selector: 'app-appointment-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-modal.component.html',
  styleUrl: './appointment-modal.component.css'
})
export class AppointmentModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  isLoading = true;
  readonly whatsappUrl = CONTACT_HELPERS.getWhatsAppApiUrl('Merhaba, randevu almak istiyorum.');
  readonly phoneUrl = CONTACT_CONFIG.phone.telHref;
  readonly phoneDisplay = CONTACT_CONFIG.phone.display;

  ngOnInit() {
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.handleEscapeKey.bind(this));
    }
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
    }
  }

  handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isOpen) {
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onIframeLoad() {
    this.isLoading = false;
  }

  ngOnChanges() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
  }
}
