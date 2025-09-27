'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  TrendingUp,
  Star,
  Target,
  Award,
  Eye,
  Clock,
  DollarSign
} from 'lucide-react'

interface MiniStatsProps {
  variant?: 'default' | 'compact' | 'case-specific'
  caseId?: number
  showRealTime?: boolean
}

interface RealTimeData {
  onlineUsers: number
  todayViews: number
  todayRating: number
  todayIncome: number
}

export default function MiniStats({
  variant = 'default',
  showRealTime = true
}: Omit<MiniStatsProps, 'caseId'>) {
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    onlineUsers: 234,
    todayViews: 15420,
    todayRating: 4.8,
    todayIncome: 12500
  })

  // Mock data that would come from API
  const platformStats = {
    totalCases: 1247,
    totalUsers: 15234,
    avgRating: 4.8,
    successRate: 87,
    totalViews: 2847500,
    totalRevenue: 2847500
  }

  const caseStats = {
    views: 15420,
    rating: 4.8,
    successRate: 87,
    avgIncome: 2284,
    timeRequired: '2-3小时/天',
    investment: '低'
  }

  useEffect(() => {
    if (showRealTime) {
      // Simulate real-time updates
      const interval = setInterval(() => {
        setRealTimeData(prev => ({
          onlineUsers: Math.max(200, prev.onlineUsers + Math.floor(Math.random() * 10 - 5)),
          todayViews: prev.todayViews + Math.floor(Math.random() * 5),
          todayRating: Math.max(4.5, Math.min(5.0, prev.todayRating + (Math.random() * 0.1 - 0.05))),
          todayIncome: prev.todayIncome + Math.floor(Math.random() * 100 - 50)
        }))
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [showRealTime])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`
    return `$${num}`
  }

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <div className="flex items-center justify-center mb-1">
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{formatNumber(platformStats.totalCases)}</div>
          <div className="text-xs text-gray-500">案例数</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{formatNumber(platformStats.totalUsers)}</div>
          <div className="text-xs text-gray-500">用户数</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <div className="flex items-center justify-center mb-1">
            <Star className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{platformStats.avgRating}</div>
          <div className="text-xs text-gray-500">平均评分</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{platformStats.successRate}%</div>
          <div className="text-xs text-gray-500">成功率</div>
        </div>
      </div>
    )
  }

  if (variant === 'case-specific') {
    return (
      <div className="space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-blue-800">{formatNumber(caseStats.views)}</div>
            <div className="text-sm text-blue-700">浏览量</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <Award className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-xl font-bold text-yellow-800">{caseStats.rating}</div>
            <div className="text-sm text-yellow-700">用户评分</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-xl font-bold text-green-800">{caseStats.successRate}%</div>
            <div className="text-sm text-green-700">成功率</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-xl font-bold text-purple-800">{formatCurrency(caseStats.avgIncome)}</div>
            <div className="text-sm text-purple-700">月收入</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">时间投入</span>
            </div>
            <div className="font-semibold text-gray-900">{caseStats.timeRequired}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">启动资金</span>
            </div>
            <div className="font-semibold text-gray-900">{caseStats.investment}</div>
          </div>
        </div>

        {/* Real-time updates if enabled */}
        {showRealTime && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
            <div className="text-sm font-medium text-indigo-800 mb-3">今日实时数据</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">
                  {formatNumber(realTimeData.todayViews)}
                </div>
                <div className="text-xs text-indigo-700">今日浏览</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {realTimeData.todayRating.toFixed(1)}
                </div>
                <div className="text-xs text-green-700">今日评分</div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default variant - platform overview
  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-700 font-medium">+12%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-800 mb-1">{formatNumber(platformStats.totalCases)}</div>
          <div className="text-sm text-blue-700">总案例数</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-green-600" />
            <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-700 font-medium">+8%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-800 mb-1">{formatNumber(platformStats.totalUsers)}</div>
          <div className="text-sm text-green-700">总用户数</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-yellow-600" />
            <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
              <Award className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-700 font-medium">优秀</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-yellow-800 mb-1">{platformStats.avgRating}</div>
          <div className="text-sm text-yellow-700">平均评分</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-purple-600" />
            <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-700 font-medium">+5%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-800 mb-1">{platformStats.successRate}%</div>
          <div className="text-sm text-purple-700">成功率</div>
        </div>
      </div>

      {/* Real-time Stats */}
      {showRealTime && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-indigo-900">实时数据</h3>
            <div className="flex items-center space-x-1 bg-indigo-100 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
              <span className="text-xs text-indigo-700 font-medium">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600">{realTimeData.onlineUsers}</div>
              <div className="text-sm text-indigo-700">在线用户</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{formatNumber(realTimeData.todayViews)}</div>
              <div className="text-sm text-green-700">今日浏览</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">{realTimeData.todayRating.toFixed(1)}</div>
              <div className="text-sm text-yellow-700">今日评分</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{formatCurrency(realTimeData.todayIncome)}</div>
              <div className="text-sm text-orange-700">今日收入</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper component for icon consistency
function Briefcase({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}