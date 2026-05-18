"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Link2, Trash2, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Collaborator {
  email: string
  name: string | null
  imageUrl: string | null
}

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  isOwner: boolean
}

function initials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase()
  }
  return email[0].toUpperCase()
}

export function ShareDialog({ open, onOpenChange, projectId, isOwner }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [removingEmail, setRemovingEmail] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchCollaborators = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`)
      if (res.ok) {
        const data = (await res.json()) as { collaborators: Collaborator[] }
        setCollaborators(data.collaborators)
      }
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (open) {
      void fetchCollaborators()
      setInviteEmail("")
      setInviteError(null)
      setCopied(false)
    }
  }, [open, fetchCollaborators])

  async function handleInvite() {
    const email = inviteEmail.trim()
    if (!email || !email.includes("@")) return
    setIsInviting(true)
    setInviteError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setInviteEmail("")
        await fetchCollaborators()
      } else {
        const data = (await res.json()) as { error?: string }
        setInviteError(data.error ?? "Failed to invite")
      }
    } finally {
      setIsInviting(false)
    }
  }

  async function handleRemove(email: string) {
    setRemovingEmail(email)
    try {
      await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setCollaborators((prev) => prev.filter((c) => c.email !== email))
    } finally {
      setRemovingEmail(null)
    }
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}/editor/${projectId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
        </DialogHeader>

        {isOwner && (
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2">
              <Input
                placeholder="Invite by email"
                type="email"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value)
                  setInviteError(null)
                }}
                onKeyDown={(e) => e.key === "Enter" && void handleInvite()}
                disabled={isInviting}
                className="flex-1"
              />
              <Button
                onClick={() => void handleInvite()}
                disabled={!inviteEmail.trim() || !inviteEmail.includes("@") || isInviting}
                size="icon"
                className="shrink-0"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
            {inviteError && <p className="text-xs text-destructive">{inviteError}</p>}
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          {isLoading ? (
            <p className="py-4 text-center text-xs text-text-faint">Loading…</p>
          ) : collaborators.length === 0 ? (
            <p className="py-4 text-center text-xs text-text-faint">No collaborators yet</p>
          ) : (
            collaborators.map((c) => (
              <div key={c.email} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-elevated text-xs font-medium text-text-secondary">
                  {c.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.imageUrl} alt={c.name ?? c.email} className="h-full w-full object-cover" />
                  ) : (
                    initials(c.name, c.email)
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  {c.name ? (
                    <>
                      <span className="truncate text-sm text-text-primary">{c.name}</span>
                      <span className="truncate text-xs text-text-faint">{c.email}</span>
                    </>
                  ) : (
                    <span className="truncate text-sm text-text-secondary">{c.email}</span>
                  )}
                </div>
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${c.name ?? c.email}`}
                    onClick={() => void handleRemove(c.email)}
                    disabled={removingEmail === c.email}
                    className="h-6 w-6 shrink-0 text-text-muted hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        {isOwner && (
          <div className="border-t border-border-default pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void handleCopyLink()}
              className="w-full gap-2 text-text-muted hover:text-text-primary"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  Copy link
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
