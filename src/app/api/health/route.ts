import { NextResponse } from 'next/server'
import { CaseRepository } from '@/lib/supabase'
import { AIProcessor } from '@/lib/openai'

// 健康检查接口
export async function GET() {
  try {
    const healthChecks = await Promise.allSettled([
      checkDatabase(),
      checkAIConnection(),
      checkSystemInfo()
    ])

    const isHealthy = healthChecks.every(
      result => result.status === 'fulfilled'
    )

    const checks = {
      database: healthChecks[0].status === 'fulfilled' ? healthChecks[0].value : { status: 'error', error: healthChecks[0].reason },
      ai: healthChecks[1].status === 'fulfilled' ? healthChecks[1].value : { status: 'error', error: healthChecks[1].reason },
      system: healthChecks[2].status === 'fulfilled' ? healthChecks[2].value : { status: 'error', error: healthChecks[2].reason }
    }

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks
    }, {
      status: isHealthy ? 200 : 503
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500
    })
  }
}

// 检查数据库连接
async function checkDatabase() {
  try {
    const startTime = Date.now()
    await CaseRepository.getPublishedCases(1, 0)
    const responseTime = Date.now() - startTime

    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      message: 'Database connection successful'
    }
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Database connection failed'
    }
  }
}

// 检查AI连接
async function checkAIConnection() {
  try {
    const startTime = Date.now()
    const isConnected = await AIProcessor.testConnection()
    const responseTime = Date.now() - startTime

    if (isConnected) {
      return {
        status: 'healthy',
        responseTime: `${responseTime}ms`,
        provider: AIProcessor.getCurrentProvider(),
        message: 'AI service connection successful'
      }
    } else {
      return {
        status: 'error',
        error: 'AI service connection failed'
      }
    }
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'AI service check failed'
    }
  }
}

// 检查系统信息
async function checkSystemInfo() {
  try {
    const memoryUsage = process.memoryUsage()
    const uptime = process.uptime()

    return {
      status: 'healthy',
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        memoryUsage: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
        }
      },
      message: 'System information retrieved successfully'
    }
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'System info check failed'
    }
  }
}