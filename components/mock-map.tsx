"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Plus, Minus, Crosshair } from "lucide-react"
import type { GeoLocation } from "@/lib/types"
import { cn } from "@/lib/utils"

/**
 * Lightweight interactive "map" surface backed by a satellite basemap image.
 * Clicking places a marker and derives lat/lng from the click position and the
 * current view center + zoom. This mirrors a real slippy-map API surface so it
 * can be swapped for Leaflet / Mapbox later without changing callers.
 */
export function MockMap({
  value,
  onChange,
  interactive = true,
  className,
  markerColor = "#059669",
}: {
  value: GeoLocation | null
  onChange?: (loc: GeoLocation) => void
  interactive?: boolean
  className?: string
  markerColor?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(5)
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }) // India

  // Span of the visible window in degrees, shrinking as we zoom in.
  const latSpan = 60 / zoom
  const lngSpan = 90 / zoom

  // Recenter the view when a location is set that falls outside the window
  // (e.g. chosen from the search presets rather than by clicking).
  useEffect(() => {
    if (!value) return
    const outOfView =
      Math.abs(value.lng - center.lng) > lngSpan / 2 || Math.abs(value.lat - center.lat) > latSpan / 2
    if (outOfView) setCenter({ lat: value.lat, lng: value.lng })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.lat, value?.lng])

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!interactive || !onChange || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width // 0..1 left->right
    const py = (e.clientY - rect.top) / rect.height // 0..1 top->bottom
    const lng = center.lng + (px - 0.5) * lngSpan
    const lat = center.lat - (py - 0.5) * latSpan
    onChange({
      name: "Dropped pin",
      lat: Number(lat.toFixed(4)),
      lng: Number(lng.toFixed(4)),
    })
  }

  // Convert the selected location back to a pixel position for the marker.
  let markerPos: { x: number; y: number } | null = null
  if (value) {
    const x = (value.lng - center.lng) / lngSpan + 0.5
    const y = 0.5 - (value.lat - center.lat) / latSpan
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) markerPos = { x: x * 100, y: y * 100 }
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl ring-1 ring-slate-200", className)}>
      <div
        ref={ref}
        onClick={handleClick}
        className={cn(
          "relative h-full w-full bg-slate-800 bg-cover bg-center",
          interactive && "cursor-crosshair",
        )}
        style={{
          backgroundImage: "url(/map-satellite.png)",
          backgroundSize: `${zoom * 40}%`,
        }}
        role={interactive ? "button" : undefined}
        aria-label={interactive ? "Select a location on the map" : "Location map"}
      >
        {/* subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {markerPos ? (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full drop-shadow"
            style={{ left: `${markerPos.x}%`, top: `${markerPos.y}%` }}
          >
            <MapPin className="size-8" style={{ color: markerColor, fill: markerColor }} />
          </div>
        ) : null}

        {/* Coordinate readout */}
        {value ? (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
          </div>
        ) : (
          interactive && (
            <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              <Crosshair className="size-3.5" />
              Click anywhere to drop a pin
            </div>
          )
        )}
      </div>

      {interactive ? (
        <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg ring-1 ring-slate-300">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(12, z + 1))}
            className="bg-white p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Zoom in"
          >
            <Plus className="size-4" />
          </button>
          <div className="h-px bg-slate-200" />
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(2, z - 1))}
            className="bg-white p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Zoom out"
          >
            <Minus className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  )
}
