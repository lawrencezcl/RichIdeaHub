# Vercel 手动重新部署指南

## 问题诊断
最新提交包含数据库环境变量配置，但Vercel部署未自动触发。

## 解决步骤

### 1. 访问 Vercel 控制台
- 打开 https://vercel.com/dashboard
- 登录您的账户
- 找到 "Rich Idea Hub" 项目

### 2. 配置环境变量
在项目设置中添加以下环境变量：
```
DATABASE_URL = postgresql://neondb_owner:npg_w9QEDSlLkyT3@ep-jolly-hill-adhlaq48-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
ADMIN_PASSWORD = admin123
NEXT_PUBLIC_SITE_URL = https://rich-idea-kl9qt7y8l-lawrencezcls-projects.vercel.app
```

### 3. 手动重新部署
- 在项目页面点击 "Deployments" 标签
- 找到最新的部署
- 点击右上角的三个点 "..."
- 选择 "Redeploy"

### 4. 验证部署
部署完成后，访问：https://rich-idea-kl9qt7y8l-lawrencezcls-projects.vercel.app
- 案例列表页面应该能正常加载
- 管理后台应该能正常登录

### 5. 测试数据库连接
访问健康检查端点：https://rich-idea-kl9qt7y8l-lawrencezcls-projects.vercel.app/api/health
应该返回数据库连接状态信息。

## 备用方案
如果手动部署仍失败，请检查：
1. Vercel 项目的 GitHub 集成设置
2. GitHub Webhooks 是否正常工作
3. 考虑重新连接 GitHub 仓库