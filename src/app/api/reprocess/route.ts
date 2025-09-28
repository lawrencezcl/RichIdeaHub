import { NextResponse } from 'next/server'
import { CaseRepository } from '@/lib/supabase'
import AIProcessor from '@/lib/openai'

export async function POST() {
  try {
    console.log('🔄 开始重新处理现有案例数据...')

    // 获取所有现有案例
    const { cases } = await CaseRepository.getAllCasesWithFilters(undefined, undefined, undefined, undefined, 10000, 0)

    if (!cases || cases.length === 0) {
      return NextResponse.json({
        success: false,
        error: '没有找到需要重新处理的案例'
      }, { status: 404 })
    }

    console.log(`找到 ${cases.length} 个案例需要重新处理`)

    let processedCount = 0
    let updatedCount = 0
    const errors: string[] = []

    // 批量处理案例
    for (let i = 0; i < cases.length; i += 5) {
      const batch = cases.slice(i, i + 5)

      for (const case_ of batch) {
        try {
          processedCount++

          // 构造原始数据结构用于重新处理
          const rawData = {
            source_id: case_.id.toString(),
            title: case_.title,
            content: case_.raw_content,
            url: case_.source_url,
            author: case_.author || 'unknown',
            score: case_.upvotes || 0,
            source: case_.source_type || 'reddit'
          }

          console.log(`正在处理案例 ${processedCount}/${cases.length}: ${case_.title.slice(0, 50)}...`)

          // 使用增强的AI处理器重新处理数据
          const processedData = await AIProcessor.processContent(rawData)

          // 更新案例数据
          await CaseRepository.updateCaseData(case_.id, {
            income: processedData.income,
            time_required: processedData.time_required,
            tools: processedData.tools,
            steps: processedData.steps,
            category: processedData.category,
            difficulty: processedData.difficulty,
            investment_required: processedData.investment_required,
            skills_needed: processedData.skills_needed,
            target_audience: processedData.target_audience,
            potential_risks: processedData.potential_risks,
            success_rate: processedData.success_rate,
            time_to_profit: processedData.time_to_profit,
            scalability: processedData.scalability,
            location_flexible: processedData.location_flexible,
            age_restriction: processedData.age_restriction,
            revenue_model: processedData.revenue_model,
            competition_level: processedData.competition_level,
            market_trend: processedData.market_trend,
            key_metrics: processedData.key_metrics,
            tags: processedData.tags
          })

          updatedCount++
          console.log(`✅ 成功更新案例 ${case_.id}`)

        } catch (error) {
          const errorMsg = `处理案例 ${case_.id} 失败: ${(error as Error).message}`
          console.error(errorMsg)
          errors.push(errorMsg)
        }
      }

      // 批次间延迟，避免服务器过载
      if (i + 5 < cases.length) {
        console.log('批次完成，等待2秒...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    console.log(`🎉 重新处理完成！`)
    console.log(`- 总计处理: ${processedCount} 个案例`)
    console.log(`- 成功更新: ${updatedCount} 个案例`)
    console.log(`- 失败: ${errors.length} 个案例`)

    if (errors.length > 0) {
      console.log('错误详情:')
      errors.forEach(error => console.log(`  - ${error}`))
    }

    return NextResponse.json({
      success: true,
      message: '案例数据重新处理完成',
      stats: {
        total: processedCount,
        updated: updatedCount,
        failed: errors.length,
        errorRate: errors.length / processedCount
      },
      errors: errors.slice(0, 10) // 只返回前10个错误
    })

  } catch (error) {
    console.error('重新处理案例失败:', error)
    return NextResponse.json({
      success: false,
      error: '重新处理案例失败: ' + (error as Error).message
    }, { status: 500 })
  }
}