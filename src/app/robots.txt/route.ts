import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'

  const robotsTxt = `User-agent: *
Allow: /

# 站点地图
Sitemap: ${baseUrl}/sitemap.xml

# 爬取延迟（避免服务器压力）
Crawl-delay: 1

# 禁止访问的路径
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# 主要搜索引擎
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# 特别处理
User-agent: *
Disallow: /*?*
Disallow: /*.json$
Disallow: /*.xml$

# 允许重要的静态资源
Allow: /images/
Allow: /favicon.ico
Allow: /sitemap.xml
`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate'
    }
  })
}