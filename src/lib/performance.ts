import { useEffect, useState } from 'react'

// Performance monitoring utilities
export const usePerformanceMonitoring = () => {
  const [lcp, setLcp] = useState<number | null>(null)
  const [fid, setFid] = useState<number | null>(null)
  const [cls, setCls] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Core Web Vitals monitoring
      const handleLCP = (entry: PerformanceEntry) => {
        setLcp(entry.startTime)
      }

      const handleFID = (entry: PerformanceEntry) => {
        setFid(entry.startTime)
      }

      const handleCLS = (entry: PerformanceEntry) => {
        setCls(entry.startTime)
      }

      // PerformanceObserver for Core Web Vitals
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            if (entries.length > 0) {
              handleLCP(entries[entries.length - 1])
            }
          })
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

          const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            entries.forEach(handleFID)
          })
          fidObserver.observe({ entryTypes: ['first-input'] })

          const clsObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            entries.forEach(handleCLS)
          })
          clsObserver.observe({ entryTypes: ['layout-shift'] })
        } catch (e) {
          console.warn('PerformanceObserver not supported', e)
        }
      }
    }
  }, [])

  return { lcp, fid, cls }
}

// Lazy loading utility
export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(callback, options)

      const elements = document.querySelectorAll('[data-lazy-load]')
      elements.forEach((el) => observer.observe(el))

      return () => {
        elements.forEach((el) => observer.unobserve(el))
      }
    }
  }, [callback, options])
}

// Preload utility
export const preloadResource = (href: string, as: 'script' | 'style' | 'image' | 'font') => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as

    if (as === 'font') {
      link.crossOrigin = 'anonymous'
    }

    document.head.appendChild(link)
  }
}

// Debounce utility for performance
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for performance
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}