"use client"

import { createContext, useContext, useRef, useState } from "react"

interface SidebarState {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  toggleRef: React.RefObject<HTMLButtonElement | null>
}

const SidebarStateContext = createContext<SidebarState | null>(null)

export function SidebarStateProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  return (
    <SidebarStateContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
        closeSidebar: () => setIsSidebarOpen(false),
        toggleRef,
      }}
    >
      {children}
    </SidebarStateContext.Provider>
  )
}

export function useSidebarState(): SidebarState {
  const ctx = useContext(SidebarStateContext)
  if (!ctx) throw new Error("useSidebarState must be used within SidebarStateProvider")
  return ctx
}
