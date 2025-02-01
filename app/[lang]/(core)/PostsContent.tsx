import { type Dictionary } from "@/get-dictionary"
import { FileWarningIcon } from "lucide-react"
import { type Locale } from "@/i18n-config"
import { getPosts } from "@/features/post/get-posts"
import { PagingPosts } from "@/app/[lang]/(core)/paging-posts"
import { createClient } from "@/lib/supabase/server"

interface PostsContentProps {
  uid?: string
  localUid: string | null
  lang: Locale
  dictionary: Dictionary
  schemaHasPart?: boolean
  EmptyPostsContent?: () => React.ReactNode
}

export default async function PostsContent({
  uid,
  localUid,
  lang,
  dictionary,
  schemaHasPart,
  EmptyPostsContent = () => <DefaultEmptyPostsContent dictionary={dictionary.post.emptyPosts} />,
}: PostsContentProps) {
  const client = await createClient()
  const posts = await getPosts(client, uid)

  if (!posts.length) {
    return <EmptyPostsContent />
  }

  return (
    <>
      <PagingPosts
        uid={uid}
        localUid={localUid}
        initialPosts={posts}
        lang={lang}
        dictionary={dictionary}
        schemaHasPart={schemaHasPart}
      />
    </>
  )
}

interface DefaultEmptyPostsContentProps {
  dictionary: Dictionary["post"]["emptyPosts"]
}

const DefaultEmptyPostsContent = ({ dictionary }: DefaultEmptyPostsContentProps) => (
  <div className="flex flex-col items-center justify-center h-full">
    <FileWarningIcon className="w-16 h-16 text-secondary/50 mb-4" />
    <h2 className="text-xl font-semibold">{dictionary.header}</h2>
    <p className="text-secondary/50 mt-2">{dictionary.description.default}</p>
  </div>
)
