import { pino, type Logger } from "pino"
import { env } from "@/env"

export const logger: Logger = pino({
  transport: {
    target: "pino-pretty",
  },
  level: env.LOG_LEVEL,
  base: {
    pid: false,
  },
})
