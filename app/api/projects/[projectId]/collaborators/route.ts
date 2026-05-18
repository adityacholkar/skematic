import { auth, clerkClient, currentUser } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

type Ctx = { params: Promise<{ projectId: string }> }

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await ctx.params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })

  const isOwner = project.ownerId === userId

  if (!isOwner) {
    const user = await currentUser()
    const email = user?.emailAddresses[0]?.emailAddress
    if (!email) return Response.json({ error: "Forbidden" }, { status: 403 })
    const collab = await prisma.projectCollaborator.findFirst({ where: { projectId, email } })
    if (!collab) return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const records = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  })

  const emails = records.map((r) => r.email)

  let collaborators: Array<{ email: string; name: string | null; imageUrl: string | null }> = []

  if (emails.length > 0) {
    const client = await clerkClient()
    const { data: users } = await client.users.getUserList({
      emailAddress: emails,
      limit: Math.max(emails.length, 10),
    })

    const byEmail = new Map(
      users.flatMap((u) => u.emailAddresses.map((e) => [e.emailAddress, u]))
    )

    collaborators = records.map((r) => {
      const u = byEmail.get(r.email)
      const name = u ? (u.fullName ?? u.firstName ?? null) : null
      return { email: r.email, name, imageUrl: u?.imageUrl ?? null }
    })
  }

  return Response.json({ collaborators, isOwner })
}

export async function POST(request: NextRequest, ctx: Ctx) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await ctx.params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.ownerId !== userId) return Response.json({ error: "Forbidden" }, { status: 403 })

  const body: unknown = await request.json().catch(() => ({}))
  const rawEmail =
    typeof body === "object" && body !== null && "email" in body && typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email.trim().toLowerCase()
      : null

  if (!rawEmail || !rawEmail.includes("@")) {
    return Response.json({ error: "Invalid email" }, { status: 400 })
  }

  const existing = await prisma.projectCollaborator.findFirst({ where: { projectId, email: rawEmail } })
  if (existing) return Response.json({ error: "Already a collaborator" }, { status: 409 })

  const collab = await prisma.projectCollaborator.create({ data: { projectId, email: rawEmail } })

  return Response.json({ collaborator: { email: collab.email } }, { status: 201 })
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await ctx.params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.ownerId !== userId) return Response.json({ error: "Forbidden" }, { status: 403 })

  const body: unknown = await request.json().catch(() => ({}))
  const rawEmail =
    typeof body === "object" && body !== null && "email" in body && typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email.trim().toLowerCase()
      : null

  if (!rawEmail) return Response.json({ error: "Invalid email" }, { status: 400 })

  await prisma.projectCollaborator.deleteMany({ where: { projectId, email: rawEmail } })

  return new Response(null, { status: 204 })
}
