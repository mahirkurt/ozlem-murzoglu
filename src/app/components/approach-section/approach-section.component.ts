import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface ApproachItem {
  titleKey: string;
  descriptionKey: string;
  icon: string;
  href: string;
  color: 'primary' | 'secondary' | 'tertiary';
}

@Component({
  selector: 'app-approach-section',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './approach-section.component.html',
  styleUrl: './approach-section.component.css'
})
export class ApproachSectionComponent implements OnInit {
  private translate = inject(TranslateService);
  
  approaches: ApproachItem[] = [
    {
      titleKey: 'APPROACH.DEVELOPMENT_TITLE',
      descriptionKey: 'APPROACH.DEVELOPMENT_DESC',
      icon: 'trending_up',
      href: '/hizmetlerimiz/gelisim-takibi',
      color: 'primary'
    },
    {
      titleKey: 'APPROACH.FAMILY_EDUCATION_TITLE',
      descriptionKey: 'APPROACH.FAMILY_EDUCATION_DESC',
      icon: 'family_restroom',
      href: '/hizmetlerimiz/triple-p',
      color: 'secondary'
    },
    {
      titleKey: 'APPROACH.SLEEP_NUTRITION_TITLE',
      descriptionKey: 'APPROACH.SLEEP_NUTRITION_DESC',
      icon: 'restaurant_menu',
      href: '/hizmetlerimiz',
      color: 'tertiary'
    }
  ];

  ngOnInit() {
    // Component will automatically update when language changes
  }
}
