import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IllustrationComponent } from '../../shared/components/illustration/illustration.component';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';
import { CONTACT_CONFIG, CONTACT_HELPERS } from '../../config/contact.config';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, IllustrationComponent, HeroSectionComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  private readonly translate = inject(TranslateService);
  private readonly sanitizer = inject(DomSanitizer);
  
  readonly breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_CONTACT' }
  ];
  readonly contactInfo = {
    phone: CONTACT_CONFIG.phone.display,
    phoneHref: CONTACT_CONFIG.phone.telHref,
    mobilePhone: CONTACT_CONFIG.mobile.display,
    mobilePhoneHref: CONTACT_CONFIG.mobile.telHref,
    email: CONTACT_CONFIG.email.value,
    emailHref: CONTACT_CONFIG.email.mailtoHref,
    address: {
      street: CONTACT_CONFIG.address.street,
      building: CONTACT_CONFIG.address.building,
      district: CONTACT_CONFIG.address.district,
      city: CONTACT_CONFIG.address.city
    }
  };

  readonly mapLinks = {
    google: CONTACT_CONFIG.mapsUrl,
    apple: `https://maps.apple.com/?q=${encodeURIComponent(CONTACT_CONFIG.address.fullDisplay)}`,
  };

  readonly whatsappLocationMessage = `${CONTACT_CONFIG.address.fullDisplay} - ${CONTACT_CONFIG.mapsUrl}`;
  readonly whatsappLocationUrl = CONTACT_HELPERS.getWhatsAppUrl(this.whatsappLocationMessage);
  readonly whatsappQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(this.whatsappLocationUrl)}`;
  readonly mapEmbedUrl: SafeResourceUrl;

  readonly workingHours = [
    { dayKey: 'CONTACT.WEEKDAYS', hoursKey: 'CONTACT.WEEKDAYS_HOURS' },
    { dayKey: 'CONTACT.SATURDAY', hoursKey: 'CONTACT.SATURDAY_HOURS' },
    { dayKey: 'CONTACT.SUNDAY', hoursKey: 'CONTACT.SUNDAY_HOURS' }
  ];

  readonly parkingOptions = [
    {
      titleKey: 'CONTACT.PARKING_VALET_TITLE',
      descriptionKey: 'CONTACT.PARKING_VALET_DESC'
    },
    {
      titleKey: 'CONTACT.PARKING_BULVAR_TITLE',
      highlightKey: 'CONTACT.PARKING_BULVAR_HIGHLIGHT',
      descriptionKey: 'CONTACT.PARKING_BULVAR_DESC'
    }
  ];

  constructor() {
    const encodedAddress = encodeURIComponent(CONTACT_CONFIG.address.fullDisplay);
    this.mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${encodedAddress}&z=15&output=embed`
    );
  }


  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  onSubmit() {
    // Validate form data
    if (!this.validateForm()) {
      return;
    }
    
    // Track form submission as conversion event
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'form_submission',
        form_name: 'contact_form',
        conversion_type: 'lead'
      });
    }

    console.log('Form submitted:', this.formData);
    // Form gönderme işlemi burada yapılacak
    alert(this.translate.instant('CONTACT.FORM_SUCCESS'));
    this.resetForm();
  }
  
  validateForm(): boolean {
    // Name validation
    if (!this.formData.name || this.formData.name.trim().length < 3) {
      alert(this.translate.instant('CONTACT.VALIDATION.NAME'));
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email || !emailRegex.test(this.formData.email)) {
      alert(this.translate.instant('CONTACT.VALIDATION.EMAIL'));
      return false;
    }
    
    // Phone validation (Turkish phone number format)
    const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
    const cleanPhone = this.formData.phone.replace(/[\s()-]/g, '');
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      alert(this.translate.instant('CONTACT.VALIDATION.PHONE'));
      return false;
    }
    
    // Message validation
    if (!this.formData.message || this.formData.message.trim().length < 10) {
      alert(this.translate.instant('CONTACT.VALIDATION.MESSAGE'));
      return false;
    }
    
    return true;
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }
}
