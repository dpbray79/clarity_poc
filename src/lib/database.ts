import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const query = async (text: string, params?: any[]) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export const getClient = async () => {
  const client = await pool.connect()
  return client
}

// Database health check
export const healthCheck = async () => {
  try {
    const result = await query('SELECT NOW()')
    return { healthy: true, timestamp: result.rows[0].now }
  } catch (error) {
    return { healthy: false, error: error.message }
  }
}
