# TFT Mechanics & Data Platform — 项目文档总览

> 文档版本：v0.1  
> 基准日期：2026-09-27  
> 当前参考环境：TFT Set 18 — Enchanted Wilds，Patch 18.3（含 2026-09-24 B Patch）  
> 项目类型：TFT 数据分析 + Mechanics Engine + Build Optimizer + Meta Statistics

## 1. 项目一句话定义

这是一个不仅告诉玩家“大家在出什么装备”，还能够计算“为什么这套装备更强、理论上强多少、在什么敌方属性和羁绊环境下会发生最优解变化”的云顶之弈分析平台。

核心产品能力：

1. **TFT Database**：棋子、装备、羁绊、技能、版本变更的结构化数据库。
2. **Mechanics Engine**：把伤害、暴击、攻速、回蓝、护盾、治疗、双抗、穿透、增伤等游戏规则变成可执行模型。
3. **Build Optimizer**：枚举合法装备组合，按 DPS、Burst、EHP、TTD 等指标寻找指定场景下的最优装备。
4. **Meta Statistics**：通过 Riot TFT Match API 聚合真实对局，展示出场率、平均名次、Top4、登顶率、样本量等。
5. **Theory vs Meta**：把理论计算和真实大数据放到一起解释，而不是互相替代。

## 2. 推荐开发顺序

```text
Static Data Import
      ↓
Normalized Schema
      ↓
Mechanics Registry
      ↓
Single-target Combat Simulator
      ↓
Champion Lab
      ↓
Build Comparison
      ↓
Tank / TTD
      ↓
Build Optimizer
      ↓
Riot Match Pipeline
      ↓
Theory vs Meta
      ↓
Advanced Teamfight Simulation
```

第一阶段不要先做阵容榜、战绩查询、登录、社区或 AI 聊天。先证明“计算引擎能正确工作”。

## 3. 文档目录

| 文件 | 用途 |
|---|---|
| `PRD.md` | 产品定位、目标用户、核心功能、MVP 和验收标准 |
| `CALCULATION_RULES.md` | Mechanics Engine 的规则、公式、事件和验证体系 |
| `DATA_DESIGN.md` | 数据来源、规范化模型、版本隔离、实体关系 |
| `ARCHITECTURE.md` | 系统模块、服务边界、技术栈和请求流 |
| `UI_UX_SPEC.md` | 信息架构、页面结构、交互原则、可解释性设计 |
| `WIREFRAMES.md` | Champion Lab、棋子页、装备页、Meta 页的低保真线框 |
| `API_SPEC.md` | 前后端 API 契约、输入输出、错误模型 |
| `DATABASE_SCHEMA.md` | PostgreSQL / ClickHouse / Redis 数据结构建议 |
| `DATA_PIPELINE.md` | CommunityDragon、Riot API、Patch Notes 的同步与 ETL |
| `TESTING_STRATEGY.md` | 单元测试、Golden Test、回归、数值验证和性能测试 |
| `PATCH_UPDATE_RUNBOOK.md` | 每个版本/B Patch 到来后的更新 SOP |
| `TASKS.md` | 可直接交给 Coding Agent 执行的分阶段任务 |
| `ROADMAP.md` | Phase 0~7 的产品和技术路线 |
| `DECISIONS.md` | ADR 风格的关键架构决策记录 |
| `AGENTS.md` | Codex/Claude Code/Pi 等 Agent 的项目工作规范 |
| `SECURITY_COMPLIANCE.md` | Riot API Key、安全、速率限制、产品注册、隐私边界 |
| `PRODUCT_ANALYTICS.md` | 产品埋点和核心指标，避免只看 DAU |
| `GLOSSARY.md` | 项目术语和统一命名 |
| `SOURCES.md` | 当前确认的数据源和官方参考资料 |
| `PROJECT_STRUCTURE.md` | 推荐 Monorepo 目录结构和模块所有权 |
| `DEPLOYMENT.md` | 本地、预览、生产部署建议 |

## 4. 最重要的项目约束

- **不猜机制**。未知机制必须标记 `UNKNOWN / ASSUMED / UNSUPPORTED`。
- **不把 Patch 数值写死在代码里**。赛季数据通过数据层加载。
- **Theory 和 Meta 分离**。平均名次不能进入理论 DPS 公式。
- **场景决定最优解**。项目禁止存在脱离敌方属性、羁绊、时间窗口的“绝对最优装备”。
- **版本隔离**。Patch/B Patch 必须可重现。
- **所有复杂结论可解释**。用户能看到装备提升来自 AD、攻速、穿甲、施法次数还是生存时间。

## 5. MVP Definition of Done

MVP 核心技术成立的标准：

用户选择一张 2★ ADC，设置羁绊、目标 HP/Armor/MR，装备 `羊刀 + 无尽 + 轻语`，系统可以稳定计算 5s/10s/15s 的总伤害、DPS、普攻/技能拆分、攻击次数和施法次数；将第三件换为另一件输出装后可以给出差值；再将目标 Armor 从 100 调到 200 后能重新计算，并能解释为什么带破甲效果的 Build 边际收益发生变化。

坦克方向对应的 DoD 是：给定 HP、Armor、MR、Shield/Heal、敌方物理/魔法/真实伤害构成后，能比较不同装备的 Physical EHP、Magic EHP 和 TTD。

## 6. 当前事实基线

- Riot 官方在 2026-09-22 发布 TFT 18.3，并在 2026-09-24 加入 18.3 B Patch。
- Set 18 为 Enchanted Wilds。
- Riot TFT Developer 文档说明 TFT Data Dragon 是人工更新流程，因此可能不会在 Patch 发布后立即同步。
- Riot 自 2025 K.O. Coliseum 起重做单位 Role 与 Mana 系统，Mana Regen 表示每秒回蓝，不能再把“所有棋子每次普攻 +10 Mana”作为统一规则。

详见 `SOURCES.md`。
