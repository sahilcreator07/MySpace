"use client"

import { Card, CardContent } from "@/components/ui/card"
import { designStyles } from "@/lib/initial-data"
import { Badge } from "@/components/ui/badge"

interface MoodBoardSectionProps {
  onSelect: (style: string) => void
  selectedStyle: string
}

export default function MoodBoardSection({ onSelect, selectedStyle }: MoodBoardSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Design Styles</h2>
        <p className="text-muted-foreground">
          Browse through different interior design styles and find inspiration for your space.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designStyles.map((style) => (
          <Card
            key={style.id}
            className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
              selectedStyle === style.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelect(style.id)}
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={style.imageUrl || "/placeholder.svg"}
                alt={style.name}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              />
              {selectedStyle === style.id && (
                <div className="absolute top-2 right-2">
                  <Badge variant="default">Selected</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{style.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{style.description}</p>
              <div className="flex gap-2 mt-3">
                {style.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

