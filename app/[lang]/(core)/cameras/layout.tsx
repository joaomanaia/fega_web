import { type Metadata } from "next"
import { MainContainer } from "@/app/components/m3/main-container"
import { type Locale } from "@/i18n-config"
import { CamerasList, CamerasListSkeleton } from "./components/cameras-list"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Cameras",
}

export const dynamic = "force-dynamic"

interface CameraLayoutProps {
  params: Promise<{
    lang: Locale
  }>
  children: React.ReactNode
}

export default async function Layout({ children, params }: CameraLayoutProps) {
  const { lang } = await params

  return (
    <main className="flex flex-col h-full md:pb-3 overflow-y-auto">
      {children}
      <MainContainer className="rounded-b-none md:rounded-[30px] last:mt-4">
        <Suspense fallback={<CamerasListSkeleton />}>
          <CamerasList lang={lang} />
        </Suspense>
      </MainContainer>
    </main>
  )
}
