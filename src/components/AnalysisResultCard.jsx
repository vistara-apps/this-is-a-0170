import React from 'react'
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'

export const AnalysisResultCard = ({ analysis, pet }) => {
  const getVariantStyles = () => {
    if (analysis.isAbnormal) {
      return {
        container: 'border-red-200 bg-red-50',
        header: 'text-red-800',
        icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
        badge: 'bg-red-100 text-red-800'
      }
    }
    
    if (analysis.confidence > 90) {
      return {
        container: 'border-green-200 bg-green-50',
        header: 'text-green-800',
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        badge: 'bg-green-100 text-green-800'
      }
    }
    
    return {
      container: 'border-blue-200 bg-blue-50',
      header: 'text-blue-800',
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      badge: 'bg-blue-100 text-blue-800'
    }
  }

  const styles = getVariantStyles()

  return (
    <div className={`rounded-lg shadow-card p-6 border-2 ${styles.container}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${styles.header}`}>
                Analysis Complete
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles.badge}`}>
                {analysis.confidence}% confident
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{analysis.timestamp}</span>
              </span>
              <span>Sound Type: <strong>{analysis.audioType}</strong></span>
              <span>Mood: <strong className="capitalize">{analysis.emotionalState}</strong></span>
            </div>
          </div>

          {/* Analysis Text */}
          <div className="prose prose-sm">
            <p className="text-gray-700 leading-relaxed">
              {analysis.aiAnalysis}
            </p>
          </div>

          {/* Context Tags */}
          {analysis.contextTags.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Context:</p>
              <div className="flex flex-wrap gap-2">
                {analysis.contextTags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                  >
                    {tag.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Abnormal Sound Alert */}
          {analysis.isAbnormal && (
            <div className="bg-red-100 border border-red-200 rounded-md p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Unusual Vocalization Detected
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    This sound pattern is uncommon for {pet.name}. Consider monitoring your pet's behavior and consult a veterinarian if you notice other concerning signs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Save to History
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Share with Vet
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Record Another
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}