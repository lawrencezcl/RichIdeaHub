import { Metadata } from 'next'
import { generateAdminPageMetadata } from '@/lib/page-metadata'

export const metadata: Metadata = generateAdminPageMetadata()

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}