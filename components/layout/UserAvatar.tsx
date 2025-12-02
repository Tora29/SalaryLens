import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

export interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

const imageSizes = {
  sm: 32,
  md: 40,
  lg: 48,
}

export function UserAvatar({
  src,
  name,
  size = 'md',
  className,
  ...props
}: UserAvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium overflow-hidden',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={name || 'User avatar'}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
      <span className="sr-only">{name || 'User'}</span>
    </div>
  )
}
