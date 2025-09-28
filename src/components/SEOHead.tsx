import Head from 'next/head'
import Script from 'next/script'
import { generateBreadcrumbStructuredData } from '@/lib/seo'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  noIndex?: boolean
  ogImage?: string
  structuredData?: Record<string, unknown>
  breadcrumbItems?: { name: string; url: string }[]
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  canonical,
  noIndex = false,
  ogImage = '/og-default.jpg',
  structuredData,
  breadcrumbItems
}: SEOHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'
  const fullTitle = title ? `${title} | Rich Idea Hub` : 'Rich Idea Hub | 副业案例库'

  return (
    <Head>
      {/* Title and meta description */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}

      {/* Robots meta */}
      {noIndex && (
        <meta name="robots" content="noindex, nofollow" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || 'Rich Idea Hub'} />
      {canonical && <meta property="og:url" content={`${siteUrl}${canonical}`} />}
      <meta property="og:site_name" content="Rich Idea Hub" />
      <meta property="og:locale" content="zh_CN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      <meta name="twitter:creator" content="@richideahub" />
      <meta name="twitter:site" content="@richideahub" />

      {/* Additional SEO meta tags */}
      <meta name="author" content="Rich Idea Hub" />
      <meta name="publisher" content="Rich Idea Hub" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      {/* Theme color for mobile browsers */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />

      {/* Structured Data */}
      {structuredData && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}

      {/* Breadcrumb Structured Data */}
      {breadcrumbItems && (
        <Script
          id="breadcrumb-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbStructuredData(breadcrumbItems))
          }}
        />
      )}

      {/* DNS prefetch for performance */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    </Head>
  )
}