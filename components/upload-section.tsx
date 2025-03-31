"use client"

import React, { useState, useRef, useCallback } from "react"
import { Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface UploadSectionProps {
  onUpload: (originalImageUrl: string, generatedImageUrl: string) => void;
  selectedStyle: string;
}

export default function UploadSection({ onUpload, selectedStyle }: UploadSectionProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [userPrompt, setUserPrompt] = useState("Minimalist office with clean lines, neutral tones, sleek ergonomic furniture, natural light, and no unnecessary items or clutter.")
  const [selectedColor, setSelectedColor] = useState("Neutral")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const colorPalettes = ["Neutral", "Earthy", "Monochrome", "Pastel", "Bold"]

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleConfirm = async () => {
    if (!previewImage) return
    setIsUploading(true)

    try {
      const response = await fetch(previewImage)
      const blob = await response.blob()
      const formData = new FormData()
      formData.append("file", blob, "uploaded.png")

      const fullPrompt = `${selectedStyle} style with a ${selectedColor} color palette. ${userPrompt}`
      formData.append("prompt", fullPrompt)

      const backendResponse = await fetch("http://127.0.0.1:8000/generate/", {
        method: "POST",
        body: formData,
      })

      const data = await backendResponse.json()
      console.log("✅ Backend response:", data)

      onUpload(data.original_image_url, data.generated_image_url)

      toast({ title: "Success", description: "Image uploaded and processed!" })
    } catch (error) {
      console.error("Upload failed", error)
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Upload Your Space</h2>
        <p className="text-muted-foreground">Upload a photo of your room, choose a mood board and color palette, then enter a design prompt.</p>
      </div>

      {!previewImage ? (
        <Card
          className="border-2 border-dashed p-12 text-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center gap-4">
            <Upload className="h-8 w-8 text-primary" />
            <Button>Select File</Button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleChange} />
          </CardContent>
        </Card>
      ) : (
        <>
          <img src={previewImage} alt="preview" className="rounded-md shadow w-full max-h-[400px] object-contain" />

          <div className="space-y-2">
            <Input
              placeholder={`e.g., ${selectedStyle} living room with natural lighting`}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
            />

            <div className="mt-2">
              <p className="text-sm font-medium text-muted-foreground mb-1">Select Color Palette:</p>
              <div className="flex flex-wrap gap-2">
                {colorPalettes.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(color)}
                    size="sm"
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewImage(null)}>Change</Button>
            <Button onClick={handleConfirm} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Continue"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
