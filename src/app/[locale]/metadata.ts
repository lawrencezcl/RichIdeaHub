import { generateSEOMetadata, generateBreadcrumbStructuredData, generateArticleStructuredData } from '@/lib/seo'
import type { Metadata } from 'next'

// Home page metadata
export function generateHomePageMetadata(locale: string): Metadata {
  const isZh = locale === 'zh'

  return generateSEOMetadata({
    title: isZh
      ? "副业案例库 - AI驱动的赚钱项目聚合平台"
      : "Side Hustle Case Library - AI-Powered Income Projects",
    description: isZh
      ? "汇聚全球优质副业案例，AI智能分析Reddit、ProductHunt、IndieHackers等平台，为您提供可复制的赚钱项目和详细实施步骤。24/7自动更新，涵盖100+真实案例。"
      : "Discover curated side hustle cases with AI-powered analysis from Reddit, ProductHunt, IndieHackers. Get actionable income projects with step-by-step guides. 24/7 updates, 100+ real cases.",
    keywords: isZh
      ? ["副业", "赚钱", "在线收入", "创业", "自由职业", "被动收入", "side hustle", "make money online"]
      : ["side hustle", "make money online", "passive income", "freelance", "startup", "online business"],
    ogType: 'website',
    locale: isZh ? 'zh-CN' : 'en-US',
    alternates: [
      { locale: 'zh-CN', url: '/zh' },
      { locale: 'en-US', url: '/en' }
    ]
  })
}

// Cases page metadata
export function generateCasesPageMetadata(locale: string): Metadata {
  const isZh = locale === 'zh'

  return generateSEOMetadata({
    title: isZh
      ? "副业案例 - 浏览所有赚钱项目"
      : "Side Hustle Cases - Browse All Income Projects",
    description: isZh
      ? "浏览我们的完整副业案例库，按分类、难度、收入水平筛选。AI智能分析的赚钱项目，包含详细实施步骤和所需工具。"
      : "Browse our complete side hustle library with filters for category, difficulty, income level. AI-analyzed income projects with detailed implementation steps.",
    keywords: isZh
      ? ["副业案例", "赚钱项目", "创业点子", "在线赚钱", "被动收入"]
      : ["side hustle cases", "income projects", "business ideas", "online money making"],
    ogType: 'website',
    canonical: `/${locale}/cases`,
    locale: isZh ? 'zh-CN' : 'en-US',
    alternates: [
      { locale: 'zh-CN', url: '/zh/cases' },
      { locale: 'en-US', url: '/en/cases' }
    ]
  })
}

// Case detail page metadata
export function generateCaseDetailMetadata(
  case_: {
    title?: string
    description?: string
    category?: string
    difficulty?: string
    id?: number
    created_at?: string
    author?: string
  },
  locale: string
): Metadata {
  const isZh = locale === 'zh'
  const title = case_?.title || (isZh ? "副业案例详情" : "Case Details")
  const description = case_?.description || (isZh ? "查看详细的副业案例实施步骤" : "View detailed case implementation steps")

  return generateSEOMetadata({
    title: `${title} - ${isZh ? '副业案例' : 'Side Hustle Case'}`,
    description: description,
    keywords: isZh
      ? [case_?.category || "", case_?.difficulty || "", "副业", "赚钱", "案例分析"].filter(Boolean)
      : [case_?.category || "", case_?.difficulty || "", "side hustle", "case study", "income"].filter(Boolean),
    ogType: 'article',
    canonical: `/cases/${case_?.id}`,
    locale: isZh ? 'zh-CN' : 'en-US',
    structuredData: case_ ? generateArticleStructuredData(
      title,
      description,
      `/cases/${case_.id}`,
      case_.created_at || "",
      case_.author || ""
    ) : undefined
  })
}

// Breadcrumb structured data
export function generateCasesBreadcrumbStructuredData(locale: string) {
  const isZh = locale === 'zh'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'

  return generateBreadcrumbStructuredData([
    {
      name: isZh ? "首页" : "Home",
      url: `${baseUrl}/${locale}`
    },
    {
      name: isZh ? "案例库" : "Cases",
      url: `${baseUrl}/${locale}/cases`
    }
  ])
}

export function generateCaseDetailBreadcrumbStructuredData(locale: string, caseId: string, caseTitle: string) {
  const isZh = locale === 'zh'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'

  return generateBreadcrumbStructuredData([
    {
      name: isZh ? "首页" : "Home",
      url: `${baseUrl}/${locale}`
    },
    {
      name: isZh ? "案例库" : "Cases",
      url: `${baseUrl}/${locale}/cases`
    },
    {
      name: caseTitle,
      url: `${baseUrl}/cases/${caseId}`
    }
  ])
}