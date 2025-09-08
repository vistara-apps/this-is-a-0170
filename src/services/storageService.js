/**
 * Local Storage Service for CritterChat
 * Provides persistent data storage using localStorage with fallback handling
 */

const STORAGE_KEYS = {
  USER_DATA: 'critterchat_user',
  PETS_DATA: 'critterchat_pets',
  SETTINGS: 'critterchat_settings',
  SOUND_LIBRARY: 'critterchat_sound_library',
  ANALYTICS_CACHE: 'critterchat_analytics',
  AUTH_TOKEN: 'critterchat_auth_token',
  ONBOARDING_STATUS: 'critterchat_onboarding'
}

class StorageService {
  constructor() {
    this.isAvailable = this.checkStorageAvailability()
    this.cache = new Map() // In-memory fallback
  }

  checkStorageAvailability() {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      console.warn('localStorage is not available, using in-memory storage')
      return false
    }
  }

  // Generic storage methods
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        version: '1.0'
      })

      if (this.isAvailable) {
        localStorage.setItem(key, serializedValue)
      } else {
        this.cache.set(key, serializedValue)
      }
      return true
    } catch (error) {
      console.error('Error saving to storage:', error)
      return false
    }
  }

  getItem(key, defaultValue = null) {
    try {
      let serializedValue
      
      if (this.isAvailable) {
        serializedValue = localStorage.getItem(key)
      } else {
        serializedValue = this.cache.get(key)
      }

      if (!serializedValue) {
        return defaultValue
      }

      const parsed = JSON.parse(serializedValue)
      
      // Check if data is expired (optional, for cache invalidation)
      const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days
      if (parsed.timestamp && Date.now() - parsed.timestamp > maxAge) {
        this.removeItem(key)
        return defaultValue
      }

      return parsed.data
    } catch (error) {
      console.error('Error reading from storage:', error)
      return defaultValue
    }
  }

  removeItem(key) {
    try {
      if (this.isAvailable) {
        localStorage.removeItem(key)
      } else {
        this.cache.delete(key)
      }
      return true
    } catch (error) {
      console.error('Error removing from storage:', error)
      return false
    }
  }

  clear() {
    try {
      if (this.isAvailable) {
        // Only clear CritterChat keys, not all localStorage
        Object.values(STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key)
        })
      } else {
        this.cache.clear()
      }
      return true
    } catch (error) {
      console.error('Error clearing storage:', error)
      return false
    }
  }

  // User data methods
  saveUser(userData) {
    return this.setItem(STORAGE_KEYS.USER_DATA, userData)
  }

  getUser() {
    return this.getItem(STORAGE_KEYS.USER_DATA)
  }

  updateUser(updates) {
    const currentUser = this.getUser()
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates }
      return this.saveUser(updatedUser)
    }
    return false
  }

  // Pet data methods
  savePets(petsData) {
    return this.setItem(STORAGE_KEYS.PETS_DATA, petsData)
  }

  getPets() {
    return this.getItem(STORAGE_KEYS.PETS_DATA, [])
  }

  addPet(petData) {
    const pets = this.getPets()
    const newPet = {
      ...petData,
      id: petData.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      vocalizationHistory: petData.vocalizationHistory || []
    }
    pets.push(newPet)
    return this.savePets(pets) ? newPet : null
  }

  updatePet(petId, updates) {
    const pets = this.getPets()
    const petIndex = pets.findIndex(pet => pet.id === petId)
    
    if (petIndex !== -1) {
      pets[petIndex] = { ...pets[petIndex], ...updates, updatedAt: new Date().toISOString() }
      return this.savePets(pets) ? pets[petIndex] : null
    }
    return null
  }

  deletePet(petId) {
    const pets = this.getPets()
    const filteredPets = pets.filter(pet => pet.id !== petId)
    return this.savePets(filteredPets)
  }

  addVocalizationRecord(petId, record) {
    const pets = this.getPets()
    const petIndex = pets.findIndex(pet => pet.id === petId)
    
    if (petIndex !== -1) {
      const recordWithId = {
        ...record,
        recordId: record.recordId || Date.now().toString(),
        petId,
        timestamp: record.timestamp || new Date().toISOString()
      }
      
      pets[petIndex].vocalizationHistory = pets[petIndex].vocalizationHistory || []
      pets[petIndex].vocalizationHistory.push(recordWithId)
      pets[petIndex].updatedAt = new Date().toISOString()
      
      return this.savePets(pets) ? recordWithId : null
    }
    return null
  }

  // Settings methods
  saveSettings(settings) {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings)
  }

  getSettings() {
    return this.getItem(STORAGE_KEYS.SETTINGS, {
      notifications: true,
      soundAlerts: true,
      theme: 'light',
      language: 'en',
      autoAnalysis: true,
      dataRetention: 90 // days
    })
  }

  updateSettings(updates) {
    const currentSettings = this.getSettings()
    const updatedSettings = { ...currentSettings, ...updates }
    return this.saveSettings(updatedSettings)
  }

  // Sound library cache
  cacheSoundLibrary(libraryData) {
    return this.setItem(STORAGE_KEYS.SOUND_LIBRARY, libraryData)
  }

  getCachedSoundLibrary() {
    return this.getItem(STORAGE_KEYS.SOUND_LIBRARY)
  }

  // Analytics cache
  cacheAnalytics(petId, analyticsData) {
    const cache = this.getItem(STORAGE_KEYS.ANALYTICS_CACHE, {})
    cache[petId] = {
      ...analyticsData,
      cachedAt: Date.now()
    }
    return this.setItem(STORAGE_KEYS.ANALYTICS_CACHE, cache)
  }

  getCachedAnalytics(petId) {
    const cache = this.getItem(STORAGE_KEYS.ANALYTICS_CACHE, {})
    const petAnalytics = cache[petId]
    
    if (petAnalytics) {
      // Check if cache is still valid (1 hour)
      const maxAge = 60 * 60 * 1000
      if (Date.now() - petAnalytics.cachedAt < maxAge) {
        return petAnalytics
      }
    }
    return null
  }

  // Authentication token
  saveAuthToken(token) {
    return this.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  }

  getAuthToken() {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  removeAuthToken() {
    return this.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  // Onboarding status
  setOnboardingComplete(step = 'complete') {
    return this.setItem(STORAGE_KEYS.ONBOARDING_STATUS, {
      completed: true,
      step,
      completedAt: new Date().toISOString()
    })
  }

  getOnboardingStatus() {
    return this.getItem(STORAGE_KEYS.ONBOARDING_STATUS, {
      completed: false,
      step: 'welcome'
    })
  }

  // Data export/import
  exportAllData() {
    const data = {
      user: this.getUser(),
      pets: this.getPets(),
      settings: this.getSettings(),
      onboarding: this.getOnboardingStatus(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
    return data
  }

  importData(data) {
    try {
      if (data.user) this.saveUser(data.user)
      if (data.pets) this.savePets(data.pets)
      if (data.settings) this.saveSettings(data.settings)
      if (data.onboarding) this.setItem(STORAGE_KEYS.ONBOARDING_STATUS, data.onboarding)
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  // Storage usage information
  getStorageInfo() {
    if (!this.isAvailable) {
      return {
        available: false,
        used: this.cache.size,
        total: 'unlimited',
        percentage: 0
      }
    }

    try {
      let used = 0
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key)
        if (item) {
          used += item.length
        }
      })

      // Estimate total localStorage size (usually 5-10MB)
      const total = 5 * 1024 * 1024 // 5MB estimate
      const percentage = (used / total) * 100

      return {
        available: true,
        used,
        total,
        percentage: Math.round(percentage * 100) / 100,
        usedFormatted: this.formatBytes(used),
        totalFormatted: this.formatBytes(total)
      }
    } catch (error) {
      return {
        available: true,
        used: 0,
        total: 'unknown',
        percentage: 0,
        error: error.message
      }
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Data cleanup
  cleanupOldData() {
    const settings = this.getSettings()
    const retentionDays = settings.dataRetention || 90
    const cutoffDate = new Date(Date.now() - (retentionDays * 24 * 60 * 60 * 1000))

    const pets = this.getPets()
    let cleaned = false

    pets.forEach(pet => {
      if (pet.vocalizationHistory) {
        const originalLength = pet.vocalizationHistory.length
        pet.vocalizationHistory = pet.vocalizationHistory.filter(record => 
          new Date(record.timestamp) > cutoffDate
        )
        if (pet.vocalizationHistory.length < originalLength) {
          cleaned = true
        }
      }
    })

    if (cleaned) {
      this.savePets(pets)
      console.log(`Cleaned up old vocalization data older than ${retentionDays} days`)
    }

    return cleaned
  }
}

// Create and export singleton instance
const storageService = new StorageService()

export default storageService
export { STORAGE_KEYS }
