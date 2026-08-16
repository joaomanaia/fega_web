import { Skeleton } from "@workspace/ui/components/skeleton"
import { GroupMessageHeaderSkeleton } from "@/app/[lang]/(core)/groups/[id]/components/group-message-header"
import { MainContainer } from "@/app/components/m3/main-container"

export default function LoadingGroupIdPage() {
  return (
    <MainContainer className="flex h-auto w-full flex-col items-center max-md:rounded-b-none md:mb-3">
      <GroupMessageHeaderSkeleton className="mb-4 xl:hidden" />
      <MessagesSkeleton />
    </MainContainer>
  )
}

function MessagesSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Skeleton className="h-12 w-60" />
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-12 w-32 self-end" />
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-12 w-60 self-end" />
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-12 w-60" />
    </div>
  )
}
