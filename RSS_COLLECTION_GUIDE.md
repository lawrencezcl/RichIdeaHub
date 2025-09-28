# RSS Collection System Guide

## Overview

The RichIdeaHub now includes a comprehensive RSS feed collection system that automatically gathers business and side-hustle related content from global sources. This system integrates seamlessly with the existing case collection infrastructure.

## Features

### 📡 RSS Feed Sources

The system includes feeds from:

**Global Business News:**
- Entrepreneur.com
- Fast Company
- TechCrunch
- CNBC

**Side Hustles & Passive Income:**
- Side Hustle Nation
- Smart Passive Income
- Millennial Money Man
- Financial Samurai
- Good Financial Cents

**Digital Business & Marketing:**
- Neil Patel
- Copyblogger
- Smart Blogger
- Backlinko
- Social Media Examiner

**Tech Startups:**
- Hacker News
- Product Hunt
- Mashable
- TechCrunch Startups

**Investment & Finance:**
- Money Morning

**Remote Work & Freelancing:**
- We Work Remotely
- FlexJobs
- Upwork Blog

**E-commerce:**
- Shopify Blog
- BigCommerce Blog

**International:**
- BBC Business

## Scheduled Collection

### Cron Jobs

The system uses Vercel Cron Jobs for automated collection:

1. **General Data Collection** - `/api/fetch`
   - Schedule: `0 * * * *` (Every hour)
   - Focus: Reddit and other sources

2. **RSS Feed Collection** - `/api/rss-fetch`
   - Schedule: `0 */6 * * *` (Every 6 hours)
   - Focus: RSS feeds from global sources

### API Endpoints

#### `GET /api/fetch`
- Triggers general data collection
- Collects from Reddit and other sources
- Returns collection statistics

#### `GET /api/rss-fetch`
- Triggers RSS feed collection
- Collects from configured RSS feeds
- Returns RSS collection statistics

## Configuration

### RSS Feed Configuration

RSS feeds are configured in `rss-config.json`:

```json
{
  "rss_feeds": {
    "global_business": [
      {
        "name": "Entrepreneur.com",
        "url": "https://www.entrepreneur.com/latest.rss",
        "category": "business",
        "language": "en",
        "active": true
      }
    ]
  },
  "collection_settings": {
    "max_items_per_feed": 10,
    "batch_size": 3,
    "rate_limit_delay_ms": 2000,
    "timeout_ms": 30000,
    "retry_attempts": 3
  }
}
```

### Environment Variables

The system uses the following environment variables:

- `DATABASE_URL`: PostgreSQL database connection string
- (Automatically configured in Vercel)

## Local Testing

### Test RSS Collection

```bash
# Run the enhanced RSS collector locally
node enhanced-rss-collector.js

# Test the API endpoint
node -e "
const handler = require('./pages/api/rss-fetch').default;
handler().then(console.log);
"
```

### Test General Collection

```bash
# Test the general collection API
node -e "
const handler = require('./pages/api/fetch').default;
handler().then(console.log);
"
```

## Content Validation

The system includes robust content validation:

### Business Keywords
- income, money, earn, profit, revenue, salary, business
- startup, entrepreneur, freelance, side hustle, passive income
- online, remote, invest, make money, career, job, work
- marketing, sales, client, customer, service, product
- ecommerce, digital, strategy, growth, success

### Content Filters
- **Length Requirements**: Title 10-300 chars, Content 50-10000 chars
- **Banned Keywords**: porn, adult, nsfw, drug, illegal, hack, scam, gamble, casino
- **Business Content**: Must contain relevant business keywords
- **Duplicate Detection**: Prevents storing duplicate content

## Categories

Content is automatically categorized into:

- **business**: General business content
- **freelance**: Freelancing and gig work
- **passive-income**: Passive income strategies
- **ecommerce**: E-commerce and online stores
- **content-creation**: Blogs, YouTube, content creation
- **digital-products**: SaaS, apps, software
- **real-estate**: Property and real estate
- **digital-marketing**: SEO, social media, marketing
- **creative**: Design, photography, creative work
- **ai-services**: AI and automation services
- **startup**: Startup and funding content
- **investment**: Investment and trading
- **remote**: Remote work opportunities

## Performance Optimization

### Vercel Optimizations
- **Timeout Handling**: 15-second timeout for individual feeds
- **Batch Processing**: Processes feeds in small batches
- **Rate Limiting**: Prevents overwhelming external servers
- **Error Handling**: Graceful handling of failed feeds

### Collection Limits
- **Max Items per Feed**: 5-10 items (reduced for Vercel timeout)
- **Total Feeds**: 9 core feeds (optimized for reliability)
- **Batch Size**: 2 feeds per batch
- **Rate Limiting**: 1-second delay between batches

## Monitoring and Logging

### Console Output
The system provides detailed console logging:

```
🚀 Starting scheduled RSS data collection...
📊 Current database count: 2000
🔥 Collecting RSS data...
📡 Fetching RSS feed: Entrepreneur.com
✅ Entrepreneur.com: 7 valid cases
💾 Storing RSS cases in database...
🎯 RSS Collection Results:
   - Current count: 2000
   - RSS cases collected: 45
   - Successfully stored: 42
   - Duplicates skipped: 3
   - Final database count: 2042
   - Execution time: 4521ms
```

### API Response Format

```json
{
  "success": true,
  "message": "RSS data collection completed successfully",
  "currentCount": 2000,
  "newCases": 42,
  "duplicatesSkipped": 3,
  "finalCount": 2042,
  "executionTime": 4521
}
```

## Maintenance

### Adding New RSS Feeds

1. Edit `rss-config.json`
2. Add new feed to appropriate category
3. Set `"active": true`
4. Test locally with `node enhanced-rss-collector.js`

### Disabling Feeds

1. Edit `rss-config.json`
2. Set `"active": false` for the feed
3. The system will skip inactive feeds

### Updating Collection Settings

1. Edit `rss-config.json`
2. Modify `collection_settings` section
3. Adjust timeouts, batch sizes, and limits as needed

## Troubleshooting

### Common Issues

**RSS Feed Not Working:**
- Check if the RSS URL is valid
- Verify the feed is publicly accessible
- Check for rate limiting or blocking
- Review console error messages

**Timeout Errors:**
- Reduce `max_items_per_feed` in configuration
- Increase `timeout_ms` setting
- Remove problematic feeds temporarily

**Duplicate Content:**
- Ensure proper duplicate detection is working
- Check if source URLs are unique
- Review content validation rules

**Database Connection Issues:**
- Verify `DATABASE_URL` environment variable
- Check database connectivity
- Review PostgreSQL connection settings

## Integration with Existing System

The RSS collection system integrates seamlessly with the existing case collection infrastructure:

- **Database**: Uses the same PostgreSQL database and `cases` table
- **Validation**: Follows the same content validation rules
- **Categorization**: Uses the same categorization logic
- **Storage**: Stores data in the same format as other collectors
- **API**: Follows the same API response format

This allows the RSS system to work alongside Reddit scraping and other collection methods without conflicts.