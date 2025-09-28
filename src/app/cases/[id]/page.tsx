import { CaseRepository } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import UserFeedback from '@/components/UserFeedback'
import MiniStats from '@/components/MiniStats'
import Header from '@/components/Header'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CaseDetailPage({ params }: Props) {
  const { id } = await params
  const caseId = parseInt(id)

  if (isNaN(caseId)) {
    notFound()
  }

  const case_ = await CaseRepository.getCaseById(caseId)

  if (!case_) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            href="/cases"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回案例库
          </Link>
        </div>

        {/* 案例标题区域 */}
        <header className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                {case_.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {case_.description}
              </p>
            </div>
            <div className="ml-6 flex flex-col space-y-2">
              {case_.published && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ✓ 已发布
                </span>
              )}
              {case_.category && (
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  📁 {case_.category}
                </span>
              )}
              {case_.difficulty && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  case_.difficulty === 'beginner' ? 'bg-blue-100 text-blue-800' :
                  case_.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  🎯 {case_.difficulty === 'beginner' ? '初级' : case_.difficulty === 'intermediate' ? '中级' : '高级'}
                </span>
              )}
            </div>
          </div>

          {/* 来源信息 */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
            <span>发布时间: {new Date(case_.created_at).toLocaleDateString('zh-CN')}</span>
            {case_.author && <span>作者: {case_.author}</span>}
            {case_.upvotes !== undefined && <span>👍 {case_.upvotes} 赞同</span>}
            {case_.comments_count !== undefined && <span>💬 {case_.comments_count} 评论</span>}
          </div>
        </header>

        {/* 案例统计信息 */}
        <MiniStats variant="case-specific" showRealTime={true} />

        {/* 核心信息网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 收入信息 */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">💰</span>
              </div>
              <h3 className="font-semibold text-green-800">收入水平</h3>
            </div>
            <p className="text-2xl font-bold text-green-700">{case_.income}</p>
            {case_.investment_required && (
              <p className="text-sm text-green-600 mt-2">💼 投资: {case_.investment_required}</p>
            )}
          </div>

          {/* 时间投入 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">⏰</span>
              </div>
              <h3 className="font-semibold text-blue-800">时间投入</h3>
            </div>
            <p className="text-2xl font-bold text-blue-700">{case_.time_required}</p>
            {case_.time_to_profit && (
              <p className="text-sm text-blue-600 mt-2">🎯 盈利时间: {case_.time_to_profit}</p>
            )}
          </div>

          {/* 成功率 */}
          {case_.success_rate && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">📈</span>
                </div>
                <h3 className="font-semibold text-purple-800">成功率</h3>
              </div>
              <p className="text-2xl font-bold text-purple-700">{case_.success_rate}</p>
              {case_.scalability && (
                <p className="text-sm text-purple-600 mt-2">🚀 可扩展性: {case_.scalability}</p>
              )}
            </div>
          )}
        </div>

        {/* 详细信息卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 使用工具 */}
          {case_.tools && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🛠️</span>
                使用工具
              </h3>
              <div className="flex flex-wrap gap-2">
                {case_.tools.split(',').map((tool, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {tool.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 技能需求 */}
          {case_.skills_needed && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                所需技能
              </h3>
              <div className="flex flex-wrap gap-2">
                {case_.skills_needed.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 实施步骤 */}
        {case_.steps && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📋</span>
              实施步骤
            </h3>
            <div className="bg-gray-50 p-6 rounded-xl">
              <ol className="space-y-4">
                {case_.steps.split('\n').filter(step => step.trim()).map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed flex-1">{step.trim()}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* 市场信息 */}
        {(case_.target_audience || case_.competition_level || case_.market_trend) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {case_.target_audience && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">👥</span>
                  目标用户
                </h3>
                <p className="text-gray-700">{case_.target_audience}</p>
              </div>
            )}

            {case_.competition_level && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">⚔️</span>
                  竞争程度
                </h3>
                <p className="text-gray-700">{case_.competition_level}</p>
              </div>
            )}

            {case_.market_trend && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">📊</span>
                  市场趋势
                </h3>
                <p className="text-gray-700">{case_.market_trend}</p>
              </div>
            )}
          </div>
        )}

        {/* 风险与指标 */}
        {(case_.potential_risks || case_.key_metrics) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {case_.potential_risks && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">⚠️</span>
                  潜在风险
                </h3>
                <p className="text-gray-700">{case_.potential_risks}</p>
              </div>
            )}

            {case_.key_metrics && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">📈</span>
                  关键指标
                </h3>
                <p className="text-gray-700">{case_.key_metrics}</p>
              </div>
            )}
          </div>
        )}

        {/* 其他信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {case_.revenue_model && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">💵</span>
                收入模式
              </h3>
              <p className="text-gray-700">{case_.revenue_model}</p>
            </div>
          )}

          {case_.location_flexible !== undefined && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">🌍</span>
                地点灵活性
              </h3>
              <p className="text-gray-700">
                {case_.location_flexible ? '✅ 完全远程/灵活工作地点' : '📍 需要固定工作地点'}
              </p>
            </div>
          )}
        </div>

        {/* 标签 */}
        {case_.tags && case_.tags.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🏷️</span>
              相关标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {case_.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 原始来源 */}
        {case_.source_url && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🔗</span>
              原始来源
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">来源链接</h4>
                  <p className="text-sm text-gray-600">
                    查看完整的原始内容和讨论
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {case_.source_url.includes('reddit.com') && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Reddit</span>
                  )}
                  {case_.source_url.includes('producthunt.com') && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">ProductHunt</span>
                  )}
                  {case_.source_url.includes('indiehackers.com') && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">IndieHackers</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href={case_.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate flex-1 mr-3">
                    {case_.source_url}
                  </span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 用户反馈区域 */}
        <UserFeedback caseData={case_} />

        {/* 底部信息 */}
        <footer className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center text-gray-500">
            <p className="mb-2">
              发布时间: {new Date(case_.created_at).toLocaleDateString('zh-CN')}
            </p>
            <p className="text-sm">
              💡 提示：每个人的情况不同，投入的时间和获得的收入可能有所差异。
              建议在开始前做好充分的市场调研和风险评估。
            </p>
          </div>
        </footer>
      </div>

      {/* 结构化数据 (JSON-LD) */}
      <Script id="structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": case_.title,
          "description": case_.description,
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'}/cases/${case_.id}`,
          "dateCreated": case_.created_at,
          "dateModified": case_.created_at,
          "author": {
            "@type": "Organization",
            "name": "Rich Idea Hub"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Rich Idea Hub",
            "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'
          },
          "about": {
            "@type": "Thing",
            "name": "副业案例",
            "description": `${case_.category || '副业'} - ${case_.income}`
          },
          "genre": case_.category || "副业",
          "keywords": case_.tags ? case_.tags.join(", ") : "副业,在线赚钱,创业",
          "educationalLevel": case_.difficulty,
          "timeRequired": case_.time_required,
          "occupationalCategory": {
            "@type": "Occupation",
            "name": case_.category || "副业",
            "occupationLocation": {
              "@type": "Place",
              "name": case_.location_flexible ? "远程" : "固定地点"
            }
          },
          "isAccessibleForFree": true,
          "inLanguage": "zh-CN",
          "mainEntity": {
            "@type": "HowTo",
            "name": case_.title,
            "description": case_.description,
            "totalTime": case_.time_required,
            "estimatedCost": {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": case_.investment_required === "高" ? "1000" : case_.investment_required === "中" ? "500" : "100"
            },
            "tool": case_.tools ? case_.tools.split(',').map(tool => ({
              "@type": "HowToTool",
              "name": tool.trim()
            })) : [],
            "step": case_.steps ? case_.steps.split('\n').filter(step => step.trim()).map((step, index) => ({
              "@type": "HowToStep",
              "position": index + 1,
              "text": step.trim()
            })) : []
          }
        })}
      </Script>
    </div>
  )
}