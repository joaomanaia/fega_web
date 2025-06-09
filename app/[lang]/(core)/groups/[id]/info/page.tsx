import { GroupInfo } from "@/app/[lang]/(core)/groups/components/group-info"
import { MainContainer } from "@/app/components/m3/main-container"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

interface GroupInfoPageProps {
  params: Promise<{
    lang: Locale
    id: string
  }>
}

export default async function GroupInfoPage(props: GroupInfoPageProps) {
  const params = await props.params
  // Enable static rendering
  setRequestLocale(params.lang)

  return (
    <MainContainer className="w-full h-auto overflow-hidden max-md:rounded-b-none md:mb-3 flex flex-col items-center gap-4">
      <GroupInfo groupId={params.id} lang={params.lang} />
    </MainContainer>
  )
}
