export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: 'website' | 'article'
  canonical?: string
  noIndex?: boolean
  locale?: string
  alternates?: { locale: string; url: string }[]
  structuredData?: Record<string, unknown>
}

export function generateSEOMetadata(config: SEOConfig) {
  const {
    title,
    description,
    keywords = [],
    ogImage = '/og-default.jpg',
    ogType = 'website',
    canonical,
    noIndex = false,
    locale = 'zh-CN',
    alternates = [],
    structuredData
  } = config

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'
  const fullTitle = title.includes('Rich Idea Hub') ? title : `${title} | Rich Idea Hub`
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl

  const metadata: any = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Rich Idea Hub' }],
    creator: 'Rich Idea Hub',
    publisher: 'Rich Idea Hub',
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: fullTitle,
      description,
      url: fullCanonical,
      siteName: 'Rich Idea Hub',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`],
    },
    alternates: {
      canonical: fullCanonical,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: {
        'msvalidate.01': process.env.BING_SITE_VERIFICATION,
      },
    },
  }

  // Add hreflang tags if alternates provided
  if (alternates.length > 0) {
    metadata.alternates.languages = alternates.reduce((acc, alt) => {
      acc[alt.locale] = `${siteUrl}${alt.url}`
      return acc
    }, {} as Record<string, string>)
  }

  return metadata
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateWebsiteStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rich Idea Hub',
    description: 'AI驱动的副业案例聚合平台，智能分析多平台内容，为您提供可复制的赚钱项目和详细实施步骤。',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/zh/cases?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rich Idea Hub',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    inLanguage: ['zh-CN', 'en-US'],
  }
}

export function generateOrganizationStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rich Idea Hub',
    description: 'AI驱动的副业案例聚合平台',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
    },
    sameAs: [
      'https://twitter.com/richideahub',
      'https://github.com/lawrencezcl/RichIdeaHub',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Chinese', 'English'],
    },
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN',
    },
  }
}

export function generateArticleStructuredData(title: string, description: string, url: string, datePublished: string, author?: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: `${siteUrl}/og-default.jpg`,
    url: `${siteUrl}${url}`,
    datePublished,
    dateModified: datePublished,
    author: {
      '@type': 'Organization',
      name: author || 'Rich Idea Hub',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rich Idea Hub',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}${url}`,
    },
    inLanguage: 'zh-CN',
  }
}