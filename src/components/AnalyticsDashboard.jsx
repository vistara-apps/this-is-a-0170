import React, { useState, useMemo } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar,
  Filter,
  Download,
  AlertTriangle,
  Heart,
  Activity
} from 'lucide-react'
import { NotificationBadge } from './NotificationBadge'

export const AnalyticsDashboard = ({ pets, userTier }) => {
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || null)
  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, 90d, 1y
  const [showFilters, setShowFilters] = useState(false)

  // Calculate analytics data
  const analytics = useMemo(() => {
    if (!selectedPet) return null

    const pet = pets.find(p => p.id === selectedPet)
    if (!pet || !pet.vocalizationHistory) return null

    const history = pet.vocalizationHistory
    const now = new Date()
    const timeRangeMs = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000
    }

    const cutoffDate = new Date(now.getTime() - timeRangeMs[timeRange])
    const filteredHistory = history.filter(record => 
      new Date(record.timestamp) >= cutoffDate
    )

    // Emotion distribution
    const emotionCounts = {}
    filteredHistory.forEach(record => {
      const emotion = record.emotionalState || 'unknown'
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
    })

    // Sound type distribution
    const soundTypeCounts = {}
    filteredHistory.forEach(record => {
      const type = record.audioType || 'unknown'
      soundTypeCounts[type] = (soundTypeCounts[type] || 0) + 1
    })

    // Abnormal sounds
    const abnormalSounds = filteredHistory.filter(record => record.isAbnormal)
    
    // Daily activity (for trend analysis)
    const dailyActivity = {}
    filteredHistory.forEach(record => {
      const date = new Date(record.timestamp).toDateString()
      dailyActivity[date] = (dailyActivity[date] || 0) + 1
    })

    // Calculate trends
    const totalSounds = filteredHistory.length
    const avgConfidence = filteredHistory.reduce((sum, record) => 
      sum + (record.confidence || 0), 0) / totalSounds || 0

    return {
      totalSounds,
      abnormalCount: abnormalSounds.length,
      avgConfidence: Math.round(avgConfidence),
      emotionDistribution: emotionCounts,
      soundTypeDistribution: soundTypeCounts,
      dailyActivity,
      abnormalSounds,
      pet
    }
  }, [selectedPet, pets, timeRange])

  const isPremiumFeature = (feature) => {
    if (userTier === 'pro') return false
    if (userTier === 'premium' && feature !== 'advanced-analytics') return false
    return feature === 'advanced-analytics' || feature === 'trend-analysis'
  }

  if (!analytics) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">Select a pet with vocalization history to view analytics.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Insights into {analytics.pet.name}'s vocal patterns</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {pets.map(pet => (
              <option key={pet.id} value={pet.id}>
                {pet.name} ({pet.species})
              </option>
            ))}
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sounds</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalSounds}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgConfidence}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Abnormal Sounds</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.abnormalCount}</p>
            </div>
            <AlertTriangle className={`w-8 h-8 ${analytics.abnormalCount > 0 ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
          {analytics.abnormalCount > 0 && (
            <NotificationBadge 
              type="warning" 
              message={`${analytics.abnormalCount} concerning sounds detected`}
              className="mt-2"
            />
          )}
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Health Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(0, 100 - (analytics.abnormalCount * 10))}%
              </p>
            </div>
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Distribution */}
        <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Emotional States</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          {isPremiumFeature('emotion-analysis') ? (
            <div className="text-center py-8">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6">
                <PieChart className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-2">Premium Feature</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Upgrade to Premium to see detailed emotional state analysis
                </p>
                <button className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors">
                  Upgrade Now
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(analytics.emotionDistribution).map(([emotion, count]) => {
                const percentage = (count / analytics.totalSounds) * 100
                return (
                  <div key={emotion} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getEmotionColor(emotion)}`} />
                      <span className="text-sm font-medium text-gray-700 capitalize">{emotion}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getEmotionColor(emotion)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sound Types */}
        <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sound Types</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {Object.entries(analytics.soundTypeDistribution).map(([type, count]) => {
              const percentage = (count / analytics.totalSounds) * 100
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-accent"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Abnormal Sounds */}
      {analytics.abnormalSounds.length > 0 && (
        <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Concerning Sounds</h3>
            <NotificationBadge type="warning" count={analytics.abnormalSounds.length} />
          </div>
          
          <div className="space-y-3">
            {analytics.abnormalSounds.slice(0, 5).map((sound, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-md border border-red-100">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{sound.audioType}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(sound.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{sound.aiAnalysis}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Confidence: {sound.confidence}% • Requires attention
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Export Data</h4>
            <p className="text-sm text-gray-600">Download your pet's vocalization data</p>
          </div>
          <button 
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => {
              // Mock export functionality
              const data = JSON.stringify(analytics, null, 2)
              const blob = new Blob([data], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${analytics.pet.name}-analytics-${timeRange}.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to get emotion colors
function getEmotionColor(emotion) {
  const colors = {
    happy: 'bg-green-400',
    excited: 'bg-yellow-400',
    calm: 'bg-blue-400',
    anxious: 'bg-red-400',
    alert: 'bg-orange-400',
    playful: 'bg-purple-400',
    tired: 'bg-gray-400',
    unknown: 'bg-gray-300'
  }
  return colors[emotion] || colors.unknown
}
