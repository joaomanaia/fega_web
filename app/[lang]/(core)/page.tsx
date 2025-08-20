import { Suspense } from "react"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import PostsContent, { PostsSkeleton } from "@/app/[lang]/(core)/PostsContent"
import CreatePost from "@/app/components/create-post/create-post"
import { MainContainer } from "@/app/components/m3/main-container"
import { getSession } from "@/lib/dal"

export default async function HomePage(props: PageProps<"/[lang]">) {
  const { lang } = await props.params
  // Enable static rendering
  setRequestLocale(lang as Locale)

  const t = await getTranslations("HomePage")

  return (
    <main className="flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll md:gap-4 md:pb-3 xl:flex-row-reverse xl:overflow-hidden">
      <h1 className="hidden">{t("title")}</h1>
      <CreatePost />
      <MainContainer className="flex grow flex-col gap-y-4 rounded-none md:gap-y-6 md:overflow-x-hidden md:rounded-[30px] xl:w-full xl:overflow-y-auto">
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
