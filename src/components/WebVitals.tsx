'use client'

import { usePerformanceMonitoring } from '@/lib/performance'
import { useEffect } from 'react'

export default function WebVitals() {
  const { lcp, fid, cls } = usePerformanceMonitoring()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Report metrics to analytics or console
      if (lcp) {
        console.log(`LCP: ${lcp.toFixed(2)}ms`)
        if (lcp > 2000) {
          console.warn('LCP exceeds 2s target')
        }
      }

      if (fid) {
        console.log(`FID: ${fid.toFixed(2)}ms`)
      }

      if (cls) {
        console.log(`CLS: ${cls.toFixed(3)}`)
      }
    }
  }, [lcp, fid, cls])

  // This component doesn't render anything visible
  return null
}