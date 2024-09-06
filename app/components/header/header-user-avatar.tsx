import { UserAvatar } from "@/app/components/user/user-avatar"
import { Hint } from "@/components/hint"
import { Link } from "@/components/link"
import type { Locale } from "@/i18n-config"
import { createServerComponentClient } from "@/supabase"

interface HeaderUserAvatar {
  lang: Locale
}

export const HeaderUserAvatar: React.FC<HeaderUserAvatar> = async ({ lang }) => {
  const supabase = createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const authUser = session?.user

  const userData = {
    name: authUser?.user_metadata.full_name ?? authUser?.email ?? null,
    avatar: authUser?.user_metadata.avatar_url ?? null,
    actionLink: authUser ? `/${authUser.user_metadata.username}` : "/auth",
  }

  return (
    <Hint label={userData.name ?? "Make login"}>
      <Link lang={lang} href={userData.actionLink}>
        <UserAvatar src={userData.avatar} name={userData.name} />
      </Link>
    </Hint>
  )
}
