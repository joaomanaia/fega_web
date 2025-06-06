import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

interface AuthLayoutProps {
  children: React.ReactNode
  params: Promise<{
    lang: Locale
  }>
}

export default async function AuthLayout({ children, params }: Readonly<AuthLayoutProps>) {
  const { lang } = await params
  // Enable static rendering
  setRequestLocale(lang)
  const t = await getTranslations("AuthPage")

  return (
    <div className="h-screen w-screen bg-primary text-primary-foreground flex flex-col lg:flex-row items-center justify-center">
      <div className="grow lg:h-full w-full lg:w-1/2 flex flex-col items-center justify-center gap-4">
        <h2 className="text-3xl lg:text-4xl xl:text-6xl">{t("header")}</h2>

        <p className="text-lg lg:text-xl mt-0">{t("subheader")}</p>
      </div>

      <main className="h-5/6 lg:h-full w-full lg:w-1/2 bg-background text-foreground rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl flex md:items-center md:justify-center overflow-y-auto">
        <div className="size-full px-6 md:max-w-xl flex flex-col gap-6 my-8 md:my-0 md:items-center md:justify-center">
          {children}
        </div>
      </main>
    </div>
  )
}
