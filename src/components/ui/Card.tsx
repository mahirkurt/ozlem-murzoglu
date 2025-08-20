'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'filled' | 'outlined'
  title?: string
  description?: string
  image?: string
  href?: string
  featured?: boolean
  children?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    className = '', 
    title,
    description,
    image,
    href,
    featured = false,
    variant = 'elevated',
    ...props 
  }, ref) => {
    const CardContent = () => (
      <>
        <div
          ref={ref}
          className={`md-card md-card--${variant} ${featured ? 'md-card--featured' : ''} ${href ? 'md-card--interactive' : ''} ${className}`}
          {...props}
        >
          {image && (
            <div className="md-card__media">
              <Image
                src={image}
                alt={title || ''}
                fill
                className="md-card__image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {featured && (
                <div className="md-card__badge">
                  <span className="md-card__badge-text">Featured</span>
                </div>
              )}
            </div>
          )}
          
          <div className="md-card__body">
            {title && (
              <h3 className="md-card__title">
                {title}
              </h3>
            )}
            
            {description && (
              <p className="md-card__description">
                {description}
              </p>
            )}
            
            {children}
          </div>
        </div>
        <style jsx>{cardStyles}</style>
      </>
    )

    if (href) {
      return (
        <Link href={href} className="md-card-link">
          <CardContent />
        </Link>
      )
    }

    return <CardContent />
  }
)

Card.displayName = 'Card'

// Card header component
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <>
      <div
        ref={ref}
        className={`md-card__header ${className}`}
        {...props}
      />
      <style jsx>{cardStyles}</style>
    </>
  )
)
CardHeader.displayName = "CardHeader"

// Card title component
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => (
    <>
      <h3
        ref={ref}
        className={`md-card__title ${className}`}
        {...props}
      >
        {children}
      </h3>
      <style jsx>{cardStyles}</style>
    </>
  )
)
CardTitle.displayName = "CardTitle"

// Card description component
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <>
      <p
        ref={ref}
        className={`md-card__description ${className}`}
        {...props}
      />
      <style jsx>{cardStyles}</style>
    </>
  )
)
CardDescription.displayName = "CardDescription"

// Card content component
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <>
      <div ref={ref} className={`md-card__content ${className}`} {...props} />
      <style jsx>{cardStyles}</style>
    </>
  )
)
CardContent.displayName = "CardContent"

// Card footer component
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <>
      <div
        ref={ref}
        className={`md-card__footer ${className}`}
        {...props}
      />
      <style jsx>{cardStyles}</style>
    </>
  )
)
CardFooter.displayName = "CardFooter"

const cardStyles = `
  .md-card-link {
    text-decoration: none;
    display: block;
  }

  .md-card {
    background: var(--md-sys-color-surface);
    border-radius: var(--md-sys-shape-corner-large);
    transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Variants */
  .md-card--elevated {
    box-shadow: var(--md-sys-elevation-level1);
  }

  .md-card--elevated:hover {
    box-shadow: var(--md-sys-elevation-level2);
  }

  .md-card--filled {
    background: var(--md-sys-color-surface-container);
  }

  .md-card--outlined {
    border: 1px solid var(--md-sys-color-outline-variant);
    box-shadow: none;
  }

  .md-card--outlined:hover {
    border-color: var(--md-sys-color-outline);
    box-shadow: var(--md-sys-elevation-level1);
  }

  /* Featured card */
  .md-card--featured {
    border: 2px solid var(--md-sys-color-primary);
    border-color: rgba(var(--md-sys-color-primary-rgb), 0.2);
  }

  /* Interactive card */
  .md-card--interactive {
    cursor: pointer;
  }

  .md-card--interactive::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--md-sys-color-on-surface);
    opacity: 0;
    transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    z-index: 1;
  }

  .md-card--interactive:hover::before {
    opacity: var(--md-sys-state-hover-opacity);
  }

  .md-card--interactive:hover {
    transform: translateY(-2px);
  }

  /* Card media */
  .md-card__media {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: var(--md-sys-color-surface-container);
  }

  .md-card__image {
    object-fit: cover;
    transition: transform var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
  }

  .md-card--interactive:hover .md-card__image {
    transform: scale(1.05);
  }

  .md-card__badge {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
  }

  .md-card__badge-text {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    font-size: var(--md-sys-typescale-label-small-size);
    font-weight: var(--md-sys-typescale-label-small-weight);
  }

  /* Card sections */
  .md-card__body {
    padding: 24px;
    flex: 1;
    position: relative;
    z-index: 2;
  }

  .md-card__header {
    padding: 24px 24px 16px;
    position: relative;
    z-index: 2;
  }

  .md-card__title {
    font-size: var(--md-sys-typescale-title-large-size);
    font-weight: var(--md-sys-typescale-title-large-weight);
    line-height: var(--md-sys-typescale-title-large-line-height);
    color: var(--md-sys-color-on-surface);
    margin: 0 0 8px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .md-card__description {
    font-size: var(--md-sys-typescale-body-medium-size);
    line-height: var(--md-sys-typescale-body-medium-line-height);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0 0 16px 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .md-card__content {
    padding: 0 24px 24px;
    position: relative;
    z-index: 2;
  }

  .md-card__footer {
    padding: 16px 24px;
    border-top: 1px solid var(--md-sys-color-outline-variant);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    position: relative;
    z-index: 2;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .md-card__media {
      height: 160px;
    }

    .md-card__body {
      padding: 16px;
    }

    .md-card__header {
      padding: 16px 16px 12px;
    }

    .md-card__content {
      padding: 0 16px 16px;
    }

    .md-card__footer {
      padding: 12px 16px;
    }
  }
`

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}