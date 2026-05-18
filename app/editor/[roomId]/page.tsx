import { redirect } from "next/navigation"
import { getCurrentIdentity, getProjectAccess } from "@/lib/project-access"
import { getOwnedProjects, getSharedProjects } from "@/lib/data/projects"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"

interface PageProps {
  params: Promise<{ roomId: string }>
}

export default async function WorkspacePage({ params }: PageProps) {
  const { roomId } = await params

  const identity = await getCurrentIdentity()
  if (!identity) redirect("/sign-in")

  const project = await getProjectAccess(roomId, identity.userId, identity.email)
  if (!project) return <AccessDenied />

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(identity.userId),
    identity.email ? getSharedProjects(identity.email) : Promise.resolve([]),
  ])

  return (
    <WorkspaceShell
      project={project}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
