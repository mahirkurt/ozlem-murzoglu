import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {
  private translate = inject(TranslateService);
  
  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'LEGAL.TERMS_TITLE' }
  ];

  lastUpdated = '01.01.2025';
}