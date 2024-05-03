import { Metadata } from "next"
import { MainContainer } from "@/app/components/m3/main-container"
import { NewGroupForm } from "./components/new-group-form"

export const metadata: Metadata = {
  title: "Create group",
  description: "Create a new group",
}

export default async function CreateGroupPage() {
  return (
    <MainContainer className="w-full h-auto max-md:rounded-b-none md:mb-3 flex flex-col items-center xl:w-4/6">
      <h2 className="text-3xl mb-0">Create a Group</h2>

      <NewGroupForm />
    </MainContainer>
  )
}
