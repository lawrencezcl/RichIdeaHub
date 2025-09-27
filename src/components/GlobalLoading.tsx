'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GlobalLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Reset loading state when route changes
    setIsLoading(true)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300) // Minimum loading time for better UX

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">加载中...</p>
          <p className="text-xs text-gray-500 mt-1">请稍候</p>
        </div>
      </div>
    </div>
  )
}