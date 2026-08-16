import { fileURLToPath } from "url"
import { includeIgnoreFile } from "@eslint/compat"
import pluginQuery from "@tanstack/eslint-plugin-query"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier/flat"
import eslintPluginZod from "eslint-plugin-zod"
import { defineConfig, globalIgnores } from "eslint/config"

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url))

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  ...pluginQuery.configs["flat/recommended"],
  eslintPluginZod.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/jsx-no-literals": "error",
      "no-restricted-imports": [
        "error",
        {
          name: "next/link",
          message: "Please import from `@/components/link` instead.",
        },
        {
          name: "next/navigation",
          importNames: ["redirect", "permanentRedirect", "useRouter", "usePathname"],
          message: "Please import from `@/i18n/navigation` instead.",
        },
      ],
    },
  },
  {
    files: ["**/(admin)/**/*"],
    rules: {
      "react/jsx-no-literals": "off",
    },
  },
  // Ignore the files included in the .gitignore file
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "**/.well-known/**"]),
  // Ignore the files included in the .gitignore file
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
])
