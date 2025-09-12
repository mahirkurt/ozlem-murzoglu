import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  animation,
  useAnimation,
  query,
  stagger,
  group,
  AnimationTriggerMetadata,
} from '@angular/animations';

/**
 * Micro-interactions Library
 * Small, delightful animations that enhance user experience
 */

// =============================================
// Animation Timings & Easings
// =============================================

export const MICRO_TIMINGS = {
  instant: '50ms',
  fast: '100ms',
  quick: '200ms',
  normal: '300ms',
  smooth: '400ms',
  slow: '600ms',
};

export const MICRO_EASINGS = {
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// =============================================
// Button Interactions
// =============================================

export const buttonPress = trigger('buttonPress', [
  transition('* => pressed', [
    animate(MICRO_TIMINGS.fast + ' ' + MICRO_EASINGS.sharp, style({ transform: 'scale(0.95)' })),
  ]),
  transition('pressed => idle', [
    animate(MICRO_TIMINGS.quick + ' ' + MICRO_EASINGS.bounce, style({ transform: 'scale(1)' })),
  ]),
]);

export const buttonRipple = trigger('buttonRipple', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'scale(0)',
      position: 'absolute',
      borderRadius: '50%',
      background: 'currentColor',
    }),
    animate(
      MICRO_TIMINGS.smooth + ' ' + MICRO_EASINGS.smooth,
      style({
        opacity: 0.25,
        transform: 'scale(2.5)',
      })
    ),
    animate(MICRO_TIMINGS.quick, style({ opacity: 0 })),
  ]),
]);

export const buttonSuccess = trigger('buttonSuccess', [
  transition('* => success', [
    animate(
      MICRO_TIMINGS.quick,
      keyframes([
        style({ backgroundColor: '#4CAF50', transform: 'scale(1)' }),
        style({ transform: 'scale(1.05)' }),
        style({ transform: 'scale(1)' }),
      ])
    ),
  ]),
]);

// =============================================
// Icon Interactions
// =============================================

export const iconRotate = trigger('iconRotate', [
  transition('* => rotate', [
    animate(
      MICRO_TIMINGS.smooth + ' ' + MICRO_EASINGS.smooth,
      style({ transform: 'rotate(360deg)' })
    ),
  ]),
]);

export const iconBounce = trigger('iconBounce', [
  transition('* => bounce', [
    animate(
      MICRO_TIMINGS.slow,
      keyframes([
        style({ transform: 'translateY(0)' }),
        style({ transform: 'translateY(-20px)' }),
        style({ transform: 'translateY(0)' }),
        style({ transform: 'translateY(-10px)' }),
        style({ transform: 'translateY(0)' }),
      ])
    ),
  ]),
]);

export const iconPulse = trigger('iconPulse', [
  state('pulse', style({ transform: 'scale(1)' })),
  transition('* => pulse', [
    animate(
      MICRO_TIMINGS.smooth,
      keyframes([
        style({ transform: 'scale(1)' }),
        style({ transform: 'scale(1.3)' }),
        style({ transform: 'scale(1)' }),
      ])
    ),
  ]),
]);

export const heartBeat = trigger('heartBeat', [
  transition('* => beat', [
    animate(
      '800ms',
      keyframes([
        style({ transform: 'scale(1)' }),
        style({ transform: 'scale(1.3)' }),
        style({ transform: 'scale(1)' }),
        style({ transform: 'scale(1.3)' }),
        style({ transform: 'scale(1)' }),
      ])
    ),
  ]),
]);

// =============================================
// Form Interactions
// =============================================

export const inputFocus = trigger('inputFocus', [
  state(
    'focused',
    style({
      borderColor: 'var(--md-sys-color-primary)',
      boxShadow: '0 0 0 3px rgba(0, 137, 123, 0.1)',
    })
  ),
  state(
    'blurred',
    style({
      borderColor: 'var(--md-sys-color-outline)',
      boxShadow: 'none',
    })
  ),
  transition('blurred => focused', [animate(MICRO_TIMINGS.quick + ' ' + MICRO_EASINGS.smooth)]),
  transition('focused => blurred', [animate(MICRO_TIMINGS.quick + ' ' + MICRO_EASINGS.smooth)]),
]);

export const inputError = trigger('inputError', [
  transition('* => error', [
    animate(
      MICRO_TIMINGS.quick,
      keyframes([
        style({ transform: 'translateX(0)' }),
        style({ transform: 'translateX(-10px)' }),
        style({ transform: 'translateX(10px)' }),
        style({ transform: 'translateX(-10px)' }),
        style({ transform: 'translateX(10px)' }),
        style({ transform: 'translateX(0)' }),
      ])
    ),
  ]),
]);

export const checkboxCheck = trigger('checkboxCheck', [
  transition('unchecked => checked', [
    animate(
      MICRO_TIMINGS.quick + ' ' + MICRO_EASINGS.bounce,
      keyframes([
        style({ transform: 'scale(0)', opacity: 0 }),
        style({ transform: 'scale(1.2)', opacity: 1 }),
        style({ transform: 'scale(1)', opacity: 1 }),
      ])
    ),
  ]),
  transition('checked => unchecked', [
    animate(MICRO_TIMINGS.fast, style({ transform: 'scale(0)', opacity: 0 })),
  ]),
]);

// =============================================
// Card Interactions
// =============================================

export const cardHover = trigger('cardHover', [
  state(
    'idle',
    style({
      transform: 'translateY(0) scale(1)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    })
  ),
  state(
    'hovered',
    style({
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
    })
  ),
  transition('idle <=> hovered', [animate(MICRO_TIMINGS.normal + ' ' + MICRO_EASINGS.smooth)]),
]);

export const cardFlip = trigger('cardFlip', [
  state(
    'front',
    style({
      transform: 'rotateY(0)',
    })
  ),
  state(
    'back',
    style({
      transform: 'rotateY(180deg)',
    })
  ),
  transition('front <=> back', [animate(MICRO_TIMINGS.smooth + ' ' + MICRO_EASINGS.smooth)]),
]);

export const cardExpand = trigger('cardExpand', [
  state(
    'collapsed',
    style({
      height: '0',
      opacity: 0,
      overflow: 'hidden',
    })
  ),
  state(
    'expanded',
    style({
      height: '*',
      opacity: 1,
    })
  ),
  transition('collapsed <=> expanded', [
    animate(MICRO_TIMINGS.normal + ' ' + MICRO_EASINGS.smooth),
  ]),
]);

// =============================================
// Loading Interactions
// =============================================

export const shimmer = trigger('shimmer', [
  state(
    'shimmer',
    style({
      background: `linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.5) 50%,
      rgba(255,255,255,0) 100%
    )`,
    })
  ),
  transition('* => shimmer', [
    animate(
      '1.5s ease-in-out infinite',
      keyframes([style({ backgroundPosition: '-200% 0' }), style({ backgroundPosition: '200% 0' })])
    ),
  ]),
]);

export const skeleton = trigger('skeleton', [
  state(
    'loading',
    style({
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
    })
  ),
  transition('* => loading', [
    animate('1.5s ease-in-out infinite', style({ backgroundPosition: '200% 0' })),
  ]),
]);

export const spinner = trigger('spinner', [
  state(
    'spinning',
    style({
      transform: 'rotate(360deg)',
    })
  ),
  transition('* => spinning', [animate('1s linear infinite')]),
]);

// =============================================
// Notification Interactions
// =============================================

export const slideInNotification = trigger('slideInNotification', [
  transition(':enter', [
    style({
      transform: 'translateX(100%)',
      opacity: 0,
    }),
    animate(
      MICRO_TIMINGS.normal + ' ' + MICRO_EASINGS.smooth,
      style({
        transform: 'translateX(0)',
        opacity: 1,
      })
    ),
  ]),
  transition(':leave', [
    animate(
      MICRO_TIMINGS.normal + ' ' + MICRO_EASINGS.smooth,
      style({
        transform: 'translateX(100%)',
        opacity: 0,
      })
    ),
  ]),
]);

export const popNotification = trigger('popNotification', [
  transition(':enter', [
    style({
      transform: 'scale(0)',
      opacity: 0,
    }),
    animate(
      MICRO_TIMINGS.quick + ' ' + MICRO_EASINGS.bounce,
      style({
        transform: 'scale(1)',
        opacity: 1,
      })
    ),
  ]),
  transition(':leave', [
    animate(
      MICRO_TIMINGS.fast,
      style({
        transform: 'scale(0)',
        opacity: 0,
      })
    ),
  ]),
]);

// =============================================
// Menu Interactions
// =============================================

export const menuSlide = trigger('menuSlide', [
  state(
    'closed',
    style({
      height: '0',
      opacity: 0,
      overflow: 'hidden',
    })
  ),
  state(
    'open',
    style({
      height: '*',
      opacity: 1,
    })
  ),
  transition('closed <=> open', [animate(MICRO_TIMINGS.normal + ' ' + MICRO_EASINGS.smooth)]),
]);

export const menuItemStagger = trigger('menuItemStagger', [
  transition('* => open', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        stagger('50ms', [
          animate(
            MICRO_TIMINGS.quick + ' ' + MICRO_EASINGS.smooth,
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);

// =============================================
// Fab Button Interactions
// =============================================

export const fabExpand = trigger('fabExpand', [
  state(
    'collapsed',
    style({
      width: '56px',
      borderRadius: '50%',
    })
  ),
  state(
    'expanded',
    style({
      width: '200px',
      borderRadius: '28px',
    })
  ),
  transition('collapsed <=> expanded', [
    animate(MICRO_TIMINGS.normal + ' ' + MICRO_EASINGS.smooth),
  ]),
]);

export const fabMenu = trigger('fabMenu', [
  transition(':enter', [
    query('.fab-item', [
      style({ opacity: 0, transform: 'scale(0)' }),
      stagger('30ms', [
        animate(
          MICRO_TIMINGS.quick + ' ' + MICRO_EASINGS.bounce,
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
    ]),
  ]),
  transition(':leave', [
    query('.fab-item', [
      stagger('30ms', [animate(MICRO_TIMINGS.fast, style({ opacity: 0, transform: 'scale(0)' }))]),
    ]),
  ]),
]);

// =============================================
// Progress Interactions
// =============================================

export const progressFill = trigger('progressFill', [
  transition(
    '* => fill',
    [
      style({ width: '0%' }),
      animate('{{duration}} ' + MICRO_EASINGS.smooth, style({ width: '{{progress}}%' })),
    ],
    { params: { duration: '1s', progress: 100 } }
  ),
]);

export const circularProgress = trigger('circularProgress', [
  state(
    'progress',
    style({
      strokeDasharray: '{{circumference}}',
      strokeDashoffset: '{{offset}}',
    }),
    { params: { circumference: 283, offset: 0 } }
  ),
  transition('* => progress', [animate(MICRO_TIMINGS.smooth + ' ' + MICRO_EASINGS.smooth)]),
]);

// =============================================
// Tooltip Interactions
// =============================================

export const tooltip = trigger('tooltip', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate(
      MICRO_TIMINGS.fast + ' ' + MICRO_EASINGS.smooth,
      style({ opacity: 1, transform: 'scale(1)' })
    ),
  ]),
  transition(':leave', [
    animate(MICRO_TIMINGS.fast, style({ opacity: 0, transform: 'scale(0.8)' })),
  ]),
]);

// =============================================
// Tab Interactions
// =============================================

export const tabSwitch = trigger('tabSwitch', [
  transition('* => left', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate(
      MICRO_TIMINGS.normal + ' ' + MICRO_EASINGS.smooth,
      style({ transform: 'translateX(0)', opacity: 1 })
    ),
  ]),
  transition('* => right', [
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate(
      MICRO_TIMINGS.normal + ' ' + MICRO_EASINGS.smooth,
      style({ transform: 'translateX(0)', opacity: 1 })
    ),
  ]),
]);

// =============================================
// Scroll Interactions
// =============================================

export const parallax = trigger('parallax', [
  state(
    'scrolled',
    style({
      transform: 'translateY({{offset}}px)',
    }),
    { params: { offset: 0 } }
  ),
  transition('* => scrolled', [animate('0ms')]),
]);

export const scrollFade = trigger('scrollFade', [
  state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
  state('hidden', style({ opacity: 0, transform: 'translateY(20px)' })),
  transition('hidden => visible', [animate(MICRO_TIMINGS.smooth + ' ' + MICRO_EASINGS.smooth)]),
]);

// =============================================
// Helper Functions
// =============================================

export function createMicroAnimation(
  name: string,
  timing: string = MICRO_TIMINGS.normal,
  easing: string = MICRO_EASINGS.smooth
): AnimationTriggerMetadata {
  return trigger(name, [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(`${timing} ${easing}`, style({ opacity: 1 })),
    ]),
    transition(':leave', [animate(`${timing} ${easing}`, style({ opacity: 0 }))]),
  ]);
}

// =============================================
// Export All Micro-interactions
// =============================================

export const ALL_MICRO_INTERACTIONS = [
  buttonPress,
  buttonRipple,
  buttonSuccess,
  iconRotate,
  iconBounce,
  iconPulse,
  heartBeat,
  inputFocus,
  inputError,
  checkboxCheck,
  cardHover,
  cardFlip,
  cardExpand,
  shimmer,
  skeleton,
  spinner,
  slideInNotification,
  popNotification,
  menuSlide,
  menuItemStagger,
  fabExpand,
  fabMenu,
  progressFill,
  circularProgress,
  tooltip,
  tabSwitch,
  parallax,
  scrollFade,
];
