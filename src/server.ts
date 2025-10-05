import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { serve } from '@hono/node-server'

const app = new Hono()
const prisma = new PrismaClient()

// ✅ 全件取得
app.get('/tasks', async (c) => {
  const tasks = await prisma.task.findMany()
  return c.json(tasks)
})

// ✅ 新規作成
app.post('/tasks', async (c) => {
  const { title } = await c.req.json<{ title: string }>()
  const task = await prisma.task.create({
    data: { title },
  })
  return c.json(task, 201)
})

// ✅ 更新
app.put('/tasks/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const { completed } = await c.req.json<{ completed: boolean }>()
  const task = await prisma.task.update({
    where: { id },
    data: { completed },
  })
  return c.json(task)
})

// ✅ 削除
app.delete('/tasks/:id', async (c) => {
  const id = Number(c.req.param('id'))
  await prisma.task.delete({ where: { id } })
  return new Response('Deleted', { status: 204 })
})

// 👇これがないとサーバーは起動しない
serve({ fetch: app.fetch, port: 3000 })
console.log('Server running on http://localhost:3000')