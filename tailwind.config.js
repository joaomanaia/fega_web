const colorSchemeRGB = {
  primaryLight: "192, 0, 19",
  primaryDark: "255, 179, 170",
  onPrimaryLight: "255, 255, 255",
  onPrimaryDark: "33, 26, 25",
  secondaryLight: "119, 86, 83",
  secondaryDark: "231, 189, 184",
  onSecondaryLight: "255, 255, 255",
  onSecondaryDark: "68, 42, 39",
  backgroundLight: "252, 252, 252",
  backgroundDark: "33, 26, 25",
  onBackgroundLight: "33, 26, 25",
  onBackgroundDark: "237, 224, 222",
  surfaceLight: "252, 252, 252",
  surfaceDark: "33, 26, 25",
  onSurfaceLight: "33, 26, 25",
  onSurfaceDark: "237, 224, 222",
  surfaceVariantLight: "244, 221, 218",
  surfaceVariantDark: "83, 67, 65",
  onSurfaceVariantLight: "83, 67, 65",
  onSurfaceVariantDark: "216, 194, 191",
  secondaryContainerLight: "255, 218, 214",
  secondaryContainerDark: "93, 63, 60",
  onSecondaryContainerLight: "44, 21, 19",
  onSecondaryContainerDark: "255, 218, 214",
}

const colorWithOpacity = (color, opacity) => {
  return `rgb(${color}, ${opacity || 1})`
}

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          light: colorWithOpacity(colorSchemeRGB.primaryLight, 1),
          light5: colorWithOpacity(colorSchemeRGB.primaryLight, 0.05),
          light12: colorWithOpacity(colorSchemeRGB.primaryLight, 0.88),
          dark: colorWithOpacity(colorSchemeRGB.primaryDark, 1),
          dark5: colorWithOpacity(colorSchemeRGB.primaryDark, 0.05),
          dark12: colorWithOpacity(colorSchemeRGB.primaryDark, 0.88),
          DEFAULT: colorWithOpacity(colorSchemeRGB.primaryLight, 1),
        },
        onPrimary: {
          light: colorWithOpacity(colorSchemeRGB.onPrimaryLight, 1),
          dark: colorWithOpacity(colorSchemeRGB.onPrimaryDark, 1),
          DEFAULT: colorWithOpacity(colorSchemeRGB.onPrimaryLight, 1),
        },
        background: {
          light: colorWithOpacity(colorSchemeRGB.backgroundLight, 1),
          dark: colorWithOpacity(colorSchemeRGB.backgroundDark, 1),
          DEFAULT: colorWithOpacity(colorSchemeRGB.backgroundLight, 1),
        },
        onBackground: {
          light: colorWithOpacity(colorSchemeRGB.onBackgroundLight, 1),
          dark: colorWithOpacity(colorSchemeRGB.onBackgroundDark, 1),
          DEFAULT: colorWithOpacity(colorSchemeRGB.onBackgroundLight, 1),
        },
        surface: {
          light: colorWithOpacity(colorSchemeRGB.surfaceLight, 1),
          dark: colorWithOpacity(colorSchemeRGB.surfaceDark, 1),
          DEFAULT: colorWithOpacity(colorSchemeRGB.surfaceLight, 1),
        },
        onSurface: {
          light: colorWithOpacity(colorSchemeRGB.onSurfaceLight, 1),
          light12: colorWithOpacity(colorSchemeRGB.onSurfaceLight, 0.12),
          light38: colorWithOpacity(colorSchemeRGB.onSurfaceLight, 0.38),
          dark: colorWithOpacity(colorSchemeRGB.onSurfaceDark, 1),
          dark12: colorWithOpacity(colorSchemeRGB.onSurfaceDark, 0.12),
          dark38: colorWithOpacity(colorSchemeRGB.onSurfaceDark, 0.38),
          DEFAULT: colorWithOpacity(colorSchemeRGB.onSurfaceLight, 1),
        },
        surfaceVariant: {
          light: colorWithOpacity(colorSchemeRGB.surfaceVariantLight, 1),
          dark: colorWithOpacity(colorSchemeRGB.surfaceVariantDark, 1),
          DEFAULT: colorWithOpacity(colorSchemeRGB.surfaceVariantLight, 1),
        },
        onSurfaceVariant: {
          light: colorWithOpacity(colorSchemeRGB.onSurfaceVariantLight, 1),
          dark: colorWithOpacity(colorSchemeRGB.onSurfaceVariantDark, 1),
          DEFAULT: colorWithOpacity(colorSchemeRGB.onSurfaceVariantLight, 1),
        },
        secondary: {
          light: colorWithOpacity(colorSchemeRGB.secondaryLight, 1),
          dark: colorWithOpacity(colorSchemeRGB.secondaryDark, 1),
          DEFAULT: colorWithOpacity(colorSchemeRGB.secondaryLight, 1),
        },
        onSecondary: {
          light: colorWithOpacity(colorSchemeRGB.onSecondaryLight, 1),
          dark: colorWithOpacity(colorSchemeRGB.onSecondaryDark, 1),
          DEFAULT: colorWithOpacity(colorSchemeRGB.onSecondaryLight, 1),
        },
        secondaryContainer: {
          light: colorWithOpacity(colorSchemeRGB.secondaryContainerLight, 1),
          dark: colorWithOpacity(colorSchemeRGB.secondaryContainerDark, 1),
          DEFAULT: colorWithOpacity(colorSchemeRGB.secondaryContainerLight, 1),
        },
        onSecondaryContainer: {
          light: colorWithOpacity(colorSchemeRGB.onSecondaryContainerLight, 1),
          dark: colorWithOpacity(colorSchemeRGB.onSecondaryContainerDark, 1),
          DEFAULT: colorWithOpacity(colorSchemeRGB.onSecondaryContainerLight, 1),
        },
      },
    },
  },
  variants: {},
  plugins: [require("tailwind-scrollbar-hide")],
};
