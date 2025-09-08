import React, { useState, useRef } from 'react'
import { Mic, Square, Upload, Play, RotateCcw } from 'lucide-react'
import { SoundWaveVisualizer } from './SoundWaveVisualizer'
import { AnalysisResultCard } from './AnalysisResultCard'
import { ContextInputForm } from './ContextInputForm'

export const SoundRecorder = ({ pet, onAnalysisComplete }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [contextData, setContextData] = useState({})
  const [recordingDuration, setRecordingDuration] = useState(0)
  const intervalRef = useRef(null)

  const startRecording = () => {
    setIsRecording(true)
    setRecordingDuration(0)
    intervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setHasRecording(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetRecording = () => {
    setIsRecording(false)
    setHasRecording(false)
    setAnalysisResult(null)
    setRecordingDuration(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const analyzeSound = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock analysis result
    const mockAnalysis = {
      recordId: Date.now(),
      petId: pet.id,
      timestamp: new Date().toLocaleString(),
      audioType: getRandomSoundType(pet.species),
      contextTags: Object.keys(contextData).filter(key => contextData[key]),
      aiAnalysis: generateMockAnalysis(pet.species, contextData),
      isAbnormal: Math.random() < 0.1, // 10% chance of abnormal sound
      confidence: Math.floor(Math.random() * 20) + 80, // 80-99% confidence
      emotionalState: getRandomEmotionalState(),
      recommendations: generateRecommendations(pet.species)
    }
    
    setAnalysisResult(mockAnalysis)
    setIsAnalyzing(false)
    onAnalysisComplete(mockAnalysis)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Record & Analyze</h2>
        <p className="text-gray-600">Capture your pet's sounds for AI analysis</p>
      </div>

      {/* Recording Interface */}
      <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
        <div className="text-center space-y-6">
          {/* Microphone Visualization */}
          <div className="relative">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'bg-gradient-to-br from-red-400 to-red-600 animate-pulse-slow' 
                : hasRecording
                ? 'bg-gradient-to-br from-green-400 to-green-600'
                : 'bg-gradient-to-br from-forest-400 to-forest-600'
            }`}>
              {isRecording ? (
                <Square className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}
            </div>
            
            {isRecording && (
              <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
            )}
          </div>

          {/* Recording Status */}
          <div>
            {isRecording && (
              <div className="space-y-2">
                <p className="text-red-600 font-medium">Recording...</p>
                <p className="text-2xl font-mono text-gray-900">{formatTime(recordingDuration)}</p>
              </div>
            )}
            
            {hasRecording && !isRecording && (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">Recording Complete</p>
                <p className="text-lg text-gray-700">Duration: {formatTime(recordingDuration)}</p>
              </div>
            )}
            
            {!hasRecording && !isRecording && (
              <p className="text-gray-600">Tap the microphone to start recording</p>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            {!isRecording && !hasRecording && (
              <button
                onClick={startRecording}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Start Recording
              </button>
            )}
            
            {isRecording && (
              <button
                onClick={stopRecording}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Stop Recording
              </button>
            )}
            
            {hasRecording && !isRecording && (
              <div className="flex space-x-3">
                <button
                  onClick={resetRecording}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Re-record</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sound Wave Visualizer */}
        {(isRecording || hasRecording) && (
          <div className="mt-6">
            <SoundWaveVisualizer isActive={isRecording} />
          </div>
        )}
      </div>

      {/* Context Input */}
      {hasRecording && !analysisResult && (
        <ContextInputForm 
          onContextChange={setContextData}
          onAnalyze={analyzeSound}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <AnalysisResultCard 
          analysis={analysisResult}
          pet={pet}
        />
      )}

      {/* File Upload Option */}
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
        <div className="text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-2">Or upload an audio file</p>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            id="audio-upload"
            onChange={(e) => {
              if (e.target.files[0]) {
                setHasRecording(true)
                setRecordingDuration(Math.floor(Math.random() * 30) + 10) // Random duration 10-40s
              }
            }}
          />
          <label
            htmlFor="audio-upload"
            className="inline-block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Choose File
          </label>
        </div>
      </div>
    </div>
  )
}

// Helper functions for mock data generation
const getRandomSoundType = (species) => {
  const sounds = {
    dog: ['Bark', 'Whine', 'Growl', 'Howl', 'Pant', 'Whimper'],
    cat: ['Meow', 'Purr', 'Hiss', 'Chirp', 'Trill', 'Yowl'],
    bird: ['Chirp', 'Tweet', 'Squawk', 'Whistle', 'Call']
  }
  const speciesSounds = sounds[species] || sounds.dog
  return speciesSounds[Math.floor(Math.random() * speciesSounds.length)]
}

const getRandomEmotionalState = () => {
  const states = ['happy', 'excited', 'calm', 'anxious', 'alert', 'playful', 'tired']
  return states[Math.floor(Math.random() * states.length)]
}

const generateMockAnalysis = (species, context) => {
  const analyses = [
    "Your pet appears to be seeking attention or trying to communicate a specific need.",
    "This vocalization suggests contentment and relaxation.",
    "The sound pattern indicates alertness to environmental changes.",
    "This appears to be a greeting or acknowledgment vocalization.",
    "The frequency and tone suggest mild excitement or anticipation."
  ]
  return analyses[Math.floor(Math.random() * analyses.length)]
}

const generateRecommendations = (species) => {
  const recommendations = [
    "Consider providing more interactive playtime",
    "Check if basic needs (food, water, comfort) are met",
    "Monitor for any recurring patterns in similar sounds",
    "Positive reinforcement when calm behavior is displayed"
  ]
  return recommendations.slice(0, Math.floor(Math.random() * 3) + 1)
}