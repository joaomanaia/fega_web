import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "../styles/tokens.css"
import "../styles/globals.css"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import Script from "next/script"
import { connection } from "next/server"
import { GoogleTagManager } from "@next/third-parties/google"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { type Metadata } from "next"
import { hasLocale, NextIntlClientProvider, type Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { extractRouterConfig } from "uploadthing/server"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { appName } from "@/core/common"
import { env } from "@/env"
import { routing } from "@/src/i18n/routing"
import { UMAMI_SRC_PATH } from "@/src/lib/constants"
import { ModalProvider } from "@/src/providers/modal-provider"
import { QueryProvider } from "@/src/providers/query-provider"
import { ThemeProvider } from "@/src/providers/theme-provider"
import { ourFileRouter } from "../api/uploadthing/core"

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
    manifest: "/manifest.webmanifest",
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

async function UTSSR() {
  await connection()

  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
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
        {/* Manifest should be included in head to be detected, but next.js includes in body */}
        <link rel="manifest" href="/manifest.webmanifest" />
        {!env.ANALYTICS_DISABLED && (
          <>
            <Script id="umami-before-send" strategy="beforeInteractive">
              {`
            function beforeSendHandler(type, payload) {
          if (payload.url) {
            payload.url = payload.url.replace(/\\/[^\\/]+\\//, '/');
          }
          return payload;
            }
          `}
            </Script>
            <Script
              defer
              strategy="afterInteractive"
              src={`${UMAMI_SRC_PATH}/script.js`}
              data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
              data-before-send="beforeSendHandler"
            />
          </>
        )}
      </head>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          fontSans.variable
        )}
      >
        <Suspense>
          <UTSSR />
        </Suspense>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {/* TODO: (Suspense) Temprary fix for the cacheComponents */}
            <Suspense>
              <NextIntlClientProvider>
                {children}
                <SonnerToaster richColors />
                <ModalProvider />
              </NextIntlClientProvider>
            </Suspense>
          </QueryProvider>
        </ThemeProvider>
      </body>
      {!env.ANALYTICS_DISABLED && <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />}
    </html>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }))
}
