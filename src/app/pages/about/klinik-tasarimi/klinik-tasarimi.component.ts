import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-klinik-tasarimi',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslateModule, HeroSectionComponent],
  templateUrl: './klinik-tasarimi.component.html',
  styleUrl: './klinik-tasarimi.component.css'
})
export class KlinikTasarimiComponent {
  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_ABOUT', link: '/hakkimizda' },
    { label: 'KLINIK_TASARIMI.TITLE' }
  ];
}
