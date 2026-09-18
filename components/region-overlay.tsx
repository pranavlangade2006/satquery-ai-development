"use client"

import type { DetectedRegion } from "@/lib/types"

export function RegionOverlay({
  src,
  alt,
  regions,
  showLabels = true,
}: {
  src: string
  alt: string
  regions: DetectedRegion[]
  showLabels?: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200">
      <img src={src || "/placeholder.svg"} alt={alt} className="aspect-video w-full object-cover" />
      <div className="absolute inset-0">
        {regions.map((r, i) => {
          const [x, y, w, h] = r.bbox
          return (
            <div
              key={`${r.label}-${i}`}
              className="absolute rounded-md border-2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${w}%`,
                height: `${h}%`,
                borderColor: r.color,
                boxShadow: `0 0 0 9999px rgba(2,6,23,0.02)`,
                backgroundColor: `${r.color}1f`,
              }}
            >
              {showLabels ? (
                <span
                  className="absolute -top-6 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium text-white"
                  style={{ backgroundColor: r.color }}
                >
                  {r.label} · {Math.round(r.confidence * 100)}%
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
