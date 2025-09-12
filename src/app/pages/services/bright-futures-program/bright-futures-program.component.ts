import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';
import { CtaSectionComponent } from '../../../components/cta-section/cta-section.component';

@Component({
  selector: 'app-bright-futures-program',
  standalone: true,
  imports: [CommonModule, RouterLink, HeroSectionComponent, CtaSectionComponent],
  templateUrl: './bright-futures-program.component.html',
  styleUrl: './bright-futures-program.component.css'
})
export class BrightFuturesProgramComponent {
  activePhase: string = 'bebek';

  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Hizmetlerimiz', link: '/hizmetlerimiz' },
    { label: 'Bright Futures Programı' }
  ];

  setActivePhase(phase: string): void {
    this.activePhase = phase;
  }
}
