import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';
import { ContactCtaComponent } from '../../../components/contact-cta/contact-cta.component';
import { SeoService } from '../../../core/services/seo.service';

interface TestDetail {
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

interface PrepStep {
  number: number;
  icon: string;
  titleKey: string;
  contentKey: string;
}

interface NewbornScreening {
  icon: string;
  titleKey: string;
  contentKey: string;
}

interface ScreeningRow {
  ageKey: string;
  testsKey: string;
  noteKey: string;
}

@Component({
  selector: 'app-laboratuvar-goruntuleme',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, HeroSectionComponent, ContactCtaComponent],
  templateUrl: './laboratuvar-goruntuleme.component.html',
  styleUrl: './laboratuvar-goruntuleme.component.scss'
})
export class LaboratuvarGoruntulemeComponent implements OnInit {
  private translate = inject(TranslateService);
  private seoService = inject(SeoService);

  labTestDetails: TestDetail[] = [
    { id: 'hemogram', icon: 'bloodtype', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.HEMOGRAM_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.HEMOGRAM_CONTENT', infoBoxKey: 'SERVICES.SERVICE_LAB_IMAGING.HEMOGRAM_INFO', isOpen: false },
    { id: 'crp', icon: 'thermostat', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.CRP_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.CRP_CONTENT', isOpen: false },
    { id: 'iron-ferritin', icon: 'egg_alt', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.IRON_FERRITIN_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.IRON_FERRITIN_CONTENT', infoBoxKey: 'SERVICES.SERVICE_LAB_IMAGING.IRON_FERRITIN_INFO', isOpen: false },
    { id: 'vitamin-d', icon: 'wb_sunny', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.VITAMIN_D_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.VITAMIN_D_CONTENT', isOpen: false },
    { id: 'urine', icon: 'science', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.URINE_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.URINE_CONTENT', infoBoxKey: 'SERVICES.SERVICE_LAB_IMAGING.URINE_INFO', isOpen: false },
    { id: 'strep', icon: 'medication', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.STREP_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.STREP_CONTENT', isOpen: false },
    { id: 'urti', icon: 'coronavirus', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.URTI_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.URTI_CONTENT', isOpen: false },
    { id: 'allergy-detail', icon: 'local_florist', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.ALLERGY_DETAIL_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.ALLERGY_DETAIL_CONTENT', isOpen: false },
    { id: 'thyroid', icon: 'monitor_heart', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.THYROID_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.THYROID_CONTENT', isOpen: false },
    { id: 'stool', icon: 'biotech', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.STOOL_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.STOOL_CONTENT', isOpen: false },
  ];

  imagingDetails: TestDetail[] = [
    { id: 'usg-detail', icon: 'monitor_heart', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.USG_DETAIL_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.USG_DETAIL_CONTENT', infoBoxKey: 'SERVICES.SERVICE_LAB_IMAGING.USG_DETAIL_INFO', isOpen: false },
    { id: 'xray-detail', icon: 'filter_center_focus', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.XRAY_DETAIL_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.XRAY_DETAIL_CONTENT', isOpen: false },
    { id: 'mr-ct-detail', icon: 'blur_circular', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.MR_CT_DETAIL_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.MR_CT_DETAIL_CONTENT', infoBoxKey: 'SERVICES.SERVICE_LAB_IMAGING.MR_CT_DETAIL_INFO', isOpen: false },
  ];

  prepSteps: PrepStep[] = [
    { number: 1, icon: 'restaurant', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.PREP_FASTING_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.PREP_FASTING_CONTENT' },
    { number: 2, icon: 'psychology', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.PREP_PSYCH_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.PREP_PSYCH_CONTENT' },
    { number: 3, icon: 'schedule', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.PREP_RESULTS_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.PREP_RESULTS_CONTENT' },
  ];

  newbornScreenings: NewbornScreening[] = [
    { icon: 'child_care', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.NEWBORN_HEEL_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.NEWBORN_HEEL_CONTENT' },
    { icon: 'hearing', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.NEWBORN_HEARING_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.NEWBORN_HEARING_CONTENT' },
    { icon: 'favorite', titleKey: 'SERVICES.SERVICE_LAB_IMAGING.NEWBORN_CHD_TITLE', contentKey: 'SERVICES.SERVICE_LAB_IMAGING.NEWBORN_CHD_CONTENT' },
  ];

  screeningRows: ScreeningRow[] = [
    { ageKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_1_AGE', testsKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_1_TESTS', noteKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_1_NOTE' },
    { ageKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_2_AGE', testsKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_2_TESTS', noteKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_2_NOTE' },
    { ageKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_3_AGE', testsKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_3_TESTS', noteKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_3_NOTE' },
    { ageKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_4_AGE', testsKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_4_TESTS', noteKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_4_NOTE' },
    { ageKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_5_AGE', testsKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_5_TESTS', noteKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_5_NOTE' },
    { ageKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_6_AGE', testsKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_6_TESTS', noteKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_6_NOTE' },
    { ageKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_7_AGE', testsKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_7_TESTS', noteKey: 'SERVICES.SERVICE_LAB_IMAGING.SCREENING_ROW_7_NOTE' },
  ];

  faqItems: FaqItem[] = [
    { questionKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_Q1', answerKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_A1', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_Q2', answerKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_A2', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_Q3', answerKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_A3', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_Q4', answerKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_A4', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_Q5', answerKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_A5', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_Q6', answerKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_A6', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_Q7', answerKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_A7', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_Q8', answerKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_A8', isOpen: false },
    { questionKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_Q9', answerKey: 'SERVICES.SERVICE_LAB_IMAGING.FAQ_A9', isOpen: false },
  ];

  ngOnInit(): void {
    this.seoService.setPageSeo('laboratuvar-goruntuleme');
  }

  toggleDetail(item: TestDetail): void {
    item.isOpen = !item.isOpen;
  }

  toggleFaq(item: FaqItem): void {
    item.isOpen = !item.isOpen;
  }
}
