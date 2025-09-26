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
  // 获取已发布案例（前端使用）
  static async getPublishedCases(limit = 20, offset = 0): Promise<Case[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM cases WHERE published = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
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
        'SELECT * FROM cases WHERE id = $1 AND published = true',
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

  // 获取所有案例（管理后台使用）
  static async getAllCases(): Promise<Case[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM cases ORDER BY created_at DESC'
      )
      return result.rows
    } catch (error) {
      console.error('获取所有案例失败:', error)
      throw new Error('获取所有案例失败')
    } finally {
      client.release()
    }
  }

  // 创建新案例
  static async createCase(caseData: Omit<Case, 'id' | 'created_at'>): Promise<Case> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO cases (title, description, income, time_required, tools, steps, source_url, raw_content, published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          caseData.title,
          caseData.description,
          caseData.income,
          caseData.time_required,
          caseData.tools,
          caseData.steps,
          caseData.source_url,
          caseData.raw_content,
          caseData.published
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_cases_published ON cases(published);
        CREATE INDEX IF NOT EXISTS idx_cases_created ON cases(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_cases_source_url ON cases(source_url);
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