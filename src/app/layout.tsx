import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "副业案例库 | 发现成功的副业项目",
  description: "汇聚全球优质副业案例，为您提供可复制的赚钱项目和详细实施步骤。从在线教育到电商，从内容创作到服务外包，找到适合您的副业方向。",
  keywords: "副业,sidehustle,被动收入,赚钱项目,在线赚钱,创业项目",
  openGraph: {
    title: "副业案例库 | 发现成功的副业项目",
    description: "汇聚全球优质副业案例，为您提供可复制的赚钱项目和详细实施步骤",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">
                <Link href="/cases" className="hover:text-blue-600">
                  副业案例库
                </Link>
              </h1>
              <div className="space-x-4">
                <Link href="/cases" className="text-gray-600 hover:text-gray-900">
                  案例库
                </Link>
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  管理
                </Link>
              </div>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 副业案例库. 探索副业机会，实现财务自由.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
