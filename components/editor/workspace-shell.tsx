"use client"

import { useRef, useState } from "react"
import { useProjectActions } from "@/hooks/use-project-actions"
import { ProjectActionsContext } from "@/contexts/project-dialogs-context"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogs } from "./project-dialogs"
import { WorkspaceNavbar } from "./workspace-navbar"
import { ShareDialog } from "./share-dialog"
import type { ProjectSummary } from "@/lib/data/projects"

interface WorkspaceShellProps {
  project: { id: string; name: string; isOwner: boolean }
  ownedProjects: ProjectSummary[]
  sharedProjects: ProjectSummary[]
}

export function WorkspaceShell({ project, ownedProjects, sharedProjects }: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const sidebarToggleRef = useRef<HTMLButtonElement>(null)
  const actions = useProjectActions(project.id)

  return (
    <ProjectActionsContext.Provider value={actions}>
      <WorkspaceNavbar
        projectName={project.name}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((prev) => !prev)}
        onOpenShare={() => setIsShareOpen(true)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        toggleRef={sidebarToggleRef}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={project.id}
      />
      <div className="flex h-full pt-12">
        <main className="flex flex-1 items-center justify-center bg-bg-base">
          <p className="text-sm text-text-faint">Canvas coming soon</p>
        </main>
        {isAiSidebarOpen && (
          <aside className="flex w-80 shrink-0 flex-col border-l border-border-default bg-bg-surface">
            <div className="flex h-12 shrink-0 items-center border-b border-border-default px-4">
              <span className="text-sm font-medium text-text-primary">AI Assistant</span>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-text-faint">AI chat coming soon</p>
            </div>
          </aside>
        )}
      </div>
      <ProjectDialogs {...actions} />
      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        projectId={project.id}
        isOwner={project.isOwner}
      />
    </ProjectActionsContext.Provider>
  )
}
