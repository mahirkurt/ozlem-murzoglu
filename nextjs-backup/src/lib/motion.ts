import { Variants } from 'framer-motion'

// Easing curves based on Material Design 3
export const easing = {
  standard: [0.2, 0.0, 0, 1.0],
  decelerated: [0.0, 0.0, 0, 1.0],
  accelerated: [0.3, 0.0, 1.0, 1.0],
  emphasized: [0.2, 0.0, 0, 1.0]
} as const

// Duration tokens based on Material Design 3
export const duration = {
  short1: 0.05,
  short2: 0.1,
  short3: 0.15,
  short4: 0.2,
  medium1: 0.25,
  medium2: 0.3,
  medium3: 0.35,
  medium4: 0.4,
  long1: 0.45,
  long2: 0.5,
  long3: 0.55,
  long4: 0.6
} as const

// Common animation variants
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: duration.short4,
      ease: easing.standard
    }
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.short4,
      ease: easing.standard
    }
  }
}

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: duration.medium2,
      ease: easing.standard
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.medium2,
      ease: easing.standard
    }
  }
}

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    transition: {
      duration: duration.medium2,
      ease: easing.standard
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.medium2,
      ease: easing.standard
    }
  }
}

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
    transition: {
      duration: duration.medium2,
      ease: easing.standard
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.medium2,
      ease: easing.standard
    }
  }
}

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
    transition: {
      duration: duration.medium2,
      ease: easing.standard
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.medium2,
      ease: easing.standard
    }
  }
}

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: duration.short4,
      ease: easing.emphasized
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.short4,
      ease: easing.emphasized
    }
  }
}

export const slideInUp: Variants = {
  hidden: {
    opacity: 0,
    y: '100%',
    transition: {
      duration: duration.medium4,
      ease: easing.emphasized
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.medium4,
      ease: easing.emphasized
    }
  }
}

export const slideInDown: Variants = {
  hidden: {
    opacity: 0,
    y: '-100%',
    transition: {
      duration: duration.medium4,
      ease: easing.emphasized
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.medium4,
      ease: easing.emphasized
    }
  }
}

export const stagger: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1
    }
  },
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const staggerFast: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

export const staggerSlow: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1
    }
  },
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

// Page transition variants
export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: duration.medium3,
      ease: easing.standard
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.medium3,
      ease: easing.standard
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: duration.medium1,
      ease: easing.standard
    }
  }
}

// Card hover animation
export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: duration.short4,
      ease: easing.standard
    }
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: duration.short4,
      ease: easing.standard
    }
  }
}

// Button animation
export const buttonPress: Variants = {
  rest: {
    scale: 1,
    transition: {
      duration: duration.short1,
      ease: easing.standard
    }
  },
  pressed: {
    scale: 0.98,
    transition: {
      duration: duration.short1,
      ease: easing.standard
    }
  }
}

// Loading animation
export const pulse: Variants = {
  hidden: {
    opacity: 0.3,
    transition: {
      duration: duration.medium2,
      ease: easing.standard,
      repeat: Infinity,
      repeatType: 'reverse'
    }
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.medium2,
      ease: easing.standard,
      repeat: Infinity,
      repeatType: 'reverse'
    }
  }
}

// Floating animation for decorative elements
export const float: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      ease: easing.standard,
      repeat: Infinity,
      repeatType: 'loop'
    }
  }
}

// Rotation animation
export const rotate: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity
    }
  }
}