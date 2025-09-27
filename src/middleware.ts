import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 简单的密码认证 - 生产环境应该使用更安全的方式
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export function middleware(request: NextRequest) {
  // 只检查admin路径
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 检查是否有认证cookie
    const authCookie = request.cookies.get('admin_auth')

    if (!authCookie || authCookie.value !== ADMIN_PASSWORD) {
      // 如果没有认证，重定向到登录页面
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}