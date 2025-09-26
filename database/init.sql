-- 副业案例聚合平台 - 数据库初始化脚本
-- 在Supabase SQL编辑器中执行此脚本

-- 创建案例表
CREATE TABLE IF NOT EXISTS cases (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  income TEXT,
  time_required TEXT,
  tools TEXT,
  steps TEXT,
  source_url TEXT,
  raw_content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_cases_published 
ON cases(published);

CREATE INDEX IF NOT EXISTS idx_cases_created 
ON cases(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cases_source_url 
ON cases(source_url);

-- 插入测试数据（可选）
INSERT INTO cases (
  title, 
  description, 
  income, 
  time_required, 
  tools, 
  steps, 
  source_url, 
  published
) VALUES 
(
  '在线英语辅导',
  '通过在线平台为学生提供英语辅导服务，灵活的时间安排让您在空闲时间赚取额外收入',
  '$20-50/小时',
  '10-20小时/周',
  'Zoom, Skype, Google Meet',
  '1. 注册在线辅导平台\n2. 完善个人资料和教学经验\n3. 设置课程价格和时间\n4. 开始接受学生预约',
  'https://example.com/tutoring',
  true
),
(
  '自制手工皂销售',
  '制作天然手工皂并通过社交媒体和在线平台销售，适合对手工艺品有兴趣的创业者',
  '$300-800/月',
  '5-10小时/周',
  'Etsy, Instagram, 原材料供应商',
  '1. 学习手工皂制作技术\n2. 采购原材料和模具\n3. 制作产品并拍摄照片\n4. 在Etsy开店销售\n5. 通过社交媒体推广',
  'https://example.com/handmade-soap',
  true
);

-- 验证数据插入
SELECT COUNT(*) as total_cases FROM cases;
SELECT COUNT(*) as published_cases FROM cases WHERE published = true;