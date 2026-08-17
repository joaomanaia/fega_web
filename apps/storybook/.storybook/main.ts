import type { StorybookConfig } from '@storybook/nextjs-vite';

import { dirname } from "path"

import { fileURLToPath } from "url"

import tailwindcss from "@tailwindcss/vite"

import path from "path"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-mcp')
  ],
  framework: getAbsolutePath('@storybook/nextjs-vite'),
  async viteFinal(config) {
    config.plugins = config.plugins || []
    config.plugins.push(tailwindcss())
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../../web/src"),
    }
    return config
  }
};
export default config;