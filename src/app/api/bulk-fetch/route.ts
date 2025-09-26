import { NextResponse } from 'next/server'
import { DataManager } from '@/app/api/fetch/route'

export async function POST() {
  try {
    console.log('🚀 开始批量数据收集任务，目标300个案例...')

    const rawCases = await DataManager.fetchFromAllSources()

    if (rawCases.length === 0) {
      return NextResponse.json({
        success: false,
        message: '未能获取到任何案例数据',
        processed: 0
      })
    }

    return NextResponse.json({
      success: true,
      message: `成功获取 ${rawCases.length} 条原始案例数据`,
      fetched: rawCases.length,
      sources: {
        reddit: rawCases.filter(c => c.source_id.startsWith('reddit_')).length,
        producthunt: rawCases.filter(c => c.source_id.startsWith('producthunt_')).length,
        indiehackers: rawCases.filter(c => c.source_id.startsWith('indiehackers_')).length
      }
    })

  } catch (error) {
    console.error('批量数据收集失败:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}