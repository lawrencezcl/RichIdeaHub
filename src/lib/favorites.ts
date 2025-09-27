'use client'

import { useState, useEffect } from 'react'

// Client-side favorites management using localStorage
export interface FavoriteCase {
  id: number
  title: string
  description: string
  income: string
  category: string
  difficulty: string
  addedAt: string
  notes?: string
}

export interface FavoritesManager {
  favorites: FavoriteCase[]
  isFavorite: (caseId: number) => boolean
  addToFavorites: (caseData: FavoriteCase) => void
  removeFromFavorites: (caseId: number) => void
  toggleFavorite: (caseData: FavoriteCase) => void
  getFavorites: () => FavoriteCase[]
  updateNotes: (caseId: number, notes: string) => void
  clearAll: () => void
  exportFavorites: () => string
  importFavorites: (jsonData: string) => boolean
}

class LocalFavoritesManager implements FavoritesManager {
  private readonly STORAGE_KEY = 'richidea-favorites'
  private _favorites: FavoriteCase[] = []

  constructor() {
    this.loadFavorites()
  }

  private loadFavorites(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY)
        if (stored) {
          this._favorites = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Failed to load favorites from localStorage:', error)
        this._favorites = []
      }
    }
  }

  private saveFavorites(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._favorites))
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error)
      }
    }
  }

  get favorites(): FavoriteCase[] {
    return [...this._favorites]
  }

  isFavorite(caseId: number): boolean {
    return this._favorites.some(fav => fav.id === caseId)
  }

  addToFavorites(caseData: FavoriteCase): void {
    if (!this.isFavorite(caseData.id)) {
      const favorite: FavoriteCase = {
        ...caseData,
        addedAt: new Date().toISOString()
      }
      this._favorites.unshift(favorite) // Add to beginning
      this.saveFavorites()

      // Trigger custom event for UI updates
      this.dispatchEvent('favorites-changed')
    }
  }

  removeFromFavorites(caseId: number): void {
    this._favorites = this._favorites.filter(fav => fav.id !== caseId)
    this.saveFavorites()

    // Trigger custom event for UI updates
    this.dispatchEvent('favorites-changed')
  }

  toggleFavorite(caseData: FavoriteCase): void {
    if (this.isFavorite(caseData.id)) {
      this.removeFromFavorites(caseData.id)
    } else {
      this.addToFavorites(caseData)
    }
  }

  getFavorites(): FavoriteCase[] {
    return this._favorites
  }

  updateNotes(caseId: number, notes: string): void {
    const favorite = this._favorites.find(fav => fav.id === caseId)
    if (favorite) {
      favorite.notes = notes
      this.saveFavorites()
      this.dispatchEvent('favorites-changed')
    }
  }

  clearAll(): void {
    this._favorites = []
    this.saveFavorites()
    this.dispatchEvent('favorites-changed')
  }

  exportFavorites(): string {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      favorites: this._favorites
    }, null, 2)
  }

  importFavorites(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)

      // Validate data structure
      if (!data.favorites || !Array.isArray(data.favorites)) {
        return false
      }

      // Merge with existing favorites, avoiding duplicates
      const existingIds = new Set(this._favorites.map(f => f.id))
      const newFavorites = data.favorites.filter((fav: FavoriteCase) =>
        !existingIds.has(fav.id) && this.validateFavorite(fav)
      )

      this._favorites = [...newFavorites, ...this._favorites]
      this.saveFavorites()
      this.dispatchEvent('favorites-changed')

      return true
    } catch (error) {
      console.error('Failed to import favorites:', error)
      return false
    }
  }

  private validateFavorite(fav: unknown): fav is FavoriteCase {
    if (typeof fav !== 'object' || fav === null) return false
    const f = fav as Record<string, unknown>
    return (
      typeof f.id === 'number' &&
      typeof f.title === 'string' &&
      typeof f.description === 'string' &&
      typeof f.income === 'string' &&
      typeof f.category === 'string' &&
      typeof f.difficulty === 'string' &&
      typeof f.addedAt === 'string'
    )
  }

  private dispatchEvent(eventName: string): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName, {
        detail: { favorites: this._favorites }
      }))
    }
  }

  // Utility methods
  getFavoritesCount(): number {
    return this._favorites.length
  }

  getFavoritesByCategory(): { [category: string]: FavoriteCase[] } {
    return this._favorites.reduce((acc, fav) => {
      if (!acc[fav.category]) {
        acc[fav.category] = []
      }
      acc[fav.category].push(fav)
      return acc
    }, {} as { [category: string]: FavoriteCase[] })
  }

  getRecentFavorites(limit: number = 5): FavoriteCase[] {
    return this._favorites
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(0, limit)
  }

  searchFavorites(query: string): FavoriteCase[] {
    const searchTerm = query.toLowerCase()
    return this._favorites.filter(fav =>
      fav.title.toLowerCase().includes(searchTerm) ||
      fav.description.toLowerCase().includes(searchTerm) ||
      fav.category.toLowerCase().includes(searchTerm) ||
      (fav.notes && fav.notes.toLowerCase().includes(searchTerm))
    )
  }
}

// Create a singleton instance
export const favoritesManager = new LocalFavoritesManager()

// React hook for using favorites
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCase[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load favorites from manager
    setFavorites(favoritesManager.getFavorites())
    setIsLoading(false)

    // Listen for changes
    const handleFavoritesChanged = (event: CustomEvent) => {
      setFavorites(event.detail.favorites)
    }

    window.addEventListener('favorites-changed', handleFavoritesChanged as EventListener)

    return () => {
      window.removeEventListener('favorites-changed', handleFavoritesChanged as EventListener)
    }
  }, [])

  return {
    favorites,
    isLoading,
    isFavorite: favoritesManager.isFavorite.bind(favoritesManager),
    addToFavorites: favoritesManager.addToFavorites.bind(favoritesManager),
    removeFromFavorites: favoritesManager.removeFromFavorites.bind(favoritesManager),
    toggleFavorite: favoritesManager.toggleFavorite.bind(favoritesManager),
    updateNotes: favoritesManager.updateNotes.bind(favoritesManager),
    clearAll: favoritesManager.clearAll.bind(favoritesManager),
    exportFavorites: favoritesManager.exportFavorites.bind(favoritesManager),
    importFavorites: favoritesManager.importFavorites.bind(favoritesManager),
    getFavoritesCount: favoritesManager.getFavoritesCount.bind(favoritesManager),
    getFavoritesByCategory: favoritesManager.getFavoritesByCategory.bind(favoritesManager),
    getRecentFavorites: favoritesManager.getRecentFavorites.bind(favoritesManager),
    searchFavorites: favoritesManager.searchFavorites.bind(favoritesManager)
  }
}