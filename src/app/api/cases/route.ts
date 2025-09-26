import { NextRequest, NextResponse } from 'next/server'
import { CaseRepository } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const cases = await CaseRepository.getPublishedCases(limit, offset)
    
    return NextResponse.json({
      success: true,
      data: cases,
      total: cases.length,
      limit,
      offset
    })

  } catch (error) {
    console.error('获取案例列表失败:', error)
    return NextResponse.json({
      success: false,
      error: '获取案例列表失败'
    }, { status: 500 })
  }
}