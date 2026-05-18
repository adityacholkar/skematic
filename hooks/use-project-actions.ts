"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import type { ProjectSummary } from "@/lib/data/projects"

export type DialogType = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function shortSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

export function useProjectActions(currentProjectId?: string) {
  const router = useRouter()
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [targetProject, setTargetProject] = useState<ProjectSummary | null>(null)
  const [createName, setCreateName] = useState("")
  const [renameName, setRenameName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const suffixRef = useRef(shortSuffix())

  const roomIdPreview = createName.trim()
    ? `${toSlug(createName)}-${suffixRef.current}`
    : ""

  const openCreate = useCallback(() => {
    suffixRef.current = shortSuffix()
    setCreateName("")
    setActiveDialog("create")
  }, [])

  const openRename = useCallback((project: ProjectSummary) => {
    setTargetProject(project)
    setRenameName(project.name)
    setActiveDialog("rename")
  }, [])

  const openDelete = useCallback((project: ProjectSummary) => {
    setTargetProject(project)
    setActiveDialog("delete")
  }, [])

  const closeDialog = useCallback(() => {
    setActiveDialog(null)
    setTargetProject(null)
  }, [])

  const handleCreate = useCallback(async () => {
    if (!createName.trim()) return
    setIsLoading(true)
    try {
      const roomId = `${toSlug(createName)}-${suffixRef.current}`
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName.trim(), id: roomId }),
      })
      if (!res.ok) return
      const { project } = await res.json() as { project: { id: string } }
      closeDialog()
      router.push(`/editor/${project.id}`)
    } finally {
      setIsLoading(false)
    }
  }, [createName, closeDialog, router])

  const handleRename = useCallback(async () => {
    if (!renameName.trim() || !targetProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameName.trim() }),
      })
      if (!res.ok) return
      closeDialog()
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }, [renameName, targetProject, closeDialog, router])

  const handleDelete = useCallback(async () => {
    if (!targetProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) return
      closeDialog()
      if (targetProject.id === currentProjectId) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }, [targetProject, currentProjectId, closeDialog, router])

  return {
    activeDialog,
    targetProject,
    createName,
    setCreateName,
    renameName,
    setRenameName,
    roomIdPreview,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    handleCreate,
    handleRename,
    handleDelete,
  }
}

export type ProjectActionsHook = ReturnType<typeof useProjectActions>
