# Cluedo Solver

A multilingual Cluedo notebook built with TanStack Start and prepared for Cloudflare Workers deployment.

The app focuses on the part of Cluedo that players actually need help with during a match: setup, notebook tracking, and suggestion history. It already supports English, Italian, and German, and it is structured so deduction logic can be added on top of the same game state next.

## Highlights

- Create a game with validated player count, player names, and seat selection
- Track the full classic Cluedo deck in a grouped notebook table
- Log suggestions and who disproved them
- Persist notebooks locally between sessions
- Switch between `en`, `it`, and `de`
- Server-rendered TanStack Start app ready for Cloudflare Workers

## Tech Stack

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Form
- TanStack Table
- Zod
- i18next + react-i18next
- Tailwind CSS v4
- shadcn/ui
- Cloudflare Workers + Wrangler

## Product Scope

This version is intentionally focused on the core workflow:

1. Start a new game
2. Enter the players
3. Mark notebook cells as known, impossible, or unknown
4. Record each suggestion

The automatic deduction engine is the next major milestone. The domain model and stored suggestion history are already in place for that work.

## Local Development

Requirements:

- Node.js 22+
- pnpm 10.32.1

Install and run:

```bash
pnpm install
pnpm dev
```

Useful scripts:

```bash
pnpm run typecheck
pnpm run build
pnpm run deploy
pnpm run storybook
```

## Cloudflare Deployment

The project is configured for Cloudflare Workers with Wrangler in [wrangler.jsonc](./wrangler.jsonc).

Manual deployment:

```bash
pnpm install
pnpm run typecheck
pnpm run build
pnpm exec wrangler login
pnpm run deploy
```

Notes:

- The Worker name is currently set to `cluedo-solver`
- Update `wrangler.jsonc` if you want a different Worker name
- Attach a custom domain from the Cloudflare dashboard after the first deploy if needed

## GitHub Actions Deployment

The repository now includes a deploy workflow in [cloudflare-deploy.yml](./.github/workflows/cloudflare-deploy.yml).

What it does:

- Runs TypeScript typechecking
- Builds the production app
- Deploys to Cloudflare on pushes to `main`

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Once those secrets are set, every push to `main` is deployment-ready.

## Project Structure

```text
src
├── components
│   ├── game
│   └── ui
├── lib
│   ├── cluedo
│   └── i18n
├── routes
└── stores
```

## Roadmap

- Implement deduction rules from notebook and suggestion history
- Add stronger automated tests around the notebook and suggestion flow
- Improve shareability and export options for saved notebooks
- Add a public deployed URL to this README once the Cloudflare Worker is live

## Why This Repo Exists

This repository is meant to be a focused frontend/full-stack showcase:

- a clear domain model
- practical UI state management
- multilingual product thinking
- deployment-ready infrastructure

It is intentionally small enough to understand quickly, but structured enough to grow into a complete deduction assistant.
