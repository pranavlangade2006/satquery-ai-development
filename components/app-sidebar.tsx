"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Sparkles,
  Upload,
  Map,
  MessageSquareText,
  GitCompareArrows,
  History,
  Settings,
  Satellite,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/new", label: "New Analysis", icon: Sparkles },
  { href: "/upload", label: "Upload Image", icon: Upload },
  { href: "/map", label: "Explore Map", icon: Map },
  { href: "/query", label: "Ask Question", icon: MessageSquareText },
  { href: "/change-detection", label: "Change Detection", icon: GitCompareArrows },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-300">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
          <Satellite className="size-5 text-emerald-400" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">SatQuery AI</p>
          <p className="text-xs text-slate-400">by OrbitIQ</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="m-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
        <p className="text-xs font-medium text-white">Smart India Hackathon</p>
        <p className="mt-1 text-xs text-slate-400">
          Prototype using mock AI data. Python VLM backend connects later.
        </p>
      </div>
    </div>
  )
}
