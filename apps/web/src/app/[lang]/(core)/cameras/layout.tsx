import { Suspense } from "react"
import { type Metadata } from "next"
import { MainContainer } from "@/app/components/m3/main-container"
import { CamerasList, CamerasListSkeleton } from "./_components/cameras-list"

export const metadata: Metadata = {
  title: "Cameras",
}

export default function Layout({ children }: LayoutProps<"/[lang]/cameras">) {
  return (
    <main className="flex h-full flex-col gap-y-4 overflow-y-auto md:pb-3">
      {children}
      <MainContainer className="h-full rounded-b-none md:h-fit md:rounded-[30px]">
        <Suspense fallback={<CamerasListSkeleton />}>
          <CamerasList />
        </Suspense>
      </MainContainer>
    </main>
  )
}
