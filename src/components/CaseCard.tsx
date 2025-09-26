import Link from 'next/link'
import { Case } from '@/lib/types'

interface Props {
  case: Case
}

export default function CaseCard({ case: caseData }: Props) {
  return (
    <Link href={`/cases/${caseData.id}`}>
      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 h-full">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">
          {caseData.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
          {caseData.description}
        </p>
        
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">收入:</span>
            <span className="font-medium text-green-600">
              {caseData.income}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-500">时间:</span>
            <span className="text-gray-700">{caseData.time_required}</span>
          </div>
        </div>
        
        {caseData.tools && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {caseData.tools.split(',').slice(0, 3).map((tool, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tool.trim()}
                </span>
              ))}
              {caseData.tools.split(',').length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{caseData.tools.split(',').length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-400">
          {new Date(caseData.created_at).toLocaleDateString('zh-CN')}
        </div>
      </div>
    </Link>
  )
}