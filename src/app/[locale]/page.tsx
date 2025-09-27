import HeroSection from '@/components/homepage/HeroSection'
import CaseDisplayArea from '@/components/homepage/CaseDisplayArea'
import TrustEndorsementArea from '@/components/homepage/TrustEndorsementArea'
import EmailCapture from '@/components/homepage/EmailCapture'

export default function HomePage() {
  return (
    <div className="min-h-screen">
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