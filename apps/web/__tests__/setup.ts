import { afterEach, mock } from "bun:test"

mock.module("server-only", () => ({}))
mock.module("next/root-params", () => ({
  locale: mock(async () => "en"),
}))

afterEach(() => {
  mock.clearAllMocks()
})
