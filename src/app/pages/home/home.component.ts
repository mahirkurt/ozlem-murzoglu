import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LiquidHeroComponent } from '../../components/liquid-hero/liquid-hero';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { DoctorBioComponent } from '../../components/doctor-bio/doctor-bio';
import { ContactCtaComponent } from '../../components/contact-cta/contact-cta.component';
import { SeoService } from '../../services/seo.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateModule,
    LiquidHeroComponent,
    ServicesSectionComponent,
    ScrollRevealDirective,
    DoctorBioComponent,
    ContactCtaComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private translate = inject(TranslateService);
  private seo = inject(SeoService);
  locale = 'tr';

  constructor() {
    this.translate.onLangChange.subscribe((event) => {
      this.locale = event.lang;
    });
  }

  ngOnInit(): void {
    this.seo.updateTags({
      title: 'Ataşehir Çocuk Doktoru - Dr. Özlem Murzoğlu | Çocuk Sağlığı ve Hastalıkları Uzmanı',
      description: "Ataşehir çocuk doktoru Dr. Özlem Murzoğlu - İstanbul Ataşehir'de çocuk sağlığı ve hastalıkları uzmanı. Bebek ve çocuk sağlığı, aşılama, gelişim takibi, Bright Futures, Triple P. Randevu: 0216 688 44 83",
      keywords: 'ataşehir çocuk doktoru, çocuk doktoru ataşehir, istanbul çocuk doktoru, pediatri uzmanı ataşehir, Dr. Özlem Murzoğlu, bebek doktoru ataşehir, çocuk hastalıkları uzmanı',
      url: 'https://ozlemmurzoglu.com/',
    });
  }
}
