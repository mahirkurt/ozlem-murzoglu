import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-sos-feeding',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './sos-feeding.component.html',
  styleUrl: './sos-feeding.component.css',
})
export class SosFeedingComponent {
  private translate = inject(TranslateService);
  locale = 'tr';

  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Hizmetlerimiz', link: '/hizmetlerimiz' },
    { label: 'SOS Feeding Programı' }
  ];

  constructor() {
    // Get current language
    this.locale = this.translate.currentLang || 'tr';

    // Subscribe to language changes
    this.translate.onLangChange.subscribe((event) => {
      this.locale = event.lang;
    });
  }

  certifications = [
    {
      title: 'Hybrid SOS Approach to Feeding Training Course',
      date: '2025',
      level: 'Feeding Therapist',
      icon: 'restaurant',
    },
    {
      title: 'SOS Approach to Feeding Advanced Course',
      date: '2025',
      level: 'Advanced Feeding Therapist',
      icon: 'dining',
    },
  ];

  feedingIssues = [
    { icon: 'no_food', key: 'PICKY_EATING' },
    { icon: 'baby_changing_station', key: 'FOOD_REFUSAL' },
    { icon: 'restaurant', key: 'SENSORY_ISSUES' },
    { icon: 'food_bank', key: 'ORAL_MOTOR' },
    { icon: 'fastfood', key: 'MEALTIME_BEHAVIOR' },
    { icon: 'child_care', key: 'GROWTH_CONCERNS' },
  ];

  approachSteps = [
    { number: '01', icon: 'visibility', key: 'STEP_1' },
    { number: '02', icon: 'touch_app', key: 'STEP_2' },
    { number: '03', icon: 'air', key: 'STEP_3' },
    { number: '04', icon: 'restaurant_menu', key: 'STEP_4' },
  ];

  benefits = [
    { icon: 'diversity_3', key: 'BENEFIT_1' },
    { icon: 'science', key: 'BENEFIT_2' },
    { icon: 'psychology', key: 'BENEFIT_3' },
    { icon: 'family_restroom', key: 'BENEFIT_4' },
    { icon: 'trending_up', key: 'BENEFIT_5' },
    { icon: 'favorite', key: 'BENEFIT_6' },
  ];

  hierarchyLevels = [
    {
      key: 'TOLERATE',
      steps: [
        { icon: 'visibility', key: 'TOLERATE_STEP_1' },
        { icon: 'groups', key: 'TOLERATE_STEP_2' },
        { icon: 'accessibility', key: 'TOLERATE_STEP_3' },
      ],
    },
    {
      key: 'INTERACT',
      steps: [
        { icon: 'touch_app', key: 'INTERACT_STEP_1' },
        { icon: 'pan_tool', key: 'INTERACT_STEP_2' },
        { icon: 'restaurant_menu', key: 'INTERACT_STEP_3' },
      ],
    },
    {
      key: 'SMELL',
      steps: [
        { icon: 'air', key: 'SMELL_STEP_1' },
        { icon: 'spa', key: 'SMELL_STEP_2' },
        { icon: 'mood', key: 'SMELL_STEP_3' },
      ],
    },
    {
      key: 'TOUCH',
      steps: [
        { icon: 'front_hand', key: 'TOUCH_STEP_1' },
        { icon: 'face', key: 'TOUCH_STEP_2' },
        { icon: 'self_improvement', key: 'TOUCH_STEP_3' },
      ],
    },
    {
      key: 'TASTE',
      steps: [
        { icon: 'emoji_food_beverage', key: 'TASTE_STEP_1' },
        { icon: 'restaurant', key: 'TASTE_STEP_2' },
        { icon: 'dining', key: 'TASTE_STEP_3' },
      ],
    },
    {
      key: 'EAT',
      steps: [
        { icon: 'lunch_dining', key: 'EAT_STEP_1' },
        { icon: 'food_bank', key: 'EAT_STEP_2' },
        { icon: 'celebration', key: 'EAT_STEP_3' },
      ],
    },
  ];
}
