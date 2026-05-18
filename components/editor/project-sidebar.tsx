"use client"

import { useEffect, useRef } from "react"
import { Pencil, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjectActionsContext } from "@/contexts/project-dialogs-context"
import type { ProjectSummary } from "@/lib/data/projects"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  toggleRef?: React.RefObject<HTMLButtonElement | null>
  ownedProjects: ProjectSummary[]
  sharedProjects: ProjectSummary[]
  activeProjectId?: string
}

export function ProjectSidebar({
  isOpen,
  onClose,
  toggleRef,
  ownedProjects,
  sharedProjects,
  activeProjectId,
}: ProjectSidebarProps) {
  const wasOpen = useRef(false)
  const { openCreate, openRename, openDelete } = useProjectActionsContext()

  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      toggleRef?.current?.focus()
    }
    wasOpen.current = isOpen
  }, [isOpen, toggleRef])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border-default bg-bg-surface transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border-default px-4">
          <span className="text-sm font-medium text-text-primary">Projects</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close sidebar"
            onClick={onClose}
            className="h-7 w-7 text-text-muted hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden p-3">
          <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="mt-3 flex-1 overflow-y-auto">
              {ownedProjects.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-text-faint">No projects yet</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {ownedProjects.map((project) => (
                    <li
                      key={project.id}
                      className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-bg-elevated ${project.id === activeProjectId ? "bg-bg-elevated" : ""}`}
                    >
                      <span className="flex-1 truncate text-sm text-text-secondary group-hover:text-text-primary">
                        {project.name}
                      </span>
                      <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Rename ${project.name}`}
                          onClick={() => openRename(project)}
                          className="h-6 w-6 text-text-muted hover:text-text-primary"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${project.name}`}
                          onClick={() => openDelete(project)}
                          className="h-6 w-6 text-text-muted hover:text-state-error"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="shared" className="mt-3 flex-1 overflow-y-auto">
              {sharedProjects.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-text-faint">No shared projects</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {sharedProjects.map((project) => (
                    <li
                      key={project.id}
                      className={`flex items-center rounded-lg px-2 py-1.5 hover:bg-bg-elevated ${project.id === activeProjectId ? "bg-bg-elevated" : ""}`}
                    >
                      <span className="flex-1 truncate text-sm text-text-secondary">
                        {project.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="shrink-0 border-t border-border-default p-3">
          <Button className="w-full gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
