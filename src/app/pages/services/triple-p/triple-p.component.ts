import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-triple-p',
  standalone: true,
  imports: [RouterLink, HeroSectionComponent],
  templateUrl: './triple-p.component.html',
  styleUrl: './triple-p.component.css'
})
export class TriplePComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Hizmetlerimiz', link: '/hizmetlerimiz' },
    { label: 'Triple P Programı' }
  ];
}
