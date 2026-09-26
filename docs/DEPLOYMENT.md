# DEPLOYMENT — 本地、预览、生产

## 1. 本地 MVP

推荐 Docker Compose 只启动基础依赖：

```text
PostgreSQL
Redis (optional initially)
ClickHouse (到 Meta phase 再开启)
MinIO (可选；开发早期可用本地目录)
```

Web/API/Worker 使用本地进程，方便调试。

## 2. Preview

每个 PR：

- Web preview
- 使用固定 fixture data revision
- 不触发真实 Riot 大规模 ingestion

## 3. Production MVP

可从简单拓扑开始：

```text
Reverse Proxy/CDN
→ Web/API
→ Postgres
→ Redis
Worker separately
Object Storage external
```

接入 Meta 后：

```text
Analytics API
→ ClickHouse
```

## 4. Environment

```text
DATABASE_URL
REDIS_URL
CLICKHOUSE_URL
OBJECT_STORAGE_*
RIOT_API_KEY
ACTIVE_PATCH_REVISION
```

不要通过环境变量写 Mechanics 数值。

## 5. Release

软件 release 和游戏 Patch release 解耦：

```text
engine version
app version
data revision
rules revision
```

四者都应出现在 diagnostics/about 页面。

## 6. Backup

必须备份：

- Postgres rules/verification metadata
- raw source object storage
- manual test evidence

ClickHouse Match raw 可以从 object storage 重建时，其备份优先级可低于规则库，但视成本决定。

## 7. Rollback

软件回滚：deploy previous image。

Patch 数据回滚：修改 active patch pointer。

不能通过直接 UPDATE 大量规则覆盖旧版本来“回滚”。
