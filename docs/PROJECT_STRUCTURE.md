# PROJECT_STRUCTURE — 推荐代码目录

```text
tft-platform/
├─ apps/
│  ├─ web/                     # Next.js UI
│  ├─ api/                     # application/query API
│  └─ worker/                  # ingestion / meta jobs
├─ packages/
│  ├─ game-schema/             # Champion/Item/Trait/Effect types
│  ├─ mechanics/               # pure combat simulator
│  │  ├─ stats/
│  │  ├─ events/
│  │  ├─ damage/
│  │  ├─ resources/
│  │  ├─ shields/
│  │  ├─ healing/
│  │  ├─ effects/
│  │  ├─ optimizer/
│  │  └─ tests/
│  ├─ rules/                   # patch-aware rules + loaders
│  ├─ data-access/             # repositories
│  ├─ shared/                  # generic shared types/utils
│  └─ ui/                      # design-system components
├─ data/
│  ├─ fixtures/
│  ├─ golden/
│  └─ schemas/
├─ scripts/
│  ├─ import-static/
│  ├─ diff-patch/
│  └─ regression/
├─ docs/
│  └─ ...本 ZIP 文档
├─ infra/
│  ├─ vps/                    # VPS 上 PostgreSQL/Redis 的配置说明（ADR-011）
│  └─ migrations/
├─ .github/workflows/
├─ pnpm-workspace.yaml
└─ package.json
```

## 模块边界

### `game-schema`

只定义数据类型、Zod/JSON Schema；不含业务 IO。

### `mechanics`

纯函数/纯 runtime；不得 import Prisma/Next/HTTP。

### `rules`

负责 patch revision → mechanics runtime config。

### `data-access`

DB 查询、source repository；不能把数据库对象直接泄漏成 engine internal state。

### `apps/web`

表单和展示，不重新实现计算公式。

### `worker`

下载/解析/写入；必须幂等。
