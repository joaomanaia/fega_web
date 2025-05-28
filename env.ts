import { createEnv } from "@t3-oss/env-nextjs"
import { vercel } from "@t3-oss/env-core/presets-zod"
import { z } from "zod/v4-mini"

export const env = createEnv({
  extends: [vercel()],
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
    NEXT_PUBLIC_GTM_ID: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  },
})
