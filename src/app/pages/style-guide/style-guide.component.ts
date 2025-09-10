import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceHeroComponent } from '../../components/resource-hero/resource-hero.component';
import { TocSidebarComponent } from '../../components/toc-sidebar/toc-sidebar.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { ActionBarComponent } from '../../components/action-bar/action-bar.component';
import { staggerAnimation } from '../../animations/stagger.animation';

@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [
    CommonModule,
    ResourceHeroComponent,
    TocSidebarComponent,
    ContentCardComponent,
    ActionBarComponent,
  ],
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.scss'],
  animations: [staggerAnimation],
})
export class StyleGuideComponent {
  // Color tokens with proper index signature
  colorTokens: { [key: string]: Array<{ name: string; value: string }> } = {
    primary: [
      { name: 'primary', value: 'var(--md-sys-color-primary)' },
      { name: 'on-primary', value: 'var(--md-sys-color-on-primary)' },
      { name: 'primary-container', value: 'var(--md-sys-color-primary-container)' },
      { name: 'on-primary-container', value: 'var(--md-sys-color-on-primary-container)' },
    ],
    secondary: [
      { name: 'secondary', value: 'var(--md-sys-color-secondary)' },
      { name: 'on-secondary', value: 'var(--md-sys-color-on-secondary)' },
      { name: 'secondary-container', value: 'var(--md-sys-color-secondary-container)' },
      { name: 'on-secondary-container', value: 'var(--md-sys-color-on-secondary-container)' },
    ],
    tertiary: [
      { name: 'tertiary', value: 'var(--md-sys-color-tertiary)' },
      { name: 'on-tertiary', value: 'var(--md-sys-color-on-tertiary)' },
      { name: 'tertiary-container', value: 'var(--md-sys-color-tertiary-container)' },
      { name: 'on-tertiary-container', value: 'var(--md-sys-color-on-tertiary-container)' },
    ],
    neutral: [
      { name: 'surface', value: 'var(--md-sys-color-surface)' },
      { name: 'on-surface', value: 'var(--md-sys-color-on-surface)' },
      { name: 'surface-variant', value: 'var(--md-sys-color-surface-variant)' },
      { name: 'on-surface-variant', value: 'var(--md-sys-color-on-surface-variant)' },
      { name: 'outline', value: 'var(--md-sys-color-outline)' },
      { name: 'outline-variant', value: 'var(--md-sys-color-outline-variant)' },
    ],
  };

  // Typography scale
  typographyScale = [
    { name: 'Display Large', class: 'display-large', size: '57px', weight: '400' },
    { name: 'Display Medium', class: 'display-medium', size: '45px', weight: '400' },
    { name: 'Display Small', class: 'display-small', size: '36px', weight: '400' },
    { name: 'Headline Large', class: 'headline-large', size: '32px', weight: '400' },
    { name: 'Headline Medium', class: 'headline-medium', size: '28px', weight: '400' },
    { name: 'Headline Small', class: 'headline-small', size: '24px', weight: '400' },
    { name: 'Title Large', class: 'title-large', size: '22px', weight: '400' },
    { name: 'Title Medium', class: 'title-medium', size: '16px', weight: '500' },
    { name: 'Title Small', class: 'title-small', size: '14px', weight: '500' },
    { name: 'Body Large', class: 'body-large', size: '16px', weight: '400' },
    { name: 'Body Medium', class: 'body-medium', size: '14px', weight: '400' },
    { name: 'Body Small', class: 'body-small', size: '12px', weight: '400' },
    { name: 'Label Large', class: 'label-large', size: '14px', weight: '500' },
    { name: 'Label Medium', class: 'label-medium', size: '12px', weight: '500' },
    { name: 'Label Small', class: 'label-small', size: '11px', weight: '500' },
  ];

  // Spacing tokens
  spacingTokens = [
    { name: 'spacing-xs', value: '4px', cssVar: 'var(--spacing-xs)' },
    { name: 'spacing-sm', value: '8px', cssVar: 'var(--spacing-sm)' },
    { name: 'spacing-md', value: '16px', cssVar: 'var(--spacing-md)' },
    { name: 'spacing-lg', value: '24px', cssVar: 'var(--spacing-lg)' },
    { name: 'spacing-xl', value: '32px', cssVar: 'var(--spacing-xl)' },
    { name: 'spacing-2xl', value: '48px', cssVar: 'var(--spacing-2xl)' },
    { name: 'spacing-3xl', value: '64px', cssVar: 'var(--spacing-3xl)' },
  ];

  // Border radius tokens
  radiusTokens = [
    { name: 'radius-none', value: '0', cssVar: 'var(--radius-none)' },
    { name: 'radius-xs', value: '4px', cssVar: 'var(--radius-xs)' },
    { name: 'radius-sm', value: '8px', cssVar: 'var(--radius-sm)' },
    { name: 'radius-md', value: '12px', cssVar: 'var(--radius-md)' },
    { name: 'radius-lg', value: '16px', cssVar: 'var(--radius-lg)' },
    { name: 'radius-xl', value: '24px', cssVar: 'var(--radius-xl)' },
    { name: 'radius-full', value: '9999px', cssVar: 'var(--radius-full)' },
  ];

  // Elevation tokens
  elevationTokens = [
    { name: 'elevation-none', level: 0 },
    { name: 'elevation-low', level: 1 },
    { name: 'elevation-medium', level: 2 },
    { name: 'elevation-high', level: 3 },
    { name: 'elevation-card', level: 2 },
    { name: 'elevation-card-hover', level: 3 },
  ];

  // Animation examples
  animationExamples = [
    { name: 'Fade In', trigger: 'fadeIn' },
    { name: 'Fade In Up', trigger: 'fadeInUp' },
    { name: 'Slide In', trigger: 'slideIn' },
    { name: 'Scale', trigger: 'scale' },
    { name: 'Stagger', trigger: 'stagger' },
  ];

  // Layout primitives
  layoutPrimitives = [
    { name: 'Stack', description: 'Vertical spacing with consistent gaps' },
    { name: 'Cluster', description: 'Horizontal wrapping layout' },
    { name: 'Box', description: 'Padded container with optional border' },
    { name: 'Center', description: 'Centers content horizontally and vertically' },
    { name: 'Grid', description: 'Auto-responsive grid layout' },
    { name: 'Sidebar', description: 'Main content with sidebar layout' },
    { name: 'Frame', description: 'Maintains aspect ratio container' },
    { name: 'Switcher', description: 'Switches between horizontal and vertical' },
  ];

  // Sample TOC for sidebar demo
  sampleToc = [
    { id: 'colors', text: 'Colors', level: 1, active: true },
    { id: 'typography', text: 'Typography', level: 1, active: false },
    { id: 'spacing', text: 'Spacing', level: 1, active: false },
    { id: 'components', text: 'Components', level: 1, active: false },
  ];

  activeAnimation: string | null = null;

  triggerAnimation(animationName: string) {
    this.activeAnimation = null;
    setTimeout(() => {
      this.activeAnimation = animationName;
    }, 100);
  }

  getColorValue(cssVar: string): string {
    if (typeof window === 'undefined') return '#000000';

    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue(cssVar.replace('var(', '').replace(')', '')).trim();
  }
}
