import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentModalComponent } from '../appointment-modal/appointment-modal.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AppointmentModalComponent, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() locale: string = 'tr';
  @Output() localeChange = new EventEmitter<string>();
  
  private translate = inject(TranslateService);
  
  isMobileMenuOpen = false;
  isScrolled = false;
  activeDropdown: string | null = null;
  isAnimating = false;
  isAppointmentModalOpen = false;

  contactInfo = {
    phone: '+90 216 688 44 83',
    email: 'klinik@drmurzoglu.com',
    address: 'Ataşehir, İstanbul'
  };

  navigation: any[] = [
    {
      labelKey: 'HEADER.NAV_ABOUT',
      href: '/hakkimizda',
      children: [
        { labelKey: 'HEADER.NAV_ABOUT_US', href: '/hakkimizda' },
        { labelKey: 'HEADER.NAV_DR_OZLEM', href: '/hakkimizda/dr-ozlem-murzoglu' },
        { labelKey: 'HEADER.NAV_CLINIC_DESIGN', href: '/hakkimizda/klinik-tasarimi' },
        { labelKey: 'HEADER.NAV_FAQ', href: '/hakkimizda/sss' }
      ]
    },
    {
      labelKey: 'HEADER.NAV_SERVICES',
      href: '/hizmetlerimiz',
      children: [
        { labelKey: 'SERVICES.SERVICE_LAB.TITLE', href: '/hizmetlerimiz/laboratuvar-goruntuleme' },
        { labelKey: 'SERVICES.SERVICE_TRIPLE_P.TITLE', href: '/hizmetlerimiz/triple-p' },
        { labelKey: 'SERVICES.SERVICE_SLEEP.TITLE', href: '/hizmetlerimiz/saglikli-uykular' },
        { labelKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.TITLE', href: '/hizmetlerimiz/bright-futures-program' }
      ]
    },
    {
      labelKey: 'HEADER.NAV_INFO_CENTER',
      href: '/bilgi-merkezi',
      children: [
        { label: 'Tüm Kaynaklar', href: '/bilgi-merkezi' },
        { label: 'Aşı Bilgileri', href: '/bilgi-merkezi/asilar' },
        { label: 'Gelişim Rehberleri', href: '/bilgi-merkezi/gelisim-rehberleri' },
        { label: 'Genel Bilgiler', href: '/bilgi-merkezi/genel-bilgiler' },
        { label: 'Büyüme Eğrileri', href: '/bilgi-merkezi/cdc-buyume-egrileri' },
        { label: 'Aile Medya Planı', href: '/bilgi-merkezi/aile-medya-plani' }
      ]
    },
    {
      label: 'Bright Futures™ Yolculuğu',
      href: '/bilgi-merkezi/bright-futures-yolculugu'
    },
    {
      label: 'saygıyla',
      href: '/saygiyla'
    },
    {
      labelKey: 'HEADER.NAV_CONTACT',
      href: '/iletisim'
    }
  ];

  get primaryMenu() {
    return this.navigation;
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    
    // Set the current language
    this.translate.use(this.locale);
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  handleScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }
  }

  setActiveDropdown(label: string | null) {
    this.activeDropdown = label;
  }

  handleLanguageChange() {
    this.isAnimating = true;
    
    setTimeout(() => {
      this.locale = this.locale === 'tr' ? 'en' : 'tr';
      this.localeChange.emit(this.locale);
      this.translate.use(this.locale);
      this.isAnimating = false;
    }, 200);
  }
  
  switchLanguage(lang: string) {
    this.locale = lang;
    this.localeChange.emit(lang);
    this.translate.use(lang);
  }

  openAppointmentModal() {
    this.isAppointmentModalOpen = true;
    // Close mobile menu if open
    this.isMobileMenuOpen = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeAppointmentModal() {
    this.isAppointmentModalOpen = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}