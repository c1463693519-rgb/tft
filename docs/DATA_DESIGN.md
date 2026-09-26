# DATA_DESIGN — 数据设计

## 1. 数据域拆分

系统数据分四层：

```text
Raw Source
→ Normalized Game Data
→ Mechanics Rules
→ Analytics / Derived Data
```

### Raw Source

原样保存 CommunityDragon、Riot Data Dragon、Patch Notes 解析结果、Riot Match API JSON，便于重放和排错。

### Normalized Game Data

稳定的 Champion / Item / Trait / Ability / Effect / Patch Schema。

### Mechanics Rules

公式、stacking、event priority、特殊资源系统等可执行规则。

### Derived

DPS cache、Optimizer 结果、Meta 聚合、Patch diff。

## 2. Source of Truth

| 数据 | 主来源 | 辅助来源 |
|---|---|---|
| Champion/Item/Trait 静态数据 | CommunityDragon | Riot Data Dragon |
| Patch 变化 | Riot Patch Notes | 数据 diff |
| 隐藏机制/顺序 | Controlled Test | 社区资料 |
| Match 大数据 | Riot TFT API | 无 |
| 文案/图标 | CommunityDragon/Data Dragon | CDN |

不应存在“一个来源覆盖全部需求”的假设。

## 3. Patch Revision

Patch 是一等实体，而不是字符串字段。

```text
Patch
- id
- game_version         18.3
- hotfix               B/null
- set_number           18
- released_at
- data_revision
- mechanics_revision
- status               draft/active/archived
```

任何 normalized record 都必须关联 patch revision。

## 4. Champion Model

```text
Champion
- id                    internal stable id
- api_name
- name_key
- cost
- role_damage_type
- role_team_type
- icon_asset

ChampionPatch
- champion_id
- patch_id
- hp_1/2/3
- ad_1/2/3
- attack_speed
- armor
- mr
- crit_chance
- attack_range
- start_mana
- max_mana
- mana_regen
- ability_id
- raw_source_ref
```

如果源数据只给 base + star multiplier，则 normalized 层可计算并持久化每星级值，但必须保留 derivation metadata。

## 5. Ability Model

Ability 不应该只存 tooltip HTML。

```text
Ability
- id
- champion_id
- name
- description_raw

AbilityPatch
- ability_id
- patch_id
- cast_time
- mana_lock
- projectile_type
- projectile_speed
- channel_duration
- targeting_model
- support_level
```

效果拆到 `EffectDefinition`。

## 6. Item Model

```text
Item
- id
- api_name
- category             component/completed/radiant/artifact/etc
- icon_asset

ItemPatch
- item_id
- patch_id
- enabled
- tooltip
- support_level
```

基础属性和效果均使用 Effect/Modifier 表示，避免 item 表拥有几十列版本相关字段。

## 7. Trait Model

```text
Trait
- id
- api_name
- name

TraitPatch
- trait_id
- patch_id
- tooltip

TraitBreakpoint
- trait_patch_id
- min_units
- max_units
- level_index
```

每个 breakpoint 关联 effects。

## 8. Effect Definition

推荐 Schema：

```json
{
  "id": "item.example.on_attack_as",
  "patch_id": "18.3-B",
  "owner_type": "ITEM",
  "owner_id": "example",
  "trigger": {"type":"ON_ATTACK"},
  "conditions": [],
  "actions": [{
    "type":"STAT_MODIFIER",
    "stat":"ATTACK_SPEED",
    "operation":"ADD_PERCENT",
    "value":{"literal":0.05}
  }],
  "stacking": {"mode":"ADD","max":20},
  "duration":{"type":"COMBAT"},
  "verification_status":"VERIFIED_DATA",
  "source_refs":["src:communitydragon:..."]
}
```

## 9. Expressions

Value 不能只允许 number，需要表达式 AST：

```text
Literal
StatRef
StarValue
Add
Multiply
Min
Max
TargetMaxHP
MissingHP
StackCount
TimeSinceCombatStart
```

例如 300% AD + 80% AP：

```json
{
  "op":"ADD",
  "args":[
    {"op":"MUL","args":[3.0,{"stat":"AD"}]},
    {"op":"MUL","args":[0.8,{"stat":"AP"}]}
  ]
}
```

## 10. Verification Metadata

任何规则/Effect：

```text
verification_status
source_refs[]
verified_patch
verified_at
verified_by
notes
```

## 11. Raw Data Retention

原始静态包、解析后的 JSON 和 Match payload 不立即删除。

建议：

```text
object-storage/
  raw/communitydragon/{patch}/...
  raw/ddragon/{patch}/...
  raw/patch-notes/{patch}/...
  raw/riot-match/{region}/{date}/...
```

生产数据库只保存 normalized / indexed fields。

## 12. Match Analytics Model

ClickHouse fact 表尽量保持事件/participant 粒度，不把所有聚合结果永久写成业务表。

常用维度：

```text
patch
region
queue
rank_tier
match_id
player_id_hash
placement
champion_id
star_level
item_1/2/3
traits
augments
stage/elimination
```

需要防止同一 match 重复 ingestion。

## 13. Meta 统计口径

所有指标必须定义 denominator。

示例：

```text
Champion Play Rate = 含该 Champion 的参与者数 / 筛选范围总参与者数
Item Triple Usage = 该三件组合出现次数 / 该 Champion 达到指定筛选条件的局数
Top4 Rate = placement <= 4 / sample_count
Win Rate = placement == 1 / sample_count
Avg Placement = SUM(placement) / sample_count
```

UI 必须显示 sample count。

## 14. Derived Simulation Cache

Cache key 必须包含所有会影响结果的字段：

```text
patch_revision
engine_version
champion
star
trait_state
items(sorted with multiplicity)
enemy_profile
duration
rng_mode
```

Engine 版本变化后旧 cache 自动失效。

## 15. Data Lineage

任意 UI 数值应可以追到：

```text
Displayed Value
→ normalized record / simulation result
→ rule/effect revision
→ source reference
```

这是项目可信度的关键。
