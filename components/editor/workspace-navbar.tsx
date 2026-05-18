"use client"

import { PanelLeftClose, PanelLeftOpen, Share2, MessageSquare } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

interface WorkspaceNavbarProps {
  projectName: string
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isAiSidebarOpen: boolean
  onToggleAiSidebar: () => void
  onOpenShare: () => void
}

export function WorkspaceNavbar({
  projectName,
  isSidebarOpen,
  onToggleSidebar,
  isAiSidebarOpen,
  onToggleAiSidebar,
  onOpenShare,
}: WorkspaceNavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center border-b border-border-default bg-bg-surface px-3">
      <div className="flex flex-1 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
          className="h-8 w-8 text-text-muted hover:text-text-primary"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <span className="text-sm font-medium text-text-primary">{projectName}</span>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onOpenShare} className="gap-1.5 text-text-muted hover:text-text-primary">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAiSidebar}
          aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
          aria-expanded={isAiSidebarOpen}
          className="h-8 w-8 text-text-muted hover:text-text-primary"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        <UserButton />
      </div>
    </header>
  )
}
