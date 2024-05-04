import { type Metadata } from "next"
import { MainContainer } from "@/app/components/m3/main-container"
import { NewGroupForm } from "./components/new-group-form"
import { type Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"

export const metadata: Metadata = {
  title: "Create group",
  description: "Create a new group",
}

interface CreateGroupPageProps {
  params: {
    lang: Locale
  }
}

export default async function CreateGroupPage({ params }: CreateGroupPageProps) {
  const dictionary = await getDictionary(params.lang)

  return (
    <MainContainer className="w-full h-auto max-md:rounded-b-none md:mb-3 flex flex-col items-center xl:w-4/6">
      <h2 className="text-3xl mb-0">{dictionary.createGroup.header}</h2>

      <NewGroupForm dictionary={dictionary} />
    </MainContainer>
  )
}
