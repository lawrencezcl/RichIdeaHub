import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function POST() {
  try {
    console.log('🔄 开始数据库迁移 - 添加 source_type 字段...')

    // 使用应用相同的数据库连接配置
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/sidehustle',
      ssl: {
        rejectUnauthorized: false
      }
    })

    const client = await pool.connect()

    try {
      // 检查 source_type 列是否存在
      const checkColumnQuery = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'cases'
        AND column_name = 'source_type'
      `
      const columnResult = await client.query(checkColumnQuery)

      if (columnResult.rows.length === 0) {
        console.log('source_type 列不存在，正在添加...')
        await client.query(`
          ALTER TABLE cases
          ADD COLUMN source_type TEXT CHECK (source_type IN ('reddit', 'producthunt', 'indiehackers', 'other'))
        `)
        console.log('source_type 列添加成功')
      } else {
        console.log('source_type 列已存在')
      }

      // 为现有记录推断并设置 source_type
      console.log('开始更新现有记录的 source_type...')

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
      console.log(`已更新 ${result.rowCount} 条记录的 source_type`)

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

      return NextResponse.json({
        success: true,
        message: '数据库迁移完成',
        stats: statsResult.rows,
        updatedRecords: result.rowCount
      })

    } finally {
      client.release()
      await pool.end()
    }

  } catch (error) {
    console.error('迁移失败:', error)
    return NextResponse.json({
      success: false,
      error: '迁移失败: ' + (error as Error).message
    }, { status: 500 })
  }
}