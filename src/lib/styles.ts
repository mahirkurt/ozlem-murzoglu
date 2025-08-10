/**
 * Material Design 3 Style Utilities
 * These utility functions return MD3-compliant class names
 */

export const styles = {
  // Text styles
  text: {
    primary: 'text-primary',
    secondary: 'text-secondary',
    tertiary: 'text-tertiary',
    error: 'text-error',
    onSurface: 'text-on-surface',
    onSurfaceVariant: 'text-on-surface-variant',
    // Legacy gray replacements
    muted: 'text-on-surface-variant',
    subtle: 'text-on-surface-variant opacity-80',
  },

  // Background styles
  bg: {
    primary: 'bg-primary',
    primaryContainer: 'bg-primary-container',
    secondary: 'bg-secondary',
    secondaryContainer: 'bg-secondary-container',
    tertiary: 'bg-tertiary',
    tertiaryContainer: 'bg-tertiary-container',
    surface: 'bg-surface',
    surfaceContainer: 'bg-surface-container',
    surfaceContainerHigh: 'bg-surface-container-high',
    surfaceContainerHighest: 'bg-surface-container-highest',
    error: 'bg-error',
    errorContainer: 'bg-error-container',
    // Legacy gray replacements
    muted: 'bg-surface-container',
    subtle: 'bg-surface-container-low',
    card: 'bg-surface-container',
  },

  // Border styles
  border: {
    outline: 'border-outline',
    outlineVariant: 'border-outline-variant',
    // Legacy gray replacements
    default: 'border-outline-variant',
    muted: 'border-outline-variant',
  },

  // Component styles
  button: {
    primary: 'btn btn-primary',
    secondary: 'btn btn-outline',
    text: 'btn btn-text',
  },

  card: 'card',
  input: 'input',
  textarea: 'textarea',
  chip: 'chip',

  // Elevation
  elevation: {
    none: 'elevation-0',
    low: 'elevation-1',
    medium: 'elevation-2',
    high: 'elevation-3',
  },

  // Layout
  container: 'container',

  // Utility
  srOnly: 'sr-only',
  skipLink: 'skip-link',

  // Animations
  animate: {
    fadeIn: 'animate-fadeIn',
    slideIn: 'animate-slideIn',
  },

  // Transitions
  transition: {
    all: 'transition-all',
    colors: 'transition-colors',
    transform: 'transition-transform',
    opacity: 'transition-opacity',
  },

  // Hover effects
  hover: {
    lift: 'hover-lift',
    grow: 'hover-grow',
  },
}

// Helper function to combine classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Color mapping for legacy gray classes
export const colorMap = {
  // Text colors
  'text-gray-900': 'text-on-surface',
  'text-gray-800': 'text-on-surface',
  'text-gray-700': 'text-on-surface-variant',
  'text-gray-600': 'text-on-surface-variant',
  'text-gray-500': 'text-on-surface-variant opacity-80',
  'text-gray-400': 'text-on-surface-variant opacity-60',
  
  // Background colors
  'bg-gray-50': 'bg-surface-container',
  'bg-gray-100': 'bg-surface-container-low',
  'bg-gray-200': 'bg-surface-container-high',
  'bg-gray-300': 'bg-surface-container-highest',
  
  // Border colors
  'border-gray-100': 'border-outline-variant',
  'border-gray-200': 'border-outline-variant',
  'border-gray-300': 'border-outline',
  'border-gray-400': 'border-outline',
  
  // Primary colors
  'text-primary': 'text-primary',
  'bg-primary': 'bg-primary',
  'border-primary': 'border border-primary',
  
  // White/Black
  'text-white': 'text-on-primary',
  'bg-white': 'bg-surface',
  'border-white': 'border-surface',
}

// Function to convert legacy classes to MD3
export function toMD3Classes(className: string): string {
  let result = className
  
  Object.entries(colorMap).forEach(([oldClass, newClass]) => {
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g')
    result = result.replace(regex, newClass)
  })
  
  return result
}