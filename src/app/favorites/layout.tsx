import { Metadata } from 'next'
import { generateFavoritesPageMetadata } from '@/lib/page-metadata'

export const metadata: Metadata = generateFavoritesPageMetadata()

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}