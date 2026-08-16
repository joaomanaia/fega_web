import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { setupServerActionHooks } from "zsa-react-query"

const hooks = setupServerActionHooks({
  hooks: {
    useQuery,
    useMutation,
    useInfiniteQuery,
  },
}) as any

export const { useServerActionQuery, useServerActionMutation, useServerActionInfiniteQuery } = hooks
