import {
  Theme,
  ComponentsProps,
  ComponentsOverrides,
  ComponentsVariants,
  Interpolation,
  CardPropsColorOverrides,
} from "@mui/material"
import { alpha } from "@mui/material"
import { getStateLayerColor, StateLayer } from "../utils/getStayeLayerColor"

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    filled: true
    primary: true
    tertiary: true
  }
}

interface M3Card {
  MuiCard: {
    defaultProps?: ComponentsProps["MuiCard"]
    styleOverrides?: ComponentsOverrides<Theme>["MuiCard"]
    variants?: ComponentsVariants["MuiCard"]
  }
}

export const getCard = (theme: Theme): M3Card => {
  const { palette } = theme
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          padding: "10px 6px",
        },
      },
      variants: [
        {
          props: { variant: "elevation" },
          style: {
            boxShadow: theme.shadows[1],
            backgroundColor: palette.surfaceContainerLow.main,
            transition: theme.transitions.create(
              ["background-color", "box-shadow", "border-color", "color"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
            "&:hover": {
              background: getStateLayerColor(
                StateLayer.Hover,
                palette.surfaceContainerLow.main,
                palette.primary.main
              ),
              boxShadow: theme.shadows[2],
            },
            "&:focus": {
              boxShadow: theme.shadows[1],
              background: getStateLayerColor(
                StateLayer.Focus,
                palette.surfaceContainerLow.main,
                palette.primary.main
              ),
            },
            "&:active": {
              boxShadow: theme.shadows[1],
              background: getStateLayerColor(
                StateLayer.Press,
                palette.surfaceContainerLow.main,
                palette.primary.main
              ),
            },
            "&.Mui-disabled": {
              backgroundColor: alpha(palette.surfaceContainerLow.main, 0.38),
              color: palette.surfaceVariant.main,
              boxShadow: theme.shadows[0],
            },
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            boxShadow: theme.shadows[0],
            backgroundColor: palette.surface.main,
            borderColor: palette.outline.main,
            transition: theme.transitions.create(
              ["background-color", "box-shadow", "border-color", "color"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
            "&:hover": {
              background: getStateLayerColor(
                StateLayer.Hover,
                palette.surface.main,
                palette.primary.main
              ),
              boxShadow: theme.shadows[1],
            },
            "&:focus": {
              boxShadow: theme.shadows[0],
              background: getStateLayerColor(
                StateLayer.Focus,
                palette.surface.main,
                palette.primary.main
              ),
            },
            "&:active": {
              boxShadow: theme.shadows[2],
              background: getStateLayerColor(
                StateLayer.Press,
                palette.surfaceContainerHighest.main,
                palette.primary.main
              ),
            },
            "&.Mui-disabled": {
              borderColor: alpha(palette.surfaceContainerHighest.main, 0.12),
              boxShadow: theme.shadows[0],
            },
          },
        },
        getFilledColors(
          "filled",
          theme,
          palette.surfaceContainerHighest.main,
          palette.onSurface.main
        ),
        getFilledColors("primary", theme, palette.primary.main, palette.onPrimary.main),
        getFilledColors("tertiary", theme, palette.tertiary.main, palette.onTertiary.main),
      ],
    },
  }
}

const getFilledColors = (
  variant: string,
  theme: Theme,
  containerColor: string,
  contentColor: string
): {
  props: Partial<CardPropsColorOverrides>;
  style: Interpolation<{
      theme: unknown;
  }>;
} => {
  return {
    props: { variant: variant },
    style: {
      boxShadow: theme.shadows[0],
      backgroundColor: containerColor,
      color: contentColor,
      transition: theme.transitions.create(
        ["background-color", "box-shadow", "border-color", "color"],
        {
          duration: theme.transitions.duration.short,
        }
      ),
      "&:hover": {
        background: getStateLayerColor(StateLayer.Hover, containerColor, contentColor),
        boxShadow: theme.shadows[1],
      },
      "&:focus": {
        boxShadow: theme.shadows[0],
        background: getStateLayerColor(StateLayer.Focus, containerColor, contentColor),
      },
      "&:active": {
        boxShadow: theme.shadows[1],
        background: getStateLayerColor(StateLayer.Press, containerColor, contentColor),
      },
      "&.Mui-disabled": {
        backgroundColor: alpha(containerColor, 0.38),
        color: contentColor,
        boxShadow: theme.shadows[1],
      },
    },
  }
}
