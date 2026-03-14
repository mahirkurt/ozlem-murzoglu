import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { CONTACT_CONFIG, CONTACT_HELPERS } from '../../config/contact.config';

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
  private themeService = inject(ThemeService);
  currentYear = new Date().getFullYear();
  
  contactInfo = {
    phone: CONTACT_CONFIG.phone.display,
    phoneHref: CONTACT_CONFIG.phone.telHref,
    mobile: CONTACT_CONFIG.mobile.display,
    whatsapp: CONTACT_CONFIG.mobile.display,
    email: CONTACT_CONFIG.email.value,
    emailHref: CONTACT_CONFIG.email.mailtoHref,
    address: {
      street: CONTACT_CONFIG.address.street,
      building: CONTACT_CONFIG.address.building,
      district: CONTACT_CONFIG.address.district,
      city: CONTACT_CONFIG.address.city,
      zipCode: CONTACT_CONFIG.address.postalCode,
    }
  };

  socialLinks: SocialLink[] = [
    { platform: 'instagram', url: 'https://instagram.com/dr.ozlemmurzoglu' },
    { platform: 'facebook', url: 'https://www.facebook.com/dr.murzoglu/' },
    { platform: 'twitter', url: 'https://x.com/ozlemmurzoglu' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/ozlemmurzoglu/' },
    { platform: 'youtube', url: 'https://www.youtube.com/@ozlemmurzoglu' },
    { platform: 'google', url: CONTACT_CONFIG.mapsUrl },
    { platform: 'whatsapp', url: CONTACT_HELPERS.getWhatsAppApiUrl('Merhaba, WhatsApp bilgilerinizi web sitenizden aldım.') }
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

  get currentTheme() {
    return this.themeService.getTheme();
  }

  get isDarkMode() {
    if (typeof document === 'undefined') {
      return false;
    }
    return document.documentElement.classList.contains('dark-theme');
  }

  get themeIcon() {
    const mode = this.currentTheme;
    if (mode === 'auto') {
      return 'brightness_auto';
    }
    return mode === 'dark' ? 'dark_mode' : 'light_mode';
  }

  get themeAriaLabel() {
    const mode = this.currentTheme;
    if (mode === 'auto') {
      return this.translate.instant(
        this.isDarkMode ? 'COMMON.THEME.AUTO_DARK' : 'COMMON.THEME.AUTO_LIGHT'
      );
    }
    return this.translate.instant(
      mode === 'dark' ? 'COMMON.THEME.DARK' : 'COMMON.THEME.LIGHT'
    );
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
