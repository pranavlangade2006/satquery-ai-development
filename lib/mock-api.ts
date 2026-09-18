import {
  ANALYSIS_MODES,
  type AnalysisMode,
  type AnalysisResult,
  type AnalyzeRequest,
  type DetectedRegion,
  type HistoryEntry,
} from "./types"

/**
 * Mock service layer for SatQuery AI.
 *
 * These functions emulate the future Python / FastAPI backend so the whole
 * frontend workflow is functional today. Swap the bodies for real `fetch`
 * calls (e.g. POST /analyze) when the AI/ML backend is connected.
 */

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const MODEL_BY_MODE: Record<AnalysisMode, string> = {
  vqa: "SatQuery-VLM",
  "scene-description": "SatQuery-Caption",
  segmentation: "SatQuery-SegFormer",
  "object-detection": "SatQuery-DETR",
  "change-detection": "SatQuery-ChangeNet",
}

function modeLabel(mode: AnalysisMode) {
  return ANALYSIS_MODES.find((m) => m.id === mode)?.label ?? "Remote Sensing VQA"
}

function buildRegions(): DetectedRegion[] {
  return [
    { label: "Vegetation", confidence: 0.94, bbox: [6, 8, 40, 48], color: "#16a34a" },
    { label: "Built-up", confidence: 0.89, bbox: [55, 42, 38, 46], color: "#2563eb" },
    { label: "Open land", confidence: 0.82, bbox: [10, 62, 34, 30], color: "#d97706" },
  ]
}

function buildAnswer(mode: AnalysisMode, question: string): string {
  switch (mode) {
    case "scene-description":
      return "The scene shows a mixed-use landscape with dense vegetation to the north-west, a compact built-up settlement in the south-east, and exposed open land along the river corridor."
    case "segmentation":
      return "Segmentation complete. Three dominant land-cover classes were separated: vegetation, built-up surfaces, and bare/open land, with clear boundaries along the waterway."
    case "object-detection":
      return "Detection complete. The model localized a vegetated zone, an urban built-up cluster, and an open-land region as the primary areas of interest."
    case "change-detection":
      return "Comparing the two acquisitions, roughly a third of the vegetated area has been converted to built-up and cleared land, indicating notable land-use change."
    default:
      return "The image contains vegetation, open land and built-up areas. Vegetation dominates the north-west while built-up development is concentrated in the south-east."
  }
}

export async function analyze(req: AnalyzeRequest): Promise<AnalysisResult> {
  // Simulate network + inference latency.
  const processingMs = 6200 + Math.round(Math.random() * 1500)
  await delay(50)

  const result: AnalysisResult = {
    id: `an_${Date.now().toString(36)}`,
    answer: buildAnswer(req.analysisMode, req.question),
    confidence: 0.92,
    model: MODEL_BY_MODE[req.analysisMode],
    analysisType: modeLabel(req.analysisMode),
    question: req.question || "Describe this satellite scene.",
    location:
      req.latitude != null && req.longitude != null
        ? { name: "Selected location", lat: req.latitude, lng: req.longitude }
        : null,
    date: req.date,
    imageName: req.image?.name ?? "satellite-scene.tif",
    evidence: ["Vegetation detected", "Built-up area detected", "Open land detected"],
    regions: buildRegions(),
    statistics: { Vegetation: 42, "Built-up": 31, "Open land": 27 },
    processingMs,
    createdAt: new Date().toISOString(),
  }

  return result
}

export interface ChangeDetectionResult {
  changedAreaPercent: number
  summary: string
  regions: DetectedRegion[]
  stats: { label: string; value: number; color: string }[]
}

export async function detectChange(): Promise<ChangeDetectionResult> {
  await delay(2200)
  return {
    changedAreaPercent: 34,
    summary:
      "Significant land-cover change detected. Approximately 34% of the scene changed between acquisitions, driven by vegetation loss and new built-up development.",
    regions: [
      { label: "Vegetation loss", confidence: 0.93, bbox: [8, 12, 44, 40], color: "#dc2626" },
      { label: "New built-up", confidence: 0.88, bbox: [52, 48, 40, 40], color: "#7c3aed" },
    ],
    stats: [
      { label: "Vegetation loss", value: 21, color: "#dc2626" },
      { label: "New built-up", value: 9, color: "#7c3aed" },
      { label: "Water change", value: 4, color: "#0891b2" },
      { label: "Unchanged", value: 66, color: "#94a3b8" },
    ],
  }
}

const SAMPLE_HISTORY: HistoryEntry[] = [
  {
    id: "an_seed1",
    date: "2026-09-14",
    question: "What type of land cover is visible?",
    analysisType: "Visual Question Answering",
    location: "22.5726, 88.3639",
    confidence: 0.92,
    status: "completed",
  },
  {
    id: "an_seed2",
    date: "2026-09-11",
    question: "Identify built-up regions.",
    analysisType: "Object / Region Detection",
    location: "19.0760, 72.8777",
    confidence: 0.87,
    status: "completed",
  },
  {
    id: "an_seed3",
    date: "2026-09-08",
    question: "What changes can be seen since last year?",
    analysisType: "Change Detection",
    location: "13.0827, 80.2707",
    confidence: 0.81,
    status: "completed",
  },
  {
    id: "an_seed4",
    date: "2026-09-03",
    question: "Is there vegetation in this area?",
    analysisType: "Scene Description",
    location: "28.7041, 77.1025",
    confidence: 0.9,
    status: "completed",
  },
]

export function getSeedHistory(): HistoryEntry[] {
  return SAMPLE_HISTORY
}
