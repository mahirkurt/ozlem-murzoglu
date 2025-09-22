import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-laboratuvar-goruntuleme',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, HeroSectionComponent],
  templateUrl: './laboratuvar-goruntuleme.component.html',
  styleUrl: './laboratuvar-goruntuleme.component.css'
})
export class LaboratuvarGoruntulemeComponent {
  private translate = inject(TranslateService);
}
