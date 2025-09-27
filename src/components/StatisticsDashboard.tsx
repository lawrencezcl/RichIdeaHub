'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Star,
  Target,
  Briefcase,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'positive' | 'negative'
  icon: React.ReactNode
  color: string
  description?: string
  trend?: 'up' | 'down' | 'stable'
}

interface ChartData {
  name: string
  value: number
  color: string
}

interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

interface StatisticsDashboardProps {
  compact?: boolean
  timeRange?: '7d' | '30d' | '90d' | '1y'
  refreshInterval?: number
}

export default function StatisticsDashboard({
  compact = false,
  timeRange = '30d',
  refreshInterval = 30000
}: StatisticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Mock statistics data
  const statsData = {
    overview: {
      totalCases: 1247,
      activeUsers: 5234,
      totalRevenue: 2847500,
      avgRating: 4.8,
      successRate: 87
    },
    userEngagement: {
      dailyActiveUsers: 1234,
      sessionDuration: 8.5,
      bounceRate: 32,
      conversionRate: 12.5
    },
    contentPerformance: {
      mostViewedCase: 'Etsy手工艺品销售',
      highestRated: 'Shopify Dropshipping',
      trendingCase: 'AI内容创作',
      avgTimeOnPage: 4.2
    },
    financialMetrics: {
      monthlyRevenue: 237291,
      avgIncomePerCase: 2284,
      topCategory: '电商类',
      revenueGrowth: 23.5
    }
  }

  // Mock time series data for charts
  const revenueData: TimeSeriesData[] = [
    { date: '2024-01', value: 180000, label: '1月' },
    { date: '2024-02', value: 195000, label: '2月' },
    { date: '2024-03', value: 210000, label: '3月' },
    { date: '2024-04', value: 225000, label: '4月' },
    { date: '2024-05', value: 240000, label: '5月' },
    { date: '2024-06', value: 2847500, label: '6月' }
  ]

  const userGrowthData: TimeSeriesData[] = [
    { date: '2024-01', value: 3200, label: '1月' },
    { date: '2024-02', value: 3600, label: '2月' },
    { date: '2024-03', value: 4100, label: '3月' },
    { date: '2024-04', value: 4600, label: '4月' },
    { date: '2024-05', value: 4900, label: '5月' },
    { date: '2024-06', value: 5234, label: '6月' }
  ]

  const categoryData: ChartData[] = [
    { name: '电商类', value: 35, color: 'bg-blue-500' },
    { name: '服务类', value: 25, color: 'bg-green-500' },
    { name: '内容创作', value: 20, color: 'bg-purple-500' },
    { name: '技能服务', value: 15, color: 'bg-orange-500' },
    { name: '其他', value: 5, color: 'bg-gray-500' }
  ]

  useEffect(() => {
    // Simulate data refresh
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
    setIsLoading(true)
    setSelectedTimeRange(range)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const StatCard = ({ title, value, change, changeType, icon, color, description, trend }: StatCardProps) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 ${
      isLoading ? 'opacity-75' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`p-2 rounded-lg ${
            trend === 'up' ? 'bg-green-100 text-green-600' :
            trend === 'down' ? 'bg-red-100 text-red-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
             trend === 'down' ? <TrendingDown className="w-4 h-4" /> :
             <BarChart3 className="w-4 h-4" />}
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600">{title}</div>
      {description && (
        <div className="text-xs text-gray-500 mt-1">{description}</div>
      )}
    </div>
  )

  const SimpleChart = ({ data, color = 'bg-blue-500' }: { data: TimeSeriesData[], color?: string }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">趋势图</h3>
      <div className="relative h-32">
        <div className="absolute inset-0 flex items-end space-x-1">
          {data.map((item, index) => (
            <div
              key={index}
              className={`flex-1 ${color} rounded-t transition-all duration-300 hover:opacity-80`}
              style={{
                height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`
              }}
              title={`${item.label}: ${item.value.toLocaleString()}`}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  )

  const CategoryChart = ({ data }: { data: ChartData[] }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">案例分布</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 ${item.color} rounded`}></div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600">{item.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (compact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="总案例数"
          value={statsData.overview.totalCases}
          change={12.5}
          changeType="positive"
          icon={<Briefcase className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="up"
        />
        <StatCard
          title="活跃用户"
          value={statsData.overview.activeUsers.toLocaleString()}
          change={8.3}
          changeType="positive"
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend="up"
        />
        <StatCard
          title="平均评分"
          value={statsData.overview.avgRating}
          icon={<Star className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
          description="基于 2,847 条评价"
        />
        <StatCard
          title="成功率"
          value={`${statsData.overview.successRate}%`}
          change={5.2}
          changeType="positive"
          icon={<Target className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend="up"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">数据统计面板</h2>
          <p className="text-gray-600">平台运营数据与用户行为分析</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={isLoading}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            更新时间: {lastUpdated.toLocaleTimeString('zh-CN')}
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总案例数"
          value={statsData.overview.totalCases.toLocaleString()}
          change={12.5}
          changeType="positive"
          icon={<Briefcase className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="up"
          description="涵盖 12 个主要类别"
        />
        <StatCard
          title="活跃用户"
          value={statsData.overview.activeUsers.toLocaleString()}
          change={8.3}
          changeType="positive"
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend="up"
          description="月活跃用户数"
        />
        <StatCard
          title="总收入"
          value={`$${(statsData.overview.totalRevenue / 1000000).toFixed(1)}M`}
          change={23.5}
          changeType="positive"
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-600"
          trend="up"
          description="累计用户收入"
        />
        <StatCard
          title="平均评分"
          value={statsData.overview.avgRating}
          icon={<Star className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
          description="基于 2,847 条评价"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart data={revenueData} color="bg-green-500" />
        <SimpleChart data={userGrowthData} color="bg-blue-500" />
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Engagement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 text-blue-600 mr-2" />
            用户参与度
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">日活跃用户</span>
              <span className="font-semibold text-gray-900">
                {statsData.userEngagement.dailyActiveUsers.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">平均会话时长</span>
              <span className="font-semibold text-gray-900">
                {statsData.userEngagement.sessionDuration} 分钟
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">跳出率</span>
              <span className="font-semibold text-orange-600">
                {statsData.userEngagement.bounceRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">转化率</span>
              <span className="font-semibold text-green-600">
                {statsData.userEngagement.conversionRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            内容表现
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">最受关注案例</div>
              <div className="font-semibold text-gray-900">
                {statsData.contentPerformance.mostViewedCase}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">评分最高</div>
              <div className="font-semibold text-gray-900">
                {statsData.contentPerformance.highestRated}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">热门趋势</div>
              <div className="font-semibold text-blue-600">
                {statsData.contentPerformance.trendingCase}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">平均停留时间</div>
              <div className="font-semibold text-gray-900">
                {statsData.contentPerformance.avgTimeOnPage} 分钟
              </div>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
            财务指标
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">月收入</span>
              <span className="font-semibold text-green-600">
                ${statsData.financialMetrics.monthlyRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">案例平均收入</span>
              <span className="font-semibold text-gray-900">
                ${statsData.financialMetrics.avgIncomePerCase}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">最热门类别</span>
              <span className="font-semibold text-blue-600">
                {statsData.financialMetrics.topCategory}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">收入增长率</span>
              <span className="font-semibold text-green-600">
                +{statsData.financialMetrics.revenueGrowth}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <CategoryChart data={categoryData} />

      {/* Real-time Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 text-blue-600 mr-2" />
          实时数据
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">234</div>
            <div className="text-sm text-gray-600">在线用户</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">45</div>
            <div className="text-sm text-gray-600">今日新案例</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">89</div>
            <div className="text-sm text-gray-600">今日评价</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">$12.5K</div>
            <div className="text-sm text-gray-600">今日收入</div>
          </div>
        </div>
      </div>
    </div>
  )
}