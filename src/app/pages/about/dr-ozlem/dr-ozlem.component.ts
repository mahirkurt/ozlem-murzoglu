import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-dr-ozlem',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './dr-ozlem.component.html',
  styleUrls: ['./dr-ozlem.component.css'],
})
export class DrOzlemComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Hakkımızda', link: '/hakkimizda' },
    { label: 'Dr. Özlem' },
  ];

  education = [
    {
      year: '1995',
      titleKey: 'DR_OZLEM.EDU_MEDICAL',
      institution: 'İstanbul Üniversitesi Cerrahpaşa Tıp Fakültesi',
    },
    {
      year: '2000',
      titleKey: 'DR_OZLEM.EDU_SPECIALIZATION',
      institution: 'İstanbul Üniversitesi',
    },
    {
      year: '2005',
      titleKey: 'DR_OZLEM.EDU_BRIGHT_FUTURES',
      institution: 'American Academy of Pediatrics',
    },
    {
      year: '2010',
      titleKey: 'DR_OZLEM.EDU_TRIPLE_P',
      institution: 'Triple P International',
    },
  ];

  experience = [
    {
      period: '2000-2005',
      positionKey: 'DR_OZLEM.EXP_SPECIALIST',
      institution: 'İstanbul Üniversitesi Tıp Fakültesi',
    },
    { period: '2005-2010', positionKey: 'DR_OZLEM.EXP_PEDIATRICIAN', institution: 'Özel Hastane' },
    { period: '2010-2020', positionKey: 'DR_OZLEM.EXP_CHIEF', institution: 'Özel Çocuk Kliniği' },
    {
      period: '2020-Günümüz',
      positionKey: 'DR_OZLEM.EXP_OWNER',
      institution: 'Dr. Özlem Murzoğlu Kliniği',
    },
  ];

  membershipsKeys = [
    'DR_OZLEM.MEMBER_PEDIATRIC_ASSOCIATION',
    'DR_OZLEM.MEMBER_NATIONAL_PEDIATRIC',
    'DR_OZLEM.MEMBER_MEDICAL_CHAMBER',
    'DR_OZLEM.MEMBER_AAP',
    'DR_OZLEM.MEMBER_ESPR',
  ];

  specialAreasKeys = [
    'DR_OZLEM.SPEC_NEWBORN',
    'DR_OZLEM.SPEC_VACCINATION',
    'DR_OZLEM.SPEC_DEVELOPMENT',
    'DR_OZLEM.SPEC_NUTRITION',
    'DR_OZLEM.SPEC_BRIGHT_FUTURES',
    'DR_OZLEM.SPEC_TRIPLE_P',
    'DR_OZLEM.SPEC_ADOLESCENT',
    'DR_OZLEM.SPEC_SCHOOL_AGE',
  ];
}
