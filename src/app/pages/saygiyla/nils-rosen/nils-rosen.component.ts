import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-nils-rosen',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './nils-rosen.component.html',
  styleUrl: './nils-rosen.component.css',
})
export class NilsRosenComponent {
  private readonly keyPrefix = 'SAYGIYLA.PIONEERS.NILS_ROSEN';

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_RESPECT', link: '/saygiyla' },
    { label: `${this.keyPrefix}.NAME` }
  ];
  timeline = [
    { year: '1884', event: `${this.keyPrefix}.TIMELINE.ITEM_1` },
    { year: '1909', event: `${this.keyPrefix}.TIMELINE.ITEM_2` },
    { year: '1912', event: `${this.keyPrefix}.TIMELINE.ITEM_3` },
    { year: '1920', event: `${this.keyPrefix}.TIMELINE.ITEM_4` },
    { year: '1928', event: `${this.keyPrefix}.TIMELINE.ITEM_5` },
    { year: '1935', event: `${this.keyPrefix}.TIMELINE.ITEM_6` },
    { year: '1940', event: `${this.keyPrefix}.TIMELINE.ITEM_7` },
    { year: '1945', event: `${this.keyPrefix}.TIMELINE.ITEM_8` },
    { year: '1950', event: `${this.keyPrefix}.TIMELINE.ITEM_9` },
    { year: '1963', event: `${this.keyPrefix}.TIMELINE.ITEM_10` },
  ];

  contributions = [
    {
      icon: 'child_care',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.DESCRIPTION`,
    },
    {
      icon: 'thermostat',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.DESCRIPTION`,
    },
    {
      icon: 'healing',
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
  ];

  books = [
    { title: `${this.keyPrefix}.BOOKS.ITEM_1.TITLE`, year: '1935', genre: `${this.keyPrefix}.BOOKS.ITEM_1.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_2.TITLE`, year: '1940', genre: `${this.keyPrefix}.BOOKS.ITEM_2.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_3.TITLE`, year: '1955', genre: `${this.keyPrefix}.BOOKS.ITEM_3.GENRE` },
  ];
}
