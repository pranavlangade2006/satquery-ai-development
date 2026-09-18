import Link from "next/link"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type WorkflowStepId = "upload" | "map" | "query" | "analysis" | "results"

const STEPS: { id: WorkflowStepId; label: string; href: string }[] = [
  { id: "upload", label: "Image", href: "/upload" },
  { id: "map", label: "Location & Date", href: "/map" },
  { id: "query", label: "Question", href: "/query" },
  { id: "analysis", label: "Analysis", href: "/analysis" },
  { id: "results", label: "Results", href: "/results" },
]

export function WorkflowSteps({ current }: { current: WorkflowStepId }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current)

  return (
    <nav aria-label="Workflow progress" className="mb-6 overflow-x-auto">
      <ol className="flex min-w-max items-center gap-2">
        {STEPS.map((step, i) => {
          const done = i < currentIndex
          const active = i === currentIndex
          const content = (
            <span
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                active && "bg-slate-900 text-white",
                done && "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                !active && !done && "bg-white text-slate-500 ring-1 ring-slate-200",
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-xs",
                  active && "bg-white text-slate-900",
                  done && "bg-emerald-500 text-white",
                  !active && !done && "bg-slate-100 text-slate-500",
                )}
              >
                {done ? <Check className="size-3" /> : i + 1}
              </span>
              {step.label}
            </span>
          )
          return (
            <li key={step.id} className="flex items-center gap-2">
              {done ? <Link href={step.href}>{content}</Link> : content}
              {i < STEPS.length - 1 ? <span className="h-px w-5 bg-slate-300" /> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
