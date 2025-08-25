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
      titleKey: 'APPROACH.TITLE',
      descriptionKey: 'APPROACH.COMPREHENSIVE_DESC',
      icon: 'check_circle',
      href: '/hakkimizda',
      color: 'primary'
    },
    {
      titleKey: 'SERVICES.SECTION_TITLE',
      descriptionKey: 'SERVICES.SUBTITLE',
      icon: 'medical_services',
      href: '/hizmetlerimiz',
      color: 'secondary'
    },
    {
      titleKey: 'APPOINTMENT.TITLE',
      descriptionKey: 'APPOINTMENT.SUBTITLE',
      icon: 'calendar_today',
      href: '/iletisim',
      color: 'tertiary'
    }
  ];

  ngOnInit() {
    // Component will automatically update when language changes
  }
}
