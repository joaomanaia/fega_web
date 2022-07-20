import { Box, Card, Typography, useTheme } from "@mui/material"

type PrivateMessageItemType = {
  text: string
  byLocalUser: boolean
}

const PrivateMessageItem: React.FC<PrivateMessageItemType> = ({ text, byLocalUser }) => {
  const { palette } = useTheme()

  return (
    <Box className={`flex w-full ${byLocalUser ? "justify-end" : "justify-start"}`}>
      <Card
        variant={byLocalUser ? "filled" : "outlined"}
        className="p-3 rounded-2xl"
        sx={{
          bgcolor: byLocalUser ? palette.primary.main : palette.surfaceVariant.main,
          color: byLocalUser ? palette.onPrimary.main : palette.onSurfaceVariant.main,
        }}
      >
        <Typography variant="body1">{text}</Typography>
      </Card>
    </Box>
  )
}

export default PrivateMessageItem
