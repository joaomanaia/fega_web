import { MainContainer } from "@/app/components/m3/main-container"
import { Skeleton } from "@/components/ui/skeleton"

export default function CamerasLoading() {
  return (
    <MainContainer className="flex flex-col">
      <Skeleton className="h-10 w-32 mb-2" />
      <Skeleton className="h-8 w-96 mb-4" />
      <Skeleton className="h-full w-full aspect-video rounded-3xl" />
    </MainContainer>
  )
}
