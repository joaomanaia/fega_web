export async function wait(ms: number) {
  console.warn(
    "Warning: wait() function introduces artificial delays and should be used with caution"
  )
  return new Promise((resolve) => setTimeout(resolve, ms))
}
