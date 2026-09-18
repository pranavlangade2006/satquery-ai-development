"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type {
  AnalysisMode,
  AnalysisResult,
  GeoLocation,
  HistoryEntry,
  ImageMeta,
} from "@/lib/types"
import { getSeedHistory } from "@/lib/mock-api"

interface WorkflowState {
  image: ImageMeta | null
  location: GeoLocation | null
  date: string
  question: string
  mode: AnalysisMode
  result: AnalysisResult | null
  history: HistoryEntry[]
}

interface WorkflowContextValue extends WorkflowState {
  setImage: (image: ImageMeta | null) => void
  setLocation: (location: GeoLocation | null) => void
  setDate: (date: string) => void
  setQuestion: (question: string) => void
  setMode: (mode: AnalysisMode) => void
  setResult: (result: AnalysisResult | null) => void
  addHistory: (entry: HistoryEntry) => void
  reset: () => void
  /** Progress helpers */
  hasImage: boolean
  hasLocation: boolean
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null)

const STORAGE_KEY = "satquery.workflow.v1"

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

const DEFAULT_STATE: WorkflowState = {
  image: null,
  location: null,
  date: todayISO(),
  question: "",
  mode: "vqa",
  result: null,
  history: [],
}

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkflowState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate lightweight fields from sessionStorage on mount.
  useEffect(() => {
    let restored: Partial<WorkflowState> = {}
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) restored = JSON.parse(raw)
    } catch {
      // ignore
    }
    setState((prev) => ({
      ...prev,
      ...restored,
      history: restored.history?.length ? restored.history : getSeedHistory(),
    }))
    setHydrated(true)
  }, [])

  // Persist a lightweight snapshot (skip the heavy image data url).
  useEffect(() => {
    if (!hydrated) return
    try {
      const { image, ...rest } = state
      const snapshot = {
        ...rest,
        image: image ? { ...image, dataUrl: "" } : null,
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    } catch {
      // storage may be full or unavailable; non-fatal
    }
  }, [state, hydrated])

  const setImage = useCallback((image: ImageMeta | null) => setState((s) => ({ ...s, image })), [])
  const setLocation = useCallback(
    (location: GeoLocation | null) => setState((s) => ({ ...s, location })),
    [],
  )
  const setDate = useCallback((date: string) => setState((s) => ({ ...s, date })), [])
  const setQuestion = useCallback((question: string) => setState((s) => ({ ...s, question })), [])
  const setMode = useCallback((mode: AnalysisMode) => setState((s) => ({ ...s, mode })), [])
  const setResult = useCallback((result: AnalysisResult | null) => setState((s) => ({ ...s, result })), [])
  const addHistory = useCallback(
    (entry: HistoryEntry) => setState((s) => ({ ...s, history: [entry, ...s.history] })),
    [],
  )
  const reset = useCallback(
    () =>
      setState((s) => ({
        ...DEFAULT_STATE,
        date: todayISO(),
        history: s.history,
      })),
    [],
  )

  const value = useMemo<WorkflowContextValue>(
    () => ({
      ...state,
      setImage,
      setLocation,
      setDate,
      setQuestion,
      setMode,
      setResult,
      addHistory,
      reset,
      hasImage: !!state.image,
      hasLocation: !!state.location,
    }),
    [state, setImage, setLocation, setDate, setQuestion, setMode, setResult, addHistory, reset],
  )

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext)
  if (!ctx) throw new Error("useWorkflow must be used within a WorkflowProvider")
  return ctx
}
