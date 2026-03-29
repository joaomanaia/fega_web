import { GroupInfo } from "@/app/[lang]/(core)/groups/components/group-info"
import { MainContainer } from "@/app/components/m3/main-container"

export default async function GroupInfoPage(props: PageProps<"/[lang]/groups/[id]/info">) {
  const params = await props.params

  return (
    <MainContainer className="flex h-auto w-full flex-col items-center gap-4 overflow-hidden max-md:rounded-b-none md:mb-3">
      <GroupInfo groupId={params.id} />
    </MainContainer>
  )
}
