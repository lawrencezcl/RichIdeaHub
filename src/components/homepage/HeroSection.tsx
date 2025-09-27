'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { preloadResource } from '@/lib/performance'

export default function HeroSection() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  // Preload resources for better performance
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Preload critical resources
      preloadResource('/fonts/inter-var.woff2', 'font')
      preloadResource('/images/hero-bg.webp', 'image')
    }
  }, [])

  const handlePrimaryCTA = () => {
    setIsAnimating(true)
    // Simulate navigation to quiz/page
    setTimeout(() => {
      router.push('/cases')
    }, 300)
  }

  const handleSecondaryCTA = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/cases')
    }, 300)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full mb-8 shadow-sm border border-gray-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">实时更新</span>
          </div>

          {/* Main title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block">Rich Idea Hub</span>
            <span className="block text-2xl md:text-4xl lg:text-5xl text-blue-600 mt-2">
              副业案例库
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            汇聚全球优质副业案例，为您提供可复制的赚钱项目和详细实施步骤
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={handlePrimaryCTA}
              disabled={isAnimating}
              className={`
                group relative px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl
                hover:from-orange-600 hover:to-orange-700 transform transition-all duration-300 hover:scale-105
                shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                animate-pulse hover:animate-none
              `}
            >
              <span className="relative z-10 text-lg">立即探索</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <button
              onClick={handleSecondaryCTA}
              disabled={isAnimating}
              className={`
                group px-12 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-orange-500
                hover:bg-orange-50 transform transition-all duration-300 hover:scale-105
                shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span className="relative z-10 text-lg">了解更多</span>
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* User feedback summary */}
          <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 xl:translate-x-0">
            <div className="w-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-lg border border-white/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">用户真实反馈</h3>
                <p className="text-gray-600 text-sm">来自全球用户的真实体验分享</p>
              </div>

              {/* Sample feedback stats */}
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">平均满意度</span>
                    <span className="text-lg font-bold text-green-600">4.8/5</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">成功案例</span>
                    <span className="text-lg font-bold text-blue-600">2,847</span>
                  </div>
                  <p className="text-xs text-gray-600">用户验证的成功实施</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">活跃社区</span>
                    <span className="text-lg font-bold text-purple-600">15K+</span>
                  </div>
                  <p className="text-xs text-gray-600">正在学习和分享的用户</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>实时更新用户反馈</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}