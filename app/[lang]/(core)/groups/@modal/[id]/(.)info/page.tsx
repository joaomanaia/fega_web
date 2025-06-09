import { GroupInfo } from "@/app/[lang]/(core)/groups/components/group-info"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

interface ModalGroupInfoPageProps {
  params: Promise<{
    lang: Locale
    id: string
  }>
}

export default async function ModalGroupInfoPage(props: ModalGroupInfoPageProps) {
  const params = await props.params
  // Enable static rendering
  setRequestLocale(params.lang)

  return <GroupInfo isDialog groupId={params.id} lang={params.lang} />
}
