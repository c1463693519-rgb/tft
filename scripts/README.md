# scripts/

Offline CLIs for the data pipeline (docs/DATA_PIPELINE.md, docs/PATCH_UPDATE_RUNBOOK.md).
Must be re-runnable against raw snapshots and produce deterministic output.

| Dir              | Purpose                                               | Starts at |
| ---------------- | ----------------------------------------------------- | --------- |
| `import-static/` | CommunityDragon snapshot download → parse → normalize | T0102     |
| `diff-patch/`    | Patch-to-patch diff report                            | T0108     |
| `regression/`    | Golden / regression gate before promoting a revision  | T0406     |

Empty placeholders for now. No network access, no Riot API.
