"use client"

import { SidebarStateProvider } from "@/contexts/sidebar-state-context"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  return (
    <SidebarStateProvider>
      <div className="relative h-screen overflow-hidden bg-bg-base">{children}</div>
    </SidebarStateProvider>
  )
}
