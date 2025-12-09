import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LiquidHeroComponent } from '../../components/liquid-hero/liquid-hero';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { DoctorBioComponent } from '../../components/doctor-bio/doctor-bio';
import { ContactCtaComponent } from '../../components/contact-cta/contact-cta.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateModule,
    LiquidHeroComponent, 
    ServicesSectionComponent,
    ScrollRevealDirective,
    DoctorBioComponent,
    ContactCtaComponent,

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private translate = inject(TranslateService);
  locale = 'tr';
  
  constructor() {
    this.translate.onLangChange.subscribe((event) => {
      this.locale = event.lang;
    });
  }
}
