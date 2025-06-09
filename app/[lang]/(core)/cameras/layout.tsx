import { type Metadata } from "next"
import { MainContainer } from "@/app/components/m3/main-container"
import { CamerasList, CamerasListSkeleton } from "./components/cameras-list"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Cameras",
}

interface CameraLayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: CameraLayoutProps) {
  return (
    <main className="flex flex-col h-full md:pb-3 overflow-y-auto">
      {children}
      <MainContainer className="rounded-b-none md:rounded-[30px] last:mt-4">
        <Suspense fallback={<CamerasListSkeleton />}>
          <CamerasList />
        </Suspense>
      </MainContainer>
    </main>
  )
}
