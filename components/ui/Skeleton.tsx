import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text'
  width?: string | number
  height?: string | number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rect', width, height, style, ...props }, ref) => {
    const variantStyles = {
      rect: 'rounded-md',
      circle: 'rounded-full',
      text: 'rounded h-4',
    }

    const customStyle: React.CSSProperties = {
      width: width,
      height: variant === 'circle' ? width : height,
      ...style,
    }

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-gray-200',
          variantStyles[variant],
          className
        )}
        style={customStyle}
        aria-hidden="true"
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            className={cn(index === lines - 1 && 'w-3/4')}
          />
        ))}
      </div>
    )
  }
)

SkeletonText.displayName = 'SkeletonText'

type SkeletonCardProps = React.HTMLAttributes<HTMLDivElement>

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('rounded-lg border border-gray-200 p-4 space-y-4', className)}
        {...props}
      >
        <Skeleton variant="rect" height={20} className="w-1/3" />
        <SkeletonText lines={2} />
      </div>
    )
  }
)

SkeletonCard.displayName = 'SkeletonCard'

export { Skeleton, SkeletonText, SkeletonCard }
