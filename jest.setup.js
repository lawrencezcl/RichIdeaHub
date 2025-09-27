import '@testing-library/jest-dom'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => {
    const translations = {
      'homepage.hero.title': 'Global Side Hustle Cases | $3k+/Month, No Experience Needed',
      'homepage.hero.subtitle': '100+ Actionable Cases for Stay-at-Home Moms/Students/9-5ers',
      'homepage.hero.primary_cta': 'Find Your Side Hustle',
      'homepage.hero.secondary_cta': 'View Top Cases',
      'homepage.hero.updated': '2024 Tested & Updated',
      'homepage.case_display.title': 'Top Side Hustles (2024 Tested)',
      'homepage.case_display.filters.all': 'All',
      'homepage.case_display.filters.passive_income': 'Passive Income',
      'homepage.case_display.filters.no_experience': 'No Experience',
      'homepage.case_display.filters.for_moms': 'For Moms',
      'homepage.case_display.filters.for_students': 'For Students',
      'homepage.case_display.view_all': 'View All →',
      'homepage.case_display.card.income': 'Income',
      'homepage.case_display.card.time': 'Time',
      'homepage.case_display.card.skills': 'Skills',
      'homepage.case_display.card.view_details': 'View Details',
      'homepage.trust.title': 'Real User Feedback',
      'homepage.trust.stats.cases': '100+ Real Cases',
      'homepage.trust.stats.users': '5k+ Registered Users',
      'homepage.trust.stats.satisfaction': '98% Positive Reviews',
      'homepage.email_capture.title': 'Get Latest Side Hustle Cases',
      'homepage.email_capture.subtitle': '1 Email/Week with Exclusive Cases & Tips, No Spam',
      'homepage.email_capture.email_placeholder': 'Enter Your Email',
      'homepage.email_capture.subscribe_button': 'Subscribe Now',
      'homepage.email_capture.privacy': 'We Respect Privacy, No Email Sharing',
      'homepage.email_capture.privacy_link': 'Privacy Policy',
      'homepage.email_capture.success': '✓ Subscription Successful',
      'homepage.email_capture.error': 'Please enter a valid email',
    }
    return key.split('.').reduce((obj, k) => obj?.[k], translations) || key
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronLeft: () => React.createElement('div', { 'data-testid': 'chevron-left' }),
  ChevronRight: () => React.createElement('div', { 'data-testid': 'chevron-right' }),
  Star: () => React.createElement('div', { 'data-testid': 'star' }),
  Users: () => React.createElement('div', { 'data-testid': 'users' }),
  TrendingUp: () => React.createElement('div', { 'data-testid': 'trending-up' }),
  Award: () => React.createElement('div', { 'data-testid': 'award' }),
  Mail: () => React.createElement('div', { 'data-testid': 'mail' }),
  CheckCircle: () => React.createElement('div', { 'data-testid': 'check-circle' }),
  AlertCircle: () => React.createElement('div', { 'data-testid': 'alert-circle' }),
  Shield: () => React.createElement('div', { 'data-testid': 'shield' }),
}))

// Mock @/lib/supabase
jest.mock('@/lib/supabase', () => ({
  CaseRepository: {
    getAllCases: jest.fn(() => Promise.resolve([])),
    getCaseById: jest.fn(() => Promise.resolve(null)),
    createCase: jest.fn(() => Promise.resolve({})),
    caseExists: jest.fn(() => Promise.resolve(false)),
  },
}))

// Suppress console errors during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}