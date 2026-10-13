import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export type AuthRequest = Request & { user?: { id: number; email: string; role: string } }

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.header('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ error: 'Authentication token is required.' })
  const secret = process.env.JWT_SECRET
  if (!secret) return res.status(500).json({ error: 'Server authentication is not configured.' })
  try {
    req.user = jwt.verify(token, secret) as { id: number; email: string; role: string }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Administrator access required.' })
  next()
}