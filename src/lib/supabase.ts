import { Pool } from 'pg'
import { Case } from './types'

// 直接使用PostgreSQL连接
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/sidehustle',
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
      // Return empty array instead of throwing error for better UX
      return []
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
          admin_approved, admin_notes, source_type
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21,
          $22, $23, $24, $25, $26, $27, $28,
          $29, $30, $31
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
          caseData.admin_notes || null,
          caseData.source_type || null
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

  // 更新案例的详细数据
  static async updateCaseData(id: number, data: {
    income: string
    time_required: string
    tools: string
    steps: string
    category: string
    difficulty: string
    investment_required: string
    skills_needed: string
    target_audience: string
    potential_risks: string
    success_rate: string
    time_to_profit: string
    scalability: string
    location_flexible: boolean
    age_restriction: string
    revenue_model: string
    competition_level: string
    market_trend: string
    key_metrics: string
    tags: string[]
  }): Promise<void> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        UPDATE cases SET
          income = $1,
          time_required = $2,
          tools = $3,
          steps = $4,
          category = $5,
          difficulty = $6,
          investment_required = $7,
          skills_needed = $8,
          target_audience = $9,
          potential_risks = $10,
          success_rate = $11,
          time_to_profit = $12,
          scalability = $13,
          location_flexible = $14,
          age_restriction = $15,
          revenue_model = $16,
          competition_level = $17,
          market_trend = $18,
          key_metrics = $19,
          tags = $20
        WHERE id = $21
      `, [
        data.income,
        data.time_required,
        data.tools,
        data.steps,
        data.category,
        data.difficulty,
        data.investment_required,
        data.skills_needed,
        data.target_audience,
        data.potential_risks,
        data.success_rate,
        data.time_to_profit,
        data.scalability,
        data.location_flexible,
        data.age_restriction,
        data.revenue_model,
        data.competition_level,
        data.market_trend,
        data.key_metrics,
        data.tags,
        id
      ])

      if (result.rowCount === 0) {
        console.warn(`未找到ID为 ${id} 的案例进行更新`)
      } else {
        console.log(`成功更新案例 ${id} 的详细数据`)
      }
    } catch (error) {
      console.error(`更新案例 ${id} 数据失败:`, error)
      throw new Error(`更新案例数据失败: ${(error as Error).message}`)
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
          admin_notes TEXT,
          -- 数据源类型
          source_type TEXT CHECK (source_type IN ('reddit', 'producthunt', 'indiehackers', 'other'))
        );

        CREATE INDEX IF NOT EXISTS idx_cases_published ON cases(published);
        CREATE INDEX IF NOT EXISTS idx_cases_created ON cases(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_cases_source_url ON cases(source_url);
        CREATE INDEX IF NOT EXISTS idx_cases_category ON cases(category);
        CREATE INDEX IF NOT EXISTS idx_cases_difficulty ON cases(difficulty);
        CREATE INDEX IF NOT EXISTS idx_cases_source_type ON cases(source_type);
      `)
      console.log('数据库表初始化成功')
    } catch (error) {
      console.error('数据库表初始化失败:', error)
      throw new Error('数据库表初始化失败')
    } finally {
      client.release()
    }
  }

  // 获取所有案例（管理后台用，支持搜索和过滤）
  static async getAllCasesWithFilters(
    search?: string,
    sourceType?: string,
    status?: string,
    category?: string,
    limit = 1000,
    offset = 0
  ): Promise<{ cases: Case[], total: number }> {
    const client = await pool.connect()
    try {
      let query = 'SELECT * FROM cases WHERE 1=1'
      const params: (string | number | boolean)[] = []
      let paramIndex = 1

      if (search) {
        query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`
        params.push(`%${search}%`)
        paramIndex++
      }

      if (sourceType && sourceType !== 'all') {
        query += ` AND source_type = $${paramIndex}`
        params.push(sourceType)
        paramIndex++
      }

      if (status) {
        if (status === 'published') {
          query += ` AND published = true`
        } else if (status === 'draft') {
          query += ` AND published = false`
        }
      }

      if (category && category !== 'all') {
        query += ` AND category = $${paramIndex}`
        params.push(category)
        paramIndex++
      }

      // 获取总数
      const countQuery = query.replace('SELECT * FROM', 'SELECT COUNT(*) FROM')
      const countResult = await client.query(countQuery, params)
      const total = parseInt(countResult.rows[0].count)

      // 添加排序和分页
      query += ' ORDER BY created_at DESC LIMIT $' + paramIndex + ' OFFSET $' + (paramIndex + 1)
      params.push(limit, offset)

      const result = await client.query(query, params)
      return { cases: result.rows, total }
    } catch (error) {
      console.error('获取过滤案例失败:', error)
      return { cases: [], total: 0 }
    } finally {
      client.release()
    }
  }

  // 获取所有不同的分类
  static async getAllCategories(): Promise<string[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT DISTINCT category FROM cases WHERE category IS NOT NULL AND category != \'\' ORDER BY category'
      )
      return result.rows.map(row => row.category)
    } catch (error) {
      console.error('获取分类失败:', error)
      return []
    } finally {
      client.release()
    }
  }
}

export type { Case }

// 保持向后兼容
export const supabase = null
export const supabaseAdmin = null