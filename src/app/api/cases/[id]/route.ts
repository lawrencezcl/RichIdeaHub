import { NextRequest, NextResponse } from 'next/server'
import { CaseRepository } from '@/lib/supabase'

interface Params {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: '无效的案例ID'
      }, { status: 400 })
    }

    const case_ = await CaseRepository.getCaseById(id)
    
    if (!case_) {
      return NextResponse.json({
        success: false,
        error: '案例不存在'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: case_
    })

  } catch (error) {
    console.error('获取案例详情失败:', error)
    return NextResponse.json({
      success: false,
      error: '获取案例详情失败'
    }, { status: 500 })
  }
}