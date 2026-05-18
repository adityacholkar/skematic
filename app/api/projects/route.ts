import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json({ projects })
}

const ROOM_ID_RE = /^[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$/

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => ({}))
  const isObj = typeof body === 'object' && body !== null

  const name =
    isObj && 'name' in body && typeof (body as { name: unknown }).name === 'string' && (body as { name: string }).name.trim()
      ? (body as { name: string }).name.trim()
      : 'Untitled Project'

  const rawId = isObj && 'id' in body && typeof (body as { id: unknown }).id === 'string'
    ? (body as { id: string }).id
    : undefined

  const customId = rawId && ROOM_ID_RE.test(rawId) ? rawId : undefined

  const project = await prisma.project.create({
    data: { ...(customId ? { id: customId } : {}), ownerId: userId, name },
  })

  return Response.json({ project }, { status: 201 })
}
