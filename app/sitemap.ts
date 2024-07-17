import { MetadataRoute, type Route } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    addPage("/", "weekly", 1),
    addPage("/news", "monthly", 0.8),
    addPage("/cameras", "yearly", 0.7),
    addPage("/events", "monthly", 0.8),
    addPage("/events/map", "never", 0.7),
    addPage("/events/q2", "never", 0.64),
    addPage("/events/mO", "never", 0.64),
    addPage("/events/oj", "never", 0.64),
    addPage("/cameras/figueiradafoz-panoramica", "never", 0.64),
    addPage("/cameras/figueiradafoz-buarcos", "never", 0.64),
    addPage("/cameras/figueiradafoz-cabedelo", "never", 0.64),
    addPage("/cameras/hoteloslo-coimbra", "never", 0.64),
  ]
}

type SitemapSingleItem = MetadataRoute.Sitemap[number]
type ChangeFrequency = SitemapSingleItem["changeFrequency"]

const siteUrl = "https://fega.vercel.app"

const addPage = (
  url: Route,
  changeFrequency?: ChangeFrequency,
  priority?: number,
  lastModified?: string | Date
): SitemapSingleItem => {
  return {
    url: `${siteUrl}${url}`,
    lastModified: lastModified,
    changeFrequency: changeFrequency,
    priority: priority,
    alternates: {
      languages: {
        pt: `${siteUrl}${url}`,
        en: `${siteUrl}/en${url}`,
      },
    },
  }
}
