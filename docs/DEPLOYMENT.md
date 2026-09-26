# DEPLOYMENT — 本地、预览、生产

## 1. 本地开发

开发机（Windows）只运行 Node 进程，**不安装数据库，也不安装 Docker**（ADR-011）。

```text
开发机：Web / API / Worker（本机 Node 进程）   GitHub Actions（集成测试）
        │                                          │
        └──────── VPS IP:端口 直连（TLS）──────────┘
                            ▼
                 VPS：PostgreSQL、Redis
```

| 依赖 | 位置 | 说明 |
|---|---|---|
| PostgreSQL | VPS | dev / test / prod 分库、分账号 |
| Redis | VPS | 初期可选；dev / test / prod 隔离 |
| ClickHouse | 待定 | 到 Meta phase 再决定 |
| Object Storage | 早期用开发机本地目录 | 之后 S3/R2 或 VPS，待定 |

`.env` 中的 `DATABASE_URL` / `REDIS_URL` 直接写 `VPS IP:端口`，并启用 TLS（PostgreSQL `sslmode=require`，Redis 使用 `rediss://`）。访问安全要求见 `SECURITY_COMPLIANCE.md` §9。

测试策略：

- 单元测试、Golden 测试不连接数据库。
- 集成测试使用单独的测试库（`TEST_DATABASE_URL`）；CI 中通过 GitHub Secrets 提供 test 账号的连接串，直连 VPS。

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

`DATABASE_URL` / `REDIS_URL` 指向 VPS 服务（`VPS IP:端口`，启用 TLS）。每个环境（dev/test/prod）使用各自的连接串和账号。

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

PostgreSQL 在 VPS 上定期备份，且备份副本不能只保存在同一台 VPS 上。

ClickHouse Match raw 可以从 object storage 重建时，其备份优先级可低于规则库，但视成本决定。

## 7. Rollback

软件回滚：deploy previous image。

Patch 数据回滚：修改 active patch pointer。

不能通过直接 UPDATE 大量规则覆盖旧版本来“回滚”。
