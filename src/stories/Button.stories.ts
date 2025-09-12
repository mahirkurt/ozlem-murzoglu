import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Button component story
const meta: Meta = {
  title: 'Components/Button',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Material Design 3 Button variations with our custom theme',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['elevated', 'filled', 'filled-tonal', 'outlined', 'text'],
      description: 'Button variant',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'error'],
      description: 'Button color',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    icon: {
      control: { type: 'text' },
      description: 'Icon name (Material Icons)',
    },
    text: {
      control: { type: 'text' },
      description: 'Button text',
    },
  },
};

export default meta;
type Story = StoryObj;

// Helper function to get button classes
const getButtonClass = (variant: string): string => {
  const classes: Record<string, string> = {
    elevated: 'mat-raised-button',
    filled: 'mat-flat-button',
    'filled-tonal': 'mat-flat-button tonal',
    outlined: 'mat-stroked-button',
    text: 'mat-button',
  };
  return classes[variant] || 'mat-button';
};

// Helper function to get size styles
const getSizeStyles = (size: string): string => {
  const sizes: Record<string, string> = {
    small: 'height: 32px; font-size: 14px; padding: 0 12px;',
    medium: 'height: 40px; font-size: 16px; padding: 0 16px;',
    large: 'height: 48px; font-size: 18px; padding: 0 20px;',
  };
  return sizes[size] || '';
};

// Primary Button
export const Primary: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button 
        [class]="'${getButtonClass(args.variant || 'filled')}'"
        [color]="color"
        [disabled]="disabled"
        [style]="'${getSizeStyles(args.size || 'medium')}'"
      >
        <mat-icon *ngIf="icon">{{icon}}</mat-icon>
        {{text}}
      </button>
    `,
  }),
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'medium',
    disabled: false,
    icon: '',
    text: 'Randevu Al',
  },
};

// Secondary Button
export const Secondary: Story = {
  ...Primary,
  args: {
    ...Primary.args,
    color: 'secondary',
    text: 'Detayları Gör',
  },
};

// Tertiary Button
export const Tertiary: Story = {
  ...Primary,
  args: {
    ...Primary.args,
    color: 'tertiary',
    text: 'İletişim',
  },
};

// Outlined Button
export const Outlined: Story = {
  ...Primary,
  args: {
    ...Primary.args,
    variant: 'outlined',
    text: 'Daha Fazla',
  },
};

// Text Button
export const Text: Story = {
  ...Primary,
  args: {
    ...Primary.args,
    variant: 'text',
    text: 'İptal',
  },
};

// Icon Button
export const IconButton: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button mat-icon-button [color]="color" [disabled]="disabled">
        <mat-icon>{{icon || 'favorite'}}</mat-icon>
      </button>
    `,
  }),
  args: {
    color: 'primary',
    disabled: false,
    icon: 'favorite',
  },
};

// FAB Button
export const FAB: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button mat-fab [color]="color" [disabled]="disabled">
        <mat-icon>{{icon || 'add'}}</mat-icon>
      </button>
    `,
  }),
  args: {
    color: 'primary',
    disabled: false,
    icon: 'add',
  },
};

// Extended FAB
export const ExtendedFAB: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button mat-fab extended [color]="color" [disabled]="disabled">
        <mat-icon>{{icon || 'edit'}}</mat-icon>
        {{text}}
      </button>
    `,
  }),
  args: {
    color: 'primary',
    disabled: false,
    icon: 'edit',
    text: 'Düzenle',
  },
};

// Button Group
export const ButtonGroup: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <button mat-flat-button color="primary">Primary</button>
        <button mat-flat-button color="secondary">Secondary</button>
        <button mat-flat-button color="tertiary">Tertiary</button>
        <button mat-stroked-button color="primary">Outlined</button>
        <button mat-button color="primary">Text</button>
        <button mat-raised-button color="primary">Elevated</button>
        <button mat-icon-button color="primary">
          <mat-icon>favorite</mat-icon>
        </button>
        <button mat-fab color="primary">
          <mat-icon>add</mat-icon>
        </button>
      </div>
    `,
  }),
};

// Loading State
export const LoadingState: Story = {
  render: () => ({
    template: `
      <button mat-flat-button color="primary" disabled>
        <mat-icon class="spinning">refresh</mat-icon>
        Yükleniyor...
      </button>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }
      </style>
    `,
  }),
};

// Interactive States
export const InteractiveStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <button mat-flat-button color="primary">Default</button>
        <button mat-flat-button color="primary" class="hover">Hover</button>
        <button mat-flat-button color="primary" class="focus">Focus</button>
        <button mat-flat-button color="primary" class="active">Active</button>
        <button mat-flat-button color="primary" disabled>Disabled</button>
      </div>
      <style>
        .hover { opacity: 0.9; }
        .focus { box-shadow: 0 0 0 3px rgba(0, 137, 123, 0.2); }
        .active { transform: scale(0.98); }
      </style>
    `,
  }),
};
