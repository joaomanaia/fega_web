import { Skeleton } from "@workspace/ui/components/skeleton"
import { MainContainer } from "@/app/components/m3/main-container"

export default function CamerasLoading() {
  return (
    <MainContainer className="flex flex-col">
      <Skeleton className="mb-2 h-10 w-32" />
      <Skeleton className="mb-4 h-8 w-96" />
      <Skeleton className="aspect-video h-full w-full rounded-3xl" />
    </MainContainer>
  )
}
