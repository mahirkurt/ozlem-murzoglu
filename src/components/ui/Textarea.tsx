'use client'

import React from 'react'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'outlined' | 'filled'
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, variant = 'outlined', ...props }, ref) => {
    const textareaId = React.useId()

    return (
      <>
        <div className={`md-textarea-container md-textarea--${variant} ${error ? 'md-textarea--error' : ''} ${className}`}>
          {label && (
            <label
              htmlFor={textareaId}
              className="md-textarea__label"
            >
              {label}
              {props.required && (
                <span className="md-textarea__required" aria-label="required">
                  *
                </span>
              )}
            </label>
          )}
          
          <div className="md-textarea__wrapper">
            <textarea
              id={textareaId}
              className="md-textarea__field"
              ref={ref}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={
                error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
              }
              {...props}
            />
            {variant === 'filled' && <div className="md-textarea__underline"></div>}
          </div>
          
          {(error || helperText) && (
            <div className="md-textarea__support">
              {error && (
                <p
                  id={`${textareaId}-error`}
                  className="md-textarea__error"
                  role="alert"
                >
                  {error}
                </p>
              )}
              
              {helperText && !error && (
                <p
                  id={`${textareaId}-helper`}
                  className="md-textarea__helper"
                >
                  {helperText}
                </p>
              )}
            </div>
          )}
        </div>
        <style jsx>{textareaStyles}</style>
      </>
    )
  }
)

Textarea.displayName = 'Textarea'

const textareaStyles = `
  .md-textarea-container {
    width: 100%;
    margin-bottom: 24px;
  }

  .md-textarea__label {
    display: block;
    font-size: var(--md-sys-typescale-body-small-size);
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
    margin-bottom: 8px;
    transition: color var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
  }

  .md-textarea__required {
    color: var(--md-sys-color-error);
    margin-left: 4px;
  }

  .md-textarea__wrapper {
    position: relative;
  }

  .md-textarea__field {
    display: block;
    width: 100%;
    min-height: 120px;
    padding: 16px;
    font-family: inherit;
    font-size: var(--md-sys-typescale-body-large-size);
    line-height: var(--md-sys-typescale-body-large-line-height);
    color: var(--md-sys-color-on-surface);
    background: transparent;
    border: none;
    resize: vertical;
    transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
  }

  /* Outlined variant */
  .md-textarea--outlined .md-textarea__field {
    border: 1px solid var(--md-sys-color-outline);
    border-radius: var(--md-sys-shape-corner-extra-small);
    background: var(--md-sys-color-surface);
  }

  .md-textarea--outlined .md-textarea__field:hover:not(:disabled) {
    border-color: var(--md-sys-color-on-surface);
  }

  .md-textarea--outlined .md-textarea__field:focus {
    outline: none;
    border-color: var(--md-sys-color-primary);
    border-width: 2px;
    padding: 15px;
  }

  /* Filled variant */
  .md-textarea--filled .md-textarea__field {
    background: var(--md-sys-color-surface-container-highest);
    border-bottom: 1px solid var(--md-sys-color-on-surface-variant);
    border-radius: var(--md-sys-shape-corner-extra-small) var(--md-sys-shape-corner-extra-small) 0 0;
  }

  .md-textarea--filled .md-textarea__field:hover:not(:disabled) {
    border-bottom-color: var(--md-sys-color-on-surface);
  }

  .md-textarea--filled .md-textarea__field:focus {
    outline: none;
    border-bottom-color: transparent;
  }

  .md-textarea--filled .md-textarea__underline {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--md-sys-color-primary);
    transform: scaleX(0);
    transition: transform var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
  }

  .md-textarea--filled .md-textarea__field:focus ~ .md-textarea__underline {
    transform: scaleX(1);
  }

  /* Error state */
  .md-textarea--error .md-textarea__label {
    color: var(--md-sys-color-error);
  }

  .md-textarea--error.md-textarea--outlined .md-textarea__field {
    border-color: var(--md-sys-color-error);
  }

  .md-textarea--error.md-textarea--outlined .md-textarea__field:focus {
    border-color: var(--md-sys-color-error);
  }

  .md-textarea--error.md-textarea--filled .md-textarea__field {
    border-bottom-color: var(--md-sys-color-error);
  }

  .md-textarea--error.md-textarea--filled .md-textarea__underline {
    background: var(--md-sys-color-error);
  }

  /* Support text */
  .md-textarea__support {
    margin-top: 4px;
    min-height: 20px;
  }

  .md-textarea__helper {
    font-size: var(--md-sys-typescale-body-small-size);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
  }

  .md-textarea__error {
    font-size: var(--md-sys-typescale-body-small-size);
    color: var(--md-sys-color-error);
    margin: 0;
  }

  /* Disabled state */
  .md-textarea__field:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    background: var(--md-sys-color-surface-variant);
  }

  /* Placeholder */
  .md-textarea__field::placeholder {
    color: var(--md-sys-color-on-surface-variant);
    opacity: 0.6;
  }

  /* Scrollbar styling */
  .md-textarea__field::-webkit-scrollbar {
    width: 8px;
  }

  .md-textarea__field::-webkit-scrollbar-track {
    background: var(--md-sys-color-surface-container);
    border-radius: 4px;
  }

  .md-textarea__field::-webkit-scrollbar-thumb {
    background: var(--md-sys-color-on-surface-variant);
    border-radius: 4px;
    opacity: 0.5;
  }

  .md-textarea__field::-webkit-scrollbar-thumb:hover {
    background: var(--md-sys-color-on-surface);
    opacity: 0.7;
  }
`

export { Textarea }