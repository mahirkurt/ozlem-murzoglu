import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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
  
  isMobileMenuOpen = false;
  isScrolled = false;
  activeDropdown: string | null = null;
  isAnimating = false;

  contactInfo = {
    phone: '+90 222 237 84 00',
    email: 'info@ozlemmurzoglu.com'
  };

  navigation = [
    {
      label: 'Ana Sayfa',
      href: '/'
    },
    {
      label: 'Hakkımızda',
      href: '/hakkimizda'
    },
    {
      label: 'Hizmetlerimiz',
      href: '/hizmetlerimiz',
      children: [
        { label: 'Kapsamlı Çocuk Muayenesi', href: '/hizmetlerimiz/kapsamli-cocuk-muayenesi' },
        { label: 'Büyüme ve Gelişim Takibi', href: '/hizmetlerimiz/buyume-gelisim-takibi' },
        { label: 'Aşı Uygulamaları', href: '/hizmetlerimiz/asi-uygulamalari' },
        { label: 'Bebek ve Çocuk Beslenmesi', href: '/hizmetlerimiz/bebek-cocuk-beslenmesi' },
        { label: 'Çocuk Alerjileri', href: '/hizmetlerimiz/cocuk-alerjileri' },
        { label: 'Kronik Hastalık Yönetimi', href: '/hizmetlerimiz/kronik-hastalik-yonetimi' }
      ]
    },
    {
      label: 'Blog',
      href: '/blog'
    },
    {
      label: 'S.S.S',
      href: '/sss'
    },
    {
      label: 'İletişim',
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
      this.isAnimating = false;
    }, 200);
  }
}