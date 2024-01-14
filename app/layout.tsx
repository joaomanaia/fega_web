import "@/styles/globals.css"
import { MuiProvider } from "@/core/theme/mui-provider"

export const metadata = {
  title: "Fega",
  description: "The best social network in ega!",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body id="__next">
        <MuiProvider>
          {children}
        </MuiProvider>
      </body>
    </html>
  )
}
