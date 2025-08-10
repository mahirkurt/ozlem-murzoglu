'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonPress } from '@/lib/motion'
import type { ButtonProps } from '@/types'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    disabled = false, 
    loading = false,
    onClick,
    type = 'button',
    href,
    target,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      // Size variants
      {
        'px-3 py-1.5 text-sm rounded-md': size === 'sm',
        'px-4 py-2 text-sm rounded-lg': size === 'md',
        'px-6 py-3 text-base rounded-lg': size === 'lg'
      },
      // Style variants
      {
        'bg-primary text-on-primary hover:bg-primary/90 focus:ring-primary/50 shadow-elevation-1 hover:shadow-elevation-2': variant === 'primary',
        'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 focus:ring-secondary/50': variant === 'secondary',
        'border border-outline text-on-surface hover:bg-surface-container focus:ring-primary/50': variant === 'outline',
        'text-primary hover:bg-primary/10 focus:ring-primary/50': variant === 'ghost'
      },
      className
    )

    const content = (
      <>
        {loading && (
          <motion.div
            className="mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <svg
              className="w-4 h-4"
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
          </motion.div>
        )}
        {children}
      </>
    )

    if (href) {
      return (
        <motion.div
          variants={buttonPress}
          initial="rest"
          whileTap="pressed"
          className="inline-block"
        >
          <Link
            href={href}
            target={target}
            className={baseClasses}
            aria-disabled={disabled || loading}
          >
            {content}
          </Link>
        </motion.div>
      )
    }

    return (
      <motion.button
        ref={ref}
        variants={buttonPress}
        initial="rest"
        whileTap={disabled || loading ? undefined : "pressed"}
        className={baseClasses}
        disabled={disabled || loading}
        onClick={onClick}
        type={type}
        {...props}
      >
        {content}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }