'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  HiHome,
  HiDocumentText,
  HiChartBar,
  HiCog,
  HiUpload,
  HiX,
} from 'react-icons/hi'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'ダッシュボード', icon: HiHome },
  { href: '/payslips', label: '給与明細', icon: HiDocumentText },
  { href: '/upload', label: 'アップロード', icon: HiUpload },
  { href: '/analytics', label: '分析', icon: HiChartBar },
  { href: '/settings', label: '設定', icon: HiCog },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-blue-600"
            >
              SalaryLens
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
              aria-label="Close menu"
            >
              <HiX className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={onClose}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          isActive ? 'text-blue-600' : 'text-gray-400'
                        )}
                      />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Version 0.1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
