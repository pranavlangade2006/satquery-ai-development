"use client"

import Link from "next/link"
import {
  Sparkles,
  Upload,
  Map,
  MessageSquareText,
  GitCompareArrows,
  Activity,
  Gauge,
  Layers,
  Clock,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader, CardTitle, Badge, SectionHeading } from "@/components/primitives"
import { StatCard } from "@/components/stat-card"
import { useWorkflow } from "@/components/workflow-provider"

const QUICK_ACTIONS = [
  {
    href: "/upload",
    title: "Upload Image",
    desc: "Bring your own GeoTIFF, JPG or PNG scene.",
    icon: Upload,
    tone: "emerald" as const,
  },
  {
    href: "/map",
    title: "Explore Map",
    desc: "Pick a location and acquisition date.",
    icon: Map,
    tone: "blue" as const,
  },
  {
    href: "/query",
    title: "Ask a Question",
    desc: "Query the scene in natural language.",
    icon: MessageSquareText,
    tone: "violet" as const,
  },
  {
    href: "/change-detection",
    title: "Change Detection",
    desc: "Compare two acquisitions over time.",
    icon: GitCompareArrows,
    tone: "amber" as const,
  },
]

const toneMap = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
}

export default function DashboardPage() {
  const { history } = useWorkflow()
  const total = history.length
  const avgConfidence =
    total > 0 ? Math.round((history.reduce((a, h) => a + h.confidence, 0) / total) * 100) : 0
  const uniqueTypes = new Set(history.map((h) => h.analysisType)).size
  const recent = history.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950">
        <img
          src="/earth-hero.png"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />
        <div className="relative px-6 py-10 sm:px-10 sm:py-14">
          <Badge tone="green" className="ring-emerald-400/30">
            <Sparkles className="size-3" />
            AI Remote Sensing
          </Badge>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ask questions about any satellite image.
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-slate-300 sm:text-base">
            SatQuery AI turns raw satellite imagery into answers — visual question answering,
            scene description, segmentation, object detection and change detection, all in one
            workflow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/new" />}>
              Start new analysis
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              nativeButton={false}
              render={<Link href="/upload" />}
            >
              <Upload className="size-4" />
              Upload image
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total analyses" value={String(total)} icon={Activity} tone="emerald" />
        <StatCard label="Avg. confidence" value={`${avgConfidence}%`} icon={Gauge} tone="blue" />
        <StatCard label="Analysis types" value={String(uniqueTypes)} icon={Layers} tone="violet" />
        <StatCard label="Models online" value="5" hint="VLM, Seg, DETR…" icon={Clock} tone="amber" />
      </section>

      {/* Quick actions */}
      <section>
        <SectionHeading title="Quick actions" description="Jump straight into a task." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon
            return (
              <Link key={a.href} href={a.href} className="group">
                <Card className="h-full p-5 transition-shadow hover:shadow-md">
                  <span
                    className={`flex size-11 items-center justify-center rounded-xl ${toneMap[a.tone]}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-4 font-semibold text-slate-900">{a.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{a.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                    Open
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Recent analyses */}
      <section>
        <SectionHeading
          title="Recent analyses"
          description="Your latest queries and their results."
          action={
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/history" />}>
              View all
              <ArrowRight className="size-4" />
            </Button>
          }
        />
        <Card>
          <ul className="divide-y divide-slate-100">
            {recent.map((h) => (
              <li key={h.id} className="flex items-center gap-4 px-5 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <MessageSquareText className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{h.question}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {h.analysisType} · {h.location} · {h.date}
                  </p>
                </div>
                <Badge tone={h.confidence >= 0.9 ? "green" : "blue"} className="shrink-0">
                  {Math.round(h.confidence * 100)}%
                </Badge>
              </li>
            ))}
            {recent.length === 0 ? (
              <li className="px-5 py-10 text-center text-sm text-slate-500">
                No analyses yet. Start your first one above.
              </li>
            ) : null}
          </ul>
        </Card>
      </section>
    </div>
  )
}
