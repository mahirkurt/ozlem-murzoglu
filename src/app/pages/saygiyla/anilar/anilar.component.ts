import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../shared/components/hero-section/hero-section.component';

@Component({
  selector: 'app-anilar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './anilar.component.html',
  styleUrls: ['./anilar.component.css']
})
export class AnilarComponent {
  breadcrumbs = [
    { labelKey: 'HEADER.NAV_HOME', route: '/' },
    { labelKey: 'HEADER.NAV_RESPECT', route: '/saygiyla' },
    { labelKey: 'HEADER.NAV_MEMORIES', route: '/saygiyla/anilar' }
  ];
}