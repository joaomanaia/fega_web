import createMDX from "@next/mdx"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "www.notebookcheck.info",
      "utfs.io",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.UPLOADTHING_APP_ID}.ufs.sh`,
        pathname: "/f/*",
      },
    ],
  },
  serverExternalPackages: ["pino", "pino-pretty"],
  experimental: {
    mdxRs: true,
  },
}

const withMDX = createMDX({})
const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
})

export default withNextIntl(withMDX(nextConfig))
