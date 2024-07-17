import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://fega.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          pt: "https://fega.vercel.app",
          en: "https://fega.vercel.app/en",
        },
      },
    },
  ]
}
