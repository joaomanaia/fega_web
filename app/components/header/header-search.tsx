"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useDebounceValue } from "usehooks-ts"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { useSearchUser } from "@/features/user/use-search-user"
import { cn } from "@/lib/utils"
import { Link } from "@/src/i18n/navigation"

interface HeaderSearchProps {
  className?: string
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({ className }) => {
  const t = useTranslations("General")
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const [debouncedValue] = useDebounceValue(searchValue, 300)
  const { data: users, isLoading } = useSearchUser(debouncedValue.trim())

  const clearSearch = useCallback(() => {
    setSearchValue("")
  }, [])

  const handleResultClick = useCallback(() => {
    setSearchValue("")
    setIsFocused(false)
    inputRef.current?.blur()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFocused(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const showResults = isFocused && searchValue.trim().length > 0
  const hasResults = users && users.length > 0
  const shouldSearch = searchValue.trim().length >= 2

  return (
    <div className={cn("group relative w-full lg:max-w-lg", className)}>
      <InputGroup
        className={cn(
          "rounded-full border-none transition-all duration-75",
          showResults && "rounded-t-2xl rounded-b-none",
          searchValue && "has-[[data-slot=input-group-control]:focus-visible]:ring-0"
        )}
      >
        <InputGroupInput
          placeholder={t("searchContent.placeholder")}
          ref={inputRef}
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={showResults}
          className={cn()}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        {searchValue && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={clearSearch}>
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      {showResults && (
        <div
          ref={resultsRef}
          id="search-results"
          role="listbox"
          className="bg-surface dark:border-input/30 ring-offset-surface-variant/38 peer-focus:ring-surface-variant animate-in fade-in-0 slide-in-from-top-2 peer-focus:ring-offset-surface absolute z-50 block max-h-96 w-full overflow-y-auto rounded-b-2xl border-2 shadow-xl duration-200 peer-focus:ring-2 peer-focus:ring-offset-2 focus-within:ring-2"
        >
          {!shouldSearch ? (
            <p className="text-foreground/60 px-3 py-4 text-center text-sm">
              {t("searchContent.typeToSearch")}
            </p>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-2 py-4">
              <Spinner />
              <p className="text-sm">{t("loading")}</p>
            </div>
          ) : hasResults ? (
            <div className="p-2">
              {users.map((user) => (
                <SearchedUser
                  key={user.id}
                  username={user.username}
                  fullName={user.full_name}
                  avatarUrl={user.avatar_url}
                  onClick={handleResultClick}
                />
              ))}
            </div>
          ) : (
            <p className="text-foreground/60 px-3 py-4 text-center text-sm">
              {t("searchContent.noResults")}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

interface SearchedUserProps {
  username: string
  fullName: string
  avatarUrl?: string
  onClick?: () => void
}

export const SearchedUser: React.FC<SearchedUserProps> = ({
  username,
  fullName,
  avatarUrl,
  onClick,
}) => {
  return (
    <Link
      href={username}
      onClick={onClick}
      role="option"
      className="hover:bg-surface-variant/28 focus:ring-primary flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all focus:ring-2 focus:outline-none active:scale-[0.98]"
    >
      <UserAvatar src={avatarUrl} name={fullName} className="shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">{fullName}</span>
        <span className="text-foreground/60 truncate text-sm">@{username}</span>
      </div>
    </Link>
  )
}
