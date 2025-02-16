import { type Locale } from "@/i18n-config"
import { GroupInfo } from "@/app/[lang]/(core)/groups/components/group-info"

interface ModalGroupInfoPageProps {
  params: Promise<{
    lang: Locale
    id: string
  }>
}

export default async function ModalGroupInfoPage(props: ModalGroupInfoPageProps) {
  const params = await props.params
  return <GroupInfo isDialog groupId={params.id} lang={params.lang} />
}
