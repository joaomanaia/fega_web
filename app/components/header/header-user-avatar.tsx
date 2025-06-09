import { UserAvatar } from "@/app/components/user/user-avatar"
import { Hint } from "@/components/hint"
import { createClient } from "@/lib/supabase/server"
import { Link } from "@/src/i18n/navigation"

export const HeaderUserAvatar: React.FC = async () => {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const authUser = session?.user

  const userData = {
    name: authUser?.user_metadata.full_name ?? authUser?.email ?? null,
    avatar: authUser?.user_metadata.avatar_url ?? null,
    actionLink: authUser ? `/${authUser.user_metadata.username}` : "/login",
  }

  return (
    <Hint label={userData.name ?? "Make login"}>
      <Link href={userData.actionLink}>
        <UserAvatar src={userData.avatar} name={userData.name} />
      </Link>
    </Hint>
  )
}
