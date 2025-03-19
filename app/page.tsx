import { Suspense } from "react"
import MainLayout from "@/components/main-layout"
import LoadingScreen from "@/components/loading-screen"

export default function Home() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <MainLayout />
    </Suspense>
  )
}

