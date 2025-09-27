import { Pool } from 'pg'
import { Case } from './types'

// 直接使用PostgreSQL连接
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// 数据库操作类
export class CaseRepository {
  // 获取所有案例（前端使用，保持向后兼容）
  static async getPublishedCases(limit = 20, offset = 0): Promise<Case[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM cases ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      )
      return result.rows
    } catch (error) {
      console.error('获取案例失败:', error)
      throw new Error('获取案例失败')
    } finally {
      client.release()
    }
  }

  // 获取单个案例（前端使用）
  static async getCaseById(id: number): Promise<Case | null> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM cases WHERE id = $1',
        [id]
      )
      return result.rows[0] || null
    } catch (error) {
      console.error('获取案例详情失败:', error)
      return null
    } finally {
      client.release()
    }
  }

  // 获取所有案例（前端使用，支持分页）
  static async getAllCases(limit = 20, offset = 0): Promise<Case[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM cases ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      )
      return result.rows
    } catch (error) {
      console.error('获取案例失败:', error)
      throw new Error('获取案例失败')
    } finally {
      client.release()
    }
  }

  // 创建新案例
  static async createCase(caseData: Omit<Case, 'id' | 'created_at'>): Promise<Case> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO cases (
          title, description, income, time_required, tools, steps, source_url, raw_content, published,
          category, difficulty, investment_required, skills_needed, target_audience, potential_risks,
          success_rate, time_to_profit, scalability, location_flexible, age_restriction, revenue_model,
          competition_level, market_trend, key_metrics, author, upvotes, comments_count, tags,
          admin_approved, admin_notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21,
          $22, $23, $24, $25, $26, $27, $28,
          $29, $30
        ) RETURNING *`,
        [
          caseData.title,
          caseData.description,
          caseData.income,
          caseData.time_required,
          caseData.tools,
          caseData.steps,
          caseData.source_url,
          caseData.raw_content,
          caseData.published,
          caseData.category,
          caseData.difficulty,
          caseData.investment_required,
          caseData.skills_needed,
          caseData.target_audience,
          caseData.potential_risks,
          caseData.success_rate,
          caseData.time_to_profit,
          caseData.scalability,
          caseData.location_flexible,
          caseData.age_restriction,
          caseData.revenue_model,
          caseData.competition_level,
          caseData.market_trend,
          caseData.key_metrics,
          caseData.author,
          caseData.upvotes,
          caseData.comments_count,
          caseData.tags,
          caseData.admin_approved || false,
          caseData.admin_notes || null
        ]
      )
      return result.rows[0]
    } catch (error) {
      console.error('创建案例失败:', error)
      throw new Error('创建案例失败')
    } finally {
      client.release()
    }
  }

  // 更新发布状态
  static async updatePublishStatus(id: number, published: boolean): Promise<void> {
    const client = await pool.connect()
    try {
      await client.query(
        'UPDATE cases SET published = $1 WHERE id = $2',
        [published, id]
      )
    } catch (error) {
      console.error('更新发布状态失败:', error)
      throw new Error('更新发布状态失败')
    } finally {
      client.release()
    }
  }

  // 批量更新发布状态
  static async batchUpdatePublishStatus(ids: number[], published: boolean): Promise<number> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'UPDATE cases SET published = $1 WHERE id = ANY($2::int[]) RETURNING id',
        [published, ids]
      )
      return result.rowCount || 0
    } catch (error) {
      console.error('批量更新发布状态失败:', error)
      throw new Error('批量更新发布状态失败')
    } finally {
      client.release()
    }
  }

  // 检查案例是否已存在（根据source_url）
  static async caseExists(sourceUrl: string): Promise<boolean> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT id FROM cases WHERE source_url = $1',
        [sourceUrl]
      )
      return result.rows.length > 0
    } catch (error) {
      console.error('检查案例存在性失败:', error)
      return false
    } finally {
      client.release()
    }
  }

  // 清理所有数据
  static async clearAllData(): Promise<number> {
    const client = await pool.connect()
    try {
      const result = await client.query('DELETE FROM cases RETURNING id')
      console.log(`已清理 ${result.rowCount} 条数据`)
      return result.rowCount || 0
    } catch (error) {
      console.error('清理数据失败:', error)
      throw new Error('清理数据失败')
    } finally {
      client.release()
    }
  }

  // 数据库连接测试
  static async testConnection(): Promise<boolean> {
    const client = await pool.connect()
    try {
      await client.query('SELECT 1')
      return true
    } catch (error) {
      console.error('数据库连接失败:', error)
      return false
    } finally {
      client.release()
    }
  }

  // 初始化数据库表
  static async initTables(): Promise<void> {
    const client = await pool.connect()
    try {
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          -- 新增字段
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
          tags TEXT[],
          -- 管理字段
          admin_approved BOOLEAN DEFAULT false,
          admin_notes TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_cases_published ON cases(published);
        CREATE INDEX IF NOT EXISTS idx_cases_created ON cases(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_cases_source_url ON cases(source_url);
        CREATE INDEX IF NOT EXISTS idx_cases_category ON cases(category);
        CREATE INDEX IF NOT EXISTS idx_cases_difficulty ON cases(difficulty);
      `)
      console.log('数据库表初始化成功')
    } catch (error) {
      console.error('数据库表初始化失败:', error)
      throw new Error('数据库表初始化失败')
    } finally {
      client.release()
    }
  }
}

export type { Case }

// 保持向后兼容
export const supabase = null
export const supabaseAdmin = null