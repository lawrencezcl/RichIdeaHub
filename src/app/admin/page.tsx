'use client'

import { useState, useEffect } from 'react'
import { Case } from '@/lib/types'

export default function AdminPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)

  // 检查认证状态
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token === 'admin123') { // 简单验证
      setIsAuthenticated(true)
      loadCases()
    }
  }, [])

  // 登录
  const handleLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password })
      })
      
      const result = await response.json()
      
      if (result.success) {
        localStorage.setItem('admin_token', result.token)
        setIsAuthenticated(true)
        await loadCases()
      } else {
        alert('密码错误')
      }
    } catch {
      alert('登录失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载案例列表
  const loadCases = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const result = await response.json()
      if (result.success) {
        setCases(result.data)
      }
    } catch {
      console.error('加载案例失败')
    }
  }

  // 切换发布状态
  const togglePublish = async (id: number, published: boolean) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, published: !published })
      })
      
      const result = await response.json()
      if (result.success) {
        await loadCases()
      } else {
        alert('操作失败')
      }
    } catch {
      alert('操作失败')
    }
  }

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

  // 登录界面
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">管理后台登录</h1>
          
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入管理密码"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>默认密码:</strong> admin123</p>
            <p className="text-xs mt-1">生产环境请修改 ADMIN_PASSWORD 环境变量</p>
          </div>
        </div>
      </div>
    )
  }

  // 管理界面
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 头部 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">案例管理后台</h1>
          <p className="text-gray-600">管理副业案例的发布状态</p>
        </div>
        
        <div className="space-x-4">
          <button
            onClick={triggerFetch}
            disabled={fetchingData}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {fetchingData ? '抓取中...' : '🚀 抓取新案例'}
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem('admin_token')
              setIsAuthenticated(false)
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            退出登录
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">总案例数</h3>
          <p className="text-2xl font-bold text-blue-600">{cases.length}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">已发布</h3>
          <p className="text-2xl font-bold text-green-600">
            {cases.filter(c => c.published).length}
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800">待审核</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {cases.filter(c => !c.published).length}
          </p>
        </div>
      </div>

      {/* 案例列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
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
                  状态
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  创建时间
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50">
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
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      case_.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {case_.published ? '已发布' : '待审核'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(case_.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(case_.id, case_.published)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        case_.published
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {case_.published ? '取消发布' : '发布'}
                    </button>
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