import { cn } from "@/lib/utils"
import { type Dictionary } from "@/get-dictionary"
import { Skeleton } from "@/components/ui/skeleton"
import { CreatePostForm } from "@/app/components/create-post/create-post-form"
import { MainContainer } from "@/app/components/m3/main-container"

type CreatePostTypes = {
  className?: string
  dictionary: Dictionary
}

const CreatePost: React.FC<CreatePostTypes> = ({ className, dictionary }) => {
  return (
    <MainContainer className={cn("h-fit w-full xl:max-w-sm rounded-b-none md:rounded-[30px]", className)}>
      <CreatePostForm dictionary={dictionary.post.create} />
    </MainContainer>
  )
}

export default CreatePost

export const CreatePostSkeleton = () => {
  return (
    <MainContainer className="h-fit w-full xl:max-w-sm rounded-b-none md:rounded-[30px]">
      <div className="flex flex-col gap-4 lg:min-w-52 xl:min-w-64">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </MainContainer>
  )
}
