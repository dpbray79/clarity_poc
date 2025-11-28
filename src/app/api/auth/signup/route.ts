import { NextRequest, NextResponse } from 'next/server'
import { createUser, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }
    
    const user = await createUser(email, password,name)
    const token = generateToken(user)
    
    return NextResponse.json({
      user,
      token
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
