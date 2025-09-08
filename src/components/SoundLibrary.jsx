import React, { useState } from 'react'
import { Search, Play, Lock } from 'lucide-react'

export const SoundLibrary = ({ sounds, userTier }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'dog', 'cat', 'bird', 'other']

  const filteredSounds = sounds.filter(sound => {
    const matchesSearch = sound.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sound.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || sound.species === selectedCategory
    const hasAccess = userTier === 'pro' || userTier === 'premium' || !sound.premiumOnly
    
    return matchesSearch && matchesCategory && hasAccess
  })

  const premiumSounds = sounds.filter(sound => sound.premiumOnly && userTier === 'free')

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sound Library</h2>
        <p className="text-gray-600">Explore common pet vocalizations and their meanings</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search sounds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sound Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSounds.map((sound, index) => (
          <SoundCard key={index} sound={sound} />
        ))}
      </div>

      {/* Premium Sounds Teaser */}
      {premiumSounds.length > 0 && userTier === 'free' && (
        <div className="mt-8">
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-6 border border-accent/20">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-semibold text-gray-900">Premium Sounds</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Unlock {premiumSounds.length} additional sounds with detailed behavioral insights
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {premiumSounds.slice(0, 4).map((sound, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 rounded-md">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{sound.name}</p>
                    <p className="text-sm text-gray-600">{sound.species}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors">
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const SoundCard = ({ sound }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    // Simulate audio playback
    setTimeout(() => setIsPlaying(false), 2000)
  }

  return (
    <div className="bg-surface rounded-lg shadow-card p-4 hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{sound.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{sound.species}</p>
        </div>
        <button
          onClick={handlePlay}
          className={`p-2 rounded-full transition-colors ${
            isPlaying 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Play className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-sm text-gray-700 mb-3">{sound.description}</p>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Meaning:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            sound.emotional_state === 'happy' ? 'bg-green-100 text-green-800' :
            sound.emotional_state === 'anxious' ? 'bg-yellow-100 text-yellow-800' :
            sound.emotional_state === 'alert' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {sound.emotional_state}
          </span>
        </div>
        
        {sound.context && (
          <div className="text-xs text-gray-600">
            <strong>Context:</strong> {sound.context}
          </div>
        )}
      </div>
    </div>
  )
}