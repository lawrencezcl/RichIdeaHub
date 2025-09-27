'use client'

import { Analytics } from "@vercel/analytics/next"
import { useEffect, useState } from "react"

export default function ClientAnalytics() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return <Analytics />
}