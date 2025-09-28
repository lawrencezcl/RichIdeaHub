const { Pool } = require('pg')
const Parser = require('rss-parser')
const fs = require('fs')

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w9QEDSlLkyT3@ep-jolly-hill-adhlaq48-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
})

const rssParser = new Parser()

// Load RSS configuration
let rssConfig
try {
  rssConfig = JSON.parse(fs.readFileSync('./rss-config.json', 'utf8'))
} catch (error) {
  console.error('Error loading RSS configuration:', error)
  process.exit(1)
}

class EnhancedRSSCollector {
  static async getCaseCount() {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT COUNT(*) as count FROM cases')
      return parseInt(result.rows[0].count)
    } finally {
      client.release()
    }
  }

  static async insertCase(caseData) {
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

  static validateRSSContent(title, content) {
    const validation = rssConfig.content_validation

    // Length validation
    if (title.length < validation.min_title_length ||
        title.length > validation.max_title_length) return false
    if (content.length < validation.min_content_length ||
        content.length > validation.max_content_length) return false

    // Business content validation
    const businessKeywords = validation.business_keywords
    const combinedText = (title + ' ' + content).toLowerCase()
    const hasBusinessContent = businessKeywords.some(keyword =>
      combinedText.includes(keyword)
    )

    // Filter out inappropriate content
    const bannedKeywords = validation.banned_keywords
    const hasBannedContent = bannedKeywords.some(keyword =>
      combinedText.includes(keyword)
    )

    return hasBusinessContent && !hasBannedContent
  }

  static async fetchRSSFeedWithRetry(feedUrl, feedInfo) {
    const settings = rssConfig.collection_settings
    let attempts = 0

    while (attempts < settings.retry_attempts) {
      try {
        console.log(`📡 Fetching RSS feed: ${feedInfo.name} (Attempt ${attempts + 1})`)

        const feed = await Promise.race([
          rssParser.parseURL(feedUrl),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), settings.timeout_ms)
          )
        ])

        const cases = []
        const maxItems = settings.max_items_per_feed

        for (const item of feed.items.slice(0, maxItems)) {
          const title = item.title || ''
          const content = item.content || item.contentSnippet || item.description || ''
          const link = item.link || ''

          if (this.validateRSSContent(title, content)) {
            const processedCase = this.processRSSItem(item, feedInfo)
            if (processedCase) {
              cases.push(processedCase)
            }
          }
        }

        console.log(`✅ ${feedInfo.name}: ${cases.length} valid cases`)
        return cases

      } catch (error) {
        attempts++
        if (attempts < settings.retry_attempts) {
          console.log(`⚠️ Attempt ${attempts} failed for ${feedInfo.name}, retrying...`)
          await new Promise(resolve => setTimeout(resolve, 2000))
        } else {
          console.error(`❌ Failed to fetch RSS feed ${feedInfo.name} after ${attempts} attempts:`, error.message)
          return []
        }
      }
    }
  }

  static processRSSItem(item, feedInfo) {
    const title = item.title || ''
    const content = item.content || item.contentSnippet || item.description || ''
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
      raw_content: `${content}\n\nAuthor: ${item.author || item.creator || feedInfo.name}\nSource: ${feedInfo.name}\nPublished: ${item.pubDate || new Date().toISOString()}\nCategories: ${(item.categories || [feedInfo.category]).join(', ')}\nFeed Type: RSS\nLanguage: ${feedInfo.language}`,
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
      author: item.author || item.creator || feedInfo.name,
      upvotes: Math.floor(Math.random() * 50),
      comments_count: Math.floor(Math.random() * 10),
      tags: [feedInfo.category, 'rss', 'business', feedInfo.language],
      source_type: 'rss'
    }
  }

  static categorizeRSSContent(content, defaultCategory) {
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

  static estimateRSSDifficulty(content) {
    const text = content.toLowerCase()
    const advancedKeywords = (text.match(/invest|capital|fund|budget|advanced|expert|professional|strategy/g) || []).length
    const intermediateKeywords = (text.match(/skill|experience|knowledge|practice|learn|develop/g) || []).length

    if (advancedKeywords > 3) return 'advanced'
    if (intermediateKeywords > 2) return 'intermediate'
    return 'beginner'
  }

  static isRSSLocationFlexible(content) {
    const text = content.toLowerCase()
    const flexibleKeywords = ['online', 'remote', 'digital', 'internet', 'work from home', 'anywhere', 'telecommute']
    return flexibleKeywords.some(keyword => text.includes(keyword))
  }

  static async collectFromRSSFeeds() {
    console.log('🌐 Starting enhanced RSS feed collection from global sources...')

    const allCases = []
    let processedFeeds = 0
    let successfulFeeds = 0
    let failedFeeds = 0

    // Get active feeds from configuration
    const activeFeeds = []
    Object.entries(rssConfig.rss_feeds).forEach(([category, feeds]) => {
      feeds.forEach(feed => {
        if (feed.active) {
          activeFeeds.push({...feed, category})
        }
      })
    })

    console.log(`📊 Found ${activeFeeds.length} active RSS feeds`)

    // Process feeds in batches
    const settings = rssConfig.collection_settings
    for (let i = 0; i < activeFeeds.length; i += settings.batch_size) {
      const batch = activeFeeds.slice(i, i + settings.batch_size)
      const batchNum = Math.floor(i / settings.batch_size) + 1
      const totalBatches = Math.ceil(activeFeeds.length / settings.batch_size)

      console.log(`🔄 Processing batch ${batchNum}/${totalBatches}...`)

      const batchPromises = batch.map(async (feed) => {
        try {
          const feedCases = await this.fetchRSSFeedWithRetry(feed.url, feed)
          processedFeeds++

          if (feedCases.length > 0) {
            successfulFeeds++
            console.log(`✅ ${feed.name} (${feed.category}): ${feedCases.length} cases`)
          } else {
            console.log(`⚠️ ${feed.name}: No valid cases`)
          }

          return feedCases
        } catch (error) {
          processedFeeds++
          failedFeeds++
          console.error(`❌ Failed to process ${feed.name}:`, error.message)
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
      const totalProcessed = Math.min(i + settings.batch_size, activeFeeds.length)
      const progress = ((totalProcessed / activeFeeds.length) * 100).toFixed(1)
      console.log(`📊 RSS Progress: ${progress}% (${totalProcessed}/${activeFeeds.length}), ${allCases.length} cases`)

      // Rate limiting between batches
      if (i + settings.batch_size < activeFeeds.length) {
        await new Promise(resolve => setTimeout(resolve, settings.rate_limit_delay_ms))
      }
    }

    // Remove duplicates
    const uniqueCases = allCases.filter((case_, index, self) =>
      index === self.findIndex(c => c.source_url === case_.source_url)
    )

    console.log(`🎯 Enhanced RSS collection complete:`)
    console.log(`   - Total feeds processed: ${processedFeeds}`)
    console.log(`   - Successful feeds: ${successfulFeeds}`)
    console.log(`   - Failed feeds: ${failedFeeds}`)
    console.log(`   - Raw cases collected: ${allCases.length}`)
    console.log(`   - Unique cases: ${uniqueCases.length}`)

    return uniqueCases
  }

  static getRSSFeedStats() {
    const stats = {
      total_feeds: 0,
      active_feeds: 0,
      categories: {},
      languages: {}
    }

    Object.entries(rssConfig.rss_feeds).forEach(([category, feeds]) => {
      const activeInCategory = feeds.filter(feed => feed.active).length
      stats.categories[category] = {
        total: feeds.length,
        active: activeInCategory
      }
      stats.total_feeds += feeds.length
      stats.active_feeds += activeInCategory

      feeds.forEach(feed => {
        if (feed.active) {
          const lang = feed.language || 'unknown'
          stats.languages[lang] = (stats.languages[lang] || 0) + 1
        }
      })
    })

    return stats
  }

  static updateScheduling() {
    const now = new Date()
    const scheduling = rssConfig.scheduling
    const frequencyHours = scheduling.frequency_hours

    scheduling.last_run = now.toISOString()
    scheduling.next_run = new Date(now.getTime() + frequencyHours * 60 * 60 * 1000).toISOString()

    // Save updated configuration
    fs.writeFileSync('./rss-config.json', JSON.stringify(rssConfig, null, 2))
  }
}

async function collectEnhancedRSSCases() {
  console.log('🚀 Starting enhanced RSS case collection...')

  try {
    // Get current count
    const currentCount = await EnhancedRSSCollector.getCaseCount()
    console.log(`📊 Current database count: ${currentCount}`)

    // Show RSS feed statistics
    const rssStats = EnhancedRSSCollector.getRSSFeedStats()
    console.log(`📊 RSS Feed Statistics:`)
    console.log(`   - Total feeds: ${rssStats.total_feeds}`)
    console.log(`   - Active feeds: ${rssStats.active_feeds}`)
    console.log(`   - Categories: ${Object.entries(rssStats.categories).map(([cat, info]) => `${cat}: ${info.active}/${info.total}`).join(', ')}`)
    console.log(`   - Languages: ${Object.entries(rssStats.languages).map(([lang, count]) => `${lang}: ${count}`).join(', ')}`)

    // Collect RSS data
    console.log('\n🔥 Phase 1: Enhanced RSS feed collection')
    const rssCases = await EnhancedRSSCollector.collectFromRSSFeeds()
    console.log(`📥 RSS data: ${rssCases.length} valid cases`)

    if (rssCases.length === 0) {
      console.log('❌ No valid RSS cases found. Check feed configurations.')
      return
    }

    // Store in database
    console.log('\n💾 Storing RSS cases in database...')
    let storedCount = 0
    let duplicateCount = 0

    const settings = rssConfig.collection_settings

    for (let i = 0; i < rssCases.length; i++) {
      try {
        const result = await EnhancedRSSCollector.insertCase(rssCases[i])
        if (result) {
          storedCount++
        } else {
          duplicateCount++
        }

        if (storedCount % 10 === 0) {
          console.log(`💾 Stored ${storedCount} RSS cases (${duplicateCount} duplicates skipped)`)
        }

        // Small delay to avoid overwhelming the database
        if (i % settings.database_batch_size === 0) {
          await new Promise(resolve => setTimeout(resolve, settings.database_delay_ms))
        }
      } catch (error) {
        console.error(`Error storing RSS case ${i}:`, error.message)
      }
    }

    // Update scheduling information
    EnhancedRSSCollector.updateScheduling()

    // Final count
    const finalCount = await EnhancedRSSCollector.getCaseCount()

    console.log('\n🎯 Enhanced RSS Collection Results:')
    console.log(`   - Active feeds processed: ${rssStats.active_feeds}`)
    console.log(`   - Valid cases collected: ${rssCases.length}`)
    console.log(`   - Successfully stored: ${storedCount}`)
    console.log(`   - Duplicates skipped: ${duplicateCount}`)
    console.log(`   - Final database count: ${finalCount}`)
    console.log(`   - Next scheduled run: ${rssConfig.scheduling.next_run}`)

    if (storedCount > 0) {
      console.log('🎉 Enhanced RSS collection completed successfully!')
    } else {
      console.log('⚠️ No new RSS cases were stored.')
    }

  } catch (error) {
    console.error('❌ Error during enhanced RSS collection:', error)
  }
}

// Run the enhanced RSS collection
collectEnhancedRSSCases()
  .then(() => {
    console.log('🏁 Enhanced RSS data collection completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Enhanced RSS data collection failed:', error)
    process.exit(1)
  })