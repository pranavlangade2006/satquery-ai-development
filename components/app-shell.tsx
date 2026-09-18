"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Satellite, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarContent } from "@/components/app-sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-64">
            <SidebarContent onNavigate={() => setOpen(false)} />
            <button
              onClick={() => setOpen(false)}
              className="absolute -right-11 top-4 rounded-lg bg-white/10 p-2 text-white"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-1">
              <Menu className="size-5 text-slate-700" />
            </button>
            <div className="flex items-center gap-2">
              <Satellite className="size-5 text-emerald-600" />
              <span className="font-semibold">SatQuery AI</span>
            </div>
          </div>
          <Button size="sm" render={<Link href="/upload" />}>
            <Plus className="size-4" />
            New
          </Button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
