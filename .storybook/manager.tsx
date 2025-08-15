import { useEffect } from "react"
import { addons, types, useGlobals } from "storybook/manager-api"
import { themes } from "storybook/theming"
import { dark } from "./themes"

addons.setConfig({
  theme: dark,
})

/* type Theme = "light" | "dark"

addons.register("fega-addon", () => {
  addons.add("fega-addon/theme-switcher", {
    title: "Theme switcher",
    type: types.TOOL,
    render: () => {
      const setHtmlClass = (theme: Theme) => {
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(theme)
      }

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [globals] = useGlobals()

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        const theme: Theme = globals.theme || "light"
        console.log("Setting theme:", theme)
        setHtmlClass(theme)

        addons.setConfig({
          theme: theme === "dark" ? themes.dark : themes.light,
        })
      }, [globals.theme])

      return null
    },
  })
}) */
