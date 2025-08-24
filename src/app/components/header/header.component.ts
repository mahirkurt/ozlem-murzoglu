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
        { labelKey: 'HEADER.NAV_CLINIC_DESIGN', href: '/hakkimizda/klinik-tasarimi' }
      ]
    },
    {
      labelKey: 'HEADER.NAV_SERVICES',
      href: '/hizmetlerimiz',
      children: [
        { label: 'Sağlıklı Çocuk İzlemi', href: '/hizmetlerimiz/saglikli-cocuk-izlemi' },
        { label: 'Aşılama', href: '/hizmetlerimiz/asilama' },
        { label: 'Bebek Beslenmesi', href: '/hizmetlerimiz/bebek-beslenmesi' },
        { label: 'Büyüme ve Gelişim', href: '/hizmetlerimiz/buyume-gelisim' },
        { label: 'Çocuk Alerjileri', href: '/hizmetlerimiz/alerji' },
        { label: 'Online Konsültasyon', href: '/hizmetlerimiz/online-konsultasyon' }
      ]
    },
    {
      labelKey: 'HEADER.NAV_RESOURCES',
      href: '/kaynaklar',
      children: [
        { label: 'Tüm Kaynaklar', href: '/kaynaklar' },
        { label: 'Aşı Bilgileri', href: '/kaynaklar/asilar' },
        { label: 'Bright Futures - Aile', href: '/kaynaklar/bright-futures-aile' },
        { label: 'Bright Futures - Çocuk', href: '/kaynaklar/bright-futures-cocuk' },
        { label: 'Gelişim Rehberleri', href: '/kaynaklar/gelisim-rehberleri' },
        { label: 'Genel Bilgiler', href: '/kaynaklar/genel-bilgiler' },
        { label: 'Büyüme Eğrileri', href: '/kaynaklar/cdc-buyume-egrileri' },
        { label: 'Aile Medya Planı', href: '/kaynaklar/aile-medya-plani' }
      ]
    },
    {
      labelKey: 'HEADER.NAV_BLOG',
      href: '/blog',
      children: [
        { label: 'Tüm Makaleler', href: '/blog' },
        { label: 'Bebek Bakımı', href: '/blog?category=Bebek%20Bakımı' },
        { label: 'Çocuk Gelişimi', href: '/blog?category=Çocuk%20Gelişimi' },
        { label: 'Çocuk Psikolojisi', href: '/blog?category=Çocuk%20Psikolojisi' },
        { label: 'Diş Sağlığı', href: '/blog?category=Diş%20Sağlığı' },
        { label: 'Ergenlik', href: '/blog?category=Ergenlik' },
        { label: 'Güvenlik', href: '/blog?category=Güvenlik' }
      ]
    },
    {
      label: 'SAYGIYLA',
      href: '/saygiyla'
    },
    {
      labelKey: 'HEADER.NAV_FAQ',
      href: '/sss'
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