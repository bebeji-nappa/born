import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import users from './routes/users'
import posts from './routes/posts'
import auth from './routes/auth'
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono()

app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
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

if (process.env.NODE_ENV === 'development') {
  serve({
    fetch: app.fetch,
    port: 8000,
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })
} else {
  handle(app);
}
