import HeroSection from '@/components/homepage/HeroSection'
import CaseDisplayArea from '@/components/homepage/CaseDisplayArea'
import TrustEndorsementArea from '@/components/homepage/TrustEndorsementArea'
import EmailCapture from '@/components/homepage/EmailCapture'
import Script from 'next/script'
import { generateHomePageMetadata, generateCasesBreadcrumbStructuredData } from './metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateHomePageMetadata(locale)
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateCasesBreadcrumbStructuredData(locale))
        }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Case Display Area */}
      <CaseDisplayArea />

      {/* Trust Endorsement Area */}
      <TrustEndorsementArea />

      {/* Email Capture */}
      <EmailCapture />
    </div>
  )
}