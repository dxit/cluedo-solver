# Cluedo Solver

[![Live Demo](https://img.shields.io/badge/live-demo-173A40?style=for-the-badge&logo=cloudflare&logoColor=white)](https://cluedo-solver.danieledematteo.workers.dev/)
[![Verify and Deploy](https://img.shields.io/github/actions/workflow/status/dxit/cluedo-solver/cloudflare-deploy.yml?branch=main&style=for-the-badge&label=verify%20%26%20deploy)](https://github.com/dxit/cluedo-solver/actions/workflows/cloudflare-deploy.yml)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/workers/)
[![i18n](https://img.shields.io/badge/i18n-en%20%7C%20it%20%7C%20de-2F6A4A?style=for-the-badge)](https://cluedo-solver.danieledematteo.workers.dev/)

![Cluedo Solver cover image](./.github/assets/cover-image.png)

A multilingual Cluedo notebook built with TanStack Start and deployed on Cloudflare Workers.

Cluedo Solver focuses on the part of the board game that benefits most from software: setting up a table quickly, tracking a notebook clearly, logging suggestions turn by turn, and preparing the game state for automatic deduction.

Live app: [cluedo-solver.danieledematteo.workers.dev](https://cluedo-solver.danieledematteo.workers.dev/)

## At a Glance

- Validated game setup with player count, player names, and seat selection
- Grouped notebook table for suspects, weapons, and rooms
- Suggestion history with disprover tracking
- English, Italian, and German localization
- Local persistence for saved notebooks
- Installable PWA with offline fallback
- Cloudflare Workers deployment with GitHub Actions verification

## Why This Project Works as a Showcase

- Clear domain modeling for cards, players, notebook state, and suggestions
- Product thinking beyond CRUD: multilingual UX, responsive UI, and installability
- Practical frontend architecture with TanStack Router, Form, and Table working together
- Deployment-ready setup instead of a local-only demo

## Current Product Scope

This version is intentionally focused on the core gameplay workflow:

1. Start a new game
2. Enter everyone at the table
3. Track notebook cells as known, impossible, or unknown
4. Record each suggestion and who disproved it

The app already stores the information needed for a proper solver layer. The next major milestone is automatic deduction.

## Automatic Deduction Engine

The deduction engine is planned as a rule-based layer on top of the current notebook and suggestion history.

Planned responsibilities:

- infer that a disproving player owns one of the three suggested cards
- mark intermediate players as impossible owners when they could not disprove
- detect when a card must be in the envelope
- turn notebook observations into stronger ownership conclusions

Planned flow:

1. Store every suggestion as structured game data
2. Convert each suggestion into deduction constraints
3. Re-run deduction after notebook or suggestion updates
4. Feed conclusions back into the notebook view

Example:

- If Alice suggests `Green`, `Rope`, `Study` and Bob disproves, Bob must own at least one of those three cards
- If Carol and Dan sit between Alice and Bob and neither can disprove, they cannot own any of those three cards
- If every player is ruled out for a card, that card belongs to the envelope

The key design goal is explainability. Manual notes stay visible, and the solver should feel transparent rather than magical.

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

## Run Locally

Requirements:

- Node.js 22+
- pnpm 10.32.1

Install and start the app:

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

## Deploy

The project is configured for Cloudflare Workers in [wrangler.jsonc](./wrangler.jsonc).

Manual deployment:

```bash
pnpm install
pnpm run typecheck
pnpm run build
pnpm exec wrangler login
pnpm run deploy
```

GitHub Actions:

- verifies TypeScript and production builds on pull requests
- deploys to Cloudflare on pushes to `main`
- expects `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets

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

- Implement the first deduction pass from suggestion history
- Add stronger automated tests around notebook and suggestion flows
- Improve shareability and export options for saved notebooks
- Add richer solver explanations in the UI once deductions are computed
