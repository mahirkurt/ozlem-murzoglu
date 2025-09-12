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
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Hakkımızda', link: '/hakkimizda' },
    { label: 'Klinik Tasarımı' }
  ];
}
