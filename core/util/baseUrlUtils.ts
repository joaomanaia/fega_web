/**
 * Returns the base path of the application.
 *
 * @returns {string} The base path of the application.
 */
export const getBasePath = () => {
  const localhost = "http://localhost:3000"
  const production = `https://${process.env.VERCEL_URL}`

  return process.env.NODE_ENV === "production" ? production : localhost
}

/**
 * Formats a path to include the base path of the application.
 *
 * @param {string} path The path to format.
 * @returns {string} The formatted path.
 * @example formatUrlWithBasePath("api/users") // returns "http://localhost:3000/api/users"
 */
export const formatUrlWithBasePath = (path: string) => {
  const basePath = getBasePath()
  const pathWithoutLeadingSlash = path.replace(/^\//, "")

  return `${basePath}/${pathWithoutLeadingSlash}`
}

export const fetchServer = async (path: string, options?: RequestInit) => {
  const url = formatUrlWithBasePath(path)

  return fetch(url, options)
}
