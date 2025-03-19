"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, ImageIcon, Camera, FileWarning } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface UploadSectionProps {
  onUpload: (imageUrl: string) => void
}

export default function UploadSection({ onUpload }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const simulateUpload = useCallback(() => {
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [])

  const handleFile = useCallback(
    (file: File) => {
      // Check if file is an image
      if (!file.type.match("image.*")) {
        setError("Please upload an image file (JPEG, PNG, etc.)")
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit")
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      const cleanup = simulateUpload()

      // Create a preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)

      return () => cleanup()
    },
    [simulateUpload, toast],
  )

  const handleConfirm = useCallback(() => {
    if (previewImage) {
      onUpload(previewImage)
    }
  }, [previewImage, onUpload])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Upload Your Space</h2>
        <p className="text-muted-foreground">Upload a photo of your room to visualize design changes.</p>
      </div>

      {!previewImage ? (
        <Card
          className={`border-2 border-dashed p-12 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Drag and drop your image here</h3>
              <p className="text-sm text-muted-foreground">or click to browse files (JPEG, PNG)</p>
            </div>
            <label className="cursor-pointer">
              <Button variant="default">Select File</Button>
              <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
            </label>

            {error && (
              <div className="flex items-center gap-2 text-destructive mt-4">
                <FileWarning className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {isUploading && (
              <div className="w-full mt-4 space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Room preview"
                className="object-contain w-full h-full"
              />
            </div>
          </Card>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setPreviewImage(null)}>
              Change Image
            </Button>
            <Button onClick={handleConfirm}>Continue with this Image</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <Camera className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">High Quality Images</h3>
            <p className="text-sm text-muted-foreground">Upload clear, well-lit photos for best results</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <ImageIcon className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Multiple Angles</h3>
            <p className="text-sm text-muted-foreground">Try different perspectives of your room</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <ImageIcon className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Empty Spaces</h3>
            <p className="text-sm text-muted-foreground">Rooms with less furniture yield better results</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

