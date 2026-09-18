export type AnalysisMode =
  | "vqa"
  | "scene-description"
  | "segmentation"
  | "object-detection"
  | "change-detection"

export interface AnalysisModeInfo {
  id: AnalysisMode
  label: string
  description: string
}

export const ANALYSIS_MODES: AnalysisModeInfo[] = [
  {
    id: "vqa",
    label: "Visual Question Answering",
    description: "Ask natural-language questions about the satellite scene.",
  },
  {
    id: "scene-description",
    label: "Scene Description",
    description: "Generate a full descriptive caption of the imagery.",
  },
  {
    id: "segmentation",
    label: "Segmentation",
    description: "Pixel-level land cover classification masks.",
  },
  {
    id: "object-detection",
    label: "Object / Region Detection",
    description: "Detect and localize objects and regions of interest.",
  },
  {
    id: "change-detection",
    label: "Change Detection",
    description: "Compare two acquisitions to highlight change.",
  },
]

export interface ImageMeta {
  name: string
  type: string
  size: number
  dataUrl: string
}

export interface GeoLocation {
  name: string
  lat: number
  lng: number
}

export interface DetectedRegion {
  label: string
  confidence: number
  /** Bounding box in percentages of the image [x, y, w, h] */
  bbox: [number, number, number, number]
  color: string
}

export interface AnalysisResult {
  id: string
  answer: string
  confidence: number
  model: string
  analysisType: string
  question: string
  location: GeoLocation | null
  date: string
  imageName: string
  evidence: string[]
  regions: DetectedRegion[]
  statistics: Record<string, number>
  processingMs: number
  createdAt: string
}

export interface HistoryEntry {
  id: string
  date: string
  question: string
  analysisType: string
  location: string
  confidence: number
  status: "completed" | "processing" | "failed"
  result?: AnalysisResult
}

export interface AnalyzeRequest {
  image: ImageMeta | null
  question: string
  imageType: string
  latitude: number | null
  longitude: number | null
  date: string
  analysisMode: AnalysisMode
}
