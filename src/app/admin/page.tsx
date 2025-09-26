'use client'

import { useState, useEffect } from 'react'
import { Case } from '@/lib/types'

export default function AdminPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentUser, setCurrentUser] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)

  // 检查认证状态
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const savedUsername = localStorage.getItem('admin_username')
    if (token && savedUsername) { // 简单验证
      setIsAuthenticated(true)
      setCurrentUser(savedUsername)
      loadCases()
    }
  }, [])

  // 登录
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert('请输入用户名和密码')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, password })
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem('admin_token', result.token)
        localStorage.setItem('admin_username', username)
        setCurrentUser(username)
        setIsAuthenticated(true)
        await loadCases()
      } else {
        alert('用户名或密码错误')
      }
    } catch {
      alert('登录失败，请检查网络连接')
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
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">RI</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
              Rich Idea Hub
            </h1>
            <p className="text-gray-600">管理后台登录</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <form onSubmit={(e) => {
              e.preventDefault()
              handleLogin()
            }} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  用户名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 backdrop-blur-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 backdrop-blur-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !username.trim() || !password.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>登录中...</span>
                  </div>
                ) : (
                  <span>登录管理系统</span>
                )}
              </button>
            </form>

            {/* Default Credentials */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">默认登录信息</h4>
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">用户名:</span> admin<br />
                    <span className="font-medium">密码:</span> admin123
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    💡 生产环境请修改 ADMIN_PASSWORD 环境变量以增强安全性
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                🔒 此系统受密码保护，请妥善保管您的登录凭据
              </p>
            </div>
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
          {currentUser && (
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-500">当前用户: {currentUser}</span>
            </div>
          )}
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
              localStorage.removeItem('admin_username')
              setUsername('')
              setPassword('')
              setIsAuthenticated(false)
            }}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>退出登录</span>
            </div>
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