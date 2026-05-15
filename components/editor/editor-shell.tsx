"use client"

import { useRef, useState } from "react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="relative h-screen overflow-hidden bg-bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        toggleRef={toggleRef}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        toggleRef={toggleRef}
      />
      <main className="h-full pt-12">{children}</main>
    </div>
  )
}
