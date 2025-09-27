// 核心数据类型定义

export interface Case {
  id: number
  title: string
  description: string
  income: string
  time_required: string
  tools: string
  steps: string
  source_url: string
  raw_content: string
  published: boolean
  created_at: string
  // 新增字段
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  investment_required?: string
  skills_needed?: string
  target_audience?: string
  potential_risks?: string
  success_rate?: string
  time_to_profit?: string
  scalability?: string
  location_flexible?: boolean
  age_restriction?: string
  revenue_model?: string
  competition_level?: string
  market_trend?: string
  key_metrics?: string
  author?: string
  upvotes?: number
  comments_count?: number
  tags?: string[]
  // 管理字段
  admin_approved?: boolean
  admin_notes?: string
}

export interface RawCaseData {
  title: string
  content: string
  url: string
  source_id: string
  // 新增字段
  author?: string
  upvotes?: number
  comments_count?: number
  tags?: string[]
  category?: string
}

export interface ProcessedCase {
  title: string
  description: string
  income: string
  time_required: string
  tools: string
  steps: string
  // 新增字段
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  investment_required?: string
  skills_needed?: string
  target_audience?: string
  potential_risks?: string
  success_rate?: string
  time_to_profit?: string
  scalability?: string
  location_flexible?: boolean
  age_restriction?: string
  revenue_model?: string
  competition_level?: string
  market_trend?: string
  key_metrics?: string
  tags?: string[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  processed?: number
}