import { NextResponse, NextRequest } from 'next/server'
import { CaseRepository } from '@/lib/supabase'

// 获取所有案例（管理后台用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search') || undefined
    const sourceType = searchParams.get('sourceType') || undefined
    const status = searchParams.get('status') || undefined
    const category = searchParams.get('category') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    let result
    if (search || sourceType || status || category) {
      // 使用过滤查询
      result = await CaseRepository.getAllCasesWithFilters(search, sourceType, status, category, limit, offset)
    } else {
      // 使用原有查询
      const cases = await CaseRepository.getAllCases(limit, offset)
      result = { cases, total: cases.length }
    }

    // 获取分类列表
    const categories = await CaseRepository.getAllCategories()

    return NextResponse.json({
      success: true,
      data: result.cases,
      total: result.total,
      categories,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    })

  } catch (error) {
    console.error('获取案例列表失败:', error)
    return NextResponse.json({
      success: false,
      error: '获取案例列表失败'
    }, { status: 500 })
  }
}


// 管理操作API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, caseIds } = body

    if (action === 'clear_data') {
      const deletedCount = await CaseRepository.clearAllData()
      return NextResponse.json({
        success: true,
        message: `已清理 ${deletedCount} 条数据`,
        deletedCount
      })
    }

    if (action === 'approve' && Array.isArray(caseIds)) {
      const approvedCount = await CaseRepository.batchUpdatePublishStatus(caseIds, true)
      return NextResponse.json({
        success: true,
        message: `已审批 ${approvedCount} 个案例`,
        approvedCount
      })
    }

    if (action === 'reject' && Array.isArray(caseIds)) {
      const rejectedCount = await CaseRepository.batchUpdatePublishStatus(caseIds, false)
      return NextResponse.json({
        success: true,
        message: `已拒绝 ${rejectedCount} 个案例`,
        rejectedCount
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