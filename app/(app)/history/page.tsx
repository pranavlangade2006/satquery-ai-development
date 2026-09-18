"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, Filter, MapPin, Plus, History as HistoryIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardBody, Badge } from "@/components/primitives"
import { useWorkflow } from "@/components/workflow-provider"
import type { HistoryEntry } from "@/lib/types"

const STATUS_TONE: Record<HistoryEntry["status"], "green" | "amber" | "red"> = {
  completed: "green",
  processing: "amber",
  failed: "red",
}

export default function HistoryPage() {
  const { history } = useWorkflow()
  const [query, setQuery] = useState("")
  const [type, setType] = useState("all")

  const types = useMemo(() => {
    const set = new Set(history.map((h) => h.analysisType))
    return ["all", ...Array.from(set)]
  }, [history])

  const filtered = useMemo(() => {
    return history.filter((h) => {
      const matchesType = type === "all" || h.analysisType === type
      const matchesQuery =
        !query ||
        h.question.toLowerCase().includes(query.toLowerCase()) ||
        h.location.toLowerCase().includes(query.toLowerCase())
      return matchesType && matchesQuery
    })
  }, [history, query, type])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Analysis history</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review and revisit every scene you&apos;ve analyzed.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/new" />}>
          <Plus className="size-4" />
          New analysis
        </Button>
      </div>

      <Card>
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions or locations…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 sm:w-64"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All analysis types" : t}
                </option>
              ))}
            </select>
          </div>
        </CardBody>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <HistoryIcon className="size-6" />
            </span>
            <p className="mt-4 font-medium text-slate-900">No matching analyses</p>
            <p className="mt-1 text-sm text-slate-500">Try a different search or filter.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((h) => (
            <Card key={h.id} className="transition-shadow hover:shadow-md">
              <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="blue">{h.analysisType}</Badge>
                    <Badge tone={STATUS_TONE[h.status]}>{h.status}</Badge>
                    <span className="text-xs text-slate-400">{h.date}</span>
                  </div>
                  <p className="mt-2 truncate font-medium text-slate-900">{h.question}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="size-3.5" />
                    {h.location}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Confidence</p>
                    <p className="font-semibold tabular-nums text-slate-900">
                      {Math.round(h.confidence * 100)}%
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
