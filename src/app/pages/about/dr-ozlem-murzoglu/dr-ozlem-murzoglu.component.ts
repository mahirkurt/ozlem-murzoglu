import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContactCtaComponent } from '../../../components/contact-cta/contact-cta.component';
import { HeroSectionComponent, HeroBreadcrumb } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-dr-ozlem-murzoglu',
  standalone: true,
  imports: [CommonModule, TranslateModule, HeroSectionComponent, ContactCtaComponent],
  templateUrl: './dr-ozlem-murzoglu.component.html',
  styleUrl: './dr-ozlem-murzoglu.component.css'
})
export class DrOzlemMurzogluComponent {
  breadcrumbs: HeroBreadcrumb[] = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_ABOUT', link: '/hakkimizda' },
    { label: 'COMMON.DOCTOR_NAME' }
  ];
}
