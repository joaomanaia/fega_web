import { MainContainer } from "@/app/components/m3/main-container"
import { Button } from "@/components/ui/button"
import { NewspaperIcon } from "lucide-react"
import Link from "next/link"

interface BaseNotFoundProps {
  title: string
  description: string
}

export const BaseNotFound: React.FC<BaseNotFoundProps> = ({ title, description }) => {
  return (
    <MainContainer className="h-full w-full min-w-full lg:mb-3 rounded-b-none lg:rounded-b-3xl">
      <div className="h-full w-full flex flex-col items-center justify-center mx-auto max-w-md text-center">
        <NewspaperIcon className="mx-auto size-16 text-foreground" />
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-surfaceVariant-foreground">{description}</p>
        <Button className="mt-6" asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </MainContainer>
  )
}
