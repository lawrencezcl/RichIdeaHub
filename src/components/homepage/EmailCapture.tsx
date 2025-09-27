'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import Link from 'next/link'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email
    if (!validateEmail(email)) {
      setStatus('error')
      setErrorMessage('邮箱格式无效')
      return
    }

    setIsLoading(true)
    setStatus('loading')

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Here you would make actual API call:
      // const response = await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // })

      setStatus('success')
      setEmail('')

      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setErrorMessage('订阅失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 text-center">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              订阅我们的副业案例推送
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              每周精选优质副业案例，助您开启赚钱之旅
            </p>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  placeholder="请输入您的邮箱地址"
                  disabled={isLoading || status === 'success'}
                  className={`
                    w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300
                    focus:outline-none focus:ring-4 focus:ring-white/20
                    ${status === 'error'
                      ? 'border-red-300 bg-red-50 placeholder-red-400'
                      : status === 'success'
                      ? 'border-green-300 bg-green-50'
                      : 'border-white/20 bg-white/90 placeholder-gray-500 focus:border-white/40'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                />
                {status === 'success' && (
                  <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {status === 'error' && (
                  <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || status === 'success'}
                className={`
                  px-8 py-4 rounded-xl font-semibold transition-all duration-300
                  flex items-center justify-center space-x-2 min-w-[140px]
                  ${status === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-orange-600 hover:bg-orange-50 hover:scale-105 shadow-lg'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>订阅中...</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>订阅成功</span>
                  </>
                ) : (
                  <span>立即订阅</span>
                )}
              </button>
            </div>

            {/* Error message */}
            {status === 'error' && (
              <div className="mt-3 text-red-100 text-sm bg-red-500/20 rounded-lg px-3 py-2">
                {errorMessage}
              </div>
            )}

            {/* Success message */}
            {status === 'success' && (
              <div className="mt-3 text-green-100 text-sm bg-green-500/20 rounded-lg px-3 py-2">
                请查收邮箱验证邮件，验证后即可收到案例推送
              </div>
            )}
          </form>

          {/* Privacy notice */}
          <div className="flex items-center justify-center space-x-2 text-white/80 text-sm">
            <Shield className="w-4 h-4" />
            <span>我们尊重您的隐私</span>
            <Link
              href="/privacy"
              className="underline hover:text-white transition-colors"
            >
              隐私政策
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">已保护邮箱</div>
              <div className="text-white font-semibold">10,000+</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">每周发送</div>
              <div className="text-white font-semibold">1封邮件</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">随时可取消</div>
              <div className="text-white font-semibold">一键退订</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}