import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export interface Identity {
  userId: string
  email: string | null
}

export interface ProjectAccess {
  id: string
  name: string
  isOwner: boolean
}

export async function getCurrentIdentity(): Promise<Identity | null> {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? null
  return { userId, email }
}

export async function getProjectAccess(
  roomId: string,
  userId: string,
  email: string | null
): Promise<ProjectAccess | null> {
  const project = await prisma.project.findUnique({
    where: { id: roomId },
    select: { id: true, name: true, ownerId: true },
  })

  if (!project) return null
  if (project.ownerId === userId) return { id: project.id, name: project.name, isOwner: true }

  if (email) {
    const collab = await prisma.projectCollaborator.findFirst({
      where: { projectId: project.id, email },
    })
    if (collab) return { id: project.id, name: project.name, isOwner: false }
  }

  return null
}
