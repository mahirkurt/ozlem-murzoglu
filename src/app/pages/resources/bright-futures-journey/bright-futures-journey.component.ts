import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bright-futures-journey',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bright-futures-journey.component.html',
  styleUrl: './bright-futures-journey.component.css'
})
export class BrightFuturesJourneyComponent {
  activePhase: string = 'bebek';

  setActivePhase(phase: string): void {
    this.activePhase = phase;
  }
}
