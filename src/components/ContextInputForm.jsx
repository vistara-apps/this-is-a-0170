import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'

export const ContextInputForm = ({ onContextChange, onAnalyze, isAnalyzing }) => {
  const [context, setContext] = useState({
    timeOfDay: '',
    activity: '',
    location: '',
    nearbyEvents: '',
    petMood: '',
    recentChanges: false,
    withOtherPets: false,
    afterMeal: false,
    beforeWalk: false
  })

  const handleInputChange = (field, value) => {
    const newContext = { ...context, [field]: value }
    setContext(newContext)
    onContextChange(newContext)
  }

  const timeOptions = [
    { value: 'morning', label: 'Morning (6AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
    { value: 'evening', label: 'Evening (6PM - 10PM)' },
    { value: 'night', label: 'Night (10PM - 6AM)' }
  ]

  const activityOptions = [
    { value: 'resting', label: 'Resting/Sleeping' },
    { value: 'playing', label: 'Playing' },
    { value: 'eating', label: 'Eating/Drinking' },
    { value: 'walking', label: 'Walking/Exercise' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'exploring', label: 'Exploring' },
    { value: 'other', label: 'Other' }
  ]

  const locationOptions = [
    { value: 'inside', label: 'Inside Home' },
    { value: 'yard', label: 'Yard/Garden' },
    { value: 'park', label: 'Park' },
    { value: 'street', label: 'Street/Sidewalk' },
    { value: 'car', label: 'In Car' },
    { value: 'vet', label: 'Veterinary Clinic' },
    { value: 'other', label: 'Other Location' }
  ]

  const moodOptions = [
    { value: 'calm', label: 'Calm' },
    { value: 'excited', label: 'Excited' },
    { value: 'anxious', label: 'Anxious' },
    { value: 'playful', label: 'Playful' },
    { value: 'tired', label: 'Tired' },
    { value: 'alert', label: 'Alert' },
    { value: 'unknown', label: 'Unknown' }
  ]

  return (
    <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Context for Better Analysis</h3>
      <p className="text-gray-600 mb-6">Provide additional information to help our AI understand the situation better.</p>
      
      <div className="space-y-6">
        {/* Time of Day */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
          <select
            value={context.timeOfDay}
            onChange={(e) => handleInputChange('timeOfDay', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select time period</option>
            {timeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Activity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pet Activity</label>
          <select
            value={context.activity}
            onChange={(e) => handleInputChange('activity', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">What was your pet doing?</option>
            {activityOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <select
            value={context.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Where did this happen?</option>
            {locationOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Pet Mood */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pet's General Mood</label>
          <select
            value={context.petMood}
            onChange={(e) => handleInputChange('petMood', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">How did your pet seem?</option>
            {moodOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Nearby Events */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nearby Events (Optional)</label>
          <textarea
            value={context.nearbyEvents}
            onChange={(e) => handleInputChange('nearbyEvents', e.target.value)}
            placeholder="Any sounds, people, or activities happening nearby..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent h-20 resize-none"
          />
        </div>

        {/* Checkbox Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Additional Context</label>
          <div className="space-y-2">
            {[
              { key: 'recentChanges', label: 'Recent changes in routine or environment' },
              { key: 'withOtherPets', label: 'Other pets were present' },
              { key: 'afterMeal', label: 'Shortly after eating' },
              { key: 'beforeWalk', label: 'Before expected walk/exercise time' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={context[key]}
                  onChange={(e) => handleInputChange(key, e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Sound...</span>
            </>
          ) : (
            <span>Analyze Sound</span>
          )}
        </button>
      </div>
    </div>
  )
}