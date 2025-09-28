const { Pool } = require('pg')

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_w9QEDSlLkyT3@ep-jolly-hill-adhlaq48-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
})

class DataCollector {
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
        caseData.source_type || 'other'
      ])
      return result.rows[0]?.id || null
    } catch (error) {
      console.error('Error inserting case:', error)
      return null
    } finally {
      client.release()
    }
  }

  static async fetchRedditData() {
    console.log('🚀 Starting Reddit data collection...')
    const allCases = []

    // Core business subreddits
    const subreddits = [
      'Entrepreneur', 'smallbusiness', 'Business', 'startups', 'Startup',
      'SelfEmployed', 'solopreneur', 'sidehustle', 'SideHustle',
      'passive_income', 'ExtraIncome', 'makingmoney', 'beermoney',
      'WorkOnline', 'OnlineJobs', 'freelance', 'Freelance',
      'AmazonFBA', 'dropship', 'Ecommerce', 'Shopify', 'Etsy',
      'AffiliateMarketing', 'blogging', 'Blogging', 'YouTubeStartups',
      'investing', 'Investment', 'personalfinance', 'FinancialPlanning',
      'SaaS', 'apps', 'webdev', 'programming', 'digital_marketing',
      'SEO', 'marketing', 'copywriting', 'Writing', 'TechnicalWriting',
      'podcasting', 'GraphicDesign', 'design', 'Photography',
      'flipping', 'Flipping', 'Handyman', 'trades', 'foodbusiness',
      'gigeconomy', 'rideshare', 'Uber', 'DoorDash', 'Instacart',
      'consulting', 'Consulting', 'coaching', 'lifehacks', 'productivity'
    ]

    // Process in smaller batches for Vercel timeout
    const batchSize = 2
    for (let i = 0; i < Math.min(subreddits.length, 10); i += batchSize) {
      const batch = subreddits.slice(i, i + batchSize)

      const batchPromises = batch.map(async (subreddit) => {
        try {
          const response = await fetch(
            `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`,
            {
              headers: {
                'User-Agent': 'RichIdeaHub/1.0 (Educational Research Project)'
              }
            }
          )

          if (response.ok) {
            const data = await response.json()
            const posts = data.data?.children || []

            const subredditCases = []
            for (const post of posts) {
              const postData = post.data
              const title = postData.title || ''
              const content = postData.selftext || ''

              if (this.validateContent(title, content) && !postData.over_18) {
                subredditCases.push({
                  title: title,
                  description: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
                  income: '',
                  time_required: '',
                  tools: '',
                  steps: '',
                  source_url: `https://reddit.com${postData.permalink}`,
                  raw_content: `${content}\n\nAuthor: u/${postData.author}\nSubreddit: r/${subreddit}\nScore: ${postData.score}\nComments: ${postData.num_comments}`,
                  published: true,
                  category: this.categorizeContent(title + ' ' + content),
                  difficulty: 'beginner',
                  investment_required: '',
                  skills_needed: '',
                  target_audience: '',
                  potential_risks: '',
                  success_rate: '',
                  time_to_profit: '',
                  scalability: '',
                  location_flexible: this.isLocationFlexible(title + ' ' + content),
                  age_restriction: '18+',
                  revenue_model: '',
                  competition_level: '',
                  market_trend: '',
                  key_metrics: '',
                  author: postData.author,
                  upvotes: postData.score,
                  comments_count: postData.num_comments,
                  tags: [subreddit, 'reddit', 'business'],
                  source_type: 'reddit'
                })
              }
            }
            return subredditCases
          }
        } catch (error) {
          console.error(`Error fetching r/${subreddit}:`, error.message)
          return []
        }
      })

      const batchResults = await Promise.allSettled(batchPromises)
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          allCases.push(...result.value)
        }
      })

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return allCases.slice(0, 50) // Limit for Vercel timeout
  }

  static validateContent(title, content) {
    // Length validation
    if (title.length < 10 || title.length > 300) return false
    if (content.length < 50 || content.length > 10000) return false

    // Business content validation
    const businessKeywords = [
      'income', 'money', 'earn', 'profit', 'revenue', 'salary', 'business',
      'startup', 'entrepreneur', 'freelance', 'side hustle', 'passive income',
      'online', 'remote', 'invest', 'make money', 'career', 'job', 'work'
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

  static categorizeContent(text) {
    const lowerText = text.toLowerCase()

    if (lowerText.includes('freelance') || lowerText.includes('upwork') || lowerText.includes('fiverr')) {
      return 'freelance'
    } else if (lowerText.includes('passive') || lowerText.includes('automat') || lowerText.includes('invest')) {
      return 'passive-income'
    } else if (lowerText.includes('ecommerce') || lowerText.includes('shopify') || lowerText.includes('amazon')) {
      return 'ecommerce'
    } else if (lowerText.includes('content') || lowerText.includes('blog') || lowerText.includes('youtube')) {
      return 'content-creation'
    } else if (lowerText.includes('saas') || lowerText.includes('software') || lowerText.includes('app')) {
      return 'digital-products'
    } else if (lowerText.includes('real estate') || lowerText.includes('rental') || lowerText.includes('property')) {
      return 'real-estate'
    } else if (lowerText.includes('marketing') || lowerText.includes('seo') || lowerText.includes('social media')) {
      return 'digital-marketing'
    } else if (lowerText.includes('design') || lowerText.includes('graphic') || lowerText.includes('photography')) {
      return 'creative'
    } else if (lowerText.includes('ai') || lowerText.includes('artificial intelligence')) {
      return 'ai-services'
    } else {
      return 'business'
    }
  }

  static isLocationFlexible(content) {
    const lowerText = content.toLowerCase()
    const flexibleKeywords = ['online', 'remote', 'digital', 'internet', 'work from home', 'anywhere']
    return flexibleKeywords.some(keyword => lowerText.includes(keyword))
  }
}

export default async function handler(req, res) {
  try {
    console.log('🚀 Starting scheduled data collection...')

    const startTime = Date.now()

    // Get current count
    const currentCount = await DataCollector.getCaseCount()
    console.log(`📊 Current database count: ${currentCount}`)

    // Collect Reddit data
    console.log('🔥 Collecting Reddit data...')
    const redditCases = await DataCollector.fetchRedditData()
    console.log(`📥 Reddit data: ${redditCases.length} valid cases`)

    if (redditCases.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No new cases found',
        currentCount,
        newCases: 0,
        executionTime: Date.now() - startTime
      })
    }

    // Store in database
    console.log('💾 Storing cases in database...')
    let storedCount = 0
    let duplicateCount = 0

    for (const caseData of redditCases) {
      try {
        const result = await DataCollector.insertCase(caseData)
        if (result) {
          storedCount++
        } else {
          duplicateCount++
        }
      } catch (error) {
        console.error('Error storing case:', error.message)
      }
    }

    // Final count
    const finalCount = await DataCollector.getCaseCount()
    const executionTime = Date.now() - startTime

    console.log('🎯 Collection Results:')
    console.log(`   - Current count: ${currentCount}`)
    console.log(`   - Cases collected: ${redditCases.length}`)
    console.log(`   - Successfully stored: ${storedCount}`)
    console.log(`   - Duplicates skipped: ${duplicateCount}`)
    console.log(`   - Final database count: ${finalCount}`)
    console.log(`   - Execution time: ${executionTime}ms`)

    return res.status(200).json({
      success: true,
      message: 'Data collection completed successfully',
      currentCount,
      newCases: storedCount,
      duplicatesSkipped: duplicateCount,
      finalCount,
      executionTime
    })

  } catch (error) {
    console.error('❌ Error during data collection:', error)
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Data collection failed'
    })
  }
}