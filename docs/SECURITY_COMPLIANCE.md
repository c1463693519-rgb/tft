# SECURITY_COMPLIANCE

## 1. Riot API Key

- 只在服务端 worker/API 使用。
- 不嵌入浏览器 bundle。
- `.env` 不提交仓库。
- 日志不打印完整 key。
- 支持 rotate。

## 2. Rate Limit

实现：

- per-route limiter
- retry with backoff
- 429 handling
- job queue concurrency cap

不得通过创建多 key 或规避限流的方式抓取。

## 3. Riot Product Policy

正式公开前检查并完成 Riot Developer 产品注册/审核要求。产品文案、商业化和 API 使用应遵守当时最新的 Riot Developer Policies；不要把第三方 API 当成无限制公共数据源。

## 4. User Data

MVP 不需要账号和个人资料时不要收集。

未来保存 Build：只存最小必要数据。

玩家查询如果引入 Riot ID/PUUID：

- 明确用途
- 不在分析库保存不必要的可识别信息
- ClickHouse 建议存 hash/pseudonymous ID

## 5. Admin

Patch promote、raw import、rule edit 必须是 admin-only。

## 6. Input Validation

Simulation API 限制：

- duration 上限
- optimizer item pool
- sweep points 数量
- timeline 输出大小
- build count

防止用计算接口做资源消耗攻击。

## 7. Supply Chain

- lockfile
- Dependabot/Renovate 可选
- CI 检查已知高危依赖
- parser 不执行来源中的脚本/HTML

## 8. Raw Data

对象存储 bucket 默认 private；公开 assets 使用独立 CDN path。

## 9. VPS 数据库与缓存访问

PostgreSQL / Redis 部署在 VPS 上，开发机和 CI 通过公网 `IP:端口` 直连（ADR-011）。端口对公网开放，因此以下要求是强制的。

### PostgreSQL

- 只接受 TLS 连接：`pg_hba.conf` 远程规则使用 `hostssl`；客户端 `sslmode=require`（证书可校验时用 `verify-full`）。
- 密码认证使用 `scram-sha-256`，强随机密码。
- `postgres` 超级用户禁止远程登录。
- prod 账号在 `pg_hba.conf` 中只允许本机/内网来源；公网只放行 dev / test 账号。
- dev / test / prod 分库、分账号，最小权限：应用账号不是 superuser；schema migration 使用单独账号。

### Redis

- 必须启用 ACL 用户或强密码，禁止无认证实例；保持 `protected-mode`。
- 启用 TLS（客户端使用 `rediss://`）。
- 通过 ACL 禁止应用账号使用危险命令（`CONFIG`、`FLUSHALL`、`FLUSHDB`、`DEBUG`、`MODULE`、`SCRIPT` 等）。
- 使用仍在维护的版本，及时更新安全补丁。

### 通用

- 可使用非默认端口以减少自动扫描噪音（这不是安全措施本身）。
- 监控认证失败日志，发现暴力破解及时封禁来源。
- 凭据只放在不提交的 `.env`、GitHub Secrets 和生产环境 secret 中，不写进文档或代码。CI 只持有 test 账号。
- VPS 的 SSH（运维用）使用密钥登录，禁用密码登录。
- Coding Agent 不得对 prod 数据库执行 migration 或写操作。
- 定期备份，见 `DEPLOYMENT.md` §6。
