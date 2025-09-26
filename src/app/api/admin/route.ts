import { NextResponse, NextRequest } from 'next/server'
import { CaseRepository } from '@/lib/supabase'

// 获取所有案例（管理后台用）
export async function GET() {
  try {
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


// 管理操作API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

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