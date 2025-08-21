import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { ApproachSectionComponent } from '../../components/approach-section/approach-section.component';
import { BlogSectionComponent } from '../../components/blog-section/blog-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSectionComponent, ApproachSectionComponent, BlogSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  locale = 'tr';
}
