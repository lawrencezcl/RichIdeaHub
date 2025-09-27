'use client'

import { useState, useEffect } from 'react'
import CaseCard from '@/components/CaseCard'
import { LoadingSkeleton } from '@/components/Loading'

interface Case {
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
  admin_approved?: boolean
  admin_notes?: string
  url?: string
}

function CasesList() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true)
        // Mock data for now - in production this would fetch from API
        const mockCases: Case[] = [
          {
            id: 1,
            title: "AI内容创作服务 - 从零到月入$5000",
            description: "利用AI工具提供内容创作服务，包括博客文章、社交媒体内容、产品描述等。无需专业写作背景，AI辅助创作。",
            income: "$3000-8000/月",
            time_required: "3-4小时/天",
            tools: "ChatGPT, Claude, Notion, Canva",
            steps: "1. 注册AI工具账号 2. 建立作品集 3. 在平台接单 4. 使用AI辅助创作 5. 交付并获取评价",
            source_url: "https://example.com/ai-content",
            raw_content: "详细内容：利用AI工具提供内容创作服务的完整指南...",
            published: true,
            created_at: "2024-06-15T10:30:00Z",
            investment_required: "低",
            success_rate: "85%",
            category: "内容创作",
            difficulty: "beginner",
            skills_needed: "基础写作能力, AI工具使用",
            target_audience: "企业主, 博主, 营销人员",
            potential_risks: "AI内容质量参差不齐, 客户要求变化快",
            time_to_profit: "1-2个月",
            scalability: "高",
            location_flexible: true,
            age_restriction: "无限制",
            revenue_model: "服务收费",
            competition_level: "中等",
            market_trend: "快速增长",
            key_metrics: "客户数量, 项目完成率, 客户满意度",
            tags: ["AI", "内容创作", "远程", "低投入"]
          },
          {
            id: 2,
            title: "Etsy手工艺品销售 - 在家创业指南",
            description: "在Etsy平台销售手工制作的首饰、装饰品等。包括产品选择、定价策略、营销推广等完整指导。",
            income: "$1000-3000/月",
            time_required: "2-3小时/天",
            tools: "Etsy平台, 手工工具, 摄影设备, 包装材料",
            steps: "1. 注册Etsy卖家账号 2. 制作产品样品 3. 拍摄产品照片 4. 定价上架 5. 处理订单和发货",
            source_url: "https://example.com/etsy-handmade",
            raw_content: "详细内容：在Etsy平台销售手工制作品的完整指南...",
            published: true,
            created_at: "2024-06-14T14:20:00Z",
            investment_required: "中",
            success_rate: "78%",
            category: "电商",
            difficulty: "intermediate",
            skills_needed: "手工艺, 摄影, 客户服务",
            target_audience: "手工艺品爱好者, 礼品购买者",
            potential_risks: "库存积压, 平台费用变化, 竞争激烈",
            time_to_profit: "2-3个月",
            scalability: "中等",
            location_flexible: true,
            age_restriction: "无限制",
            revenue_model: "产品销售",
            competition_level: "高",
            market_trend: "稳定",
            key_metrics: "销量, 评价分数, 回头客比例",
            tags: ["Etsy", "手工艺品", "电商", "创意"]
          }
        ]
        setCases(mockCases)
      } catch (err) {
        console.error('获取案例列表失败:', err)
        setError('无法加载案例列表')
      } finally {
        setLoading(false)
      }
    }

    loadCases()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-900 mb-4">
            加载失败
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error}
          </p>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <p className="text-sm text-red-800">
              请确保已正确配置数据库环境变量
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!cases || cases.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            暂无案例
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            我们正在收集更多优质的副业案例，请稍后再来查看。
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-800">
              💡 建议管理员先运行数据抓取，获取一些案例数据
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases.map((case_: Case) => (
        <CaseCard key={case_.id} case={case_} />
      ))}
    </div>
  )
}


export default function CasesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white/50 backdrop-blur-sm rounded-3xl my-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-blue-900">AI 智能聚合</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent mb-6">
          发现全球副业机会
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          AI 驱动的副业案例聚合平台，从 Reddit、ProductHunt、IndieHackers 等平台智能分析，
          为您提供可复制的赚钱项目和详细实施步骤。
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">3+</div>
            <div className="text-sm text-gray-600">数据源</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
            <div className="text-sm text-gray-600">案例库</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">自动更新</div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
          <span className="text-sm font-medium text-gray-500">数据来源:</span>
          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Reddit</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">ProductHunt</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">IndieHackers</span>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">精选案例</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>实时更新</span>
          </div>
        </div>

        <CasesList />
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-12 text-center text-white shadow-lg">
        <h3 className="text-2xl font-bold mb-4">开始您的副业之旅</h3>
        <p className="text-blue-50 mb-8 max-w-2xl mx-auto">
          浏览我们的案例库，找到适合您的副业方向，学习成功经验，开启您的赚钱之路。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg">
            探索案例
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30">
            了解更多
          </button>
        </div>
      </div>
    </div>
  )
}