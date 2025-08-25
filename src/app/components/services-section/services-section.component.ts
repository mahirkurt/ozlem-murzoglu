import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Service {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'secondary' | 'tertiary';
  href: string;
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.css'
})
export class ServicesSectionComponent {
  @Input() locale: string = 'tr';

  services: Service[] = [
    {
      key: 'bright-futures',
      title: 'Bright Futures®',
      description: 'Amerikan Pediatri Akademisi Sağlıklı Çocuk İzlemi',
      icon: 'child_care',
      color: 'primary',
      href: '/hizmetlerimiz/bright-futures-program'
    },
    {
      key: 'triple-p',
      title: 'Triple P® Programı',
      description: 'Olumlu Ebeveynlik Programı - Queensland Üniversitesi lisanslı',
      icon: 'family_restroom',
      color: 'secondary',
      href: '/hizmetlerimiz/triple-p'
    },
    {
      key: 'sleep',
      title: 'Sağlıklı Uykular™',
      description: 'Uyku Eğitimi ve Danışmanlığı Programı',
      icon: 'bedtime',
      color: 'tertiary',
      href: '/hizmetlerimiz/saglikli-uykular'
    },
    {
      key: 'lab',
      title: 'Laboratuvar ve Görüntüleme',
      description: 'Biruni Lab ve Sonomed Görüntüleme ortaklığı',
      icon: 'biotech',
      color: 'primary',
      href: '/hizmetlerimiz/laboratuvar-goruntuleme'
    },
    {
      key: 'vaccination',
      title: 'Aşı Takibi',
      description: 'Ulusal ve özel aşı uygulamaları',
      icon: 'vaccines',
      color: 'secondary',
      href: '/hizmetlerimiz/asi-takibi'
    },
    {
      key: 'development',
      title: 'Gelişim Değerlendirmesi',
      description: 'Sosyal pediatri yaklaşımıyla gelişim takibi',
      icon: 'trending_up',
      color: 'tertiary',
      href: '/hizmetlerimiz/gelisim-degerlendirmesi'
    }
  ];
}