import { getDictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"

interface AuthLayoutProps {
  children: React.ReactNode
  params: {
    lang: Locale
  }
}

export default async function AuthLayout({
  children,
  params: { lang },
}: Readonly<AuthLayoutProps>) {
  const authDictionary = (await getDictionary(lang)).page.auth

  return (
    <div className="h-screen w-screen bg-primary text-primary-foreground flex flex-col lg:flex-row items-center justify-center">
      <div className="grow lg:h-full w-full lg:w-1/2 flex flex-col items-center justify-center gap-4">
        <h2 className="text-3xl lg:text-4xl xl:text-6xl">{authDictionary.header}</h2>

        <p className="text-lg lg:text-xl mt-0">{authDictionary.subheader}</p>
      </div>

      <main className="h-5/6 lg:h-full w-full lg:w-1/2 bg-background text-foreground rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl flex items-center justify-center">
        <div className="size-full px-6 md:max-w-xl flex flex-col items-center justify-center gap-6">
          {children}
        </div>
      </main>
    </div>
  )
}
