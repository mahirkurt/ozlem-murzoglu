import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  animateChild,
  state,
  keyframes,
} from '@angular/animations';

/**
 * MD3 Advanced Animation Library
 * Provides sophisticated animations following Material Design 3 principles
 */

// Easing functions matching MD3 specifications
export const EASING = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  legacy: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
};

// Duration tokens
export const DURATION = {
  instant: '0ms',
  fast: '100ms',
  quick: '200ms',
  moderate: '300ms',
  deliberate: '400ms',
  slow: '500ms',
  leisurely: '600ms',
  extended: '800ms',
};

/**
 * Stagger animation for list items
 * Items appear one by one with a subtle fade and slide effect
 */
export const staggerList = trigger('staggerList', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateY(20px) scale(0.98)',
        }),
        stagger('50ms', [
          animate(
            `${DURATION.deliberate} ${EASING.emphasizedDecelerate}`,
            style({
              opacity: 1,
              transform: 'translateY(0) scale(1)',
            })
          ),
        ]),
      ],
      { optional: true }
    ),

    query(
      ':leave',
      [
        stagger('30ms', [
          animate(
            `${DURATION.moderate} ${EASING.emphasizedAccelerate}`,
            style({
              opacity: 0,
              transform: 'translateY(-10px) scale(0.98)',
            })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);

/**
 * Card entrance animation with elevation
 */
export const cardEntrance = trigger('cardEntrance', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(30px) scale(0.95)',
      filter: 'blur(2px)',
    }),
    animate(
      `${DURATION.slow} ${EASING.emphasizedDecelerate}`,
      style({
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        filter: 'blur(0)',
      })
    ),
  ]),

  transition(':leave', [
    animate(
      `${DURATION.moderate} ${EASING.emphasizedAccelerate}`,
      style({
        opacity: 0,
        transform: 'translateY(-20px) scale(0.95)',
        filter: 'blur(2px)',
      })
    ),
  ]),
]);

/**
 * Fade and scale animation for modals/dialogs
 */
export const fadeScale = trigger('fadeScale', [
  state(
    'in',
    style({
      opacity: 1,
      transform: 'scale(1)',
    })
  ),

  transition('void => *', [
    style({
      opacity: 0,
      transform: 'scale(0.9)',
      transformOrigin: 'center center',
    }),
    animate(`${DURATION.deliberate} ${EASING.emphasizedDecelerate}`),
  ]),

  transition('* => void', [
    animate(
      `${DURATION.moderate} ${EASING.emphasizedAccelerate}`,
      style({
        opacity: 0,
        transform: 'scale(0.9)',
      })
    ),
  ]),
]);

/**
 * Slide animations for navigation transitions
 */
export const slideInOut = trigger('slideInOut', [
  transition('* => left', [
    style({ transform: 'translateX(100%)' }),
    animate(
      `${DURATION.deliberate} ${EASING.emphasizedDecelerate}`,
      style({ transform: 'translateX(0)' })
    ),
  ]),

  transition('left => *', [
    animate(
      `${DURATION.moderate} ${EASING.emphasizedAccelerate}`,
      style({ transform: 'translateX(-100%)' })
    ),
  ]),

  transition('* => right', [
    style({ transform: 'translateX(-100%)' }),
    animate(
      `${DURATION.deliberate} ${EASING.emphasizedDecelerate}`,
      style({ transform: 'translateX(0)' })
    ),
  ]),

  transition('right => *', [
    animate(
      `${DURATION.moderate} ${EASING.emphasizedAccelerate}`,
      style({ transform: 'translateX(100%)' })
    ),
  ]),
]);

/**
 * Expansion panel animation
 */
export const expandCollapse = trigger('expandCollapse', [
  state(
    'collapsed',
    style({
      height: '0',
      overflow: 'hidden',
      opacity: 0,
      padding: '0',
    })
  ),

  state(
    'expanded',
    style({
      height: '*',
      overflow: 'visible',
      opacity: 1,
      padding: '*',
    })
  ),

  transition('collapsed <=> expanded', [animate(`${DURATION.deliberate} ${EASING.emphasized}`)]),
]);

/**
 * Ripple effect animation
 */
export const ripple = trigger('ripple', [
  transition(':enter', [
    style({
      opacity: 0.4,
      transform: 'scale(0)',
      transformOrigin: 'center center',
    }),
    animate(
      `${DURATION.leisurely} ${EASING.standard}`,
      style({
        opacity: 0,
        transform: 'scale(2.5)',
      })
    ),
  ]),
]);

/**
 * Pulse animation for attention
 */
export const pulse = trigger('pulse', [
  state('pulse', style({ transform: 'scale(1)' })),

  transition('* => pulse', [
    animate(
      `${DURATION.extended} ${EASING.spring}`,
      keyframes([
        style({ transform: 'scale(1)', offset: 0 }),
        style({ transform: 'scale(1.05)', offset: 0.5 }),
        style({ transform: 'scale(1)', offset: 1 }),
      ])
    ),
  ]),
]);

/**
 * Shake animation for errors
 */
export const shake = trigger('shake', [
  transition('* => error', [
    animate(
      `${DURATION.moderate} ${EASING.spring}`,
      keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(-10px)', offset: 0.25 }),
        style({ transform: 'translateX(10px)', offset: 0.5 }),
        style({ transform: 'translateX(-10px)', offset: 0.75 }),
        style({ transform: 'translateX(0)', offset: 1 }),
      ])
    ),
  ]),
]);

/**
 * Success checkmark animation
 */
export const successCheck = trigger('successCheck', [
  transition(':enter', [
    style({
      strokeDasharray: 100,
      strokeDashoffset: 100,
      opacity: 0,
    }),
    animate(
      `${DURATION.slow} ${EASING.emphasizedDecelerate}`,
      style({
        strokeDashoffset: 0,
        opacity: 1,
      })
    ),
  ]),
]);

/**
 * Page transition animations
 */
export const pageTransition = trigger('pageTransition', [
  transition('* => *', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          width: '100%',
          height: '100%',
        }),
      ],
      { optional: true }
    ),

    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        }),
      ],
      { optional: true }
    ),

    query(
      ':leave',
      [
        animate(
          `${DURATION.moderate} ${EASING.emphasizedAccelerate}`,
          style({
            opacity: 0,
            transform: 'translateY(-20px)',
          })
        ),
      ],
      { optional: true }
    ),

    query(
      ':enter',
      [
        animate(
          `${DURATION.deliberate} ${EASING.emphasizedDecelerate}`,
          style({
            opacity: 1,
            transform: 'translateY(0)',
          })
        ),
      ],
      { optional: true }
    ),
  ]),
]);

/**
 * Skeleton loading animation
 */
export const skeletonLoading = trigger('skeletonLoading', [
  state('loading', style({ opacity: 1 })),

  transition('* => loading', [
    animate(
      `1500ms ${EASING.standard}`,
      keyframes([
        style({ opacity: 0.5, offset: 0 }),
        style({ opacity: 1, offset: 0.5 }),
        style({ opacity: 0.5, offset: 1 }),
      ])
    ),
  ]),
]);

/**
 * Number counter animation
 */
export const countUp = trigger('countUp', [
  transition(':increment', [
    animate(
      `${DURATION.moderate} ${EASING.emphasizedDecelerate}`,
      keyframes([
        style({ transform: 'translateY(0)', opacity: 1, offset: 0 }),
        style({ transform: 'translateY(-20px)', opacity: 0, offset: 0.5 }),
        style({ transform: 'translateY(20px)', opacity: 0, offset: 0.5 }),
        style({ transform: 'translateY(0)', opacity: 1, offset: 1 }),
      ])
    ),
  ]),

  transition(':decrement', [
    animate(
      `${DURATION.moderate} ${EASING.emphasizedDecelerate}`,
      keyframes([
        style({ transform: 'translateY(0)', opacity: 1, offset: 0 }),
        style({ transform: 'translateY(20px)', opacity: 0, offset: 0.5 }),
        style({ transform: 'translateY(-20px)', opacity: 0, offset: 0.5 }),
        style({ transform: 'translateY(0)', opacity: 1, offset: 1 }),
      ])
    ),
  ]),
]);

/**
 * Floating action button morph animation
 */
export const fabMorph = trigger('fabMorph', [
  state(
    'fab',
    style({
      width: '56px',
      height: '56px',
      borderRadius: '28px',
    })
  ),

  state(
    'dialog',
    style({
      width: '90vw',
      maxWidth: '560px',
      height: 'auto',
      minHeight: '200px',
      borderRadius: '28px',
    })
  ),

  transition('fab <=> dialog', [animate(`${DURATION.slow} ${EASING.emphasized}`)]),
]);

/**
 * Tab switching animation
 */
export const tabSwitch = trigger('tabSwitch', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateX(100px)',
        }),
        animate(
          `${DURATION.deliberate} ${EASING.emphasizedDecelerate}`,
          style({
            opacity: 1,
            transform: 'translateX(0)',
          })
        ),
      ],
      { optional: true }
    ),
  ]),
]);
