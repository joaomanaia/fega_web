import { GroupMessageHeaderSkeleton } from "@/app/[lang]/(core)/groups/[id]/components/group-message-header"
import { MainContainer } from "@/app/components/m3/main-container"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingGroupIdPage() {
  return (
    <MainContainer className="w-full h-auto max-md:rounded-b-none md:mb-3 flex flex-col items-center">
      <GroupMessageHeaderSkeleton className="xl:hidden mb-4" />
      <MessagesSkeleton />
    </MainContainer>
  )
}

function MessagesSkeleton() {
  return (
    <div className="flex flex-col w-full gap-2">
      <Skeleton className="w-60 h-12" />
      <Skeleton className="w-1/3 h-12" />
      <Skeleton className="w-32 h-12 self-end" />
      <Skeleton className="w-1/2 h-12" />
      <Skeleton className="w-60 h-12 self-end" />
      <Skeleton className="w-1/3 h-12" />
      <Skeleton className="w-60 h-12" />
    </div>
  )
}
