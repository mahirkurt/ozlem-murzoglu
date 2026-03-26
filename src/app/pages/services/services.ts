import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { IllustrationComponent } from '../../shared/components/illustration/illustration.component';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';
import { ContactCtaComponent } from '../../components/contact-cta/contact-cta.component';

interface Service {
  id: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  icon: string;
  logo?: string;
  featureKeys: string[];
  color: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ScrollRevealDirective, IllustrationComponent, HeroSectionComponent, ContactCtaComponent],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class ServicesComponent {
  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_SERVICES' }
  ];
  services: Service[] = [
    // Featured services (first 4 — program-specific colors)
    {
      id: 'bright-futures-program',
      titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.TITLE',
      subtitleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.HERO_SUBTITLE',
      descriptionKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.DESC',
      icon: 'star',
      logo: 'images/programs/Bright_Futures.svg',
      color: 'bright-futures',
      featureKeys: [
        'SERVICES.CARD_FEATURES.BRIGHT_FUTURES.PRE_VISIT_FORMS',
        'SERVICES.CARD_FEATURES.BRIGHT_FUTURES.MIN_ONE_HOUR_EXAM',
        'SERVICES.CARD_FEATURES.BRIGHT_FUTURES.AGE_SPECIFIC_GUIDANCE',
        'SERVICES.CARD_FEATURES.BRIGHT_FUTURES.DEVELOPMENTAL_SCREENING',
        'SERVICES.CARD_FEATURES.BRIGHT_FUTURES.FAMILY_CENTERED_CARE',
        'SERVICES.CARD_FEATURES.BRIGHT_FUTURES.EVIDENCE_BASED'
      ]
    },
    {
      id: 'triple-p',
      titleKey: 'SERVICES.SERVICE_TRIPLE_P.TITLE',
      subtitleKey: 'SERVICES.SERVICE_TRIPLE_P.HERO_SUBTITLE',
      descriptionKey: 'SERVICES.SERVICE_TRIPLE_P.DESC',
      icon: 'family_restroom',
      logo: 'images/programs/Triple_P.svg',
      color: 'triple-p',
      featureKeys: [
        'SERVICES.CARD_FEATURES.TRIPLE_P.YEARS_EXPERIENCE',
        'SERVICES.CARD_FEATURES.TRIPLE_P.MULTI_LANGUAGE',
        'SERVICES.CARD_FEATURES.TRIPLE_P.ACADEMIC_PUBLICATIONS',
        'SERVICES.CARD_FEATURES.TRIPLE_P.GROUP_TRAININGS',
        'SERVICES.CARD_FEATURES.TRIPLE_P.BEHAVIOR_MANAGEMENT',
        'SERVICES.CARD_FEATURES.TRIPLE_P.POSITIVE_DISCIPLINE'
      ]
    },
    {
      id: 'saglikli-uykular',
      titleKey: 'SERVICES.SERVICE_SLEEP.TITLE',
      subtitleKey: 'SERVICES.SERVICE_SLEEP.HERO_SUBTITLE',
      descriptionKey: 'SERVICES.SERVICE_SLEEP.DESC',
      icon: 'bedtime',
      logo: 'images/programs/saglikli_uykular.svg',
      color: 'sleep',
      featureKeys: [
        'SERVICES.CARD_FEATURES.SLEEP.PRE_ASSESSMENT',
        'SERVICES.CARD_FEATURES.SLEEP.PERSONAL_SLEEP_PLAN',
        'SERVICES.CARD_FEATURES.SLEEP.INTENSIVE_FOLLOWUP',
        'SERVICES.CARD_FEATURES.SLEEP.SLEEP_DIARY_SUPPORT',
        'SERVICES.CARD_FEATURES.SLEEP.WHATSAPP_SUPPORT_LINE',
        'SERVICES.CARD_FEATURES.SLEEP.POST_PROGRAM_FOLLOWUP'
      ]
    },
    {
      id: 'sos-feeding',
      titleKey: 'SERVICES.SERVICE_SOS_FEEDING.TITLE',
      subtitleKey: 'SERVICES.SERVICE_SOS_FEEDING.DESC',
      descriptionKey: 'SERVICES.SERVICE_SOS_FEEDING.DESC',
      icon: 'restaurant',
      logo: 'images/programs/SOS_Feeding.svg',
      color: 'feeding',
      featureKeys: [
        'SERVICES.CARD_FEATURES.SOS_FEEDING.PICKY_EATING_TREATMENT',
        'SERVICES.CARD_FEATURES.SOS_FEEDING.SENSORY_INTEGRATION',
        'SERVICES.CARD_FEATURES.SOS_FEEDING.FAMILY_THERAPY',
        'SERVICES.CARD_FEATURES.SOS_FEEDING.PLAY_BASED_LEARNING',
        'SERVICES.CARD_FEATURES.SOS_FEEDING.EVIDENCE_BASED_METHODS',
        'SERVICES.CARD_FEATURES.SOS_FEEDING.INTERNATIONAL_CERTIFICATION'
      ]
    },
    {
      id: 'laboratuvar-goruntuleme',
      titleKey: 'SERVICES.SERVICE_LAB.TITLE',
      subtitleKey: 'SERVICES.SERVICE_LAB.DESC',
      descriptionKey: 'SERVICES.SERVICE_LAB.DESC',
      icon: 'biotech',
      color: 'primary',
      featureKeys: [
        'SERVICES.CARD_FEATURES.LAB.BIOCHEMISTRY_TESTS',
        'SERVICES.CARD_FEATURES.LAB.MICROBIOLOGY_TESTS',
        'SERVICES.CARD_FEATURES.LAB.INFECTION_TESTS',
        'SERVICES.CARD_FEATURES.LAB.MRI_CT_ULTRASOUND',
        'SERVICES.CARD_FEATURES.LAB.DIGITAL_XRAY',
        'SERVICES.CARD_FEATURES.LAB.INSURANCE_PROVISION'
      ]
    },
    {
      id: 'asi-takibi',
      titleKey: 'SERVICES.SERVICE_VACCINATION.TITLE',
      subtitleKey: 'SERVICES.SERVICE_VACCINATION.DESC',
      descriptionKey: 'SERVICES.SERVICE_VACCINATION.DESC',
      icon: 'vaccines',
      color: 'secondary',
      featureKeys: [
        'SERVICES.CARD_FEATURES.VACCINATION.NATIONAL_SCHEDULE',
        'SERVICES.CARD_FEATURES.VACCINATION.PRIVATE_VACCINES',
        'SERVICES.CARD_FEATURES.VACCINATION.POST_VACCINE_FOLLOWUP',
        'SERVICES.CARD_FEATURES.VACCINATION.VACCINE_INFORMATION',
        'SERVICES.CARD_FEATURES.VACCINATION.DIGITAL_VACCINE_CARD',
        'SERVICES.CARD_FEATURES.VACCINATION.REMINDER_SERVICE'
      ]
    },
    {
      id: 'gelisim-takibi',
      titleKey: 'SERVICES.SERVICE_GROWTH_DEV.TITLE',
      subtitleKey: 'SERVICES.SERVICE_GROWTH_DEV.DESC',
      descriptionKey: 'SERVICES.SERVICE_GROWTH_DEV.DESC',
      icon: 'trending_up',
      color: 'secondary',
      featureKeys: [
        'SERVICES.CARD_FEATURES.GROWTH.HEIGHT_WEIGHT_TRACKING',
        'SERVICES.CARD_FEATURES.GROWTH.HEAD_CIRCUMFERENCE',
        'SERVICES.CARD_FEATURES.GROWTH.MILESTONES',
        'SERVICES.CARD_FEATURES.DEVELOPMENT.BAYLEY_III',
        'SERVICES.CARD_FEATURES.DEVELOPMENT.DENVER_II',
        'SERVICES.CARD_FEATURES.DEVELOPMENT.SOCIAL_EMOTIONAL'
      ]
    }
  ];

  getServicesByRow(): Service[][] {
    const result: Service[][] = [];
    for (let i = 0; i < this.services.length; i += 3) {
      result.push(this.services.slice(i, i + 3));
    }
    return result;
  }
}
