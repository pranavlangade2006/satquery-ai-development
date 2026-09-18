"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, MapPin, ArrowRight, ArrowLeft, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader, CardTitle, CardDescription, Badge } from "@/components/primitives"
import { WorkflowSteps } from "@/components/workflow-steps"
import { MockMap } from "@/components/mock-map"
import { useWorkflow } from "@/components/workflow-provider"
import type { GeoLocation } from "@/lib/types"

const PRESETS: GeoLocation[] = [
  { name: "Kolkata, India", lat: 22.5726, lng: 88.3639 },
  { name: "Mumbai, India", lat: 19.076, lng: 72.8777 },
  { name: "Chennai, India", lat: 13.0827, lng: 80.2707 },
  { name: "New Delhi, India", lat: 28.7041, lng: 77.1025 },
  { name: "Amazon Basin, Brazil", lat: -3.4653, lng: -62.2159 },
  { name: "Sundarbans Delta", lat: 21.9497, lng: 89.1833 },
]

export default function MapPage() {
  const router = useRouter()
  const { location, setLocation, date, setDate, image } = useWorkflow()
  const [search, setSearch] = useState("")

  const filtered = PRESETS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <WorkflowSteps current="map" />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Location &amp; date</h1>
        <p className="mt-1 text-sm text-slate-500">
          Georeference the scene and choose the acquisition date.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <MockMap value={location} onChange={setLocation} className="h-[420px]" />
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search location</CardTitle>
              <CardDescription>Pick a preset or drop a pin on the map.</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search places…"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <ul className="mt-3 max-h-52 space-y-1 overflow-y-auto">
                {filtered.map((p) => {
                  const active = location?.name === p.name
                  return (
                    <li key={p.name}>
                      <button
                        onClick={() => setLocation(p)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                          active ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <MapPin className="size-4 shrink-0 text-emerald-500" />
                        <span className="flex-1">{p.name}</span>
                        <span className="text-xs text-slate-400">
                          {p.lat.toFixed(1)}, {p.lng.toFixed(1)}
                        </span>
                      </button>
                    </li>
                  )
                })}
                {filtered.length === 0 ? (
                  <li className="px-3 py-4 text-center text-sm text-slate-400">No matches.</li>
                ) : null}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acquisition date</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Navigation className="size-4 text-slate-400" />
                <div className="text-sm">
                  {location ? (
                    <span className="font-medium text-slate-900">
                      {location.name} · {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </span>
                  ) : (
                    <span className="text-slate-500">No location selected</span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/upload")}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button className="flex-1" disabled={!location} onClick={() => router.push("/query")}>
              Continue to question
              <ArrowRight className="size-4" />
            </Button>
          </div>
          {!image ? (
            <p className="text-center text-xs text-amber-600">
              Tip: you haven&apos;t uploaded an image yet. You can still continue and use the sample scene.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
