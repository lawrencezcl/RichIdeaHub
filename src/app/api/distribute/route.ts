import { Case } from '@/lib/types'

// 简单的密码验证中间件
function verifyPassword(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD || 'admin123'

  if (!authHeader) return false

  const providedPassword = authHeader.replace('Bearer ', '')
  return providedPassword === password
}

// 生成 Telegram 消息格式
function generateTelegramMessage(caseData: Case): string {
  return `💼 *${caseData.title}*

${caseData.description}

💰 *收入水平*: ${caseData.income}
⏰ *时间投入*: ${caseData.time_required}

🔗 [查看完整案例](${caseData.source_url || '#'})

#副业 #赚钱 #创业 #sidehustle`
}

// 生成 Twitter 消息格式
function generateTwitterMessage(caseData: Case): string {
  // Twitter 有字符限制，需要简洁
  const hashtags = ['#副业', '#创业', '#赚钱', '#sidehustle'].join(' ')
  const maxContentLength = 280 - hashtags.length - 20 // 留出链接空间

  let content = `${caseData.title} 💰${caseData.income} ⏰${caseData.time_required}`

  if (content.length > maxContentLength) {
    content = content.substring(0, maxContentLength - 3) + '...'
  }

  return `${content}

${hashtags}

${caseData.source_url || '#'}`
}

// 模拟发送到 Telegram
async function sendToTelegram(message: string): Promise<boolean> {
  try {
    // 这里应该集成 Telegram Bot API
    // 目前返回模拟成功
    console.log('Telegram Message:', message)

    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    return true
  } catch (error) {
    console.error('发送到 Telegram 失败:', error)
    return false
  }
}

// 模拟发送到 Twitter
async function sendToTwitter(message: string): Promise<boolean> {
  try {
    // 这里应该集成 Twitter API
    // 目前返回模拟成功
    console.log('Twitter Message:', message)

    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    return true
  } catch (error) {
    console.error('发送到 Twitter 失败:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyPassword(request)) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, platform } = body

    if (typeof id !== 'number' || !['telegram', 'twitter'].includes(platform)) {
      return NextResponse.json({
        success: false,
        error: '参数格式错误'
      }, { status: 400 })
    }

    // 获取案例详情
    const caseData = await CaseRepository.getCaseById(id)

    if (!caseData) {
      return NextResponse.json({
        success: false,
        error: '案例不存在'
      }, { status: 404 })
    }

    if (!caseData.published) {
      return NextResponse.json({
        success: false,
        error: '只能分发已发布的案例'
      }, { status: 400 })
    }

    let message: string
    let success: boolean

    if (platform === 'telegram') {
      message = generateTelegramMessage(caseData)
      success = await sendToTelegram(message)
    } else if (platform === 'twitter') {
      message = generateTwitterMessage(caseData)
      success = await sendToTwitter(message)
    } else {
      return NextResponse.json({
        success: false,
        error: '不支持的平台'
      }, { status: 400 })
    }

    if (success) {
      // 记录分发历史（可选：可以创建一个分发记录表）
      console.log(`成功分发案例 ${id} 到 ${platform}`)

      return NextResponse.json({
        success: true,
        message: `成功分发到 ${platform === 'telegram' ? 'Telegram' : 'Twitter'}`,
        platform,
        caseId: id
      })
    } else {
      return NextResponse.json({
        success: false,
        error: `分发到 ${platform} 失败`
      }, { status: 500 })
    }

  } catch (error) {
    console.error('分发失败:', error)
    return NextResponse.json({
      success: false,
      error: '分发请求处理失败'
    }, { status: 500 })
  }
}