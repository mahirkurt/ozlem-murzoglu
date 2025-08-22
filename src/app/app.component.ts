import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { Footer } from './components/footer/footer';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor';
import { FloatingActionsComponent } from './components/floating-actions/floating-actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer, FloatingActionsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Dr. Özlem Murzoğlu | Çocuk Sağlığı ve Hastalıkları Uzmanı';
  locale = 'tr';
  
  onLocaleChange(newLocale: string) {
    this.locale = newLocale;
    // Dil değişikliğini tüm uygulamaya yay
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  }
  
  ngOnInit() {
    // Kaydedilmiş dili yükle
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale');
      if (savedLocale) {
        this.locale = savedLocale;
      }
    }
  }
}
