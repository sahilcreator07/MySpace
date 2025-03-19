import type { DesignState } from "@/types/design"

export const designStyles = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean lines, simple color palettes, and uncluttered spaces.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Minimalist",
    tags: ["Clean", "Simple", "Modern"],
    suggestions: [
      "Remove unnecessary furniture",
      "Use neutral color palette",
      "Add more white space",
      "Simplify the layout",
      "Use hidden storage solutions",
    ],
  },
  {
    id: "scandinavian",
    name: "Scandinavian",
    description: "Light, airy spaces with functional furniture and natural elements.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Scandinavian",
    tags: ["Light", "Natural", "Functional"],
    suggestions: [
      "Add more natural light",
      "Use light wood tones",
      "Incorporate wool textiles",
      "Add plants for greenery",
      "Use simple functional furniture",
    ],
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Raw materials, exposed structures, and vintage factory elements.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Industrial",
    tags: ["Raw", "Exposed", "Urban"],
    suggestions: [
      "Add exposed brick wall",
      "Use metal fixtures",
      "Incorporate concrete elements",
      "Add vintage factory lighting",
      "Use reclaimed wood furniture",
    ],
  },
  {
    id: "mid-century",
    name: "Mid-Century Modern",
    description: "Retro-inspired designs from the mid-20th century with bold colors.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Mid-Century",
    tags: ["Retro", "Bold", "Geometric"],
    suggestions: [
      "Add statement furniture pieces",
      "Use bold geometric patterns",
      "Incorporate warm wood tones",
      "Add vintage-inspired lighting",
      "Use vibrant accent colors",
    ],
  },
  {
    id: "bohemian",
    name: "Bohemian",
    description: "Eclectic mix of patterns, textures, and global influences.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Bohemian",
    tags: ["Eclectic", "Textured", "Global"],
    suggestions: [
      "Add more textured textiles",
      "Mix patterns and colors",
      "Incorporate global decor elements",
      "Add macramé or woven wall hangings",
      "Use floor cushions and low seating",
    ],
  },
  {
    id: "contemporary",
    name: "Contemporary",
    description: "Current trends with clean, subtle sophistication and thoughtful spaces.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Contemporary",
    tags: ["Current", "Sophisticated", "Thoughtful"],
    suggestions: [
      "Update with current color trends",
      "Add smart home technology",
      "Use sustainable materials",
      "Incorporate statement lighting",
      "Add sculptural furniture pieces",
    ],
  },
]

export const initialDesignState: DesignState = {
  selectedStyle: "minimalist",
  userImage: null,
  generated: false,
  generatedDesign: null,
  customizationPrompts: [],
}

