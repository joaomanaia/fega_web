import { getLocalUserUid } from "@/utils/user-utils"
import CreatePost from "../../components/create_post/CreatePost"
import { MainContainer } from "../../components/m3/main-container"
import PostsContent from "./PostsContent"
import { getDictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"

interface HomePageProps {
  params: {
    lang: Locale
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const localUid = await getLocalUserUid()
  const dictionary = await getDictionary(params.lang)

  return (
    <main className="flex flex-col md:pb-3 md:gap-4 lg:flex-row-reverse w-full h-full overflow-auto lg:overflow-hidden">
      <CreatePost dictionary={dictionary} />
      <MainContainer className="flex flex-col rounded-none md:rounded-[30px] space-y-4 md:space-y-6 lg:w-full lg:overflow-auto">
        <PostsContent localUid={localUid} dictionary={dictionary} />
      </MainContainer>
    </main>
  )
}
