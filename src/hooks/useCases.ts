'use client'

import { useState, useEffect } from 'react'

export interface Case {
  id: number
  title: string
  description: string
  income: string
  time_required: string
  tools: string
  steps: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  investment_required: string
  skills_needed: string
  target_audience: string
  potential_risks: string
  success_rate: string
  time_to_profit: string
  scalability: string
  location_flexible: boolean
  age_restriction: string
  revenue_model: string
  competition_level: string
  market_trend: string
  key_metrics: string
  tags: string[]
  url?: string
  raw_content?: string
  upvotes?: number
  comments_count?: number
  created_at?: string
  published?: boolean
  admin_approved?: boolean
}

export function useCases() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true)
        // Fetch from API route instead of direct database access
        const response = await fetch('/api/cases')
        if (!response.ok) {
          throw new Error('Failed to fetch cases')
        }
        const data = await response.json()
        setCases(data.cases || [])
      } catch (err) {
        console.error('获取案例列表失败:', err)
        setError('无法加载案例列表')
      } finally {
        setLoading(false)
      }
    }

    loadCases()
  }, [])

  return { cases, loading, error }
}