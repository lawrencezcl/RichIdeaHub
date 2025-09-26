import Link from 'next/link'
import { Case } from '@/lib/types'

interface Props {
  case: Case
}

export default function CaseCard({ case: caseData }: Props) {
  // 获取来源类型
  const getSourceType = (url: string) => {
    if (url.includes('reddit.com')) return { name: 'Reddit', color: 'bg-orange-100 text-orange-800' }
    if (url.includes('producthunt.com')) return { name: 'ProductHunt', color: 'bg-red-100 text-red-800' }
    if (url.includes('indiehackers.com')) return { name: 'IndieHackers', color: 'bg-yellow-100 text-yellow-800' }
    return { name: '其他', color: 'bg-gray-100 text-gray-800' }
  }

  const source = getSourceType(caseData.source_url)

  return (
    <Link href={`/cases/${caseData.id}`}>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 h-full overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${source.color}`}>
              {source.name}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(caseData.created_at).toLocaleDateString('zh-CN')}
            </span>
          </div>

          <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-3">
            {caseData.title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {caseData.description}
          </p>
        </div>

        {/* Stats */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xs text-green-600 font-medium mb-1">收入</div>
              <div className="text-sm font-bold text-green-800 line-clamp-1">
                {caseData.income}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xs text-blue-600 font-medium mb-1">时间</div>
              <div className="text-sm font-bold text-blue-800 line-clamp-1">
                {caseData.time_required}
              </div>
            </div>
          </div>
        </div>

        {/* Tools */}
        {caseData.tools && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-1.5">
              {caseData.tools.split(',').slice(0, 3).map((tool, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  {tool.trim()}
                </span>
              ))}
              {caseData.tools.split(',').length > 3 && (
                <span className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                  +{caseData.tools.split(',').length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">点击查看详情</span>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}