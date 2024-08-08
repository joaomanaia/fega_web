import { getLocalUserUid } from "@/utils/user-utils"
import PostsContent from "./PostsContent"
import { getDictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"
import CreatePost from "@/app/components/create-post/create-post"
import { MainContainer } from "@/app/components/m3/main-container"

interface HomePageProps {
  params: {
    lang: Locale
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const localUid = await getLocalUserUid()
  const dictionary = await getDictionary(params.lang)

  return (
    <main className="flex flex-col md:pb-3 md:gap-4 xl:flex-row-reverse w-full h-full overflow-auto xl:overflow-hidden">
      <CreatePost dictionary={dictionary} />
      <MainContainer className="flex flex-col rounded-none md:rounded-[30px] gap-y-4 md:gap-y-6 xl:w-full xl:overflow-auto">
        <PostsContent localUid={localUid} lang={params.lang} dictionary={dictionary} />
      </MainContainer>
    </main>
  )
}
