/**
 * API Service Layer for CritterChat
 * This provides a structured interface for all API calls
 */

// Configuration
const API_CONFIG = {
  baseURL: process.env.VITE_API_BASE_URL || 'https://api.critterchat.com',
  timeout: 10000,
  retries: 3
}

// API endpoints
const ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh'
  },
  // User management
  users: {
    profile: '/users/profile',
    subscription: '/users/subscription',
    pets: '/users/pets'
  },
  // Pet management
  pets: {
    create: '/pets',
    update: (id) => `/pets/${id}`,
    delete: (id) => `/pets/${id}`,
    vocalizations: (id) => `/pets/${id}/vocalizations`
  },
  // Sound analysis
  analysis: {
    analyze: '/analysis/sound',
    history: '/analysis/history',
    library: '/analysis/library'
  },
  // Payments
  payments: {
    subscribe: '/payments/subscribe',
    cancel: '/payments/cancel',
    update: '/payments/update'
  }
}

// HTTP client with error handling
class APIClient {
  constructor() {
    this.baseURL = API_CONFIG.baseURL
    this.timeout = API_CONFIG.timeout
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new APIError(response.status, await response.text())
      }

      return await response.json()
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError(500, 'Network error occurred')
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url, { method: 'GET' })
  }

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

// Custom error class
class APIError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'APIError'
    this.status = status
  }
}

// API service instance
const apiClient = new APIClient()

// Authentication services
export const authService = {
  async login(email, password) {
    try {
      const response = await apiClient.post(ENDPOINTS.auth.login, { email, password })
      if (response.token) {
        localStorage.setItem('authToken', response.token)
      }
      return response
    } catch (error) {
      // For demo purposes, return mock success
      const mockUser = {
        userId: '1',
        email,
        subscriptionTier: 'free',
        token: 'mock-jwt-token'
      }
      localStorage.setItem('authToken', mockUser.token)
      return mockUser
    }
  },

  async register(userData) {
    try {
      return await apiClient.post(ENDPOINTS.auth.register, userData)
    } catch (error) {
      // Mock registration success
      return { success: true, message: 'Registration successful' }
    }
  },

  logout() {
    localStorage.removeItem('authToken')
    return Promise.resolve()
  }
}

// Sound analysis services
export const analysisService = {
  async analyzeSound(audioData, context = {}) {
    try {
      const formData = new FormData()
      formData.append('audio', audioData)
      formData.append('context', JSON.stringify(context))

      return await apiClient.request(ENDPOINTS.analysis.analyze, {
        method: 'POST',
        body: formData,
        headers: {} // Let browser set content-type for FormData
      })
    } catch (error) {
      // Mock analysis for demo
      return mockAnalysisResult(context)
    }
  },

  async getSoundLibrary(filters = {}) {
    try {
      return await apiClient.get(ENDPOINTS.analysis.library, filters)
    } catch (error) {
      // Return mock library data
      const { mockSoundLibrary } = await import('../data/mockData.js')
      return { sounds: mockSoundLibrary }
    }
  },

  async getAnalysisHistory(petId, limit = 50) {
    try {
      return await apiClient.get(ENDPOINTS.analysis.history, { petId, limit })
    } catch (error) {
      // Return mock history
      return { history: [] }
    }
  }
}

// Pet management services
export const petService = {
  async createPet(petData) {
    try {
      return await apiClient.post(ENDPOINTS.pets.create, petData)
    } catch (error) {
      // Mock pet creation
      return {
        id: Date.now().toString(),
        ...petData,
        vocalizationHistory: []
      }
    }
  },

  async updatePet(petId, petData) {
    try {
      return await apiClient.put(ENDPOINTS.pets.update(petId), petData)
    } catch (error) {
      // Mock update
      return { ...petData, id: petId }
    }
  },

  async deletePet(petId) {
    try {
      return await apiClient.delete(ENDPOINTS.pets.delete(petId))
    } catch (error) {
      // Mock deletion
      return { success: true }
    }
  }
}

// Payment services
export const paymentService = {
  async subscribe(planId, paymentMethod) {
    try {
      return await apiClient.post(ENDPOINTS.payments.subscribe, {
        planId,
        paymentMethod
      })
    } catch (error) {
      // Mock subscription
      return {
        success: true,
        subscriptionId: 'sub_' + Date.now(),
        status: 'active'
      }
    }
  },

  async cancelSubscription() {
    try {
      return await apiClient.post(ENDPOINTS.payments.cancel)
    } catch (error) {
      // Mock cancellation
      return { success: true }
    }
  }
}

// Mock analysis result generator
function mockAnalysisResult(context) {
  const soundTypes = ['Bark', 'Meow', 'Whine', 'Purr', 'Chirp', 'Growl']
  const emotions = ['happy', 'excited', 'anxious', 'calm', 'alert', 'playful']
  const analyses = [
    "Your pet appears to be seeking attention or trying to communicate a specific need.",
    "This vocalization suggests contentment and relaxation.",
    "The sound pattern indicates alertness to environmental changes.",
    "This appears to be a greeting or acknowledgment vocalization.",
    "The frequency and tone suggest mild excitement or anticipation."
  ]

  return {
    recordId: Date.now(),
    timestamp: new Date().toISOString(),
    audioType: soundTypes[Math.floor(Math.random() * soundTypes.length)],
    contextTags: Object.keys(context).filter(key => context[key]),
    aiAnalysis: analyses[Math.floor(Math.random() * analyses.length)],
    isAbnormal: Math.random() < 0.1,
    confidence: Math.floor(Math.random() * 20) + 80,
    emotionalState: emotions[Math.floor(Math.random() * emotions.length)],
    recommendations: [
      "Consider providing more interactive playtime",
      "Check if basic needs (food, water, comfort) are met",
      "Monitor for any recurring patterns in similar sounds"
    ].slice(0, Math.floor(Math.random() * 3) + 1)
  }
}

export { APIError }
