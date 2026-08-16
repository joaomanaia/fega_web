export const appName = "Fega"

export const defaultImgUrl =
  "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/user_default_image.png?alt=media&token=7f18e231-8446-4499-9935-63209fa686cb"

export const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000"

export const isProduction = process.env.NODE_ENV === "production"

export const isAnalyticsEnabled = isProduction && process.env.NEXT_PUBLIC_GA_ID
