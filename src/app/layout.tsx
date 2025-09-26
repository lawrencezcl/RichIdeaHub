import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rich Idea Hub | 副业案例库",
  description: "汇聚全球优质副业案例，为您提供可复制的赚钱项目和详细实施步骤。AI智能处理多平台内容，助您发现适合的副业机会。",
  keywords: "副业,sidehustle,被动收入,赚钱项目,在线赚钱,创业项目,AI,自动化",
  openGraph: {
    title: "Rich Idea Hub | 副业案例库",
    description: "AI驱动的副业案例聚合平台，智能分析多平台内容",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-white via-blue-50 to-indigo-50 min-h-screen`}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="flex items-center">
                  <Link href="/cases" className="flex items-center space-x-3">
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
                    href="/cases"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                  >
                    案例库
                  </Link>
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                  >
                    管理
                  </Link>
                </nav>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button className="text-gray-400 hover:text-gray-500">
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
            {children}
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
                      <Link href="/cases" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                        案例库
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
                <p className="text-center text-gray-500 text-sm">
                  © 2024 Rich Idea Hub. Powered by AI & Next.js
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
