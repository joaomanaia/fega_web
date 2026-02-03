import { UserAvatar } from "@/app/components/user/user-avatar"
import { Hint } from "@/components/hint"
import Link from "@/components/link"
import { getSession } from "@/lib/dal"

export const HeaderUserAvatar: React.FC = async () => {
  const session = await getSession()
  const user = session?.user

  const userData = {
    name: user?.user_metadata?.full_name ?? user?.email ?? null,
    avatar: user?.user_metadata?.avatar_url ?? null,
  }

  return (
    <Hint label={userData.name ?? "Make login"}>
      <Link href={user ? `/${user.user_metadata?.username}` : "/auth/login"}>
        <UserAvatar src={userData.avatar} name={userData.name} />
      </Link>
    </Hint>
  )
}
