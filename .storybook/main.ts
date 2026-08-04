// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import path, { dirname } from "path";
import type { StorybookConfig } from "@storybook/nextjs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ["../**/stories/**/*.mdx", "../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@chromatic-com/storybook",
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
    "storybook-next-intl",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    if (!config.resolve) {
      return config
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../"),
    }

    return config
  },
  features: {
    experimentalRSC: true,
  },
}

export default config
