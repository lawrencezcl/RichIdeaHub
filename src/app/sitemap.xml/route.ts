import { NextResponse } from 'next/server'
import { CaseRepository } from '@/lib/supabase'

export async function GET() {
  try {
    // 获取所有已发布的案例
    const cases = await CaseRepository.getPublishedCases(1000, 0)

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'

    // 生成sitemap条目
    const sitemapEntries = [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1.0
      },
      {
        url: `${baseUrl}/cases`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.9
      }
    ]

    // 添加案例页面
    cases.forEach(case_ => {
      sitemapEntries.push({
        url: `${baseUrl}/cases/${case_.id}`,
        lastModified: new Date(case_.created_at).toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.8
      })
    })

    // 生成XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate'
      }
    })

  } catch (error) {
    console.error('生成sitemap失败:', error)

    // 返回基础的sitemap
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/cases</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml'
      }
    })
  }
}