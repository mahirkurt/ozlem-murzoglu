import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { HeaderComponent } from './components/header/header.component';
import { Footer } from './components/footer/footer';
import { FloatingActionsComponent } from './components/floating-actions/floating-actions';
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
  imports: [RouterOutlet, HeaderComponent, Footer, FloatingActionsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeAnimations]
})
export class AppComponent {
  title = '';
  locale = 'tr';

  @ViewChild(RouterOutlet) outlet?: RouterOutlet;

  // Services
  private readonly theme = inject(ThemeService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  
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

    this.title = this.translate.instant('META.TITLE');
  }
  
  onLocaleChange(newLocale: string) {
    this.locale = newLocale;
    this.translate.use(newLocale);
    this.updateDocumentLang(newLocale);
    this.title = this.translate.instant('META.TITLE');
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

  get isNonHomeRoute(): boolean {
    return this.routePath !== '/';
  }

  get routeExpressionLevel(): 'minimum' | 'moderate' {
    const path = this.routePath;

    if (
      path.startsWith('/legal') ||
      path === '/kaynaklar' ||
      path.startsWith('/kaynaklar/') ||
      /^\/blog\/[^/]+/.test(path)
    ) {
      return 'minimum';
    }

    return 'moderate';
  }

  private get routePath(): string {
    const rawUrl = this.router.url || '/';
    const sanitized = rawUrl.split('#')[0].split('?')[0] || '/';
    if (sanitized !== '/' && sanitized.endsWith('/')) {
      return sanitized.slice(0, -1);
    }
    return sanitized;
  }

  private updateDocumentLang(locale: string) {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }
}
