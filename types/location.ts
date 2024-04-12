export type Location = {
  name: string
  address: string
  point: Point
}

export type Point = {
  lat: number
  lng: number
}

export type DirectionApp = "google" | "waze" | "apple"

export const getDirectionUrl = (point: Point, app: DirectionApp) => {
  switch (app) {
    case "google":
      return `https://www.google.com/maps/dir//${point.lat},${point.lng}`
    case "waze":
      return `https://www.waze.com/ul?ll=${point.lat},${point.lng}&navigate=yes`
    case "apple":
      return `https://maps.apple.com/?daddr=${point.lat},${point.lng}`
  }
}
