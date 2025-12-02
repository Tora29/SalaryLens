'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { HiMenu } from 'react-icons/hi'

interface MobileMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean
}

export function MobileMenuButton({
  className,
  isOpen = false,
  ...props
}: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      {...props}
    >
      <HiMenu className="h-6 w-6" />
    </button>
  )
}
