# API_SPEC — Application API v1

> HTTP JSON API；内部 Engine package 不依赖 HTTP。

## 1. Conventions

Base：`/api/v1`

所有结果包含：

```json
{
  "dataRevision": "18.3-B.1",
  "rulesRevision": "2026-09-27.1",
  "engineVersion": "0.1.0"
}
```

错误：

```json
{
  "error": {
    "code": "UNSUPPORTED_MECHANIC",
    "message": "...",
    "details": {}
  }
}
```

## 2. GET /patches

返回可用 patch revisions 和 active patch。

## 3. GET /champions

Query：`patch`, `search`, `cost`, `trait`, `role`。

返回用于列表页的 compact records。

## 4. GET /champions/:id

返回 normalized stats、ability summary、traits、support level、source metadata。

## 5. GET /items

Query：`patch`, `category`, `search`。

## 6. GET /traits

Query：`patch`。

## 7. POST /simulation

Request：

```json
{
  "patchRevision": "18.3-B.1",
  "championId": "TFT18_Example",
  "starLevel": 2,
  "traits": [{"traitId":"TFT18_X","level":4}],
  "items": ["item_a","item_b","item_c"],
  "enemy": {"hp":3000,"armor":100,"mr":100},
  "durationSec": 10,
  "rngMode": "EXPECTED",
  "includeTimeline": false
}
```

Response：

```json
{
  "result": {
    "totalDamage": 13390.4,
    "dps": 1339.04,
    "breakdown": {
      "basicAttack": 8120,
      "ability": 4720,
      "item": 550
    },
    "damageTypes": {
      "physical": 9000,
      "magic": 4390.4,
      "true": 0
    },
    "attacksExpected": 12.4,
    "casts": 2,
    "firstCastTime": 4.31
  },
  "accuracy": {
    "level": "HIGH",
    "approximateRules": [],
    "unsupportedRules": []
  }
}
```

## 8. POST /compare

输入 `sharedContext + builds[]`，后端强制所有 Build 使用相同 context。

Response 附 `deltaVsBaseline`。

## 9. POST /sweep

Request：

```json
{
  "context": {...},
  "builds": [...],
  "parameter": "enemy.armor",
  "values": [0,25,50,75,100,125,150,200,250,300]
}
```

返回每个点的 metric 和可选 break-even crossings。

## 10. POST /optimizer

```json
{
  "context": {...},
  "metric": "DPS_10S",
  "itemPool": "STANDARD_COMPLETED",
  "lockedItems": ["item_a"],
  "limit": 20
}
```

服务端设置 candidate 上限、防滥用 rate limit。

## 11. POST /tank/simulation

EnemyProfile 支持：

```json
{
  "physicalDps": 700,
  "magicDps": 400,
  "trueDps": 50,
  "durationSec": 30
}
```

返回 EHP/TTD/heal/shield。

## 12. GET /meta/champion/:id

Filters：patch, region, rank, star, items, trait。

返回统计 + sample size + query freshness。

## 13. GET /meta/item/:id

返回 usage 和与 Champion 的关联聚合。

## 14. GET /sources/:entityType/:id

用于高级 UI 展示数据 lineage。

## 15. Admin APIs

生产 Admin 独立 auth：

```text
POST /admin/import/static
POST /admin/patch/:id/diff
POST /admin/patch/:id/regression
POST /admin/patch/:id/promote
```

普通公网 API 不开放原始 source secrets。
