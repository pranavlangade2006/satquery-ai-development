"use client"

import { useState } from "react"
import { GitCompareArrows, Loader2, CalendarClock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
} from "@/components/primitives"
import { RegionOverlay } from "@/components/region-overlay"
import { detectChange, type ChangeDetectionResult } from "@/lib/mock-api"

export default function ChangeDetectionPage() {
  const [slider, setSlider] = useState(50)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<ChangeDetectionResult | null>(null)

  async function run() {
    setRunning(true)
    setResult(null)
    const res = await detectChange()
    setResult(res)
    setRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Change detection</h1>
          <p className="mt-1 text-sm text-slate-500">
            Compare two acquisitions of the same location to highlight what changed.
          </p>
        </div>
        <Button onClick={run} disabled={running}>
          {running ? <Loader2 className="size-4 animate-spin" /> : <GitCompareArrows className="size-4" />}
          {running ? "Detecting…" : "Detect changes"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Before / after comparison</CardTitle>
                <CardDescription>Drag the slider to swipe between acquisitions.</CardDescription>
              </div>
              <Badge tone="slate">
                <CalendarClock className="size-3" />
                2024 → 2026
              </Badge>
            </CardHeader>
            <CardBody>
              <div className="relative aspect-video w-full select-none overflow-hidden rounded-2xl ring-1 ring-slate-200">
                <img
                  src="/change-after.png"
                  alt="Satellite scene, later acquisition"
                  className="absolute inset-0 size-full object-cover"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${slider}%` }}
                >
                  <img
                    src="/change-before.png"
                    alt="Satellite scene, earlier acquisition"
                    className="absolute inset-0 h-full object-cover"
                    style={{ width: `${slider > 0 ? 10000 / slider : 10000}%`, maxWidth: "none" }}
                  />
                  <span className="absolute left-3 top-3">
                    <Badge tone="navy">Before</Badge>
                  </span>
                </div>
                <span className="absolute right-3 top-3">
                  <Badge tone="green">After</Badge>
                </span>
                <div
                  className="absolute inset-y-0 w-0.5 bg-white shadow"
                  style={{ left: `${slider}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={slider}
                onChange={(e) => setSlider(Number(e.target.value))}
                aria-label="Comparison slider"
                className="mt-4 w-full accent-emerald-600"
              />
            </CardBody>
          </Card>

          {result ? (
            <Card>
              <CardHeader>
                <CardTitle>Detected changes</CardTitle>
                <CardDescription>Regions of significant change on the later scene.</CardDescription>
              </CardHeader>
              <CardBody>
                <RegionOverlay
                  src="/change-after.png"
                  alt="Detected change regions"
                  regions={result.regions}
                />
              </CardBody>
            </Card>
          ) : null}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!result && !running ? (
            <Card>
              <CardBody className="flex flex-col items-center justify-center py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Sparkles className="size-6" />
                </span>
                <p className="mt-4 font-medium text-slate-900">No comparison yet</p>
                <p className="mt-1 max-w-xs text-sm text-slate-500">
                  Run change detection to quantify vegetation loss, new construction and water shifts.
                </p>
              </CardBody>
            </Card>
          ) : null}

          {running ? (
            <Card>
              <CardBody className="flex flex-col items-center justify-center py-14 text-center">
                <Loader2 className="size-8 animate-spin text-emerald-600" />
                <p className="mt-4 font-medium text-slate-900">Comparing acquisitions…</p>
                <p className="mt-1 text-sm text-slate-500">Aligning and differencing scenes.</p>
              </CardBody>
            </Card>
          ) : null}

          {result ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tracking-tight text-slate-900">
                      {result.changedAreaPercent}%
                    </span>
                    <span className="text-sm text-slate-500">of scene changed</span>
                  </div>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-600">
                    {result.summary}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change breakdown</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  {result.stats.map((s) => (
                    <div key={s.label}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-600">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: s.color }}
                          />
                          {s.label}
                        </span>
                        <span className="font-medium tabular-nums text-slate-900">{s.value}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${s.value}%`, backgroundColor: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
