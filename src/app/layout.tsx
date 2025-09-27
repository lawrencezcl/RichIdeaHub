import './globals.css'
import '../styles/critical.css'
import ClientAnalytics from "@/components/ClientAnalytics"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Rich Idea Hub | 副业案例库",
  description: "汇聚全球优质副业案例，为您提供可复制的赚钱项目和详细实施步骤。",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <ClientAnalytics />
      </body>
    </html>
  )
}
