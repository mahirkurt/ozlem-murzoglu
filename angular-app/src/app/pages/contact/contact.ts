import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
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
    { day: 'Pazartesi - Cuma', hours: '09:00 - 18:00' },
    { day: 'Cumartesi', hours: '09:00 - 14:00' },
    { day: 'Pazar', hours: 'Kapalı' }
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