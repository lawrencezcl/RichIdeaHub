import { MetadataRoute } from 'next'
import { CaseRepository } from './supabase'

// Base URL for the site
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'

// Static pages that should always be in sitemap
const staticPages = [
  { url: '', priority: 1.0, changefreq: 'daily' as const },
  { url: '/zh', priority: 1.0, changefreq: 'daily' as const },
  { url: '/en', priority: 0.9, changefreq: 'daily' as const },
  { url: '/zh/cases', priority: 0.9, changefreq: 'daily' as const },
  { url: '/en/cases', priority: 0.8, changefreq: 'daily' as const },
  { url: '/favorites', priority: 0.7, changefreq: 'weekly' as const },
]

// Dynamic pages (cases) that will be fetched from database
async function getCasePages(): Promise<Array<{ url: string; priority: number; changefreq: string }>> {
  try {
    // Fetch published cases from the database
    const response = await fetch(`${BASE_URL}/api/cases?limit=1000&published=true`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error('Failed to fetch cases for sitemap')
      return []
    }

    const data = await response.json()

    if (!data.success) {
      console.error('API returned error for sitemap cases')
      return []
    }

    const cases = data.data || []

    return cases.map((case_: { id: number }) => ({
      url: `/cases/${case_.id}`,
      priority: 0.6,
      changefreq: 'weekly'
    }))
  } catch (error) {
    console.error('Error generating sitemap case pages:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Generate static URLs
  const staticUrls = staticPages.map(page => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changefreq,
    priority: page.priority,
  }))

  // Generate dynamic case URLs
  const casePages = await getCasePages()
  const caseUrls = casePages.map(page => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changefreq as 'daily' | 'weekly' | 'monthly' | 'yearly' | 'always' | 'never',
    priority: page.priority,
  }))

  // Combine all URLs
  const allUrls = [...staticUrls, ...caseUrls]

  console.log(`Generated sitemap with ${allUrls.length} URLs`)
  return allUrls
}

// Generate robots.txt content
export function generateRobotsTxt(): string {
  return `# Robots.txt for Rich Idea Hub
# SEO optimized robots.txt file

User-agent: *
Allow: /

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml

# Block admin and test pages from indexing
Disallow: /admin/
Disallow: /admin/login
Disallow: /test
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Block search pages with parameters to prevent duplicate content
Disallow: /*?search=*
Disallow: /*?category=*
Disallow: /*?difficulty=*
Disallow: /*?page=*

# Allow specific search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Crawl delay for polite crawling
Crawl-delay: 1

# Allow major social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Block unwanted bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: Baiduspider
Disallow: /

User-agent: Sogou spider
Disallow: /

# Additional security
Disallow: /*.env$
Disallow: /*.env.local$
Disallow: /*.env.development.local$
Disallow: /*.env.test.local$
Disallow: /*.env.production.local$
Disallow: /*.local$

# Performance optimization
Disallow: /*.css$
Disallow: /*.js$
Disallow: /*.json$`
}