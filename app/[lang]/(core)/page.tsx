import { getLocalUserUid } from "@/utils/user-utils"
import PostsContent, { PostsSkeleton } from "./PostsContent"
import { type Dictionary, getDictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"
import CreatePost from "@/app/components/create-post/create-post"
import { MainContainer } from "@/app/components/m3/main-container"
import { Suspense } from "react"

interface HomePageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function HomePage(props: HomePageProps) {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)

  return (
    <main className="flex flex-col md:pb-3 md:gap-4 xl:flex-row-reverse w-full h-full overflow-auto xl:overflow-hidden">
      <h1 className="hidden">{dictionary.navdrawer.home}</h1>
      <CreatePost dictionary={dictionary} />
      <MainContainer className="flex flex-col rounded-none md:rounded-[30px] gap-y-4 md:gap-y-6 xl:w-full xl:overflow-auto">
        <Suspense fallback={<PostsSkeleton />}>
          <HomePagePostsContent lang={params.lang} dictionary={dictionary} />
        </Suspense>
      </MainContainer>
    </main>
  )
}

async function HomePagePostsContent({
  lang,
  dictionary,
}: {
  lang: Locale
  dictionary: Dictionary
}) {
  const localUid = await getLocalUserUid()

  return <PostsContent localUid={localUid} lang={lang} dictionary={dictionary} />
}
