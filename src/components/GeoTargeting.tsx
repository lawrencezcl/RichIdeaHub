'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

interface GeoTargetingProps {
  locale: string
  path: string
}

export default function GeoTargeting({ locale, path }: GeoTargetingProps) {
  const [userCountry, setUserCountry] = useState<string | null>(null)
  const [userLanguage, setUserLanguage] = useState<string | null>(null)

  useEffect(() => {
    // Detect user language from browser
    const browserLang = navigator.language || 'zh-CN'
    setUserLanguage(browserLang)

    // Detect user country (this is a simplified version)
    // In production, you might use a GeoIP service
    const detectCountry = async () => {
      try {
        // You could integrate with a GeoIP service here
        // For now, we'll use a simple heuristic based on language
        if (browserLang.startsWith('zh')) {
          setUserCountry('CN')
        } else if (browserLang.startsWith('en')) {
          setUserCountry('US')
        } else {
          setUserCountry('Other')
        }
      } catch (error) {
        console.error('Error detecting country:', error)
        setUserCountry('Other')
      }
    }

    detectCountry()
  }, [])

  // Generate hreflang tags
  const generateHreflangTags = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'
    const currentPath = path.startsWith('/') ? path : `/${path}`

    const hreflangTags = [
      { hreflang: 'zh-CN', url: `${baseUrl}/zh${currentPath}` },
      { hreflang: 'en-US', url: `${baseUrl}/en${currentPath}` },
      { hreflang: 'zh', url: `${baseUrl}/zh${currentPath}` },
      { hreflang: 'en', url: `${baseUrl}/en${currentPath}` },
      { hreflang: 'x-default', url: `${baseUrl}/zh${currentPath}` }
    ]

    return hreflangTags
  }

  const hreflangTags = generateHreflangTags()

  return (
    <>
      {/* Hreflang tags for multilingual SEO */}
      {hreflangTags.map((tag, index) => (
        <link
          key={index}
          rel="alternate"
          hrefLang={tag.hreflang}
          href={tag.url}
        />
      ))}

      {/* Geo targeting meta tags */}
      {userCountry && (
        <meta name="geo.country" content={userCountry} />
      )}
      {userLanguage && (
        <meta name="geo.language" content={userLanguage} />
      )}

      {/* Structured data for geographic targeting */}
      <Script
        id="geo-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000',
            "name": "Rich Idea Hub",
            "description": "AI驱动的副业案例聚合平台",
            "inLanguage": [locale === 'zh' ? 'zh-CN' : 'en-US'],
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'}/${locale}/cases?search={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
            "publisher": {
              "@type": "Organization",
              "name": "Rich Idea Hub",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "CN"
              },
              "availableLanguage": ["Chinese", "English"]
            },
            "coverage": {
              "@type": "Place",
              "name": userCountry || "Global",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": userCountry || "Global"
              }
            }
          })
        }}
      />

      {/* Optional: Add structured data for different regions */}
      {userCountry === 'CN' && (
        <Script
          id="cn-targeted-content"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "副业案例库",
              "description": "专注于中国用户的副业项目案例",
              "areaServed": "CN",
              "availableLanguage": ["zh-CN", "en-US"],
              "provider": {
                "@type": "Organization",
                "name": "Rich Idea Hub"
              }
            })
          }}
        />
      )}

      {userCountry === 'US' && (
        <Script
          id="us-targeted-content"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Side Hustle Case Library",
              "description": "Curated side hustle cases for US market",
              "areaServed": "US",
              "availableLanguage": ["en-US", "zh-CN"],
              "provider": {
                "@type": "Organization",
                "name": "Rich Idea Hub"
              }
            })
          }}
        />
      )}
    </>
  )
}