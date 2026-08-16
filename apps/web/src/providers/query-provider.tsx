"use client"

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import dynamic from "next/dynamic"
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { env } from "@/env"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

type ProvidersProps = {
  children: React.ReactNode
}

const ReactQueryDevtools = dynamic(() =>
  import("@tanstack/react-query-devtools").then((mod) => mod.ReactQueryDevtools)
)

export function QueryProvider({ children }: ProvidersProps) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
