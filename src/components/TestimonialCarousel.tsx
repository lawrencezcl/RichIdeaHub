'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote, Play, Pause } from 'lucide-react'

interface Testimonial {
  id: number
  content: string
  author: string
  role: string
  avatar: string
  rating: number
  verified?: boolean
  videoUrl?: string
  tags?: string[]
  case?: string
  income?: string
  timeFrame?: string
}

interface TestimonialCarouselProps {
  testimonials?: Testimonial[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showControls?: boolean
  compact?: boolean
  theme?: 'light' | 'dark'
}

export default function TestimonialCarousel({
  testimonials: propTestimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  compact = false,
  theme = 'light'
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  
  // Default testimonials if none provided
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      content: "按Etsy案例做了1个月，真的赚了800元，步骤很详细！平台上的案例都很实用，特别是对于新手来说非常友好。",
      author: "李女士",
      role: "Etsy案例用户",
      avatar: "👩",
      rating: 5,
      verified: true,
      tags: ["Etsy", "手工艺品", "新手友好"],
      case: "Etsy手工艺品销售",
      income: "$800/月",
      timeFrame: "1个月"
    },
    {
      id: 2,
      content: "平台上的案例很实用，我选择了Dropshipping，现在每月稳定收入3000+。AI分析得很到位，每个案例都有详细的步骤和风险提示。",
      author: "张先生",
      role: "Dropshipping用户",
      avatar: "👨",
      rating: 5,
      verified: true,
      tags: ["Dropshipping", "电商", "稳定收入"],
      case: "Shopify Dropshipping",
      income: "$3000+/月",
      timeFrame: "3个月"
    },
    {
      id: 3,
      content: "作为学生，这个平台帮我找到了适合的副业，时间灵活收入不错。课程质量很高，老师讲解很详细。",
      author: "王同学",
      role: "大学生",
      avatar: "🧑",
      rating: 4,
      verified: true,
      tags: ["学生", "时间灵活", "在线教育"],
      case: "在线编程教学",
      income: "$1500/月",
      timeFrame: "2个月"
    },
    {
      id: 4,
      content: "Freelance Writing的案例改变了我的生活！从零开始到现在每月稳定收入，感谢平台提供的详细指导和资源。",
      author: "陈女士",
      role: "自由职业者",
      avatar: "👩",
      rating: 5,
      verified: true,
      tags: ["写作", "自由职业", "远程工作"],
      case: "Freelance Writing",
      income: "$2000+/月",
      timeFrame: "4个月"
    },
    {
      id: 5,
      content: "通过平台学习了Affiliate Marketing，现在已经建立了自己的网站，收入每天都在增长。社区支持也很棒！",
      author: "刘先生",
      role: "Affiliate Marketer",
      avatar: "👨",
      rating: 5,
      verified: true,
      tags: ["联盟营销", "网站建设", "被动收入"],
      case: "Amazon Affiliate",
      income: "$1200/月",
      timeFrame: "6个月"
    }
  ]

  const testimonials = propTestimonials || defaultTestimonials

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && autoPlay) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      }, autoPlayInterval)
    }
    return () => clearInterval(interval)
  }, [isPlaying, autoPlay, autoPlayInterval, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (compact) {
    return (
      <div className={`relative rounded-xl overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="p-6">
          {/* Current testimonial */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {testimonials[currentIndex].avatar}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                {renderStars(testimonials[currentIndex].rating)}
                {testimonials[currentIndex].verified && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    ✓ 已验证
                  </span>
                )}
              </div>
              <blockquote className="text-gray-700 text-sm leading-relaxed mb-2">
                <Quote className="w-4 h-4 text-gray-400 inline mr-1" />
                {testimonials[currentIndex].content}
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {testimonials[currentIndex].author}
                  </div>
                  <div className="text-xs text-gray-500">
                    {testimonials[currentIndex].role}
                  </div>
                </div>
                {testimonials[currentIndex].income && (
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      {testimonials[currentIndex].income}
                    </div>
                    <div className="text-xs text-gray-500">
                      {testimonials[currentIndex].timeFrame}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          {showControls && testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevTestimonial}
                  className={`p-1 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className={`p-1 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={nextTestimonial}
                  className={`p-1 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-1">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      currentIndex === index
                        ? theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                        : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-white to-gray-50'
    } shadow-xl`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            用户成功案例
          </h2>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            真实用户分享他们的副业成功经验和心得体会
          </p>
        </div>

        {/* Main testimonial display */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Navigation arrows */}
            {showControls && testimonials.length > 1 && (
              <>
                <button
                  onClick={prevTestimonial}
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10
                           w-12 h-12 rounded-full flex items-center justify-center
                           transition-all duration-200 ${
                             theme === 'dark'
                               ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                               : 'bg-white hover:bg-gray-50 text-gray-600 shadow-lg'
                           }`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10
                           w-12 h-12 rounded-full flex items-center justify-center
                           transition-all duration-200 ${
                             theme === 'dark'
                               ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                               : 'bg-white hover:bg-gray-50 text-gray-600 shadow-lg'
                           }`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Testimonial card */}
            <div className={`rounded-2xl p-8 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white shadow-lg'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="md:col-span-2">
                  {/* Rating and verification */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      {renderStars(testimonials[currentIndex].rating)}
                      {testimonials[currentIndex].verified && (
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                          ✓ 已验证用户
                        </span>
                      )}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {new Date().toLocaleDateString('zh-CN')}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className={`text-lg leading-relaxed mb-6 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Quote className="w-5 h-5 inline mr-2 text-blue-500" />
                    {testimonials[currentIndex].content}
                  </blockquote>

                  {/* Tags */}
                  {testimonials[currentIndex].tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {testimonials[currentIndex].tags?.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            theme === 'dark'
                              ? 'bg-gray-600 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Case info */}
                  {testimonials[currentIndex].case && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-blue-50'
                    }`}>
                      <div className={`text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-blue-800'
                      }`}>
                        相关案例
                      </div>
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-blue-900'
                      }`}>
                        {testimonials[currentIndex].case}
                      </div>
                    </div>
                  )}
                </div>

                {/* Author and stats */}
                <div className="space-y-6">
                  {/* Author info */}
                  <div className={`p-6 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gradient-to-br from-blue-50 to-purple-50'
                  }`}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                        theme === 'dark' ? 'bg-gray-500' : 'bg-white'
                      }`}>
                        {testimonials[currentIndex].avatar}
                      </div>
                      <div>
                        <div className={`font-bold text-lg ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {testimonials[currentIndex].author}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {testimonials[currentIndex].role}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Income stats */}
                  {testimonials[currentIndex].income && (
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-gradient-to-br from-green-50 to-green-100'
                    }`}>
                      <div className={`text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-green-700'
                      }`}>
                        月收入
                      </div>
                      <div className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-800'
                      }`}>
                        {testimonials[currentIndex].income}
                      </div>
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-green-600'
                      }`}>
                        用时: {testimonials[currentIndex].timeFrame}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Indicators and controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center space-x-2">
                {showControls && (
                  <button
                    onClick={togglePlayPause}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {isPlaying ? '暂停' : '播放'}
                    </span>
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                      currentIndex === index
                        ? theme === 'dark'
                          ? 'bg-blue-500 w-8'
                          : 'bg-blue-600 w-8'
                        : theme === 'dark'
                          ? 'bg-gray-600'
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {currentIndex + 1} / {testimonials.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}