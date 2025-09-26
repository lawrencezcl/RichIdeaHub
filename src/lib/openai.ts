import { ProcessedCase, RawCaseData } from './types'
import Logger from './logger'

// 支持多个AI提供商
type AIProvider = 'openai' | 'deepseek' | 'doubao' | 'qwen'

interface AIConfig {
  provider: AIProvider
  apiKey: string
  baseURL?: string
  model: string
}

// 获取AI配置
function getAIConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER || 'deepseek') as AIProvider
  
  const configs: Record<AIProvider, AIConfig> = {
    openai: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY || '',
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-3.5-turbo'
    },
    deepseek: {
      provider: 'deepseek',
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      baseURL: 'https://api.deepseek.com/v1',
      model: 'deepseek-chat'
    },
    doubao: {
      provider: 'doubao',
      apiKey: process.env.DOUBAO_API_KEY || '',
      baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
      model: 'doubao-lite-4k'
    },
    qwen: {
      provider: 'qwen',
      apiKey: process.env.QWEN_API_KEY || '',
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      model: 'qwen-turbo'
    }
  }
  
  return configs[provider]
}

// 通用AI调用客户端
class UniversalAIClient {
  private config: AIConfig
  
  constructor(config: AIConfig) {
    this.config = config
  }
  
  async chat(messages: Array<{role: string, content: string}>): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: 0.3,
          max_tokens: 800
        })
      })
      
      if (!response.ok) {
        throw new Error(`AI API调用失败: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      return data.choices?.[0]?.message?.content || ''
    } catch (error) {
      console.error(`${this.config.provider} API调用失败:`, error)
      throw new Error(`${this.config.provider} API调用失败`)
    }
  }
}

export class AIProcessor {
  private static client: UniversalAIClient
  
  private static getClient(): UniversalAIClient {
    if (!this.client) {
      const config = getAIConfig()
      if (!config.apiKey) {
        throw new Error(`未配置 ${config.provider} API密钥`)
      }
      this.client = new UniversalAIClient(config)
    }
    return this.client
  }
  
  static async processContent(raw: RawCaseData): Promise<ProcessedCase> {
    const correlationId = `ai_process_${raw.source_id}_${Date.now()}`
    Logger.logAIProcessing('start', {
      sourceId: raw.source_id,
      titleLength: raw.title.length,
      contentLength: raw.content.length
    })

    const prompt = `
请将以下副业内容智能结构化为详细的JSON格式。基于原文内容进行分析和推理，提供尽可能完整的信息。

原始内容：
标题: ${raw.title}
内容: ${raw.content.slice(0, 3000)}

请返回以下格式的JSON（只返回JSON，不要任何其他文字）：
{
  "title": "简洁标题（15字以内）",
  "description": "详细描述（100字以内）",
  "income": "收入范围（如：$500-2000/月）",
  "time_required": "时间投入（如：10-20小时/周）",
  "tools": "工具列表，逗号分隔",
  "steps": "实施步骤，换行分隔",
  "category": "分类（如：电商、服务、数字产品等）",
  "difficulty": "难度等级（beginner/intermediate/advanced）",
  "investment_required": "投资需求（如：低、中、高或具体金额）",
  "skills_needed": "所需技能，逗号分隔",
  "target_audience": "目标用户群体",
  "potential_risks": "潜在风险和挑战",
  "success_rate": "成功率估计（如：高、中等、低）",
  "time_to_profit": "盈利时间（如：1-3个月）",
  "scalability": "可扩展性（如：低、中等、高）",
  "location_flexible": true/false,
  "age_restriction": "年龄限制或要求",
  "revenue_model": "收入模式（如：服务收费、产品销售、订阅等）",
  "competition_level": "竞争程度（低、中等、高）",
  "market_trend": "市场趋势（如：增长、稳定、下降）",
  "key_metrics": "关键成功指标",
  "tags": ["标签1", "标签2", "标签3"]
}

分析原则：
1. 基于原文内容进行智能推理，如果原文没有明确信息，根据上下文合理推断
2. 收入和时间投入要根据内容线索合理估计
3. 难度等级根据所需技能和投资综合判断
4. 目标用户和风险因素要基于内容特点分析
5. 只返回JSON格式，不要任何解释文字
6. 所有字段都要填写，不要留空
`

    try {
      const timer = Logger.timer('ai_content_processing', { sourceId: raw.source_id }, correlationId)
      const client = this.getClient()

      const response = await client.chat([
        { role: 'user', content: prompt }
      ])

      const content = response.trim()
      if (!content) {
        throw new Error('AI返回空内容')
      }

      // 尝试解析JSON
      let parsedContent: ProcessedCase
      try {
        // 清理可能的markdown格式
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
        parsedContent = JSON.parse(cleanContent)
      } catch (parseError) {
        Logger.error('ai_json_parse_failed', parseError as Error, {
          sourceId: raw.source_id,
          rawContent: content.slice(0, 200)
        }, correlationId)

        // 如果解析失败，返回默认结构
        parsedContent = {
          title: raw.title.slice(0, 50),
          description: '需要人工审核的案例',
          income: '未知',
          time_required: '未知',
          tools: '待补充',
          steps: '1. 查看原始内容\n2. 手动整理信息',
          category: '副业',
          difficulty: 'beginner',
          investment_required: '低',
          skills_needed: '基础技能',
          target_audience: '大众用户',
          potential_risks: '市场竞争',
          success_rate: '中等',
          time_to_profit: '1-3个月',
          scalability: '中等',
          location_flexible: true,
          age_restriction: '无限制',
          revenue_model: '服务收费',
          competition_level: '中等',
          market_trend: '稳定增长',
          key_metrics: '收入、客户满意度',
          tags: ['副业', '在线赚钱']
        }
      }

      // 验证和清理数据
      const result = {
        title: this.cleanText(parsedContent.title || raw.title, 50),
        description: this.cleanText(parsedContent.description || '', 100),
        income: this.cleanText(parsedContent.income || '未知', 30),
        time_required: this.cleanText(parsedContent.time_required || '未知', 30),
        tools: this.cleanText(parsedContent.tools || '', 200),
        steps: this.cleanText(parsedContent.steps || '', 500),
        category: this.cleanText(parsedContent.category || '副业', 20),
        difficulty: parsedContent.difficulty || 'beginner',
        investment_required: this.cleanText(parsedContent.investment_required || '低', 20),
        skills_needed: this.cleanText(parsedContent.skills_needed || '基础技能', 100),
        target_audience: this.cleanText(parsedContent.target_audience || '大众用户', 50),
        potential_risks: this.cleanText(parsedContent.potential_risks || '市场竞争', 100),
        success_rate: this.cleanText(parsedContent.success_rate || '中等', 20),
        time_to_profit: this.cleanText(parsedContent.time_to_profit || '1-3个月', 20),
        scalability: this.cleanText(parsedContent.scalability || '中等', 20),
        location_flexible: parsedContent.location_flexible ?? true,
        age_restriction: this.cleanText(parsedContent.age_restriction || '无限制', 20),
        revenue_model: this.cleanText(parsedContent.revenue_model || '服务收费', 30),
        competition_level: this.cleanText(parsedContent.competition_level || '中等', 20),
        market_trend: this.cleanText(parsedContent.market_trend || '稳定增长', 20),
        key_metrics: this.cleanText(parsedContent.key_metrics || '收入、客户满意度', 50),
        tags: parsedContent.tags || ['副业', '在线赚钱']
      }

      const duration = timer.stop({ category: result.category, difficulty: result.difficulty })
      Logger.logAIProcessing('success', {
        sourceId: raw.source_id,
        duration,
        category: result.category
      })

      return result

    } catch (error) {
      Logger.error('ai_processing_failed', error as Error, {
        sourceId: raw.source_id,
        title: raw.title.slice(0, 50)
      }, correlationId)

      // 返回基础结构化数据
      return {
        title: raw.title.slice(0, 50),
        description: '此案例需要人工审核和处理',
        income: '未知',
        time_required: '未知',
        tools: '待补充',
        steps: '请查看原始内容了解详情',
        category: '副业',
        difficulty: 'beginner',
        investment_required: '低',
        skills_needed: '基础技能',
        target_audience: '大众用户',
        potential_risks: '市场竞争',
        success_rate: '中等',
        time_to_profit: '1-3个月',
        scalability: '中等',
        location_flexible: true,
        age_restriction: '无限制',
        revenue_model: '服务收费',
        competition_level: '中等',
        market_trend: '稳定增长',
        key_metrics: '收入、客户满意度',
        tags: ['副业', '在线赚钱']
      }
    }
  }

  // 清理和验证文本内容
  private static cleanText(text: string, maxLength: number): string {
    if (!text) return ''
    
    return text
      .trim()
      .slice(0, maxLength)
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
  }

  // 批量处理多个案例
  static async processBatch(rawCases: RawCaseData[]): Promise<ProcessedCase[]> {
    const results: ProcessedCase[] = []
    
    // 控制并发数量，避免API限制
    const batchSize = 3
    for (let i = 0; i < rawCases.length; i += batchSize) {
      const batch = rawCases.slice(i, i + batchSize)
      
      const batchPromises = batch.map(raw => 
        this.processContent(raw).catch(error => {
          console.error(`处理案例失败: ${raw.title}`, error)
          return {
            title: raw.title.slice(0, 50),
            description: '处理失败，需要人工审核',
            income: '未知',
            time_required: '未知',
            tools: '待补充',
            steps: '请查看原始内容',
            category: '副业',
            difficulty: 'beginner' as const,
            investment_required: '低',
            skills_needed: '基础技能',
            target_audience: '大众用户',
            potential_risks: '市场竞争',
            success_rate: '中等',
            time_to_profit: '1-3个月',
            scalability: '中等',
            location_flexible: true,
            age_restriction: '无限制',
            revenue_model: '服务收费',
            competition_level: '中等',
            market_trend: '稳定增长',
            key_metrics: '收入、客户满意度',
            tags: ['副业', '在线赚钱']
          } as ProcessedCase
        })
      )
      
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
      
      // 批次间延迟，避免API频率限制
      if (i + batchSize < rawCases.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    return results
  }
  
  // 获取当前使用的AI提供商
  static getCurrentProvider(): string {
    return getAIConfig().provider
  }
  
  // 测试AI连接
  static async testConnection(): Promise<boolean> {
    try {
      const client = this.getClient()
      await client.chat([{ role: 'user', content: '测试连接' }])
      return true
    } catch (error) {
      console.error('AI连接测试失败:', error)
      return false
    }
  }
}

export default AIProcessor