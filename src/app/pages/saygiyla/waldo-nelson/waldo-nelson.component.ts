import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-waldo-nelson',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './waldo-nelson.component.html',
  styleUrl: './waldo-nelson.component.css',
})
export class WaldoNelsonComponent {
  private readonly keyPrefix = 'SAYGIYLA.PIONEERS.WALDO_NELSON';

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_RESPECT', link: '/saygiyla' },
    { label: `${this.keyPrefix}.NAME` }
  ];
  timeline = [
    { year: '1898', event: `${this.keyPrefix}.TIMELINE.ITEM_1` },
    { year: '1921', event: `${this.keyPrefix}.TIMELINE.ITEM_2` },
    { year: '1925', event: `${this.keyPrefix}.TIMELINE.ITEM_3` },
    { year: '1927', event: `${this.keyPrefix}.TIMELINE.ITEM_4` },
    { year: '1930', event: `${this.keyPrefix}.TIMELINE.ITEM_5` },
    { year: '1937', event: `${this.keyPrefix}.TIMELINE.ITEM_6` },
    { year: '1941', event: `${this.keyPrefix}.TIMELINE.ITEM_7` },
    { year: '1955', event: `${this.keyPrefix}.TIMELINE.ITEM_8` },
    { year: '1963', event: `${this.keyPrefix}.TIMELINE.ITEM_9` },
    { year: '1997', event: `${this.keyPrefix}.TIMELINE.ITEM_10` },
  ];

  contributions = [
    {
      icon: 'menu_book',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.DESCRIPTION`,
    },
    {
      icon: 'school',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.DESCRIPTION`,
    },
    {
      icon: 'science',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.DESCRIPTION`,
    },
    {
      icon: 'health_and_safety',
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
  ];

  books = [
    { title: `${this.keyPrefix}.BOOKS.ITEM_1.TITLE`, year: '1937', genre: `${this.keyPrefix}.BOOKS.ITEM_1.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_2.TITLE`, year: '1955', genre: `${this.keyPrefix}.BOOKS.ITEM_2.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_3.TITLE`, year: '1962', genre: `${this.keyPrefix}.BOOKS.ITEM_3.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_4.TITLE`, year: '1970', genre: `${this.keyPrefix}.BOOKS.ITEM_4.GENRE` },
  ];
}
