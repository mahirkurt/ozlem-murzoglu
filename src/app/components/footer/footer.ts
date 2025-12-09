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
  styleUrls: ['./footer.scss']
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
    { platform: 'google', url: 'https://maps.app.goo.gl/T6NqV7g4LzakSesKA' },
    { platform: 'whatsapp', url: 'https://api.whatsapp.com/send?phone=905466884483&text=Merhaba%2C%20WhatsApp%20bilgilerinizi%20web%20sitenizden%20ald%C4%B1m.' }
  ];

  quickLinks = [
    { labelKey: 'FOOTER.HOME', href: '/' },
    { labelKey: 'FOOTER.ABOUT', href: '/hakkimizda' },
    { labelKey: 'FOOTER.SERVICES', href: '/hizmetlerimiz' },
    { labelKey: 'FOOTER.INFO_CENTER', href: '/bilgi-merkezi' },
    { labelKey: 'FOOTER.FAQ', href: '/sss' },
    { labelKey: 'FOOTER.CONTACT', href: '/iletisim' },
    { labelKey: 'FOOTER.APPOINTMENT', href: '/randevu' }
  ];

  services = [
    { labelKey: 'FOOTER.BRIGHT_FUTURES', href: '/hizmetlerimiz/bright-futures-program' },
    { labelKey: 'FOOTER.TRIPLE_P', href: '/hizmetlerimiz/triple-p' },
    { labelKey: 'FOOTER.HEALTHY_SLEEP', href: '/hizmetlerimiz/saglikli-uykular' },
    { labelKey: 'FOOTER.LAB_IMAGING', href: '/hizmetlerimiz/laboratuvar-goruntuleme' },
    { labelKey: 'FOOTER.VACCINATION', href: '/hizmetlerimiz/asi-takibi' },
    { labelKey: 'FOOTER.DEVELOPMENT', href: '/hizmetlerimiz/gelisim-degerlendirmesi' }
  ];

  footerLinks = [
    { labelKey: 'FOOTER.PRIVACY_POLICY', href: '/legal/privacy' },
    { labelKey: 'FOOTER.TERMS', href: '/legal/terms' },
    { labelKey: 'FOOTER.KVKK', href: '/legal/kvkk' }
  ];
}