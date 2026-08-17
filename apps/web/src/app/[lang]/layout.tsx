import { Inter as FontSans } from "next/font/google"
import { cn } from "@workspace/ui/lib/utils"
import "@workspace/ui/styles/tokens.css"
import "@workspace/ui/styles/globals.css"
import { Suspense } from "react"
import Script from "next/script"
import { connection } from "next/server"
import { GoogleTagManager } from "@next/third-parties/google"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { type Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getTranslations } from "next-intl/server"
import { extractRouterConfig } from "uploadthing/server"
import { Toaster as SonnerToaster } from "@workspace/ui/components/sonner"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { appName } from "@/core/common"
import { env } from "@/env"
import { routing } from "@/i18n/routing"
import { UMAMI_SRC_PATH } from "@/lib/constants"
import { ModalProvider } from "@/providers/modal-provider"
import { QueryProvider } from "@/providers/query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { ourFileRouter } from "../api/uploadthing/core"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("RootMetadata")

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

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLocale()

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
                <TooltipProvider>
                  {children}
                  <SonnerToaster richColors />
                  <ModalProvider />
                </TooltipProvider>
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
