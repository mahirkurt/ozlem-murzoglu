import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-saglikli-uykular',
  standalone: true,
  imports: [RouterLink, HeroSectionComponent],
  templateUrl: './saglikli-uykular.component.html',
  styleUrl: './saglikli-uykular.component.css'
})
export class SaglikliUykularComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Hizmetlerimiz', link: '/hizmetlerimiz' },
    { label: 'Sağlıklı Uykular Programı' }
  ];
}
