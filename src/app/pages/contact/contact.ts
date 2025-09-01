import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IllustrationComponent } from '../../shared/components/illustration/illustration.component';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, IllustrationComponent, HeroSectionComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  private translate = inject(TranslateService);
  
  breadcrumbs = [
    { label: 'CONTACT.HOME_BREADCRUMB', link: '/' },
    { label: 'CONTACT.CONTACT_BREADCRUMB' }
  ];
  contactInfo = {
    phone: '+90 222 237 84 00',
    email: 'info@ozlemmurzoglu.com',
    address: {
      street: 'Yeşiltepe Mah. Huzur Sokak No:2',
      building: 'Neorama İş Merkezi Kat:3 D:15',
      district: 'Tepebaşı',
      city: 'Eskişehir'
    }
  };

  workingHours = [
    { dayKey: 'CONTACT.WEEKDAYS', hoursKey: 'CONTACT.WEEKDAYS_HOURS' },
    { dayKey: 'CONTACT.SATURDAY', hoursKey: 'CONTACT.SATURDAY_HOURS' },
    { dayKey: 'CONTACT.SUNDAY', hoursKey: 'CONTACT.SUNDAY_HOURS' }
  ];

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