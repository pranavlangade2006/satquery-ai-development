"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UploadCloud, ImageIcon, X, ArrowRight, Sparkles, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader, CardTitle, CardDescription, Badge, formatBytes } from "@/components/primitives"
import { WorkflowSteps } from "@/components/workflow-steps"
import { useWorkflow } from "@/components/workflow-provider"
import type { ImageMeta } from "@/lib/types"

const IMAGE_TYPES = [
  { id: "rgb", label: "RGB / Optical", desc: "True-colour visible bands" },
  { id: "multispectral", label: "Multispectral", desc: "NIR, SWIR & more" },
  { id: "sar", label: "SAR / Radar", desc: "Sentinel-1 style backscatter" },
]

export default function UploadPage() {
  const router = useRouter()
  const { image, setImage } = useWorkflow()
  const [dragOver, setDragOver] = useState(false)
  const [imageType, setImageType] = useState("rgb")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    setError(null)
    const file = files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/") && !file.name.match(/\.(tif|tiff)$/i)) {
      setError("Please provide an image file (JPG, PNG, WEBP or GeoTIFF).")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const meta: ImageMeta = {
        name: file.name,
        type: file.type || "image/tiff",
        size: file.size,
        dataUrl: typeof reader.result === "string" ? reader.result : "",
      }
      setImage(meta)
    }
    reader.readAsDataURL(file)
  }

  function useSample() {
    setError(null)
    const meta: ImageMeta = {
      name: "sample-scene.png",
      type: "image/png",
      size: 1_820_000,
      dataUrl: "/satellite-sample.png",
    }
    setImage(meta)
  }

  const canPreview = !!image?.dataUrl

  return (
    <div>
      <WorkflowSteps current="upload" />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Upload satellite image</h1>
        <p className="mt-1 text-sm text-slate-500">
          Provide a scene to analyse. Supported: JPG, PNG, WEBP and GeoTIFF.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardBody className="pt-5 sm:pt-6">
              {!canPreview ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    handleFiles(e.dataTransfer.files)
                  }}
                  onClick={() => inputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
                    dragOver ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-slate-50"
                  }`}
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <UploadCloud className="size-7" />
                  </span>
                  <p className="mt-4 font-medium text-slate-900">
                    Drag &amp; drop your image here
                  </p>
                  <p className="mt-1 text-sm text-slate-500">or click to browse from your device</p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*,.tif,.tiff"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200">
                  <img
                    src={image?.dataUrl || "/placeholder.svg"}
                    alt="Uploaded satellite scene preview"
                    className="aspect-video w-full object-cover"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute right-3 top-3 rounded-lg bg-slate-950/70 p-2 text-white hover:bg-slate-950"
                    aria-label="Remove image"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={() => inputRef.current?.click()}>
                  <FileImage className="size-4" />
                  Choose file
                </Button>
                <Button variant="ghost" onClick={useSample}>
                  <Sparkles className="size-4" />
                  Use sample scene
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image type</CardTitle>
              <CardDescription>Helps the model pick the right pre-processing.</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="grid gap-3 sm:grid-cols-3">
                {IMAGE_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setImageType(t.id)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      imageType === t.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900">{t.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{t.desc}</p>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle>File details</CardTitle>
            </CardHeader>
            <CardBody>
              {image ? (
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Name</dt>
                    <dd className="max-w-[60%] truncate font-medium text-slate-900">{image.name}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Type</dt>
                    <dd className="font-medium text-slate-900">{image.type || "image"}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Size</dt>
                    <dd className="font-medium text-slate-900">{formatBytes(image.size)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Band mode</dt>
                    <dd>
                      <Badge tone="blue">{IMAGE_TYPES.find((t) => t.id === imageType)?.label}</Badge>
                    </dd>
                  </div>
                </dl>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ImageIcon className="size-8 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">No image selected yet.</p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2">
                <Button disabled={!image} onClick={() => router.push("/map")}>
                  Continue to location
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="ghost" nativeButton={false} render={<Link href="/" />}>
                  Cancel
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
