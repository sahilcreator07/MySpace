"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Sparkles, History, Lightbulb } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { designStyles } from "@/lib/initial-data"

interface CustomizationPanelProps {
  onCustomize: (prompt: string) => void
  isGenerating: boolean
  prompts: string[]
  selectedStyle: string
}

export default function CustomizationPanel({
  onCustomize,
  isGenerating,
  prompts,
  selectedStyle,
}: CustomizationPanelProps) {
  const [prompt, setPrompt] = useState("")
  const [activeTab, setActiveTab] = useState("suggestions")

  // Get style-specific suggestions
  const getStyleSuggestions = () => {
    const style = designStyles.find((s) => s.id === selectedStyle)
    if (style && style.suggestions) {
      return style.suggestions
    }
    return defaultSuggestions
  }

  const defaultSuggestions = [
    "Make it more minimalistic",
    "Add warm lighting",
    "Use more natural materials",
    "Add plants and greenery",
    "Change to a modern style",
    "Make it cozier",
  ]

  const suggestions = getStyleSuggestions()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isGenerating) {
      onCustomize(prompt)
      setPrompt("")
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Customize Your Design
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Refine your design by describing the changes you'd like to see.
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>Suggestions</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-2">
            {prompts.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {prompts.map((p, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80"
                    onClick={() => setPrompt(p)}
                  >
                    {p}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">No customization history yet</div>
            )}
          </TabsContent>
        </Tabs>

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your changes..."
            disabled={isGenerating}
          />
          <Button type="submit" disabled={!prompt.trim() || isGenerating}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

