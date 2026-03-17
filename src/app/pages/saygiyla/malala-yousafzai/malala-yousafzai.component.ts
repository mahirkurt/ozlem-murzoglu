import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-malala-yousafzai',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './malala-yousafzai.component.html',
  styleUrl: './malala-yousafzai.component.css',
})
export class MalalaYousafzaiComponent {
  private readonly keyPrefix = 'SAYGIYLA.PIONEERS.MALALA_YOUSAFZAI';

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_RESPECT', link: '/saygiyla' },
    { label: `${this.keyPrefix}.NAME` }
  ];
  timeline = [
    { year: '1997', event: `${this.keyPrefix}.TIMELINE.ITEM_1` },
    { year: '2008', event: `${this.keyPrefix}.TIMELINE.ITEM_2` },
    { year: '2009', event: `${this.keyPrefix}.TIMELINE.ITEM_3` },
    { year: '2011', event: `${this.keyPrefix}.TIMELINE.ITEM_4` },
    { year: '2012', event: `${this.keyPrefix}.TIMELINE.ITEM_5` },
    { year: '2012', event: `${this.keyPrefix}.TIMELINE.ITEM_6` },
    { year: '2013', event: `${this.keyPrefix}.TIMELINE.ITEM_7` },
    { year: '2013', event: `${this.keyPrefix}.TIMELINE.ITEM_8` },
    { year: '2013', event: `${this.keyPrefix}.TIMELINE.ITEM_9` },
    { year: '2014', event: `${this.keyPrefix}.TIMELINE.ITEM_10` },
    { year: '2017', event: `${this.keyPrefix}.TIMELINE.ITEM_11` },
    { year: '2020', event: `${this.keyPrefix}.TIMELINE.ITEM_12` },
    { year: '2021', event: `${this.keyPrefix}.TIMELINE.ITEM_13` },
  ];

  contributions = [
    {
      icon: 'school',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.DESCRIPTION`,
    },
    {
      icon: 'campaign',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.DESCRIPTION`,
    },
    {
      icon: 'public',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.DESCRIPTION`,
    },
    {
      icon: 'auto_stories',
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
    { title: `${this.keyPrefix}.BOOKS.ITEM_1.TITLE`, year: '2013', genre: `${this.keyPrefix}.BOOKS.ITEM_1.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_2.TITLE`, year: '2017', genre: `${this.keyPrefix}.BOOKS.ITEM_2.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_3.TITLE`, year: '2019', genre: `${this.keyPrefix}.BOOKS.ITEM_3.GENRE` },
  ];
}
