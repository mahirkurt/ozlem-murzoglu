import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { IllustrationComponent } from '../../shared/components/illustration/illustration.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollRevealDirective, IllustrationComponent],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {

}
