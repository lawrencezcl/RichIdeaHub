import { MetadataRoute } from 'next'
import sitemapGenerator from './src/lib/sitemap'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return await sitemapGenerator()
}