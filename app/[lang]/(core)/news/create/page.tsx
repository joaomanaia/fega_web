import { type Metadata } from "next"
import { MainContainer } from "@/app/components/m3/main-container"
import { verifyUserRole } from "@/lib/dal"
import { CreateNewsForm } from "./components/create-news-form"

export const metadata: Metadata = {
  title: "Create News",
}

export default async function NewNewsPage() {
  await verifyUserRole("admin")

  return (
    <MainContainer className="mb-3 h-full w-full overflow-y-auto">
      <h1 className="text-3xl">Create News</h1>

      <CreateNewsForm className="mt-4" />
    </MainContainer>
  )
}
