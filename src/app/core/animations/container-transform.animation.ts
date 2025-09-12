import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  animateChild,
  group,
  sequence,
  stagger,
} from '@angular/animations';

/**
 * MD3 Container Transform Animation
 * Gelişmiş hareket koreografisi için container transform pattern
 */

// MD3 Motion Tokens
const DURATION = {
  short: '250ms',
  medium: '400ms',
  long: '500ms',
  extraLong: '600ms',
};

const EASING = {
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
  standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
};

/**
 * Container Transform - List to Detail
 * Bir liste öğesinden detay görünümüne geçiş
 */
export const containerTransform = trigger('containerTransform', [
  transition(
    'list => detail',
    [
      // Başlangıç durumu: Liste öğesi pozisyonu ve boyutu
      query(
        ':enter',
        [
          style({
            position: 'fixed',
            top: '{{ originY }}px',
            left: '{{ originX }}px',
            width: '{{ originWidth }}px',
            height: '{{ originHeight }}px',
            opacity: 0,
            transform: 'scale(0.8)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
          }),
        ],
        { optional: true }
      ),

      // Çıkış animasyonu: Liste öğesi fade out
      query(
        ':leave',
        [
          animate(
            `${DURATION.short} ${EASING.emphasizedAccelerate}`,
            style({
              opacity: 0,
              transform: 'scale(0.95)',
            })
          ),
        ],
        { optional: true }
      ),

      // Giriş animasyonu: Detay görünümü expand
      query(
        ':enter',
        [
          animate(
            `${DURATION.medium} ${EASING.emphasizedDecelerate}`,
            style({
              position: 'relative',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 1,
              transform: 'scale(1)',
              borderRadius: 'var(--md-sys-shape-corner-none)',
            })
          ),
        ],
        { optional: true }
      ),
    ],
    {
      params: {
        originX: 0,
        originY: 0,
        originWidth: 300,
        originHeight: 200,
      },
    }
  ),

  transition('detail => list', [
    // Detaydan listeye dönüş - ters animasyon
    group([
      query(
        ':leave',
        [
          animate(
            `${DURATION.medium} ${EASING.emphasizedAccelerate}`,
            style({
              opacity: 0,
              transform: 'scale(1.1) translateY(-20px)',
            })
          ),
        ],
        { optional: true }
      ),

      query(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'scale(0.9) translateY(20px)',
          }),
          animate(
            `${DURATION.medium} 100ms ${EASING.emphasizedDecelerate}`,
            style({
              opacity: 1,
              transform: 'scale(1) translateY(0)',
            })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);

/**
 * Shared Axis Transition
 * Yatay veya dikey eksende paylaşımlı geçiş
 */
export const sharedAxisTransition = trigger('sharedAxis', [
  // X ekseni (yatay) geçişler
  transition('* => slideLeft', [
    query(
      ':enter',
      [
        style({ transform: 'translateX(100%)' }),
        animate(`${DURATION.medium} ${EASING.emphasized}`, style({ transform: 'translateX(0)' })),
      ],
      { optional: true }
    ),

    query(
      ':leave',
      [
        animate(
          `${DURATION.medium} ${EASING.emphasized}`,
          style({ transform: 'translateX(-100%)' })
        ),
      ],
      { optional: true }
    ),
  ]),

  transition('* => slideRight', [
    query(
      ':enter',
      [
        style({ transform: 'translateX(-100%)' }),
        animate(`${DURATION.medium} ${EASING.emphasized}`, style({ transform: 'translateX(0)' })),
      ],
      { optional: true }
    ),

    query(
      ':leave',
      [
        animate(
          `${DURATION.medium} ${EASING.emphasized}`,
          style({ transform: 'translateX(100%)' })
        ),
      ],
      { optional: true }
    ),
  ]),

  // Y ekseni (dikey) geçişler
  transition('* => slideUp', [
    query(
      ':enter',
      [
        style({ transform: 'translateY(100%)' }),
        animate(`${DURATION.medium} ${EASING.emphasized}`, style({ transform: 'translateY(0)' })),
      ],
      { optional: true }
    ),

    query(
      ':leave',
      [
        animate(
          `${DURATION.medium} ${EASING.emphasized}`,
          style({ transform: 'translateY(-100%)' })
        ),
      ],
      { optional: true }
    ),
  ]),

  transition('* => slideDown', [
    query(
      ':enter',
      [
        style({ transform: 'translateY(-100%)' }),
        animate(`${DURATION.medium} ${EASING.emphasized}`, style({ transform: 'translateY(0)' })),
      ],
      { optional: true }
    ),

    query(
      ':leave',
      [
        animate(
          `${DURATION.medium} ${EASING.emphasized}`,
          style({ transform: 'translateY(100%)' })
        ),
      ],
      { optional: true }
    ),
  ]),
]);

/**
 * Fade Through Pattern
 * Birbiriyle ilişkisiz öğeler arası geçiş
 */
export const fadeThroughTransition = trigger('fadeThrough', [
  transition('* <=> *', [
    group([
      query(
        ':leave',
        [
          animate(
            `${DURATION.short} ${EASING.emphasizedAccelerate}`,
            style({
              opacity: 0,
              transform: 'scale(0.92)',
            })
          ),
        ],
        { optional: true }
      ),

      query(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'scale(0.92)',
          }),
          animate(
            `${DURATION.medium} 90ms ${EASING.emphasizedDecelerate}`,
            style({
              opacity: 1,
              transform: 'scale(1)',
            })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);

/**
 * Choreographed Stagger
 * Birden fazla öğenin koreografili giriş animasyonu
 */
export const choreographedStagger = trigger('choreographedStagger', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateY(30px) scale(0.95)',
        }),
        stagger('50ms', [
          animate(
            `${DURATION.medium} ${EASING.emphasizedDecelerate}`,
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
        stagger('-30ms', [
          animate(
            `${DURATION.short} ${EASING.emphasizedAccelerate}`,
            style({
              opacity: 0,
              transform: 'translateY(-20px) scale(0.95)',
            })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);

/**
 * Morphing FAB
 * FAB'ın form veya modal'a dönüşmesi
 */
export const morphingFAB = trigger('morphingFAB', [
  state(
    'fab',
    style({
      borderRadius: 'var(--md-sys-shape-corner-large)',
      width: '56px',
      height: '56px',
      position: 'fixed',
      bottom: '16px',
      right: '16px',
    })
  ),

  state(
    'expanded',
    style({
      borderRadius: 'var(--md-sys-shape-corner-extra-large)',
      width: '90vw',
      maxWidth: '600px',
      height: '80vh',
      maxHeight: '800px',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    })
  ),

  transition('fab => expanded', [
    sequence([
      // Önce FAB'ı büyüt
      animate(
        `${DURATION.short} ${EASING.emphasizedAccelerate}`,
        style({
          transform: 'scale(1.2)',
          borderRadius: 'var(--md-sys-shape-corner-full)',
        })
      ),
      // Sonra morph et
      group([
        animate(
          `${DURATION.long} ${EASING.emphasizedDecelerate}`,
          style({
            width: '90vw',
            maxWidth: '600px',
            height: '80vh',
            maxHeight: '800px',
            borderRadius: 'var(--md-sys-shape-corner-extra-large)',
          })
        ),
        animate(
          `${DURATION.medium} ${EASING.emphasized}`,
          style({
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          })
        ),
      ]),
    ]),
  ]),

  transition('expanded => fab', [
    sequence([
      // Önce pozisyonu ayarla
      animate(
        `${DURATION.medium} ${EASING.emphasizedAccelerate}`,
        style({
          width: '56px',
          height: '56px',
          borderRadius: 'var(--md-sys-shape-corner-full)',
        })
      ),
      // Sonra yerine dön
      animate(
        `${DURATION.short} ${EASING.emphasizedDecelerate}`,
        style({
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          top: 'auto',
          left: 'auto',
          transform: 'none',
          borderRadius: 'var(--md-sys-shape-corner-large)',
        })
      ),
    ]),
  ]),
]);

/**
 * Card Flip Animation
 * 3D kart çevirme animasyonu
 */
export const cardFlip = trigger('cardFlip', [
  state(
    'front',
    style({
      transform: 'rotateY(0deg)',
    })
  ),

  state(
    'back',
    style({
      transform: 'rotateY(180deg)',
    })
  ),

  transition('front => back', [
    animate(
      `${DURATION.medium} ${EASING.emphasized}`,
      style({
        transform: 'rotateY(180deg)',
      })
    ),
  ]),

  transition('back => front', [
    animate(
      `${DURATION.medium} ${EASING.emphasized}`,
      style({
        transform: 'rotateY(0deg)',
      })
    ),
  ]),
]);

/**
 * Elevation Change
 * Yükseklik değişimi animasyonu
 */
export const elevationChange = trigger('elevationChange', [
  transition(':increment', [
    animate(
      `${DURATION.short} ${EASING.emphasizedDecelerate}`,
      style({
        transform: 'translateZ(8px)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.24)',
      })
    ),
  ]),

  transition(':decrement', [
    animate(
      `${DURATION.short} ${EASING.emphasizedAccelerate}`,
      style({
        transform: 'translateZ(0)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12)',
      })
    ),
  ]),
]);

/**
 * Advanced Route Animations
 * Route değişimlerinde kullanılacak gelişmiş animasyonlar
 */
export const routeAnimations = trigger('routeAnimations', [
  transition('HomePage => ServicePage', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
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
          transform: 'translateX(100%) scale(0.95)',
        }),
      ],
      { optional: true }
    ),

    group([
      query(
        ':leave',
        [
          animate(
            `${DURATION.medium} ${EASING.emphasizedAccelerate}`,
            style({
              opacity: 0,
              transform: 'translateX(-30%) scale(0.95)',
            })
          ),
        ],
        { optional: true }
      ),

      query(
        ':enter',
        [
          animate(
            `${DURATION.medium} ${EASING.emphasizedDecelerate}`,
            style({
              opacity: 1,
              transform: 'translateX(0) scale(1)',
            })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),

  // Diğer route geçişleri için fade through
  transition('* <=> *', [fadeThroughTransition]),
]);

/**
 * Reveal Animation
 * İçerik ortaya çıkarma animasyonu
 */
export const revealAnimation = trigger('reveal', [
  transition(':enter', [
    style({
      clipPath: 'circle(0% at 50% 50%)',
      opacity: 0,
    }),
    animate(
      `${DURATION.long} ${EASING.emphasizedDecelerate}`,
      style({
        clipPath: 'circle(150% at 50% 50%)',
        opacity: 1,
      })
    ),
  ]),

  transition(':leave', [
    animate(
      `${DURATION.medium} ${EASING.emphasizedAccelerate}`,
      style({
        clipPath: 'circle(0% at 50% 50%)',
        opacity: 0,
      })
    ),
  ]),
]);

/**
 * Pull to Refresh Animation
 * Aşağı çekip yenileme animasyonu
 */
export const pullToRefresh = trigger('pullToRefresh', [
  state(
    'idle',
    style({
      transform: 'translateY(0) rotate(0deg)',
    })
  ),

  state(
    'pulling',
    style({
      transform: 'translateY({{ pullDistance }}px) rotate({{ rotation }}deg)',
    }),
    { params: { pullDistance: 0, rotation: 0 } }
  ),

  state(
    'refreshing',
    style({
      transform: 'translateY(60px) rotate(720deg)',
    })
  ),

  transition('idle => pulling', [animate('0ms')]),

  transition('pulling => refreshing', [animate(`${DURATION.medium} ${EASING.emphasized}`)]),

  transition('refreshing => idle', [animate(`${DURATION.short} ${EASING.emphasizedDecelerate}`)]),
]);
