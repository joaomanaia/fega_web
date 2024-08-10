import { GroupInfoSkeleton } from "@/app/[lang]/(core)/groups/components/group-info"
import { MainContainer } from "@/app/components/m3/main-container"

export default function LoadingGroupInfo() {
  return (
    <MainContainer className="w-full h-auto overflow-hidden max-md:rounded-b-none md:mb-3 flex flex-col items-center gap-4">
      <GroupInfoSkeleton />
    </MainContainer>
  )
}
