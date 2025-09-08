import React, { useEffect, useState } from 'react'

export const SoundWaveVisualizer = ({ isActive }) => {
  const [waveData, setWaveData] = useState(Array(20).fill(0))

  useEffect(() => {
    let interval
    if (isActive) {
      interval = setInterval(() => {
        setWaveData(prev => 
          prev.map(() => Math.random() * 100)
        )
      }, 100)
    } else {
      setWaveData(Array(20).fill(0))
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive])

  return (
    <div className="flex items-end justify-center space-x-1 h-20 bg-gray-50 rounded-lg p-4">
      {waveData.map((height, index) => (
        <div
          key={index}
          className={`w-2 transition-all duration-100 ease-in-out rounded-full ${
            isActive ? 'sound-wave' : 'bg-gray-300'
          }`}
          style={{
            height: `${Math.max(height, 10)}%`,
            minHeight: '4px'
          }}
        />
      ))}
    </div>
  )
}