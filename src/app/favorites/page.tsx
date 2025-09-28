'use client'

import FavoritesPage from '@/components/FavoritesPage'
import Script from 'next/script'
import { generateFavoritesPageMetadata } from '@/lib/page-metadata'
import { generateBreadcrumbStructuredData } from '@/lib/seo'
import type { Metadata } from 'next'


export default function Favorites() {
  return (
    <>
      {/* Structured Data */}
      <Script
        id="favorites-breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData([
            {
              name: "首页",
              url: "https://localhost:3000/zh"
            },
            {
              name: "收藏夹",
              url: "https://localhost:3000/favorites"
            }
          ]))
        }}
      />
      <FavoritesPage />
    </>
  )
}