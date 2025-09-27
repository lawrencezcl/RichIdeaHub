import Link from 'next/link'
import { Case } from '@/lib/types'
import FavoriteButton from './FavoriteButton'
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Star,
  Target,
  Zap,
  Award,
  Globe,
  Shield
} from 'lucide-react'

interface Props {
  case: Case
  compact?: boolean
}

export default function CaseCard({ case: caseData, compact = false }: Props) {
  // Enhanced source type detection with icons
  const getSourceType = (url: string) => {
    if (url.includes('reddit.com')) return {
      name: 'Reddit',
      color: 'bg-orange-100 text-orange-800',
      icon: Users,
      iconColor: 'text-orange-600'
    }
    if (url.includes('producthunt.com')) return {
      name: 'ProductHunt',
      color: 'bg-red-100 text-red-800',
      icon: Target,
      iconColor: 'text-red-600'
    }
    if (url.includes('indiehackers.com')) return {
      name: 'IndieHackers',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Zap,
      iconColor: 'text-yellow-600'
    }
    return {
      name: '其他',
      color: 'bg-gray-100 text-gray-800',
      icon: Globe,
      iconColor: 'text-gray-600'
    }
  }

  const source = getSourceType(caseData.source_url)

  // Calculate engagement score
  const engagementScore = Math.min(100, Math.round(
    ((caseData.upvotes || 0) * 0.7 + (caseData.comments_count || 0) * 0.3) / 10
  ))

  // Get difficulty level with styling
  const getDifficultyInfo = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return {
          label: '新手友好',
          color: 'bg-green-100 text-green-800',
          icon: Shield,
          level: 1
        }
      case 'intermediate':
        return {
          label: '中等难度',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Star,
          level: 2
        }
      case 'advanced':
        return {
          label: '高难度',
          color: 'bg-red-100 text-red-800',
          icon: Award,
          level: 3
        }
      default:
        return {
          label: '未知',
          color: 'bg-gray-100 text-gray-800',
          icon: Target,
          level: 0
        }
    }
  }

  const difficulty = getDifficultyInfo(caseData.difficulty || 'beginner')

  // Parse investment range
  const parseInvestment = (investment: string) => {
    if (investment.includes('$')) {
      const match = investment.match(/\$(\d+)/)
      return match ? parseInt(match[1]) : 0
    }
    return 0
  }

  const investmentAmount = parseInvestment(caseData.investment_required || '$0')

  // Generate trending indicator
  const isTrending = (caseData.upvotes || 0) > 1000 || (caseData.comments_count || 0) > 100

  if (compact) {
    return (
      <Link href={`/cases/${caseData.id}`}>
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 h-full overflow-hidden active:scale-[0.98] active:shadow-sm">
          <div className="p-4 sm:p-4">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-2 sm:mb-2">
              <div className="flex items-center space-x-2 sm:space-x-2">
                <FavoriteButton
                  caseData={{
                    id: caseData.id,
                    title: caseData.title,
                    description: caseData.description,
                    income: caseData.income || '',
                    category: caseData.category || '',
                    difficulty: caseData.difficulty || 'beginner'
                  }}
                  variant="icon"
                  size="sm"
                />
                <source.icon className={`w-4 h-4 ${source.iconColor}`} />
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${source.color}`}>
                  {source.name}
                </span>
              </div>
              {isTrending && (
                <div className="flex items-center space-x-1 bg-red-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3 text-red-600" />
                  <span className="text-xs text-red-600 font-medium">热门</span>
                </div>
              )}
            </div>

            {/* Compact Title */}
            <h3 className="font-semibold text-sm leading-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2 sm:mb-2">
              {caseData.title}
            </h3>

            {/* Compact Stats */}
            <div className="flex items-center justify-between text-xs gap-1">
              <div className="flex items-center space-x-1 min-w-0 flex-1">
                <DollarSign className="w-3 h-3 text-green-600 flex-shrink-0" />
                <span className="text-green-700 font-medium truncate">{caseData.income}</span>
              </div>
              <div className="flex items-center space-x-1 min-w-0 flex-1">
                <Clock className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <span className="text-blue-700 truncate">{caseData.time_required}</span>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Star className="w-3 h-3 text-yellow-600" />
                <span className="text-gray-600">{engagementScore}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/cases/${caseData.id}`}>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 h-full overflow-hidden transform hover:-translate-y-1 active:scale-[0.98] active:shadow-sm">
        {/* Enhanced Header */}
        <div className="relative p-4 sm:p-6 pb-2 sm:pb-4">
          {/* Favorite Button */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
            <FavoriteButton
              caseData={{
                id: caseData.id,
                title: caseData.title,
                description: caseData.description,
                income: caseData.income || '',
                category: caseData.category || '',
                difficulty: caseData.difficulty || 'beginner'
              }}
              variant="icon"
              size="md"
            />
          </div>

          {/* Trending Badge */}
          {isTrending && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center space-x-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
              <TrendingUp className="w-3 h-3" />
              <span>热门</span>
            </div>
          )}

          {/* Source and Date */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2">
              <source.icon className={`w-4 h-4 ${source.iconColor}`} />
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${source.color}`}>
                {source.name}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(caseData.created_at).toLocaleDateString('zh-CN')}
            </span>
          </div>

          {/* Title with Engagement */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 flex-1 pr-2">
              {caseData.title}
            </h3>
            <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-800">{engagementScore}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {caseData.description}
          </p>

          {/* Difficulty and Investment */}
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${difficulty.color}`}>
              <difficulty.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{difficulty.label}</span>
            </div>
            <div className="flex items-center space-x-1 bg-purple-50 px-3 py-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-800">
                {investmentAmount > 0 ? `$${investmentAmount}` : '免费'}
              </span>
            </div>
            {caseData.location_flexible && (
              <div className="flex items-center space-x-1 bg-green-50 px-3 py-2 rounded-lg">
                <Globe className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">远程</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Metrics */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center border border-green-200">
              <DollarSign className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-green-600 font-medium mb-1">收入</div>
              <div className="text-sm font-bold text-green-800 line-clamp-1">
                {caseData.income}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center border border-blue-200">
              <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-xs text-blue-600 font-medium mb-1">时间</div>
              <div className="text-sm font-bold text-blue-800 line-clamp-1">
                {caseData.time_required}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center border border-purple-200">
              <Target className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <div className="text-xs text-purple-600 font-medium mb-1">成功率</div>
              <div className="text-sm font-bold text-purple-800 line-clamp-1">
                {caseData.success_rate || '中等'}
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-600">{caseData.upvotes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-xs text-gray-600">{caseData.comments_count}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              难度: {'★'.repeat(difficulty.level)}{'☆'.repeat(3 - difficulty.level)}
            </div>
          </div>
        </div>

        {/* Enhanced Tools */}
        {caseData.tools && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-1.5">
              {caseData.tools.split(',').slice(0, 4).map((tool, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {tool.trim()}
                </span>
              ))}
              {caseData.tools.split(',').length > 4 && (
                <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 text-xs rounded-md border border-blue-200">
                  +{caseData.tools.split(',').length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">点击查看详情</span>
              {caseData.admin_approved && (
                <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                  <Shield className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-700">已验证</span>
                </div>
              )}
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}