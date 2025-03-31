"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, EyeOff } from "lucide-react"
import type { DesignState } from "@/types/design"

interface DesignViewerProps {
  designState: DesignState
  isGenerating: boolean
}

export default function DesignViewer({ designState, isGenerating }: DesignViewerProps) {
  const [showGenerated, setShowGenerated] = useState(true)

  const hasUserImage = !!designState.userImage
  const hasGeneratedImage = !!designState.generatedDesign

  const displayedImage = showGenerated
    ? designState.generatedDesign ?? ""
    : designState.userImage ?? ""

  const label = showGenerated ? "Showing: Generated Design" : "Showing: Original Upload"

  useEffect(() => {
    console.log("🖼️ userImage:", designState.userImage)
    console.log("🎨 generatedDesign:", designState.generatedDesign)
  }, [designState])

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9] w-full">
        {displayedImage ? (
          <img
            src={displayedImage}
            alt={showGenerated ? "Generated Design" : "Original Upload"}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
              console.error("⚠️ Failed to load image:", displayedImage)
            }}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-lg font-medium">Generating your design...</p>
                <p className="text-sm text-muted-foreground">This may take a moment</p>
              </div>
            ) : (
              <div className="text-center p-6">
                <h3 className="text-lg font-medium">No design to show yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload an image and generate a design to preview it here.
                </p>
              </div>
            )}
          </div>
        )}

        {(hasGeneratedImage || hasUserImage) && !isGenerating && (
          <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-md rounded-md shadow p-2 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowGenerated(!showGenerated)}
            >
              {showGenerated ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="ml-2 text-xs">
                {showGenerated ? "Show Original" : "Show Generated"}
              </span>
            </Button>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
