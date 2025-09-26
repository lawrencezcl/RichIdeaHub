# Rich Idea Hub - Vercel Environment Variables Configuration
# 请在 Vercel 控制台中手动配置以下环境变量：

# 数据库配置 (必需) - Neon PostgreSQL
DATABASE_URL=postgresql://neondb_owner:npg_w9QEDSlLkyT3@ep-jolly-hill-adhlaq48-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# AI API 配置 (可选)
OPENAI_API_KEY=your_openai_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DOUBAO_API_KEY=your_doubao_api_key_here
QWEN_API_KEY=your_qwen_api_key_here

# 管理员密码 (可选，默认为 admin123)
ADMIN_PASSWORD=your_secure_admin_password

# 站点 URL (可选，用于生成链接)
NEXT_PUBLIC_SITE_URL=https://your-vercel-app-url.vercel.app

# 其他可选配置
NODE_ENV=production