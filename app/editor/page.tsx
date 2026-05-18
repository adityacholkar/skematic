import { auth } from "@clerk/nextjs/server"
import { getOwnedProjects, getSharedProjects } from "@/lib/data/projects"
import { EditorHomeShell } from "@/components/editor/editor-home-shell"

export default async function EditorPage() {
  const { userId } = await auth()
  const [ownedProjects, sharedProjects] = await Promise.all([
    userId ? getOwnedProjects(userId) : Promise.resolve([]),
    getSharedProjects(),
  ])
  return <EditorHomeShell ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
}
