import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { Footer } from './components/footer/footer';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor';
import { FloatingActionsComponent } from './components/floating-actions/floating-actions';
import { WhatsAppButtonComponent } from './components/whatsapp-button/whatsapp-button';
import { ThemeService } from './services/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer, FloatingActionsComponent, WhatsAppButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '';
  locale = 'tr';
  
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
      } else {
        const browserLang = this.translate.getBrowserLang();
        const langToUse = browserLang?.match(/en|tr/) ? browserLang : 'tr';
        this.translate.use(langToUse);
        this.locale = langToUse;
      }
    }
  }
  
  onLocaleChange(newLocale: string) {
    this.locale = newLocale;
    this.translate.use(newLocale);
    // Save language preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', newLocale);
    }
  }
  
  ngOnInit() {
    // Set page title based on language
    this.translate.get('COMMON.PAGE_TITLE').subscribe((title: string) => {
      this.title = title;
      if (typeof document !== 'undefined') {
        document.title = title;
      }
    });
    
    // Update title when language changes
    this.translate.onLangChange.subscribe(() => {
      this.translate.get('COMMON.PAGE_TITLE').subscribe((title: string) => {
        this.title = title;
        if (typeof document !== 'undefined') {
          document.title = title;
        }
      });
    });
  }
}