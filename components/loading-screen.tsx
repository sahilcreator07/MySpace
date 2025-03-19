import { Loader2 } from "lucide-react"

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-background"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          MySpace
        </h1>
        <p className="text-sm text-muted-foreground">Loading your design experience...</p>
      </div>
    </div>
  )
}

