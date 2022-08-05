import type { AppProps } from "next/app"
import { useAuthState } from "react-firebase-hooks/auth"
import { app, auth, firestore } from "../firebase"
import { useEffect } from "react"
import { useRouter } from "next/dist/client/router"
import { getAnalytics, logEvent, setCurrentScreen } from "firebase/analytics"
import { getPerformance } from "firebase/performance"
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check"
import { doc, getDoc, setDoc } from "firebase/firestore"
import "../styles/globals.css"
import "../styles/firebaseui-styling.global.css"
import ThemeModeProvider from "../app/theme/context/ThemeModeContext"
import ThemeSchemeProvider from "../app/theme/context/ThemeSchemeContext"
import M3ThemeProvider from "../app/theme/m3/M3ThemeProvider"
import { CssBaseline } from "@mui/material"

function MyApp({ Component, pageProps }: AppProps) {
  // Destructure user, loading, and error out of the hook.
  const [authUser] = useAuthState(auth)

  const routers = useRouter()

  useEffect(() => {
    const analytics = getAnalytics(app)
    getPerformance(app)
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider("6Ld3sg8cAAAAAG87yUa03kZIYSarmr7EFvnjivK7"),
      isTokenAutoRefreshEnabled: true,
    })

    const logEventPage = (url: string) => {
      logEvent(analytics, "screen_view")
      setCurrentScreen(analytics, url)
    }

    routers.events.on("routeChangeComplete", logEventPage)
    // For First page
    logEventPage(window.location.pathname)

    return () => {
      routers.events.off("routeChangeComplete", logEventPage)
    }
  }, [routers.events])

  const loadDBUser = async () => {
    if (authUser !== null && authUser !== undefined) {
      const userRef = doc(firestore, "users", authUser.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          banned: false,
          name: authUser?.displayName || "Fega User",
          photoUrl: authUser?.photoURL,
          uid: authUser?.uid,
        })
      }
    }
  }

  loadDBUser()

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />

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
