import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';

interface Pioneer {
  id: string;
  name: string;
  title: string;
  lifespan: string;
  image?: string;
  contributions: string[];
  quote?: string;
  link: string;
}

@Component({
  selector: 'app-saygiyla',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './saygiyla.html',
  styleUrl: './saygiyla.css'
})
export class SaygiylaComponent implements OnInit {
  pioneers: Pioneer[] = [];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.loadPioneers();
    this.translate.onLangChange.subscribe(() => {
      this.loadPioneers();
    });
  }

  private loadPioneers(): void {
    this.pioneers = [
    {
      id: 'jonas-salk',
      name: this.translate.instant('SAYGIYLA.PIONEERS.JONAS_SALK.NAME'),
      title: this.translate.instant('SAYGIYLA.PIONEERS.JONAS_SALK.TITLE'),
      lifespan: this.translate.instant('SAYGIYLA.PIONEERS.JONAS_SALK.LIFESPAN'),
      contributions: [
        this.translate.instant('SAYGIYLA.PIONEERS.JONAS_SALK.CONTRIBUTION_1'),
        this.translate.instant('SAYGIYLA.PIONEERS.JONAS_SALK.CONTRIBUTION_2'),
        this.translate.instant('SAYGIYLA.PIONEERS.JONAS_SALK.CONTRIBUTION_3'),
        this.translate.instant('SAYGIYLA.PIONEERS.JONAS_SALK.CONTRIBUTION_4')
      ],
      quote: this.translate.instant('SAYGIYLA.PIONEERS.JONAS_SALK.QUOTE'),
      link: '/saygiyla/jonas-salk'
    },
    {
      id: 'louis-pasteur',
      name: this.translate.instant('SAYGIYLA.PIONEERS.LOUIS_PASTEUR.NAME'),
      title: this.translate.instant('SAYGIYLA.PIONEERS.LOUIS_PASTEUR.TITLE'),
      lifespan: this.translate.instant('SAYGIYLA.PIONEERS.LOUIS_PASTEUR.LIFESPAN'),
      contributions: [
        this.translate.instant('SAYGIYLA.PIONEERS.LOUIS_PASTEUR.CONTRIBUTION_1'),
        this.translate.instant('SAYGIYLA.PIONEERS.LOUIS_PASTEUR.CONTRIBUTION_2'),
        this.translate.instant('SAYGIYLA.PIONEERS.LOUIS_PASTEUR.CONTRIBUTION_3'),
        this.translate.instant('SAYGIYLA.PIONEERS.LOUIS_PASTEUR.CONTRIBUTION_4')
      ],
      quote: this.translate.instant('SAYGIYLA.PIONEERS.LOUIS_PASTEUR.QUOTE'),
      link: '/saygiyla/louis-pasteur'
    },
    {
      id: 'nils-rosen',
      name: this.translate.instant('SAYGIYLA.PIONEERS.NILS_ROSEN.NAME'),
      title: this.translate.instant('SAYGIYLA.PIONEERS.NILS_ROSEN.TITLE'),
      lifespan: this.translate.instant('SAYGIYLA.PIONEERS.NILS_ROSEN.LIFESPAN'),
      contributions: [
        this.translate.instant('SAYGIYLA.PIONEERS.NILS_ROSEN.CONTRIBUTION_1'),
        this.translate.instant('SAYGIYLA.PIONEERS.NILS_ROSEN.CONTRIBUTION_2'),
        this.translate.instant('SAYGIYLA.PIONEERS.NILS_ROSEN.CONTRIBUTION_3'),
        this.translate.instant('SAYGIYLA.PIONEERS.NILS_ROSEN.CONTRIBUTION_4')
      ],
      quote: this.translate.instant('SAYGIYLA.PIONEERS.NILS_ROSEN.QUOTE'),
      link: '/saygiyla/nils-rosen'
    },
    {
      id: 'waldo-nelson',
      name: this.translate.instant('SAYGIYLA.PIONEERS.WALDO_NELSON.NAME'),
      title: this.translate.instant('SAYGIYLA.PIONEERS.WALDO_NELSON.TITLE'),
      lifespan: this.translate.instant('SAYGIYLA.PIONEERS.WALDO_NELSON.LIFESPAN'),
      contributions: [
        this.translate.instant('SAYGIYLA.PIONEERS.WALDO_NELSON.CONTRIBUTION_1'),
        this.translate.instant('SAYGIYLA.PIONEERS.WALDO_NELSON.CONTRIBUTION_2'),
        this.translate.instant('SAYGIYLA.PIONEERS.WALDO_NELSON.CONTRIBUTION_3'),
        this.translate.instant('SAYGIYLA.PIONEERS.WALDO_NELSON.CONTRIBUTION_4')
      ],
      link: '/saygiyla/waldo-nelson'
    },
    {
      id: 'ursula-leguin',
      name: this.translate.instant('SAYGIYLA.PIONEERS.URSULA_LEGUIN.NAME'),
      title: this.translate.instant('SAYGIYLA.PIONEERS.URSULA_LEGUIN.TITLE'),
      lifespan: this.translate.instant('SAYGIYLA.PIONEERS.URSULA_LEGUIN.LIFESPAN'),
      contributions: [
        this.translate.instant('SAYGIYLA.PIONEERS.URSULA_LEGUIN.CONTRIBUTION_1'),
        this.translate.instant('SAYGIYLA.PIONEERS.URSULA_LEGUIN.CONTRIBUTION_2'),
        this.translate.instant('SAYGIYLA.PIONEERS.URSULA_LEGUIN.CONTRIBUTION_3'),
        this.translate.instant('SAYGIYLA.PIONEERS.URSULA_LEGUIN.CONTRIBUTION_4')
      ],
      quote: this.translate.instant('SAYGIYLA.PIONEERS.URSULA_LEGUIN.QUOTE'),
      link: '/saygiyla/ursula-leguin'
    }
  ];
  }
}
