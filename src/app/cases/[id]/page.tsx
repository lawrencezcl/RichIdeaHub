import { CaseRepository } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: { id: string }
}

export default async function CaseDetailPage({ params }: Props) {
  const id = parseInt(params.id)
  
  if (isNaN(id)) {
    notFound()
  }

  const case_ = await CaseRepository.getCaseById(id)
  
  if (!case_) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link 
          href="/cases" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← 返回案例库
        </Link>
      </div>

      {/* 案例标题 */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {case_.title}
        </h1>
        <p className="text-lg text-gray-600">
          {case_.description}
        </p>
      </header>

      {/* 关键信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">💰 收入水平</h3>
          <p className="text-2xl font-bold text-green-600">{case_.income}</p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">⏰ 时间投入</h3>
          <p className="text-2xl font-bold text-blue-600">{case_.time_required}</p>
        </div>
      </div>

      {/* 使用工具 */}
      {case_.tools && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🛠️ 使用工具
          </h2>
          <div className="flex flex-wrap gap-2">
            {case_.tools.split(',').map((tool, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                {tool.trim()}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 实施步骤 */}
      {case_.steps && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 实施步骤
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <ol className="space-y-3">
              {case_.steps.split('\n').filter(step => step.trim()).map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step.trim()}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* 原始链接 */}
      {case_.source_url && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔗 原始来源
          </h2>
          <a 
            href={case_.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            查看原始内容 ↗
          </a>
        </section>
      )}

      {/* 底部信息 */}
      <footer className="border-t pt-6 text-sm text-gray-500">
        <p>
          发布时间: {new Date(case_.created_at).toLocaleDateString('zh-CN')}
        </p>
        <p className="mt-2">
          💡 提示：每个人的情况不同，投入的时间和获得的收入可能有所差异。
          建议在开始前做好充分的市场调研。
        </p>
      </footer>
    </div>
  )
}