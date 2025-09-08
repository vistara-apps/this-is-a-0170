import React, { useState, useEffect } from 'react'
import { AppShell } from './components/AppShell'
import { SoundLibrary } from './components/SoundLibrary'
import { SoundRecorder } from './components/SoundRecorder'
import { PetProfile } from './components/PetProfile'
import { SubscriptionPlans } from './components/SubscriptionPlans'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'
import { AuthModal } from './components/AuthModal'
import { NotificationBadge } from './components/NotificationBadge'
import ErrorBoundary from './components/ErrorBoundary'
import { mockUser, mockPets, mockSoundLibrary } from './data/mockData'
import storageService from './services/storageService'
import { analysisService } from './services/apiService'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState(null)
  const [pets, setPets] = useState([])
  const [selectedPet, setSelectedPet] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize app data from storage
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load user data
        const storedUser = storageService.getUser()
        if (storedUser) {
          setUser(storedUser)
        } else {
          // Use mock data for demo
          setUser(mockUser)
          storageService.saveUser(mockUser)
        }

        // Load pets data
        const storedPets = storageService.getPets()
        if (storedPets.length > 0) {
          setPets(storedPets)
          setSelectedPet(storedPets[0])
        } else {
          // Use mock data for demo
          setPets(mockPets)
          setSelectedPet(mockPets[0])
          storageService.savePets(mockPets)
        }

        // Check for abnormal sounds and create notifications
        const abnormalSounds = storedPets.flatMap(pet => 
          pet.vocalizationHistory?.filter(record => record.isAbnormal) || []
        )
        
        if (abnormalSounds.length > 0) {
          setNotifications([{
            id: 'abnormal-sounds',
            type: 'warning',
            message: `${abnormalSounds.length} concerning sounds detected`,
            count: abnormalSounds.length
          }])
        }

        // Cleanup old data
        storageService.cleanupOldData()
      } catch (error) {
        console.error('Error initializing app:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const navigationItems = [
    { id: 'home', label: 'Home', icon: 'Home' },
    { id: 'library', label: 'Sound Library', icon: 'Book' },
    { id: 'record', label: 'Record', icon: 'Mic' },
    { id: 'profile', label: 'Pet Profile', icon: 'User' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'subscription', label: 'Plans', icon: 'Star' }
  ]

  const handleNavigation = (viewId) => {
    setCurrentView(viewId)
  }

  const handleAnalysisComplete = async (analysis) => {
    try {
      // Add to pet's history in storage
      const record = storageService.addVocalizationRecord(selectedPet.id, analysis)
      
      if (record) {
        // Update local state
        const updatedPets = pets.map(pet => 
          pet.id === selectedPet.id 
            ? { ...pet, vocalizationHistory: [...(pet.vocalizationHistory || []), record] }
            : pet
        )
        setPets(updatedPets)
        setSelectedPet(updatedPets.find(p => p.id === selectedPet.id))

        // Check for abnormal sounds and update notifications
        if (analysis.isAbnormal) {
          setNotifications(prev => {
            const existing = prev.find(n => n.id === 'abnormal-sounds')
            if (existing) {
              return prev.map(n => 
                n.id === 'abnormal-sounds' 
                  ? { ...n, count: n.count + 1, message: `${n.count + 1} concerning sounds detected` }
                  : n
              )
            } else {
              return [...prev, {
                id: 'abnormal-sounds',
                type: 'warning',
                message: '1 concerning sound detected',
                count: 1
              }]
            }
          })
        }
      }
    } catch (error) {
      console.error('Error saving analysis:', error)
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    storageService.saveUser(userData)
    setShowAuthModal(false)
  }

  const handleUpgrade = (tier) => {
    const updatedUser = { ...user, subscriptionTier: tier }
    setUser(updatedUser)
    storageService.updateUser({ subscriptionTier: tier })
  }

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const renderCurrentView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading CritterChat...</p>
          </div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to CritterChat</h2>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )
    }

    switch (currentView) {
      case 'library':
        return <SoundLibrary sounds={mockSoundLibrary} userTier={user.subscriptionTier} />
      case 'record':
        return <SoundRecorder pet={selectedPet} onAnalysisComplete={handleAnalysisComplete} />
      case 'profile':
        return <PetProfile 
          pet={selectedPet} 
          pets={pets} 
          onSelectPet={setSelectedPet}
          onUpdatePet={(petId, updates) => {
            storageService.updatePet(petId, updates)
            const updatedPets = pets.map(pet => 
              pet.id === petId ? { ...pet, ...updates } : pet
            )
            setPets(updatedPets)
            if (selectedPet?.id === petId) {
              setSelectedPet({ ...selectedPet, ...updates })
            }
          }}
        />
      case 'analytics':
        return <AnalyticsDashboard pets={pets} userTier={user.subscriptionTier} />
      case 'subscription':
        return <SubscriptionPlans currentTier={user.subscriptionTier} onUpgrade={handleUpgrade} />
      default:
        return <Home selectedPet={selectedPet} onNavigate={handleNavigation} notifications={notifications} />
    }
  }

  return (
    <ErrorBoundary>
      <AppShell 
        currentView={currentView}
        navigationItems={navigationItems}
        onNavigate={handleNavigation}
        user={user}
        selectedPet={selectedPet}
        notifications={notifications}
        onDismissNotification={dismissNotification}
      >
        {renderCurrentView()}
      </AppShell>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </ErrorBoundary>
  )
}

const Home = ({ selectedPet, onNavigate, notifications = [] }) => {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-forest-400 to-forest-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🐾</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome to CritterChat
        </h1>
        <p className="text-gray-600 text-lg">
          Understand your pet's every bark, meow, and chirp
        </p>
      </div>

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
          {notifications.map(notification => (
            <div key={notification.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-red-600 text-sm">⚠️</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-800">{notification.message}</p>
                  <p className="text-sm text-red-600 mt-1">
                    Check the Analytics section for detailed information about concerning sounds.
                  </p>
                  <button
                    onClick={() => onNavigate('analytics')}
                    className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium underline"
                  >
                    View Analytics →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('record')}
          className="p-6 bg-surface rounded-lg shadow-card hover:shadow-lg transition-shadow border border-gray-100"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Record Sound</h3>
            <p className="text-sm text-gray-600">Capture and analyze your pet's vocalizations</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('library')}
          className="p-6 bg-surface rounded-lg shadow-card hover:shadow-lg transition-shadow border border-gray-100"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Sound Library</h3>
            <p className="text-sm text-gray-600">Browse common pet sounds and meanings</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('analytics')}
          className="p-6 bg-surface rounded-lg shadow-card hover:shadow-lg transition-shadow border border-gray-100"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
            <p className="text-sm text-gray-600">View detailed insights and patterns</p>
          </div>
        </button>
      </div>

      {selectedPet && (
        <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity for {selectedPet.name}</h3>
          {selectedPet.vocalizationHistory.length > 0 ? (
            <div className="space-y-3">
              {selectedPet.vocalizationHistory.slice(-3).map((record, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    record.isAbnormal ? 'bg-red-400' : 'bg-green-400'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{record.audioType}</p>
                    <p className="text-sm text-gray-600">{record.aiAnalysis}</p>
                    <p className="text-xs text-gray-500 mt-1">{record.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No recordings yet. Start by recording your pet's sounds!</p>
          )}
        </div>
      )}
    </div>
  )
}

export default App
