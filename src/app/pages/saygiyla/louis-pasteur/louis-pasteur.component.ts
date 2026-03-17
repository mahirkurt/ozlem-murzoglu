import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-louis-pasteur',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './louis-pasteur.component.html',
  styleUrl: './louis-pasteur.component.css',
})
export class LouisPasteurComponent {
  private readonly keyPrefix = 'SAYGIYLA.PIONEERS.LOUIS_PASTEUR';

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_RESPECT', link: '/saygiyla' },
    { label: `${this.keyPrefix}.NAME` }
  ];
  timeline = [
    { year: '1822', event: `${this.keyPrefix}.TIMELINE.ITEM_1` },
    { year: '1847', event: `${this.keyPrefix}.TIMELINE.ITEM_2` },
    { year: '1848', event: `${this.keyPrefix}.TIMELINE.ITEM_3` },
    { year: '1857', event: `${this.keyPrefix}.TIMELINE.ITEM_4` },
    {
      year: '1862',
      event: `${this.keyPrefix}.TIMELINE.ITEM_5`,
    },
    { year: '1864', event: `${this.keyPrefix}.TIMELINE.ITEM_6` },
    { year: '1865', event: `${this.keyPrefix}.TIMELINE.ITEM_7` },
    { year: '1881', event: `${this.keyPrefix}.TIMELINE.ITEM_8` },
    { year: '1885', event: `${this.keyPrefix}.TIMELINE.ITEM_9` },
    { year: '1888', event: `${this.keyPrefix}.TIMELINE.ITEM_10` },
    { year: '1895', event: `${this.keyPrefix}.TIMELINE.ITEM_11` },
  ];

  contributions = [
    {
      icon: 'science',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.DESCRIPTION`,
    },
    {
      icon: 'vaccines',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.DESCRIPTION`,
    },
    {
      icon: 'restaurant',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.DESCRIPTION`,
    },
    {
      icon: 'biotech',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_4.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_4.DESCRIPTION`,
    },
  ];

  quotes = [
    {
      text: `${this.keyPrefix}.QUOTES.ITEM_1.TEXT`,
      context: `${this.keyPrefix}.QUOTES.ITEM_1.CONTEXT`,
    },
    {
      text: `${this.keyPrefix}.QUOTES.ITEM_2.TEXT`,
      context: `${this.keyPrefix}.QUOTES.ITEM_2.CONTEXT`,
    },
    {
      text: `${this.keyPrefix}.QUOTES.ITEM_3.TEXT`,
      context: `${this.keyPrefix}.QUOTES.ITEM_3.CONTEXT`,
    },
    {
      text: `${this.keyPrefix}.QUOTES.ITEM_4.TEXT`,
      context: `${this.keyPrefix}.QUOTES.ITEM_4.CONTEXT`,
    },
    {
      text: `${this.keyPrefix}.QUOTES.ITEM_5.TEXT`,
      context: `${this.keyPrefix}.QUOTES.ITEM_5.CONTEXT`,
    },
    {
      text: `${this.keyPrefix}.QUOTES.ITEM_6.TEXT`,
      context: `${this.keyPrefix}.QUOTES.ITEM_6.CONTEXT`,
    },
  ];

  books = [
    { title: `${this.keyPrefix}.BOOKS.ITEM_1.TITLE`, year: '1866', genre: `${this.keyPrefix}.BOOKS.ITEM_1.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_2.TITLE`, year: '1876', genre: `${this.keyPrefix}.BOOKS.ITEM_2.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_3.TITLE`, year: '1870', genre: `${this.keyPrefix}.BOOKS.ITEM_3.GENRE` },
  ];
}
