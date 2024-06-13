import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "../styles/tokens.css"
import "../styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { ModalProvider } from "@/components/providers/modal-provider"
import { GoogleAnalytics } from "@next/third-parties/google"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "../api/uploadthing/core"
import { type Locale, i18n } from "@/i18n-config"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Fega",
  description: "The best social network in ega!",
  icons: {
    icon: "/favicon.ico",
  },
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

export default function RootLayout({ children, params }: RootLayoutProps) {
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
          {children}
          <Toaster />
          <SonnerToaster />
          <ModalProvider />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-0WZ017FHHK" />
    </html>
  )
}

export async function generateSaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}
