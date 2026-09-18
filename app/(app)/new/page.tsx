"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Upload, MapPin, MessageSquareText, Cpu, BarChart3, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader, CardTitle, CardDescription, Badge } from "@/components/primitives"
import { ANALYSIS_MODES } from "@/lib/types"
import { useWorkflow } from "@/components/workflow-provider"

const STEPS = [
  {
    icon: Upload,
    title: "1. Provide imagery",
    desc: "Upload your own satellite scene or pick a location from the map.",
  },
  {
    icon: MapPin,
    title: "2. Set location & date",
    desc: "Georeference the scene and choose the acquisition date.",
  },
  {
    icon: MessageSquareText,
    title: "3. Ask a question",
    desc: "Describe what you want to know in natural language.",
  },
  { icon: Cpu, title: "4. AI analysis", desc: "The vision-language model processes the scene." },
  { icon: BarChart3, title: "5. Review results", desc: "Get answers, confidence, regions and stats." },
]

export default function NewAnalysisPage() {
  const router = useRouter()
  const { reset } = useWorkflow()

  function start() {
    reset()
    router.push("/upload")
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">New analysis</h1>
          <p className="mt-1 text-sm text-slate-500">
            Five quick steps from raw satellite imagery to AI-generated answers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="size-4" />
            Reset workflow
          </Button>
          <Button onClick={start}>
            Start
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.title} className="p-5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon className="size-5" />
              </span>
              <p className="mt-4 font-semibold text-slate-900">{s.title}</p>
              <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Available analysis modes</CardTitle>
            <CardDescription>Choose the right model for the task later in the flow.</CardDescription>
          </div>
          <Badge tone="navy">5 models</Badge>
        </CardHeader>
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-2">
            {ANALYSIS_MODES.map((m) => (
              <div
                key={m.id}
                className="flex items-start gap-3 rounded-xl border border-slate-200 p-4"
              >
                <span className="mt-0.5 flex size-2.5 shrink-0 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{m.label}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" onClick={start}>
          Begin with an image
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
