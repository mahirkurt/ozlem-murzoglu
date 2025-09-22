import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-saglikli-uykular',
  standalone: true,
  imports: [RouterLink, TranslateModule, CommonModule, HeroSectionComponent],
  templateUrl: './saglikli-uykular.component.html',
  styleUrl: './saglikli-uykular.component.css'
})
export class SaglikliUykularComponent {

}
