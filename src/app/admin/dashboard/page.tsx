'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import StatisticsDashboard from '@/components/StatisticsDashboard'
import CaseCard from '@/components/CaseCard'
import { Case } from '@/lib/types'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock recent cases for admin view
  const recentCases: Case[] = [
    {
      id: 1,
      title: "AI内容创作服务 - 从零到月入$5000",
      description: "利用AI工具提供内容创作服务，包括博客文章、社交媒体内容、产品描述等。无需专业写作背景，AI辅助创作。",
      income: "$3000-8000/月",
      time_required: "3-4小时/天",
      tools: "ChatGPT, Claude, Notion, Canva",
      steps: "1. 注册AI工具账号 2. 建立作品集 3. 在平台接单 4. 使用AI辅助创作 5. 交付并获取评价",
      investment_required: "低",
      success_rate: "85%",
      category: "内容创作",
      difficulty: "beginner",
      tags: ["AI", "内容创作", "远程", "低投入"],
      source_url: "https://example.com/ai-content",
      raw_content: "详细内容...",
      upvotes: 1247,
      comments_count: 89,
      created_at: "2024-06-15T10:30:00Z",
      published: true,
      admin_approved: true,
      location_flexible: true
    },
    {
      id: 2,
      title: "Etsy手工艺品销售 - 在家创业指南",
      description: "在Etsy平台销售手工制作的首饰、装饰品等。包括产品选择、定价策略、营销推广等完整指导。",
      income: "$1000-3000/月",
      time_required: "2-3小时/天",
      investment_required: "中",
      success_rate: "78%",
      category: "电商",
      difficulty: "intermediate",
      tags: ["Etsy", "手工艺品", "电商", "创意"],
      source_url: "https://example.com/etsy-handmade",
      raw_content: "详细内容...",
      tools: "Etsy平台, 手工工具, 摄影设备, 包装材料",
      steps: "1. 注册Etsy卖家账号 2. 制作产品样品 3. 拍摄产品照片 4. 定价上架 5. 处理订单和发货",
      upvotes: 892,
      comments_count: 67,
      created_at: "2024-06-14T14:20:00Z",
      published: true,
      admin_approved: true,
      location_flexible: true
    },
    {
      id: 3,
      title: "Shopify Dropshipping - 电商创业模式",
      description: "通过Shopify建立dropshipping商店，无需库存，一件代发。包括选品、建站、推广等全套流程。",
      income: "$2000-6000/月",
      time_required: "4-6小时/天",
      investment_required: "高",
      success_rate: "72%",
      category: "电商",
      difficulty: "intermediate",
      tags: ["Shopify", "Dropshipping", "电商", "无库存"],
      source_url: "https://example.com/shopify-dropshipping",
      raw_content: "详细内容...",
      tools: "Shopify, Oberlo, Facebook Ads, Google Analytics",
      steps: "1. 选择利基市场 2. 寻找供应商 3. 建立Shopify店铺 4. 设置推广 5. 处理订单",
      upvotes: 1534,
      comments_count: 156,
      created_at: "2024-06-13T09:15:00Z",
      published: true,
      admin_approved: false,
      location_flexible: true
    }
  ]

  const tabs = [
    { id: 'overview', label: '总览', icon: LayoutDashboard },
    { id: 'cases', label: '案例管理', icon: FileText },
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'analytics', label: '数据分析', icon: TrendingUp },
    { id: 'feedback', label: '用户反馈', icon: MessageSquare },
    { id: 'settings', label: '系统设置', icon: Settings }
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const filteredCases = recentCases.filter(case_ =>
    case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (case_.category && case_.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜索案例..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Header with actions */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">数据总览</h2>
                  <p className="text-gray-600 mt-1">平台运营数据与关键指标</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>刷新</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Download className="w-4 h-4" />
                    <span>导出报告</span>
                  </button>
                </div>
              </div>

              {/* Statistics Dashboard */}
              <StatisticsDashboard
                compact={false}
                timeRange="30d"
                refreshInterval={30000}
              />

              {/* Recent Cases */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">最新案例</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    查看全部
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recentCases.slice(0, 3).map((case_) => (
                    <CaseCard key={case_.id} case={case_} compact={true} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">案例管理</h2>
                  <p className="text-gray-600">管理平台上的所有副业案例</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  添加新案例
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option>所有状态</option>
                    <option>已发布</option>
                    <option>待审核</option>
                    <option>已拒绝</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option>所有分类</option>
                    <option>电商</option>
                    <option>服务</option>
                    <option>内容创作</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option>所有难度</option>
                    <option>初级</option>
                    <option>中级</option>
                    <option>高级</option>
                  </select>
                </div>
              </div>

              {/* Cases Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((case_) => (
                  <div key={case_.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <CaseCard case={case_} compact={true} />
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          case_.admin_approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {case_.admin_approved ? '已审核' : '待审核'}
                        </span>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm">
                            编辑
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">数据分析</h2>
                <p className="text-gray-600">深入分析平台数据和用户行为</p>
              </div>

              <StatisticsDashboard
                compact={false}
                timeRange="90d"
                refreshInterval={60000}
              />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">用户管理</h2>
                  <p className="text-gray-600">管理平台用户和权限</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  邀请用户
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-500 text-center py-8">用户管理功能开发中...</p>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">用户反馈</h2>
                <p className="text-gray-600">查看和管理用户反馈及评价</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-500 text-center py-8">反馈管理功能开发中...</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">系统设置</h2>
                <p className="text-gray-600">配置平台参数和系统选项</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-500 text-center py-8">系统设置功能开发中...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}