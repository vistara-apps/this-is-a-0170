import React, { useState } from 'react'
import { AppShell } from './components/AppShell'
import { SoundLibrary } from './components/SoundLibrary'
import { SoundRecorder } from './components/SoundRecorder'
import { PetProfile } from './components/PetProfile'
import { SubscriptionPlans } from './components/SubscriptionPlans'
import { mockUser, mockPets, mockSoundLibrary } from './data/mockData'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState(mockUser)
  const [pets, setPets] = useState(mockPets)
  const [selectedPet, setSelectedPet] = useState(mockPets[0])

  const navigationItems = [
    { id: 'home', label: 'Home', icon: 'Home' },
    { id: 'library', label: 'Sound Library', icon: 'Book' },
    { id: 'record', label: 'Record', icon: 'Mic' },
    { id: 'profile', label: 'Pet Profile', icon: 'User' },
    { id: 'subscription', label: 'Plans', icon: 'Star' }
  ]

  const handleNavigation = (viewId) => {
    setCurrentView(viewId)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'library':
        return <SoundLibrary sounds={mockSoundLibrary} userTier={user.subscriptionTier} />
      case 'record':
        return <SoundRecorder pet={selectedPet} onAnalysisComplete={(analysis) => {
          // Add to pet's history
          const updatedPets = pets.map(pet => 
            pet.id === selectedPet.id 
              ? { ...pet, vocalizationHistory: [...pet.vocalizationHistory, analysis] }
              : pet
          )
          setPets(updatedPets)
          setSelectedPet(updatedPets.find(p => p.id === selectedPet.id))
        }} />
      case 'profile':
        return <PetProfile pet={selectedPet} pets={pets} onSelectPet={setSelectedPet} />
      case 'subscription':
        return <SubscriptionPlans currentTier={user.subscriptionTier} onUpgrade={(tier) => {
          setUser({ ...user, subscriptionTier: tier })
        }} />
      default:
        return <Home selectedPet={selectedPet} onNavigate={handleNavigation} />
    }
  }

  return (
    <AppShell 
      currentView={currentView}
      navigationItems={navigationItems}
      onNavigate={handleNavigation}
      user={user}
      selectedPet={selectedPet}
    >
      {renderCurrentView()}
    </AppShell>
  )
}

const Home = ({ selectedPet, onNavigate }) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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