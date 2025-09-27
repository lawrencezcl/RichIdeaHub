'use client'

import { useState, useEffect } from 'react'
import { Case } from '@/lib/types'

export default function AdminPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [fetchingData, setFetchingData] = useState(false)
  const [selectedCases, setSelectedCases] = useState<Set<number>>(new Set())
  const [updating, setUpdating] = useState(false)

  // 加载案例列表
  const loadCases = async () => {
    try {
      const response = await fetch('/api/admin')
      const result = await response.json()
      if (result.success) {
        setCases(result.data)
      }
    } catch {
      console.error('加载案例失败')
    }
  }

  // 组件加载时获取案例数据
  useEffect(() => {
    loadCases()
  }, [])

  // 触发数据抓取
  const triggerFetch = async () => {
    setFetchingData(true)
    try {
      const response = await fetch('/api/fetch', { method: 'POST' })
      const result = await response.json()

      if (result.success) {
        alert(`抓取完成！成功处理 ${result.processed} 条新案例`)
        await loadCases()
      } else {
        alert(`抓取失败: ${result.error}`)
      }
    } catch {
      alert('抓取任务启动失败')
    } finally {
      setFetchingData(false)
    }
  }

  // 处理案例选择
  const handleCaseSelect = (caseId: number) => {
    const newSelected = new Set(selectedCases)
    if (newSelected.has(caseId)) {
      newSelected.delete(caseId)
    } else {
      newSelected.add(caseId)
    }
    setSelectedCases(newSelected)
  }

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedCases.size === cases.length) {
      setSelectedCases(new Set())
    } else {
      setSelectedCases(new Set(cases.map(c => c.id)))
    }
  }

  // 批量审批案例
  const approveCases = async () => {
    if (selectedCases.size === 0) {
      alert('请选择要审批的案例')
      return
    }

    setUpdating(true)
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'approve',
          caseIds: Array.from(selectedCases)
        })
      })

      const result = await response.json()
      if (result.success) {
        alert(`成功审批 ${result.approvedCount} 个案例`)
        setSelectedCases(new Set())
        await loadCases()
      } else {
        alert(`审批失败: ${result.error}`)
      }
    } catch {
      alert('审批请求失败')
    } finally {
      setUpdating(false)
    }
  }

  // 批量拒绝案例
  const rejectCases = async () => {
    if (selectedCases.size === 0) {
      alert('请选择要拒绝的案例')
      return
    }

    setUpdating(true)
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'reject',
          caseIds: Array.from(selectedCases)
        })
      })

      const result = await response.json()
      if (result.success) {
        alert(`成功拒绝 ${result.rejectedCount} 个案例`)
        setSelectedCases(new Set())
        await loadCases()
      } else {
        alert(`拒绝失败: ${result.error}`)
      }
    } catch {
      alert('拒绝请求失败')
    } finally {
      setUpdating(false)
    }
  }

  
  // 管理界面
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 头部 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">案例管理后台</h1>
          <p className="text-gray-600">管理副业案例数据</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={triggerFetch}
            disabled={fetchingData}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {fetchingData ? '抓取中...' : '🚀 抓取新案例'}
          </button>
        </div>
      </div>

      {/* 审批控制栏 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              已选择 {selectedCases.size} 个案例
            </span>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedCases.size === cases.length ? '取消全选' : '全选'}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={approveCases}
              disabled={selectedCases.size === 0 || updating}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {updating ? '处理中...' : '✓ 批量审批'}
            </button>
            <button
              onClick={rejectCases}
              disabled={selectedCases.size === 0 || updating}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
            >
              {updating ? '处理中...' : '✗ 批量拒绝'}
            </button>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">总案例数</h3>
          <p className="text-2xl font-bold text-blue-600">{cases.length}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">今日新增</h3>
          <p className="text-2xl font-bold text-green-600">
            {cases.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">总数据源</h3>
          <p className="text-2xl font-bold text-blue-600">3+</p>
        </div>
      </div>

      {/* 案例列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedCases.size === cases.length && cases.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  状态
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  标题
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  收入
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  时间
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  创建时间
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedCases.has(case_.id)}
                      onChange={() => handleCaseSelect(case_.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      case_.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {case_.published ? '已发布' : '待审批'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <p className="font-medium text-gray-900 truncate">
                        {case_.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {case_.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {case_.income}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {case_.time_required}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(case_.created_at).toLocaleDateString('zh-CN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无案例数据</p>
            <button
              onClick={triggerFetch}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              抓取第一批案例
            </button>
          </div>
        )}
      </div>
    </div>
  )
}