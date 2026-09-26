# DECISIONS — Architecture Decision Records

## ADR-001：静态数据以 CommunityDragon 为主、Riot Data Dragon 为辅助

**Status**：Accepted  
**Reason**：TFT Data Dragon 官方说明为人工更新流程，Patch 后可能延迟；CommunityDragon 更适合作为高频结构化游戏数据入口。  
**Consequence**：必须保留多源 diff 和 source lineage。

## ADR-002：Mechanics 与 Meta 严格分离

**Status**：Accepted  
**Reason**：一个是规则模型，一个是观测数据；混合会产生因果误导。  
**Consequence**：两个模块可以在 UI 合并展示，但不互相修改核心值。

## ADR-003：MVP 使用 Event-driven Simulation

**Status**：Accepted  
**Reason**：攻速变化、Mana、周期效果和施法是离散事件，固定 tick 更浪费且难保证事件边界。  
**Consequence**：必须设计同 timestamp event priority。

## ADR-004：Mechanics Engine 首版 TypeScript

**Status**：Accepted  
**Reason**：迭代快、共享类型、容易前后端复用。  
**Rejected now**：直接 Rust/C++。  
**Revisit**：Optimizer profiler 证明 TS 是主要瓶颈时。

## ADR-005：Effect DSL 优先、Champion custom plugin 兜底

**Status**：Accepted  
**Reason**：避免数百个 item/champion if/else，同时承认 TFT 存在不可泛化机制。

## ADR-006：PostgreSQL + ClickHouse 分工

**Status**：Accepted  
**Reason**：规则和版本数据是关系/事务型；海量 Match 是列式聚合型。

## ADR-007：B Patch 创建新 Revision

**Status**：Accepted  
**Reason**：历史计算和分享链接必须可复现。

## ADR-008：默认使用 Expected RNG

**Status**：Accepted  
**Reason**：Build Compare 应稳定且公平；随机模式作为高级分布分析。

## ADR-009：不设计“综合神秘评分”作为 MVP 核心

**Status**：Accepted  
**Reason**：DPS、TTD、EHP、First Cast 可解释且容易验证；综合评分容易隐藏主观权重。

## ADR-010：解释层不允许 LLM 改写数值结论

**Status**：Accepted  
**Reason**：数值结论必须来自确定性引擎；LLM 最多做语言组织。

## ADR-011：PostgreSQL / Redis 由自有 VPS 提供，开发机不安装数据库和 Docker

**Status**：Accepted（2026-09-27）  
**Context**：开发机为 Windows，不希望在本机安装数据库或 Docker。  
**Decision**：PostgreSQL 和 Redis 部署在项目所有者的 VPS 上；Web/API/Worker 在开发机以本机 Node 进程运行，远程连接 VPS。  
**Consequence**：

- 取代 `DEPLOYMENT.md` 原“本地 Docker Compose 启动依赖”的建议。
- 开发机和 CI 通过 `VPS IP:端口` 直连 PostgreSQL / Redis，不使用 SSH 隧道。
- GitHub Actions runner 的 IP 不固定，无法使用 IP 白名单，因此端口对公网开放；安全依靠 TLS + 强认证 + 最小权限，要求见 `SECURITY_COMPLIANCE.md` §9。
- dev / test / prod 分库、分账号，互不共用。CI 只持有 test 账号（存放于 GitHub Secrets），该账号只能访问测试库。
- 单元测试和 Golden 测试仍不依赖数据库（保持确定性、可离线运行）；依赖数据库的集成测试使用 `TEST_DATABASE_URL`，可在 CI 中直连 VPS 测试库。
- Mechanics Engine 不受影响（纯函数、不查库，见 ARCHITECTURE §4）。
- 风险：公网端口会持续被扫描和暴力破解，Redis 公网暴露的风险尤其高；开发时数据库查询存在网络延迟；VPS 不可用时，依赖数据库的开发工作和集成测试会受阻。

**Not decided**：ClickHouse（Meta phase）和 Object Storage 的部署位置。  
**Revisit**：发现异常登录或攻击迹象时；生产上线前（评估 prod 数据库关闭公网访问）；VPS 可用性影响开发时。
