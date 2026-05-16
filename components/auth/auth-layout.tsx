import { Cpu, Share2, FileCode } from "lucide-react"

const features = [
  {
    icon: Cpu,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileCode,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-bg-surface px-12 py-10">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-accent-primary flex-shrink-0" />
          <span className="text-sm font-medium text-text-primary">Ghost AI</span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary">
            Design systems at the
            <br />
            speed of thought.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-secondary">
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>

          <ul className="mt-10 space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-border-default bg-bg-elevated">
                  <Icon className="h-4 w-4 text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{title}</p>
                  <p className="mt-0.5 text-sm text-text-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-text-faint">
          © 2026 Ghost AI. All rights reserved.
        </p>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-bg-base px-6 py-12">
        {children}
      </div>
    </div>
  )
}
