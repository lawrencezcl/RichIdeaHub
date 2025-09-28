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
  private static fallbackMode: boolean = process.env.ENABLE_FALLBACK_MODE === 'true'

  private static getClient(): UniversalAIClient | null {
    if (!this.client) {
      const config = getAIConfig()
      if (!config.apiKey) {
        if (this.fallbackMode) {
          console.log('AI API密钥未配置，使用备用模式处理数据')
          return null
        }
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

    // 检查是否为备用模式
    const client = this.getClient()
    if (!client) {
      console.log(`使用备用模式处理案例: ${raw.title}`)
      return this.generateFallbackData(raw)
    }

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
          description: raw.content || '这是一个来自社区的副业创意分享',
          income: '视情况而定',
          time_required: '灵活安排',
          tools: '请参考原始内容',
          steps: '1. 查看原始链接\n2. 了解具体实施方法\n3. 根据实际情况调整',
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
      return this.generateFallbackData(raw)
    }
  }

  // 生成备用数据（当AI不可用时）- 增强版数据提取
  private static generateFallbackData(raw: RawCaseData): ProcessedCase {
    const fullText = (raw.title + ' ' + raw.content).toLowerCase()
    const content = raw.content || ''

    // 智能分类和难度评估
    const categoryAnalysis = this.analyzeCategory(fullText)
    const difficultyAnalysis = this.analyzeDifficulty(fullText, categoryAnalysis.category)
    const incomeAnalysis = this.extractIncomeInfo(fullText)
    const timeAnalysis = this.extractTimeInfo(fullText)
    const toolsAnalysis = this.extractToolsInfo(fullText)
    const skillsAnalysis = this.extractSkillsInfo(fullText, categoryAnalysis.category)

    // 生成详细步骤
    const steps = this.generateDetailedSteps(raw.title, content, categoryAnalysis.category)

    // 分析目标受众
    const targetAudience = this.analyzeTargetAudience(fullText, categoryAnalysis.category)

    // 评估投资需求
    const investment = this.analyzeInvestment(fullText, categoryAnalysis.category)

    // 分析风险因素
    const risks = this.analyzeRisks(fullText, categoryAnalysis.category)

    // 评估成功率和盈利时间
    const successRate = this.estimateSuccessRate(categoryAnalysis.category, difficultyAnalysis.difficulty, investment)
    const timeToProfit = this.estimateTimeToProfit(categoryAnalysis.category, difficultyAnalysis.difficulty)

    // 分析可扩展性
    const scalability = this.analyzeScalability(categoryAnalysis.category)

    // 收入模式分析
    const revenueModel = this.analyzeRevenueModel(fullText, categoryAnalysis.category)

    // 竞争程度分析
    const competition = this.analyzeCompetition(categoryAnalysis.category)

    // 市场趋势
    const marketTrend = this.analyzeMarketTrend(categoryAnalysis.category)

    // 关键指标
    const keyMetrics = this.generateKeyMetrics(categoryAnalysis.category, revenueModel)

    // 生成标签
    const tags = this.generateTags(categoryAnalysis.category, skillsAnalysis.skills, revenueModel)

    return {
      title: raw.title.slice(0, 50),
      description: this.generateDescription(raw.title, content, categoryAnalysis.category),
      income: incomeAnalysis.income,
      time_required: timeAnalysis.timeRequired,
      tools: toolsAnalysis.tools,
      steps: steps,
      category: categoryAnalysis.category,
      difficulty: difficultyAnalysis.difficulty,
      investment_required: investment.investment,
      skills_needed: skillsAnalysis.skills,
      target_audience: targetAudience.audience,
      potential_risks: risks.risks,
      success_rate: successRate.rate,
      time_to_profit: timeToProfit.time,
      scalability: scalability.scalability,
      location_flexible: this.isLocationFlexible(categoryAnalysis.category),
      age_restriction: this.getAgeRestriction(categoryAnalysis.category),
      revenue_model: revenueModel.model,
      competition_level: competition.level,
      market_trend: marketTrend.trend,
      key_metrics: keyMetrics.metrics,
      tags: tags
    }
  }

  // 智能分类分析
  private static analyzeCategory(text: string): { category: string; confidence: number } {
    const categoryKeywords = {
      '技术开发': ['编程', '开发', 'coding', '软件', 'app', '网站', '前端', '后端', 'python', 'javascript', 'react', 'vue'],
      '电商': ['电商', 'amazon', 'shopify', '淘宝', '拼多多', 'dropshipping', 'fba', '电商'],
      '内容创作': ['写作', 'content', 'blog', '博客', '文章', '文案', '写作', '编辑'],
      '设计': ['设计', 'design', 'ui', 'ux', '图形', 'logo', 'ps', 'figma', 'canva'],
      '营销推广': ['营销', 'marketing', '推广', '广告', 'seo', 'sem', '社交媒体'],
      '教育培训': ['教育', '培训', '教程', '课程', '教学', '在线课程', '知识付费'],
      '咨询服务': ['咨询', '顾问', 'coaching', '专业服务', '指导'],
      '数据服务': ['数据', '分析', 'analytics', '大数据', '调研', '统计'],
      '音频视频': ['音频', '视频', 'podcast', '播客', 'youtube', '剪辑'],
      '手工艺': ['手工', 'diy', '制作', '手工艺', 'craft', 'etsy'],
      '金融服务': ['金融', '投资', '理财', 'trading', '股票', '基金'],
      '健康养生': ['健康', '养生', '健身', '瑜伽', '医疗', '营养'],
      '生活服务': ['家政', '清洁', '维修', '安装', '跑腿', '代办']
    }

    let maxScore = 0
    let bestCategory = '副业'

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (text.includes(keyword) ? 1 : 0)
      }, 0)

      if (score > maxScore) {
        maxScore = score
        bestCategory = category
      }
    }

    return { category: bestCategory, confidence: maxScore }
  }

  // 难度分析
  private static analyzeDifficulty(text: string, category: string): { difficulty: 'beginner' | 'intermediate' | 'advanced'; reasoning: string } {
    const difficultKeywords = ['高级', '专业', 'expert', 'complex', '难度', '挑战']
    const easyKeywords = ['简单', '容易', 'easy', '入门', 'beginner', '基础']

    const difficultCount = difficultKeywords.reduce((acc, keyword) => acc + (text.includes(keyword) ? 1 : 0), 0)
    const easyCount = easyKeywords.reduce((acc, keyword) => acc + (text.includes(keyword) ? 1 : 0), 0)

    // 基于类别调整难度
    const categoryDifficulty = {
      '技术开发': 'intermediate',
      '金融服务': 'advanced',
      '数据服务': 'intermediate',
      '教育培训': 'intermediate',
      '咨询服务': 'advanced',
      '生活服务': 'beginner',
      '手工艺': 'beginner'
    }

    const baseDifficulty = categoryDifficulty[category as keyof typeof categoryDifficulty] || 'beginner'

    if (difficultCount > easyCount && baseDifficulty !== 'beginner') {
      return { difficulty: 'advanced', reasoning: '检测到高级关键词' }
    } else if (easyCount > difficultCount && baseDifficulty !== 'advanced') {
      return { difficulty: 'beginner', reasoning: '检测到简单关键词' }
    }

    return { difficulty: baseDifficulty as 'beginner' | 'intermediate' | 'advanced', reasoning: '基于类别分析' }
  }

  // 收入信息提取
  private static extractIncomeInfo(text: string): { income: string; sources: string[] } {
    const incomePatterns = [
      /\$?(\d+(?:,\d+)*)\s*-\s*\$?(\d+(?:,\d+)*)\s*(?:美元|美金|USD|元)/g,
      /\$?(\d+(?:,\d+)*)\s*(?:美元|美金|USD|元)\s*(?:每月|月|月收入)/g,
      /(\d+(?:,\d+)*)\s*(?:美元|美金|USD|元)\s*(?:每小时|时)/g,
      /收入\s*(?:约|大约|大概)?\s*\$?(\d+(?:,\d+)*)/g
    ]

    let income = '视项目而定'
    const sources: string[] = []

    for (const pattern of incomePatterns) {
      const matches = text.match(pattern)
      if (matches) {
        sources.push(...matches)
        // 使用第一个匹配的收入范围
        income = matches[0]
        break
      }
    }

    // 如果没有具体数字，提供基于类别的估算
    if (income === '视项目而定') {
      const categoryIncome = {
        '技术开发': '$1000-5000/月',
        '电商': '$500-3000/月',
        '内容创作': '$200-1500/月',
        '设计': '$300-2000/月',
        '咨询服务': '$500-4000/月',
        '金融服务': '$1000-10000/月',
        '生活服务': '$300-2000/月'
      }
      income = categoryIncome[text.includes('技术开发') ? '技术开发' : '副业'] || '$500-2000/月'
    }

    return { income, sources }
  }

  // 时间投入分析
  private static extractTimeInfo(text: string): { timeRequired: string; patterns: string[] } {
    const timePatterns = [
      /(\d+)\s*(?:小时|时|hrs?)/g,
      /(\d+)\s*(?:天|日)/g,
      /(\d+)\s*(?:周|星期)/g,
      /每周\s*(\d+)\s*(?:小时|时)/g,
      /每天\s*(\d+)\s*(?:小时|时)/g,
      /全职|兼职/g
    ]

    let timeRequired = '灵活安排'
    const patterns: string[] = []

    for (const pattern of timePatterns) {
      const matches = text.match(pattern)
      if (matches) {
        patterns.push(...matches)
        timeRequired = matches[0]
        break
      }
    }

    return { timeRequired, patterns }
  }

  // 工具信息提取
  private static extractToolsInfo(text: string): { tools: string; extracted: string[] } {
    const toolKeywords = {
      '编程开发': ['python', 'javascript', 'react', 'vue', 'node.js', 'github', 'vs code', 'intellij'],
      '设计创作': ['photoshop', 'figma', 'canva', 'sketch', 'adobe', 'illustrator'],
      '电商运营': ['shopify', 'amazon', 'woocommerce', 'facebook ads', 'google ads'],
      '内容创作': ['wordpress', 'medium', 'substack', 'notion', 'google docs'],
      '数据分析': ['excel', 'google sheets', 'tableau', 'power bi', 'sql', 'python'],
      '视频制作': ['premiere', 'final cut', 'davinci', 'obs', 'canva video'],
      '音频制作': ['audacity', 'adobe audition', 'garageband', 'logic pro'],
      '营销推广': ['mailchimp', 'convertkit', 'hootsuite', 'buffer', 'canva']
    }

    const extracted: string[] = []

    for (const [category, tools] of Object.entries(toolKeywords)) {
      for (const tool of tools) {
        if (text.includes(tool)) {
          extracted.push(tool)
        }
      }
    }

    // 去重并限制数量
    const uniqueTools = [...new Set(extracted)].slice(0, 8)

    let tools = uniqueTools.join(', ')
    if (tools === '') {
      tools = '请参考原始内容获取具体工具信息'
    }

    return { tools, extracted: uniqueTools }
  }

  // 技能需求分析
  private static extractSkillsInfo(text: string, category: string): { skills: string; required: string[] } {
    const skillMap = {
      '技术开发': ['编程基础', '逻辑思维', '算法知识', '数据库', '网络协议'],
      '电商': ['市场分析', '客户服务', '供应链管理', '营销技巧', '数据分析'],
      '内容创作': ['写作能力', '创意思维', '编辑能力', 'SEO知识', '时间管理'],
      '设计': ['设计软件', '审美能力', '创意思维', '用户体验', '品牌理解'],
      '营销推广': ['市场洞察', '数据分析', '文案写作', '社交媒体', '策略规划'],
      '教育培训': ['专业知识', '教学能力', '沟通表达', '课程设计', '学习能力'],
      '咨询服务': ['专业知识', '沟通能力', '问题解决', '行业经验', '分析能力'],
      '数据服务': ['统计分析', '数据处理', '逻辑思维', '报告撰写', '行业知识']
    }

    const baseSkills = skillMap[category as keyof typeof skillMap] || ['学习能力', '执行力', '沟通能力']
    const required = [...baseSkills]

    // 检查文本中提到的具体技能
    const skillKeywords = ['英语', '编程', '设计', '写作', '营销', '分析', '沟通', '管理', '策划', '执行']
    for (const skill of skillKeywords) {
      if (text.includes(skill)) {
        required.push(skill)
      }
    }

    const skills = [...new Set(required)].slice(0, 6).join(', ')

    return { skills, required: [...new Set(required)] }
  }

  // 生成详细步骤
  private static generateDetailedSteps(title: string, content: string, category: string): string {
    const baseSteps = {
      '技术开发': [
        '1. 确定项目需求和技术栈',
        '2. 学习必要的编程语言和框架',
        '3. 搭建开发环境和版本控制',
        '4. 进行核心功能开发',
        '5. 测试和调试程序',
        '6. 部署上线和运维监控'
      ],
      '电商': [
        '1. 选择产品和目标市场',
        '2. 寻找可靠的供应商',
        '3. 建立电商平台或店铺',
        '4. 设置支付和物流系统',
        '5. 制定营销推广策略',
        '6. 优化客户体验和服务'
      ],
      '内容创作': [
        '1. 确定内容领域和目标受众',
        '2. 建立内容发布平台',
        '3. 制定内容创作计划',
        '4. 持续产出高质量内容',
        '5. 优化内容分发渠道',
        '6. 建立读者社区和互动'
      ],
      '设计': [
        '1. 明确设计需求和目标',
        '2. 进行市场调研和竞品分析',
        '3. 制作设计方案和原型',
        '4. 收集反馈和修改优化',
        '5. 完成最终设计和交付',
        '6. 建立设计作品集'
      ]
    }

    const steps = baseSteps[category as keyof typeof baseSteps] || [
      '1. 详细研究项目需求和可行性',
      '2. 制定具体的实施计划',
      '3. 准备必要的资源和工具',
      '4. 按计划执行和监控进度',
      '5. 根据反馈进行调整优化',
      '6. 建立长期的运营机制'
    ]

    return steps.join('\n')
  }

  // 目标受众分析
  private static analyzeTargetAudience(text: string, category: string): { audience: string; segments: string[] } {
    const audienceMap = {
      '技术开发': '企业和个人开发者',
      '电商': '网购消费者和中小企业',
      '内容创作': '特定兴趣领域的读者',
      '设计': '需要设计服务的企业和个人',
      '营销推广': '需要市场推广的企业',
      '教育培训': '有学习需求的学生和职场人士',
      '咨询服务': '需要专业指导的企业和个人',
      '生活服务': '需要便捷服务的本地居民'
    }

    const audience = audienceMap[category as keyof typeof audienceMap] || '大众用户'
    const segments = [audience]

    return { audience, segments }
  }

  // 投资需求分析
  private static analyzeInvestment(text: string, category: string): { investment: string; breakdown: string[] } {
    const investmentMap = {
      '技术开发': '低 ($100-500)',
      '电商': '中 ($500-2000)',
      '内容创作': '低 ($50-200)',
      '设计': '中 ($200-1000)',
      '咨询服务': '低 ($50-300)',
      '金融服务': '高 ($1000-5000)',
      '生活服务': '中 ($300-1500)'
    }

    const investment = investmentMap[category as keyof typeof investmentMap] || '低'
    const breakdown = [investment]

    return { investment, breakdown }
  }

  // 风险因素分析
  private static analyzeRisks(text: string, category: string): { risks: string; factors: string[] } {
    const riskMap = {
      '技术开发': '技术更新快、需求变化大、竞争激烈',
      '电商': '库存风险、物流问题、市场竞争、平台政策变化',
      '内容创作': '创意枯竭、平台算法变化、收入不稳定',
      '设计': '审美趋势变化、客户需求多变、价格竞争',
      '营销推广': '效果不稳定、预算超支、平台规则变化',
      '金融服务': '市场波动风险、监管政策变化、专业门槛高'
    }

    const risks = riskMap[category as keyof typeof riskMap] || '市场竞争、收入不稳定、需要持续学习'
    const factors = [risks]

    return { risks, factors }
  }

  // 成功率评估
  private static estimateSuccessRate(category: string, difficulty: string, investment: { investment: string }): { rate: string; confidence: number } {
    const baseRates = {
      '技术开发': { beginner: '中等', intermediate: '中等', advanced: '高' },
      '电商': { beginner: '中等', intermediate: '中等', advanced: '高' },
      '内容创作': { beginner: '高', intermediate: '中等', advanced: '高' },
      '设计': { beginner: '高', intermediate: '中等', advanced: '高' },
      '生活服务': { beginner: '高', intermediate: '高', advanced: '中等' }
    }

    const rate = baseRates[category as keyof typeof baseRates]?.[difficulty as keyof typeof baseRates[keyof typeof baseRates]] || '中等'

    return { rate, confidence: 0.7 }
  }

  // 盈利时间估算
  private static estimateTimeToProfit(category: string, difficulty: string): { time: string; range: string } {
    const timeMap = {
      '技术开发': { beginner: '3-6个月', intermediate: '2-4个月', advanced: '1-3个月' },
      '电商': { beginner: '4-8个月', intermediate: '2-6个月', advanced: '1-4个月' },
      '内容创作': { beginner: '2-4个月', intermediate: '1-3个月', advanced: '1-2个月' },
      '设计': { beginner: '2-4个月', intermediate: '1-3个月', advanced: '1-2个月' },
      '生活服务': { beginner: '1-2个月', intermediate: '1-2个月', advanced: '0.5-1个月' }
    }

    const time = timeMap[category as keyof typeof timeMap]?.[difficulty as keyof typeof timeMap[keyof typeof timeMap]] || '1-3个月'

    return { time, range: time }
  }

  // 可扩展性分析
  private static analyzeScalability(category: string): { scalability: string; potential: string } {
    const scalabilityMap = {
      '技术开发': '高',
      '电商': '高',
      '内容创作': '高',
      '设计': '中等',
      '咨询服务': '中等',
      '生活服务': '低'
    }

    const scalability = scalabilityMap[category as keyof typeof scalabilityMap] || '中等'
    const potential = scalability === '高' ? '可以快速扩展到更大市场' : scalability === '中等' ? '可以通过系统化提升规模' : '受地域和时间限制'

    return { scalability, potential }
  }

  // 收入模式分析
  private static analyzeRevenueModel(text: string, category: string): { model: string; streams: string[] } {
    const modelMap = {
      '技术开发': '项目制收费、订阅服务',
      '电商': '产品销售、佣金收入',
      '内容创作': '广告收入、付费订阅、赞助',
      '设计': '项目收费、作品授权',
      '咨询服务': '按小时收费、项目打包',
      '生活服务': '服务收费、会员制'
    }

    const model = modelMap[category as keyof typeof modelMap] || '服务收费'
    const streams = [model]

    return { model, streams }
  }

  // 竞争程度分析
  private static analyzeCompetition(category: string): { level: string; intensity: string } {
    const competitionMap = {
      '技术开发': '高',
      '电商': '高',
      '内容创作': '高',
      '设计': '中等',
      '咨询服务': '中等',
      '生活服务': '低'
    }

    const level = competitionMap[category as keyof typeof competitionMap] || '中等'
    const intensity = level === '高' ? '市场竞争激烈，需要差异化优势' : level === '中等' ? '有一定竞争，但有机会' : '竞争相对较小'

    return { level, intensity }
  }

  // 市场趋势分析
  private static analyzeMarketTrend(category: string): { trend: string; outlook: string } {
    const trendMap = {
      '技术开发': '快速增长',
      '电商': '稳定增长',
      '内容创作': '快速增长',
      '设计': '稳定增长',
      '咨询服务': '稳定增长',
      '生活服务': '稳定'
    }

    const trend = trendMap[category as keyof typeof trendMap] || '稳定增长'
    const outlook = trend === '快速增长' ? '市场需求旺盛，发展前景好' : trend === '稳定增长' ? '市场成熟稳定，持续发展' : '基础需求稳定，增长有限'

    return { trend, outlook }
  }

  // 关键指标生成
  private static generateKeyMetrics(category: string, revenueModel: { model: string }): { metrics: string; indicators: string[] } {
    const metricsMap = {
      '技术开发': '项目完成率、客户满意度、技术栈深度',
      '电商': '销售额、转化率、客户留存率、利润率',
      '内容创作': '阅读量、互动率、粉丝增长、收入来源多样化',
      '设计': '项目数量、客户满意度、作品质量、交付时间',
      '咨询服务': '客户数量、服务时长、问题解决率、推荐率',
      '生活服务': '服务次数、客户满意度、响应时间、复购率'
    }

    const metrics = metricsMap[category as keyof typeof metricsMap] || '收入、客户满意度、项目完成率'
    const indicators = [metrics]

    return { metrics, indicators }
  }

  // 标签生成
  private static generateTags(category: string, skills: string[], revenueModel: { model: string }): string[] {
    const baseTags = [category, '副业', '在线赚钱']

    const skillTags = skills.split(', ').slice(0, 2)
    const revenueTags = revenueModel.model.includes('订阅') ? ['订阅制'] :
                       revenueModel.model.includes('产品') ? ['产品销售'] : ['服务收费']

    const allTags = [...baseTags, ...skillTags, ...revenueTags]
    return [...new Set(allTags)].slice(0, 6)
  }

  // 生成描述
  private static generateDescription(title: string, content: string, category: string): string {
    const descriptionMap = {
      '技术开发': '技术驱动的副业项目，利用编程技能开发软件、网站或应用，为企业和个人提供技术解决方案',
      '电商': '基于电商平台的在线销售业务，通过选品、营销和运营实现稳定收入',
      '内容创作': '通过创作高质量内容吸引目标受众，建立个人品牌并实现多元化变现',
      '设计': '提供专业设计服务，包括UI/UX设计、品牌设计、平面设计等创意工作',
      '咨询服务': '基于专业知识和经验为企业或个人提供专业咨询和指导服务',
      '生活服务': '为本地社区提供便捷的生活服务，解决日常生活中的实际需求'
    }

    const baseDescription = descriptionMap[category as keyof typeof descriptionMap] || '一个有潜力的副业项目，通过专业技能和服务创造价值'

    if (content && content.length > 50) {
      return content.slice(0, 100) + '...'
    }

    return baseDescription
  }

  // 判断是否地理位置灵活
  private static isLocationFlexible(category: string): boolean {
    const flexibleCategories = ['技术开发', '内容创作', '设计', '咨询服务', '数据服务']
    return flexibleCategories.includes(category)
  }

  // 获取年龄限制
  private static getAgeRestriction(category: string): string {
    const restrictedCategories = {
      '金融服务': '18岁以上',
      '健康养生': '需相关资质认证'
    }

    return restrictedCategories[category as keyof typeof restrictedCategories] || '无限制'
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
            description: raw.content || '这是一个来自社区的副业创意分享，处理过程中遇到一些问题',
            income: '视情况而定',
            time_required: '灵活安排',
            tools: '请参考原始内容',
            steps: '1. 查看原始链接获取完整信息\n2. 根据个人情况调整方案',
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
      if (!client) {
        console.log('AI客户端未配置，跳过连接测试')
        return false
      }
      await client.chat([{ role: 'user', content: '测试连接' }])
      return true
    } catch (error) {
      console.error('AI连接测试失败:', error)
      return false
    }
  }
}

export default AIProcessor