import { NextResponse } from 'next/server'
import { CaseRepository } from '@/lib/supabase'
import { AIProcessor } from '@/lib/openai'
import { RawCaseData } from '@/lib/types'

// Reddit API响应类型定义
interface RedditPost {
  data: {
    title: string;
    selftext: string;
    permalink: string;
    id: string;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

// Reddit数据抓取服务
class RedditFetcher {
  static async fetchCases(): Promise<RawCaseData[]> {
    try {
      const response = await fetch(
        'https://www.reddit.com/r/sidehustle/hot.json?limit=10',
        {
          headers: {
            'User-Agent': 'SideHustleBot/1.0 (Educational Purpose)'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Reddit API错误: ${response.status}`)
      }

      const data: RedditResponse = await response.json()
      
      if (!data.data?.children) {
        throw new Error('Reddit API返回格式异常')
      }

      const rawCases: RawCaseData[] = data.data.children
        .filter((post: RedditPost) => {
          const selftext = post.data.selftext || ''
          const title = post.data.title || ''
          
          // 过滤条件：内容长度 > 100字符，且包含相关关键词
          return selftext.length > 100 && 
                 (title.toLowerCase().includes('sidehustle') ||
                  title.toLowerCase().includes('side hustle') ||
                  title.toLowerCase().includes('income') ||
                  title.toLowerCase().includes('money') ||
                  selftext.toLowerCase().includes('$'))
        })
        .slice(0, 5) // MVP版本限制处理5条
        .map((post: RedditPost) => ({
          title: post.data.title,
          content: post.data.selftext,
          url: `https://reddit.com${post.data.permalink}`,
          source_id: `reddit_${post.data.id}`
        }))

      return rawCases
    } catch (error) {
      console.error('Reddit抓取失败:', error)
      throw new Error('Reddit数据抓取失败')
    }
  }
}

// 数据处理和存储服务
class DataProcessor {
  static async processAndStore(rawCases: RawCaseData[]): Promise<number> {
    let processedCount = 0

    for (const raw of rawCases) {
      try {
        // 检查是否已存在
        const exists = await CaseRepository.caseExists(raw.url)
        if (exists) {
          console.log(`案例已存在，跳过: ${raw.title}`)
          continue
        }

        // AI处理
        console.log(`正在处理案例: ${raw.title}`)
        const processed = await AIProcessor.processContent(raw)

        // 存储到数据库
        await CaseRepository.createCase({
          title: processed.title,
          description: processed.description,
          income: processed.income,
          time_required: processed.time_required,
          tools: processed.tools,
          steps: processed.steps,
          source_url: raw.url,
          raw_content: raw.content,
          published: false // 默认不发布，需要人工审核
        })

        processedCount++
        console.log(`案例处理完成: ${processed.title}`)

        // 添加延迟避免API频率限制
        await new Promise(resolve => setTimeout(resolve, 2000))

      } catch (error) {
        console.error(`处理案例失败: ${raw.title}`, error)
        // 继续处理下一个案例
      }
    }

    return processedCount
  }
}

// API路由处理器
export async function POST() {
  try {
    console.log('开始数据抓取任务...')

    // 1. 抓取原始数据
    const rawCases = await RedditFetcher.fetchCases()
    console.log(`抓取到 ${rawCases.length} 条原始案例`)

    if (rawCases.length === 0) {
      return NextResponse.json({
        success: true,
        message: '未找到符合条件的新案例',
        processed: 0
      })
    }

    // 2. AI处理并存储
    const processedCount = await DataProcessor.processAndStore(rawCases)

    console.log(`数据抓取任务完成，成功处理 ${processedCount} 条案例`)

    return NextResponse.json({
      success: true,
      message: `成功处理 ${processedCount} 条新案例`,
      processed: processedCount,
      total_fetched: rawCases.length
    })

  } catch (error) {
    console.error('数据抓取任务失败:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

// GET方法用于健康检查
export async function GET() {
  return NextResponse.json({
    success: true,
    message: '数据抓取API正常运行',
    endpoint: '/api/fetch',
    method: 'POST'
  })
}