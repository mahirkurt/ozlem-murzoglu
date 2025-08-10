'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { cardHover, fadeInUp } from '@/lib/motion'
import type { CardProps } from '@/types'

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    className, 
    title,
    description,
    image,
    href,
    featured = false,
    ...props 
  }, ref) => {
    const cardClasses = cn(
      'bg-surface-container rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-shadow duration-200 overflow-hidden',
      {
        'ring-2 ring-primary/20': featured,
      },
      className
    )

    const CardContent = () => (
      <motion.div
        ref={ref}
        variants={href ? cardHover : fadeInUp}
        initial="hidden"
        animate="visible"
        whileHover={href ? "hover" : undefined}
        className={cardClasses}
        {...props}
      >
        {image && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={image}
              alt={title || ''}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {featured && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-on-primary">
                  Featured
                </span>
              </div>
            )}
          </div>
        )}
        
        <div className="p-6">
          {title && (
            <h3 className="text-lg font-semibold text-on-surface mb-2 line-clamp-2">
              {title}
            </h3>
          )}
          
          {description && (
            <p className="text-on-surface-variant text-sm mb-4 line-clamp-3">
              {description}
            </p>
          )}
          
          {children}
        </div>
      </motion.div>
    )

    if (href) {
      return (
        <Link href={href} className="block">
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
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

// Card title component
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  )
)
CardTitle.displayName = "CardTitle"

// Card description component
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-on-surface-variant", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

// Card content component
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

// Card footer component
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}