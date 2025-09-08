import React, { useState } from 'react'
import { PetCard } from './PetCard'
import { Plus, Calendar, TrendingUp, AlertCircle } from 'lucide-react'

export const PetProfile = ({ pet, pets, onSelectPet }) => {
  const [showAddPet, setShowAddPet] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')

  const timeframeOptions = [
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' },
    { value: 'quarter', label: 'Past 3 Months' }
  ]

  const getVocalizationStats = (history, timeframe) => {
    // Mock statistics based on history
    const total = history.length
    const abnormal = history.filter(record => record.isAbnormal).length
    const mostCommon = history.length > 0 ? history[0].audioType : 'N/A'
    
    return {
      total,
      abnormal,
      mostCommon,
      averagePerDay: Math.round(total / 7 * 10) / 10
    }
  }

  const stats = getVocalizationStats(pet.vocalizationHistory, selectedTimeframe)

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pet Profiles</h2>
          <p className="text-gray-600">Manage your pets and view their vocal patterns</p>
        </div>
        <button
          onClick={() => setShowAddPet(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pet</span>
        </button>
      </div>

      {/* Pet Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map(petItem => (
          <PetCard
            key={petItem.id}
            pet={petItem}
            isSelected={pet.id === petItem.id}
            onClick={() => onSelectPet(petItem)}
            variant={pet.id === petItem.id ? 'default' : 'compact'}
          />
        ))}
      </div>

      {/* Selected Pet Details */}
      <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-full flex items-center justify-center text-2xl">
            {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : '🐦'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
            <p className="text-gray-600 capitalize">{pet.breed} {pet.species}</p>
            <p className="text-sm text-gray-500">{pet.age} years old</p>
          </div>
        </div>

        {/* Statistics Header */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Vocalization Analytics</h4>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {timeframeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Total Sounds</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Daily Average</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.averagePerDay}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-purple-600">Most Common</span>
            </div>
            <p className="text-lg font-bold text-purple-900">{stats.mostCommon}</p>
          </div>
          
          <div className={`p-4 rounded-lg ${stats.abnormal > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-1">
              <AlertCircle className={`w-4 h-4 ${stats.abnormal > 0 ? 'text-red-600' : 'text-gray-600'}`} />
              <span className={`text-sm font-medium ${stats.abnormal > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                Unusual Sounds
              </span>
            </div>
            <p className={`text-2xl font-bold ${stats.abnormal > 0 ? 'text-red-900' : 'text-gray-900'}`}>
              {stats.abnormal}
            </p>
          </div>
        </div>

        {/* Recent History */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Vocalizations</h4>
          {pet.vocalizationHistory.length > 0 ? (
            <div className="space-y-3">
              {pet.vocalizationHistory.slice(-5).reverse().map((record, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                    record.isAbnormal ? 'bg-red-400' : 'bg-green-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{record.audioType}</p>
                      <span className="text-xs text-gray-500">{record.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{record.aiAnalysis}</p>
                    {record.contextTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {record.contextTags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-white text-gray-600 rounded text-xs">
                            {tag.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                        ))}
                        {record.contextTags.length > 3 && (
                          <span className="px-2 py-1 bg-white text-gray-500 rounded text-xs">
                            +{record.contextTags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No vocalizations recorded yet</p>
              <p className="text-sm">Start recording to see your pet's vocal patterns here</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Pet Modal */}
      {showAddPet && (
        <AddPetModal onClose={() => setShowAddPet(false)} />
      )}
    </div>
  )
}

const AddPetModal = ({ onClose }) => {
  const [petData, setPetData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would save to backend
    console.log('Adding pet:', petData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Pet</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
            <input
              type="text"
              value={petData.name}
              onChange={(e) => setPetData({ ...petData, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter pet's name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
            <select
              value={petData.species}
              onChange={(e) => setPetData({ ...petData, species: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
            <input
              type="text"
              value={petData.breed}
              onChange={(e) => setPetData({ ...petData, breed: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter breed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
            <input
              type="number"
              value={petData.age}
              onChange={(e) => setPetData({ ...petData, age: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter age"
              min="0"
              step="0.5"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              Add Pet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}