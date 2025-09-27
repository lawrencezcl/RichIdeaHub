'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

interface Testimonial {
  id: number
  content: string
  author: string
  role: string
  avatar: string
  rating: number
  verified?: boolean
  case?: string
  income?: string
}

interface CompactTestimonialCarouselProps {
  caseId?: number
  limit?: number
  showRelated?: boolean
}

export default function CompactTestimonialCarousel({
  limit = 3,
  showRelated = true
}: Omit<CompactTestimonialCarouselProps, 'caseId'>) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Mock testimonials - in real implementation, these would be filtered by caseId
  const testimonials: Testimonial[] = [
    {
      id: 1,
      content: "这个案例非常实用，步骤清晰，我已经按照教程开始尝试了！",
      author: "李女士",
      role: "Etsy案例用户",
      avatar: "👩",
      rating: 5,
      verified: true,
      case: "Etsy手工艺品销售",
      income: "$800/月"
    },
    {
      id: 2,
      content: "内容不错，但是需要一定的技能基础，适合有一定经验的人。",
      author: "张先生",
      role: "Dropshipping用户",
      avatar: "👨",
      rating: 4,
      verified: false,
      case: "Shopify Dropshipping",
      income: "$3000+/月"
    },
    {
      id: 3,
      content: "按照这个方法，我第一个月就赚到了$800，太感谢了！",
      author: "王同学",
      role: "大学生",
      avatar: "🧑",
      rating: 5,
      verified: true,
      case: "在线编程教学",
      income: "$1500/月"
    },
    {
      id: 4,
      content: "从零开始到现在每月稳定收入，感谢平台提供的详细指导。",
      author: "陈女士",
      role: "自由职业者",
      avatar: "👩",
      rating: 5,
      verified: true,
      case: "Freelance Writing",
      income: "$2000+/月"
    }
  ]

  const displayTestimonials = testimonials.slice(0, limit)

  useEffect(() => {
    if (displayTestimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [displayTestimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (displayTestimonials.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Quote className="w-5 h-5 text-blue-600" />
          <span>用户评价</span>
        </h3>
        {displayTestimonials.length > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={prevTestimonial}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500">
              {currentIndex + 1} / {displayTestimonials.length}
            </span>
            <button
              onClick={nextTestimonial}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Current testimonial */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-lg">
              {displayTestimonials[currentIndex].avatar}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {renderStars(displayTestimonials[currentIndex].rating)}
              {displayTestimonials[currentIndex].verified && (
                <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                  ✓ 已验证
                </span>
              )}
            </div>
            <blockquote className="text-gray-700 text-sm leading-relaxed mb-2">
              {displayTestimonials[currentIndex].content}
            </blockquote>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {displayTestimonials[currentIndex].author}
                </div>
                <div className="text-xs text-gray-500">
                  {displayTestimonials[currentIndex].role}
                </div>
              </div>
              {displayTestimonials[currentIndex].income && (
                <div className="text-right">
                  <div className="text-sm font-bold text-green-600">
                    {displayTestimonials[currentIndex].income}
                  </div>
                  {showRelated && displayTestimonials[currentIndex].case && (
                    <div className="text-xs text-gray-500">
                      {displayTestimonials[currentIndex].case}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Indicators */}
        {displayTestimonials.length > 1 && (
          <div className="flex justify-center space-x-1 pt-2">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentIndex === index
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">
              {displayTestimonials.reduce((sum, t) => sum + t.rating, 0) / displayTestimonials.length}
            </div>
            <div className="text-xs text-gray-500">平均评分</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {displayTestimonials.filter(t => t.verified).length}
            </div>
            <div className="text-xs text-gray-500">已验证</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {displayTestimonials.length}
            </div>
            <div className="text-xs text-gray-500">总评价</div>
          </div>
        </div>
      </div>
    </div>
  )
}