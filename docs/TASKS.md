# TASKS — 可执行开发任务

> 适合直接交给 Codex/Claude Code。每个任务完成时只做该任务定义的验证，避免 Agent 自行扩 scope。

## Phase 0 — Repository

### T0001 初始化 Monorepo

- pnpm workspace
- apps/web
- apps/api
- apps/worker
- packages/game-schema
- packages/mechanics
- packages/rules
- packages/shared
- lint/typecheck/test

**DoD**：`pnpm install && pnpm test && pnpm typecheck` 通过。

### T0002 基础 CI

PR 运行 typecheck/unit tests。

---

## Phase 1 — Static Data

### T0101 Patch entity + schema
### T0102 CommunityDragon snapshot downloader
### T0103 Champion parser
### T0104 Item parser
### T0105 Trait parser
### T0106 Ability/effect variable parser
### T0107 normalized JSON fixtures
### T0108 patch diff CLI

**Phase DoD**：指定 Patch 能生成 deterministic normalized package，并可和前一 Patch 输出 diff。

---

## Phase 2 — Mechanics Core

### T0201 Stat container / modifiers
### T0202 Expression AST evaluator
### T0203 Effect schema
### T0204 Trigger dispatcher
### T0205 Event priority queue
### T0206 DamageResolver physical/magic/true
### T0207 Crit expected mode
### T0208 ShieldManager
### T0209 HealManager
### T0210 Mana/resource runtime
### T0211 Stack / duration / expiry
### T0212 AccuracyReport

**DoD**：所有模块有 isolated unit tests。

---

## Phase 3 — Combat Simulator

### T0301 Unit runtime state
### T0302 Basic attack scheduler
### T0303 Cast request/start/hit lifecycle
### T0304 ability effect execution
### T0305 SimulationResult
### T0306 timeline debug output
### T0307 deterministic replay

**DoD**：四类 synthetic test unit 可完成 20s simulation。

---

## Phase 4 — Golden Champions

### T0401 选择当前 Patch 4 个代表棋子
### T0402 Marksman mapping
### T0403 Caster mapping
### T0404 Tank mapping
### T0405 Hybrid mapping
### T0406 Golden test fixtures
### T0407 manual verification notes

**DoD**：每棋子至少三套 Build，通过定义的 tolerance。

---

## Phase 5 — Web MVP

### T0501 Champion list
### T0502 Champion detail
### T0503 Item list/detail
### T0504 Trait detail
### T0505 Champion Lab input panel
### T0506 Simulation API
### T0507 Result cards
### T0508 Damage breakdown
### T0509 Build Compare
### T0510 Accuracy panel
### T0511 shareable URL state

**DoD**：PRD 的 ADC 对比验收场景完整跑通。

---

## Phase 6 — Tank

### T0601 EHP view
### T0602 Enemy DPS profile
### T0603 Tank TTD simulation
### T0604 marginal gain compare
### T0605 Tank Lab UI

---

## Phase 7 — Optimizer

### T0701 legal item pool
### T0702 combination generator
### T0703 optimizer service
### T0704 locked item mode
### T0705 Armor/MR parameter sweep
### T0706 break-even detector
### T0707 optimizer UI

---

## Phase 8 — Meta Pipeline

### T0801 Riot API client + rate limiting
### T0802 raw match storage
### T0803 idempotent match normalization
### T0804 ClickHouse schema
### T0805 champion aggregates
### T0806 item triple aggregates
### T0807 sample/confidence display
### T0808 meta API/UI

---

## Phase 9 — Theory vs Meta

### T0901 unified page model
### T0902 observational warning
### T0903 deterministic explanation rules
### T0904 share snapshot

---

## 禁止 Agent 自行提前做

- auth 系统
- 支付
- 社区
- AI chat
- 微服务拆分
- Kubernetes
- Rust rewrite
- 完整棋盘模拟

除非对应任务明确要求。
