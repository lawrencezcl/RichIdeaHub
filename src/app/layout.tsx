import './globals.css'
import '../styles/critical.css'
import ClientAnalytics from "@/components/ClientAnalytics"
import type { Metadata } from "next"
import Script from 'next/script'
import { Inter } from "next/font/google"
import { generateSEOMetadata, generateWebsiteStructuredData, generateOrganizationStructuredData } from '@/lib/seo'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = generateSEOMetadata({
  title: "副业案例库 - AI驱动的赚钱项目聚合平台",
  description: "汇聚全球优质副业案例，AI智能分析Reddit、ProductHunt、IndieHackers等平台，为您提供可复制的赚钱项目和详细实施步骤。24/7自动更新，涵盖100+真实案例。",
  keywords: [
    "副业", "赚钱", "在线收入", "创业", "自由职业", "被动收入",
    "side hustle", "make money online", "passive income", "freelance",
    "Reddit", "ProductHunt", "IndieHackers", "案例分析", "项目教程"
  ],
  ogType: 'website',
  locale: 'zh-CN',
  alternates: [
    { locale: 'zh-CN', url: '/zh' },
    { locale: 'en-US', url: '/en' }
  ]
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <Script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteStructuredData())
          }}
        />
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationStructuredData())
          }}
        />
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <ClientAnalytics />
      </body>
    </html>
  )
}
