import type { AppProps } from "next/app"
import { useAuthState } from "react-firebase-hooks/auth"
import { app, auth } from "../firebase"
import { Suspense, useEffect } from "react"
import { useRouter } from "next/dist/client/router"
import { getAnalytics, logEvent } from "firebase/analytics"
import { getPerformance } from "firebase/performance"
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check"
import "../styles/globals.css"
import "../styles/firebaseui-styling.global.css"
import ThemeModeProvider from "../core/theme/context/ThemeModeContext"
import ThemeSchemeProvider from "../core/theme/context/ThemeSchemeContext"
import M3ThemeProvider from "../core/theme/m3/M3ThemeProvider"
import { CssBaseline } from "@mui/material"

function MyApp({ Component, pageProps }: AppProps) {
  const [authUser] = useAuthState(auth)

  const routers = useRouter()

  useEffect(() => {
    getPerformance(app)
  }, [])

  useEffect(() => {
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider("6Ld3sg8cAAAAAG87yUa03kZIYSarmr7EFvnjivK7"),
      isTokenAutoRefreshEnabled: true,
    })
  }, [])

  useEffect(() => {
    const analytics = getAnalytics(app)

    const logEventPage = (url: string) => {
      logEvent(analytics, "screen_view", {
        firebase_screen: url,
        firebase_screen_class: url,
      })
    }

    routers.events.on("routeChangeComplete", logEventPage)
    // For First page
    logEventPage(window.location.pathname)

    return () => {
      routers.events.off("routeChangeComplete", logEventPage)
    }
  }, [routers.events])

  useEffect(() => {
    const loadDBUser = async () => {
      if (authUser !== null && authUser !== undefined) {
        const user = await fetch(
          `/api/user/verifyUserDB?uid=${authUser.uid}&displayName=${authUser.displayName}&photoURL=${authUser.photoURL}`
        )
        console.log(user.status)
      }
    }

    loadDBUser()
  }, [authUser])

  return (
    <>
      <link rel="manifest" href="manifest.json" />

      <ThemeModeProvider>
        <ThemeSchemeProvider>
          <M3ThemeProvider>
            <CssBaseline enableColorScheme />
            <Component {...pageProps} />
          </M3ThemeProvider>
        </ThemeSchemeProvider>
      </ThemeModeProvider>
    </>
  )
}

export default MyApp
