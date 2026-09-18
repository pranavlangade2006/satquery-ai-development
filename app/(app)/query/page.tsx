"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, MapPin, Calendar, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/primitives"
import { WorkflowSteps } from "@/components/workflow-steps"
import { useWorkflow } from "@/components/workflow-provider"
import { ANALYSIS_MODES } from "@/lib/types"

const EXAMPLES = [
  "What type of land cover is visible in this image?",
  "Identify all built-up and urban regions.",
  "Is there vegetation loss compared to the surroundings?",
  "Describe the scene in detail.",
  "Are there any water bodies present?",
]

export default function QueryPage() {
  const router = useRouter()
  const { question, setQuestion, mode, setMode, image, location, date } = useWorkflow()
  const [touched, setTouched] = useState(false)

  const modeInfo = ANALYSIS_MODES.find((m) => m.id === mode)
  const canRun = question.trim().length > 3

  function run() {
    if (!canRun) {
      setTouched(true)
      return
    }
    router.push("/analysis")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      e.preventDefault()
      run()
    }
  }

  return (
    <div>
      <WorkflowSteps current="query" />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Ask a question</h1>
        <p className="mt-1 text-sm text-slate-500">
          Choose an analysis mode and describe what you want to know.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis mode</CardTitle>
              <CardDescription>{modeInfo?.description}</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="grid gap-2 sm:grid-cols-2">
                {ANALYSIS_MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      mode === m.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900">{m.label}</p>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your question</CardTitle>
            </CardHeader>
            <CardBody>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                placeholder="e.g. What type of land cover is visible in this image?"
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {touched && !canRun ? (
                <p className="mt-2 text-sm text-red-600">Please enter a question to continue.</p>
              ) : (
                <p className="mt-2 text-xs text-slate-400">Press ⌘/Ctrl + Enter to run.</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setQuestion(ex)}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle>Scene summary</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
                <img
                  src={image?.dataUrl || "/satellite-sample.png"}
                  alt="Selected satellite scene"
                  className="aspect-video w-full object-cover"
                />
              </div>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="size-4 text-emerald-500" />
                  {location ? `${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}` : "No location"}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="size-4 text-emerald-500" />
                  {date}
                </div>
              </dl>

              <div className="mt-6 flex gap-2">
                <Button variant="outline" onClick={() => router.push("/map")}>
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button className="flex-1" onClick={run}>
                  <Wand2 className="size-4" />
                  Run analysis
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
