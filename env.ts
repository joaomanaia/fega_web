import { vercel } from "@t3-oss/env-core/presets-zod"
import { createEnv } from "@t3-oss/env-nextjs"
import * as z from "zod";

export const env = createEnv({
  extends: [vercel()],
  server: {
    ANALYTICS_DISABLED: z.transform((s) => s !== "false" && s !== "0").optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
    NEXT_PUBLIC_GTM_ID: z.string(),
  },
  shared: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
    LOG_LEVEL: z
      .enum(["silent", "fatal", "error", "warn", "info", "debug", "trace"])
      .default("info"),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    LOG_LEVEL: process.env.LOG_LEVEL,
  },
})
