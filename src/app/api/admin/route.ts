import { NextRequest, NextResponse } from 'next/server'
import { CaseRepository } from '@/lib/supabase'

// 简单的密码验证中间件
function verifyPassword(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD || 'admin123'

  if (!authHeader) return false

  const providedPassword = authHeader.replace('Bearer ', '')
  return providedPassword === password
}

// 用户名密码验证
function verifyCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  return username === adminUsername && password === adminPassword
}

// 获取所有案例（管理后台用）
export async function GET(request: NextRequest) {
  try {
    if (!verifyPassword(request)) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      )
    }

    const cases = await CaseRepository.getAllCases()
    
    return NextResponse.json({
      success: true,
      data: cases,
      total: cases.length
    })

  } catch (error) {
    console.error('获取案例列表失败:', error)
    return NextResponse.json({
      success: false,
      error: '获取案例列表失败'
    }, { status: 500 })
  }
}

// 更新案例发布状态
export async function PUT(request: NextRequest) {
  try {
    if (!verifyPassword(request)) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, published, ids } = body

    // 单个案例更新
    if (id !== undefined) {
      if (typeof id !== 'number' || typeof published !== 'boolean') {
        return NextResponse.json({
          success: false,
          error: '参数格式错误'
        }, { status: 400 })
      }

      await CaseRepository.updatePublishStatus(id, published)

      return NextResponse.json({
        success: true,
        message: `案例${published ? '发布' : '取消发布'}成功`
      })
    }

    // 批量案例更新
    if (ids !== undefined && Array.isArray(ids)) {
      if (typeof published !== 'boolean') {
        return NextResponse.json({
          success: false,
          error: '参数格式错误'
        }, { status: 400 })
      }

      const updatedCount = await CaseRepository.batchUpdatePublishStatus(ids, published)

      return NextResponse.json({
        success: true,
        message: `批量${published ? '发布' : '取消发布'}成功`,
        updatedCount
      })
    }

    return NextResponse.json({
      success: false,
      error: '缺少必要参数'
    }, { status: 400 })

  } catch (error) {
    console.error('更新发布状态失败:', error)
    return NextResponse.json({
      success: false,
      error: '更新发布状态失败'
    }, { status: 500 })
  }
}

// 认证API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, password } = body

    // 登录操作
    if (action === 'login') {
      if (!username || !password) {
        return NextResponse.json(
          { success: false, error: '请提供用户名和密码' },
          { status: 400 }
        )
      }

      if (verifyCredentials(username, password)) {
        const token = password // 简单的token，实际生产环境应该使用JWT
        return NextResponse.json({
          success: true,
          message: '登录成功',
          token,
          username
        })
      } else {
        return NextResponse.json(
          { success: false, error: '用户名或密码错误' },
          { status: 401 }
        )
      }
    }

    // 其他需要验证的操作
    if (!verifyPassword(request)) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      )
    }

    if (action === 'clear_data') {
      const deletedCount = await CaseRepository.clearAllData()
      return NextResponse.json({
        success: true,
        message: `已清理 ${deletedCount} 条数据`,
        deletedCount
      })
    }

    return NextResponse.json({
      success: false,
      error: '不支持的操作'
    }, { status: 400 })

  } catch (error) {
    console.error('操作失败:', error)
    return NextResponse.json({
      success: false,
      error: '操作请求处理失败'
    }, { status: 500 })
  }
}