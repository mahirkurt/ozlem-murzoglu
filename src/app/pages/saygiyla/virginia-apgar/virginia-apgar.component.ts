import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-virginia-apgar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './virginia-apgar.component.html',
  styleUrl: './virginia-apgar.component.css',
})
export class VirginiaApgarComponent {
  private readonly keyPrefix = 'SAYGIYLA.PIONEERS.VIRGINIA_APGAR';

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_RESPECT', link: '/saygiyla' },
    { label: `${this.keyPrefix}.NAME` }
  ];
  timeline = [
    { year: '1909', event: `${this.keyPrefix}.TIMELINE.ITEM_1` },
    { year: '1929', event: `${this.keyPrefix}.TIMELINE.ITEM_2` },
    { year: '1933', event: `${this.keyPrefix}.TIMELINE.ITEM_3` },
    { year: '1937', event: `${this.keyPrefix}.TIMELINE.ITEM_4` },
    { year: '1938', event: `${this.keyPrefix}.TIMELINE.ITEM_5` },
    { year: '1949', event: `${this.keyPrefix}.TIMELINE.ITEM_6` },
    { year: '1952', event: `${this.keyPrefix}.TIMELINE.ITEM_7` },
    { year: '1953', event: `${this.keyPrefix}.TIMELINE.ITEM_8` },
    { year: '1959', event: `${this.keyPrefix}.TIMELINE.ITEM_9` },
    { year: '1959', event: `${this.keyPrefix}.TIMELINE.ITEM_10` },
    { year: '1973', event: `${this.keyPrefix}.TIMELINE.ITEM_11` },
    { year: '1974', event: `${this.keyPrefix}.TIMELINE.ITEM_12` },
  ];

  contributions = [
    {
      icon: 'child_care',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_1.DESCRIPTION`,
    },
    {
      icon: 'local_hospital',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_2.DESCRIPTION`,
    },
    {
      icon: 'pregnant_woman',
      title: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.TITLE`,
      description: `${this.keyPrefix}.CONTRIBUTIONS.ITEM_3.DESCRIPTION`,
    },
    {
      icon: 'campaign',
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

  apgarScore = [
    {
      criterion: `${this.keyPrefix}.APGAR_SCORE.ITEM_1.CRITERION`,
      score0: `${this.keyPrefix}.APGAR_SCORE.ITEM_1.SCORE_0`,
      score1: `${this.keyPrefix}.APGAR_SCORE.ITEM_1.SCORE_1`,
      score2: `${this.keyPrefix}.APGAR_SCORE.ITEM_1.SCORE_2`,
    },
    {
      criterion: `${this.keyPrefix}.APGAR_SCORE.ITEM_2.CRITERION`,
      score0: `${this.keyPrefix}.APGAR_SCORE.ITEM_2.SCORE_0`,
      score1: `${this.keyPrefix}.APGAR_SCORE.ITEM_2.SCORE_1`,
      score2: `${this.keyPrefix}.APGAR_SCORE.ITEM_2.SCORE_2`,
    },
    {
      criterion: `${this.keyPrefix}.APGAR_SCORE.ITEM_3.CRITERION`,
      score0: `${this.keyPrefix}.APGAR_SCORE.ITEM_3.SCORE_0`,
      score1: `${this.keyPrefix}.APGAR_SCORE.ITEM_3.SCORE_1`,
      score2: `${this.keyPrefix}.APGAR_SCORE.ITEM_3.SCORE_2`,
    },
    {
      criterion: `${this.keyPrefix}.APGAR_SCORE.ITEM_4.CRITERION`,
      score0: `${this.keyPrefix}.APGAR_SCORE.ITEM_4.SCORE_0`,
      score1: `${this.keyPrefix}.APGAR_SCORE.ITEM_4.SCORE_1`,
      score2: `${this.keyPrefix}.APGAR_SCORE.ITEM_4.SCORE_2`,
    },
    {
      criterion: `${this.keyPrefix}.APGAR_SCORE.ITEM_5.CRITERION`,
      score0: `${this.keyPrefix}.APGAR_SCORE.ITEM_5.SCORE_0`,
      score1: `${this.keyPrefix}.APGAR_SCORE.ITEM_5.SCORE_1`,
      score2: `${this.keyPrefix}.APGAR_SCORE.ITEM_5.SCORE_2`,
    },
  ];

  books = [
    { title: `${this.keyPrefix}.BOOKS.ITEM_1.TITLE`, year: '1972', genre: `${this.keyPrefix}.BOOKS.ITEM_1.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_2.TITLE`, year: '1967', genre: `${this.keyPrefix}.BOOKS.ITEM_2.GENRE` },
    { title: `${this.keyPrefix}.BOOKS.ITEM_3.TITLE`, year: '1954', genre: `${this.keyPrefix}.BOOKS.ITEM_3.GENRE` },
  ];
}
