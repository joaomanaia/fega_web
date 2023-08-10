import "@/styles/globals.css"
import M3 from "@/core/theme/M3"

export const metadata = {
  title: "Fega",
  description: "The best social network in ega!",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body id="__next">
        <M3>{children}</M3>
      </body>
    </html>
  )
}
