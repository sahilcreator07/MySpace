"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html, PerspectiveCamera, useProgress } from "@react-three/drei"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RotateCw, ZoomIn, ZoomOut, Move } from "lucide-react"
import type { DesignState } from "@/types/design"
import { Badge } from "@/components/ui/badge"

interface DesignViewerProps {
  designState: DesignState
  isGenerating: boolean
}

function Model() {
  const { scene } = useGLTF("/assets/3d/duck.glb")
  return <primitive object={scene} scale={2} position={[0, 0, 0]} />
}

function LoadingIndicator() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg flex flex-col items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>Loading 3D model... {progress.toFixed(0)}%</span>
      </div>
    </Html>
  )
}

function GeneratingIndicator() {
  return (
    <Html center>
      <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>Generating your design...</span>
      </div>
    </Html>
  )
}

export default function DesignViewer({ designState, isGenerating }: DesignViewerProps) {
  const controlsRef = useRef(null)
  const [cameraPosition, setCameraPosition] = useState([0, 2, 5])
  const [showControls, setShowControls] = useState(false)

  // Show controls after a brief delay when the model is loaded
  useEffect(() => {
    if (designState.generated && !isGenerating) {
      const timer = setTimeout(() => {
        setShowControls(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [designState.generated, isGenerating])

  const resetCamera = () => {
    if (controlsRef.current) {
      // @ts-ignore - Type issue with OrbitControls ref
      controlsRef.current.reset()
    }
  }

  const zoomIn = () => {
    if (controlsRef.current) {
      // @ts-ignore - Type issue with OrbitControls ref
      controlsRef.current.dollyIn(1.2)
      // @ts-ignore
      controlsRef.current.update()
    }
  }

  const zoomOut = () => {
    if (controlsRef.current) {
      // @ts-ignore - Type issue with OrbitControls ref
      controlsRef.current.dollyOut(1.2)
      // @ts-ignore
      controlsRef.current.update()
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9] w-full">
        {designState.generated ? (
          <div className="w-full h-full">
            <Canvas shadows>
              <Suspense fallback={<LoadingIndicator />}>
                <PerspectiveCamera makeDefault position={cameraPosition as any} fov={50} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
                <pointLight position={[-10, -10, -10]} />

                {isGenerating ? <GeneratingIndicator /> : <Model />}

                <Environment preset="apartment" />
                <OrbitControls
                  ref={controlsRef}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={1.5}
                  maxDistance={10}
                  dampingFactor={0.1}
                  rotateSpeed={0.5}
                />
              </Suspense>
            </Canvas>

            {showControls && (
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={zoomIn}
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={zoomOut}
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={resetCamera}
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            )}

            {designState.selectedStyle && (
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  {designState.selectedStyle} style
                </Badge>
              </div>
            )}

            {showControls && (
              <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                <Move className="h-3 w-3" />
                <span>Drag to rotate • Scroll to zoom</span>
              </div>
            )}
          </div>
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
                <h3 className="text-lg font-medium">Ready to transform your space</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Click "Generate Design" to create a 3D visualization
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

