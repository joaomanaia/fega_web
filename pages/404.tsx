import { alpha, Box, Button, Typography, useTheme } from "@mui/material"
import { NextPage } from "next"
import { useRouter } from "next/router"
import en from "../locales/en"
import pt from "../locales/pt"

type NotFoundPageType = {}

const NotFoundPage: NextPage<NotFoundPageType> = () => {
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : pt

  const { palette } = useTheme()

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="flex items-center space-x-10">
        <Typography variant="h1" fontWeight="bold" color={palette.primary.main}>
          404
        </Typography>
        <Box
          className="w-1 h-24 rounded-2xl"
          sx={{
            backgroundColor: palette.surfaceVariant.main,
          }}
        />
        <Typography variant="h2" fontWeight="bold">
          {t.page_not_found}
        </Typography>
      </div>

      <Typography variant="body1" fontWeight="bold" color={alpha(palette.primary.main, 0.7)}>
        {t.this_page_does_not_exist}
      </Typography>

      <div className="flex space-x-2 mt-16">
        <Button onClick={() => router.push("/")} variant="contained">
          {t.go_back_home}
        </Button>

        <Button onClick={() => {}}  variant="outlined">
          {t.contact_support}
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
