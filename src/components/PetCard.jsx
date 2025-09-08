import React from 'react'
import { clsx } from 'clsx'

export const PetCard = ({ pet, isSelected, onClick, variant = 'default' }) => {
  const isCompact = variant === 'compact'

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-surface rounded-lg shadow-card border cursor-pointer transition-all duration-200',
        isSelected 
          ? 'border-primary ring-2 ring-primary/20' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-lg',
        isCompact ? 'p-4' : 'p-6'
      )}
    >
      <div className={clsx(
        'flex items-center',
        isCompact ? 'space-x-3' : 'space-x-4'
      )}>
        <div className={clsx(
          'bg-gradient-to-br from-forest-400 to-forest-600 rounded-full flex items-center justify-center flex-shrink-0',
          isCompact ? 'w-12 h-12 text-xl' : 'w-16 h-16 text-2xl'
        )}>
          {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : '🐦'}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={clsx(
            'font-semibold text-gray-900 truncate',
            isCompact ? 'text-base' : 'text-lg'
          )}>
            {pet.name}
          </h3>
          <p className={clsx(
            'text-gray-600 capitalize',
            isCompact ? 'text-sm' : 'text-base'
          )}>
            {pet.breed} {pet.species}
          </p>
          {!isCompact && (
            <p className="text-sm text-gray-500">{pet.age} years old</p>
          )}
        </div>

        {isSelected && (
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {!isCompact && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Recordings:</span>
            <span className="font-medium text-gray-900">
              {pet.vocalizationHistory.length}
            </span>
          </div>
          {pet.vocalizationHistory.length > 0 && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Last recorded:</span>
              <span className="text-gray-900">
                {new Date(pet.vocalizationHistory[pet.vocalizationHistory.length - 1]?.timestamp || Date.now()).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}