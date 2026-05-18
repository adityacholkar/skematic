import { Lock } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-bg-base">
      <Lock className="h-10 w-10 text-text-faint" />
      <p className="text-sm text-text-secondary">You don&apos;t have access to this project.</p>
      <Link href="/editor" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        Back to editor
      </Link>
    </div>
  )
}
