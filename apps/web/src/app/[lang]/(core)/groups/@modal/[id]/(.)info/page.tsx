import { GroupInfo } from "@/app/[lang]/(core)/groups/components/group-info"

export default async function ModalGroupInfoPage(props: PageProps<"/[lang]/groups/[id]/info">) {
  const params = await props.params

  return <GroupInfo isDialog groupId={params.id} />
}
