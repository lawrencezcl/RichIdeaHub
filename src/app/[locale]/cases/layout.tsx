import { Metadata } from 'next'
import { generateCasesPageMetadata } from '../metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generateCasesPageMetadata(locale)
}

export default function CasesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}