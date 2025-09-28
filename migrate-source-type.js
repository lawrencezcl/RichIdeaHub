const { Pool } = require('pg')

// 数据库连接配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/sidehustle',
  ssl: {
    rejectUnauthorized: false
  }
})

async function migrateSourceType() {
  const client = await pool.connect()
  try {
    console.log('开始数据源类型迁移...')

    // 检查source_type列是否存在
    const checkColumnQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'cases'
      AND column_name = 'source_type'
    `
    const columnResult = await client.query(checkColumnQuery)

    if (columnResult.rows.length === 0) {
      console.log('source_type列不存在，正在添加...')
      await client.query(`
        ALTER TABLE cases
        ADD COLUMN source_type TEXT CHECK (source_type IN ('reddit', 'producthunt', 'indiehackers', 'other'))
      `)
      console.log('source_type列添加成功')
    } else {
      console.log('source_type列已存在')
    }

    // 为现有记录推断并设置source_type
    console.log('开始更新现有记录的source_type...')

    // 基于source_url推断数据源类型
    const updateQuery = `
      UPDATE cases
      SET source_type =
        CASE
          WHEN source_url LIKE '%reddit.com%' THEN 'reddit'
          WHEN source_url LIKE '%producthunt.com%' THEN 'producthunt'
          WHEN source_url LIKE '%indiehackers.com%' THEN 'indiehackers'
          ELSE 'other'
        END
      WHERE source_type IS NULL
    `

    const result = await client.query(updateQuery)
    console.log(`已更新 ${result.rowCount} 条记录的source_type`)

    // 创建索引
    console.log('创建索引...')
    await client.query('CREATE INDEX IF NOT EXISTS idx_cases_source_type ON cases(source_type)')
    console.log('索引创建成功')

    // 查看更新后的统计信息
    const statsQuery = `
      SELECT
        source_type,
        COUNT(*) as count
      FROM cases
      GROUP BY source_type
      ORDER BY count DESC
    `

    const statsResult = await client.query(statsQuery)
    console.log('\n数据源统计:')
    statsResult.rows.forEach(row => {
      console.log(`${row.source_type || 'NULL'}: ${row.count} 条记录`)
    })

    console.log('\n✅ 数据源类型迁移完成!')

  } catch (error) {
    console.error('迁移失败:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// 运行迁移
migrateSourceType().catch(console.error)