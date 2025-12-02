import { UserAvatar } from './UserAvatar'
import { HiBell, HiLogout } from 'react-icons/hi'

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface HeaderProps {
  mobileMenuButton?: React.ReactNode
  user?: User | null
  signOutAction?: () => void
}

export function Header({ mobileMenuButton, user, signOutAction }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          {mobileMenuButton}
          <h1 className="text-lg font-semibold text-gray-900 lg:hidden">
            SalaryLens
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Notifications"
          >
            <HiBell className="h-5 w-5" />
            <span className="sr-only">View notifications</span>
          </button>

          {user && (
            <div className="flex items-center gap-3">
              <UserAvatar
                src={user.image}
                name={user.name}
                size="sm"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              {signOutAction && (
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Sign out"
                  >
                    <HiLogout className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
