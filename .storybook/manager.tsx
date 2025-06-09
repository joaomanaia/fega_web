import { useEffect } from "react"
import { useGlobals, addons, types } from "storybook/manager-api"
import fegaTheme from "./themes"

addons.setConfig({
  theme: fegaTheme,
})

type Theme = "light" | "dark"

addons.register("fega-addon", () => {
  addons.add("fega-addon/theme-switcher", {
    title: "Theme switcher",
    type: types.TOOL,
    render: () => {
      const setHtmlClass = (theme: Theme) => {
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(theme)
      }

      const [globals] = useGlobals()

      useEffect(() => {
        const theme: Theme = globals.theme || "light"
        setHtmlClass(theme)
      }, [globals.theme])

      /* return (
        <IconButton
          onClick={handleChange}
          active={active}
          title="Theme switcher"
        >
          <OutlineIcon />
        </IconButton>
      ) */

      return null
    },
  })
})
