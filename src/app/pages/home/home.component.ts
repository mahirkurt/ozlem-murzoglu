import { Component } from '@angular/core';
import { LiquidHeroComponent } from '../../components/liquid-hero/liquid-hero';
import { ApproachSectionComponent } from '../../components/approach-section/approach-section.component';
import { BlogSectionComponent } from '../../components/blog-section/blog-section.component';
import { TestimonialSectionComponent } from '../../components/testimonial-section/testimonial-section.component';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { ClinicGalleryComponent } from '../../components/clinic-gallery/clinic-gallery';
import { DoctorBioComponent } from '../../components/doctor-bio/doctor-bio';
import { AppointmentSectionComponent } from '../../components/appointment-section/appointment-section.component';
import { AppointmentWidgetComponent } from '../../components/appointment-widget/appointment-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LiquidHeroComponent, 
    ApproachSectionComponent, 
    BlogSectionComponent,
    TestimonialSectionComponent,
    ServicesSectionComponent,
    ScrollRevealDirective,
    ClinicGalleryComponent,
    DoctorBioComponent,
    AppointmentSectionComponent,
    AppointmentWidgetComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  locale = 'tr';
}
