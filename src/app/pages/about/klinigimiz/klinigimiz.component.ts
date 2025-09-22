import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-klinigimiz',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './klinigimiz.component.html',
  styleUrl: './klinigimiz.component.css',
})
export class KlinigimizComponent implements OnInit {
  private translate = inject(TranslateService);
  locale = 'tr';

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_ABOUT', link: '/hakkimizda' },
    { label: 'HEADER.NAV_CLINIC' }
  ];

  constructor() {
    this.translate.onLangChange.subscribe((event) => {
      this.locale = event.lang;
    });
  }

  ngOnInit() {
    // Dil ayarını kontrol et ve çevirileri yükle
    const currentLang = this.translate.currentLang || this.translate.defaultLang || 'tr';
    this.translate.use(currentLang).subscribe();
  }
}
