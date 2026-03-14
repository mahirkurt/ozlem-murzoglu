import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CONTACT_HELPERS } from '../../config/contact.config';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule, HeroSectionComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {
  private readonly translate = inject(TranslateService);
  private readonly sanitizer = inject(DomSanitizer);
  
  readonly breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_APPOINTMENT' }
  ];

  // Sağlık Peteğim URL
  private readonly saglikPetegimUrlRaw = 'https://saglikpetegim.com/randevu';
  readonly saglikPetegimUrl: SafeResourceUrl;
  showIframe = false;
  showQuickForm = true;

  constructor() {
    // Sağlık Peteğim randevu sayfası URL'i
    this.saglikPetegimUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.saglikPetegimUrlRaw);
  }

  // Quick appointment form
  formData = {
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    childName: '',
    childAge: '',
    appointmentType: 'routine',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  };

  readonly appointmentTypes = [
    { value: 'routine', labelKey: 'APPOINTMENT.TYPE_ROUTINE' },
    { value: 'sick', labelKey: 'APPOINTMENT.TYPE_SICK' },
    { value: 'vaccination', labelKey: 'APPOINTMENT.TYPE_VACCINATION' },
    { value: 'consultation', labelKey: 'APPOINTMENT.TYPE_CONSULTATION' },
    { value: 'online', labelKey: 'APPOINTMENT.TYPE_ONLINE' }
  ];

  readonly timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  onSubmit() {
    if (this.validateForm()) {
      // Form verilerini hazırla
      const appointmentRequest = {
        ...this.formData,
        requestedAt: new Date().toISOString(),
        source: 'website',
        status: 'pending'
      };

      void appointmentRequest;

      // TODO: Firebase'e gönder veya WhatsApp mesajı oluştur
      this.sendWhatsAppMessage();
    }
  }

  validateForm(): boolean {
    // Basit validasyon
    if (!this.formData.parentName || !this.formData.parentPhone || 
        !this.formData.childName || !this.formData.preferredDate) {
      alert(this.translate.instant('APPOINTMENT.ERROR_MESSAGE'));
      return false;
    }
    return true;
  }

  sendWhatsAppMessage() {
    const appointmentLabel = this.translate.instant(
      this.appointmentTypes.find(t => t.value === this.formData.appointmentType)?.labelKey ?? 'APPOINTMENT.TYPE_ROUTINE'
    );

    const message = `Randevu Talebi:
Veli: ${this.formData.parentName}
Telefon: ${this.formData.parentPhone}
Çocuk: ${this.formData.childName} (${this.formData.childAge} yaş)
Randevu Tipi: ${appointmentLabel}
Tarih: ${this.formData.preferredDate}
Saat: ${this.formData.preferredTime}
Not: ${this.formData.notes}`;

    const whatsappUrl = CONTACT_HELPERS.getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank');
  }

  toggleView() {
    this.showIframe = !this.showIframe;
    this.showQuickForm = !this.showQuickForm;
  }

  openSaglikPetegim() {
    window.open(this.saglikPetegimUrlRaw, '_blank', 'noopener,noreferrer');
  }
}
