import { MuiProvider } from "@/core/theme/mui-provider"
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "./globals.css"

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
        id="__next"
        className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}
      >
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  )
}
