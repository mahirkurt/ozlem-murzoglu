import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../shared/components/hero-section/hero-section.component';

@Component({
  selector: 'app-tesekkurler',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './tesekkurler.component.html',
  styleUrls: ['./tesekkurler.component.css']
})
export class TesekkurlerComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', route: '/' },
    { label: 'Saygıyla', route: '/saygiyla' },
    { label: 'Teşekkürler', route: '/saygiyla/tesekkurler' }
  ];
}