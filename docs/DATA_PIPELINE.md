# DATA_PIPELINE — 数据同步与 ETL

## 1. Static Pipeline

```text
Discover Patch
→ Download CommunityDragon snapshot
→ Download/inspect Riot Data Dragon
→ Parse
→ Normalize
→ Validate schema
→ Diff previous patch
→ Create draft Patch revision
→ Mechanics review
→ Regression
→ Promote active
```

## 2. CommunityDragon

作为静态数据主要来源，但 ingestion 必须保存：

- source URL
- retrieved_at
- content hash
- raw snapshot location
- parser version

任何 parser 变化都可以对 raw snapshot 重放。

## 3. Riot Data Dragon

用于 assets/localization/cross-check；由于官方说明其 TFT 更新是人工流程，不应作为“Patch 刚上线就一定最新”的唯一来源。

## 4. Patch Notes

Patch Notes 不是结构化 Source of Truth，但非常适合：

- diff expectation
- system rule changes
- bugfix / behavior changes
- B Patch hotfix

Pipeline 应保存原文 snapshot，并允许人工把变化关联到 rule/effect。

## 5. Static Validation

自动检查：

- ID 唯一
- 引用完整
- star values 数量合理
- 无 NaN/null 异常
- item effects 可解析比例
- 新出现字段
- 消失字段
- 大幅数值异常

## 6. Diff Report

每次 Patch 输出：

```text
Champions added/removed/changed
Items changed
Traits changed
Ability effect variables changed
Unknown schema fields
Unsupported effects
```

## 7. Match Pipeline

Riot API 流：

```text
Seed players / leagues
→ get match IDs
→ fetch matches
→ raw object storage
→ idempotent normalize
→ ClickHouse
→ aggregation/cache
```

必须遵守 API key rate limits 和 Riot 产品政策。

## 8. Match Quality Filters

聚合前明确：

- queue type
- patch
- region
- rank tier
- remakes/abnormal games
- minimum game duration（如需要）

所有 UI 指标必须能回溯过滤条件。

## 9. Data Freshness

UI Meta 模块显示：

```text
Last updated
Latest match timestamp
Sample count
```

若 ingestion 延迟，不要伪装实时。

## 10. Backfill

Patch 发布后可以按地区并行 backfill；旧 patch 进入 immutable/archived 状态。

## 11. CN/Tencent

Riot 公开 Developer API 当前没有中国大陆平台路由。国服数据源属于独立研究，不通过非授权抓取直接混进主数据管线。
