# data/

Version-controlled data used by tests and the pipeline. **Every fixture must declare an explicit
patch revision** (e.g. `18.3-B.1`). A file named `current.json` is forbidden (AGENTS.md §10).

| Dir         | Purpose                                                                         |
| ----------- | ------------------------------------------------------------------------------- |
| `fixtures/` | Raw/normalized input fixtures for parsers and engine tests, per patch revision. |
| `golden/`   | Golden Champion snapshots. Changes must be explained, never bulk-accepted.      |
| `schemas/`  | Generated JSON Schemas (source of truth lives in `packages/game-schema`).       |

Nothing here yet — static data import starts at TASKS.md Phase 1 (T0101–T0108).
