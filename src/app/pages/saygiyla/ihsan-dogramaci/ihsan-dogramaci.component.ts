import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-ihsan-dogramaci',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './ihsan-dogramaci.component.html',
  styleUrl: './ihsan-dogramaci.component.css',
})
export class IhsanDogramaciComponent {
  private readonly keyPrefix = 'SAYGIYLA.PIONEERS.IHSAN_DOGRAMACI';

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_RESPECT', link: '/saygiyla' },
    { label: `${this.keyPrefix}.NAME` }
  ];
  timeline = [
    { year: '1915', event: `${this.keyPrefix}.TIMELINE.ITEM_1` },
    { year: '1938', event: `${this.keyPrefix}.TIMELINE.ITEM_2` },
    { year: '1940', event: `${this.keyPrefix}.TIMELINE.ITEM_3` },
    {
      year: '1946',
      event: `${this.keyPrefix}.TIMELINE.ITEM_4`,
    },
    { year: '1958', event: `${this.keyPrefix}.TIMELINE.ITEM_5` },
    { year: '1963', event: `${this.keyPrefix}.TIMELINE.ITEM_6` },
    { year: '1967', event: `${this.keyPrefix}.TIMELINE.ITEM_7` },
    { year: '1973', event: `${this.keyPrefix}.TIMELINE.ITEM_8` },
    { year: '1975', event: `${this.keyPrefix}.TIMELINE.ITEM_9` },
    { year: '1980', event: `${this.keyPrefix}.TIMELINE.ITEM_10` },
    { year: '1984', event: `${this.keyPrefix}.TIMELINE.ITEM_11` },
    { year: '1986', event: `${this.keyPrefix}.TIMELINE.ITEM_12` },
    { year: '2010', event: `${this.keyPrefix}.TIMELINE.ITEM_13` },
  ];

  contributions = [
    {
      icon: 'healing',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.DESCRIPTION`,
    },
    {
      icon: 'school',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.DESCRIPTION`,
    },
    {
      icon: 'account_balance',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.DESCRIPTION`,
    },
    {
      icon: 'public',
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
    { title: `${this.keyPrefix}.BOOKS.ITEM_1.TITLE`, year: '1958', genre: `${this.keyPrefix}.BOOKS.ITEM_1.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_2.TITLE`, year: '1967', genre: `${this.keyPrefix}.BOOKS.ITEM_2.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_3.TITLE`, year: '1980-1982', genre: `${this.keyPrefix}.BOOKS.ITEM_3.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_4.TITLE`, year: '1984', genre: `${this.keyPrefix}.BOOKS.ITEM_4.GENRE` },
  ];
}
