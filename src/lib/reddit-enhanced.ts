// Enhanced Reddit API Integration with OAuth and Extended Subreddit Coverage
// Real Reddit data collection for side hustle and business content
import { RawCaseData } from './types'

export interface RedditOAuthConfig {
  client_id: string
  client_secret: string
  redirect_uri: string
  user_agent: string
}

export interface RedditPostData {
  id: string
  title: string
  selftext: string
  permalink: string
  url: string
  author: string
  created_utc: number
  score: number
  upvote_ratio: number
  num_comments: number
  subreddit: string
  link_flair_text?: string
  is_self: boolean
  over_18: boolean
  domain?: string
}

export interface RedditSubredditInfo {
  display_name: string
  title: string
  description: string
  subscribers: number
  created_utc: number
  over18: boolean
  public_description: string
}

export interface RedditSearchResult {
  kind: string
  data: {
    children: Array<{
      kind: string
      data: RedditPostData
    }>
    after?: string
    before?: string
  }
}

class EnhancedRedditAPI {
  private accessToken: string | null = null
  private tokenExpiry: number = 0
  private config: RedditOAuthConfig
  private baseUrl = 'https://oauth.reddit.com'
  private publicUrl = 'https://www.reddit.com'

  constructor() {
    this.config = {
      client_id: process.env.REDDIT_CLIENT_ID || '',
      client_secret: process.env.REDDIT_CLIENT_SECRET || '',
      redirect_uri: process.env.REDDIT_REDIRECT_URI || 'http://localhost:3000/auth/reddit/callback',
      user_agent: 'RichIdeaHub/1.0 (by u/RichIdeaHubBot)'
    }
  }

  /**
   * Authenticate with Reddit using OAuth 2.0
   */
  async authenticate(): Promise<boolean> {
    try {
      // For script apps (bot accounts), use client credentials flow
      const authString = Buffer.from(`${this.config.client_id}:${this.config.client_secret}`).toString('base64')

      const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.config.user_agent
        },
        body: 'grant_type=client_credentials'
      })

      if (!response.ok) {
        console.error('Reddit authentication failed:', response.status, response.statusText)
        return false
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Buffer 1 minute

      console.log('✅ Reddit OAuth authentication successful')
      return true
    } catch (error) {
      console.error('Reddit authentication error:', error)
      return false
    }
  }

  /**
   * Check if token is valid and refresh if needed
   */
  async ensureAuthenticated(): Promise<boolean> {
    if (!this.config.client_id || !this.config.client_secret) {
      console.log('Reddit credentials not configured, using public API')
      return false
    }

    if (!this.accessToken || Date.now() > this.tokenExpiry) {
      return await this.authenticate()
    }
    return true
  }

  /**
   * Make authenticated API request to Reddit
   */
  private async makeAPIRequest(endpoint: string, params: Record<string, string> = {}): Promise<unknown> {
    const isAuthenticated = await this.ensureAuthenticated()

    const url = new URL(`${isAuthenticated ? this.baseUrl : this.publicUrl}${endpoint}`)
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key])
    })

    const headers: Record<string, string> = {
      'User-Agent': this.config.user_agent
    }

    if (isAuthenticated && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    const response = await fetch(url.toString(), { headers })

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status} - ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get subreddit information
   */
  async getSubredditInfo(subreddit: string): Promise<RedditSubredditInfo | null> {
    try {
      const response = await this.makeAPIRequest(`/r/${subreddit}/about.json`) as RedditSubredditInfo
      return response
    } catch (error) {
      console.error(`Failed to get subreddit info for r/${subreddit}:`, error)
      return null
    }
  }

  /**
   * Search for posts in a subreddit with specific keywords
   */
  async searchSubreddit(subreddit: string, query: string, limit: number = 25, sort: 'hot' | 'new' | 'top' | 'relevance' = 'hot'): Promise<RedditPostData[]> {
    try {
      const response = await this.makeAPIRequest(`/r/${subreddit}/search.json`, {
        q: query,
        restrict_sr: 'true',
        limit: limit.toString(),
        sort: sort
      }) as RedditSearchResult

      return response.data.children.map(child => child.data)
    } catch (error) {
      console.error(`Failed to search r/${subreddit} for "${query}":`, error)
      return []
    }
  }

  /**
   * Get posts from subreddit
   */
  async getSubredditPosts(subreddit: string, limit: number = 50, sort: 'hot' | 'new' | 'top' = 'hot'): Promise<RedditPostData[]> {
    try {
      const response = await this.makeAPIRequest(`/r/${subreddit}/${sort}.json`, {
        limit: limit.toString()
      }) as RedditSearchResult

      return response.data.children.map(child => child.data)
    } catch (error) {
      console.error(`Failed to get posts from r/${subreddit}:`, error)
      return []
    }
  }

  /**
   * Filter posts for business/side hustle content
   */
  filterBusinessPosts(posts: RedditPostData[]): RedditPostData[] {
    return posts.filter(post => {
      if (post.over_18) return false // Filter out NSFW content

      const title = (post.title || '').toLowerCase()
      const content = (post.selftext || '').toLowerCase()
      const combinedText = `${title} ${content}`

      // Comprehensive business and side hustle keywords
      const businessKeywords = [
        // Income and money
        'income', 'money', 'earn', 'profit', 'revenue', 'salary', 'wage', 'pay',
        '$', '€', '£', 'dollar', 'euro', 'pound', 'crypto', 'bitcoin',

        // Business and entrepreneurship
        'business', 'entrepreneur', 'startup', 'company', 'venture', 'enterprise',
        'freelance', 'consulting', 'agency', 'service', 'client', 'customer',

        // Side hustles and gigs
        'side hustle', 'side income', 'passive income', 'gig', 'hustle',
        'part time', 'part-time', 'full time', 'full-time', 'remote',

        // Online and digital
        'online', 'digital', 'internet', 'web', 'app', 'software', 'saas',
        'ecommerce', 'dropshipping', 'affiliate', 'blog', 'youtube', 'content',

        // Skills and services
        'skill', 'service', 'freelancer', 'upwork', 'fiverr', 'marketplace',
        'design', 'development', 'writing', 'marketing', 'social media',

        // Investment and finance
        'invest', 'investment', 'stock', 'trading', 'real estate', 'property',
        'rental', 'dividend', 'interest', 'roi', 'return',

        // Specific business models
        'amazon fba', 'shopify', 'etsy', 'print on demand', 'pod', 'dropshipping',
        'affiliate marketing', 'adsense', 'advertising', 'monetize', 'monetization'
      ]

      // Negative filters (exclude these topics)
      const negativeKeywords = [
        'gamble', 'casino', 'betting', 'lottery', 'get rich quick', 'scam',
        'mlm', 'pyramid', 'ponzi', 'clickbait', 'survey', 'giveaway'
      ]

      // Check if content contains business keywords
      const hasBusinessContent = businessKeywords.some(keyword =>
        combinedText.includes(keyword)
      )

      // Check if content contains negative keywords
      const hasNegativeContent = negativeKeywords.some(keyword =>
        combinedText.includes(keyword)
      )

      // Minimum content requirements
      const hasSufficientContent = post.selftext.length > 100 ||
                                  (post.is_self && post.selftext.length > 50) ||
                                  (title.length > 20 && content.length > 30)

      return hasBusinessContent && !hasNegativeContent && hasSufficientContent
    })
  }

  /**
   * Convert Reddit post to RawCaseData format
   */
  static convertPostToRawCase(post: RedditPostData): RawCaseData {
    const content = `${post.selftext}

Author: u/${post.author}
Subreddit: r/${post.subreddit}
Score: ${post.score} (${post.upvote_ratio * 100}% upvoted)
Comments: ${post.num_comments}
Created: ${new Date(post.created_utc * 1000).toLocaleDateString()}
${post.link_flair_text ? `Flair: ${post.link_flair_text}` : ''}
${post.url && post.url !== post.permalink ? `URL: ${post.url}` : ''}`

    return {
      title: post.title,
      content: content,
      url: `https://reddit.com${post.permalink}`,
      source_id: `reddit_${post.subreddit}_${post.id}`,
      author: post.author,
      upvotes: post.score,
      comments_count: post.num_comments,
      tags: [post.subreddit, 'reddit', 'business'],
      category: this.categorizePost(post)
    }
  }

  /**
   * Categorize Reddit post based on content
   */
  private static categorizePost(post: RedditPostData): string {
    const text = `${post.title} ${post.selftext}`.toLowerCase()

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
    } else {
      return 'business'
    }
  }
}

// Extended list of 50+ subreddits for business content
const EXTENDED_SUBREDDITS = [
  // Core business and entrepreneurship
  'Entrepreneur', 'smallbusiness', 'Business', 'startups', 'Startup',

  // Side hustles and income
  'sidehustle', 'SideHustle', 'passive_income', 'ExtraIncome', 'makingmoney',
  'beermoney', 'WorkOnline', 'OnlineJobs', 'freelance', 'Freelance',

  // Specific business models
  'AmazonFBA', 'dropship', 'Ecommerce', 'Shopify', 'Etsy',
  'AffiliateMarketing', 'blogging', 'Blogging', 'YouTubeStartups',

  // Investment and finance
  'investing', 'Investment', 'personalfinance', 'FinancialPlanning',
  'realestateinvesting', 'RealEstate', 'Landlord',

  // Digital products and services
  'SaaS', 'apps', 'webdev', 'web_design', 'WebDesign',
  'digital_marketing', 'SEO', 'SocialMediaMarketing',

  // Creative and content
  'CreatorHub', 'ContentCreator', 'podcasting', 'GraphicDesign',
  'writing', 'Writers', 'photography',

  // Local and service businesses
  'flipping', 'Flipping', 'Handyman', 'trades', 'Trades',
  'foodbusiness', 'Restaurant', 'catering',

  // Gig economy
  'gigeconomy', 'rideshare', 'Uber', 'DoorDash', 'Instacart',

  // Career and professional
  'careerguidance', 'CareerAdvice', 'telecommuting', 'RemoteWork',
  'consulting', 'Consulting'
]

// Export singleton instance
export const enhancedRedditAPI = new EnhancedRedditAPI()

/**
 * Main function to fetch Reddit cases from 50+ subreddits
 */
export async function fetchEnhancedRedditCases(limit: number = 100): Promise<RawCaseData[]> {
  try {
    console.log('🚀 Starting enhanced Reddit data collection from 50+ subreddits...')

    const allCases: RawCaseData[] = []
    const processedSubreddits = new Set<string>()

    // Process subreddits in batches to avoid rate limiting
    const batchSize = 5
    for (let i = 0; i < EXTENDED_SUBREDDITS.length; i += batchSize) {
      const batch = EXTENDED_SUBREDDITS.slice(i, i + batchSize)

      const batchPromises = batch.map(async (subreddit) => {
        try {
          // Skip if already processed this subreddit
          if (processedSubreddits.has(subreddit)) return []

          console.log(`🔍 Processing r/${subreddit}...`)

          // Get subreddit info first
          const subredditInfo = await enhancedRedditAPI.getSubredditInfo(subreddit)
          if (!subredditInfo || subredditInfo.over18) {
            console.log(`⏭️  Skipping r/${subreddit} (NSFW or not found)`)
            return []
          }

          // Search for business-related posts
          const searchTerms = ['money', 'business', 'income', 'side hustle', 'entrepreneur']
          const searchPromises = searchTerms.map(term =>
            enhancedRedditAPI.searchSubreddit(subreddit, term, 10, 'hot')
          )

          const searchResults = await Promise.allSettled(searchPromises)
          const posts: RedditPostData[] = []

          searchResults.forEach(result => {
            if (result.status === 'fulfilled') {
              posts.push(...result.value)
            }
          })

          // Also get hot posts for broader coverage
          const hotPosts = await enhancedRedditAPI.getSubredditPosts(subreddit, 25, 'hot')
          posts.push(...hotPosts)

          // Remove duplicates
          const uniquePosts = posts.filter((post, index, self) =>
            index === self.findIndex(p => p.id === post.id)
          )

          // Filter for business content
          const businessPosts = enhancedRedditAPI.filterBusinessPosts(uniquePosts)

          // Convert to RawCaseData
          const cases = businessPosts.map(post =>
            EnhancedRedditAPI.convertPostToRawCase(post)
          )

          processedSubreddits.add(subreddit)

          console.log(`✅ r/${subreddit}: ${cases.length} cases found`)
          return cases

        } catch (error) {
          console.error(`❌ Failed to process r/${subreddit}:`, error)
          return []
        }
      })

      const batchResults = await Promise.allSettled(batchPromises)
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          allCases.push(...result.value)
        }
      })

      // Rate limiting between batches
      if (i + batchSize < EXTENDED_SUBREDDITS.length) {
        console.log(`⏳ Resting between batches...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    // Remove duplicates across all subreddits
    const uniqueCases = allCases.filter((case_, index, self) =>
      index === self.findIndex(c => c.url === case_.url)
    )

    // Sort by upvotes and limit
    const finalCases = uniqueCases
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, limit)

    console.log(`📊 Enhanced Reddit collection complete:`)
    console.log(`   - Processed ${processedSubreddits.size} subreddits`)
    console.log(`   - Total raw cases: ${allCases.length}`)
    console.log(`   - Unique cases: ${uniqueCases.length}`)
    console.log(`   - Final cases: ${finalCases.length}`)

    return finalCases

  } catch (error) {
    console.error('Enhanced Reddit collection failed:', error)

    // Fallback to basic Reddit scraping
    console.log('🔄 Using fallback Reddit collection...')
    return await fetchBasicRedditCases(limit)
  }
}

/**
 * Fallback basic Reddit collection when OAuth fails
 */
async function fetchBasicRedditCases(limit: number = 50): Promise<RawCaseData[]> {
  const basicSubreddits = [
    'sidehustle', 'Entrepreneur', 'smallbusiness', 'WorkOnline',
    'freelance', 'passive_income', 'makingmoney', 'ExtraIncome'
  ]

  const allCases: RawCaseData[] = []

  for (const subreddit of basicSubreddits) {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`,
        {
          headers: {
            'User-Agent': 'RichIdeaHub/1.0 (Educational Purpose)'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const posts = data.data?.children || []

        const cases = posts
          .filter((post: { data: RedditPostData }) => {
            const title = post.data.title?.toLowerCase() || ''
            const content = post.data.selftext?.toLowerCase() || ''
            return title.length > 10 &&
                   (title.includes('income') || title.includes('money') ||
                    content.includes('business') || content.includes('earn'))
          })
          .map((post: { data: RedditPostData }) => ({
            title: post.data.title,
            content: post.data.selftext || '',
            url: `https://reddit.com${post.data.permalink}`,
            source_id: `reddit_${subreddit}_${post.data.id}`,
            author: post.data.author,
            upvotes: post.data.score,
            comments_count: post.data.num_comments,
            tags: [subreddit, 'reddit'],
            category: 'business'
          }))

        allCases.push(...cases)
        console.log(`r/${subreddit}: ${cases.length} cases (fallback)`)
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Fallback failed for r/${subreddit}:`, error)
    }
  }

  return allCases.slice(0, limit)
}