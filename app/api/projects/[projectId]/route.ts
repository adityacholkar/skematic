import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

type Ctx = RouteContext<'/api/projects/[projectId]'>

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await ctx.params

  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body: unknown = await request.json().catch(() => ({}))
  const name =
    typeof body === 'object' && body !== null && 'name' in body && typeof body.name === 'string' && body.name.trim()
      ? (body as { name: string }).name.trim()
      : project.name

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: { name },
  })

  return Response.json({ project: updated })
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await ctx.params

  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.project.delete({ where: { id: projectId } })

  return new Response(null, { status: 204 })
}
