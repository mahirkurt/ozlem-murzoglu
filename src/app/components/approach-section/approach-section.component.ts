import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ApproachItem {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: 'primary' | 'secondary' | 'tertiary';
}

@Component({
  selector: 'app-approach-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './approach-section.component.html',
  styleUrl: './approach-section.component.css'
})
export class ApproachSectionComponent {
  approaches: ApproachItem[] = [
    {
      title: 'Yaklaşımımız',
      description: 'Bütüncül pediatri yaklaşımıyla çocuğunuzun fiziksel, duygusal ve sosyal gelişimini destekliyoruz.',
      icon: 'check_circle',
      href: '/yaklasimimiz',
      color: 'primary'
    },
    {
      title: 'Hizmetlerimiz',
      description: 'Bright Futures programından Triple P ebeveynlik desteğine kadar kapsamlı pediatri hizmetleri.',
      icon: 'medical_services',
      href: '/hizmetlerimiz',
      color: 'secondary'
    },
    {
      title: 'Randevu',
      description: 'Online randevu sistemiyle kolayca randevu alın, zamanınızı verimli kullanın.',
      icon: 'calendar_today',
      href: '/randevu',
      color: 'tertiary'
    }
  ];
}
