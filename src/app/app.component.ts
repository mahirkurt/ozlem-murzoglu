import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { HeaderComponent } from './components/header/header.component';
import { Footer } from './components/footer/footer';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor';
import { FloatingActionsComponent } from './components/floating-actions/floating-actions';
import { WhatsAppButtonComponent } from './components/whatsapp-button/whatsapp-button';
import { ThemeService } from './services/theme.service';
import { TranslateService } from '@ngx-translate/core';

export const routeAnimations = trigger('routeAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(8px)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('150ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('200ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true }),
    ])
  ])
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer, FloatingActionsComponent, WhatsAppButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeAnimations]
})
export class AppComponent {
  title = 'Dr. Özlem Murzoğlu | Çocuk Sağlığı ve Hastalıkları Uzmanı';
  locale = 'tr';

  @ViewChild(RouterOutlet) outlet?: RouterOutlet;

  // Services
  private readonly theme = inject(ThemeService);
  private readonly translate = inject(TranslateService);
  
  constructor() {
    // Set default language
    this.translate.setDefaultLang('tr');
    
    // Get browser language or saved preference
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('selectedLanguage');
      if (savedLang) {
        this.translate.use(savedLang);
        this.locale = savedLang;
        this.updateDocumentLang(savedLang);
      } else {
        const browserLang = this.translate.getBrowserLang();
        const langToUse = browserLang?.match(/en|tr/) ? browserLang : 'tr';
        this.translate.use(langToUse);
        this.locale = langToUse;
        this.updateDocumentLang(langToUse);
      }
    }
  }
  
  onLocaleChange(newLocale: string) {
    this.locale = newLocale;
    this.translate.use(newLocale);
    this.updateDocumentLang(newLocale);
    // Save language preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', newLocale);
    }
  }
  
  getRouteAnimationData() {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return null;
    }
    return this.outlet?.activatedRouteData?.['animation'];
  }

  ngOnInit() {
    // Language initialization is handled in constructor
  }

  private updateDocumentLang(locale: string) {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }
}
