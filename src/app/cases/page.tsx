'use client'

import { useState, useEffect } from 'react'
import CaseCard from '@/components/CaseCard'
import { LoadingSkeleton } from '@/components/Loading'

interface Case {
  id: number
  title: string
  description: string
  income: string
  time_required: string
  tools: string
  steps: string
  source_url: string
  raw_content: string
  published: boolean
  created_at: string
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  investment_required?: string
  skills_needed?: string
  target_audience?: string
  potential_risks?: string
  success_rate?: string
  time_to_profit?: string
  scalability?: string
  location_flexible?: boolean
  age_restriction?: string
  revenue_model?: string
  competition_level?: string
  market_trend?: string
  key_metrics?: string
  author?: string
  upvotes?: number
  comments_count?: number
  tags?: string[]
  admin_approved?: boolean
  admin_notes?: string
  url?: string
}

function CasesList() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 12

  // Get unique categories and difficulties from cases
  const categories = Array.from(new Set(cases.map(c => c.category).filter(Boolean))) as string[]
  const difficulties = ['beginner', 'intermediate', 'advanced']

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true)

        // Build API URL with filters
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: ((currentPage - 1) * limit).toString(),
          sortBy,
          sortOrder
        })

        if (searchTerm) params.append('search', searchTerm)
        if (selectedCategory) params.append('category', selectedCategory)
        if (selectedDifficulty) params.append('difficulty', selectedDifficulty)

        const response = await fetch(`/api/cases?${params.toString()}`)
        const data = await response.json()

        if (data.success) {
          setCases(data.data || [])
          setTotal(data.total || 0)
        } else {
          setError(data.error || '获取案例列表失败')
        }
      } catch (err) {
        console.error('获取案例列表失败:', err)
        setError('无法加载案例列表')
      } finally {
        setLoading(false)
      }
    }

    loadCases()
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy, sortOrder, currentPage])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleFilter = (type: 'category' | 'difficulty', value: string) => {
    if (type === 'category') {
      setSelectedCategory(value)
    } else {
      setSelectedDifficulty(value)
    }
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedDifficulty('')
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索案例标题、描述或标签..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => handleFilter('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">所有分类</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => handleFilter('difficulty', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">所有难度</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'beginner' ? '初级' : difficulty === 'intermediate' ? '中级' : '高级'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters and Sort */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
          <div className="flex items-center gap-2">
            {(searchTerm || selectedCategory || selectedDifficulty) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                清除筛选
              </button>
            )}
            {(searchTerm || selectedCategory || selectedDifficulty) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">当前筛选:</span>
                {searchTerm && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    搜索: {searchTerm}
                  </span>
                )}
                {selectedCategory && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    分类: {selectedCategory}
                  </span>
                )}
                {selectedDifficulty && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    难度: {selectedDifficulty === 'beginner' ? '初级' : selectedDifficulty === 'intermediate' ? '中级' : '高级'}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">排序:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="created_at-desc">最新发布</option>
              <option value="created_at-asc">最早发布</option>
              <option value="upvotes-desc">最多点赞</option>
              <option value="upvotes-asc">最少点赞</option>
              <option value="comments_count-desc">最多评论</option>
              <option value="comments_count-asc">最少评论</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          找到 {total} 个案例
          {total > 0 && (
            <span className="ml-2">
              显示第 {Math.min((currentPage - 1) * limit + 1, total)} - {Math.min(currentPage * limit, total)} 个
            </span>
          )}
        </div>
      </div>

      {/* Cases Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-4">
              加载失败
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {error}
            </p>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <p className="text-sm text-red-800">
                请确保已正确配置数据库环境变量
              </p>
            </div>
          </div>
        </div>
      ) : !cases || cases.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              暂无匹配案例
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              没有找到符合条件的案例，请尝试调整搜索条件或筛选器。
            </p>
            {(searchTerm || selectedCategory || selectedDifficulty) && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                清除所有筛选条件
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((case_: Case) => (
              <CaseCard key={case_.id} case={case_} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )

  }


export default function CasesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white/50 backdrop-blur-sm rounded-3xl my-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-blue-900">AI 智能聚合</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent mb-6">
          发现全球副业机会
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          AI 驱动的副业案例聚合平台，从 Reddit、ProductHunt、IndieHackers 等平台智能分析，
          为您提供可复制的赚钱项目和详细实施步骤。
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">3+</div>
            <div className="text-sm text-gray-600">数据源</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-purple-600 mb-2">{total > 0 ? total : '100+'}</div>
            <div className="text-sm text-gray-600">案例库</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">自动更新</div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
          <span className="text-sm font-medium text-gray-500">数据来源:</span>
          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Reddit</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">ProductHunt</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">IndieHackers</span>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">精选案例</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>实时更新</span>
          </div>
        </div>

        <CasesList />
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-12 text-center text-white shadow-lg">
        <h3 className="text-2xl font-bold mb-4">开始您的副业之旅</h3>
        <p className="text-blue-50 mb-8 max-w-2xl mx-auto">
          浏览我们的案例库，找到适合您的副业方向，学习成功经验，开启您的赚钱之路。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg">
            探索案例
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30">
            了解更多
          </button>
        </div>
      </div>
    </div>
  )
}