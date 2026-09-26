# infra/

- `vps/` — setup notes for PostgreSQL and Redis on the project VPS. No Docker and no local
  database on the dev machine (docs/DECISIONS.md ADR-011, docs/DEPLOYMENT.md §1).
  Never commit hostnames, passwords or keys here.
- `migrations/` — software schema migrations only. Never one migration per Riot patch
  (docs/DATABASE_SCHEMA.md §8).

Empty placeholders for now.
