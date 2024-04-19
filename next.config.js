const withMDX = require("@next/mdx")()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "www.notebookcheck.info",
      "utfs.io"
    ],
  },
  experimental: {
    mdxRs: true
  }
}

module.exports = withMDX(nextConfig)
