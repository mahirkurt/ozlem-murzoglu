import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentModalComponent } from '../appointment-modal/appointment-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AppointmentModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() locale: string = 'tr';
  @Output() localeChange = new EventEmitter<string>();
  
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

  navigation = [
    {
      label: 'HAKKIMIZDA',
      href: '/hakkimizda',
      children: [
        { label: 'Hakkımızda', href: '/hakkimizda' },
        { label: 'Dr. Özlem Murzoğlu', href: '/hakkimizda/dr-ozlem-murzoglu' },
        { label: 'Klinik Tasarımı', href: '/hakkimizda/klinik-tasarimi' }
      ]
    },
    {
      label: 'HİZMETLERİMİZ',
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
      label: 'KAYNAKLAR',
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
      label: 'BLOG',
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
      label: 'S.S.S',
      href: '/sss'
    },
    {
      label: 'İLETİŞİM',
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
      this.updateNavigationLabels();
      this.isAnimating = false;
    }, 200);
  }
  
  updateNavigationLabels() {
    if (this.locale === 'en') {
      this.navigation = [
        { label: 'ABOUT', href: '/hakkimizda' },
        { 
          label: 'SERVICES', 
          href: '/hizmetlerimiz',
          children: [
            { label: 'Healthy Child Follow-up', href: '/hizmetlerimiz/saglikli-cocuk-izlemi' },
            { label: 'Vaccination', href: '/hizmetlerimiz/asilama' },
            { label: 'Baby Nutrition', href: '/hizmetlerimiz/bebek-beslenmesi' },
            { label: 'Growth & Development', href: '/hizmetlerimiz/buyume-gelisim' },
            { label: 'Child Allergies', href: '/hizmetlerimiz/alerji' },
            { label: 'Online Consultation', href: '/hizmetlerimiz/online-konsultasyon' }
          ]
        },
        {
          label: 'RESOURCES',
          href: '/kaynaklar',
          children: [
            { label: 'All Resources', href: '/kaynaklar' },
            { label: 'Vaccine Information', href: '/kaynaklar/asilar' },
            { label: 'Bright Futures - Family', href: '/kaynaklar/bright-futures-aile' },
            { label: 'Bright Futures - Child', href: '/kaynaklar/bright-futures-cocuk' },
            { label: 'Development Guides', href: '/kaynaklar/gelisim-rehberleri' },
            { label: 'General Information', href: '/kaynaklar/genel-bilgiler' },
            { label: 'Growth Charts', href: '/kaynaklar/cdc-buyume-egrileri' },
            { label: 'Family Media Plan', href: '/kaynaklar/aile-medya-plani' }
          ]
        },
        {
          label: 'BLOG',
          href: '/blog',
          children: [
            { label: 'All Articles', href: '/blog' },
            { label: 'Baby Care', href: '/blog?category=Bebek%20Bakımı' },
            { label: 'Child Development', href: '/blog?category=Çocuk%20Gelişimi' },
            { label: 'Child Psychology', href: '/blog?category=Çocuk%20Psikolojisi' },
            { label: 'Dental Health', href: '/blog?category=Diş%20Sağlığı' },
            { label: 'Adolescence', href: '/blog?category=Ergenlik' },
            { label: 'Safety', href: '/blog?category=Güvenlik' }
          ]
        },
        { label: 'RESPECT', href: '/saygiyla' },
        { label: 'FAQ', href: '/sss' },
        { label: 'CONTACT', href: '/iletisim' }
      ];
    } else {
      this.navigation = [
        { label: 'HAKKIMIZDA', href: '/hakkimizda' },
        { 
          label: 'HİZMETLERİMİZ', 
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
          label: 'KAYNAKLAR',
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
          label: 'BLOG',
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
        { label: 'SAYGIYLA', href: '/saygiyla' },
        { label: 'S.S.S', href: '/sss' },
        { label: 'İLETİŞİM', href: '/iletisim' }
      ];
    }
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