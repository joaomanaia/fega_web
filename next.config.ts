import createMDX from "@next/mdx"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import { env } from "@/env"
import { UMAMI_SRC_PATH } from "@/src/lib/constants"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  cacheComponents: true,
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
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
    incomingRequests: true,
  },
  serverExternalPackages: ["pino", "pino-pretty"],
  experimental: {
    mdxRs: true,
  },
  rewrites: async () => [
    {
      source: `${UMAMI_SRC_PATH}/:match*`,
      destination: env.NEXT_PUBLIC_UMAMI_SRC,
    },
  ],
}

const withMDX = createMDX({})
const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
})

export default withNextIntl(withMDX(nextConfig))
