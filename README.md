# FEGA Web

Born in **Ega, Condeixa** — built to scale to any community in Portugal and beyond.

FEGA is a local-first community platform: a shared feed, groups with realtime chat, and event discovery on a map. One place to post, coordinate, and find out what's happening nearby.

## Features

| Area                | What it does                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| **Feed / Posts**    | Create posts with images, vote, share, paginated feed, post detail pages                           |
| **Groups**          | Create and join groups, member management, search users                                            |
| **Realtime Chat**   | Group messages via Supabase Realtime, emoji picker, presence                                       |
| **Events**          | Create, list, and view events; detail pages with directions and metadata                           |
| **Event Map**       | Leaflet + MapTiler map with date-range filtering                                                   |
| **Profiles & Auth** | Supabase Auth (email/password + Google OAuth), profiles by username, editable avatar with cropping |
| **Secondary**       | News aggregation, live cameras, `en`/`pt` i18n, light/dark themes                                  |

## Stack

- **Runtime:** Bun 1.4, Next.js 16, React 19, TypeScript 5.9
- **Monorepo:** Turborepo 2.10 (workspaces: `apps/*`, `packages/*`, `catalog:`)
- **Backend:** Supabase (Postgres, Auth, Realtime, Storage), UploadThing
- **UI:** Tailwind CSS 4, shadcn-based `packages/ui`, Material color utilities
- **State & Data:** TanStack Query, Zustand, React Hook Form + Zod + next-safe-action
- **Maps & Media:** Leaflet + MapTiler, react-easy-crop, react-markdown/MDX, open-graph-scraper
- **i18n:** next-intl (`en`, `pt`), next-themes

## Project Structure

```
.
├── apps/
│   ├── web/          # Next.js app — routes, features, i18n, Supabase
│   └── storybook/    # UI documentation (packages/ui + custom components)
├── packages/
│   ├── ui/                 # Shared shadcn UI primitives
│   ├── eslint-config/      # Shared ESLint config
│   └── typescript-config/  # Shared tsconfig
├── supabase/         # Migrations, seed, config
└── CONTEXT.md        # Domain glossary
```

## Prerequisites

- **Bun 1.4.0** (`bun --version`)
- **Supabase CLI** (for local backend) or a hosted Supabase project
- Optional: MapTiler key for maps, UploadThing token for uploads

## Quick Start

```bash
# 1. Install
bun install

# 2. Environment — copy and fill
cp apps/web/.env.test apps/web/.env.local
# Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
#           SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_APP_URL
# Optional: NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_UMAMI_*, MapTiler/UploadThing keys

# 3a. With local Supabase (recommended)
supabase start
# 3b. Or point .env.local to a hosted Supabase project

# 4. Run
bun run dev        # all workspaces via Turbo
# or
bun run dev:web    # web only

# App: http://localhost:3000
# Storybook: http://localhost:6006 (bun run storybook)
```

Environment is validated at build/dev time by `apps/web/src/env.ts:1` (`@t3-oss/env-nextjs` + Zod). Missing or malformed vars fail fast with a clear error.

## Scripts

| Command                   | Description                      |
| ------------------------- | -------------------------------- |
| `bun run dev`             | Turbo dev for all workspaces     |
| `bun run dev:web`         | Web dev only                     |
| `bun run build`           | Build all workspaces             |
| `bun run build:web`       | Build web only                   |
| `bun run typecheck`       | `tsc --noEmit` across workspaces |
| `bun run lint`            | ESLint across workspaces         |
| `bun run test`            | Tests via `bun test`             |
| `bun run storybook`       | Start Storybook                  |
| `bun run build-storybook` | Build Storybook static           |

Web-specific: `apps/web` also exposes `check-i18n`, `sitemap`, and `generate-types` (Supabase type generation). See `apps/web/package.json:1`.

## Supabase

```bash
supabase start          # local Postgres + Auth + Realtime
supabase db reset       # re-apply migrations + seed (supabase/seed.sql)
bun run --cwd apps/web generate-types  # regenerates database.types.ts
```

Migrations are in `supabase/migrations/`. Realtime is enabled for group messages.

## Deployment

Vercel is the reference target. Set the same env vars as `.env.local` in the Vercel dashboard and ensure `NEXT_PUBLIC_APP_URL` matches the deployed URL. `apps/web/src/app/sitemap.ts:1` and `manifest.ts:1` derive from it.
