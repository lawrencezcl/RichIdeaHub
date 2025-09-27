import { Case } from './types'

// Mock data for client-side components during development
const mockCases: Case[] = [
  {
    id: 1,
    title: "Reddit: 从零开始的Dropshipping月收入$3000+案例",
    description: "详细记录了如何从零开始建立Dropshipping业务，包括选品、供应链搭建、广告投放等完整流程。3个月实现月收入突破$3000，6个月后稳定在$5000+。",
    income: "$3000+/月",
    time_required: "每周20-30小时",
    tools: "Shopify, Facebook Ads, AliExpress",
    steps: "选品调研 → 店铺搭建 → 供应链对接 → 广告测试 → 优化扩容",
    source_url: "https://reddit.com/r/sidehustle/comments/example1",
    raw_content: "",
    published: true,
    created_at: new Date().toISOString(),
    category: "电商",
    difficulty: "beginner",
    investment_required: "$500-1000",
    skills_needed: "基础英语, 数据分析",
    target_audience: "所有人",
    potential_risks: "库存风险, 广告费超支",
    success_rate: "中等",
    time_to_profit: "1-2个月",
    scalability: "高",
    location_flexible: true,
    age_restriction: "无",
    revenue_model: "产品销售",
    competition_level: "中等",
    market_trend: "稳定",
    key_metrics: "利润率20-30%, ROI 200%",
    author: "reddit_user1",
    upvotes: 1250,
    comments_count: 89,
    tags: ["电商", "Dropshipping", "新手友好"],
    admin_approved: true,
    admin_notes: undefined
  },
  {
    id: 2,
    title: "IndieHackers: SaaS工具从0到$1000 MRR之路",
    description: "独立开发者分享如何开发并推广一个小型SaaS工具，从idea验证到第一个付费用户，再到稳定$1000 MRR的完整历程。包含技术选型、定价策略、用户获取等关键环节。",
    income: "$1000 MRR",
    time_required: "每周15-25小时",
    tools: "Next.js, Stripe, Mailchimp",
    steps: "需求验证 → MVP开发 → 早期用户获取 → 产品迭代 → 规模化",
    source_url: "https://indiehackers.com/post/example2",
    raw_content: "",
    published: true,
    created_at: new Date().toISOString(),
    category: "SaaS",
    difficulty: "intermediate",
    investment_required: "$100-500",
    skills_needed: "编程能力, 产品思维",
    target_audience: "开发者",
    potential_risks: "技术债务, 市场竞争",
    success_rate: "低",
    time_to_profit: "3-6个月",
    scalability: "很高",
    location_flexible: true,
    age_restriction: "无",
    revenue_model: "订阅制",
    competition_level: "高",
    market_trend: "增长",
    key_metrics: "LTV $500, CAC $50",
    author: "indie_dev2",
    upvotes: 890,
    comments_count: 156,
    tags: ["SaaS", "独立开发", "订阅制"],
    admin_approved: true,
    admin_notes: undefined
  }
]

// Client-side data repository (mock implementation)
export class CaseRepository {
  static async getPublishedCases(limit = 20, offset = 0): Promise<Case[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockCases.slice(offset, offset + limit)
  }

  static async getCaseById(id: number): Promise<Case | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockCases.find(case_ => case_.id === id) || null
  }

  static async getAllCases(limit = 20, offset = 0): Promise<Case[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockCases.slice(offset, offset + limit)
  }

  static async createCase(caseData: Omit<Case, 'id' | 'created_at'>): Promise<Case> {
    // Mock implementation - in real app this would call an API
    const newCase: Case = {
      ...caseData,
      id: Date.now(), // Mock ID
      created_at: new Date().toISOString()
    }
    mockCases.unshift(newCase)
    return newCase
  }

  static async updatePublishStatus(id: number, published: boolean): Promise<void> {
    // Mock implementation
    const case_ = mockCases.find(c => c.id === id)
    if (case_) {
      case_.published = published
    }
  }

  static async batchUpdatePublishStatus(ids: number[], published: boolean): Promise<number> {
    // Mock implementation
    let count = 0
    ids.forEach(id => {
      const case_ = mockCases.find(c => c.id === id)
      if (case_) {
        case_.published = published
        count++
      }
    })
    return count
  }

  static async caseExists(sourceUrl: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockCases.some(case_ => case_.source_url === sourceUrl)
  }

  static async clearAllData(): Promise<number> {
    // Mock implementation
    const count = mockCases.length
    mockCases.length = 0
    return count
  }

  static async testConnection(): Promise<boolean> {
    // Mock implementation - always return true for client-side
    return true
  }

  static async initTables(): Promise<void> {
    // Mock implementation - no-op for client-side
    console.log('Client-side: Tables initialization skipped')
  }
}

export type { Case }

// Mock Supabase clients for compatibility
export const supabase = null
export const supabaseAdmin = null