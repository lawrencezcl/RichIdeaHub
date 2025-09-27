import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 简单的密码认证 - 生产环境应该使用更安全的方式
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export function middleware(request: NextRequest) {
  // 暂时禁用认证中间件进行测试
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}