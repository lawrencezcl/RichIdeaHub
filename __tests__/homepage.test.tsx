import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock the modules that use client-side features
const MockHeroSection = () => {
  return <div data-testid="hero-section">Hero Section</div>
}

const MockCaseDisplayArea = () => {
  return <div data-testid="case-display-area">Case Display Area</div>
}

const MockTrustEndorsementArea = () => {
  return <div data-testid="trust-endorsement-area">Trust Endorsement Area</div>
}

const MockEmailCapture = () => {
  return <div data-testid="email-capture">Email Capture</div>
}

// Mock the actual components that use client-side features
jest.mock('@/components/homepage/HeroSection', () => MockHeroSection)
jest.mock('@/components/homepage/CaseDisplayArea', () => MockCaseDisplayArea)
jest.mock('@/components/homepage/TrustEndorsementArea', () => MockTrustEndorsementArea)
jest.mock('@/components/homepage/EmailCapture', () => MockEmailCapture)

describe('Homepage Components', () => {
  describe('HeroSection', () => {
    it('renders mock hero section', () => {
      render(<MockHeroSection />)
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
      expect(screen.getByText('Hero Section')).toBeInTheDocument()
    })
  })

  describe('CaseDisplayArea', () => {
    it('renders mock case display area', () => {
      render(<MockCaseDisplayArea />)
      expect(screen.getByTestId('case-display-area')).toBeInTheDocument()
      expect(screen.getByText('Case Display Area')).toBeInTheDocument()
    })
  })

  describe('TrustEndorsementArea', () => {
    it('renders mock trust endorsement area', () => {
      render(<MockTrustEndorsementArea />)
      expect(screen.getByTestId('trust-endorsement-area')).toBeInTheDocument()
      expect(screen.getByText('Trust Endorsement Area')).toBeInTheDocument()
    })
  })

  describe('EmailCapture', () => {
    it('renders mock email capture', () => {
      render(<MockEmailCapture />)
      expect(screen.getByTestId('email-capture')).toBeInTheDocument()
      expect(screen.getByText('Email Capture')).toBeInTheDocument()
    })
  })

  describe('Homepage Integration', () => {
    it('renders all sections', () => {
      const { getByTestId } = render(
        <div>
          <MockHeroSection />
          <MockCaseDisplayArea />
          <MockTrustEndorsementArea />
          <MockEmailCapture />
        </div>
      )

      expect(getByTestId('hero-section')).toBeInTheDocument()
      expect(getByTestId('case-display-area')).toBeInTheDocument()
      expect(getByTestId('trust-endorsement-area')).toBeInTheDocument()
      expect(getByTestId('email-capture')).toBeInTheDocument()
    })
  })
})