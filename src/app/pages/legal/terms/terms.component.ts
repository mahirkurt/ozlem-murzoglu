import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';
import { CONTACT_CONFIG } from '../../../config/contact.config';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {
  readonly contactInfo = {
    address: CONTACT_CONFIG.address.fullDisplay,
    phoneDisplay: CONTACT_CONFIG.phone.display,
    phoneHref: CONTACT_CONFIG.phone.telHref,
    email: CONTACT_CONFIG.email.value,
    emailHref: CONTACT_CONFIG.email.mailtoHref,
  };
  
  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'LEGAL.TERMS_TITLE' }
  ];

  lastUpdated = '01.01.2025';
}
