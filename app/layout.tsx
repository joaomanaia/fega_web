import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "./styles/tokens.css"
import "./styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { ModalProvider } from "@/components/providers/modal-provider"
import { GoogleAnalytics } from "@next/third-parties/google"

export const metadata = {
  title: "Fega",
  description: "The best social network in ega!",
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans antialiased",
          fontSans.variable
        )}
      >
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
