import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

export default async function AuthLayout({ children, params }: LayoutProps<"/[lang]/auth">) {
  const { lang } = await params
  // Enable static rendering
  setRequestLocale(lang as Locale)
  const t = await getTranslations("AuthPage")

  return (
    <div className="bg-primary text-primary-foreground flex h-screen w-screen flex-col items-center justify-center lg:flex-row">
      <div className="flex w-full grow flex-col items-center justify-center gap-4 lg:h-full lg:w-1/2">
        <h2 className="text-3xl lg:text-4xl xl:text-6xl">{t("header")}</h2>

        <p className="mt-0 text-lg lg:text-xl">{t("subheader")}</p>
      </div>

      <main className="bg-background text-foreground flex h-5/6 w-full overflow-y-auto rounded-t-3xl md:items-center md:justify-center lg:h-full lg:w-1/2 lg:rounded-l-3xl lg:rounded-tr-none">
        <div className="my-8 flex size-full flex-col gap-6 px-6 md:my-0 md:max-w-xl md:items-center md:justify-center">
          {children}
        </div>
      </main>
    </div>
  )
}
