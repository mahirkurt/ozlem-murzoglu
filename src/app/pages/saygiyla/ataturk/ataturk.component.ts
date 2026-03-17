import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-ataturk',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './ataturk.component.html',
  styleUrl: './ataturk.component.css',
})
export class AtaturkComponent {
  private readonly keyPrefix = 'SAYGIYLA.PIONEERS.ATATURK';

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_RESPECT', link: '/saygiyla' },
    { label: `${this.keyPrefix}.NAME` }
  ];
  timeline = [
    { year: '1881', event: `${this.keyPrefix}.TIMELINE.ITEM_1` },
    { year: '1899', event: `${this.keyPrefix}.TIMELINE.ITEM_2` },
    { year: '1905', event: `${this.keyPrefix}.TIMELINE.ITEM_3` },
    { year: '1915', event: `${this.keyPrefix}.TIMELINE.ITEM_4` },
    { year: '1919', event: `${this.keyPrefix}.TIMELINE.ITEM_5` },
    { year: '1920', event: `${this.keyPrefix}.TIMELINE.ITEM_6` },
    { year: '1923', event: `${this.keyPrefix}.TIMELINE.ITEM_7` },
    { year: '1924', event: `${this.keyPrefix}.TIMELINE.ITEM_8` },
    { year: '1928', event: `${this.keyPrefix}.TIMELINE.ITEM_9` },
    { year: '1934', event: `${this.keyPrefix}.TIMELINE.ITEM_10` },
    { year: '1938', event: `${this.keyPrefix}.TIMELINE.ITEM_11` },
  ];

  contributions = [
    {
      icon: 'military_tech',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.DESCRIPTION`,
    },
    {
      icon: 'account_balance',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.DESCRIPTION`,
    },
    {
      icon: 'school',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.DESCRIPTION`,
    },
    {
      icon: 'diversity_1',
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
    { title: `${this.keyPrefix}.BOOKS.ITEM_1.TITLE`, year: '1927', genre: `${this.keyPrefix}.BOOKS.ITEM_1.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_2.TITLE`, year: '1937', genre: `${this.keyPrefix}.BOOKS.ITEM_2.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_3.TITLE`, year: '1930', genre: `${this.keyPrefix}.BOOKS.ITEM_3.GENRE` },
  ];
}
