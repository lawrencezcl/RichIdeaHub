'use client'

import { useState, useEffect } from 'react'
import { Case } from '@/lib/types'
import Script from 'next/script'
import { generateAdminPageMetadata } from '@/lib/page-metadata'
import { generateBreadcrumbStructuredData } from '@/lib/seo'
import type { Metadata } from 'next'


export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cases, setCases] = useState<Case[]>([])
  const [fetchingData, setFetchingData] = useState(false)
  const [selectedCases, setSelectedCases] = useState<Set<number>>(new Set())
  const [updating, setUpdating] = useState(false)

  // 搜索和过滤状态
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [categories, setCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCases, setTotalCases] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // 检查认证状态
  useEffect(() => {
    const checkAuth = () => {
      const authCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin_auth='))

      if (authCookie && authCookie.split('=')[1] === 'admin123') {
        setIsAuthenticated(true)
      }
    }

    checkAuth()
  }, [])

  
  // 处理登录
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === 'admin123') {
      document.cookie = `admin_auth=admin123; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
      setIsAuthenticated(true)
    } else {
      setError('密码错误')
    }
  }

  // 加载案例列表
  const loadCases = async (page = 1, resetFilters = false) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50'
      })

      if (searchTerm) params.append('search', searchTerm)
      if (sourceFilter !== 'all') params.append('sourceType', sourceFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (categoryFilter !== 'all') params.append('category', categoryFilter)

      const response = await fetch(`/api/admin?${params}`)
      const result = await response.json()
      if (result.success) {
        setCases(result.data)
        setTotalCases(result.total)
        setTotalPages(result.pagination?.totalPages || 1)
        if (result.categories) {
          setCategories(result.categories)
        }
        if (resetFilters) {
          setCurrentPage(1)
        } else {
          setCurrentPage(page)
        }
      }
    } catch (error) {
      console.error('加载案例失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 组件加载时获取案例数据
  useEffect(() => {
    if (isAuthenticated) {
      loadCases()
    }
  }, [isAuthenticated])

  // 搜索词变化时重新加载
  useEffect(() => {
    if (isAuthenticated) {
      const timeoutId = setTimeout(() => {
        loadCases(1, true)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [searchTerm, sourceFilter, statusFilter, categoryFilter])

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

  // 登出
  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; max-age=0'
    setIsAuthenticated(false)
    setSelectedCases(new Set())
  }

  // 如果未认证，显示登录界面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              管理员登录
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              请输入管理员密码
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                登录
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // 已认证，显示管理界面
  return (
    <>
      {/* Structured Data */}
      <Script
        id="admin-breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData([
            {
              name: "首页",
              url: "https://localhost:3000/zh"
            },
            {
              name: "管理后台",
              url: "https://localhost:3000/admin"
            }
          ]))
        }}
      />

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
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            登出
          </button>
        </div>
      </div>

      {/* 搜索和过滤栏 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 搜索框 */}
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              搜索案例
            </label>
            <input
              id="search"
              type="text"
              placeholder="输入标题或描述关键词..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 数据源过滤 */}
          <div>
            <label htmlFor="sourceFilter" className="block text-sm font-medium text-gray-700 mb-1">
              数据源
            </label>
            <select
              id="sourceFilter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="all">全部数据源</option>
              <option value="reddit">Reddit</option>
              <option value="producthunt">ProductHunt</option>
              <option value="indiehackers">IndieHackers</option>
              <option value="other">其他</option>
            </select>
          </div>

          {/* 状态过滤 */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              id="statusFilter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">全部状态</option>
              <option value="published">已发布</option>
              <option value="draft">待审批</option>
            </select>
          </div>

          {/* 分类过滤 */}
          <div>
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <select
              id="categoryFilter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">全部分类</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 过滤状态显示 */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            找到 {totalCases} 个案例
            {(searchTerm || sourceFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSourceFilter('all')
                  setStatusFilter('all')
                  setCategoryFilter('all')
                }}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                清除过滤
              </button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            第 {currentPage} 页，共 {totalPages} 页
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">总案例数</h3>
          <p className="text-2xl font-bold text-blue-600">{totalCases}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">已发布</h3>
          <p className="text-2xl font-bold text-green-600">
            {cases.filter(c => c.published).length}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800">待审批</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {cases.filter(c => !c.published).length}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">数据源</h3>
          <p className="text-2xl font-bold text-purple-600">4+</p>
        </div>
      </div>

      {/* 案例列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading && (
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-gray-600">加载中...</span>
            </div>
          </div>
        )}
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
                  数据源
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
                      case_.source_type === 'reddit' ? 'bg-orange-100 text-orange-800' :
                      case_.source_type === 'producthunt' ? 'bg-purple-100 text-purple-800' :
                      case_.source_type === 'indiehackers' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {case_.source_type === 'reddit' ? 'Reddit' :
                       case_.source_type === 'producthunt' ? 'ProductHunt' :
                       case_.source_type === 'indiehackers' ? 'IndieHackers' :
                       case_.source_type || '未知'}
                    </span>
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

        {/* 分页控制 */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示第 {(currentPage - 1) * 50 + 1} 到 {Math.min(currentPage * 50, totalCases)} 条，共 {totalCases} 条
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => loadCases(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <span className="px-3 py-1 text-sm">
                  第 {currentPage} / {totalPages} 页
                </span>
                <button
                  onClick={() => loadCases(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}