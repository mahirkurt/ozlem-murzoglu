import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-ursula-leguin',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './ursula-leguin.component.html',
  styleUrl: './ursula-leguin.component.css',
})
export class UrsulaLeguinComponent {
  private readonly keyPrefix = 'SAYGIYLA.PIONEERS.URSULA_LEGUIN';

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_RESPECT', link: '/saygiyla' },
    { label: `${this.keyPrefix}.NAME` }
  ];
  timeline = [
    { year: '1929', event: `${this.keyPrefix}.TIMELINE.ITEM_1` },
    { year: '1951', event: `${this.keyPrefix}.TIMELINE.ITEM_2` },
    { year: '1952', event: `${this.keyPrefix}.TIMELINE.ITEM_3` },
    { year: '1968', event: `${this.keyPrefix}.TIMELINE.ITEM_4` },
    { year: '1969', event: `${this.keyPrefix}.TIMELINE.ITEM_5` },
    { year: '1974', event: `${this.keyPrefix}.TIMELINE.ITEM_6` },
    { year: '2003', event: `${this.keyPrefix}.TIMELINE.ITEM_7` },
    { year: '2018', event: `${this.keyPrefix}.TIMELINE.ITEM_8` },
  ];

  contributions = [
    {
      icon: 'menu_book',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.DESCRIPTION`,
    },
    {
      icon: 'diversity_3',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.DESCRIPTION`,
    },
    {
      icon: 'psychology',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.DESCRIPTION`,
    },
    {
      icon: 'child_care',
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
  ];

  books = [
    { title: `${this.keyPrefix}.BOOKS.ITEM_1.TITLE`, year: '1968', genre: `${this.keyPrefix}.BOOKS.ITEM_1.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_2.TITLE`, year: '1969', genre: `${this.keyPrefix}.BOOKS.ITEM_2.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_3.TITLE`, year: '1970', genre: `${this.keyPrefix}.BOOKS.ITEM_3.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_4.TITLE`, year: '1972', genre: `${this.keyPrefix}.BOOKS.ITEM_4.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_5.TITLE`, year: '1974', genre: `${this.keyPrefix}.BOOKS.ITEM_5.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_6.TITLE`, year: '1990', genre: `${this.keyPrefix}.BOOKS.ITEM_6.GENRE` },
  ];
}
