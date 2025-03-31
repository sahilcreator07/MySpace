"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import MoodBoardSection from "@/components/mood-board-section"
import UploadSection from "@/components/upload-section"
import DesignViewer from "@/components/design-viewer"
import CustomizationPanel from "@/components/customization-panel"
import type { DesignState } from "@/types/design"
import { initialDesignState } from "@/lib/initial-data"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState("mood-boards")
  const [designState, setDesignState] = useState<DesignState>(initialDesignState)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  // ✅ Restore state from localStorage if available
  useEffect(() => {
    const savedState = localStorage.getItem("myspace-design-state")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)

        // ✅ Ensure base64 userImage is carried over correctly
        setDesignState((prev) => ({
          ...prev,
          ...parsedState,
          userImage: parsedState.userImage || null,
        }))

        if (parsedState.generated) {
          setIsCustomizing(true)
        }
      } catch (e) {
        console.error("Failed to parse saved state", e)
      }
    }
  }, [])

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("myspace-design-state", JSON.stringify(designState))
  }, [designState])

  const handleMoodBoardSelect = (style: string) => {
    setDesignState((prev) => ({ ...prev, selectedStyle: style }))
    toast({
      title: "Style selected",
      description: `You've selected the ${style} style.`,
    })
  }

  const handleImageUpload = (originalUrl: string, generatedUrl: string) => {
    setDesignState((prev) => ({
      ...prev,
      userImage: originalUrl,
      generatedDesign: generatedUrl,
      generated: true,
    }))
    setActiveTab("design")
  }

  const handleGenerateDesign = async () => {
    if (!designState.userImage) return

    setIsGenerating(true)

    toast({
      title: "Processing your design",
      description: "Analyzing your space and applying design principles...",
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Creating 3D model",
      description: "Generating a realistic representation of your space...",
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setDesignState((prev) => ({
      ...prev,
      generated: true,
      generatedDesign: `/generated_images/generated_output.png`, // ✅ Updated if using FastAPI
    }))

    setIsGenerating(false)
    setIsCustomizing(true)

    toast({
      title: "Design generated!",
      description: "Your space has been transformed. Try customizing it further!",
    })
  }

  const handleCustomization = async (prompt: string) => {
    setIsGenerating(true)

    toast({
      title: "Applying changes",
      description: `"${prompt}" - Updating your design...`,
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setDesignState((prev) => ({
      ...prev,
      customizationPrompts: [...prev.customizationPrompts, prompt],
      generatedDesign: `http://127.0.0.1:8000/generated_images/generated_output.png`
    }))

    setIsGenerating(false)

    toast({
      title: "Changes applied",
      description: "Your design has been updated based on your prompt.",
    })
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to start over? This will reset your current design.")) {
      setDesignState(initialDesignState)
      setIsCustomizing(false)
      setActiveTab("mood-boards")
      localStorage.removeItem("myspace-design-state")
      toast({
        title: "Design reset",
        description: "Your workspace has been cleared. Start fresh!",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            MySpace
          </h1>
          <div className="flex items-center gap-2">
            {designState.userImage && (
              <Button
                variant="default"
                disabled={isGenerating}
                onClick={handleGenerateDesign}
                size={isMobile ? "sm" : "default"}
              >
                {isGenerating ? "Generating..." : "Generate Design"}
              </Button>
            )}
            <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleReset}>
              New Design
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mood-boards">Mood Boards</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="design" disabled={!designState.userImage}>
              Design
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mood-boards" className="space-y-4">
            <MoodBoardSection onSelect={handleMoodBoardSelect} selectedStyle={designState.selectedStyle} />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <UploadSection onUpload={handleImageUpload} />
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DesignViewer designState={designState} isGenerating={isGenerating} />
              </div>
              {isCustomizing && (
                <div className="lg:col-span-1">
                  <CustomizationPanel
                    onCustomize={handleCustomization}
                    isGenerating={isGenerating}
                    prompts={designState.customizationPrompts}
                    selectedStyle={designState.selectedStyle}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          © 2025 MySpace Interior Design. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
