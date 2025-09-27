'use client'

import { useState, useEffect, lazy } from 'react'
import { CaseRepository, Case } from '@/lib/supabase-client'
import { LoadingSkeleton } from '@/components/Loading'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Lazy load heavy components
const CaseCard = lazy(() => import('@/components/CaseCard'))

// Debounce function implementation
const debounce = (func: (filter: string) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (filter: string) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(filter), delay)
  }
}

export default function CaseDisplayArea() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Debounce filter changes for better performance
  const debouncedSetFilter = debounce((filter: string) => {
    setSelectedFilter(filter)
    setCurrentIndex(0)
  }, 300)

  const filters = [
    { id: 'all', label: '全部' },
    { id: 'passive_income', label: '被动收入' },
    { id: 'no_experience', label: '无需经验' },
    { id: 'for_moms', label: '宝妈首选' },
    { id: 'for_students', label: '学生兼职' }
  ]

  useEffect(() => {
    async function loadCases() {
      setLoading(true)
      setError(null)
      try {
        const data = await CaseRepository.getAllCases(20, 0)
        setCases(data || [])
      } catch (error) {
        console.error('Failed to load cases:', error)
        setError('加载案例失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    loadCases()
  }, [])

  // Filter cases based on selected filter
  const filteredCases = cases.filter(case_ => {
    if (selectedFilter === 'all') return true

    // Simple tag-based filtering (you can enhance this logic)
    const tags = case_.tags || []
    const title = case_.title.toLowerCase()
    const description = case_.description.toLowerCase()

    switch (selectedFilter) {
      case 'passive_income':
        return tags.includes('passive income') ||
               title.includes('passive') ||
               description.includes('passive')
      case 'no_experience':
        return tags.includes('零基础') ||
               case_.difficulty === 'beginner' ||
               title.includes('no experience') ||
               description.includes('beginner')
      case 'for_moms':
        return tags.includes('宝妈') ||
               description.includes('mom') ||
               description.includes('parent')
      case 'for_students':
        return tags.includes('学生') ||
               description.includes('student') ||
               description.includes('college')
      default:
        return true
    }
  })

  // Show max 6 cases on homepage
  const displayCases = filteredCases.slice(0, 6)
  const casesPerRow = 3
  const maxIndex = Math.max(0, Math.ceil(displayCases.length / casesPerRow) - 1)

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const visibleCases = displayCases.slice(
    currentIndex * casesPerRow,
    (currentIndex + 1) * casesPerRow
  )

  if (loading) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">精选案例</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">精选案例</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">精选案例</h2>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2 group">
            <span>查看全部</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-3 mb-12 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => debouncedSetFilter(filter.id)}
              className={`
                px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                ${selectedFilter === filter.id
                  ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Cases carousel */}
        <div className="relative">
          {/* Navigation arrows */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`
                  absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10
                  w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center
                  hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex === maxIndex}
                className={`
                  absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10
                  w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center
                  hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Cases grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleCases.map((case_) => (
              <CaseCard key={case_.id} case={case_} compact={true} />
            ))}
          </div>

          {/* Empty state */}
          {visibleCases.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-500">暂无符合条件的案例</p>
            </div>
          )}
        </div>

        {/* Slide indicators */}
        {maxIndex > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${currentIndex === i ? 'bg-orange-500 w-8' : 'bg-gray-300'}
                `}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

