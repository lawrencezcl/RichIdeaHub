'use client'

import { useState } from 'react'
import { Heart, Bookmark, BookmarkCheck } from 'lucide-react'
import { favoritesManager, FavoriteCase } from '@/lib/favorites'

interface FavoriteButtonProps {
  caseData: {
    id: number
    title: string
    description: string
    income: string
    category: string
    difficulty: string
  }
  variant?: 'icon' | 'button' | 'card'
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  className?: string
  onToggle?: (isFavorite: boolean) => void
}

export default function FavoriteButton({
  caseData,
  variant = 'icon',
  size = 'md',
  showCount = false,
  className = '',
  onToggle
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(() =>
    favoritesManager.isFavorite(caseData.id)
  )
  const [isLoading, setIsLoading] = useState(false)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const buttonSizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const handleToggleFavorite = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const favoriteData: FavoriteCase = {
        id: caseData.id,
        title: caseData.title,
        description: caseData.description,
        income: caseData.income,
        category: caseData.category,
        difficulty: caseData.difficulty,
        addedAt: new Date().toISOString()
      }

      const newFavoritedState = !isFavorited
      favoritesManager.toggleFavorite(favoriteData)
      setIsFavorited(newFavoritedState)

      // Call the onToggle callback if provided
      onToggle?.(newFavoritedState)

      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Listen for favorites changes from other components
  useState(() => {
    const handleFavoritesChanged = () => {
      setIsFavorited(favoritesManager.isFavorite(caseData.id))
    }

    window.addEventListener('favorites-changed', handleFavoritesChanged)
    return () => {
      window.removeEventListener('favorites-changed', handleFavoritesChanged)
    }
  })

  const favoritesCount = favoritesManager.getFavoritesCount()

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`
          p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${isFavorited
            ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }
          ${className}
        `}
        title={isFavorited ? '取消收藏' : '添加收藏'}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : (
          <Heart
            className={`${sizeClasses[size]} ${isFavorited ? 'fill-current' : ''}`}
          />
        )}
      </button>
    )
  }

  if (variant === 'card') {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`
          group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isFavorited
            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }
          ${className}
        `}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : (
          <>
            <Heart className={`${sizeClasses[size]} ${isFavorited ? 'fill-current' : ''}`} />
            <span className="font-medium text-sm">
              {isFavorited ? '已收藏' : '收藏'}
            </span>
          </>
        )}
      </button>
    )
  }

  // Default button variant
  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`
        flex items-center space-x-2 rounded-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonSizeClasses[size]}
        ${isFavorited
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
        ${className}
      `}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : (
        <>
          {isFavorited ? (
            <BookmarkCheck className={sizeClasses[size]} />
          ) : (
            <Bookmark className={sizeClasses[size]} />
          )}
          <span className="font-medium">
            {isFavorited ? '已收藏' : '收藏'}
          </span>
          {showCount && favoritesCount > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {favoritesCount}
            </span>
          )}
        </>
      )}
    </button>
  )
}