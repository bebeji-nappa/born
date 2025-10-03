import { Hono } from 'hono'
import { cors } from 'hono/cors'
import users from './routes/users'
import posts from './routes/posts'
import auth from './routes/auth'
import upload from './routes/upload'
import blogs from './routes/blogs'

type Bindings = {
  DATABASE_URL: string
  AUTH_GITHUB_ID: string
  AUTH_GITHUB_SECRET: string
  API_BASE_URL: string
  FRONTEND_URL: string
  ALLOW_EMAIL: string
  NODE_ENV: string
  STORAGE: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors({
  origin: (origin, c) => {
    const frontendUrl = c.env.FRONTEND_URL || 'http://localhost:3000'
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://blog.bebeji-nappa.com',
      'https://staging.bebeji-nappa.com',
      frontendUrl
    ]

    return allowedOrigins.includes(origin || '') ? origin : null
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposeHeaders: ['Set-Cookie'],
}))

app.get('/', (c) => {
  return c.text('Hello Hono API!')
})

app.route('/api/auth', auth)
app.route('/api/users', users)
app.route('/api/posts', posts)
app.route('/api/upload', upload)
app.route('/api/blogs', blogs)

export default app
