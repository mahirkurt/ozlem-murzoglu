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
    phone: '+90 222 237 84 00',
    email: 'info@ozlemmurzoglu.com',
    address: {
      street: 'Yeşiltepe Mah. Huzur Sokak No:2',
      building: 'Neorama İş Merkezi Kat:3 D:15',
      district: 'Tepebaşı',
      city: 'Eskişehir'
    }
  };

  socialLinks: SocialLink[] = [
    { platform: 'instagram', url: 'https://instagram.com/drozlemmurzoglu' },
    { platform: 'facebook', url: 'https://facebook.com/drozlemmurzoglu' },
    { platform: 'twitter', url: 'https://twitter.com/drozlemmurzoglu' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/drozlemmurzoglu' },
    { platform: 'youtube', url: 'https://youtube.com/@drozlemmurzoglu' }
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