# Rich Idea Hub

AI-powered side hustle idea aggregation platform that collects and structures real case studies from Reddit, ProductHunt, and IndieHackers.

## 🚀 Live Demo
**https://rich-idea-hub.vercel.app**

## ✨ Features

### Core Functionality
- **Multi-source Data Collection**: Automatically scrapes side hustle cases from Reddit, ProductHunt, and IndieHackers
- **AI-Powered Processing**: Uses OpenAI GPT to structure and analyze raw content into detailed case studies
- **Direct Publishing**: No approval process - all collected cases are immediately available
- **Smart categorization**: Automatically categorizes by difficulty, investment required, and skills needed

### Technical Features
- **Vercel Cron Jobs**: Hourly automated data collection
- **PostgreSQL Database**: Scalable data storage with connection pooling
- **Next.js 15**: Modern React framework with App Router
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern styling
- **Responsive Design**: Works on all devices

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Reddit API   │    │  ProductHunt   │    │  IndieHackers   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌───────────▼───────────┐
                    │   Data Fetcher        │
                    │   (/api/fetch)       │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   AI Processor        │
                    │   (OpenAI GPT)        │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   PostgreSQL         │
                    │   Database           │
                    └───────────┬───────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
┌─────────▼─────────┐ ┌─────────▼─────────┐ ┌─────────▼─────────┐
│   Frontend        │ │   Admin Panel     │ │   API Endpoints   │
│   (/cases)        │ │   (/admin)        │ │   (/api/*)         │
└───────────────────┘ └───────────────────┘ └───────────────────┘
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Vercel account (for deployment)

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"

# Optional
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

### Setup Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/lawrencezcl/RichIdeaHub.git
   cd RichIdeaHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Initialize database**
   ```bash
   # The database tables will be auto-created on first run
   npm run dev
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Data Collection

### Automated Collection
- **Cron Job**: Runs every hour at minute 0
- **Endpoint**: `POST /api/fetch`
- **Sources**: Reddit (10 subreddits), ProductHunt, IndieHackers
- **Processing**: AI structures raw content into detailed case studies

### Manual Collection
1. **Admin Panel**: Visit `/admin` and click "🚀 抓取新案例"
2. **API Call**:
   ```bash
   curl -X POST https://your-domain.com/api/fetch
   ```
3. **Bulk Collection** (300 cases):
   ```bash
   curl -X POST https://your-domain.com/api/bulk-fetch
   ```

## 🗄️ Database Schema

### Cases Table
```sql
CREATE TABLE cases (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  income TEXT,
  time_required TEXT,
  tools TEXT,
  steps TEXT,
  source_url TEXT,
  raw_content TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  investment_required TEXT,
  skills_needed TEXT,
  target_audience TEXT,
  potential_risks TEXT,
  success_rate TEXT,
  time_to_profit TEXT,
  scalability TEXT,
  location_flexible BOOLEAN DEFAULT false,
  age_restriction TEXT,
  revenue_model TEXT,
  competition_level TEXT,
  market_trend TEXT,
  key_metrics TEXT,
  author TEXT,
  upvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  tags TEXT[]
);
```

## 🚀 Deployment

### Vercel Deployment
1. **Connect to GitHub**
   - Link your repository to Vercel
   - Configure environment variables
   - Deploy automatically on push

2. **Environment Variables on Vercel**
   ```bash
   DATABASE_URL=postgresql://...
   OPENAI_API_KEY=sk-...
   NEXT_PUBLIC_SITE_URL=https://rich-idea-hub.vercel.app
   ```

3. **Cron Job Configuration**
   - Automatically configured via `vercel.json`
   - Runs hourly: `0 * * * *`
   - Endpoint: `/api/fetch` (POST method)

### Local Build
```bash
npm run build
npm start
```

## 🔧 API Endpoints

### Public APIs
- `GET /api/cases` - Get paginated list of cases
- `GET /api/cases/[id]` - Get specific case details
- `GET /api/health` - Health check

### Admin APIs
- `GET /api/admin` - Get all cases (admin panel)
- `POST /api/fetch` - Trigger data collection
- `POST /api/bulk-fetch` - Trigger bulk data collection (300 cases)

## 📈 Performance & Scaling

### Database Optimization
- Connection pooling with `pg`
- Indexed columns for fast queries
- Pagination support

### AI Processing
- Batch processing to avoid rate limits
- Fallback content for processing failures
- Error handling and logging

### Frontend
- Server-side rendering with Next.js
- Static generation for better performance
- Lazy loading and code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Built with ❤️ using Next.js, PostgreSQL, and OpenAI GPT**
