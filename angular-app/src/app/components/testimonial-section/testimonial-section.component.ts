import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonial-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial-section.component.html',
  styleUrl: './testimonial-section.component.css'
})
export class TestimonialSectionComponent {
  rating = 5;
  ratingArray = Array(5).fill(0);
  
  stats = [
    { number: '500+', label: 'Google Yorumu' },
    { number: '%98', label: 'Memnuniyet Oranı' },
    { number: '4.9', label: 'Ortalama Puan' }
  ];
}