import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentModalComponent } from '../appointment-modal/appointment-modal.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { CONTACT_CONFIG, CONTACT_HELPERS } from '../../config/contact.config';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AppointmentModalComponent, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() locale: string = 'tr';
  @Output() localeChange = new EventEmitter<string>();
  
  private translate = inject(TranslateService);
  private themeService = inject(ThemeService);
  private el = inject(ElementRef);

  isMobileMenuOpen = false;
  private focusTrapCleanup: (() => void) | null = null;
  isScrolled = false;
  activeDropdown: string | null = null;
  isAnimating = false;
  isAppointmentModalOpen = false;

  contactInfo = {
    phone: CONTACT_CONFIG.phone.display,
    phoneHref: CONTACT_CONFIG.phone.telHref,
    email: CONTACT_CONFIG.email.value,
    address: CONTACT_CONFIG.address.shortDisplay,
    whatsappUrl: CONTACT_HELPERS.getWhatsAppApiUrl(),
  };

  navigation: any[] = [
    {
      labelKey: 'HEADER.NAV_ABOUT',
      href: '/hakkimizda',
      children: [
        { labelKey: 'HEADER.NAV_DR_OZLEM', href: '/hakkimizda/dr-ozlem-murzoglu' },
        { labelKey: 'HEADER.NAV_CLINIC', href: '/hakkimizda/klinigimiz' },
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
        { labelKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.TITLE', href: '/hizmetlerimiz/bright-futures-program' },
        { labelKey: 'SERVICES.SERVICE_SOS_FEEDING.TITLE', href: '/hizmetlerimiz/sos-feeding' }
      ]
    },
    {
      labelKey: 'HEADER.NAV_INFO_CENTER',
      href: '/kaynaklar',
      children: [
        { labelKey: 'RESOURCES.ALL_RESOURCES', href: '/kaynaklar' },
        { labelKey: 'RESOURCES.CATEGORIES.VACCINES', href: '/kaynaklar/asilar' },
        { labelKey: 'RESOURCES.CATEGORIES.DEVELOPMENT', href: '/kaynaklar/gelisim-rehberleri' },
        { labelKey: 'RESOURCES.CATEGORIES.GENERAL_INFO', href: '/kaynaklar/genel-bilgiler' },
        { labelKey: 'RESOURCES.CATEGORIES.MEDIA_PLAN', href: '/kaynaklar/aile-medya-plani' }
      ]
    },
    {
      labelKey: 'HEADER.NAV_RESPECT',
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
    this.deactivateFocusTrap();
  }

  handleScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';

      if (this.isMobileMenuOpen) {
        this.activateFocusTrap();
      } else {
        this.deactivateFocusTrap();
      }
    }
  }

  private activateFocusTrap() {
    const menu = this.el.nativeElement.querySelector('.mobile-menu');
    if (!menu) return;

    // Focus the close button after menu opens
    requestAnimationFrame(() => {
      const closeBtn = menu.querySelector('.mobile-menu-close') as HTMLElement;
      closeBtn?.focus();
    });

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.toggleMobileMenu();
        // Return focus to the toggle button
        const toggleBtn = this.el.nativeElement.querySelector('.island-mobile-toggle') as HTMLElement;
        toggleBtn?.focus();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusableEls = menu.querySelectorAll(
        'a[href]:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      if (focusableEls.length === 0) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeydown);
    this.focusTrapCleanup = () => document.removeEventListener('keydown', onKeydown);
  }

  private deactivateFocusTrap() {
    this.focusTrapCleanup?.();
    this.focusTrapCleanup = null;
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
