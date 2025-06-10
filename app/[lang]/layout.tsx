import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "../styles/tokens.css"
import "../styles/globals.css"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { ModalProvider } from "@/src/providers/modal-provider"
import { GoogleTagManager } from "@next/third-parties/google"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "../api/uploadthing/core"
import { type Metadata } from "next"
import { QueryProvider } from "@/src/providers/query-provider"
import { ThemeProvider } from "@/src/providers/theme-provider"
import { env } from "@/env"
import { hasLocale, type Locale, NextIntlClientProvider } from "next-intl"
import { routing } from "@/src/i18n/routing"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { appName } from "@/core/common"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: "RootMetadata" })

  return {
    title: {
      template: `%s - ${appName}`,
      default: appName,
    },
    description: t("description"),
    icons: {
      icon: "/favicon.ico",
    },
    manifest: "/manifest.json",
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    applicationName: appName,
    openGraph: {
      type: "website",
      siteName: appName,
      title: appName,
      description: t("description"),
    },
  }
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  // Ensure that the incoming `lang` is valid
  const { lang } = await params
  if (!hasLocale(routing.locales, lang)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(lang)

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="vduNWIMxVDPQZoidzqpL-4nO41GAbOB_LOGrfAJAFms"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <NextIntlClientProvider>
              {children}
              <SonnerToaster richColors />
              <ModalProvider />
            </NextIntlClientProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
      {!env.ANALYTICS_DISABLED && <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />}
    </html>
  )
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }))
}
