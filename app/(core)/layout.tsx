import "@/styles/globals.css"
import "@/styles/firebaseui-styling.global.css"
import MainLayout from "@/components/m3/MainLayout"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const metadata = {
  title: "Fega",
  description: "The best social network in ega!",
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <MainLayout authUser={user}>{children}</MainLayout>
}
