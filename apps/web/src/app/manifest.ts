import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fega",
    short_name: "Fega",
    start_url: "/",
    display: "fullscreen",
    theme_color: "#000000",
    background_color: "#ffffff",
    description: "Best social network in ega!",
    icons: [
      {
        src: "/icon144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/icon192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
