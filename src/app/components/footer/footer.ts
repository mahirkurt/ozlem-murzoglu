import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SocialLink {
  platform: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  currentYear = new Date().getFullYear();
  
  contactInfo = {
    phone: '+90 216 688 44 83',
    mobile: '+90 546 688 44 83',
    whatsapp: '+90 546 688 44 83',
    email: 'klinik@drmurzoglu.com',
    address: {
      street: 'Barbaros Mah. Ak Zambak Sok. No:3',
      building: 'Uphill Towers, A Blok - Daire 30',
      district: 'Ataşehir',
      city: 'İstanbul',
      zipCode: '34746'
    }
  };

  socialLinks: SocialLink[] = [
    { platform: 'instagram', url: 'https://instagram.com/dr.ozlemmurzoglu' },
    { platform: 'facebook', url: 'https://facebook.com/dr.murzoglu' },
    { platform: 'twitter', url: 'https://twitter.com/ozlemmurzoglu' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/ozlemmurzoglu' },
    { platform: 'youtube', url: 'https://youtube.com/@ozlemmurzoglu' },
    { platform: 'whatsapp', url: 'https://wa.me/905466884483' }
  ];

  quickLinks = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'Hizmetlerimiz', href: '/hizmetlerimiz' },
    { label: 'Makaleler', href: '/makaleler' },
    { label: 'İletişim', href: '/iletisim' }
  ];

  services = [
    { label: 'Sağlıklı Çocuk İzlemi', href: '/hizmetlerimiz/bright-futures' },
    { label: 'Aşılama', href: '/hizmetlerimiz/asilama' },
    { label: 'Ebeveyn Danışmanlığı', href: '/hizmetlerimiz/triple-p' },
    { label: 'Online Konsültasyon', href: '/hizmetlerimiz/online-konsultasyon' }
  ];

  footerLinks = [
    { label: 'Gizlilik Politikası', href: '/gizlilik' },
    { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
    { label: 'KVKK', href: '/kvkk' }
  ];
}