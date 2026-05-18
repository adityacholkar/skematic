import { prisma } from "@/lib/prisma"

export interface ProjectSummary {
  id: string
  name: string
}

export async function getOwnedProjects(userId: string): Promise<ProjectSummary[]> {
  return prisma.project.findMany({
    where: { ownerId: userId },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getSharedProjects(email: string): Promise<ProjectSummary[]> {
  const collaborations = await prisma.projectCollaborator.findMany({
    where: { email },
    select: { project: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return collaborations.map((c) => c.project)
}
