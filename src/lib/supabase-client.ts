import { Case } from './types'

// Enhanced mock data for client-side components during development
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
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
    tags: ["电商", "Dropshipping", "新手友好", "Facebook", "Shopify"],
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
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
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
    tags: ["SaaS", "独立开发", "订阅制", "JavaScript", "Stripe"],
    admin_approved: true,
    admin_notes: undefined
  },
  {
    id: 3,
    title: "ProductHunt: 简约设计模板月收入$2000+",
    description: "设计师分享如何在Figma社区和ProductHunt上推广设计模板，从零开始建立被动收入。包含模板设计、平台运营、客户服务等完整流程。",
    income: "$2000+/月",
    time_required: "每周10-15小时",
    tools: "Figma, Gumroad, Twitter",
    steps: "设计模板 → 平台上架 → 社交推广 → 客户服务 → 持续更新",
    source_url: "https://producthunt.com/posts/design-templates",
    raw_content: "",
    published: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: "设计",
    difficulty: "beginner",
    investment_required: "$0-100",
    skills_needed: "设计能力, 社交媒体运营",
    target_audience: "设计师, 创业者",
    potential_risks: "设计趋势变化, 平台规则调整",
    success_rate: "高",
    time_to_profit: "1个月",
    scalability: "中等",
    location_flexible: true,
    age_restriction: "无",
    revenue_model: "数字产品",
    competition_level: "中等",
    market_trend: "增长",
    key_metrics: "下载量, 好评率, 回头客",
    author: "designer_pro",
    upvotes: 2150,
    comments_count: 234,
    tags: ["设计", "Figma", "模板", "数字产品", "被动收入"],
    admin_approved: true,
    admin_notes: undefined
  },
  {
    id: 4,
    title: "Reddit: 自由职业者接单月入$8000完整指南",
    description: "程序员分享从Upwork和Fiverr平台接单的经历，如何建立个人品牌、提高报价、管理客户关系，最终实现月收入$8000+。",
    income: "$8000+/月",
    time_required: "每周40-50小时",
    tools: "Upwork, Fiverr, LinkedIn, Portfolio网站",
    steps: "技能提升 → 作品集搭建 → 平台注册 → 初期低价 → 提价扩容",
    source_url: "https://reddit.com/r/freelance/comments/example4",
    raw_content: "",
    published: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: "自由职业",
    difficulty: "intermediate",
    investment_required: "$0-200",
    skills_needed: "专业技能, 英语沟通, 时间管理",
    target_audience: "有专业技能的人士",
    potential_risks: "客户流失, 平台费用, 收入不稳定",
    success_rate: "中等",
    time_to_profit: "2-3个月",
    scalability: "高",
    location_flexible: true,
    age_restriction: "无",
    revenue_model: "服务收费",
    competition_level: "高",
    market_trend: "稳定增长",
    key_metrics: "时薪, 客户满意度, 重复订单率",
    author: "freelancer_expert",
    upvotes: 1680,
    comments_count: 312,
    tags: ["自由职业", "Upwork", "Fiverr", "编程", "远程工作"],
    admin_approved: true,
    admin_notes: undefined
  },
  {
    id: 5,
    title: "IndieHackers: 内容创作者YouTube频道月收入$5000",
    description: "内容创作者分享YouTube频道的运营经验，从零订阅者开始，通过内容策略、SEO优化、广告合作等方式实现月收入$5000+。",
    income: "$5000+/月",
    time_required: "每周20-25小时",
    tools: "摄像头, 麦克风, 剪辑软件, SEO工具",
    steps: "内容定位 → 设备投入 → 定期更新 → SEO优化 → 变现多元化",
    source_url: "https://indiehackers.com/post/youtube-creator",
    raw_content: "",
    published: true,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    category: "内容创作",
    difficulty: "advanced",
    investment_required: "$500-2000",
    skills_needed: "内容创作, 视频剪辑, SEO, 营销",
    target_audience: "大众用户",
    potential_risks: "平台算法变化, 内容枯竭, 收入不稳定",
    success_rate: "低",
    time_to_profit: "6-12个月",
    scalability: "很高",
    location_flexible: true,
    age_restriction: "无",
    revenue_model: "广告收入, 赞助, 会员",
    competition_level: "很高",
    market_trend: "增长",
    key_metrics: "订阅数, 观看时长, 点击率",
    author: "youtuber_pro",
    upvotes: 3200,
    comments_count: 456,
    tags: ["YouTube", "内容创作", "SEO", "广告", "视频"],
    admin_approved: true,
    admin_notes: undefined
  },
  {
    id: 6,
    title: "ProductHunt: AI工具推荐网站月访问量10万+",
    description: "技术创业者分享如何建立AI工具推荐网站，通过联盟营销、付费推广等方式实现盈利。包含网站建设、内容策略、流量获取等完整指南。",
    income: "$3000+/月",
    time_required: "每周15-20小时",
    tools: "WordPress, AI工具, Google Analytics, 联盟平台",
    steps: "域名购买 → 网站搭建 → 内容创作 → SEO优化 → 流量变现",
    source_url: "https://producthunt.com/posts/ai-tools-directory",
    raw_content: "",
    published: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "联盟营销",
    difficulty: "intermediate",
    investment_required: "$200-800",
    skills_needed: "写作能力, SEO, 数据分析",
    target_audience: "AI工具用户, 技术爱好者",
    potential_risks: "搜索引擎算法变化, 竞争加剧",
    success_rate: "中等",
    time_to_profit: "3-6个月",
    scalability: "高",
    location_flexible: true,
    age_restriction: "无",
    revenue_model: "联盟营销, 广告",
    competition_level: "高",
    market_trend: "快速增长",
    key_metrics: "访问量, 转化率, 收入/访问者",
    author: "ai_enthusiast",
    upvotes: 1450,
    comments_count: 189,
    tags: ["AI", "联盟营销", "SEO", "网站", "内容创作"],
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