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
