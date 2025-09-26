import { ProcessedCase, RawCaseData } from './types'

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
    const prompt = `
请将以下副业内容结构化为JSON格式。请严格按照要求返回纯JSON，不要包含任何其他文字。

原始内容：
标题: ${raw.title}
内容: ${raw.content.slice(0, 2000)}

请返回以下格式的JSON（只返回JSON，不要其他内容）：
{
  "title": "简洁的标题（10字以内）",
  "description": "简要描述（50字以内）",
  "income": "收入范围（如：$500-1000/月 或 未知）",
  "time_required": "时间投入（如：5小时/周 或 未知）",
  "tools": "工具列表，逗号分隔（如：Notion,Stripe,Instagram）",
  "steps": "步骤列表，换行分隔（每个步骤简洁明了）"
}

重要规则：
1. 不要编造任何信息，如果原文没有明确提到收入或时间，请填写"未知"
2. 步骤要具体可操作，每个步骤20字以内
3. 工具名称要准确，使用官方名称
4. 只返回JSON格式，不要任何解释文字
`

    try {
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
        console.error('JSON解析失败:', parseError)
        console.error('原始内容:', content)
        
        // 如果解析失败，返回默认结构
        parsedContent = {
          title: raw.title.slice(0, 50),
          description: '需要人工审核的案例',
          income: '未知',
          time_required: '未知',
          tools: '待补充',
          steps: '1. 查看原始内容\n2. 手动整理信息'
        }
      }

      // 验证和清理数据
      return {
        title: this.cleanText(parsedContent.title || raw.title, 50),
        description: this.cleanText(parsedContent.description || '', 100),
        income: this.cleanText(parsedContent.income || '未知', 30),
        time_required: this.cleanText(parsedContent.time_required || '未知', 30),
        tools: this.cleanText(parsedContent.tools || '', 200),
        steps: this.cleanText(parsedContent.steps || '', 500)
      }

    } catch (error) {
      console.error('AI处理失败:', error)
      
      // 返回基础结构化数据
      return {
        title: raw.title.slice(0, 50),
        description: '此案例需要人工审核和处理',
        income: '未知',
        time_required: '未知',
        tools: '待补充',
        steps: '请查看原始内容了解详情'
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
            steps: '请查看原始内容'
          }
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