import { Pool } from 'pg';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function initDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  const client = await pool.connect();
  
  try {
    console.log('🔌 连接到Neon数据库...');
    
    // 测试连接
    await client.query('SELECT 1');
    console.log('✅ 数据库连接成功！');
    
    // 创建表
    console.log('📋 创建数据库表...');
    await client.query(`
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
    `);
    console.log('✅ cases表创建成功！');
    
    // 创建索引
    console.log('🔍 创建索引...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cases_published ON cases(published);
      CREATE INDEX IF NOT EXISTS idx_cases_created ON cases(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_cases_source_url ON cases(source_url);
    `);
    console.log('✅ 索引创建成功！');
    
    // 插入测试数据
    console.log('📝 插入测试数据...');
    const testData = {
      title: '在线英语辅导',
      description: '通过在线平台为学生提供英语辅导服务，灵活的时间安排让您在空闲时间赚取额外收入',
      income: '$20-50/小时',
      time_required: '10-20小时/周',
      tools: 'Zoom,Skype,Google Meet',
      steps: '1. 注册在线辅导平台\n2. 完善个人资料和教学经验\n3. 设置课程价格和时间\n4. 开始接受学生预约',
      source_url: 'https://example.com/tutoring-test',
      raw_content: '这是一个测试案例的原始内容...',
      published: true
    };
    
    await client.query(`
      INSERT INTO cases (title, description, income, time_required, tools, steps, source_url, raw_content, published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT DO NOTHING
    `, [
      testData.title,
      testData.description,
      testData.income,
      testData.time_required,
      testData.tools,
      testData.steps,
      testData.source_url,
      testData.raw_content,
      testData.published
    ]);
    
    // 检查数据
    const result = await client.query('SELECT COUNT(*) as count FROM cases');
    console.log(`✅ 测试数据插入成功！当前案例数量: ${result.rows[0].count}`);
    
    console.log('🎉 数据库初始化完成！');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();