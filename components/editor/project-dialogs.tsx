"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ProjectDialogsHook } from "@/hooks/use-project-dialogs"

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

type Props = Pick<
  ProjectDialogsHook,
  | "activeDialog"
  | "targetProject"
  | "createName"
  | "setCreateName"
  | "renameName"
  | "setRenameName"
  | "isLoading"
  | "closeDialog"
  | "handleCreate"
  | "handleRename"
  | "handleDelete"
>

export function ProjectDialogs({
  activeDialog,
  targetProject,
  createName,
  setCreateName,
  renameName,
  setRenameName,
  isLoading,
  closeDialog,
  handleCreate,
  handleRename,
  handleDelete,
}: Props) {
  return (
    <>
      <Dialog
        open={activeDialog === "create"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="rounded-3xl max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Name your project. You can change it later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input
              autoFocus
              placeholder="Project name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <p className="text-xs text-text-muted">
              {" "}
              <span className="font-mono text-text-secondary">
                {toSlug(createName)}
              </span>
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!createName.trim() || isLoading}
            >
              {isLoading ? "Creating…" : "Create Project"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeDialog === "rename"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="rounded-3xl max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Renaming{" "}
              <span className="font-medium text-text-primary">
                {targetProject?.name}
              </span>
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="New name"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!renameName.trim() || isLoading}
            >
              {isLoading ? "Saving…" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeDialog === "delete"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="rounded-3xl max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Permanently delete{" "}
              <span className="font-medium text-text-primary">
                {targetProject?.name}
              </span>
              ? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting…" : "Delete Project"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
