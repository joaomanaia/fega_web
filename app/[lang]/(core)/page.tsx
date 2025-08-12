import { Suspense } from "react"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import CreatePost from "@/app/components/create-post/create-post"
import { MainContainer } from "@/app/components/m3/main-container"
import { getSession } from "@/lib/dal"
import PostsContent, { PostsSkeleton } from "./PostsContent"

interface HomePageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function HomePage(props: HomePageProps) {
  const { lang } = await props.params
  // Enable static rendering
  setRequestLocale(lang)

  const t = await getTranslations("HomePage")

  return (
    <main className="flex h-full w-full flex-col overflow-auto md:gap-4 md:pb-3 xl:flex-row-reverse xl:overflow-hidden">
      <h1 className="hidden">{t("title")}</h1>
      <CreatePost />
      <MainContainer className="flex flex-col gap-y-4 rounded-none md:gap-y-6 md:rounded-[30px] xl:w-full xl:overflow-auto">
        <Suspense fallback={<PostsSkeleton />}>
          <HomePagePostsContent />
        </Suspense>
      </MainContainer>
    </main>
  )
}

async function HomePagePostsContent() {
  const session = await getSession()

  return <PostsContent localUid={session?.uid ?? null} />
}
