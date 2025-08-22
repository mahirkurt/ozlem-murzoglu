import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
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

  contactInfo = {
    phone: '+90 216 688 44 83',
    email: 'klinik@drmurzoglu.com',
    address: 'Ataşehir, İstanbul'
  };

  navigation = [
    {
      label: 'HAKKIMIZDA',
      href: '/hakkimizda'
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
      label: 'KLİNİĞİMİZ',
      href: '/klinigimiz'
    },
    {
      label: 'MAKALELER',
      href: '/makaleler'
    },
    {
      label: 'SAYGIYLA',
      href: '/saygiyla'
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
        { label: 'HOME', href: '/' },
        { label: 'ABOUT', href: '/hakkimizda' },
        { 
          label: 'SERVICES', 
          href: '/hizmetlerimiz',
          children: [
            { label: 'Comprehensive Child Examination', href: '/hizmetlerimiz/kapsamli-cocuk-muayenesi' },
            { label: 'Growth & Development Tracking', href: '/hizmetlerimiz/buyume-gelisim-takibi' },
            { label: 'Vaccination Services', href: '/hizmetlerimiz/asi-uygulamalari' },
            { label: 'Baby & Child Nutrition', href: '/hizmetlerimiz/bebek-cocuk-beslenmesi' },
            { label: 'Child Allergies', href: '/hizmetlerimiz/cocuk-alerjileri' },
            { label: 'Chronic Disease Management', href: '/hizmetlerimiz/kronik-hastalik-yonetimi' }
          ]
        },
        { label: 'BLOG', href: '/blog' },
        { label: 'FAQ', href: '/sss' },
        { label: 'CONTACT', href: '/iletisim' }
      ];
    } else {
      this.navigation = [
        { label: 'ANA SAYFA', href: '/' },
        { label: 'HAKKIMIZDA', href: '/hakkimizda' },
        { 
          label: 'H\u0130ZMETLER\u0130M\u0130Z', 
          href: '/hizmetlerimiz',
          children: [
            { label: 'Kapsaml\u0131 \u00c7ocuk Muayenesi', href: '/hizmetlerimiz/kapsamli-cocuk-muayenesi' },
            { label: 'B\u00fcy\u00fcme ve Geli\u015fim Takibi', href: '/hizmetlerimiz/buyume-gelisim-takibi' },
            { label: 'A\u015f\u0131 Uygulamalar\u0131', href: '/hizmetlerimiz/asi-uygulamalari' },
            { label: 'Bebek ve \u00c7ocuk Beslenmesi', href: '/hizmetlerimiz/bebek-cocuk-beslenmesi' },
            { label: '\u00c7ocuk Alerjileri', href: '/hizmetlerimiz/cocuk-alerjileri' },
            { label: 'Kronik Hastal\u0131k Y\u00f6netimi', href: '/hizmetlerimiz/kronik-hastalik-yonetimi' }
          ]
        },
        { label: 'BLOG', href: '/blog' },
        { label: 'S.S.S', href: '/sss' },
        { label: '\u0130LET\u0130\u015e\u0130M', href: '/iletisim' }
      ];
    }
  }
}