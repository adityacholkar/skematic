"use client"

import { useEffect, useRef } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  toggleRef?: React.RefObject<HTMLButtonElement | null>
}

export function ProjectSidebar({ isOpen, onClose, toggleRef }: ProjectSidebarProps) {
  const wasOpen = useRef(false)

  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      toggleRef?.current?.focus()
    }
    wasOpen.current = isOpen
  }, [isOpen, toggleRef])

  return (
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

          <TabsContent
            value="my-projects"
            className="mt-3 flex flex-1 items-center justify-center"
          >
            <p className="text-sm text-text-faint">No projects yet</p>
          </TabsContent>

          <TabsContent
            value="shared"
            className="mt-3 flex flex-1 items-center justify-center"
          >
            <p className="text-sm text-text-faint">No shared projects</p>
          </TabsContent>
        </Tabs>
      </div>

      <div className="shrink-0 border-t border-border-default p-3">
        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
