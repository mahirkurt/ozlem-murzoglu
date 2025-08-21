'use client'

import React from 'react'
import Link from 'next/link'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  href?: string
  target?: string
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className = '', 
    variant = 'filled', 
    size = 'medium', 
    disabled = false, 
    loading = false,
    onClick,
    type = 'button',
    href,
    target,
    ...props 
  }, ref) => {
    const buttonClassName = `md-button md-button--${variant} md-button--${size} ${className} ${disabled ? 'md-button--disabled' : ''} ${loading ? 'md-button--loading' : ''}`

    const content = (
      <>
        {loading && (
          <span className="md-button__loader">
            <svg
              className="md-button__loader-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </span>
        )}
        <span className="md-button__label">{children}</span>
      </>
    )

    if (href) {
      return (
        <>
          <Link
            href={href}
            target={target}
            className={buttonClassName}
            aria-disabled={disabled || loading}
          >
            {content}
          </Link>
          <style jsx>{buttonStyles}</style>
        </>
      )
    }

    return (
      <>
        <button
          ref={ref}
          className={buttonClassName}
          disabled={disabled || loading}
          onClick={onClick}
          type={type}
          {...props}
        >
          {content}
        </button>
        <style jsx>{buttonStyles}</style>
      </>
    )
  }
)

Button.displayName = 'Button'

const buttonStyles = `
  .md-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    font-family: var(--md-sys-typescale-label-large-font);
    font-weight: var(--md-sys-typescale-label-large-weight);
    letter-spacing: var(--md-sys-typescale-label-large-tracking);
    text-decoration: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
  }

  /* Size variants */
  .md-button--small {
    height: 32px;
    padding: 0 16px;
    font-size: var(--md-sys-typescale-label-medium-size);
    border-radius: var(--md-sys-shape-corner-full);
  }

  .md-button--medium {
    height: 40px;
    padding: 0 24px;
    font-size: var(--md-sys-typescale-label-large-size);
    border-radius: var(--md-sys-shape-corner-full);
  }

  .md-button--large {
    height: 56px;
    padding: 0 32px;
    font-size: var(--md-sys-typescale-label-large-size);
    border-radius: var(--md-sys-shape-corner-full);
  }

  /* Variant styles */
  .md-button--filled {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }

  .md-button--filled:hover:not(:disabled) {
    box-shadow: var(--md-sys-elevation-level1);
  }

  .md-button--filled:active:not(:disabled) {
    box-shadow: none;
  }

  .md-button--tonal {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  .md-button--tonal:hover:not(:disabled) {
    box-shadow: var(--md-sys-elevation-level1);
  }

  .md-button--outlined {
    background: transparent;
    color: var(--md-sys-color-primary);
    border: 1px solid var(--md-sys-color-outline);
  }

  .md-button--outlined:hover:not(:disabled) {
    background: var(--md-sys-color-primary-container);
    border-color: var(--md-sys-color-primary);
  }

  .md-button--text {
    background: transparent;
    color: var(--md-sys-color-primary);
    padding: 0 12px;
  }

  .md-button--text:hover:not(:disabled) {
    background: var(--md-sys-color-primary-container);
  }

  .md-button--elevated {
    background: var(--md-sys-color-surface-container-low);
    color: var(--md-sys-color-primary);
    box-shadow: var(--md-sys-elevation-level1);
  }

  .md-button--elevated:hover:not(:disabled) {
    box-shadow: var(--md-sys-elevation-level2);
  }

  /* State layer */
  .md-button::before {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
  }

  .md-button:hover::before {
    opacity: var(--md-sys-state-hover-opacity);
  }

  .md-button:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .md-button:active::before {
    opacity: var(--md-sys-state-pressed-opacity);
  }

  /* Disabled state */
  .md-button:disabled,
  .md-button--disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  /* Loading state */
  .md-button--loading {
    pointer-events: none;
  }

  .md-button__loader {
    display: inline-flex;
    animation: rotate 1s linear infinite;
  }

  .md-button__loader-icon {
    width: 18px;
    height: 18px;
  }

  .md-button__label {
    display: inline-flex;
    align-items: center;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export { Button }