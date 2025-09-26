import { CaseRepository, Case } from '@/lib/supabase'
import CaseCard from '@/components/CaseCard'
import { LoadingSkeleton } from '@/components/Loading'
import { Suspense } from 'react'

async function CasesList() {
  try {
    const cases = await CaseRepository.getPublishedCases(20, 0)
    
    if (!cases || cases.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              暂无案例
            </h3>
            <p className="text-gray-600 mb-8">
              我们正在收集更多优质的副业案例，请稍后再来查看。
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
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
  } catch (error) {
    console.error('获取案例列表失败:', error)
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            加载失败
          </h3>
          <p className="text-gray-600 mb-4">
            无法加载案例列表，请检查数据库连接配置。
          </p>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-800">
              请确保已正确配置 Supabase 环境变量
            </p>
          </div>
        </div>
      </div>
    )
  }
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <LoadingSkeleton key={i} />
      ))}
    </div>
  )
}

export default function CasesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          副业案例库
        </h1>
        <p className="text-gray-600 max-w-2xl">
          发现全球成功的副业项目，学习他们的经验和方法。每个案例都包含详细的收入信息、
          时间投入、使用工具和实施步骤，帮助您找到适合的副业方向。
        </p>
      </div>

      {/* 统计信息 */}
      <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              🚀 持续更新中
            </h3>
            <p className="text-sm text-blue-700">
              我们每周从全球优质平台抓取最新的副业案例
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">100+</div>
            <div className="text-sm text-blue-600">个案例</div>
          </div>
        </div>
      </div>

      {/* 案例列表 */}
      <Suspense fallback={<LoadingGrid />}>
        <CasesList />
      </Suspense>

      {/* 底部提示 */}
      <div className="mt-12 text-center">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            想要更多案例？
          </h3>
          <p className="text-gray-600 text-sm">
            我们的系统会定期抓取 Reddit、ProductHunt、IndieHackers 等平台的最新内容
          </p>
        </div>
      </div>
    </div>
  )
}