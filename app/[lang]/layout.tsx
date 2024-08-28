import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "../styles/tokens.css"
import "../styles/globals.css"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { ModalProvider } from "@/src/providers/modal-provider"
import { GoogleAnalytics } from "@next/third-parties/google"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "../api/uploadthing/core"
import { type Locale, i18n } from "@/i18n-config"
import { type Metadata } from "next"
import DictionaryProvider from "@/hooks/use-get-dictionary"
import { getDictionary } from "@/get-dictionary"
import { QueryProvider } from "@/src/providers/query-provider"
import { ThemeProvider } from "@/src/providers/theme-provider"

export const metadata: Metadata = {
  title: {
    template: "%s - Fega",
    default: "Fega",
  },
  description: "The best social network in ega!",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  applicationName: "Fega",
  openGraph: {
    type: "website",
    siteName: "Fega",
    title: "Fega",
    description: "The best social network in ega!",
  }
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

interface RootLayoutProps {
  children: React.ReactNode
  params: {
    lang: Locale
  }
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const dictionary = await getDictionary(params.lang)

  return (
    <html lang={params.lang} suppressHydrationWarning>
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
            <DictionaryProvider dictionary={dictionary}>
              {children}
              <Toaster />
              <SonnerToaster />
              <ModalProvider />
            </DictionaryProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-0WZ017FHHK" />
    </html>
  )
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}
