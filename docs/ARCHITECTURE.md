# ARCHITECTURE — 技术架构

## 1. 总体架构

```text
                         ┌────────────────────┐
                         │      Next.js       │
                         │ Web / SSR / Charts │
                         └─────────┬──────────┘
                                   │
                         ┌─────────▼──────────┐
                         │   Application API   │
                         │  Query / Compare    │
                         └──────┬───────┬─────┘
                                │       │
             ┌──────────────────┘       └───────────────────┐
             ▼                                              ▼
┌─────────────────────────┐                    ┌────────────────────────┐
│ Mechanics Engine (TS)   │                    │ Meta Analytics Service │
│ Event Simulator         │                    │ ClickHouse Queries     │
│ Optimizer               │                    └───────────┬────────────┘
└────────────┬────────────┘                                │
             │                                              ▼
             ▼                                  ┌────────────────────────┐
┌─────────────────────────┐                     │      ClickHouse        │
│ PostgreSQL / Rule Store │                     └────────────────────────┘
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Data Ingestion Workers  │
│ CDragon / Riot / Notes  │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Object Storage Raw Data │
└─────────────────────────┘
```

## 2. 推荐技术栈

### Web

- Next.js + React
- TypeScript
- Tailwind CSS
- TanStack Query（需要时）
- ECharts / lightweight chart library

### Core Engine

第一版 TypeScript package：方便共享类型、前端本地计算和 Node 后端执行。

未来热点函数可迁移 Rust/WASM，但不作为 MVP 前置条件。

### Data / ETL

- Python 3.12+
- httpx / pydantic
- DuckDB 用于离线分析可选

### Storage

- PostgreSQL：normalized game data、rules、用户保存内容
- ClickHouse：海量 Match analytics
- Redis：热点查询/Simulation cache/限流
- S3/R2/MinIO：raw snapshots

### Job

- 简单阶段：cron + Python worker
- 后续：Temporal / Celery / queue 视复杂度引入

## 3. Monorepo 原则

Mechanics Engine 必须是独立纯逻辑 package，不能依赖 Next.js、数据库或 HTTP。

```text
apps/web
apps/api
apps/worker
packages/mechanics
packages/game-schema
packages/rules
packages/ui
packages/shared
```

## 4. Mechanics Engine 边界

Engine 输入只接收完整的 `ResolvedGameData + SimulationContext`；不在 engine 内直接查数据库。

```text
Repository/Loader
→ Build Engine Input
→ engine.simulate()
→ Pure Result
```

这样才能：

- 单元测试
- 本地运行
- WASM 化
- 重放旧 Patch
- 大规模 Optimizer 并行

## 5. Rules Runtime

规则层负责：

```text
Effect parsing
Expression evaluation
Trigger dispatch
Modifier stacking
Duration/expiry
Event scheduling
```

复杂 Champion 可以注册 plugin，但 plugin 接口受限，不允许直接访问 DB/Network。

## 6. Optimizer

Optimizer 不复制计算逻辑；只是生成 Build candidate 并多次调用 simulator。

性能策略分阶段：

1. 正确性优先，串行。
2. Memoize 不受 item 影响的 base state。
3. Worker threads / process pool。
4. 剪枝和共享前缀状态。
5. 如有必要迁移核心 loop 到 Rust。

## 7. Meta Service

Meta 查询与 simulation 分服务/模块，是因为：

- 数据更新频率不同
- 查询模式不同
- Meta 是统计，Mechanics 是 deterministic model
- 未来可独立扩容

## 8. Frontend Data Flow

Champion Lab：

```text
URL state / form state
→ POST /simulation
→ SimulationResult
→ Comparison table / charts / explanation
```

参数最好编码进 URL 或生成 share id，以便分享和复现。

## 9. Explanation Layer

不要让 LLM 决定数值结论。

推荐：

```text
SimulationResult
→ deterministic insight rules
→ human-readable explanation
```

例如：

```text
if buildB.dps > buildA.dps && enemyArmorCrossedBreakEven:
  “目标护甲提高后，Build B 的穿甲效果获得更高边际收益。”
```

LLM 后续只能作为可选语言润色层，不能更改数值。

## 10. Reliability

- Raw source 可重放。
- Patch 发布不直接覆盖 active rules，先进入 draft revision。
- Regression 全绿后才 promote active。
- 每个 simulation result 带 `engineVersion + dataRevision + rulesRevision`。

## 11. Observability

至少记录：

- simulation latency p50/p95/p99
- optimizer candidates / latency
- unknown effect count
- unsupported mechanics count
- ingestion freshness
- match ingestion errors
- data diff anomalies
- cache hit rate

## 12. Scale 路线

MVP 不需要微服务化。

建议第一阶段：

```text
Next.js + API process
Postgres
Redis optional
Python ingestion
```

真正接大规模 Riot Match 后再单独部署 ClickHouse worker 和 Analytics API。
