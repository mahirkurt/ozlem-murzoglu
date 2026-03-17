import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-jonas-salk',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './jonas-salk.component.html',
  styleUrl: './jonas-salk.component.css',
})
export class JonasSalkComponent {
  private readonly keyPrefix = 'SAYGIYLA.PIONEERS.JONAS_SALK';

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_RESPECT', link: '/saygiyla' },
    { label: `${this.keyPrefix}.NAME` }
  ];
  timeline = [
    { year: '1914', event: `${this.keyPrefix}.TIMELINE.ITEM_1` },
    { year: '1939', event: `${this.keyPrefix}.TIMELINE.ITEM_2` },
    { year: '1942', event: `${this.keyPrefix}.TIMELINE.ITEM_3` },
    { year: '1947', event: `${this.keyPrefix}.TIMELINE.ITEM_4` },
    { year: '1952', event: `${this.keyPrefix}.TIMELINE.ITEM_5` },
    { year: '1953', event: `${this.keyPrefix}.TIMELINE.ITEM_6` },
    { year: '1954', event: `${this.keyPrefix}.TIMELINE.ITEM_7` },
    { year: '1955', event: `${this.keyPrefix}.TIMELINE.ITEM_8` },
    { year: '1963', event: `${this.keyPrefix}.TIMELINE.ITEM_9` },
    { year: '1995', event: `${this.keyPrefix}.TIMELINE.ITEM_10` },
  ];

  contributions = [
    {
      icon: 'vaccines',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.DESCRIPTION`,
    },
    {
      icon: 'public',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.DESCRIPTION`,
    },
    {
      icon: 'biotech',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.DESCRIPTION`,
    },
    {
      icon: 'science',
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
    { title: `${this.keyPrefix}.BOOKS.ITEM_1.TITLE`, year: '1972', genre: `${this.keyPrefix}.BOOKS.ITEM_1.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_2.TITLE`, year: '1983', genre: `${this.keyPrefix}.BOOKS.ITEM_2.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_3.TITLE`, year: '1973', genre: `${this.keyPrefix}.BOOKS.ITEM_3.GENRE` },
  ];
}
