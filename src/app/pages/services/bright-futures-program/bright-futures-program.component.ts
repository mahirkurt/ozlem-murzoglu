import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';
import { ContactCtaComponent } from '../../../components/contact-cta/contact-cta.component';
import { SeoService } from '../../../core/services/seo.service';

interface ThemeItem {
  icon: string;
  titleKey: string;
  descKey: string;
}

interface VisitPhase {
  id: string;
  labelKey: string;
  visitsKey: string;
  screeningsKey: string;
}

interface DevelopmentPeriod {
  id: string;
  icon: string;
  titleKey: string;
  contentKey: string;
  isOpen: boolean;
}

interface FaqItem {
  questionKey: string;
  answerKey: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-bright-futures-program',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, HeroSectionComponent, ContactCtaComponent],
  templateUrl: './bright-futures-program.component.html',
  styleUrl: './bright-futures-program.component.scss'
})
export class BrightFuturesProgramComponent implements OnInit {
  private translate = inject(TranslateService);
  private seoService = inject(SeoService);

  activePhase = 'baby';

  themes: ThemeItem[] = [
    { icon: 'family_restroom', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_1_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_1_DESC' },
    { icon: 'support', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_2_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_2_DESC' },
    { icon: 'accessible', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_3_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_3_DESC' },
    { icon: 'child_care', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_4_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_4_DESC' },
    { icon: 'psychology', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_5_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_5_DESC' },
    { icon: 'monitor_weight', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_6_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_6_DESC' },
    { icon: 'restaurant', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_7_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_7_DESC' },
    { icon: 'directions_run', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_8_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_8_DESC' },
    { icon: 'mood', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_9_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_9_DESC' },
    { icon: 'favorite', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_10_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_10_DESC' },
    { icon: 'devices', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_11_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_11_DESC' },
    { icon: 'health_and_safety', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_12_TITLE', descKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.THEME_12_DESC' },
  ];

  visitPhases: VisitPhase[] = [
    { id: 'baby', labelKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_BABY', visitsKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_BABY_VISITS', screeningsKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_BABY_SCREENINGS' },
    { id: 'early', labelKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_EARLY', visitsKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_EARLY_VISITS', screeningsKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_EARLY_SCREENINGS' },
    { id: 'middle', labelKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_MIDDLE', visitsKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_MIDDLE_VISITS', screeningsKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_MIDDLE_SCREENINGS' },
    { id: 'adolescent', labelKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_ADOLESCENT', visitsKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_ADOLESCENT_VISITS', screeningsKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.PHASE_ADOLESCENT_SCREENINGS' },
  ];

  developmentPeriods: DevelopmentPeriod[] = [
    { id: 'infancy', icon: 'child_friendly', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.DEV_INFANCY_TITLE', contentKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.DEV_INFANCY_CONTENT', isOpen: false },
    { id: 'early-childhood', icon: 'child_care', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.DEV_EARLY_TITLE', contentKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.DEV_EARLY_CONTENT', isOpen: false },
    { id: 'middle-childhood', icon: 'school', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.DEV_MIDDLE_TITLE', contentKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.DEV_MIDDLE_CONTENT', isOpen: false },
    { id: 'adolescence', icon: 'person', titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.DEV_ADOLESCENT_TITLE', contentKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.DEV_ADOLESCENT_CONTENT', isOpen: false },
  ];

  faqItems: FaqItem[] = [
    { questionKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q1', answerKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A1', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q2', answerKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A2', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q3', answerKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A3', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q4', answerKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A4', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q5', answerKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A5', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_Q6', answerKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.FAQ_A6', isOpen: false },
  ];

  ngOnInit(): void {
    this.seoService.setPageSeo('bright-futures-program');
  }

  setActivePhase(phaseId: string): void {
    this.activePhase = phaseId;
  }

  togglePeriod(item: DevelopmentPeriod): void {
    item.isOpen = !item.isOpen;
  }

  toggleFaq(item: FaqItem): void {
    item.isOpen = !item.isOpen;
  }
}
