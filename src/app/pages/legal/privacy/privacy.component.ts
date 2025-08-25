import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {
  private translate = inject(TranslateService);
  
  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'LEGAL.PRIVACY_TITLE' }
  ];

  lastUpdated = '01.01.2025';
}