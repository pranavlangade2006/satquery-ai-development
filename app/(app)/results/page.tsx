"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Calendar,
  Cpu,
  Clock,
  CheckCircle2,
  RotateCcw,
  GitCompareArrows,
  Quote,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  ProgressBar,
  SectionHeading,
} from "@/components/primitives"
import { RegionOverlay } from "@/components/region-overlay"
import { useWorkflow } from "@/components/workflow-provider"

export default function ResultsPage() {
  const router = useRouter()
  const { result, image, reset } = useWorkflow()

  useEffect(() => {
    if (!result) router.replace("/new")
  }, [result, router])

  if (!result) return null

  const imgSrc = image?.dataUrl || "/satellite-sample.png"
  const confidencePct = Math.round(result.confidence * 100)
  const stats = Object.entries(result.statistics)

  function runAnother() {
    reset()
    router.push("/query")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald-500" />
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Analysis complete</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">{result.analysisType}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={runAnother}>
            <RotateCcw className="size-4" />
            Run another
          </Button>
              <Button nativeButton={false} render={<Link href="/change-detection" />}>
            <GitCompareArrows className="size-4" />
            Change detection
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: image + regions */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Scene &amp; detected regions</CardTitle>
              <Badge tone="slate">{result.regions.length} regions</Badge>
            </CardHeader>
            <CardBody>
              <RegionOverlay src={imgSrc} alt="Analyzed satellite scene" regions={result.regions} />
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {result.regions.map((r, i) => (
                  <li
                    key={`${r.label}-${i}`}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <span
                      className="size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="flex-1 text-sm text-slate-700">{r.label}</span>
                    <span className="text-xs font-medium tabular-nums text-slate-500">
                      {Math.round(r.confidence * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {stats.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Scene statistics</CardTitle>
                <CardDescription>Estimated land-cover composition and metrics.</CardDescription>
              </CardHeader>
              <CardBody className="space-y-4">
                {stats.map(([key, val]) => (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="capitalize text-slate-600">{key.replace(/_/g, " ")}</span>
                      <span className="font-medium tabular-nums text-slate-900">{val}%</span>
                    </div>
                    <ProgressBar value={val} />
                  </div>
                ))}
              </CardBody>
            </Card>
          ) : null}
        </div>

        {/* Right: answer + meta */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Answer</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-pretty leading-relaxed text-slate-700">{result.answer}</p>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Confidence</span>
                  <span className="tabular-nums text-slate-900">{confidencePct}%</span>
                </div>
                <ProgressBar
                  value={confidencePct}
                  indicatorClassName={confidencePct >= 85 ? "bg-emerald-500" : "bg-amber-500"}
                />
              </div>
            </CardBody>
          </Card>

          {result.evidence.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Supporting evidence</CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3">
                  {result.evidence.map((e, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-600">
                      <Quote className="size-4 shrink-0 text-emerald-500" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardBody>
              <dl className="space-y-3 text-sm">
                <Meta icon={Cpu} label="Model" value={result.model} />
                <Meta
                  icon={MapPin}
                  label="Location"
                  value={
                    result.location
                      ? `${result.location.lat.toFixed(3)}, ${result.location.lng.toFixed(3)}`
                      : "—"
                  }
                />
                <Meta icon={Calendar} label="Acquired" value={result.date} />
                <Meta
                  icon={Clock}
                  label="Processing"
                  value={`${(result.processingMs / 1000).toFixed(1)}s`}
                />
              </dl>
            </CardBody>
          </Card>

              <Button variant="ghost" className="w-full" nativeButton={false} render={<Link href="/history" />}>
            <ArrowLeft className="size-4" />
            Back to history
          </Button>
        </div>
      </div>
    </div>
  )
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="flex items-center gap-2 text-slate-500">
        <Icon className="size-4" />
        {label}
      </dt>
      <dd className="max-w-[55%] truncate text-right font-medium text-slate-900">{value}</dd>
    </div>
  )
}
