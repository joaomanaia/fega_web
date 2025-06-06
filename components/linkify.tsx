import { UserHoverCardWithLink } from "@/app/components/user/user-hover-card"
import { USERNAME_WITH_AT_REGEX } from "@/lib/schemas/user-schemas"
import { Link } from "@/src/i18n/navigation"
import { LinkIt, LinkItUrl } from "react-linkify-it"

interface LinkifyProps {
  children: React.ReactNode
}

export default function Linkify({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyUrl>{children}</LinkifyUrl>
    </LinkifyUsername>
  )
}

function LinkifyUrl({ children }: { children: React.ReactNode }) {
  return <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
}

interface LinkifyUsernameProps {
  children: React.ReactNode
}

function LinkifyUsername({ children }: LinkifyUsernameProps) {
  return (
    <LinkIt
      regex={USERNAME_WITH_AT_REGEX}
      component={(match, key) => (
        <UserHoverCardWithLink
          key={key}
          username={match.slice(1)}
          className="text-primary hover:underline"
        >
          <span>{match}</span>
        </UserHoverCardWithLink>
      )}
    >
      {children}
    </LinkIt>
  )
}

function LinkifyHashtag({ children }: { children: React.ReactNode }) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  )
}
