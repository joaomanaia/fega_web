import type { NextPage } from "next"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import { auth, uiConfig } from "../firebase"
import Head from "next/head"
import { useEffect } from "react"
import { useRouter } from "next/router"
import pt from "../locales/pt"
import en from "../locales/en"
import { Box, Paper, responsiveFontSizes, Typography, useTheme } from "@mui/material"

const Auth: NextPage = () => {
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : pt

  const { palette } = useTheme()

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      if (user !== null) {
        router.push("/")
      }
    })
    return () => unregisterAuthObserver() // Make sure we un-register Firebase observers when the component unmounts.
  }, [router])

  return (
    <Box height="100vh" position="fixed">
      <Head>
        <title>Login</title>
        <meta name="description" content="Fega web" />
        <link rel="icon" href="/fega_round_1.ico" />
      </Head>

      <Box
        bgcolor={palette.primary.main}
        color={palette.onPrimary.main}
        className="h-screen w-screen flex flex-col md:flex-row items-center justify-center"
      >
        <Box className="h-full w-1/2 flex flex-col items-center justify-center">
          <Typography variant="h2" fontWeight="400" gutterBottom>
            {t.welcome_to_fega}
          </Typography>

          <Typography variant="h6">{t.best_social_network_in_ega}</Typography>
        </Box>

        <Box
          bgcolor={palette.surface.main}
          color={palette.onSurface.main}
          className="h-full w-full md:w-1/2 rounded-t-3xl md:rounded-none md:rounded-l-3xl flex flex-col items-center justify-center"
        >
          <Typography variant="h2" fontWeight="400" gutterBottom>
            {t.sign_in}
          </Typography>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </Box>
      </Box>
    </Box>
  )
}

export default Auth

// h-screen w-screen flex flex-col md:flex-row items-center justify-center bg-red-700 dark:bg-gray-900
