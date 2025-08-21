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
    console.log('Form submitted:', this.formData);
    // Form gönderme işlemi burada yapılacak
    alert('Mesajınız alındı. En kısa sürede size dönüş yapacağız.');
    this.resetForm();
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