"use client"

import { useState, useCallback } from "react"
import { MOCK_MY_PROJECTS, MOCK_SHARED_PROJECTS } from "@/data/mock-projects"
import type { MockProject } from "@/data/mock-projects"

export type DialogType = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<MockProject[]>(MOCK_MY_PROJECTS)
  const [sharedProjects] = useState<MockProject[]>(MOCK_SHARED_PROJECTS)
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [targetProject, setTargetProject] = useState<MockProject | null>(null)
  const [createName, setCreateName] = useState("")
  const [renameName, setRenameName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = useCallback(() => {
    setCreateName("")
    setActiveDialog("create")
  }, [])

  const openRename = useCallback((project: MockProject) => {
    setTargetProject(project)
    setRenameName(project.name)
    setActiveDialog("rename")
  }, [])

  const openDelete = useCallback((project: MockProject) => {
    setTargetProject(project)
    setActiveDialog("delete")
  }, [])

  const closeDialog = useCallback(() => {
    setActiveDialog(null)
    setTargetProject(null)
  }, [])

  const handleCreate = useCallback(() => {
    if (!createName.trim()) return
    setIsLoading(true)
    const newProject: MockProject = {
      id: `p${Date.now()}`,
      name: createName.trim(),
      slug: toSlug(createName),
      isOwned: true,
    }
    setTimeout(() => {
      setProjects((prev) => [...prev, newProject])
      setIsLoading(false)
      setActiveDialog(null)
      setTargetProject(null)
    }, 400)
  }, [createName])

  const handleRename = useCallback(() => {
    if (!renameName.trim() || !targetProject) return
    setIsLoading(true)
    const updated = renameName.trim()
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === targetProject.id
            ? { ...p, name: updated, slug: toSlug(updated) }
            : p
        )
      )
      setIsLoading(false)
      setActiveDialog(null)
      setTargetProject(null)
    }, 400)
  }, [renameName, targetProject])

  const handleDelete = useCallback(() => {
    if (!targetProject) return
    setIsLoading(true)
    const id = targetProject.id
    setTimeout(() => {
      setProjects((prev) => prev.filter((p) => p.id !== id))
      setIsLoading(false)
      setActiveDialog(null)
      setTargetProject(null)
    }, 400)
  }, [targetProject])

  return {
    projects,
    sharedProjects,
    activeDialog,
    targetProject,
    createName,
    setCreateName,
    renameName,
    setRenameName,
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

export type ProjectDialogsHook = ReturnType<typeof useProjectDialogs>
