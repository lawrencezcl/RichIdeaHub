import Link from "next/link";
import WebVitals from '@/components/WebVitals';
import ErrorBoundary from '@/components/ErrorBoundary';
import GlobalLoading from '@/components/GlobalLoading';

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params in Next.js 15
  const { locale } = await params

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-indigo-50 font-sans antialiased">
      {/* Performance monitoring */}
      <WebVitals />

      {/* Global loading indicator */}
      <GlobalLoading />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href={`/${locale}/cases`} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RI</span>
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Rich Idea Hub
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href={`/${locale}/cases`}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
              >
                案例库
              </Link>
              <Link
                href="/favorites"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
              >
                收藏夹
              </Link>
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
              >
                管理
              </Link>
              {/* Language Switcher */}
              <div className="flex items-center space-x-2">
                <Link
                  href="/zh"
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    locale === 'zh'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  ZH
                </Link>
                <Link
                  href="/en"
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    locale === 'en'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  EN
                </Link>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900 p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RI</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">Rich Idea Hub</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                AI驱动的副业案例聚合平台，智能分析多平台内容，为您提供可复制的赚钱项目和详细实施步骤。
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">快速链接</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}/cases`} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    案例库
                  </Link>
                </li>
                <li>
                  <Link href="/favorites" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    收藏夹
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    管理后台
                  </Link>
                </li>
              </ul>
            </div>

            {/* Data Sources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">数据源</h3>
              <ul className="space-y-2">
                <li className="text-gray-600 text-sm">Reddit</li>
                <li className="text-gray-600 text-sm">ProductHunt</li>
                <li className="text-gray-600 text-sm">IndieHackers</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="center text-gray-500 text-sm">
              © 2024 Rich Idea Hub. Powered by AI & Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}