'use client'

import { useState } from 'react'
import {
  Heart,
  BookmarkX,
  Search,
  Download,
  Upload,
  Grid,
  List,
  Edit3
} from 'lucide-react'
import FavoriteButton from './FavoriteButton'
import { useFavorites, FavoriteCase } from '@/lib/favorites'

export default function FavoritesPage() {
  const {
    favorites,
    isLoading,
    removeFromFavorites,
    updateNotes,
    clearAll,
    exportFavorites,
    importFavorites
  } = useFavorites()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'income'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [editingNotes, setEditingNotes] = useState<{ [key: number]: string }>({})
  const [showImportModal, setShowImportModal] = useState(false)
  const [importData, setImportData] = useState('')

  // Get unique categories
  const categories = ['all', ...new Set(favorites.map(fav => fav.category))]

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter(fav => {
      const matchesSearch = searchQuery === '' ||
        fav.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fav.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fav.notes && fav.notes.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || fav.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'income':
          // Simple income comparison (would need more sophisticated parsing in production)
          const aIncome = parseInt(a.income.replace(/[^0-9]/g, '')) || 0
          const bIncome = parseInt(b.income.replace(/[^0-9]/g, '')) || 0
          comparison = aIncome - bIncome
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleExport = () => {
    const data = exportFavorites()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `favorites-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    if (importData.trim()) {
      const success = importFavorites(importData)
      if (success) {
        setShowImportModal(false)
        setImportData('')
        alert('收藏导入成功！')
      } else {
        alert('收藏导入失败，请检查文件格式。')
      }
    }
  }

  const startEditingNotes = (caseId: number, currentNotes: string = '') => {
    setEditingNotes(prev => ({
      ...prev,
      [caseId]: currentNotes
    }))
  }

  const saveNotes = (caseId: number) => {
    const notes = editingNotes[caseId]
    updateNotes(caseId, notes)
    setEditingNotes(prev => {
      const newNotes = { ...prev }
      delete newNotes[caseId]
      return newNotes
    })
  }

  const cancelEditingNotes = (caseId: number) => {
    setEditingNotes(prev => {
      const newNotes = { ...prev }
      delete newNotes[caseId]
      return newNotes
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载收藏中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Heart className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">我的收藏</h1>
                <p className="text-sm text-gray-600">
                  共 {favorites.length} 个收藏案例
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                disabled={favorites.length === 0}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>导出</span>
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Upload className="w-4 h-4" />
                <span>导入</span>
              </button>
              {favorites.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('确定要清空所有收藏吗？此操作不可撤销。')) {
                      clearAll()
                    }
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <BookmarkX className="w-4 h-4" />
                  <span>清空</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索收藏案例..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? '所有分类' : category}
                  </option>
                ))}
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field as 'date' | 'title' | 'income')
                  setSortOrder(order as 'asc' | 'desc')
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">最新添加</option>
                <option value="date-asc">最早添加</option>
                <option value="title-asc">标题 A-Z</option>
                <option value="title-desc">标题 Z-A</option>
                <option value="income-desc">收入高到低</option>
                <option value="income-asc">收入低到高</option>
              </select>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {favorites.length === 0 ? '还没有收藏任何案例' : '没有找到匹配的收藏'}
            </h3>
            <p className="text-gray-600 mb-4">
              {favorites.length === 0
                ? '浏览案例页面，点击收藏按钮来保存您感兴趣的案例。'
                : '尝试调整搜索条件或分类筛选。'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                显示 {filteredFavorites.length} 个收藏（共 {favorites.length} 个）
              </p>
            </div>

            {/* Favorites grid/list */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((fav) => (
                  <FavoriteCard
                    key={fav.id}
                    favorite={fav}
                    isEditing={editingNotes[fav.id] !== undefined}
                    onEditNotes={() => startEditingNotes(fav.id, fav.notes)}
                    onSaveNotes={() => saveNotes(fav.id)}
                    onCancelEdit={() => cancelEditingNotes(fav.id)}
                    notes={editingNotes[fav.id] || ''}
                    onNotesChange={(notes) => setEditingNotes(prev => ({ ...prev, [fav.id]: notes }))}
                    onRemove={() => removeFromFavorites(fav.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredFavorites.map((fav) => (
                  <FavoriteListItem
                    key={fav.id}
                    favorite={fav}
                    isEditing={editingNotes[fav.id] !== undefined}
                    onEditNotes={() => startEditingNotes(fav.id, fav.notes)}
                    onSaveNotes={() => saveNotes(fav.id)}
                    onCancelEdit={() => cancelEditingNotes(fav.id)}
                    notes={editingNotes[fav.id] || ''}
                    onNotesChange={(notes) => setEditingNotes(prev => ({ ...prev, [fav.id]: notes }))}
                    onRemove={() => removeFromFavorites(fav.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">导入收藏</h3>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="粘贴导出的收藏数据..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowImportModal(false)
                  setImportData('')
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Favorite Card Component
function FavoriteCard({
  favorite,
  isEditing,
  onEditNotes,
  onSaveNotes,
  onCancelEdit,
  notes,
  onNotesChange,
  onRemove
}: {
  favorite: FavoriteCase
  isEditing: boolean
  onEditNotes: () => void
  onSaveNotes: () => void
  onCancelEdit: () => void
  notes: string
  onNotesChange: (notes: string) => void
  onRemove: () => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {favorite.category}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                favorite.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                favorite.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {favorite.difficulty === 'beginner' ? '初级' :
                 favorite.difficulty === 'intermediate' ? '中级' : '高级'}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {favorite.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {favorite.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-600">
                {favorite.income}
              </span>
              <FavoriteButton
                caseData={favorite}
                variant="icon"
                onToggle={(isFavorited) => {
                  if (!isFavorited) onRemove()
                }}
              />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="border-t border-gray-100 pt-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="添加笔记..."
                className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onCancelEdit}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  取消
                </button>
                <button
                  onClick={onSaveNotes}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={onEditNotes}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{favorite.notes ? '编辑笔记' : '添加笔记'}</span>
                </button>
              </div>
              {favorite.notes && (
                <div className="bg-yellow-50 p-2 rounded text-sm text-gray-700">
                  {favorite.notes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Favorite List Item Component
function FavoriteListItem({
  favorite,
  isEditing,
  onEditNotes,
  onSaveNotes,
  onCancelEdit,
  notes,
  onNotesChange,
  onRemove
}: {
  favorite: FavoriteCase
  isEditing: boolean
  onEditNotes: () => void
  onSaveNotes: () => void
  onCancelEdit: () => void
  notes: string
  onNotesChange: (notes: string) => void
  onRemove: () => void
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="font-semibold text-gray-900">{favorite.title}</h3>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {favorite.category}
                </span>
                <span className="text-lg font-bold text-green-600">
                  {favorite.income}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{favorite.description}</p>

            {/* Notes Section */}
            <div className="mb-3">
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="添加笔记..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={onCancelEdit}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      取消
                    </button>
                    <button
                      onClick={onSaveNotes}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={onEditNotes}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 mb-2"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{favorite.notes ? '编辑笔记' : '添加笔记'}</span>
                  </button>
                  {favorite.notes && (
                    <div className="bg-yellow-50 p-3 rounded text-sm text-gray-700">
                      {favorite.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <span className="text-xs text-gray-500">
              {new Date(favorite.addedAt).toLocaleDateString('zh-CN')}
            </span>
            <FavoriteButton
              caseData={favorite}
              variant="icon"
              onToggle={(isFavorited) => {
                if (!isFavorited) onRemove()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}