import { getLocalUserUid, getUserByUid } from "@/utils/user-utils"
import CreatePost from "@/app/components/create_post/CreatePost"
import { UserProfileContent } from "./components/UserProfileContent"
import PostsContent from "../PostsContent"
import { MainContainer } from "@/app/components/m3/main-container"
import { cn } from "@/lib/utils"
import { type Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"
import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { FileWarningIcon } from "lucide-react"

interface UserPageProps {
  params: {
    lang: Locale
    uid: string
  }
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const user = await getUserByUid(params.uid)

  const title = user?.full_name || "User Profile"

  return {
    title: title,
    description: user?.bio,
    openGraph: {
      type: "profile",
      title: title,
      description: user?.bio ?? undefined,
      siteName: "Fega",
      url: "https://fega.vercel.app/",
      images: user?.avatar_url ?? undefined,
    },
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const user = await getUserByUid(params.uid)

  if (!user) {
    notFound()
  }

  const localUserUid = await getLocalUserUid()
  const isLocalUser = localUserUid === params.uid

  const dictionary = await getDictionary(params.lang)

  return (
    <main
      itemScope
      itemType="https://schema.org/ProfilePage"
      className="flex flex-col gap-4 md:pb-3 lg:flex-row-reverse w-full h-full overflow-auto lg:overflow-hidden"
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
          <UserProfileContent user={user} isLocalUser={isLocalUser} dictionary={dictionary} />
        </MainContainer>
        {isLocalUser && (
          <CreatePost className="rounded-none rounded-b-[30px]" dictionary={dictionary} />
        )}
      </div>
      <MainContainer className="flex flex-col space-y-4 md:space-y-6 h-full lg:w-full rounded-b-none md:rounded-[30px] lg:overflow-auto">
        <PostsContent
          schemaHasPart // Has part of the main entity
          uid={params.uid}
          localUid={localUserUid}
          lang={params.lang}
          dictionary={dictionary}
          EmptyPostsContent={() => <UserEmptyPostsContent userName={user.full_name ?? "User"} />}
        />
      </MainContainer>
    </main>
  )
}

interface UserEmptyPostsContentProps {
  userName: string
}

const UserEmptyPostsContent: React.FC<UserEmptyPostsContentProps> = ({ userName }) => (
  <div className="flex flex-col items-center justify-center h-full mx-auto max-w-md text-center">
    <FileWarningIcon className="w-16 h-16 text-secondary/50 mb-4" />
    <h2 className="text-xl font-semibold">No posts yet</h2>
    <p className="text-secondary/50 mt-2">
      {userName} hasn't shared anything yet. Be the first to say something!
    </p>
  </div>
)
