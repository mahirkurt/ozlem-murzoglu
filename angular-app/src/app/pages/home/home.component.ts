import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { ApproachSectionComponent } from '../../components/approach-section/approach-section.component';
import { BlogSectionComponent } from '../../components/blog-section/blog-section.component';
import { TestimonialSectionComponent } from '../../components/testimonial-section/testimonial-section.component';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent, 
    ApproachSectionComponent, 
    BlogSectionComponent,
    TestimonialSectionComponent,
    ServicesSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  locale = 'tr';
}
