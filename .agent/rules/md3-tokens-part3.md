---
description: MD3 Token System Part 3 - Motion, Spring Physics and Expressive Easing (from _motion.scss)
globs: ["**/*.scss", "**/*.css", "**/*.html", "**/*.ts"]
---

# MD3 Token System - Part 3: Motion and Spring Physics

> **SOURCE**: src/styles/md3/_motion.scss (1275 lines)
> **Related**: See md3-tokens-part1.md for enforcement rules

---

## 1. EASING CURVES

### 1.1 Standard Easing (Basic UI)

```scss
--md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
--md-sys-motion-easing-standard-decelerate: cubic-bezier(0, 0, 0, 1);
--md-sys-motion-easing-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);
```

**Use for:** State layers, color transitions, simple hovers

### 1.2 Emphasized Easing (Attention)

```scss
--md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
--md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
--md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
```

**Use for:** Important transitions, menus, card hover lift

### 1.3 Expressive Easing (Spring Physics - BOUNCY)

```scss
--md-sys-motion-easing-expressive-standard: cubic-bezier(0.4, 1.4, 0.2, 1);
--md-sys-motion-easing-expressive-decelerate: cubic-bezier(0, 1.4, 0.2, 1);
--md-sys-motion-easing-expressive-accelerate: cubic-bezier(0.4, 0, 0.2, 1);
```

**Use for:** Modal entrance, FAB, hero reveals, shape morphing

### 1.4 Bounce Easing (Extra playful)

```scss
--md-sys-motion-easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--md-sys-motion-easing-bounce-in: cubic-bezier(0.6, -0.28, 0.735, 0.045);
--md-sys-motion-easing-bounce-out: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### 1.5 Spring Presets

```scss
--md-sys-motion-spring-soft: cubic-bezier(0.25, 0.8, 0.25, 1);    // Gentle
--md-sys-motion-spring-snappy: cubic-bezier(0.25, 1.25, 0.5, 1);  // Quick
--md-sys-motion-spring-wobbly: cubic-bezier(0.5, 1.5, 0.5, 0.8);  // Playful
--md-sys-motion-spring-stiff: cubic-bezier(0.3, 1.1, 0.6, 1);     // Professional
```

---

## 2. DURATION TOKENS

### 2.1 Short (Micro-interactions)

| Token | Value | Usage |
|-------|-------|-------|
| short1 | 50ms | Instant feedback |
| short2 | 100ms | State layer |
| short3 | 150ms | Quick feedback |
| short4 | 200ms | Standard UI |

### 2.2 Medium (Component transitions)

| Token | Value | Usage |
|-------|-------|-------|
| medium1 | 250ms | Component |
| medium2 | 300ms | Medium |
| medium3 | 350ms | Complex |
| medium4 | 400ms | **MAIN INTERACTION** |

### 2.3 Long (Layout changes)

| Token | Value | Usage |
|-------|-------|-------|
| long1 | 450ms | Layout shifts |
| long2 | 500ms | Page transitions |
| long3 | 550ms | Complex sequences |
| long4 | 600ms | Full layout |

### 2.4 Extra-Long (Hero moments)

| Token | Value | Usage |
|-------|-------|-------|
| extra-long1 | 700ms | Comprehensive |
| extra-long2 | 800ms | Hero moments |
| extra-long3 | 900ms | Dramatic reveals |
| extra-long4 | 1000ms | Maximum |

---

## 3. TRANSITION PRESETS

```scss
// Standard
--md-sys-transition-standard: 200ms cubic-bezier(0.2, 0, 0, 1);

// Emphasized
--md-sys-transition-emphasized: 300ms cubic-bezier(0.05, 0.7, 0.1, 1);
--md-sys-transition-emphasized-accelerate: 200ms cubic-bezier(0.3, 0, 0.8, 0.15);

// Expressive
--md-sys-transition-expressive: 400ms cubic-bezier(0.4, 1.4, 0.2, 1);
--md-sys-transition-expressive-decelerate: 500ms cubic-bezier(0, 1.4, 0.2, 1);

// Spring
--md-sys-transition-spring-soft: 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
--md-sys-transition-spring-snappy: 200ms cubic-bezier(0.25, 1.25, 0.5, 1);
--md-sys-transition-spring-wobbly: 400ms cubic-bezier(0.5, 1.5, 0.5, 0.8);
```

---

## 4. KEYFRAME ANIMATIONS

### 4.1 Fade

```scss
fadeIn, fadeOut, fadeInUp, fadeInDown, fadeInScale
```

### 4.2 Scale

```scss
scaleIn, scaleOut, scaleInBounce, pulseScale
```

### 4.3 Slide

```scss
slideInUp, slideOutUp, slideInDown, slideOutDown,
slideInLeft, slideOutLeft, slideInRight, slideOutRight
```

### 4.4 Modal/Dialog

```scss
modalEnter, modalExit, dialogSlideUp
```

### 4.5 Hero

```scss
heroImageReveal, heroTextReveal
```

### 4.6 Skeleton

```scss
skeletonShimmer, skeletonPulse
```

### 4.7 Attention

```scss
shakeX, bounce, pulse, wiggle, heartbeat, tada, jello
```

---

## 5. STAGGER DELAYS

```scss
--md-sys-motion-stagger-delay: 50ms;      // Default between items
--md-sys-motion-stagger-delay-fast: 30ms; // Fast sequences
--md-sys-motion-stagger-delay-slow: 80ms; // Slow sequences
```

---

## 6. USAGE PATTERNS

### Hover Effect
```scss
.card:hover {
  transform: translateY(-2px);
  transition: var(--md-sys-transition-standard);
}
```

### Modal Entrance
```scss
.modal {
  animation: modalEnter
    var(--md-sys-motion-duration-medium4)
    var(--md-sys-motion-easing-expressive-decelerate) forwards;
}
```

### Staggered Entry
```scss
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
```

### Shape Morphing
```scss
.button:hover {
  border-radius: var(--md-sys-shape-corner-extra-large);
  transition: border-radius var(--md-sys-motion-duration-medium2)
              var(--md-sys-motion-easing-expressive-standard);
}
```

---

## 7. REDUCED MOTION

```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

*This completes MD3 Motion Token reference.*
