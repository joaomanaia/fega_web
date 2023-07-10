import "@/styles/globals.css"
import "@/styles/firebaseui-styling.global.css"
import MainLayout from "@/components/m3/MainLayout"

export const metadata = {
  title: "Fega",
  description: "The best social network in ega!",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>
}
