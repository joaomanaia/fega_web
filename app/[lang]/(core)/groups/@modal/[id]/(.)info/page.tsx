import { type Locale } from "@/i18n-config"
import { GroupInfo } from "@/app/[lang]/(core)/groups/components/group-info"

interface ModalGroupInfoPageProps {
  params: {
    lang: Locale
    id: string
  }
}

export default async function ModalGroupInfoPage({ params }: ModalGroupInfoPageProps) {
  return <GroupInfo isDialog groupId={params.id} lang={params.lang} />
}
