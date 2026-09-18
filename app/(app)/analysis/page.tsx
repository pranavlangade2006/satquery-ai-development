"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, Cpu, ScanSearch, Layers, Sparkles, ImageIcon } from "lucide-react"
import { Card, CardBody, Badge, ProgressBar } from "@/components/primitives"
import { useWorkflow } from "@/components/workflow-provider"
import { analyze } from "@/lib/mock-api"
import { ANALYSIS_MODES, type HistoryEntry } from "@/lib/types"

const STAGES = [
  { icon: ImageIcon, label: "Pre-processing imagery", detail: "Normalizing bands & tiling" },
  { icon: Layers, label: "Extracting features", detail: "Vision encoder embeddings" },
  { icon: Cpu, label: "Running vision-language model", detail: "Cross-attention over patches" },
  { icon: ScanSearch, label: "Detecting regions", detail: "Localizing objects of interest" },
  { icon: Sparkles, label: "Generating answer", detail: "Decoding natural-language response" },
]

export default function AnalysisPage() {
  const router = useRouter()
  const { question, mode, image, location, date, setResult, addHistory } = useWorkflow()
  const [stage, setStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    // Guard: need at least a question to have meaning.
    if (!question.trim()) {
      router.replace("/query")
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    const stageDuration = 1200

    STAGES.forEach((_, i) => {
      timers.push(setTimeout(() => setStage(i), i * stageDuration))
    })

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(98, p + Math.random() * 6))
    }, 180)

    async function finish() {
      const result = await analyze({
        image,
        question,
        imageType: image?.type ?? "image/png",
        latitude: location?.lat ?? null,
        longitude: location?.lng ?? null,
        date,
        analysisMode: mode,
      })
      setResult(result)
      const entry: HistoryEntry = {
        id: result.id,
        date,
        question: result.question,
        analysisType: result.analysisType,
        location: location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "—",
        confidence: result.confidence,
        status: "completed",
        result,
      }
      addHistory(entry)
      setProgress(100)
      setStage(STAGES.length)
      setTimeout(() => router.replace("/results"), 700)
    }

    const finishTimer = setTimeout(finish, STAGES.length * stageDuration)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finishTimer)
      clearInterval(progressInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const modeLabel = ANALYSIS_MODES.find((m) => m.id === mode)?.label

  return (
    <div className="mx-auto max-w-2xl py-6">
      <div className="mb-8 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <Loader2 className="size-8 animate-spin" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
          Analyzing your scene
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Running <span className="font-medium text-slate-700">{modeLabel}</span> — this usually
          takes a few seconds.
        </p>
      </div>

      <Card>
        <CardBody className="space-y-6 pt-5 sm:pt-6">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Progress</span>
              <span className="tabular-nums text-slate-500">{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>

          <ul className="space-y-1">
            {STAGES.map((s, i) => {
              const done = i < stage
              const active = i === stage
              const Icon = s.icon
              return (
                <li
                  key={s.label}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    active ? "bg-emerald-50" : ""
                  }`}
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-lg ${
                      done
                        ? "bg-emerald-500 text-white"
                        : active
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {done ? (
                      <Check className="size-4" />
                    ) : active ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        done || active ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="text-xs text-slate-400">{s.detail}</p>
                  </div>
                  {active ? <Badge tone="green">Working</Badge> : null}
                  {done ? <Badge tone="slate">Done</Badge> : null}
                </li>
              )
            })}
          </ul>
        </CardBody>
      </Card>
    </div>
  )
}
