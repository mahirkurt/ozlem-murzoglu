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
    { label: 'Ana Sayfa', link: '/' },
    { label: 'İletişim' }
  ];
  contactInfo = {
    phone: '+90 216 688 44 83',
    mobilePhone: '+90 546 688 44 83',
    email: 'klinik@drmurzoglu.com',
    address: {
      street: 'Barbaros Mah. Ak Zambak Sok. No: 3',
      building: 'Uphill Towers A-30',
      district: 'Ataşehir',
      city: 'İstanbul'
    }
  };

  workingHours = [
    { dayKey: 'CONTACT.WEEKDAYS', hoursKey: 'CONTACT.WEEKDAYS_HOURS', day: 'Pazartesi - Cuma', hours: '09:00 - 18:00' },
    { dayKey: 'CONTACT.SATURDAY', hoursKey: 'CONTACT.SATURDAY_HOURS', day: 'Cumartesi', hours: '09:00 - 14:00' },
    { dayKey: 'CONTACT.SUNDAY', hoursKey: 'CONTACT.SUNDAY_HOURS', day: 'Pazar', hours: 'Kapalı' }
  ];

  parkingOptions = [
    {
      title: 'Vale Hizmeti',
      description: 'Uphill Towers önündeki vale hizmetini kullanabilirsiniz (ücretlidir).'
    },
    {
      title: 'Bulvar 216 AVM Otoparkı',
      highlight: '0-3 Saat Ücretsiz',
      description: 'Hemen yandaki Bulvar 216 AVM otoparkını kullanabilirsiniz. İlk 3 saat ücretsizdir.'
    }
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
    alert('Mesajınız alındı. En kısa sürede size dönüş yapacağız.');
    this.resetForm();
  }
  
  validateForm(): boolean {
    // Name validation
    if (!this.formData.name || this.formData.name.trim().length < 3) {
      alert('Lütfen geçerli bir ad soyad giriniz (en az 3 karakter).');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email || !emailRegex.test(this.formData.email)) {
      alert('Lütfen geçerli bir e-posta adresi giriniz.');
      return false;
    }
    
    // Phone validation (Turkish phone number format)
    const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
    const cleanPhone = this.formData.phone.replace(/[\s()-]/g, '');
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      alert('Lütfen geçerli bir telefon numarası giriniz.');
      return false;
    }
    
    // Message validation
    if (!this.formData.message || this.formData.message.trim().length < 10) {
      alert('Lütfen mesajınızı giriniz (en az 10 karakter).');
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