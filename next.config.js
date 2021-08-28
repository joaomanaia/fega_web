/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    ADMIN_FIREBASE_CLIENT_EMAIL: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
    ADMIN_FIREBASE_PRIVATE_KEY: process.env.ADMIN_FIREBASE_PRIVATE_KEY,
    ADMIN_FIREBASE_PROJECT_ID: process.env.ADMIN_FIREBASE_PROJECT_ID,
  }
  /*
  i18n: {
    locales: ["en", "pt"],
    defaultLocale: "en"
  }
  */
}
