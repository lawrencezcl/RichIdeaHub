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
}

export interface RawCaseData {
  title: string
  content: string
  url: string
  source_id: string
}

export interface ProcessedCase {
  title: string
  description: string
  income: string
  time_required: string
  tools: string
  steps: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  processed?: number
}