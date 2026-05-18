"use client"

import { SidebarStateProvider } from "@/contexts/sidebar-state-context"
import { EditorNavbar } from "./editor-navbar"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  return (
    <SidebarStateProvider>
      <div className="relative h-screen overflow-hidden bg-bg-base">
        <EditorNavbar />
        <main className="h-full pt-12">{children}</main>
      </div>
    </SidebarStateProvider>
  )
}
