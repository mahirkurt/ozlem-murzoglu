import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ScrollRevealDirective, HeroSectionComponent],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {
  private translate = inject(TranslateService);
  
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Hakkımızda' }
  ];
}
