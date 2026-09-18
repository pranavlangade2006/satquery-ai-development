"use client"

import { useState } from "react"
import { Cpu, Server, SlidersHorizontal, Check, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
} from "@/components/primitives"
import { ANALYSIS_MODES, type AnalysisMode } from "@/lib/types"
import { useWorkflow } from "@/components/workflow-provider"

const MODELS = [
  { id: "satquery-vlm", label: "SatQuery-VLM", note: "Vision-language, general VQA" },
  { id: "satquery-segformer", label: "SatQuery-SegFormer", note: "Land-cover segmentation" },
  { id: "satquery-detr", label: "SatQuery-DETR", note: "Object / region detection" },
  { id: "satquery-changenet", label: "SatQuery-ChangeNet", note: "Bi-temporal change" },
]

export default function SettingsPage() {
  const { mode, setMode } = useWorkflow()
  const [model, setModel] = useState(MODELS[0].id)
  const [threshold, setThreshold] = useState(75)
  const [endpoint, setEndpoint] = useState("https://api.satquery.ai/v1/analyze")
  const [saved, setSaved] = useState(false)

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure inference defaults and the backend connection.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Cpu className="size-5" />
          </span>
          <div>
            <CardTitle>Model</CardTitle>
            <CardDescription>Choose the default inference model.</CardDescription>
          </div>
        </CardHeader>
        <CardBody className="grid gap-3 sm:grid-cols-2">
          {MODELS.map((m) => {
            const active = model === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setModel(m.id)}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-emerald-400 bg-emerald-50/60 ring-2 ring-emerald-100"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>
                  <span className="block font-medium text-slate-900">{m.label}</span>
                  <span className="block text-xs text-slate-500">{m.note}</span>
                </span>
                {active ? <Check className="size-5 text-emerald-600" /> : null}
              </button>
            )
          })}
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <SlidersHorizontal className="size-5" />
          </span>
          <div>
            <CardTitle>Inference defaults</CardTitle>
            <CardDescription>Applied to new analyses unless overridden.</CardDescription>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Default analysis mode
            </label>
            <div className="flex flex-wrap gap-2">
              {ANALYSIS_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as AnalysisMode)}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    mode === m.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Confidence threshold
              </label>
              <span className="text-sm font-semibold tabular-nums text-slate-900">{threshold}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-emerald-600"
              aria-label="Confidence threshold"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Detections below this confidence are hidden from results.
            </p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Server className="size-5" />
          </span>
          <div className="flex-1">
            <CardTitle>Backend connection</CardTitle>
            <CardDescription>Python / FastAPI inference endpoint.</CardDescription>
          </div>
          <Badge tone="amber">
            <Database className="size-3" />
            Mock mode
          </Badge>
        </CardHeader>
        <CardBody className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Endpoint URL</label>
          <input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <p className="text-xs text-slate-500">
            The app currently runs against a mock service. Connect your trained model server here to
            go live.
          </p>
        </CardBody>
      </Card>

      <div className="flex items-center justify-end gap-3">
        {saved ? (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <Check className="size-4" />
            Settings saved
          </span>
        ) : null}
        <Button onClick={save}>Save changes</Button>
      </div>
    </div>
  )
}
