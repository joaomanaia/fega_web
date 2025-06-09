"use client"

import { UserAvatar } from "@/app/components/user/user-avatar"
import { Input } from "@/components/ui/input"
import { useSearchUser } from "@/features/user/use-search-user"
import { cn } from "@/lib/utils"
import { Link } from "@/src/i18n/navigation"
import type UserType from "@/types/UserType"
import { SearchIcon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { useDebounceValue } from "usehooks-ts"

interface HeaderSearchProps {
  className?: string
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({ className }) => {
  const t = useTranslations("General")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const [debouncedValue, setDebounceValue] = useDebounceValue("", 500)

  const { data: users, isLoading } = useSearchUser(debouncedValue.trim())

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close the results if the user clicks outside the input or the results
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  })

  return (
    <div className={cn("relative group w-full lg:max-w-lg", className)}>
      <SearchIcon className="size-5 absolute top-1/2 left-2.5 transform -translate-y-1/2 text-foreground/60" />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search..."
        className={cn(
          "border-none peer rounded-full w-full px-10 focus-visible:ring-1 transition",
          inputRef.current?.value && "focus-visible:rounded-b focus-visible:rounded-t-2xl"
        )}
        onChange={(e) => setDebounceValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        aria-label="Search"
        aria-autocomplete="list"
        aria-controls="search-results"
        aria-expanded={isFocused && !!inputRef.current?.value}
      />

      <button
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.value = ""
            setDebounceValue("")
          }
        }}
        type="button"
        className={cn(
          "opacity-0 absolute right-2.5 top-1/2 transform -translate-y-1/2 text-foreground/60 group-hover:text-foreground/80 transition duration-200",
          inputRef.current?.value && "opacity-100"
        )}
      >
        <XIcon />
      </button>

      {inputRef.current?.value && (
        <div
          ref={resultsRef}
          id="search-results"
          role="listbox"
          className={cn(
            "absolute hidden p-3 w-full bg-surfaceVariant rounded-b-2xl ring-offset-surfaceVariant/[0.38] peer-focus:ring-1 peer-focus:ring-surfaceVariant peer-focus:ring-offset-2",
            inputRef.current.value && isFocused && "block z-40"
          )}
        >
          {isLoading && <p>{t("loading")}</p>}
          {users?.length ? (
            users.map((user) => (
              <SearchedUser
                key={user.id}
                user={user}
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = ""
                    setDebounceValue("")
                  }
                  setIsFocused(false)
                }}
              />
            ))
          ) : (
            <p>{t("searchContent.noResults")}</p>
          )}
        </div>
      )}
    </div>
  )
}

interface SearchedUserProps {
  user: UserType
  onClick?: () => void
}

export const SearchedUser: React.FC<SearchedUserProps> = ({ user, onClick }) => {
  return (
    <Link
      href={user.username}
      onClick={onClick}
      className="flex z-50 rounded-2xl hover:bg-surfaceVariant-foreground/10 items-center px-3 py-2 gap-3 transition"
    >
      <UserAvatar src={user.avatar_url} name={user.full_name} />
      <div className="flex flex-col">
        <span>{user.full_name}</span>
        <span className="text-foreground/60">@{user.username}</span>
      </div>
    </Link>
  )
}
