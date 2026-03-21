import { Component, inject, OnInit } from '@angular/core';
import { LiquidHeroComponent } from '../../components/liquid-hero/liquid-hero';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { DoctorBioComponent } from '../../components/doctor-bio/doctor-bio';
import { ContactCtaComponent } from '../../components/contact-cta/contact-cta.component';
import { WhySocialPediatricsComponent } from '../../components/why-social-pediatrics/why-social-pediatrics.component';
import { GoogleBusinessReviewsComponent } from '../../components/google-business-reviews/google-business-reviews.component';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LiquidHeroComponent,
    ServicesSectionComponent,
    ScrollRevealDirective,
    DoctorBioComponent,
    ContactCtaComponent,
    WhySocialPediatricsComponent,
    GoogleBusinessReviewsComponent,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPageSeo('home');
  }
}
