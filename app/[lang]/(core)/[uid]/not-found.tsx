import { MainContainer } from "@/app/components/m3/main-container"
import { Button } from "@/components/ui/button"
import { User2Icon } from "lucide-react"
import Link from "next/link"

export default async function UserNotFound() {
  return (
    <MainContainer className="h-full w-full min-w-full lg:mb-3 rounded-b-none lg:rounded-b-3xl">
      <div className="h-full w-full flex flex-col items-center justify-center mx-auto max-w-md text-center">
        <User2Icon className="mx-auto size-16 text-foreground" />
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          User not found
        </h2>
        <p className="mt-4 text-surfaceVariant-foreground">
          We couldn't find the user you were looking for. Please check the URL or try again later.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </MainContainer>
  )
}
