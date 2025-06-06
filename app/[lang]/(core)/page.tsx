import { getLocalUserUid } from "@/utils/user-utils"
import PostsContent, { PostsSkeleton } from "./PostsContent"
import CreatePost from "@/app/components/create-post/create-post"
import { MainContainer } from "@/app/components/m3/main-container"
import { Suspense } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Locale } from "next-intl"

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
    <main className="flex flex-col md:pb-3 md:gap-4 xl:flex-row-reverse w-full h-full overflow-auto xl:overflow-hidden">
      <h1 className="hidden">{t("title")}</h1>
      <CreatePost />
      <MainContainer className="flex flex-col rounded-none md:rounded-[30px] gap-y-4 md:gap-y-6 xl:w-full xl:overflow-auto">
        <Suspense fallback={<PostsSkeleton />}>
          <HomePagePostsContent />
        </Suspense>
      </MainContainer>
    </main>
  )
}

async function HomePagePostsContent() {
  const localUid = await getLocalUserUid()

  return <PostsContent localUid={localUid} />
}
