# TFT Mechanics & Data Platform

Monorepo for the TFT Mechanics Engine, Build Optimizer and Meta Statistics.
Product and engineering specs live in [`docs/`](docs/README.md); agent rules in [`AGENTS.md`](AGENTS.md).

## Requirements

- Node.js 24 (`.nvmrc`)
- pnpm 12 (`packageManager` in `package.json`; `corepack enable` works)

## Commands

```sh
pnpm install
pnpm lint          # ESLint (incl. engine purity rules)
pnpm format:check  # Prettier
pnpm typecheck     # tsc across all packages
pnpm build         # builds packages in dependency order, then apps
pnpm test          # Vitest
pnpm verify        # all of the above, as run in CI
pnpm --filter @tft/web dev
```

## Layout

```text
apps/web            Next.js UI (presentation only)
apps/api            application/query API (placeholder)
apps/worker         ingestion / meta jobs (placeholder)
packages/game-schema  Champion/Item/Trait/Effect/Patch types
packages/mechanics    pure combat simulator
packages/rules        patch-aware rules + loaders
packages/data-access  repositories
packages/shared       generic utils
packages/ui           design-system components
data/               fixtures / golden / schemas (explicit patch revisions only)
scripts/            import-static / diff-patch / regression
infra/              vps (PostgreSQL/Redis notes) / migrations
```

Workspace packages expose an `@tft/source` export condition pointing at `src/`, so typecheck and
tests run against source; `pnpm build` emits `dist/` used at runtime.

Copy `.env.example` to `.env` for local settings. Never commit secrets.
