"use client"

import { createContext, useContext } from "react"
import type { ProjectActionsHook } from "@/hooks/use-project-actions"

export const ProjectActionsContext = createContext<ProjectActionsHook | null>(null)

export function useProjectActionsContext(): ProjectActionsHook {
  const ctx = useContext(ProjectActionsContext)
  if (!ctx) throw new Error("useProjectActionsContext must be used within EditorHomeShell")
  return ctx
}
