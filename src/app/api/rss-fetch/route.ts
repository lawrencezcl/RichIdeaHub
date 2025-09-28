import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Database connection for Vercel environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_w9QEDSlLkyT3@ep-jolly-hill-adhlaq48-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
})

// RSS Parser
class RSSParser {
  static async parseFeed(feedUrl: string): Promise<any> {
    try {
      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'RichIdeaHub/1.0 (Educational Research Project)'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const text = await response.text()

      // Simple RSS/Atom parsing (basic implementation)
      const items = this.parseRSSContent(text)
      return { items }
    } catch (error) {
      console.error(`RSS parsing failed for ${feedUrl}:`, error)
      return { items: [] }
    }
  }

  private static parseRSSContent(content: string): any[] {
    const items: any[] = []

    // Extract items from RSS content
    const itemMatches = content.match(/<item[^>]*>([\s\S]*?)<\/item>/gi) || []

    for (const itemMatch of itemMatches) {
      const titleMatch = itemMatch.match(/<title[^>]*>([^<]*)<\/title>/i)
      const descriptionMatch = itemMatch.match(/<description[^>]*>([^<]*)<\/description>/i)
      const linkMatch = itemMatch.match(/<link[^>]*>([^<]*)<\/link>/i)
      const pubDateMatch = itemMatch.match(/<pubDate[^>]*>([^<]*)<\/pubDate>/i)
      const authorMatch = itemMatch.match(/<author[^>]*>([^<]*)<\/author>/i) ||
                         itemMatch.match(/<dc:creator[^>]*>([^<]*)<\/dc:creator>/i)

      const title = titleMatch ? this.decodeHTML(titleMatch[1]) : ''
      const description = descriptionMatch ? this.decodeHTML(descriptionMatch[1]) : ''
      const link = linkMatch ? this.decodeHTML(linkMatch[1]) : ''
      const pubDate = pubDateMatch ? pubDateMatch[1] : new Date().toISOString()
      const author = authorMatch ? this.decodeHTML(authorMatch[1]) : ''

      if (title && description && link) {
        items.push({
          title,
          content: description,
          link,
          pubDate,
          author,
          categories: this.extractCategories(itemMatch)
        })
      }
    }

    return items
  }

  private static decodeHTML(html: string): string {
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  }

  private static extractCategories(itemContent: string): string[] {
    const categoryMatches = itemContent.match(/<category[^>]*>([^<]*)<\/category>/gi) || []
    return categoryMatches.map(match => {
      const categoryMatch = match.match(/<category[^>]*>([^<]*)<\/category>/i)
      return categoryMatch ? this.decodeHTML(categoryMatch[1]) : ''
    }).filter(cat => cat.length > 0)
  }
}

// RSS Feed Configuration
const RSS_FEEDS = [
  // Global Business
  {
    name: "Entrepreneur.com",
    url: "https://www.entrepreneur.com/latest.rss",
    category: "business",
    language: "en"
  },
  {
    name: "Fast Company",
    url: "https://www.fastcompany.com/rss",
    category: "business",
    language: "en"
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "tech",
    language: "en"
  },

  // Side Hustles
  {
    name: "Side Hustle Nation",
    url: "https://sidehustlenation.com/feed/",
    category: "side-hustle",
    language: "en"
  },
  {
    name: "Smart Passive Income",
    url: "https://www.smartpassiveincome.com/feed/",
    category: "passive-income",
    language: "en"
  },

  // Digital Business
  {
    name: "Neil Patel",
    url: "https://neilpatel.com/feed/",
    category: "marketing",
    language: "en"
  },
  {
    name: "Copyblogger",
    url: "https://copyblogger.com/feed/",
    category: "content",
    language: "en"
  },

  // Tech Startups
  {
    name: "Hacker News",
    url: "https://hnrss.org/frontpage",
    category: "tech",
    language: "en"
  },
  {
    name: "Product Hunt",
    url: "https://feeds.feedburner.com/producthunt",
    category: "products",
    language: "en"
  }
]

// RSS Data Collector
class RSSDataCollector {
  static async getCaseCount(): Promise<number> {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT COUNT(*) as count FROM cases')
      return parseInt(result.rows[0].count)
    } finally {
      client.release()
    }
  }

  static async insertCase(caseData: any): Promise<number | null> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        INSERT INTO cases (
          title, description, income, time_required, tools, steps, source_url,
          raw_content, published, category, difficulty, investment_required,
          skills_needed, target_audience, potential_risks, success_rate,
          time_to_profit, scalability, location_flexible, age_restriction,
          revenue_model, competition_level, market_trend, key_metrics,
          author, upvotes, comments_count, tags, source_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
        ON CONFLICT (source_url) DO NOTHING
        RETURNING id
      `, [
        caseData.title,
        caseData.description,
        caseData.income || '',
        caseData.time_required || '',
        caseData.tools || '',
        caseData.steps || '',
        caseData.source_url,
        caseData.raw_content,
        caseData.published || false,
        caseData.category || 'business',
        caseData.difficulty || 'beginner',
        caseData.investment_required || '',
        caseData.skills_needed || '',
        caseData.target_audience || '',
        caseData.potential_risks || '',
        caseData.success_rate || '',
        caseData.time_to_profit || '',
        caseData.scalability || '',
        caseData.location_flexible || false,
        caseData.age_restriction || '',
        caseData.revenue_model || '',
        caseData.competition_level || '',
        caseData.market_trend || '',
        caseData.key_metrics || '',
        caseData.author || '',
        caseData.upvotes || 0,
        caseData.comments_count || 0,
        caseData.tags || [],
        caseData.source_type || 'rss'
      ])
      return result.rows[0]?.id || null
    } catch (error) {
      console.error('Error inserting case:', error)
      return null
    } finally {
      client.release()
    }
  }

  static validateRSSContent(title: string, content: string): boolean {
    // Length validation
    if (title.length < 10 || title.length > 300) return false
    if (content.length < 50 || content.length > 10000) return false

    // Business content validation
    const businessKeywords = [
      'income', 'money', 'earn', 'profit', 'revenue', 'salary', 'business',
      'startup', 'entrepreneur', 'freelance', 'side hustle', 'passive income',
      'online', 'remote', 'invest', 'make money', 'career', 'job', 'work',
      'marketing', 'sales', 'client', 'customer', 'service', 'product',
      'ecommerce', 'digital', 'strategy', 'growth', 'success'
    ]

    const combinedText = (title + ' ' + content).toLowerCase()
    const hasBusinessContent = businessKeywords.some(keyword =>
      combinedText.includes(keyword)
    )

    // Filter out inappropriate content
    const bannedKeywords = [
      'porn', 'adult', 'nsfw', 'drug', 'illegal', 'hack', 'scam',
      'gamble', 'casino', 'betting', 'lottery', 'mlm', 'pyramid'
    ]

    const hasBannedContent = bannedKeywords.some(keyword =>
      combinedText.includes(keyword)
    )

    return hasBusinessContent && !hasBannedContent
  }

  static processRSSItem(item: any, feedInfo: any): any {
    const title = item.title || ''
    const content = item.content || ''
    const link = item.link || ''

    if (!title || !content || !link) return null

    return {
      title: title,
      description: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
      income: '',
      time_required: '',
      tools: '',
      steps: '',
      source_url: link,
      raw_content: `${content}\n\nAuthor: ${item.author || feedInfo.name}\nSource: ${feedInfo.name}\nPublished: ${item.pubDate || new Date().toISOString()}\nCategories: ${(item.categories || [feedInfo.category]).join(', ')}\nFeed Type: RSS\nLanguage: ${feedInfo.language}`,
      published: true,
      category: this.categorizeRSSContent(content, feedInfo.category),
      difficulty: this.estimateRSSDifficulty(content),
      investment_required: '',
      skills_needed: '',
      target_audience: '',
      potential_risks: '',
      success_rate: '',
      time_to_profit: '',
      scalability: '',
      location_flexible: this.isRSSLocationFlexible(content),
      age_restriction: '18+',
      revenue_model: '',
      competition_level: '',
      market_trend: '',
      key_metrics: '',
      author: item.author || feedInfo.name,
      upvotes: Math.floor(Math.random() * 50),
      comments_count: Math.floor(Math.random() * 10),
      tags: [feedInfo.category, 'rss', 'business', feedInfo.language],
      source_type: 'rss'
    }
  }

  static categorizeRSSContent(content: string, defaultCategory: string): string {
    const text = content.toLowerCase()

    if (text.includes('freelance') || text.includes('upwork') || text.includes('fiverr')) {
      return 'freelance'
    } else if (text.includes('passive') || text.includes('automat') || text.includes('invest')) {
      return 'passive-income'
    } else if (text.includes('ecommerce') || text.includes('shopify') || text.includes('amazon')) {
      return 'ecommerce'
    } else if (text.includes('content') || text.includes('blog') || text.includes('youtube')) {
      return 'content-creation'
    } else if (text.includes('saas') || text.includes('software') || text.includes('app')) {
      return 'digital-products'
    } else if (text.includes('real estate') || text.includes('rental') || text.includes('property')) {
      return 'real-estate'
    } else if (text.includes('marketing') || text.includes('seo') || text.includes('social media')) {
      return 'digital-marketing'
    } else if (text.includes('startup') || text.includes('funding') || text.includes('venture')) {
      return 'startup'
    } else if (text.includes('invest') || text.includes('stock') || text.includes('trading')) {
      return 'investment'
    } else if (text.includes('remote') || text.includes('work from home') || text.includes('telework')) {
      return 'remote'
    } else {
      return defaultCategory || 'business'
    }
  }

  static estimateRSSDifficulty(content: string): string {
    const text = content.toLowerCase()
    const advancedKeywords = (text.match(/invest|capital|fund|budget|advanced|expert|professional|strategy/g) || []).length
    const intermediateKeywords = (text.match(/skill|experience|knowledge|practice|learn|develop/g) || []).length

    if (advancedKeywords > 3) return 'advanced'
    if (intermediateKeywords > 2) return 'intermediate'
    return 'beginner'
  }

  static isRSSLocationFlexible(content: string): boolean {
    const text = content.toLowerCase()
    const flexibleKeywords = ['online', 'remote', 'digital', 'internet', 'work from home', 'anywhere', 'telecommute']
    return flexibleKeywords.some(keyword => text.includes(keyword))
  }

  static async collectFromRSSFeeds(): Promise<any[]> {
    console.log('🌐 Starting RSS feed collection from global sources...')

    const allCases: any[] = []
    let processedFeeds = 0
    let successfulFeeds = 0

    console.log(`📊 Processing ${RSS_FEEDS.length} RSS feeds`)

    // Process feeds in smaller batches
    const batchSize = 2
    for (let i = 0; i < RSS_FEEDS.length; i += batchSize) {
      const batch = RSS_FEEDS.slice(i, i + batchSize)

      const batchPromises = batch.map(async (feed) => {
        try {
          console.log(`📡 Fetching RSS feed: ${feed.name}`)

          const feed = await Promise.race([
            RSSParser.parseFeed(feed.url),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), 15000)
            )
          ])

          const cases: any[] = []
          const maxItems = 5 // Reduced for Vercel timeout

          for (const item of feed.items.slice(0, maxItems)) {
            if (this.validateRSSContent(item.title, item.content)) {
              const processedCase = this.processRSSItem(item, feed)
              if (processedCase) {
                cases.push(processedCase)
              }
            }
          }

          processedFeeds++

          if (cases.length > 0) {
            successfulFeeds++
            console.log(`✅ ${feed.name}: ${cases.length} cases`)
          } else {
            console.log(`⚠️ ${feed.name}: No valid cases`)
          }

          return cases
        } catch (error) {
          processedFeeds++
          console.error(`❌ Failed to process ${feed.name}:`, error instanceof Error ? error.message : error)
          return []
        }
      })

      const batchResults = await Promise.allSettled(batchPromises)
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          allCases.push(...result.value)
        }
      })

      // Progress update
      const totalProcessed = Math.min(i + batchSize, RSS_FEEDS.length)
      const progress = ((totalProcessed / RSS_FEEDS.length) * 100).toFixed(1)
      console.log(`📊 RSS Progress: ${progress}% (${totalProcessed}/${RSS_FEEDS.length}), ${allCases.length} cases`)

      // Rate limiting between batches
      if (i + batchSize < RSS_FEEDS.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Remove duplicates
    const uniqueCases = allCases.filter((case_, index, self) =>
      index === self.findIndex(c => c.source_url === case_.source_url)
    )

    console.log(`🎯 RSS collection complete:`)
    console.log(`   - Total feeds processed: ${processedFeeds}`)
    console.log(`   - Successful feeds: ${successfulFeeds}`)
    console.log(`   - Raw cases collected: ${allCases.length}`)
    console.log(`   - Unique cases: ${uniqueCases.length}`)

    return uniqueCases
  }
}

export async function POST() {
  const correlationId = `rss_fetch_task_${Date.now()}`

  try {
    console.log('🚀 Starting scheduled RSS data collection...', { correlationId })

    const startTime = Date.now()

    // Get current count
    const currentCount = await RSSDataCollector.getCaseCount()
    console.log(`📊 Current database count: ${currentCount}`, { correlationId })

    // Collect RSS data
    console.log('🔥 Collecting RSS data...', { correlationId })
    const rssCases = await RSSDataCollector.collectFromRSSFeeds()
    console.log(`📥 RSS data: ${rssCases.length} valid cases`, { correlationId })

    if (rssCases.length === 0) {
      console.log('⚠️ No RSS cases found', { correlationId })
      return NextResponse.json({
        success: true,
        message: 'No new RSS cases found',
        currentCount,
        newCases: 0,
        executionTime: Date.now() - startTime,
        correlationId
      })
    }

    // Store in database
    console.log('💾 Storing RSS cases in database...', { correlationId })
    let storedCount = 0
    let duplicateCount = 0

    for (const caseData of rssCases) {
      try {
        const result = await RSSDataCollector.insertCase(caseData)
        if (result) {
          storedCount++
        } else {
          duplicateCount++
        }
      } catch (error) {
        console.error('Error storing RSS case:', error instanceof Error ? error.message : error)
      }
    }

    // Final count
    const finalCount = await RSSDataCollector.getCaseCount()
    const executionTime = Date.now() - startTime

    console.log('🎯 RSS Collection Results:', {
      currentCount,
      rssCasesCollected: rssCases.length,
      storedCount,
      duplicateCount,
      finalCount,
      executionTime,
      correlationId
    })

    return NextResponse.json({
      success: true,
      message: 'RSS data collection completed successfully',
      currentCount,
      newCases: storedCount,
      duplicatesSkipped: duplicateCount,
      finalCount,
      executionTime,
      feedsProcessed: RSS_FEEDS.length,
      correlationId
    })

  } catch (error) {
    console.error('❌ Error during RSS data collection:', error, { correlationId })

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'RSS data collection failed',
      correlationId
    }, { status: 500 })
  }
}

// GET method for health check and information
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'RSS Feed Collection API',
    endpoint: '/api/rss-fetch',
    method: 'POST',
    feeds: RSS_FEEDS.map(feed => ({
      name: feed.name,
      category: feed.category,
      language: feed.language
    })),
    features: [
      'Global business news collection',
      'Side hustle and passive income content',
      'Digital marketing and entrepreneurship',
      'Tech startup and product discovery',
      'Automatic content categorization',
      'Duplicate detection and prevention'
    ],
    schedule: 'Every 6 hours (0 */6 * * *)'
  })
}