# @tft/mechanics

Pure, deterministic Mechanics Engine. See docs/CALCULATION_RULES.md and docs/ARCHITECTURE.md §4.

- Input: `ResolvedGameData + SimulationContext` only. No DB, HTTP, Next.js, React or Node IO
  (enforced by ESLint `no-restricted-imports`).
- No `Math.random` / `Date.now` (enforced by ESLint) — results must be reproducible.
- No patch numbers hard-coded; no `if (item.name === ...)` branches.

Module layout (`src/`): `stats/`, `events/`, `damage/`, `resources/`, `shields/`, `healing/`,
`effects/`, `optimizer/`. Tests live in `tests/`. All empty until TASKS.md T0201.
