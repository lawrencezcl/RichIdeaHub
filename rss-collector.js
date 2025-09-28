const { Pool } = require('pg')
const Parser = require('rss-parser')

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w9QEDSlLkyT3@ep-jolly-hill-adhlaq48-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
})

const rssParser = new Parser()

// Global RSS Feed Sources Configuration
const RSS_FEEDS = {
  // Global Business News RSS Feeds
  global_business: [
    {
      name: 'Entrepreneur.com',
      url: 'https://www.entrepreneur.com/latest.rss',
      category: 'business',
      language: 'en'
    },
    {
      name: 'Forbes - Entrepreneurs',
      url: 'https://www.forbes.com/entrepreneurs/feed/',
      category: 'business',
      language: 'en'
    },
    {
      name: 'Inc. Magazine',
      url: 'https://www.inc.com/rss/rss.xml',
      category: 'business',
      language: 'en'
    },
    {
      name: 'Business Insider - Strategy',
      url: 'https://www.businessinsider.com/strategy/feed',
      category: 'business',
      language: 'en'
    },
    {
      name: 'Fast Company',
      url: 'https://www.fastcompany.com/rss',
      category: 'business',
      language: 'en'
    },
    {
      name: 'Harvard Business Review',
      url: 'https://hbr.org/feed',
      category: 'business',
      language: 'en'
    },
    {
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      category: 'tech',
      language: 'en'
    },
    {
      name: 'Bloomberg Business',
      url: 'https://feeds.bloomberg.com/markets/news.rss',
      category: 'business',
      language: 'en'
    },
    {
      name: 'Reuters Business',
      url: 'https://feeds.reuters.com/reuters/businessNews',
      category: 'business',
      language: 'en'
    },
    {
      name: 'CNBC',
      url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
      category: 'business',
      language: 'en'
    }
  ],

  // Side Hustle & Freelance RSS Feeds
  side_hustles: [
    {
      name: 'Side Hustle Nation',
      url: 'https://sidehustlenation.com/feed/',
      category: 'side-hustle',
      language: 'en'
    },
    {
      name: 'The Penny Hoarder',
      url: 'https://www.thepennyhoarder.com/feed/',
      category: 'side-hustle',
      language: 'en'
    },
    {
      name: 'Smart Passive Income',
      url: 'https://www.smartpassiveincome.com/feed/',
      category: 'passive-income',
      language: 'en'
    },
    {
      name: 'Millennial Money Man',
      url: 'https://millennialmoneyman.com/feed/',
      category: 'side-hustle',
      language: 'en'
    },
    {
      name: 'Financial Samurai',
      url: 'https://www.financialsamurai.com/feed/',
      category: 'finance',
      language: 'en'
    },
    {
      name: 'Making Sense of Cents',
      url: 'https://www.makingssenseofcents.com/feed/',
      category: 'finance',
      language: 'en'
    },
    {
      name: 'Good Financial Cents',
      url: 'https://www.goodfinancialcents.com/feed/',
      category: 'finance',
      language: 'en'
    },
    {
      name: 'Budgets Are Sexy',
      url: 'https://www.budgetsaresexy.com/feed/',
      category: 'finance',
      language: 'en'
    }
  ],

  // Digital Marketing & Online Business RSS Feeds
  digital_business: [
    {
      name: 'Neil Patel',
      url: 'https://neilpatel.com/feed/',
      category: 'marketing',
      language: 'en'
    },
    {
      name: 'Copyblogger',
      url: 'https://copyblogger.com/feed/',
      category: 'content',
      language: 'en'
    },
    {
      name: 'Smart Blogger',
      url: 'https://smartblogger.com/feed/',
      category: 'blogging',
      language: 'en'
    },
    {
      name: 'Backlinko',
      url: 'https://backlinko.com/feed/',
      category: 'seo',
      language: 'en'
    },
    {
      name: 'Social Media Examiner',
      url: 'https://www.socialmediaexaminer.com/feed/',
      category: 'social-media',
      language: 'en'
    },
    {
      name: 'Content Marketing Institute',
      url: 'https://contentmarketinginstitute.com/feed/',
      category: 'marketing',
      language: 'en'
    }
  ],

  // Tech & Startup RSS Feeds
  tech_startups: [
    {
      name: 'Hacker News',
      url: 'https://hnrss.org/frontpage',
      category: 'tech',
      language: 'en'
    },
    {
      name: 'Indie Hackers',
      url: 'https://www.indiehackers.com/rss',
      category: 'startup',
      language: 'en'
    },
    {
      name: 'Product Hunt',
      url: 'https://feeds.feedburner.com/producthunt',
      category: 'products',
      language: 'en'
    },
    {
      name: 'Mashable',
      url: 'https://mashable.com/feed',
      category: 'tech',
      language: 'en'
    },
    {
      name: 'VentureBeat',
      url: 'https://venturebeat.com/feed/',
      category: 'tech',
      language: 'en'
    },
    {
      name: 'TechCrunch - Startups',
      url: 'https://techcrunch.com/startups/feed/',
      category: 'startup',
      language: 'en'
    }
  ],

  // Finance & Investment RSS Feeds
  finance_investment: [
    {
      name: 'The Motley Fool',
      url: 'https://www.fool.com/feed/',
      category: 'investment',
      language: 'en'
    },
    {
      name: 'Investopedia',
      url: 'https://www.investopedia.com/feed/',
      category: 'investment',
      language: 'en'
    },
    {
      name: 'Morningstar',
      url: 'https://www.morningstar.com/feed',
      category: 'investment',
      language: 'en'
    },
    {
      name: 'Seeking Alpha',
      url: 'https://seekingalpha.com/feed',
      category: 'investment',
      language: 'en'
    },
    {
      name: 'Money Morning',
      url: 'https://moneymorning.com/feed/',
      category: 'investment',
      language: 'en'
    }
  ],

  // Remote Work & Freelancing RSS Feeds
  remote_work: [
    {
      name: 'Remote.co',
      url: 'https://remote.co/blog/feed/',
      category: 'remote',
      language: 'en'
    },
    {
      name: 'We Work Remotely',
      url: 'https://weworkremotely.com/remote-jobs.rss',
      category: 'remote',
      language: 'en'
    },
    {
      name: 'FlexJobs',
      url: 'https://www.flexjobs.com/blog/feed/',
      category: 'remote',
      language: 'en'
    },
    {
      name: 'Upwork Blog',
      url: 'https://www.upwork.com/blog/feed/',
      category: 'freelance',
      language: 'en'
    },
    {
      name: 'Freelancers Union',
      url: 'https://www.freelancersunion.org/blog/feed/',
      category: 'freelance',
      language: 'en'
    }
  ],

  // E-commerce & Online Business RSS Feeds
  ecommerce: [
    {
      name: 'Shopify Blog',
      url: 'https://www.shopify.com/blog/rss.xml',
      category: 'ecommerce',
      language: 'en'
    },
    {
      name: 'BigCommerce Blog',
      url: 'https://www.bigcommerce.com/blog/rss/',
      category: 'ecommerce',
      language: 'en'
    },
    {
      name: 'Ecommerce Fuel',
      url: 'https://ecommercefuel.com/feed/',
      category: 'ecommerce',
      language: 'en'
    },
    {
      name: 'My Wife Quit Her Job',
      url: 'https://mywifequitherjob.com/feed/',
      category: 'ecommerce',
      language: 'en'
    }
  ],

  // Chinese RSS Feeds (Global Market)
  chinese_business: [
    {
      name: '36氪',
      url: 'https://36kr.com/feed',
      category: 'business',
      language: 'zh'
    },
    {
      name: '虎嗅网',
      url: 'https://www.huxiu.com/rss/0.xml',
      category: 'business',
      language: 'zh'
    },
    {
      name: '钛媒体',
      url: 'https://www.tmtpost.com/rss',
      category: 'tech',
      language: 'zh'
    }
  ],

  // International RSS Feeds
  international: [
    {
      name: 'BBC Business',
      url: 'http://feeds.bbci.co.uk/news/business/rss.xml',
      category: 'business',
      language: 'en'
    },
    {
      name: 'Financial Times',
      url: 'https://www.ft.com/companies/companies?format=rss',
      category: 'business',
      language: 'en'
    },
    {
      name: 'The Economist',
      url: 'https://www.economist.com/business/rss.xml',
      category: 'business',
      language: 'en'
    },
    {
      name: 'Reuters - World News',
      url: 'https://feeds.reuters.com/reuters/worldNews',
      category: 'business',
      language: 'en'
    }
  ]
}

class RSSDataCollector {
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

  static async fetchRSSFeed(feedUrl, feedInfo) {
    try {
      console.log(`📡 Fetching RSS feed: ${feedInfo.name}`)

      const feed = await rssParser.parseURL(feedUrl)
      const cases = []

      for (const item of feed.items.slice(0, 10)) { // Limit to 10 items per feed
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
      console.error(`❌ Failed to fetch RSS feed ${feedInfo.name}:`, error.message)
      return []
    }
  }

  static processRSSItem(item, feedInfo) {
    const title = item.title || ''
    const content = item.content || item.contentSnippet || item.description || ''
    const link = item.link || ''

    if (!title || !content || !link) return null

    const processedContent = {
      title: title,
      content: content,
      url: link,
      author: item.author || item.creator || feedInfo.name,
      pubDate: item.pubDate || new Date().toISOString(),
      categories: item.categories || [feedInfo.category],
      feedInfo: feedInfo
    }

    return {
      title: processedContent.title,
      description: processedContent.content.substring(0, 500) + (processedContent.content.length > 500 ? '...' : ''),
      income: '',
      time_required: '',
      tools: '',
      steps: '',
      source_url: processedContent.url,
      raw_content: `${processedContent.content}\n\nAuthor: ${processedContent.author}\nSource: ${feedInfo.name}\nPublished: ${processedContent.pubDate}\nCategories: ${processedContent.categories.join(', ')}\nFeed Type: RSS`,
      published: true,
      category: this.categorizeRSSContent(processedContent.content, feedInfo.category),
      difficulty: this.estimateRSSDifficulty(processedContent.content),
      investment_required: '',
      skills_needed: '',
      target_audience: '',
      potential_risks: '',
      success_rate: '',
      time_to_profit: '',
      scalability: '',
      location_flexible: this.isRSSLocationFlexible(processedContent.content),
      age_restriction: '18+',
      revenue_model: '',
      competition_level: '',
      market_trend: '',
      key_metrics: '',
      author: processedContent.author,
      upvotes: Math.floor(Math.random() * 50),
      comments_count: Math.floor(Math.random() * 10),
      tags: [feedInfo.category, 'rss', 'business', 'news'],
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
    console.log('🌐 Starting RSS feed collection from global sources...')

    const allCases = []
    let processedFeeds = 0
    let successfulFeeds = 0

    // Flatten all RSS feeds
    const allFeeds = Object.values(RSS_FEEDS).flat()

    // Process feeds in batches to avoid overwhelming servers
    const batchSize = 3
    for (let i = 0; i < allFeeds.length; i += batchSize) {
      const batch = allFeeds.slice(i, i + batchSize)
      const batchNum = Math.floor(i / batchSize) + 1
      const totalBatches = Math.ceil(allFeeds.length / batchSize)

      console.log(`🔄 Processing batch ${batchNum}/${totalBatches}...`)

      const batchPromises = batch.map(async (feed) => {
        try {
          const feedCases = await this.fetchRSSFeed(feed.url, feed)
          processedFeeds++

          if (feedCases.length > 0) {
            successfulFeeds++
            console.log(`✅ ${feed.name}: ${feedCases.length} cases`)
          } else {
            console.log(`⚠️ ${feed.name}: No valid cases`)
          }

          return feedCases
        } catch (error) {
          processedFeeds++
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
      const totalProcessed = Math.min(i + batchSize, allFeeds.length)
      const progress = ((totalProcessed / allFeeds.length) * 100).toFixed(1)
      console.log(`📊 RSS Progress: ${progress}% (${totalProcessed}/${allFeeds.length}), ${allCases.length} cases`)

      // Rate limiting between batches
      if (i + batchSize < allFeeds.length) {
        await new Promise(resolve => setTimeout(resolve, 2000))
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

  static getRSSFeedStats() {
    const allFeeds = Object.values(RSS_FEEDS).flat()
    const stats = {
      total_feeds: allFeeds.length,
      categories: {},
      languages: {}
    }

    Object.entries(RSS_FEEDS).forEach(([category, feeds]) => {
      stats.categories[category] = feeds.length
    })

    allFeeds.forEach(feed => {
      const lang = feed.language || 'unknown'
      stats.languages[lang] = (stats.languages[lang] || 0) + 1
    })

    return stats
  }
}

async function collectRSSCases() {
  console.log('🚀 Starting RSS case collection...')

  try {
    // Get current count
    const currentCount = await RSSDataCollector.getCaseCount()
    console.log(`📊 Current database count: ${currentCount}`)

    // Show RSS feed statistics
    const rssStats = RSSDataCollector.getRSSFeedStats()
    console.log(`📊 RSS Feed Statistics:`)
    console.log(`   - Total feeds: ${rssStats.total_feeds}`)
    console.log(`   - Categories: ${Object.entries(rssStats.categories).map(([cat, count]) => `${cat}: ${count}`).join(', ')}`)
    console.log(`   - Languages: ${Object.entries(rssStats.languages).map(([lang, count]) => `${lang}: ${count}`).join(', ')}`)

    // Collect RSS data
    console.log('\n🔥 Phase 1: RSS feed collection')
    const rssCases = await RSSDataCollector.collectFromRSSFeeds()
    console.log(`📥 RSS data: ${rssCases.length} valid cases`)

    if (rssCases.length === 0) {
      console.log('❌ No valid RSS cases found. Check feed configurations.')
      return
    }

    // Store in database
    console.log('\n💾 Storing RSS cases in database...')
    let storedCount = 0
    let duplicateCount = 0

    for (let i = 0; i < rssCases.length; i++) {
      try {
        const result = await RSSDataCollector.insertCase(rssCases[i])
        if (result) {
          storedCount++
        } else {
          duplicateCount++
        }

        if (storedCount % 10 === 0) {
          console.log(`💾 Stored ${storedCount} RSS cases (${duplicateCount} duplicates skipped)`)
        }

        // Small delay to avoid overwhelming the database
        if (i % 20 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } catch (error) {
        console.error(`Error storing RSS case ${i}:`, error.message)
      }
    }

    // Final count
    const finalCount = await RSSDataCollector.getCaseCount()

    console.log('\n🎯 RSS Collection Results:')
    console.log(`   - RSS feeds processed: ${rssStats.total_feeds}`)
    console.log(`   - Valid cases collected: ${rssCases.length}`)
    console.log(`   - Successfully stored: ${storedCount}`)
    console.log(`   - Duplicates skipped: ${duplicateCount}`)
    console.log(`   - Final database count: ${finalCount}`)

    if (storedCount > 0) {
      console.log('🎉 RSS collection completed successfully!')
    } else {
      console.log('⚠️ No new RSS cases were stored.')
    }

  } catch (error) {
    console.error('❌ Error during RSS collection:', error)
  }
}

// Run the RSS collection
collectRSSCases()
  .then(() => {
    console.log('🏁 RSS data collection completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 RSS data collection failed:', error)
    process.exit(1)
  })