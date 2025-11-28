import { query } from './database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface User {
  id: string
  email: string
  full_name: string
  native_language?: string
  target_accent?: string
  cefr_level?: string
  created_at: string
}

// Create new user
export async function createUser(email: string, password: string, fullName: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name) 
     VALUES ($1, $2, $3) 
     RETURNING id, email, full_name, native_language, target_accent, cefr_level, created_at`,
    [email, hashedPassword, fullName]
  )
  
  return result.rows[0]
}

// Verify user credentials
export async function verifyUser(email: string, password: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  
  if (result.rows.length === 0) {
    return null
  }
  
  const user = result.rows[0]
  const isValid = await bcrypt.compare(password, user.password_hash)
  
  if (!isValid) {
    return null
  }
  
  // Return user without password
  const { password_hash, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verify JWT token
export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch {
    return null
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const result = await query(
    `SELECT id, email, full_name, native_language, target_accent, cefr_level, created_at 
     FROM users WHERE id = $1`,
    [userId]
  )
  
  return result.rows[0] || null
}
