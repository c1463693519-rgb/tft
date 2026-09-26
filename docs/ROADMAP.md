# ROADMAP

## Phase 0 — Foundation

目标：仓库、schema、CI 和数据源能重放。

退出条件：能从指定 Patch 生成 normalized package。

## Phase 1 — Mechanics Foundation

目标：完成属性、伤害、暴击、Mana、Shield、Heal、Effect Runtime。

退出条件：synthetic unit golden tests 稳定。

## Phase 2 — Champion Lab Alpha

目标：4 个代表棋子可计算，提供 Build Compare。

产品价值第一次成立。

## Phase 3 — Tank / Survivability

目标：EHP + TTD + marginal defense optimizer。

## Phase 4 — Build Optimizer

目标：自动枚举三件装备，提供场景化 Top Builds、parameter sweep 和 break-even。

## Phase 5 — Static Coverage Expansion

目标：扩大当前 Set 的 Champion/Item/Trait 支持比例；减少 custom plugins。

## Phase 6 — Meta Statistics

目标：Riot Match 数据管线、ClickHouse、真实装备统计。

## Phase 7 — Theory vs Meta

目标：把理论结果与观测统计并排展示，并解释差异边界。

## Phase 8 — Advanced Combat（长期）

可能包括：

- multiple units
- targeting
- hex positioning
- pathing
- CC
- AOE geometry
- summon AI
- full combat replay

这一阶段与 MVP 严格隔离，避免项目早期失控。
