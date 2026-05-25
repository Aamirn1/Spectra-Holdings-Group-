import { NextRequest } from 'next/server'

// Simple hash function for passwords (in production, use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'spectra_salt_2024')
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

// Simple token generation (in production, use JWT with proper secret)
export function generateToken(userId: string, email: string, role: string): string {
  const payload = { userId, email, role, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }
  return btoa(JSON.stringify(payload))
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp && payload.exp < Date.now()) return null
    return { userId: payload.userId, email: payload.email, role: payload.role }
  } catch {
    return null
  }
}

export function getAuthUser(request: NextRequest): { userId: string; email: string; role: string } | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.substring(7)
  return verifyToken(token)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
