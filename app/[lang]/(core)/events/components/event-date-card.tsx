import { argbFromHex, customColor, hexFromArgb } from "@material/material-color-utilities"

interface EventDateCardProps {
  colorArgb: number
  children: React.ReactNode
}

const DEFAULT_THEME_COLOR = "#0066ff"

export const EventDateCard: React.FC<EventDateCardProps> = ({ colorArgb, children }) => {
  const color = customColor(argbFromHex(DEFAULT_THEME_COLOR), {
    name: "custom-color",
    value: colorArgb,
    blend: true,
  })

  return (
    <div
      style={
        {
          "--lightColor": hexFromArgb(color.light.colorContainer),
          "--darkColor": hexFromArgb(color.dark.colorContainer),
          "--lightContentColor": hexFromArgb(color.light.onColorContainer),
          "--darkContentColor": hexFromArgb(color.dark.onColorContainer),
        } as React.CSSProperties
      }
      className="flex flex-col space-y-2 items-center p-4 rounded-xl w-40 bg-(--lightColor) dark:bg-(--darkColor) text-(--lightContentColor) dark:text-(--darkContentColor)"
    >
      {children}
    </div>
  )
}
