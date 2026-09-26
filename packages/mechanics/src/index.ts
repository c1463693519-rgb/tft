/**
 * @tft/mechanics — Mechanics Engine.
 *
 * Pure and deterministic: input is `ResolvedGameData + SimulationContext` only; this package
 * must never import DB/HTTP/UI code (docs/ARCHITECTURE.md §3–4, enforced by ESLint).
 *
 * No combat rules are implemented yet. Mechanics Core starts at TASKS.md T0201.
 */

/** Stamped on every SimulationResult together with dataRevision + rulesRevision. Keep in sync with package.json. */
export const ENGINE_VERSION = '0.0.0';
