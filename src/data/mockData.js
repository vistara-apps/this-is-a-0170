export const mockUser = {
  userId: '1',
  email: 'petlover@example.com',
  subscriptionTier: 'premium',
  joinDate: '2024-01-15'
}

export const mockPets = [
  {
    id: '1',
    userId: '1',
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    vocalizationHistory: [
      {
        recordId: '1',
        petId: '1',
        timestamp: '2024-01-20 14:30:00',
        audioType: 'Bark',
        contextTags: ['afternoon', 'playing', 'yard'],
        aiAnalysis: 'Excited, playful bark indicating joy and energy. This is a positive vocalization showing your pet is engaged and happy.',
        isAbnormal: false,
        confidence: 92,
        emotionalState: 'excited'
      },
      {
        recordId: '2',
        petId: '1',
        timestamp: '2024-01-19 09:15:00',
        audioType: 'Whine',
        contextTags: ['morning', 'beforeWalk'],
        aiAnalysis: 'Anticipatory whining, likely requesting a walk or outdoor activity. This shows learned behavior and communication.',
        isAbnormal: false,
        confidence: 88,
        emotionalState: 'anxious'
      }
    ]
  },
  {
    id: '2',
    userId: '1',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamese',
    age: 2,
    vocalizationHistory: [
      {
        recordId: '3',
        petId: '2',
        timestamp: '2024-01-20 08:00:00',
        audioType: 'Meow',
        contextTags: ['morning', 'eating'],
        aiAnalysis: 'Demanding meow typically used for food requests. This is normal communication behavior for meal times.',
        isAbnormal: false,
        confidence: 95,
        emotionalState: 'alert'
      }
    ]
  }
]

export const mockSoundLibrary = [
  {
    name: 'Happy Bark',
    species: 'dog',
    description: 'A cheerful, excited bark often heard during play or when greeting family members.',
    emotional_state: 'happy',
    context: 'Play time, greeting owners, seeing other dogs',
    premiumOnly: false
  },
  {
    name: 'Attention Seeking Bark',
    species: 'dog',
    description: 'Repetitive, persistent barking used to get human attention or request something.',
    emotional_state: 'alert',
    context: 'Wanting food, needing to go outside, seeking interaction',
    premiumOnly: false
  },
  {
    name: 'Alert Bark',
    species: 'dog',
    description: 'Sharp, quick barks indicating alertness to something unusual in the environment.',
    emotional_state: 'alert',
    context: 'Strangers approaching, unusual sounds, territorial response',
    premiumOnly: false
  },
  {
    name: 'Anxious Whine',
    species: 'dog',
    description: 'High-pitched whining that indicates stress, anxiety, or discomfort.',
    emotional_state: 'anxious',
    context: 'Separation anxiety, unfamiliar environments, waiting',
    premiumOnly: true
  },
  {
    name: 'Content Purr',
    species: 'cat',
    description: 'Low, rumbling purr indicating relaxation and contentment.',
    emotional_state: 'happy',
    context: 'Being petted, comfortable resting, feeding',
    premiumOnly: false
  },
  {
    name: 'Demand Meow',
    species: 'cat',
    description: 'Insistent meowing used to request food, attention, or access to areas.',
    emotional_state: 'alert',
    context: 'Meal times, wanting to go outside, seeking attention',
    premiumOnly: false
  },
  {
    name: 'Greeting Trill',
    species: 'cat',
    description: 'Musical trilling sound used as a friendly greeting, especially from mother cats to kittens.',
    emotional_state: 'happy',
    context: 'Greeting owners, calling to other cats, expressing friendliness',
    premiumOnly: true
  },
  {
    name: 'Distress Yowl',
    species: 'cat',
    description: 'Loud, prolonged vocalizations that may indicate pain, distress, or mating behavior.',
    emotional_state: 'anxious',
    context: 'Medical issues, territorial disputes, mating season',
    premiumOnly: true
  },
  {
    name: 'Morning Song',
    species: 'bird',
    description: 'Melodic singing typically heard in the early morning hours.',
    emotional_state: 'happy',
    context: 'Dawn chorus, territorial marking, attracting mates',
    premiumOnly: false
  },
  {
    name: 'Contact Call',
    species: 'bird',
    description: 'Short calls used to maintain contact with flock members or owners.',
    emotional_state: 'alert',
    context: 'Checking location of others, maintaining social bonds',
    premiumOnly: true
  }
]