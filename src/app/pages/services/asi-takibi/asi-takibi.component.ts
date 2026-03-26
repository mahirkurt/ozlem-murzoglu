import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';
import { ContactCtaComponent } from '../../../components/contact-cta/contact-cta.component';
import { SeoService } from '../../../core/services/seo.service';

interface VaccineDetail {
  id: string;
  icon: string;
  titleKey: string;
  contentKey: string;
  infoBoxKey?: string;
  isOpen: boolean;
}

interface FaqItem {
  questionKey: string;
  answerKey: string;
  isOpen: boolean;
}

interface ScheduleRow {
  ageKey: string;
  vaccinesKey: string;
}

interface ExtraVaccine {
  icon: string;
  titleKey: string;
  descKey: string;
  badgeKey: string;
}

@Component({
  selector: 'app-asi-takibi',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, HeroSectionComponent, ContactCtaComponent],
  templateUrl: './asi-takibi.component.html',
  styleUrl: './asi-takibi.component.scss'
})
export class AsiTakibiComponent implements OnInit {
  private translate = inject(TranslateService);
  private seoService = inject(SeoService);

  scheduleRows: ScheduleRow[] = [
    { ageKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_1_AGE', vaccinesKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_1_VACCINES' },
    { ageKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_2_AGE', vaccinesKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_2_VACCINES' },
    { ageKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_3_AGE', vaccinesKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_3_VACCINES' },
    { ageKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_4_AGE', vaccinesKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_4_VACCINES' },
    { ageKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_5_AGE', vaccinesKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_5_VACCINES' },
    { ageKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_6_AGE', vaccinesKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_6_VACCINES' },
    { ageKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_7_AGE', vaccinesKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_7_VACCINES' },
    { ageKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_8_AGE', vaccinesKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_8_VACCINES' },
    { ageKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_9_AGE', vaccinesKey: 'SERVICES.SERVICE_VACCINES.SCHEDULE_ROW_9_VACCINES' },
  ];

  vaccineDetails: VaccineDetail[] = [
    { id: 'hepatit-b', icon: 'vaccines', titleKey: 'SERVICES.SERVICE_VACCINES.DETAIL_HEPB_TITLE', contentKey: 'SERVICES.SERVICE_VACCINES.DETAIL_HEPB_CONTENT', isOpen: false },
    { id: 'bcg', icon: 'shield', titleKey: 'SERVICES.SERVICE_VACCINES.DETAIL_BCG_TITLE', contentKey: 'SERVICES.SERVICE_VACCINES.DETAIL_BCG_CONTENT', isOpen: false },
    { id: 'altili-karma', icon: 'medication', titleKey: 'SERVICES.SERVICE_VACCINES.DETAIL_HEXA_TITLE', contentKey: 'SERVICES.SERVICE_VACCINES.DETAIL_HEXA_CONTENT', isOpen: false },
    { id: 'pnomokok', icon: 'air', titleKey: 'SERVICES.SERVICE_VACCINES.DETAIL_PCV_TITLE', contentKey: 'SERVICES.SERVICE_VACCINES.DETAIL_PCV_CONTENT', isOpen: false },
    { id: 'kkk', icon: 'child_care', titleKey: 'SERVICES.SERVICE_VACCINES.DETAIL_MMR_TITLE', contentKey: 'SERVICES.SERVICE_VACCINES.DETAIL_MMR_CONTENT', infoBoxKey: 'SERVICES.SERVICE_VACCINES.DETAIL_MMR_INFO', isOpen: false },
    { id: 'sucicegi', icon: 'healing', titleKey: 'SERVICES.SERVICE_VACCINES.DETAIL_VARICELLA_TITLE', contentKey: 'SERVICES.SERVICE_VACCINES.DETAIL_VARICELLA_CONTENT', isOpen: false },
    { id: 'hepatit-a', icon: 'health_and_safety', titleKey: 'SERVICES.SERVICE_VACCINES.DETAIL_HEPA_TITLE', contentKey: 'SERVICES.SERVICE_VACCINES.DETAIL_HEPA_CONTENT', isOpen: false },
  ];

  extraVaccines: ExtraVaccine[] = [
    { icon: 'egg_alt', titleKey: 'SERVICES.SERVICE_VACCINES.EXTRA_ROTAVIRUS_TITLE', descKey: 'SERVICES.SERVICE_VACCINES.EXTRA_ROTAVIRUS_DESC', badgeKey: 'SERVICES.SERVICE_VACCINES.EXTRA_ROTAVIRUS_BADGE' },
    { icon: 'psychology', titleKey: 'SERVICES.SERVICE_VACCINES.EXTRA_MENINGO_TITLE', descKey: 'SERVICES.SERVICE_VACCINES.EXTRA_MENINGO_DESC', badgeKey: 'SERVICES.SERVICE_VACCINES.EXTRA_MENINGO_BADGE' },
    { icon: 'favorite', titleKey: 'SERVICES.SERVICE_VACCINES.EXTRA_HPV_TITLE', descKey: 'SERVICES.SERVICE_VACCINES.EXTRA_HPV_DESC', badgeKey: 'SERVICES.SERVICE_VACCINES.EXTRA_HPV_BADGE' },
    { icon: 'ac_unit', titleKey: 'SERVICES.SERVICE_VACCINES.EXTRA_FLU_TITLE', descKey: 'SERVICES.SERVICE_VACCINES.EXTRA_FLU_DESC', badgeKey: 'SERVICES.SERVICE_VACCINES.EXTRA_FLU_BADGE' },
  ];

  faqItems: FaqItem[] = [
    { questionKey: 'SERVICES.SERVICE_VACCINES.FAQ_Q1', answerKey: 'SERVICES.SERVICE_VACCINES.FAQ_A1', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_VACCINES.FAQ_Q2', answerKey: 'SERVICES.SERVICE_VACCINES.FAQ_A2', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_VACCINES.FAQ_Q3', answerKey: 'SERVICES.SERVICE_VACCINES.FAQ_A3', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_VACCINES.FAQ_Q4', answerKey: 'SERVICES.SERVICE_VACCINES.FAQ_A4', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_VACCINES.FAQ_Q5', answerKey: 'SERVICES.SERVICE_VACCINES.FAQ_A5', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_VACCINES.FAQ_Q6', answerKey: 'SERVICES.SERVICE_VACCINES.FAQ_A6', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_VACCINES.FAQ_Q7', answerKey: 'SERVICES.SERVICE_VACCINES.FAQ_A7', isOpen: false },
  ];

  ngOnInit(): void {
    this.seoService.setPageSeo('asi-takibi');
  }

  toggleDetail(item: VaccineDetail): void {
    item.isOpen = !item.isOpen;
  }

  toggleFaq(item: FaqItem): void {
    item.isOpen = !item.isOpen;
  }
}
