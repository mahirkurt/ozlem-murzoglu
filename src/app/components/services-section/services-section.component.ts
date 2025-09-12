import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.css'
})
export class ServicesSectionComponent {
  @Input() locale: string = 'tr';

  services: Service[] = [
    {
      key: 'bright-futures',
      title: 'Bright Futures Program',
      description: 'Çocukların sağlıklı gelişimi için kapsamlı izlem ve değerlendirme programı.',
      icon: 'child_care',
      color: 'primary',
      href: '/hizmetlerimiz/bright-futures-program'
    },
    {
      key: 'triple-p',
      title: 'Triple P',
      description: 'Ebeveynler için pozitif çocuk yetiştirme teknikleri ve aile danışmanlığı.',
      icon: 'family_restroom',
      color: 'secondary',
      href: '/hizmetlerimiz/triple-p'
    },
    {
      key: 'sleep',
      title: 'Sağlıklı Uykular',
      description: 'Bebek ve çocukların uyku problemleri için uzman danışmanlık hizmeti.',
      icon: 'bedtime',
      color: 'tertiary',
      href: '/hizmetlerimiz/saglikli-uykular'
    },
    {
      key: 'sos-feeding',
      title: 'SOS Feeding',
      description: 'Bebek ve çocuklarda beslenme sorunları için özel terapi programı.',
      icon: 'restaurant',
      color: 'primary',
      href: '/hizmetlerimiz/sos-feeding'
    },
    {
      key: 'lab',
      title: 'Laboratuvar ve Görüntüleme',
      description: 'Kapsamlı laboratuvar testleri ve görüntüleme hizmetleri.',
      icon: 'biotech',
      color: 'secondary',
      href: '/hizmetlerimiz/laboratuvar-goruntuleme'
    },
    {
      key: 'vaccination',
      title: 'Aşı Takibi',
      description: 'Güncel aşı takvimi ile çocuğunuzun aşı programını takip edin.',
      icon: 'vaccines',
      color: 'tertiary',
      href: '/hizmetlerimiz/asi-takibi'
    }
  ];
}