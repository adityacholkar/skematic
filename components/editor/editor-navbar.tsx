"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useSidebarState } from "@/contexts/sidebar-state-context"

export function EditorNavbar() {
  const { isSidebarOpen, toggleSidebar, toggleRef } = useSidebarState()

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center border-b border-border-default bg-bg-surface px-3">
      <div className="flex flex-1 items-center">
        <Button
          ref={toggleRef}
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
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
      <div className="flex flex-1 items-center justify-center" />
      <div className="flex flex-1 items-center justify-end">
        <UserButton />
      </div>
    </header>
  )
}
