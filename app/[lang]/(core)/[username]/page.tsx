import { getLocalUserUid, getUserByUsername } from "@/utils/user-utils"
import CreatePost from "@/app/components/create-post/create-post"
import { UserProfileContent } from "./components/user-profile-content"
import PostsContent from "../PostsContent"
import { MainContainer } from "@/app/components/m3/main-container"
import { cn } from "@/lib/utils"
import { type Locale } from "@/i18n-config"
import { type Dictionary, getDictionary } from "@/get-dictionary"
import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { FileWarningIcon } from "lucide-react"

interface UserPageProps {
  params: Promise<{
    lang: Locale
    username: string
  }>
}

export async function generateMetadata(props: UserPageProps): Promise<Metadata> {
  const params = await props.params
  const user = await getUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  const title = user.full_name ?? user.username

  return {
    title: title,
    description: user.bio,
    openGraph: {
      type: "profile",
      title: title,
      description: user.bio ?? undefined,
      siteName: "Fega",
      url: user.username,
      images: user.avatar_url ?? undefined,
    },
  }
}

export default async function UserPage(props: UserPageProps) {
  const params = await props.params
  const user = await getUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  const localUserUid = await getLocalUserUid()
  const isLocalUser = localUserUid === user.id

  const dictionary = await getDictionary(params.lang)

  return (
    <main
      itemScope
      itemType="https://schema.org/ProfilePage"
      className="flex flex-col md:pb-3 md:gap-4 xl:flex-row-reverse w-full h-full overflow-auto xl:overflow-hidden"
    >
      <meta itemProp="dateCreated" content={user.created_at} />
      <meta itemProp="dateModified" content={user.updated_at ?? undefined} />
      <div
        itemScope
        itemProp="mainEntity"
        itemType="https://schema.org/Person"
        className="flex flex-col md:gap-4"
      >
        <meta itemProp="identifier" content={user.id} />
        <MainContainer
          className={cn(
            "h-fit xl:w-96 flex flex-col space-y-4",
            isLocalUser && "rounded-b-none md:rounded-[30px]"
          )}
        >
          <UserProfileContent
            user={user}
            isLocalUser={isLocalUser}
            dictionary={dictionary}
            lang={params.lang}
          />
        </MainContainer>
        {isLocalUser && (
          <CreatePost className="rounded-none rounded-b-[30px]" dictionary={dictionary} />
        )}
      </div>
      <MainContainer className="flex flex-col rounded-none md:rounded-[30px] gap-y-4 md:gap-y-6 xl:w-full xl:overflow-auto">
        <PostsContent
          schemaHasPart // Has part of the main entity
          uid={user.id}
          localUid={localUserUid}
          lang={params.lang}
          dictionary={dictionary}
          EmptyPostsContent={() => (
            <UserEmptyPostsContent
              userName={user.full_name ?? "User"}
              dictionary={dictionary.post.emptyPosts}
            />
          )}
        />
      </MainContainer>
    </main>
  )
}

interface UserEmptyPostsContentProps {
  userName: string
  dictionary: Dictionary["post"]["emptyPosts"]
}

const UserEmptyPostsContent: React.FC<UserEmptyPostsContentProps> = ({ userName, dictionary }) => (
  <div className="flex flex-col py-8 items-center justify-center h-full mx-auto max-w-md text-center">
    <FileWarningIcon className="w-16 h-16 text-secondary/50 mb-4" />
    <h2 className="text-xl font-semibold">{dictionary.header}</h2>
    <p className="text-secondary/50 mt-2">
      <b>{userName}</b> {dictionary.description.user}
    </p>
  </div>
)
