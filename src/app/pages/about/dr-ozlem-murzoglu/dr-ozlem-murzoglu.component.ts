import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-dr-ozlem-murzoglu',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, HeroSectionComponent],
  templateUrl: './dr-ozlem-murzoglu.component.html',
  styleUrl: './dr-ozlem-murzoglu.component.css'
})
export class DrOzlemMurzogluComponent {
  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_ABOUT', link: '/hakkimizda' },
    { label: 'COMMON.DOCTOR_NAME' }
  ];
}
