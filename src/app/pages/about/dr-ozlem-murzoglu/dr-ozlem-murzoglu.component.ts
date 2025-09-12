import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

interface ServiceArea {
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

interface StoryBlock {
  icon: string;
  titleKey: string;
  contentKeys: string[];
}

interface Credential {
  icon: string;
  textKey: string;
}

@Component({
  selector: 'app-dr-ozlem-murzoglu',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './dr-ozlem-murzoglu.component.html',
  styleUrl: './dr-ozlem-murzoglu.component.css'
})
export class DrOzlemMurzogluComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit() {
    // Dil ayarını kontrol et ve çevirileri yükle
    const currentLang = this.translate.currentLang || this.translate.defaultLang || 'tr';
    this.translate.use(currentLang).subscribe();
  }

  breadcrumbs = [
    { label: 'DR_OZLEM.HOME_BREADCRUMB', link: '/' },
    { label: 'DR_OZLEM.ABOUT_BREADCRUMB', link: '/hakkimizda' },
    { label: 'DR_OZLEM.NAME' }
  ];

  credentials: Credential[] = [
    { icon: 'fas fa-graduation-cap', textKey: 'DR_OZLEM.CREDENTIALS.UNIVERSITY' },
    { icon: 'fas fa-certificate', textKey: 'DR_OZLEM.CREDENTIALS.PEDIATRICIAN' },
    { icon: 'fas fa-book', textKey: 'DR_OZLEM.CREDENTIALS.DOCTORATE' }
  ];

  storyBlocks: StoryBlock[] = [
    { 
      icon: 'fas fa-home', 
      titleKey: 'DR_OZLEM.STORY.ROOTS_TITLE', 
      contentKeys: ['DR_OZLEM.STORY.ROOTS_P1'] 
    },
    { 
      icon: 'fas fa-school', 
      titleKey: 'DR_OZLEM.STORY.EDUCATION_TITLE', 
      contentKeys: ['DR_OZLEM.STORY.EDUCATION_P1', 'DR_OZLEM.STORY.EDUCATION_P2'] 
    },
    { 
      icon: 'fas fa-heart', 
      titleKey: 'DR_OZLEM.STORY.FAMILY_TITLE', 
      contentKeys: ['DR_OZLEM.STORY.FAMILY_P1'] 
    },
    { 
      icon: 'fas fa-stethoscope', 
      titleKey: 'DR_OZLEM.STORY.PEDIATRICS_TITLE', 
      contentKeys: ['DR_OZLEM.STORY.PEDIATRICS_P1', 'DR_OZLEM.STORY.PEDIATRICS_P2'] 
    },
    { 
      icon: 'fas fa-baby', 
      titleKey: 'DR_OZLEM.STORY.WELLCHILD_TITLE', 
      contentKeys: ['DR_OZLEM.STORY.WELLCHILD_P1'] 
    },
    { 
      icon: 'fas fa-clinic-medical', 
      titleKey: 'DR_OZLEM.STORY.NEWBEGINNING_TITLE', 
      contentKeys: ['DR_OZLEM.STORY.NEWBEGINNING_P1', 'DR_OZLEM.STORY.NEWBEGINNING_P2', 'DR_OZLEM.STORY.NEWBEGINNING_P3'] 
    }
  ];

  serviceAreas: ServiceArea[] = [
    { 
      icon: 'fas fa-baby-carriage', 
      titleKey: 'DR_OZLEM.SERVICES.WELLCHILD_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.WELLCHILD_DESC' 
    },
    { 
      icon: 'fas fa-syringe', 
      titleKey: 'DR_OZLEM.SERVICES.VACCINATION_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.VACCINATION_DESC' 
    },
    { 
      icon: 'fas fa-heartbeat', 
      titleKey: 'DR_OZLEM.SERVICES.CHILDHOOD_DISEASES_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.CHILDHOOD_DISEASES_DESC' 
    },
    { 
      icon: 'fas fa-female', 
      titleKey: 'DR_OZLEM.SERVICES.BREASTFEEDING_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.BREASTFEEDING_DESC' 
    },
    { 
      icon: 'fas fa-bed', 
      titleKey: 'DR_OZLEM.SERVICES.SLEEP_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.SLEEP_DESC' 
    },
    { 
      icon: 'fas fa-apple-alt', 
      titleKey: 'DR_OZLEM.SERVICES.NUTRITION_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.NUTRITION_DESC' 
    },
    { 
      icon: 'fas fa-toilet', 
      titleKey: 'DR_OZLEM.SERVICES.TOILET_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.TOILET_DESC' 
    },
    { 
      icon: 'fas fa-users', 
      titleKey: 'DR_OZLEM.SERVICES.PARENTING_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.PARENTING_DESC' 
    },
    { 
      icon: 'fas fa-school', 
      titleKey: 'DR_OZLEM.SERVICES.SCHOOL_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.SCHOOL_DESC' 
    },
    { 
      icon: 'fas fa-child', 
      titleKey: 'DR_OZLEM.SERVICES.ADOLESCENCE_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.ADOLESCENCE_DESC' 
    },
    { 
      icon: 'fas fa-laptop', 
      titleKey: 'DR_OZLEM.SERVICES.MEDIA_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.MEDIA_DESC' 
    },
    { 
      icon: 'fas fa-hands-helping', 
      titleKey: 'DR_OZLEM.SERVICES.FAMILY_TITLE', 
      descriptionKey: 'DR_OZLEM.SERVICES.FAMILY_DESC' 
    }
  ];
}