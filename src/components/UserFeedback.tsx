'use client'

import { useState, useEffect } from 'react'
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Send,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Award
} from 'lucide-react'
import { Case } from '@/lib/types'

interface Feedback {
  id: number
  case_id: number
  user_id: string
  rating: number
  comment: string
  helpful_count: number
  created_at: string
  verified: boolean
}

interface UserFeedbackProps {
  caseData: Case
  compact?: boolean
}

interface FeedbackStats {
  average_rating: number
  total_reviews: number
  rating_distribution: { [key: number]: number }
  helpful_percentage: number
}

export default function UserFeedback({ caseData, compact = false }: UserFeedbackProps) {
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [hasVoted, setHasVoted] = useState<{ [key: number]: boolean }>({})

  // Mock feedback data for demonstration
  useEffect(() => {
    const mockFeedbacks: Feedback[] = [
      {
        id: 1,
        case_id: caseData.id,
        user_id: 'user1',
        rating: 5,
        comment: '这个案例非常实用，步骤清晰，我已经按照教程开始尝试了！',
        helpful_count: 12,
        created_at: '2024-01-15T10:30:00Z',
        verified: true
      },
      {
        id: 2,
        case_id: caseData.id,
        user_id: 'user2',
        rating: 4,
        comment: '内容不错，但是需要一定的技能基础，适合有一定经验的人。',
        helpful_count: 8,
        created_at: '2024-01-14T15:45:00Z',
        verified: false
      },
      {
        id: 3,
        case_id: caseData.id,
        user_id: 'user3',
        rating: 5,
        comment: '按照这个方法，我第一个月就赚到了$800，太感谢了！',
        helpful_count: 15,
        created_at: '2024-01-13T09:20:00Z',
        verified: true
      }
    ]

    const mockStats: FeedbackStats = {
      average_rating: 4.7,
      total_reviews: 156,
      rating_distribution: { 5: 120, 4: 25, 3: 8, 2: 2, 1: 1 },
      helpful_percentage: 92
    }

    setFeedbacks(mockFeedbacks)
    setStats(mockStats)
  }, [caseData.id])

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userRating === 0) return

    setIsSubmitting(true)
    setSubmitStatus('loading')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Add new feedback to list
      const newFeedback: Feedback = {
        id: Date.now(),
        case_id: caseData.id,
        user_id: 'current_user',
        rating: userRating,
        comment: userComment,
        helpful_count: 0,
        created_at: new Date().toISOString(),
        verified: false
      }

      setFeedbacks(prev => [newFeedback, ...prev])

      // Update stats
      if (stats) {
        const newStats = { ...stats }
        newStats.total_reviews += 1
        newStats.rating_distribution[userRating] = (newStats.rating_distribution[userRating] || 0) + 1
        newStats.average_rating = Object.entries(newStats.rating_distribution).reduce(
          (sum, [rating, count]) => sum + (parseInt(rating) * count), 0
        ) / newStats.total_reviews

        setStats(newStats)
      }

      setSubmitStatus('success')
      setUserRating(0)
      setUserComment('')

      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } catch {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHelpfulVote = async (feedbackId: number) => {
    if (hasVoted[feedbackId]) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      setFeedbacks(prev => prev.map(feedback =>
        feedback.id === feedbackId
          ? { ...feedback, helpful_count: feedback.helpful_count + 1 }
          : feedback
      ))

      setHasVoted(prev => ({ ...prev, [feedbackId]: true }))
    } catch {
      console.error('Failed to vote for feedback')
    }
  }

  const renderStars = (rating: number, interactive = false, onRating?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onRating?.(star) : undefined}
            disabled={!interactive}
            className={`transition-colors duration-200 ${
              interactive ? 'hover:scale-110' : ''
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : interactive
                  ? 'text-gray-300 hover:text-yellow-300'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>用户评价</span>
          </h3>
          {stats && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">{stats.average_rating}</span>
              <div className="text-sm text-gray-600">
                <div>({stats.total_reviews} 评价)</div>
                <div className="text-green-600">{stats.helpful_percentage}% 有用</div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Rating */}
        <div className="text-center py-4 border-y border-gray-100">
          <p className="text-sm text-gray-600 mb-2">觉得这个案例怎么样？</p>
          {renderStars(userRating, true, setUserRating)}
          {userRating > 0 && (
            <button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
              className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? '提交中...' : '提交评价'}
            </button>
          )}
        </div>

        {/* Recent Feedback */}
        <div className="mt-4 space-y-3">
          {feedbacks.slice(0, 2).map((feedback) => (
            <div key={feedback.id} className="border-l-4 border-blue-200 pl-3">
              <div className="flex items-center justify-between mb-1">
                {renderStars(feedback.rating)}
                <span className="text-xs text-gray-500">
                  {new Date(feedback.created_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">{feedback.comment}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-400" />
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <span>用户反馈与评价</span>
          </h3>
          {stats && (
            <div className="text-right">
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.average_rating}</div>
                  <div className="text-sm text-gray-600">平均评分</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total_reviews}</div>
                  <div className="text-sm text-gray-600">总评价数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.helpful_percentage}%</div>
                  <div className="text-sm text-gray-600">有用率</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rating Distribution */}
        {stats && (
          <div className="grid grid-cols-5 gap-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.rating_distribution[rating] || 0
              const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0
              return (
                <div key={rating} className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{rating}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{count}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Submit Feedback Form */}
      <div className="p-6 border-b border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span>分享您的体验</span>
        </h4>

        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              评分 *
            </label>
            {renderStars(userRating, true, setUserRating)}
            {userRating > 0 && (
              <span className="ml-3 text-sm text-gray-600">
                {userRating === 5 ? '非常满意' :
                 userRating === 4 ? '满意' :
                 userRating === 3 ? '一般' :
                 userRating === 2 ? '不满意' : '非常不满意'}
              </span>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              详细评价（可选）
            </label>
            <textarea
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="分享您的使用体验、建议或其他想法..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {userComment.length}/500
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>您的评价将对其他用户很有帮助</span>
            </div>
            <button
              type="submit"
              disabled={userRating === 0 || isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>提交中...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>提交评价</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">感谢您的评价！</span>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">提交失败，请稍后重试</span>
            </div>
          </div>
        )}
      </div>

      {/* Feedback List */}
      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-600" />
          <span>用户评价 ({feedbacks.length})</span>
        </h4>

        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {renderStars(feedback.rating)}
                    {feedback.verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(feedback.created_at).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <button
                  onClick={() => handleHelpfulVote(feedback.id)}
                  disabled={hasVoted[feedback.id]}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                    hasVoted[feedback.id]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>有用 ({feedback.helpful_count})</span>
                </button>
              </div>

              <p className="text-gray-700 leading-relaxed mb-3">{feedback.comment}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-medium">
                    U
                  </div>
                  <span>匿名用户</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>帮助了 {feedback.helpful_count} 人</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}