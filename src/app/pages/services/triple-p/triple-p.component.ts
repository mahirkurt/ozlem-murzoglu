import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-triple-p',
  standalone: true,
  imports: [RouterLink, TranslateModule, CommonModule, HeroSectionComponent],
  templateUrl: './triple-p.component.html',
  styleUrl: './triple-p.component.css'
})
export class TriplePComponent {

}
