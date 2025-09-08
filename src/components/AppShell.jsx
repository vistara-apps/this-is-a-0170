import React from 'react'
import { clsx } from 'clsx'
import { 
  Home, 
  Book, 
  Mic, 
  User, 
  Star,
  Menu,
  X
} from 'lucide-react'

const iconMap = {
  Home,
  Book,
  Mic,
  User,
  Star
}

export const AppShell = ({ 
  children, 
  currentView, 
  navigationItems, 
  onNavigate, 
  user, 
  selectedPet 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-forest-400 to-forest-600 rounded-lg flex items-center justify-center">
                <span className="text-lg">🐾</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CritterChat</h1>
                {selectedPet && (
                  <p className="text-xs text-gray-600">{selectedPet.name} the {selectedPet.species}</p>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = iconMap[item.icon]
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={clsx(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      currentView === item.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* User info */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-600 capitalize">{user.subscriptionTier} Plan</p>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm text-white font-medium">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = iconMap[item.icon]
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id)
                        setMobileMenuOpen(false)
                      }}
                      className={clsx(
                        'w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors',
                        currentView === item.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>
              
              {/* Mobile user info */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3 px-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.email}</p>
                    <p className="text-sm text-gray-600 capitalize">{user.subscriptionTier} Plan</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  )
}