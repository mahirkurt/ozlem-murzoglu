import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';
import { ContactCtaComponent } from '../../../components/contact-cta/contact-cta.component';

@Component({
  selector: 'app-bright-futures-program',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, HeroSectionComponent, ContactCtaComponent],
  templateUrl: './bright-futures-program.component.html',
  styleUrl: './bright-futures-program.component.css'
})
export class BrightFuturesProgramComponent {
  activePhase: string = 'bebek';

  setActivePhase(phase: string): void {
    this.activePhase = phase;
  }
}
