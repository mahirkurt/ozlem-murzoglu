import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-turkan-saylan',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './turkan-saylan.component.html',
  styleUrl: './turkan-saylan.component.css',
})
export class TurkanSaylanComponent {
  private readonly keyPrefix = 'SAYGIYLA.PIONEERS.TURKAN_SAYLAN';

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_RESPECT', link: '/saygiyla' },
    { label: `${this.keyPrefix}.NAME` }
  ];
  timeline = [
    { year: '1935', event: `${this.keyPrefix}.TIMELINE.ITEM_1` },
    { year: '1963', event: `${this.keyPrefix}.TIMELINE.ITEM_2` },
    { year: '1968', event: `${this.keyPrefix}.TIMELINE.ITEM_3` },
    { year: '1976', event: `${this.keyPrefix}.TIMELINE.ITEM_4` },
    { year: '1982', event: `${this.keyPrefix}.TIMELINE.ITEM_5` },
    { year: '1988', event: `${this.keyPrefix}.TIMELINE.ITEM_6` },
    { year: '1989', event: `${this.keyPrefix}.TIMELINE.ITEM_7` },
    { year: '1991', event: `${this.keyPrefix}.TIMELINE.ITEM_8` },
    { year: '2009', event: `${this.keyPrefix}.TIMELINE.ITEM_9` },
    { year: '2009', event: `${this.keyPrefix}.TIMELINE.ITEM_10` },
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
      icon: 'volunteer_activism',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.DESCRIPTION`,
    },
    {
      icon: 'groups',
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
    { title: `${this.keyPrefix}.BOOKS.ITEM_1.TITLE`, year: '2006', genre: `${this.keyPrefix}.BOOKS.ITEM_1.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_2.TITLE`, year: '2008', genre: `${this.keyPrefix}.BOOKS.ITEM_2.GENRE` },
    {
      title: `${this.keyPrefix}.BOOKS.ITEM_3.TITLE`,
      year: '2010',
      genre: `${this.keyPrefix}.BOOKS.ITEM_3.GENRE`,
    },
  ];
}
