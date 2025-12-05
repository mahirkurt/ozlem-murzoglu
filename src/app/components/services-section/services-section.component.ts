import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface Service {
  key: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: 'primary' | 'secondary' | 'tertiary';
  href: string;
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.scss'
})
export class ServicesSectionComponent {
  @Input() locale: string = 'tr';

  services: Service[] = [
    {
      key: 'bright-futures',
      titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.TITLE',
      descriptionKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.DESC',
      icon: 'child_care',
      color: 'primary',
      href: '/hizmetlerimiz/bright-futures-program'
    },
    {
      key: 'triple-p',
      titleKey: 'SERVICES.SERVICE_TRIPLE_P.TITLE',
      descriptionKey: 'SERVICES.SERVICE_TRIPLE_P.DESC',
      icon: 'family_restroom',
      color: 'secondary',
      href: '/hizmetlerimiz/triple-p'
    },
    {
      key: 'sleep',
      titleKey: 'SERVICES.SERVICE_SLEEP.TITLE',
      descriptionKey: 'SERVICES.SERVICE_SLEEP.DESC',
      icon: 'bedtime',
      color: 'tertiary',
      href: '/hizmetlerimiz/saglikli-uykular'
    },
    {
      key: 'lab',
      titleKey: 'SERVICES.SERVICE_LAB.TITLE',
      descriptionKey: 'SERVICES.SERVICE_LAB.DESC',
      icon: 'biotech',
      color: 'primary',
      href: '/hizmetlerimiz/laboratuvar-goruntuleme'
    },
    {
      key: 'vaccination',
      titleKey: 'SERVICES.SERVICE_VACCINATION.TITLE',
      descriptionKey: 'SERVICES.SERVICE_VACCINATION.DESC',
      icon: 'vaccines',
      color: 'secondary',
      href: '/hizmetlerimiz/asi-takibi'
    },
    {
      key: 'development',
      titleKey: 'SERVICES.SERVICE_DEVELOPMENT.TITLE',
      descriptionKey: 'SERVICES.SERVICE_DEVELOPMENT.DESC',
      icon: 'trending_up',
      color: 'tertiary',
      href: '/hizmetlerimiz/gelisim-degerlendirmesi'
    }
  ];
}