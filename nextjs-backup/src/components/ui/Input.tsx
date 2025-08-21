'use client'

import React from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'outlined' | 'filled'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', label, error, helperText, variant = 'outlined', ...props }, ref) => {
    const inputId = React.useId()

    return (
      <>
        <div className={`md-input-container md-input--${variant} ${error ? 'md-input--error' : ''} ${className}`}>
          {label && (
            <label
              htmlFor={inputId}
              className="md-input__label"
            >
              {label}
              {props.required && (
                <span className="md-input__required" aria-label="required">
                  *
                </span>
              )}
            </label>
          )}
          
          <div className="md-input__wrapper">
            <input
              id={inputId}
              type={type}
              className="md-input__field"
              ref={ref}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={
                error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
              }
              {...props}
            />
            {variant === 'filled' && <div className="md-input__underline"></div>}
          </div>
          
          {(error || helperText) && (
            <div className="md-input__support">
              {error && (
                <p
                  id={`${inputId}-error`}
                  className="md-input__error"
                  role="alert"
                >
                  {error}
                </p>
              )}
              
              {helperText && !error && (
                <p
                  id={`${inputId}-helper`}
                  className="md-input__helper"
                >
                  {helperText}
                </p>
              )}
            </div>
          )}
        </div>
        <style jsx>{inputStyles}</style>
      </>
    )
  }
)

Input.displayName = 'Input'

const inputStyles = `
  .md-input-container {
    width: 100%;
    margin-bottom: 24px;
  }

  .md-input__label {
    display: block;
    font-size: var(--md-sys-typescale-body-small-size);
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
    margin-bottom: 8px;
    transition: color var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
  }

  .md-input__required {
    color: var(--md-sys-color-error);
    margin-left: 4px;
  }

  .md-input__wrapper {
    position: relative;
  }

  .md-input__field {
    display: block;
    width: 100%;
    padding: 16px;
    font-size: var(--md-sys-typescale-body-large-size);
    line-height: var(--md-sys-typescale-body-large-line-height);
    color: var(--md-sys-color-on-surface);
    background: transparent;
    border: none;
    transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
  }

  /* Outlined variant */
  .md-input--outlined .md-input__field {
    border: 1px solid var(--md-sys-color-outline);
    border-radius: var(--md-sys-shape-corner-extra-small);
    background: var(--md-sys-color-surface);
  }

  .md-input--outlined .md-input__field:hover:not(:disabled) {
    border-color: var(--md-sys-color-on-surface);
  }

  .md-input--outlined .md-input__field:focus {
    outline: none;
    border-color: var(--md-sys-color-primary);
    border-width: 2px;
    padding: 15px;
  }

  /* Filled variant */
  .md-input--filled .md-input__field {
    background: var(--md-sys-color-surface-container-highest);
    border-bottom: 1px solid var(--md-sys-color-on-surface-variant);
    border-radius: var(--md-sys-shape-corner-extra-small) var(--md-sys-shape-corner-extra-small) 0 0;
  }

  .md-input--filled .md-input__field:hover:not(:disabled) {
    border-bottom-color: var(--md-sys-color-on-surface);
  }

  .md-input--filled .md-input__field:focus {
    outline: none;
    border-bottom-color: transparent;
  }

  .md-input--filled .md-input__underline {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--md-sys-color-primary);
    transform: scaleX(0);
    transition: transform var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
  }

  .md-input--filled .md-input__field:focus ~ .md-input__underline {
    transform: scaleX(1);
  }

  /* Error state */
  .md-input--error .md-input__label {
    color: var(--md-sys-color-error);
  }

  .md-input--error.md-input--outlined .md-input__field {
    border-color: var(--md-sys-color-error);
  }

  .md-input--error.md-input--outlined .md-input__field:focus {
    border-color: var(--md-sys-color-error);
  }

  .md-input--error.md-input--filled .md-input__field {
    border-bottom-color: var(--md-sys-color-error);
  }

  .md-input--error.md-input--filled .md-input__underline {
    background: var(--md-sys-color-error);
  }

  /* Support text */
  .md-input__support {
    margin-top: 4px;
    min-height: 20px;
  }

  .md-input__helper {
    font-size: var(--md-sys-typescale-body-small-size);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
  }

  .md-input__error {
    font-size: var(--md-sys-typescale-body-small-size);
    color: var(--md-sys-color-error);
    margin: 0;
  }

  /* Disabled state */
  .md-input__field:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    background: var(--md-sys-color-surface-variant);
  }

  /* Placeholder */
  .md-input__field::placeholder {
    color: var(--md-sys-color-on-surface-variant);
    opacity: 0.6;
  }
`

export { Input }