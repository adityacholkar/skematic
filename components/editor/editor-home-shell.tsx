"use client"

import { useProjectActions } from "@/hooks/use-project-actions"
import { ProjectActionsContext } from "@/contexts/project-dialogs-context"
import { useSidebarState } from "@/contexts/sidebar-state-context"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogs } from "./project-dialogs"
import { EditorHome } from "./editor-home"
import type { ProjectSummary } from "@/lib/data/projects"

interface EditorHomeShellProps {
  ownedProjects: ProjectSummary[]
  sharedProjects: ProjectSummary[]
}

export function EditorHomeShell({ ownedProjects, sharedProjects }: EditorHomeShellProps) {
  const { isSidebarOpen, closeSidebar, toggleRef } = useSidebarState()
  const actions = useProjectActions()

  return (
    <ProjectActionsContext.Provider value={actions}>
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        toggleRef={toggleRef}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
      />
      <EditorHome />
      <ProjectDialogs {...actions} />
    </ProjectActionsContext.Provider>
  )
}
