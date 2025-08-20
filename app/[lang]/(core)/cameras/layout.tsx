import { Suspense, use } from "react"
import { type Metadata } from "next"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { MainContainer } from "@/app/components/m3/main-container"
import { CamerasList, CamerasListSkeleton } from "./_components/cameras-list"

export const metadata: Metadata = {
  title: "Cameras",
}

export default function Layout({ children, params }: LayoutProps<"/[lang]/cameras">) {
  const { lang } = use(params)
  setRequestLocale(lang as Locale)

  return (
    <main className="flex h-full flex-col overflow-y-auto md:pb-3">
      {children}
      <MainContainer className="rounded-b-none last:mt-4 md:rounded-[30px]">
        <Suspense fallback={<CamerasListSkeleton />}>
          <CamerasList />
        </Suspense>
      </MainContainer>
    </main>
  )
}
