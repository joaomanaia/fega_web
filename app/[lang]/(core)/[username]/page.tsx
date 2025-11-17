import { Suspense } from "react"
import { notFound } from "next/navigation"
import { type Metadata } from "next"
import { useTranslations, type Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import CreatePost from "@/app/components/create-post/create-post"
import { MainContainer } from "@/app/components/m3/main-container"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { getSession } from "@/lib/dal"
import { getUserByUsername } from "@/utils/user-utils"
import PostsContent, { PostsSkeleton } from "../PostsContent"
import { UserProfileContent } from "./components/user-profile-content"

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
  // Enable static rendering
  setRequestLocale(params.lang)
  const user = await getUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  const session = await getSession()
  const localUserUid = session?.uid
  const isLocalUser = localUserUid === user.id

  return (
    <main
      itemScope
      itemType="https://schema.org/ProfilePage"
      className="flex h-full w-full flex-col overflow-auto md:gap-4 md:pb-3 xl:flex-row-reverse xl:overflow-hidden"
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
        <MainContainer className="flex h-fit flex-col space-y-4 rounded-b-none md:rounded-[30px] xl:w-96">
          <UserProfileContent user={user} isLocalUser={isLocalUser} />
        </MainContainer>
        {isLocalUser && <CreatePost className="rounded-none md:rounded-b-[30px]" />}
      </div>
      <MainContainer className="flex grow flex-col gap-y-4 rounded-none md:gap-y-6 md:rounded-[30px] xl:w-full xl:overflow-auto">
        <Suspense fallback={<PostsSkeleton />}>
          <PostsContent
            schemaHasPart // Has part of the main entity
            uid={user.id}
            localUid={localUserUid ?? null}
            EmptyPostsContent={() => (
              <UserEmptyPostsContent
                userName={user.full_name ?? "User"}
                userAvatarUrl={user.avatar_url}
              />
            )}
          />
        </Suspense>
      </MainContainer>
    </main>
  )
}

interface UserEmptyPostsContentProps {
  userName: string
  userAvatarUrl?: string | null
}

const UserEmptyPostsContent: React.FC<UserEmptyPostsContentProps> = ({
  userName,
  userAvatarUrl,
}) => {
  const t = useTranslations("Post.emptyPosts")

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <UserAvatar src={userAvatarUrl} name={userName} />
        </EmptyMedia>
        <EmptyTitle>{t("header")}</EmptyTitle>
        <EmptyDescription>
          {t.rich("description.user", {
            username: userName,
            b: (chunks) => <b>{chunks}</b>,
          })}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
