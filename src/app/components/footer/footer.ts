import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface SocialLink {
  platform: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  private translate = inject(TranslateService);
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
    { platform: 'facebook', url: 'https://www.facebook.com/dr.murzoglu/' },
    { platform: 'twitter', url: 'https://x.com/ozlemmurzoglu' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/ozlemmurzoglu/' },
    { platform: 'youtube', url: 'https://www.youtube.com/@ozlemmurzoglu' },
    { platform: 'google', url: 'https://g.co/kgs/jXU64C' },
    { platform: 'whatsapp', url: 'https://api.whatsapp.com/send?phone=905466884483&text=Merhaba%2C%20WhatsApp%20bilgilerinizi%20web%20sitenizden%20ald%C4%B1m.' }
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