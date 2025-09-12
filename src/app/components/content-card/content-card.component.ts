import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-content-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="content-card"
      [class.content-card--elevated]="elevated"
      [class.content-card--outlined]="outlined"
      [class.content-card--interactive]="interactive"
      [@cardAnimation]="animationState"
    >
      <div class="content-card__inner">
        <ng-content></ng-content>
      </div>
    </article>
  `,
  styleUrls: ['./content-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('cardAnimation', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms cubic-bezier(0.4, 0, 0.2, 1)'),
      ]),
    ]),
  ],
})
export class ContentCardComponent {
  @Input() elevated: boolean = true;
  @Input() outlined: boolean = false;
  @Input() interactive: boolean = false;

  animationState = 'in';
}
