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
    const { id, published } = body

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
    const { password, action } = body

    if (action === 'login') {
      const correctPassword = process.env.ADMIN_PASSWORD || 'admin123'
      
      if (password === correctPassword) {
        return NextResponse.json({
          success: true,
          token: password, // 简单实现，实际项目应使用JWT
          message: '登录成功'
        })
      } else {
        return NextResponse.json({
          success: false,
          error: '密码错误'
        }, { status: 401 })
      }
    }

    return NextResponse.json({
      success: false,
      error: '不支持的操作'
    }, { status: 400 })

  } catch (error) {
    console.error('认证失败:', error)
    return NextResponse.json({
      success: false,
      error: '认证请求处理失败'
    }, { status: 500 })
  }
}