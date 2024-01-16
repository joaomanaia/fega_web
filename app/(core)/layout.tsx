import MainLayout from "@/app/(core)/components/m3/MainLayout"
import { createServerComponentClient } from "@/supabase"

export const metadata = {
  title: "Fega",
  description: "The best social network in ega!",
  icons: [
    {
      rel: "icon",
      url: "/fega_round_1.ico",
    },
  ]
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <MainLayout authUser={user}>{children}</MainLayout>
}
