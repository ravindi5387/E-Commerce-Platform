import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { pool } from './db.js'
import { requireAuth, requireAdmin, type AuthRequest } from './middleware.js'

dotenv.config()
const app = express()
const port = Number(process.env.PORT || 4000)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',').map(s => s.trim()) : true,
  credentials: true
}))
app.use(express.json({ limit: '1mb' }))

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(100)
})
const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(100)
})
const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(80),
  description: z.string().max(2000).default(''),
  price: z.number().nonnegative(),
  imageUrl: z.string().url(),
  stock: z.number().int().nonnegative()
})
const orderSchema = z.object({
  items: z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(50) })).min(1),
  shippingName: z.string().trim().min(2).max(120),
  shippingAddress: z.string().trim().min(5).max(1000)
})

function validationError(error: z.ZodError) {
  return error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ')
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', database: 'connected' })
  } catch {
    res.status(503).json({ status: 'error', database: 'unavailable', message: 'Check DATABASE_URL and run database/schema.sql.' })
  }
})

app.get('/api/products', async (req, res) => {
  try {
    const search = String(req.query.search || '').trim()
    const category = String(req.query.category || '').trim()
    const sort = String(req.query.sort || 'featured')
    const values: unknown[] = []
    let where = 'WHERE active = TRUE'
    if (search) {
      values.push(`%${search}%`)
      where += ` AND (name ILIKE $${values.length} OR description ILIKE $${values.length} OR category ILIKE $${values.length})`
    }
    if (category && category !== 'All products') {
      values.push(category)
      where += ` AND category = $${values.length}`
    }
    const orderBy = sort === 'low' ? 'price ASC' : sort === 'high' ? 'price DESC' : sort === 'name' ? 'name ASC' : 'id ASC'
    const result = await pool.query(
      `SELECT id, name, category, description, price::float AS price, image_url AS "imageUrl", stock
       FROM products ${where} ORDER BY ${orderBy}`, values
    )
    res.json({ products: result.rows })
  } catch (error) {
    console.error('List products failed:', error)
    res.status(500).json({ error: 'Could not load products. Check database configuration.' })
  }
})

app.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Invalid product id.' })
  try {
    const result = await pool.query(
      'SELECT id, name, category, description, price::float AS price, image_url AS "imageUrl", stock FROM products WHERE id = $1 AND active = TRUE', [id]
    )
    if (!result.rowCount) return res.status(404).json({ error: 'Product not found.' })
    res.json({ product: result.rows[0] })
  } catch (error) {
    console.error('Get product failed:', error)
    res.status(500).json({ error: 'Could not load product.' })
  }
})

app.post('/api/auth/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: validationError(parsed.error) })
  const { name, email, password } = parsed.data
  try {
    const hash = await bcrypt.hash(password, 12)
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email.toLowerCase(), hash]
    )
    res.status(201).json({ message: 'Account created. Please sign in.', user: result.rows[0] })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }
    console.error('Registration failed:', error)
    res.status(500).json({ error: 'Registration failed. Check database configuration.' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: validationError(parsed.error) })
  try {
    const result = await pool.query('SELECT id, name, email, password_hash, role FROM users WHERE email = $1', [parsed.data.email.toLowerCase()])
    const user = result.rows[0]
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password_hash))) {
      return res.status(401).json({ error: 'Email or password is incorrect.' })
    }
    if (!process.env.JWT_SECRET) return res.status(500).json({ error: 'JWT_SECRET is not configured on the server.' })
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.error('Login failed:', error)
    res.status(500).json({ error: 'Login failed. Check database configuration.' })
  }
})

app.get('/api/auth/me', requireAuth, (req: AuthRequest, res) => {
  res.json({ user: req.user })
})

app.post('/api/orders', requireAuth, async (req: AuthRequest, res) => {
  const parsed = orderSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: validationError(parsed.error) })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const normalized = new Map<number, number>()
    for (const item of parsed.data.items) normalized.set(item.productId, (normalized.get(item.productId) || 0) + item.quantity)
    const ids = [...normalized.keys()]
    const productsResult = await client.query(
      'SELECT id, name, price::float AS price, stock FROM products WHERE id = ANY($1::int[]) AND active = TRUE FOR UPDATE', [ids]
    )
    if (productsResult.rowCount !== ids.length) {
      await client.query('ROLLBACK')
      return res.status(400).json({ error: 'One or more products are unavailable.' })
    }
    const byId = new Map<number, { id: number; name: string; price: number; stock: number }>(
      productsResult.rows.map((p: { id: number; name: string; price: number; stock: number }) => [p.id, p])
    )
    let total = 0
    for (const [id, quantity] of normalized) {
      const p = byId.get(id)!
      if (p.stock < quantity) {
        await client.query('ROLLBACK')
        return res.status(400).json({ error: `Not enough stock for ${p.name}.` })
      }
      total += p.price * quantity
    }
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total, shipping_name, shipping_address) VALUES ($1,$2,$3,$4) RETURNING id, status, total, created_at',
      [req.user!.id, Number(total.toFixed(2)), parsed.data.shippingName, parsed.data.shippingAddress]
    )
    const order = orderResult.rows[0]
    for (const [id, quantity] of normalized) {
      const p = byId.get(id)!
      await client.query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price) VALUES ($1,$2,$3,$4,$5)',
        [order.id, id, p.name, quantity, p.price]
      )
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [quantity, id])
    }
    await client.query('COMMIT')
    res.status(201).json({ message: 'Order placed successfully.', order: { ...order, total: Number(order.total) } })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Create order failed:', error)
    res.status(500).json({ error: 'Could not create order.' })
  } finally {
    client.release()
  }
})

app.get('/api/orders/my', requireAuth, async (req: AuthRequest, res) => {
  try {
    const orders = await pool.query(
      `SELECT o.id, o.status, o.total::float AS total, o.shipping_name AS "shippingName",
              o.shipping_address AS "shippingAddress", o.created_at AS "createdAt",
              COALESCE(json_agg(json_build_object('productId', oi.product_id, 'productName', oi.product_name,
                'quantity', oi.quantity, 'unitPrice', oi.unit_price::float)) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
       FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1 GROUP BY o.id ORDER BY o.created_at DESC`, [req.user!.id]
    )
    res.json({ orders: orders.rows })
  } catch (error) {
    console.error('List orders failed:', error)
    res.status(500).json({ error: 'Could not load orders.' })
  }
})

app.post('/api/admin/products', requireAuth, requireAdmin, async (req, res) => {
  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: validationError(parsed.error) })
  try {
    const p = parsed.data
    const result = await pool.query(
      'INSERT INTO products (name, category, description, price, image_url, stock) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, category, description, price::float AS price, image_url AS "imageUrl", stock',
      [p.name, p.category, p.description, p.price, p.imageUrl, p.stock]
    )
    res.status(201).json({ product: result.rows[0] })
  } catch (error) {
    console.error('Create product failed:', error)
    res.status(500).json({ error: 'Could not create product.' })
  }
})

app.get('/api/admin/orders', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.id, o.status, o.total::float AS total, o.shipping_name AS "shippingName",
              o.shipping_address AS "shippingAddress", o.created_at AS "createdAt", u.name AS "customerName", u.email AS "customerEmail"
       FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC`
    )
    res.json({ orders: result.rows })
  } catch (error) {
    console.error('List admin orders failed:', error)
    res.status(500).json({ error: 'Could not load orders.' })
  }
})

app.use((_req, res) => res.status(404).json({ error: 'Endpoint not found.' }))
app.listen(port, () => console.log(`Verdant API listening on http://localhost:${port}`))